---
layout: default
resource: true
categories: [Guidelines,IAM]
title: OpenID Connect
description: How to use OpenID Connect securely and make user’s session experience better
---

*The goal of this document is to help you understand the basics of how to securely implement [OpenID Connect (OIDC)](https://en.wikipedia.org/wiki/OpenID_Connect) when authenticating and authorizing users.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide.*

**Just looking for code?** Reference configuration and code for implementing OIDC as described below [is also available](https://github.com/mozilla-iam/testrp.security.allizom.org).
Additionally, Mozilla provides OIDC single sign on support for Mozilla properties and [access can be requested by following documentation here](https://mana.mozilla.org/wiki/display/SECURITY/SSO+Request+Form)

# Common abbreviations & definitions

| Abbreviation   | Full and related names                                  | Description                                                                                                                                                                                                                                                                                                                           |
|----------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authentication | *Login*                                                 | The act of verifying a user identity, i.e. verify the user is who they say they are.                                                                                                                                                                                                                                                  |
| Authorization  | *role, groups, attributes, access control list, scopes* | The act of granting access to specific resources (to an authenticated user, or bearer of a secret).                                                                                                                                                                                                                                   |
| OIDC           | OpenID Connect                                          | A standardized identity layer for authentication that uses OAuth2 (not to be confused with OpenID which only provides authentication, or pure Oauth2 which only provides authorization). While OIDC uses OAuth2 for authorization, it also leverages (some would say, *abuses*) OAuth2 authorization to perform authentication tasks. |
| OAuth2         | Open standard for access delegation.                    | A protocol that enables a user or system to authorize one resource to access data from another resource (ex: a user delegates some of their access permissions to website A, so that website A can access data from website B on behalf of the user).                                                                                 |
| RP             | Relying Party, *client, web application, web property*  | Generally a web application that wants to authenticate and eventually authorize access to data.                                                                                                                                                                                                                                       |
| OP             | OIDC Provider, *IdP, authorization server*              | Provides authentication and authorization for relying parties (RPs). It may rely on itself, another OIDC Provider (OP) or another Identity Provider (IdP) (ex: the OP provides a front-end for LDAP, WS-Federation or SAML).                                                                                                          |
| Scopes         | *role, groups, attributes, access control list, scopes* | Access control information, groups, roles, attributes, etc. that are used by the relying party (RP) to grant specific authorization/access permissions to a user.                                                                                                                                                                     |
| SSO            | Single Sign On                                          | An OIDC Provider (OP) and set of relying parties (RPs) that provide a unique sign-on panel for users, and that coherently handle session information for the user.                                                                                                                                                                    |
| JWT            | JSON Web Tokens, *id token*                             | Base64 encoded, optionally signed, small and self-contained JSON documents that represent a possibly signed JSON message. The JSON message contains the issuer of the token, the subject (usually owner/user of the token), how the user authenticated, and for whom the token is intended to (audience).                             |
| Tokens         | API keys, *access token*, *refresh token*               | An opaque, unique secret string that is used to access protected resources.                                                                                                                                                                                                                                                           |
| SCIM           | System for Cross-domain Identity Management             | A standardized schema and API for querying and managing user identities (attributes, etc.)                                                                                                                                                                                                                                            |

# OIDC in a nutshell

OpenID Connect (OIDC) is a protocol that allow web applications (also called relying parties, or RP) to authenticate users with an external server called the OpenID Connect Provider (OP). This server typically gets user information from an identity provider (IdP), which is a database of user credentials and attribute information.

The communication with the OpenID Connect Provider (OP) is done using tokens. An ID token is provided to the web application (RP) by the Open ID Connect Provider (OP) once the user has authenticated. It contains a JSON document which informs the web application (RP) about how, when the user has authenticated, various attributes, and for how long the user session can be trusted. This token can be re-newed as often as necessary by the web application (RP) to ensure that the user and it's attributes are both valid and up to date.

Other tokens can be used, though these do not pertain directly to authentication. These are also often called OAuth2 tokens. This is because OIDC is based on OAuth2 and thus also provides full OAuth2 support. These two types of OAuth2 tokens (Access Token and Refresh Tokens) enable their bearer to access information from other websites and resources (including additional user attributes that may not be passed by the ID token) - but are not required to perform user authentication.

![OIDC Diagram](/guidelines/assets/images/OIDC_diagram.png)

## OIDC tokens reference table

| Token             | Format                                                       | Description                                                                                                                                                                                                                                         |
|-------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Access token**  | A string containing a unique secret token (like an API key). | The Access token has specific permissions and is used to get data from an API. It expires quickly, typically within 24 hours.                                                                                                                       |
| **Refresh token** | A string containing a unique secret token (like an API key). | The Refresh token enables it's bearer to request and obtain new Access tokens. These newly obtained access tokens have a subset of the permissions that the Refresh token has. The Refresh token never expires.                                     |
| **ID token**      | Base64-encoded JSON document ([JWT](https://jwt.io/))        | ID tokens are created and signed by OpenID Connect Providers (OP) and consumed, verified by web applications authenticating users (RPs). The ID token contains information about how and when the user authenticated along with various attributes. |

## Detailed OIDC authentication flow

This sequence diagram is useful if you want to understand how OIDC works, or need to modify an OIDC library.

![OIDC Sequence Diagram](/guidelines/assets/images/OIDC_sequence_diagram.png)


# Implement authentication with OpenID Connect (OIDC) securely in my web applications (RP)

## Session handling

The OpenID Connect Provider (OP) typically creates a user session cookie so that it does not need to re-ask the user for their credentials too often across different web applications (RP). The expiration of the session depends on how the OP setup the session and the session may be forced to expire by the OpenID Connect Provider (OP) sooner than the cookie indicates on the user's browser. This allows the OP to forcibly log the user out from the OP point of view. This premature termination of the user’s session with the OP will not, however, end the user’s session on the web application's (RP's) which they’ve logged into.

For that reason, it is important that the web application (RP) respects the following set of rules in regards to session handling:

-   The web application (RP) **must** invalidate the user session when the ID token reaches expiration or sooner (the expiration time is generally a UNIX timestamp attribute named `exp`).
-   If the user's complete session duration is longer than **15 minutes**, **must** re-check/update the ID token every *15 minutes* or next user request (whichever comes first), to ensure that the user is still valid and has correct permissions.
    -   This ensures that access is revoked within *15 minutes* in the event that the user's account is disabled by the OpenID Connect Provider (OP).
    -   This issues a new ID token, with new attributes if they have changed.
    -   This may also renew the ID token expiration time.
    -   This is generally done with the parameter `prompt=none` while calling the OpenID Connect `authorize` endpoint. See also [specifications](https://openid.net/specs/openid-connect-implicit-1_0.html#RequestParameters).\
    - This can also be done in the back-end to avoid a round-trip in the user agent (user's web browser).


## Other important security considerations

### ID Token

-   **Always** verify the id token signature.
-   **Always** invalidate the user session when the associated ID token expires.
-   **Should** update the contents of the id token by querying the OP regularly, before the ID token expires.

### Authorization Code Grant

-   **Recommend** using the authorization code grant. The authorization code grant requires a back-end server, reverse proxy, or similar server-side code that will generate an `HttpOnly` session cookie for the user, which means the access tokens cannot be intercepted in JavaScript within the user's browser.
-   **Avoid** using implicit grants for websites when possible. Single Page Applications (SPA) use implicit grants and receive tokens back in the user's browser with no server-side component, which means it can be intercepted by malicious JavaScript running in the user's browser. If using the implicit grant **do not** store the tokens in the browser's storage (do not use localStorage). Instead, keep them in memory, which is much harder for attackers using a vulnerability in your website to steal the token.

#### Additional notes on Implicit grants
Implicit grants are inherently more dangerous and difficult to implement safely. We advocate against their usage entirely whenever possible.

Implicit grants are normally used for Single Page Applications (SPA) - these are static pages which are executed in the context of the user agent (i.e. web browser) instead of the web server. This means all data is seen and handled by the user agent and therefore the user's browser.

This can become dangerous when the SPA is vulnerable to XSS or CSRF attacks (e.g. attacks where the attacker may retrieve the user's tokens). Many SPAs tend to store the user's `id_token` in the browser localStorage as a "proof of authentication" and access tokens which are then used to query otherwise private API endpoints. **This is dangerous**. Unlike browser cookies which can be set to `HttpOnly`, localStorage can be queried in JavaScript and also through an XSS vulnerability. 

Any vulnerability in your SPA may leak the user's tokens (with functional API access) that are used by your SPA. In addition, any **other** SPA that you do not control may also leak the same tokens. These tokens, if allowed for the same APIs, can be then used to compromise your application/APIs.

Authorization code grants prevent this problem by verifying everything on the web server and preventing the user agent from accessing this data. Note that for certain websites it may be convenient to perform the authorization code grant at the API level, so that your SPA does not need to manipulate tokens.

### State parameter

When requesting authentication from the OpenID Connect provider (OP), **always** provide the state parameter.

This is a defense against [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) attacks as an attacker would need to know the state code/contents (similar to the [CSRF synchronizer token](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Prevention) used on websites)

### Refresh token

Avoid using or storing refresh tokens. This is especially important for relying parties (RP) which are websites (as opposed to mobile apps for example, which may not always have network access). Refresh tokens never expire and thus are very powerful. These are usually not needed for user authentication flows.

## Additional references

-   <https://tools.ietf.org/html/rfc7636> (Proof Key for Code Exchange by OAuth Public Clients)
-   <https://tools.ietf.org/html/rfc6749> (Oauth2 Authorization framework)
-   <https://tools.ietf.org/html/rfc7519> (JSON Web Tokens)
-   [JSON Identity Suite](https://ldapwiki.com/wiki/JSON%20Identity%20Suite)
-   <https://jwt.io/> (JWT token decoder)
-   [SCIM: System for Cross domain Identity management](http://www.simplecloud.info/)
-   <https://openid.net/> (Official documentation)
-   <https://openid.net/developers/libraries/> (OIDC integration libraries for different programming languages and tools)
-   <https://github.com/mozilla/mozilla-django-oidc/> (The django OpenID Connect library used on many Mozilla sites)
-   <https://auth0.com/docs/protocols> (Auth0 documentation)
-   <https://developer.okta.com/docs/api/resources/oidc> (Okta documentation)
-   [Authorization code grant vs Implicit grant](https://stackoverflow.com/questions/7522831/what-is-the-purpose-of-the-implicit-grant-authorization-type-in-oauth-2)
-   [OAuth2 Implicit Flow thread model](https://tools.ietf.org/html/rfc6819#section-4.4.2.1)
-   [OIDC vs OpenID vs OAuth2](https://security.stackexchange.com/questions/44611/difference-between-oauth-openid-and-openid-connect-in-very-simple-term)
-   <https://nordicapis.com/api-security-oauth-openid-connect-depth/>
- [Where to store tokens in my SPA](https://auth0.com/docs/security/store-tokens)
