---
layout: default
resource: true
categories: [Guidelines]
title: AWS Security
description: Best practices for securely operating in Amazon Web Services
---

The goal of this document is to help teams operate safely within Amazon Web Services. All Mozilla AWS accounts should follow the recommendations below.

# Root User

The [root user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html) of an AWS account is the single identity that has complete access to all AWS services and resources in the account. The root user has no username, is not a part of the AWS IAM product and instead uses their Amazon email address to log in. If an attacker gains control of the root user in an AWS account, there is no higher authority role that a security incident responder can use to eradicate the attackers access. With root user access, the attacker can exploit the resources in the AWS account and infosec will have little ability to respond.

## Use a strong unique password for the root user

* How to : Generate a password with a password manager and store that password in a password manager protected by MFA or offline as it is rarely if ever needed. One way to store the MFA offline is to store it in a safe deposit box, or a similar physical safe solution. For example, Mozilla uses the infosec [security backup service](https://mana.mozilla.org/wiki/display/SECURITY/Security+backup+service)
* Audited : False
* Rationale
    - [Non-unique passwords are risky](https://wiki.mozilla.org/Security/Fundamentals#password-reuse)
    - Weak passwords can be guessed or brute forced

## Enable multi factor authentication (MFA) for the root user

* How to : [Instructions](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html#enable-virt-mfa-for-root)
* Audited : True
* Rationale
    - [MFA is an effective means of preventing unauthorized access](https://wiki.mozilla.org/Security/Fundamentals#mfa)

## Enable multi factor authentication (MFA) for non federated IAM users

* How to : [Instructions](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html#enable-virt-mfa-for-iam-user)
* Audited : False
* Rationale
    - [MFA is an effective means of preventing unauthorized access](https://wiki.mozilla.org/Security/Fundamentals#mfa)

## Avoid creating API keys for the root user

* How to : Instead of creating API keys for the root user, create them for an IAM user
* Audited : False
* Rationale
    - API keys bypass the requirement for MFA and enable an attacker to takeover an AWS account merely by compromising a computer containing the root user's API keys.
    - Virtually all actions that the root user can execute can also be executed by an IAM user, obviating the need to create API keys for the root user and use the root users permissions.

## Avoid logging in as the root user

* How to : Instead of logging in as the root user, log in as an IAM user with the permissions that you need to complete your task
* Audited : False
* Rationale
    - Limiting the frequency with which the root user's password and MFA are used, reduces the window of opportunity for an attacker with unauthorized access to a user's computer to escalate their access from the user's computer to the AWS account's root user
    - Virtually all actions that the root user can execute can also be executed by an IAM user.

# CloudTrail

CloudTrail logs enable the security team to perform incident response when an account has been compromised.

## Use the Mozilla Secure CloudTrail Storage System

* How to : Mozilla teams should have CloudTrail enabled and sending it's contents to the Mozilla Secure CloudTrail Storage System. You can enable it by following these [instructions](https://mana.mozilla.org/wiki/display/SECURITY/AWS+Secure+CloudTrail+Storage+System#AWSSecureCloudTrailStorageSystem-HowtoenableyourMozillaAWSaccounttousetheSecureCloudTrailStorageSystem)
* Audited : True
* Rationale
    - In order to protect the CloudTrail logs that AWS produces from an attacker who compromised your AWS account from deleting them, the Mozilla Secure CloudTrail Storage System causes AWS to ship these logs to a segregated and secure AWS account, separate from your own. This ensures that if an attacker compromises your AWS account, they will not be able to destroy the records of what changes they made to your account.

# Route53

## Do not leave DNS records in Route53 that resolve to third party services which you are no longer using

* How to : Review the DNS records you have setup in DNS zones hosted in Route53. Look for records which resolve to IPs or names of third party services (e.g. GitHub, Heroku, AmazonAWS ) but which are not setup and configured with that third party service. For example, look for a CNAME that [resolves to foo.github.io](https://help.github.com/articles/setting-up-a-www-subdomain/) but when browsed to returns a 404 "Site not found . GitHub Pages"
* Audited : False
* Rationale
    - If an attacker registers an account with a third party service for which your Route53 zone contains a record pointing to that service, the attacker can then host their malicious content on their site with your domain name. With this they could create a phishing site in your DNS domain, exploit same origin bugs, obtain domain wide cookies from users and execute cross site scripting attacks. This is also known as domain take-over.

# S3

## Avoid unintentionally granting public access to non-public S3 data

* How to : Review S3 bucket policies for the presence of policy statements which permit a Principle of "*" as the actions granted in that statement (for example reading content from the S3 bucket or writing to the bucket) will be available to everyone
* Audited : True
* Rationale
    - Data not classified as Public shouldn't be readable or modifiable by the public.

# Security Groups

## Use inbound security group rules instead of outbound security group rules to govern access

* How to : When creating security groups, only create inbound rules on systems to allow inbound connections. Do not create outbound rules on systems that initiate connections to other systems. Outbound rules in security groups should be open/permissive. The exception to this is security groups that control outbound access to the internet. These security groups can and should have outbound rules
* Audited : False
* Rationale
    - If a security group contains both inbound and outbound rules or if the union of all security groups contain both inbound and outbound rules, the resulting apparent access can easily differ from the actual access being granted. Mixing inbound and outbound rules makes it very difficult to determine the resulting behavior of all rules combined. This complexity and difference between the apparent behavior and the actual behavior can expose systems to an attacker unintentionally
    - The only place where outbound rules should be used is the one case where they are necessary; when constraining outbound access from AWS resources to the internet.

##  Disallow inbound network access by default

* How to : When creating security groups, only allow inbound access to ports that are required. Avoid creating overly broad rules which allow more ports than are required for the services hosted on the systems protected by that security group.
* Audited : False
* Rationale
    - Security Principle : [Do not present unnecessary services](https://wiki.mozilla.org/Security/Fundamentals/Security_Principles#Do_not_present_unnecessary_services)
    - Limiting the network access an attacker has to a resource, limits the size of the attack surface and the likelihood that the attacker will be able to exploit the resource.

## Disallow inbound network access from internal resources

* How to : By default, every AWS VPC is created with a single "default" security group. This security group allows inbound connections on all ports from all resources which are also part of the same security group. The result of this is that any resource which is part of this security is reachable over all ports from other resources in the same security group.
    - Modify the default security group and delete the "All traffic" rule allowing inbound connections.
    - Avoid creating any security group with a rule allowing all inbound ports to either itself or other security groups
* Audited : False
* Rationale
    - Security Principle : [Do not present unnecessary services](https://wiki.mozilla.org/Security/Fundamentals/Security_Principles#Do_not_present_unnecessary_services)
    - Security Principle [Do not allow lateral movement](https://wiki.mozilla.org/Security/Fundamentals/Security_Principles#Do_not_allow_lateral_movement)
    - AWS creates this default security group as a convenience so that all resources you create can, by default, communicate with each other. Unfortunately, this convenience results in an attacker that gains access to one system being able to attack any service listening on any other internal system.

## Disallow outbound internet access except through HTTP proxy on NSM server

* How to
    - Implement the [recommended deployment of network security monitoring (NSM) on a NAT instance](https://mana.mozilla.org/wiki/display/POLICIES/Standard%3A+Network+Security+monitoring+in+AWS) in your AWS account
    - Ensure that *all* security groups in the account, other than the security group used by the NSM server, disallow outbound access to the internet
    - Ensure that systems which need outbound internet access are part of a security group which allows outbound access to the NSM server
    - Ensure that all services which need outbound access to the internet and can be configured to use an HTTP proxy, use the HTTP proxy running on the NAT instance instead of traversing the NSM server directly
* Audited : False
* Rationale
    - Sending outbound internet traffic through a network security monitoring server allows for inspection of the traffic and detection of signatures revealing compromised servers in the VPC.
    - Sending outbound internet traffic through an http proxy allows for limiting internet destinations that internal systems can reach which will prevent an attacker who compromises a system from exfiltrating data.
