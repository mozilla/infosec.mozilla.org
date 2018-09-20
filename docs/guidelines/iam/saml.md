---
layout: default
resource: true
categories: [Guidelines,IAM]
title: SAML
description: How to use SAML securely and make user’s session experience better
---

*The goal of this document is to help understand the basics of how to securely implement [Security Assertion Markup Language (SAML)](https://en.wikipedia.org/wiki/SAML) when authenticating and authorizing users.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide.*

**Just looking for code?** Reference configuration and code for implementing SAML as described below [is also available](https://github.com/mozilla-iam/testrp.security.allizom.org).
Additionally, Mozilla provides SAML single sign on support for Mozilla properties and [access can be requested by following documentation here](https://mana.mozilla.org/wiki/display/SECURITY/SSO+Request+Form)


# Common abbreviations & definitions

| Abbreviation       | Full and related names                                                   | Description                                                                                                                                                                                                                                                                                                                         |
|--------------------|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authentication     | *Login*                                                                  | The act of verifying a user identity, i.e. verify the user is who they say they are.                                                                                                                                                                                                                                                |
| Authorization      | *role, groups, attributes, access control list, scopes*                  | The act of granting access to specific resources (to an authenticated user, or bearer of a secret).                                                                                                                                                                                                                                 |
| SAML               | Security Assertion Markup Language                                       | A standardized identity and authorization protocol for authentication that uses XML.                                                                                                                                                                                                                                                |
| OIDC               | OpenID Connect                                                           | A standardized identity layer for authentication that uses OAuth2 (not to be confused with OpenID which only provides authentication, or pure Oauth2 which only provides authorization). While OIDC uses OAuth2 for authorization, it also leverages (some would say, abuses) OAuth2 authorization to perform authentication tasks. |
||
| SP, RP             | Service Provider, Relying Party, *client, web application, web property* | Generally a web application that wants to authenticate and eventually authorize access to data. SAML calls these SPs, OpenID Connect (OIDC) call them RPs. *For conciseness, we refer to them as relying party (SP/RP) in this document*.                                                                                           |
| IdP, OP            | Identity Provider, *OIDC Provider, authorization server*                 | Provides authentication and authorization for service providers/relying parties (SPs/RPs). It may rely on itself, or another Identity Provider (IdP) (ex: the OP provides a front-end for LDAP, WS-Federation, OIDC or SAML).                                                                                                       |
| Attributes, Scopes | *role, groups, attributes, access control list, scopes*                  | Access control information, groups, roles, attributes, etc. that are used by the relying party (SP/RP) to grant specific authorization/access permissions to a user.                                                                                                                                                                |
| SSO                | Single Sign On                                                           | A SAML or OIDC Provider (OP) and set of relying parties (SPs/RPs) that provide a unique sign-on panel for users, and that coherently handle session information for the user.                                                                                                                                                       |
| JWT                | JSON Web Tokens, *id token*                                              | Base64 encoded, optionally signed, small and self-contained JSON documents that represent a possibly signed JSON message. The JSON message contains the issuer of the token, the subject (usually owner/user of the token), how the user authenticated, and for whom the token is intended to (audience).                           |
| Tokens             | API keys, *access token*, *refresh token*                                | An opaque, unique secret string that is used to access protected resources, used by OpenID Connect (OIDC).                                                                                                                                                                                                                          |
| SCIM               | System for Cross-domain Identity Management                              | A standardized schema and API for querying and managing user identities (attributes, etc.)                                                                                                                                                                                                                                          |
| Assertion          | Security Assertion                                                       | What SAML calls an assertion is an assurance that a user as been identified or authorized. It returns an XML-formatted assertion (usually signed) that informs the relying party (SP/RP) that the user is identified and/or possess a certain list of attributes.                                                                   |

# SAML in a nutshell

See also [OpenID\_Connect Guidelines](openid_connect) to understand the OIDC flows, which are similar to SAML.

SAML (Security Assertion Markup Language) is a protocol that allow web applications (also called service providers, relying parties, or SP, RP) to authenticate users with an external server called the Identity Provider (IdP). The IdP hosts a database of user credentials and attribute information.

In Mozilla's setup, SAML is a front-end to an OpenID Connect Provider (OP). This means SAML requests are translated to OIDC requests back and forth. For the relying party (SP/RP), it looks like a regular SAML IdP, but internally everything is processed like an OIDC transaction.

The difference is that OIDC tokens are not surfaced and thus may not be directly used by a SAML relying party (SP/RP). This means all transactions must call a separate REST API directly, or use the SAML2.0 protocol directly. In particular, we recommend using the SAML passive authentication options to renew a user's session without having to logging the user back in regularly.

## Detailed SAML authentication flow

This sequence diagram is useful if you want to understand how SAML works, or need to modify a SAML library.

![SAML sequence diagram](/guidelines/assets/images/SAML_sequence_diagram.png)

# Implement authentication with SAML securely in my web applications (SP/RP)

## Session handling

The SAML IdP (or OpenID Connect Provider (OP) exposing a SAML interface) typically creates a user session cookie so that it does not need to re-ask the user for their credentials too often across different web applications (SP/RP). The expiration of the session depends on how the SAML IdP setup the session and the session may be forced to expire by the SAML IdP sooner than the cookie indicates on the user's browser. This allows the SAML IdP to forcibly log the user out from the IdP point of view. This premature termination of the user’s session with the SAML IdP will not, however, end the user’s session on the web application's (SP's/RP's) which they’ve logged into.

For that reason, it is important that the web application (SP/RP) respects the following set of rules in regards to session handling:

-   The web application (SP/RP) **must** invalidate the user session when the `SAML SubjectConfirmationData` part of the assertion reaches expiration (`NotOnOrAfter`) or sooner (the expiration time is a UTC timestamp such as `<saml:SubjectConfirmationData NotOnOrAfter="2016-12-22T00:09:09.891Z" Recipient="https://rp.example.net/saml/response"/>`).
-   If the user's complete session duration is longer than **15 minutes**, **should** re-check/update the assertion every *15 minutes* or next user request (whichever comes first), to ensure that the user is still valid and has correct permissions. This is done by authenticating with SAML2 using the `IsPassive` parameter in the `SAML AuthnRequest`.
    -   This ensures that access is revoked within *15 minutes* in the event that the user's account is disabled by the SAML IdP.
    -   This renews the assertion expiration time, and provides new attributes if they have changed.
    -   If `IsPassive` is not supported, the session may expire after 24h, after careful investigation. This setup is however not recommended and is reserved for specific exceptions.
-   The web application (SP/RP) can **optionally** provide a `logout` URL, which the SAML IdP can call to indicate if a user has logged out (so that the web application immediately know when to log the user out as well).

## Additional references

-   <https://www.oasis-open.org/committees/download.php/35711/sstc-saml-core-errata-2.0-wd-06-diff.pdf> (SAML2 Core specifications)
-   [SCIM: System for Cross domain Identity management](http://www.simplecloud.info/)
-   <https://auth0.com/docs/protocols> (Auth0 documentation)
-   [SAML2 Session expiration](https://stackoverflow.com/questions/29508906/notonorafter-in-subjectconfirmationdata-and-conditions-and-sessionnotonorafter)
-   <https://samltool.io/> (Decoder for SAML Assertions)
