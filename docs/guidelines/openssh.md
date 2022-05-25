---
layout: default
resource: true
categories: [Guidelines]
title: OpenSSH
description: How to configure and use OpenSSH server and client securely
---

*The goal of this document is to help operational teams with the configuration of OpenSSH server and client.
All Mozilla sites and deployment should follow the recommendations below.
The Security Assurance and Security Operations teams maintain this document as a reference guide.*


# Only non-default settings are listed in this document
Most default OpenSSH settings that are security-related already provide good security, thus changing them is at your own risk and is not documented here. For example, these guidelines assume only SSH protocol 2 is configured in the server, and SSH protocol 1 is disabled. This also assumes that you are keeping OpenSSH up-to-date with security patches.
See `man sshd_config`, `man ssh_config` for more information on specific settings if you nevertheless need to change them.                                                                                                                                                       |

# OpenSSH **server**

## Configuration

Different versions of OpenSSH support different options which are not always compatible. This guide shows settings for the most commonly deployed OpenSSH versions at Mozilla - however, using the latest version of OpenSSH is recommended.

### **Modern** (OpenSSH 6.7+)

File: `/etc/ssh/sshd_config`

```
# Supported HostKey algorithms by order of preference.
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key

KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp521,ecdh-sha2-nistp384,ecdh-sha2-nistp256,diffie-hellman-group-exchange-sha256

Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr

MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,umac-128-etm@openssh.com,hmac-sha2-512,hmac-sha2-256,umac-128@openssh.com

# Password based logins are disabled - only public key based logins are allowed.
AuthenticationMethods publickey

# LogLevel VERBOSE logs user's key fingerprint on login. Needed to have a clear audit track of which key was using to log in.
LogLevel VERBOSE

# Log sftp level file access (read/write/etc.) that would not be easily logged otherwise.
Subsystem sftp  /usr/lib/ssh/sftp-server -f AUTHPRIV -l INFO

# Root login is not allowed for auditing reasons. This is because it's difficult to track which process belongs to which root user:
#
# On Linux, user sessions are tracking using a kernel-side session id, however, this session id is not recorded by OpenSSH.
# Additionally, only tools such as systemd and auditd record the process session id.
# On other OSes, the user session id is not necessarily recorded at all kernel-side.
# Using regular users in combination with /bin/su or /usr/bin/sudo ensure a clear audit track.
PermitRootLogin No

# Use kernel sandbox mechanisms where possible in unprivileged processes
# Systrace on OpenBSD, Seccomp on Linux, seatbelt on MacOSX/Darwin, rlimit elsewhere.
UsePrivilegeSeparation sandbox
```

File: `/etc/ssh/moduli`

All Diffie-Hellman moduli in use should be at least 3072-bit-long (they are used for `diffie-hellman-group-exchange-sha256`) as per our [Key management Guidelines](key_management) recommendations. See also `man moduli`.

To deactivate short moduli in two commands: `awk '$5 >= 3071' /etc/ssh/moduli > /etc/ssh/moduli.tmp && mv /etc/ssh/moduli.tmp /etc/ssh/moduli`

### **Intermediate** (OpenSSH 5.3)

This is mainly for use by RHEL6, CentOS6, etc. which run older versions of OpenSSH.

File: `/etc/ssh/sshd_config`

```
# Supported HostKey algorithms by order of preference.
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key

KexAlgorithms diffie-hellman-group-exchange-sha256
MACs hmac-sha2-512,hmac-sha2-256
Ciphers aes256-ctr,aes192-ctr,aes128-ctr

# Password based logins are disabled - only public key based logins are allowed.
RequiredAuthentications2 publickey

# RequiredAuthentications2 not work on official OpenSSH 5.3 portable.
# In this is your case, use this instead:
#PubkeyAuthentication yes
#PasswordAuthentication no

# LogLevel VERBOSE logs user's key fingerprint on login. Needed to have a clear audit track of which key was using to log in.
LogLevel VERBOSE

# Log sftp level file access (read/write/etc.) that would not be easily logged otherwise.
Subsystem sftp  /usr/lib/ssh/sftp-server -f AUTHPRIV -l INFO

# Root login is not allowed for auditing reasons. This is because it's difficult to track which process belongs to which root user:
#
# On Linux, user sessions are tracking using a kernel-side session id, however, this session id is not recorded by OpenSSH.
# Additionally, only tools such as systemd and auditd record the process session id.
# On other OSes, the user session id is not necessarily recorded at all kernel-side.
# Using regular users in combination with /bin/su or /usr/bin/sudo ensure a clear audit track.
PermitRootLogin No
```

File: `/etc/ssh/moduli`

All Diffie-Hellman moduli in use should be at least 2048-bit-long. From the structure of `moduli` files, this means the fifth field of all lines in this file should be greater than or equal to 2047.

To deactivate weak moduli in two commands: `awk '$5 >= 2047' /etc/ssh/moduli > /etc/ssh/moduli.tmp; mv /etc/ssh/moduli.tmp /etc/ssh/moduli`

### **Multi-Factor Authentication** (OpenSSH 6.3+)

Recent versions of OpenSSH support MFA (Multi-Factor Authentication). Using MFA is recommended where possible.

It requires additional setup, such as using the [OATH Toolkit](https://www.nongnu.org/oath-toolkit/) or [DuoSecurity](https://www.duosecurity.com).

**ATTENTION** In order to allow using one time passwords (OTPs) and any other text input, Keyboard-interactive is enabled in OpenSSH. This *MAY* allow for password authentication to work. It is therefore very important to check your PAM configuration so that PAM disallow password authentication for OpenSSH.

#### OpenSSH 6.3+ (default)

File: `/etc/ssh/sshd_config`

```
# IMPORTANT: you will have to ensure OpenSSH cannot authenticate with passwords with PAM in /etc/pam.d/sshd
# "PasswordAuthentication no" is not sufficient!
PubkeyAuthentication yes
PasswordAuthentication no
AuthenticationMethods publickey,keyboard-interactive:pam
KbdInteractiveAuthentication yes
UsePAM yes
# Ensure /bin/login is not used so that it cannot bypass PAM settings for sshd.
# Note, this option is no longer needed as of OpenSSH 7.4 as support for UseLogin has been removed
UseLogin no
```

#### OpenSSH 5.3+ w/ RedHat/CentOS patch (old)

File: `/etc/ssh/sshd_config`

```
# Allow keyboard-interactive.
# IMPORTANT: you will have to ensure OpenSSH cannot authenticate with passwords with PAM in /etc/pam.d/sshd
# "PasswordAuthentication no" is not sufficient!
RequiredAuthentications2 publickey,keyboard-interactive:skey
PasswordAuthentication no
ChallengeResponseAuthentication yes
UsePAM yes
# Ensure /bin/login is not used so that it cannot bypass PAM settings for sshd.
UseLogin no
```

PAM configuration for use with the [OATH Toolkit](https://www.nongnu.org/oath-toolkit/) or [DuoSecurity](https://www.duosecurity.com) as second authentication factor.

File: `/etc/pam.d/sshd`

```
#%PAM-1.0
auth       required     pam_sepermit.so

# WARNING: make sure any password authentication module is disabled.
# Example: pam_unix.so, or "password-auth", "system-auth", etc.
#auth       include      password-auth

# Options to enable when using OATH toolkit
#auth       requisite     pam_oath.so usersfile=/etc/users.oath digits=6 window=20

# Options to enable when using DuoSecurity
#auth    sufficient      /lib64/security/pam_duo.so

account    required     pam_nologin.so
```

The PAM stack in this scenario executes the following logic (in our example we
follow the flow with `pam_duo.so` in use)
* The `pam_sepermit.so` module is called which checks if the user attempting to
  log in via SSH is present in the [`/etc/security/sepermit.conf`](https://selinuxproject.org/page/GlobalConfigurationFiles#.2Fetc.2Fsecurity.2Fsepermit.conf_File).
  If the user is present in the config file, and the config asserts that the user
  can only log in if SELinux is enforcing, and SELinux is not enforcing, then
  the PAM control of `required` prevents the user from logging in (though PAM
  would continue down the stack).
* The `password-auth` include is commented out and skipped
* The `/lib64/security/pam_duo.so` module is called and the user is prompted for
  a duo MFA code. 
  * If the code provided is correct PAM immediately permits the user access and
    doesn't continue executing.
  * If the code provided is incorrect, PAM continues down the stack
* The `pam_nologin.so` checks if the file `/etc/nologin` exists and if so blocks
  access to the user.
* If at the end of the stack, the single `sufficient` control of `pam_duo.so`
  did not return a success, PAM defaults to deny and denies the login.


## Ciphers and algorithms choice

-   When CHACHA20 (OpenSSH 6.5+) is not available, AES-GCM (OpenSSH 6.1+) and any other algorithm using EtM (Encrypt then MAC) [disclose the packet length](http://blog.djm.net.au/2013/11/chacha20-and-poly1305-in-openssh.html) - giving some information to the attacker. Only recent OpenSSH servers and client support CHACHA20.
-   NIST curves (`ecdh-sha2-nistp512,ecdh-sha2-nistp384,ecdh-sha2-nistp256`) are listed for compatibility, but the use of `curve25519` is [generally preferred](https://safecurves.cr.yp.to/).
-   SSH protocol 2 supports [DH](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) and [ECDH](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) key-exchange as well as [forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy). Regarding group sizes, please refer to [Key management Guidelines](key_management).

The various algorithms supported by a particular OpenSSH version can be listed with the following commands:

```
$ ssh -Q cipher
$ ssh -Q cipher-auth
$ ssh -Q mac
$ ssh -Q kex
$ ssh -Q key
```

# OpenSSH **client**

## Configuration

If you have a file containing `known_hosts` using RSA or ECDSA host key algorithm and the server now supports ed25519 for example, you will get a warning that the host key has changed and will be unable to connect. This means you will have to verify the new host key.

The following configurations expect a recent OpenSSH client, as updating OpenSSH on the client side is generally not an issue.

### **Modern**

This configuration is less compatible and you may not be able to connect to some servers which use insecure, deprecated algorithms. Nevertheless, modern servers will work just fine.

File: `~/.ssh/config`

```
# Ensure KnownHosts are unreadable if leaked - it is otherwise easier to know which hosts your keys have access to.
HashKnownHosts yes
# Host keys the client accepts - order here is honored by OpenSSH
HostKeyAlgorithms ssh-ed25519-cert-v01@openssh.com,rsa-sha2-512-cert-v01@openssh.com,rsa-sha2-256-cert-v01@openssh.com,ssh-ed25519,rsa-sha2-512,rsa-sha2-256,ecdsa-sha2-nistp521-cert-v01@openssh.com,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp256-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp384,ecdsa-sha2-nistp256

KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp521,ecdh-sha2-nistp384,ecdh-sha2-nistp256,diffie-hellman-group-exchange-sha256
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,umac-128-etm@openssh.com,hmac-sha2-512,hmac-sha2-256,umac-128@openssh.com
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
```

### **Intermediate** (connects to older servers)

This configuration can connect to older OpenSSH servers which run old or intermediate configurations.

File: `~/.ssh/config`

```
# Ensure KnownHosts are unreadable if leaked - it is otherwise easier to know which hosts your keys have access to.
HashKnownHosts yes
# Host keys the client accepts - order here is honored by OpenSSH
HostKeyAlgorithms ssh-ed25519-cert-v01@openssh.com,rsa-sha2-512-cert-v01@openssh.com,rsa-sha2-256-cert-v01@openssh.com,ssh-rsa-cert-v01@openssh.com,ssh-ed25519,rsa-sha2-512,rsa-sha2-256,ssh-rsa,ecdsa-sha2-nistp256-cert-v01@openssh.com,ecdsa-sha2-nistp521-cert-v01@openssh.com,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp384,ecdsa-sha2-nistp256
```

## Key generation

Large key sizes are used as SSH keys are not renewed very often (see also [Key management Guidelines](key_management)).

Don't hesitate to create multiple different keys for different usages. In particular, never mix your personal and Mozilla keys.

```
# RSA keys are favored over ECDSA keys when backward compatibility ''is required'',
# thus, newly generated keys are always either ED25519 or RSA (NOT ECDSA or DSA).
$ ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_mozilla_$(date +%Y-%m-%d) -C "Mozilla key for xyz"

# ED25519 keys are favored over RSA keys when backward compatibility ''is not required''.
# This is only compatible with OpenSSH 6.5+ and fixed-size (256 bytes).
$ ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_mozilla_$(date +%Y-%m-%d) -C "Mozilla key for xyz"
```

You may then want to add the new key to your SSH agent or your configuration file (or both).

```
# Add key to ssh-agent
$ ssh-add ~/.ssh/id_..._mozilla... # <= replace by your key's path

# Add configuration to ~/.ssh/config
host *.mozilla.com
IdentityFile ~/.ssh/id_...mozilla... # <= replace by your key's path
```

### Protection of user keys

-   Protected by strong passphrase.
-   Never copied to another system than your own workstation/personal physical disks/tokens.
-   Use SSH forwarding or SSH tunneling if you need to jump between hosts. **DO NOT** maintain unnecessary agent forwarding when unused.

### Protection of machine keys

When SSH keys are necessary for automation between systems, it is reasonable to use passphrase-less keys.

-   The recommended settings are identical to the user keys.
-   The keys must be accessible only by the admin user (root) and/or the system user requiring access.
-   Usage of machine keys should be registered in an inventory (a wiki page, ldap, an inventory database), to allow for rapid auditing of key usage across an infrastructure.
-   The machine keys should be unique per usage. Each new usage (different service, different script called, etc.) should use a new, different key.
-   Only used when strictly necessary.
-   Restrict privileges of the account (i.e. no root or “sudoer” machine account).
-   Using a ForceCommand returning only the needed results, or only allowing the machine to perform SSH-related tasks such as tunneling is preferred.
-   Disable sftp if not needed as it exposes more surface and different logging mechanisms than SSH (and thus scp) itself.
```
# groupadd sftpusers
# usermod -a -g sftpusers <userthat_needs_ftp>
# chgrp sftpusers /usr/lib/ssh/sftp-server
# chmod 0750 /usr/lib/ssh/sftp-server
```

#### Multi-factor bypass setup for machine keys

Machine keys do not play well with multi-factor authentication as there is no human interaction.

-   All logins from machine accounts should be protected by an additional authentication layer (VPN, another machine, etc.).
-   All logins from machine accounts are only allowed within the private IP-space, and if possible, only the relevant machine source IPs should be accessible.

File: `/etc/ssh/sshd_config` (OpenSSH 6.3+)

```
Match User machine_user Address 10.0.0.0/8,192.168.0.0/16,172.16.0.0/12
    PubkeyAuthentication yes
    KbdInteractiveAuthentication no
    AuthenticationMethods publickey
```

File: `/etc/ssh/sshd_config` (OpenSSH 5.3+ w/ RedHat/CentOS patch)

```
Match User machine_user Address 10.0.0.0/8,192.168.0.0/16,172.16.0.0/12
    RequiredAuthentications2 publickey
```

### Auditing your existing SSH keys

Existing keys are generally stored in `~/.ssh/` (Linux/OSX) or `%APPDATA%` (Windows). Look for `id_{rsa,ed25519,ecdsa,dsa}, identity, IdentityFile, *.pem`, and other `identity` files.

#### Display SSH keys information

```
# You may run this for any key file that you have.
$ ssh-keygen -lf id_rsa
2048 bc:4f:46:2b:3d:f1:e2:0f:ac:40:99:49:ed:c9:81:a2 Mozilla key for xyz (RSA)
^^   ^^^^^^^^^                                       ^^^^                 ^^^
|__ Size     |__ Fingerprint                             |__ Comment        |__ Type
```

## SSH agent forwarding

**ATTENTION** SSH Agent forwarding exposes your authentication to the server you're connecting to. By default, an attacker with control of the server (i.e. root access) can communicate with your agent and use your key to authenticate to other servers without any notification (i.e. impersonate you).
For this reason, one must be careful when using SSH agent forwarding. Defaulting to always forwarding the agent is strongly discouraged.
Note also that while the attacker can use your key as long as the agent is running and forwarded, he cannot steal/download the key for offline/later use.

SSH forwarding allows you to jump between hosts while keeping your private key on your local computer. This is accomplished by telling SSH to forward the authentication requests back to the ssh-agent of your local computer. SSH forwarding works between as many hosts as needed, each host forwarding new authentication request to the previous host, until the ssh-agent that holds the private key is reached.

![SSH Forwarding](/guidelines/assets/images/Ssh_forwarding.png)

On each host, two environment variables are declared for the user enabling ssh-agent:

-   **$SSH\_AUTH\_SOCK** declares the location of the unix socket that can be used to forward an authentication request back to the previous host.(ex: `/tmp/ssh-NjPxtt8779/agent.8779`). Only present if using SSH agent forwarding.
-   **$SSH\_CONNECTION** shows the source IP and port of the previous host, as well as the local IP and port. (ex: `10.22.248.74 44727 10.8.75.110 22`).

To use ssh-agent, add the flag `-A` to your ssh commands:

```
$ ssh -A user@ssh.mozilla.com
```

You can set the following configuration parameter in your local ssh configuration at `~/.ssh/config`.

```
Host ssh.mozilla.com
    ForwardAgent yes
```
### Hardening the Agent forwarder

It is possible to require confirmation every time the agent is used (i.e. when you connect to a server through the SSH agent) by using the `-c` flag:

```
# First, remove the key from the agent if it's already loaded:
$ ssh-add -d ~/.ssh/id_ed25519
# And re-add it with the -c flag:
$ ssh-add -c ~/.ssh/id_ed25519
```

It is also possible to lock the key in the agent after a configurable amount of time, this can be done either for all keys when starting the agent, or per key when adding the keys to the agent with the `-t` flag:

```
# Keep all keys decrypted/useable in memory for 30 minutes (1800 seconds)
$ ssh-agent -t 1800

# First, remove the key from the agent if it's already loaded:
$ ssh-add -d ~/.ssh/id_ed25519
# Re-add it, with the -t flag to keep this specific key decrypted/useable in memory for 30 minutes (1800 seconds)
$ ssh-add -t 1800 ~/.ssh/id_ed25519
```

For MacOSX in particular it's possible to save the passphrase in the Keychain. If you do so it is strongly recommended to also change the keychain setting to lock itself when the computer is locked, and/or to timeout and lock the keychain. These settings are not controlled by OpenSSH.

```
# MacOSX only - save the passphrase in the Keychain
$ ssh-add -K ~/.ssh/id_ed25519
```

### Recommended, safer alternatives to SSH agent forwarding

#### OpenSSH >=7.3

OpenSSH 7.3 onwards allow users to jump through several hosts in a rather automated fashion. It has full support for scp and sftp commands as well as regular ssh.

For example to reach a host behind a bastion/jumphost:

```
# Single jump
$ ssh -J ssh.mozilla.com myhost.private.scl3.mozilla.com

# Jump through 2 hops
$ ssh -J ssh.mozilla.com,ec2-instance.aws.net 10.0.0.3

# Copy data from a host
$ scp -oProxyJump=ssh.mozilla.com myhost.private.scl3.mozilla.com:/home/jdoe/testfile ./
```

You can also add these lines to your `~/.ssh/config`

```
Host *.mozilla.com !ssh.mozilla.com
ProxyJump ssh.mozilla.com
```

#### Older versions of OpenSSH

It is possible to directly forward ports for single jumps instead of forwarding the agent. This has the advantage of never exposing your agent to the servers you're connecting to.

For example, you can add these lines to your `~/.ssh/config`

```
Host *.mozilla.com !ssh.mozilla.com
ProxyCommand ssh ssh.mozilla.com -W %h:%p
```

This will automatically forward the SSH connection over ssh.mozilla.com when you connect to a mozilla.com SSH server.

# Appendixes

## Key material handling

Key material identifies the cryptographic secrets that compose a key. All key material must be treated as MOZILLA CONFIDENTIAL GROUP RESTRICTED data, meaning that:

-   Only individual with specific training and need-to-know should have access to key material.
-   Key material must be encrypted on transmission.
-   Key material can be stored in clear text, but only with proper access control (limited access).

This includes:

-   OpenSSH server keys (`/etc/ssh/ssh_host_*key`)
-   Client keys (`~/.ssh/id_{rsa,dsa,ecdsa,ed25519}` and `~/.ssh/identity` or other client key files).

## Client key size and login latency

In order to figure out the impact on performance of using larger keys - such as RSA 4096 bytes keys - on the client side, we have run a few tests:

On an idle, i7 4500 intel CPU using OpenSSH\_6.7p1, OpenSSL 1.0.1l and ed25519 server keys the following command is ran 10 times:

`time ssh localhost -i .ssh/id_thekey exit`

Results:

| Client key | Minimum | Maximum | Average |
|------------|---------|---------|---------|
| RSA 4096   | 120ms   | 145ms   | 127ms   |
| RSA 2048   | 120ms   | 129ms   | 127ms   |
| ed25519    | 117ms   | 138ms   | 120ms   |

Keep in mind that these numbers may differ on a slower machine, and that this contains the complete login sequence and therefore is subject to variations. However, it seems safe to say that the latency differences are not significant and do not impact performance sufficiently to cause any concern regardless of the type of key used.

## Reference documents

-   [Key management Guidelines](key_management)
-   [Server Side TLS Guidelines](https://wiki.mozilla.org/Security/Server_Side_TLS)
-   [RFC4418 (umac)](https://www.ietf.org/rfc/rfc4418.txt)
-   [umac draft](https://www.openssh.com/txt/draft-miller-secsh-umac-01.txt)
-   [Safe curves](https://safecurves.cr.yp.to/)
-   [DJM blog](http://blog.djm.net.au/2013/11/chacha20-and-poly1305-in-openssh.html)
-   [Stribika blog](https://stribika.github.io/2015/01/04/secure-secure-shell.html)
-   [AES-GCM performance study](https://2013.diac.cr.yp.to/slides/gueron.pdf)
-   [CHACHA20 vs AES-GCM performance study](https://security.googleblog.com/2014/04/speeding-up-and-strengthening-https.html)
-   [PROTOCOL.certkeys](https://cvsweb.openbsd.org/cgi-bin/cvsweb/~checkout~/src/usr.bin/ssh/PROTOCOL.certkeys?rev=1.9&content-type=text/plain)
-   [rfc44880bis from GnuPG](https://wiki.gnupg.org/rfc4880bis)
-   [Weak Diffie-Hellman and the Logjam Attack](https://weakdh.org/)
-   [On OpenSSH and Logjam, by Jethro Beekman](https://jbeekman.nl/blog/2015/05/ssh-logjam/)
