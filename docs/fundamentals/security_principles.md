---
layout: default
resource: true
categories: [Fundamentals]
title: Security Principles
description: Most important security principles to follow - the baseline
---

*The goal of this document is to help operational teams agree on a basic set of principles to set expectations and give overall guidance to secure a service.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide.*


**NOTE:** The “**do**” and “**do not**” used in this document are example of controls or implementation of the principles, but do not represent an exhaustive list of possibilities.

# Least Privilege

## Do not present unnecessary services

*The act of limiting the amount of reachable or usable services to the strict minimum.*

**Do**

-   List all services presented to the network (Internet and Intranets). Justify the presence of each port or service.

**Do not**

-   OpenSSH Server (sshd) is running but no users ever login.
-   A file sharing server (samba/smbd) is running but no files are stored or exchanged on the server.
-   A web-application has a web accessible administration interface, but it is not used.
-   A database server (SQL) allows connections from any machine in the same VLAN, even though only a single machine needs to access it.
-   The administration login panel of the network switch for the office network is accessible by regular office users.

## Do not grant or retain permissions if they're not actively used

*The act of expiring user access to data or services when they are not being used by said user.*

**Do**

-   Use role-based access control (allows for easy granular escalation of privileges, only when necessary)
-   Expire access automatically when unused.
-   Automatically disable AWS API keys after not having been used for a given period of time and notify the user.
-   Use different accounts for different role types (admin, developer, user, etc.) when no good role-based access control is available.
-   Routinely review user’s access permissions to ensure they’re still needed.

**Do not**

-   Grant root access (e.g. via 'sudo') for all operation engineers on all systems, regardless of the actual services those engineers maintain.
-   Give access “just in case”.

# Defense in Depth

## Do not allow lateral movement

*Make it difficult or impossible for an attacker to move from one host in the network to another host.*

**Do**

-   Prevent inbound network access to services on a host from clients that do not need access to the service through either host-based firewall rules, network firewall rules/AWS security groups, or both (which is preferred).
-   Clearly enforce which teams have access to which set of systems.

**Do not**

-   Allow inbound OpenSSH, RDP connections from any host on any network.
-   Run unpatched container management services (e.g. Docker) or kernels which allow a user in one container to escape the container and affect other containers on the same host.

## Segment the environment

*The act of separating services from each other in order to limit the the impact of a security breach.*

**Do**

-   In cases where two distinct systems are used to govern access or authorization (e.g. Okta and Duo), ensure that no single user or role has administrative permissions across both systems.

**Do not**

-   Have system administrators with access to every system/every service.
-   Establish service users with access to multiple services.
-   Allow tools remotely executing code on systems from a centralized location (single Puppet Master, Ansible Tower, Nagios, etc. instance) across multiple services.
-   Use the same TLS termination point (e.g. an HTTP reverse proxy or a load balancer) across multiple services.
-   Re-use functionality across services when not required (such as sharing load balancers, databases, etc.)

## Patch Systems

*The act of updating software, in particular in order to deploy fixes to security vulnerabilities that are found in software over time.*

**Do**

-   Establish regular recurring maintenance windows in which to patch software.
-   Ensure individual systems can be turned off and back on without affecting service availability.
-   Enable automatic patching where possible.

## Meet Web Standards

*The act of following the Mozilla Web Standard, which covers HTTP headers, web-server setup, and [W3C](https://www.w3.org/) security features.*

**Do**

-   Achieve B+ or higher on [Mozilla's Observatory](https://observatory.mozilla.org).
-   Follow the [Web Security Guidelines](../guidelines/web_security).

## Encrypt sensitive data

*The process of converting information or data into a code to prevent unauthorized access.*

**Do**

-   Use full-disk encryption where available on systems without physical security (laptops and mobile phones).
-   Encrypt credentials storage databases (Ansible Vault, Credstash, etc.)
-   Encrypt data in transit (during transmission).
-   Also encrypt data in transit inside the internal network.

**Do not**

-   Terminate TLS (e.g. with a reverse proxy or load balancer) outside a system and then transmit the data in clear-text across the rest of the network.
-   Use STARTTLS without also disabling clear-text connections.

# Know Thy System

## Logging and forensics

*Recording events in order to alert on suspicious behavior, or to retrace actions after a security breach.*

**Do**

-   Audit and log system calls (e.g. with auditd or Windows Audit) made by processes when running in an operating system you control (e.g. not AWS Lambda)
-   Send logs off the account or system (e.g. AWS CloudTrail, system logs, etc.) outside of the account or system (different AWS account, MozDef, Papertrail, etc.)
-   Run [MIG](https://mig.ninja).

## Are you at risk?

*Assessing how exposed you are to danger, harm or loss.*

**Do**

-   Run rapid risk assessments [Security/Risk management/Rapid Risk Assessment](Security/Risk_management/Rapid_Risk_Assessment "wikilink") for your services.
-   Estimate what would happen if your service was compromised.

**Do not**

-   Think it will never happen to you.

## Inventory

*An inventory is an accurate, maintained catalog, or system of records for all assets representing service.*

**Do**

-   Keep an inventory of services and service owners.
-   Keep an inventory of machines (e.g. ServiceNow, AWS Config, Infoblox, etc.) which is updated automatically.
-   Ensure that the inventory contains IP addresses of systems in particular when using IPv6 (which cannot realistically be scanned).

## KISS - Keep It Simple and thus Secure

*KISS comes from ['Keep It Simple, Stupid'](https://en.wikipedia.org/wiki/KISS_principle). You can only secure a system that you can completely understand.*

**Do**

-   Keep things simple. Prefer simplicity over a complex and specific architecture.
-   Ensure others can understand the design.
-   Use standardized tooling that others already know how to use.
-   Draw high-level data flow diagrams.

# Authentication and authorization

## No user authentication that isn't MFA/2FA

*MFA (multi-factor authentication, also called 2FA for two-factors) is method of confirming a user's claimed identity by utilizing a combination of two different components such as something you know (password) and something you have (phone).*

*See also why: [Rationales\#mfa](rationales#mfa).*

**Do**

-   Use an SSO (Single Sign On) solution with MFA.
-   For services that can not support SSO, use the service’s individual MFA features (e.g. GitHub and Google MFA)

## No direct handling of user credentials

*Handling sensitive data like passwords is done only by the authentication provider.*

**Do**

-   Use an SSO (Single Sign On) solution that authenticates users on your service’s behalf, handling the credentials and only reporting back to the calling service if the user has or has not been authenticated.

**Do not**

-   Accept, process, transmit or store user credentials (passwords, OTPs, keys, etc.) Let the authentication server directly handle that data.
-   Use direct LDAP authentication for users.

## Centralize authentication and authorization

*The usage of a single, external source of truth for authentication and authorization.*

*See also why: [Rationales\#decentralized-user-account-management](rationales#decentralized-user-account-management).*

**Do**

-   Use an SSO (Single Sign On) solution that authenticates users on your service’s behalf.
-   Use authorization (e.g. group membership) data, that the SSO solution delivers along with authentication, instead of storing authorization data inside the service itself.

## No reuse or sharing of credentials

*Avoid using the same or similar passwords for different services. Avoid sharing passwords across different individuals.*

*See also why: [Rationales\#shared-passwords](rationales#shared-passwords), [Rationales\#password-reuse](rationales#password-reuse).*

**Do**

-   Use a password manager to store distinct passwords for each service a user accesses.
-   Use purpose-built credential sharing mechanisms when sharing is required (1password for teams, LastPass, etc.)

**Do not**

-   Send your password to other individuals.
-   Send shared passwords over email or communication mediums other than purpose-built credential sharing mechanisms.
-   Use the same password for multiple services.

## Network identity is not authentication

*The usage of network properties or IP addresses to grant access to services.*

**Do**

-   Use credential-based authentication and user session management where the session information is passed by the user (https://research.google.com/pubs/pub44860.html)
-   Use API keys for service authentication.

**Do not**

-   Trust traffic from a certain network address.
-   Rely on VLANs or AWS VPCs to indicate requests are safe.
-   Use IP ACLs as replacement for authentication.
-   Trust the office network for access to devices.
-   Use [TCP Wrapper](https://en.wikipedia.org/wiki/TCP_Wrapper) for access control.

## Machine credentials are different from user credentials

*Machines have different abilities and needs than humans regarding authentication.*

**Do**

-   Prefer using asymmetric API keys with request signing (e.g. x509 client certificates, AWS Signature) over symmetric API keys (e.g. HTTP header)
-   Ensure that API keys can be automatically rotated in the case of a data leak.

**Do not**

-   Use machine API keys for user authentication.
-   Use user credentials for machine authentication.
-   Store API keys on devices that are not physically secure (e.g. laptops or mobile phones)
-   Use MFA for machine to machine authentication.

