---
layout: default
resource: true
categories: [Fundamentals]
title: Rationales
description: Explains and justifies the use of specific controls, principles
---

*The goal of this document is to detail the rationales behind why various technologies and processes are encouraged or discouraged.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide.*

# Rationales

<table class="wikitable">
<tbody><tr>
<th>Topic
</th>
<th>Rationale
</th></tr>
<tr>
<td><div id="shared-passwords"><a href="#shared-passwords">§</a> Shared passwords and accounts</div>
</td>
<td>Shared passwords are passwords or/and accounts that more than one person knows or has access to. They're discouraged because:
<ul>
<li> Use of them makes auditing access difficult:
<ul>
<li> multiple users appear in audit logs as one user and different users actions are difficult to differentiate.
</li>
<li> the number of audit logs that need to be searched increases.
</li>
<li> correlation of events across different systems is impossible if multiple people are creating event records with a single shared account across multiple systems at the same time.
</li>
</ul>
</li>
<li> Revoking access to a subset of the users of a shared password requires a password change that affects all users.
</li>
</ul>
</td></tr>
<tr>
<td><div id="password-reuse"><a href="#password-reuse">§</a> Password reuse</div>
</td>
<td>Password reuse is the practice of a single user using the same password across multiple different accounts/sites. This is contrasted with creating a different, distinct password for every account/site. Users often employ hybrid forms of password reuse like
<ul>
<li> Using the same password for a class of accounts/sites, for example, using one single password for multiple high value financial accounts, but a different single password for multiple low value forums and wikis.
</li>
<li> Using a consistent reproducible method of password generation for each site, for example, every account/site has a password which begins with the same characters and ends with name of the site ("rosebud0facebook", "rosebud0linkedin")
</li>
</ul>
<p>Password reuse is discouraged because:
</p>
<ul>
<li> When a site is compromised by an attacker, the attacker can easily take the user's password that has been reused on other sites and gain access to those other sites. For example if a user uses the same password on a car forum website as they use on Facebook, when that car website gets compromised, the attackers can then takeover the user's Facebook account.
</li>
<li> Unethical administrators of any sites where a password is reused may/can gain access to accounts using the reused password.
</li>
</ul>
<p>Note that it is dangerous for a user to rely on a site being able to effectively prevent an attacker from obtaining that user's password once an attacker has compromised the site.
</p><p>Since it's difficult/impossible for a user to memorize a distinct password for every account/site, a common solution is to use a password manager.
</p>
</td></tr>
<tr>
<td><div id="decentralized-user-account-management"><a href="#decentralized-user-account-management">§</a> Decentralized user account management</div>
</td>
<td>Decentralized user account management refers to user account management which is not driven by the source of truth for the user's account. Examples of this are:
<ul>
<li> Manual user account creation by administrators.
</li>
<li> Automated user account creation from scripting or configuration management that creates accounts based on a static list of users.
</li>
</ul>
<p>This practice is discouraged because:
</p>
<ul>
<li> When a user's access status changes due to leaving the company or changing teams, the associated change in the system which uses decentralized user account management is not automatically made resulting in unintended system access.
</li>
<li> When a user changes an attribute of their account in the centralized account management system, for example their email address or password, that change is not reflected in the systems which use decentralized user account management. Conversely when the user changes an attribute in the systems which use decentralized user account management, that change is not propagated to the centralized account management system.
</li>
</ul>
</td></tr>
<tr>
<td><div id="mfa"><a href="#mfa">§</a> Multi-factor Authentication</div>
</td>
<td>Multi-factor authentication (MFA) is a security system that requires more than one method of authentication from independent categories of credentials to verify the user's identity for a login or other transaction.
<p>Requiring the use of MFA for internet accessible endpoints is encouraged because by requiring not only something the
user knows (a knowledge factor like a memorized password) but also something that the user has (a possession factor like
a smartcard, yubikey or mobile phone) the field of threat actors that could compromise the account is reduced to actors
with physical access to the user.
</p><p>In cases where the possession factor is digital (a secret stored in your mobile phone) instead of physical (a smartcard
or yubikey), the effect of MFA is not to reduce the field of threat actors to only those that have physical access to
the user, because a secret can be remotely copied off of a compromised mobile phone. Instead, in this case, the
possession factor merely makes it more difficult for the threat actor since they now need to brute force/guess your
password <b>and</b> compromise your mobile phone. This is, however, still possible to do entirely from a remote location.
In particular, storing both first on second factor on the same device (for example: mobile phone) is strongly discouraged.
</p>
</td></tr>
<tr>
<td><div id="nsm"><a href="#nsm">§</a> Network Security Monitoring</div>
</td>
<td>Network Security Monitoring (NSM) is the practice of monitoring raw network traffic in order to detect intrusions or abnormal behavior. The use of NSM is encouraged because it can:
<ul>
<li> identify when a host has been compromised by the network traffic it emits.
</li>
<li> understand the commonalities in a distributed network attack.
</li>
<li> provide incident responders with data needed to quickly diagnose security issues.
</li>
</ul>
</td></tr>
</tbody>
</table>
