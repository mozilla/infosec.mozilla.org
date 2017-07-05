---
layout: default
---

*The goal of this document is to help operational teams with the handling and management of cryptographic material.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide for operational teams.*

# Data Definitions

## Key material

Key material identifies the cryptographic secrets that compose a key. All key material must be treated as restricted data, meaning that only individual with specific training and need-to-know should have access to key material. Key material must be encrypted on transmission. Key material can be stored in clear text, but with proper access control.

## Public certificates

Public certificates are public and do not require specific access control or encryption.

# Algorithms by security levels

This section organizes algorithms and key sizes by rating (modern, intermediate, old) for a given validity period. Regardless of the rating choosen, we do recommend prefering 2 years keys with a reliable key rotation instead of trying to keep key material for long periods of time. This allow for faster operational reaction time when new algorithm weaknesses are discovered.

## Recommended - generally valid for up to 10 years (default)

These may be used if expiring within 10 years and should be the default choice unless limited by technological factors such as client/server support or performance.

Use of EC is favored over RSA for performances purposes.

| Type                  | Algorithm and key size | Bits of security |
|-----------------------|------------------------|------------------|
| Asymmetric encryption | RSA 4096 bits          | 144 bits         |
| Asymmetric encryption | ECDSA 512 bits         | 256 bits         |
| Symmetric encryption  | AES-GCM 256 bits       | 256 bits         |
| Hash & HMAC           | SHA-512                | 256 bits         |
| Hash & HMAC           | SHA3-512               | 256 bits         |

## Acceptable - generally valid for up 2 years

These maybe be used if expiring within 2 years or up to 2020 whichever comes first.

| Type                 | Algorithm and key size | Bits of security |
|----------------------|------------------------|------------------|
| Asymmetric keys      | RSA 3072 bits          | 128 bits         |
| Asymmetric keys      | ECDSA 256 bits         | 128 bits         |
| Symmetric encryption | AES-CBC 128 bits       | 128 bits         |
| Hash & HMAC          | SHA-256                | 128 bits         |
| Hash & HMAC          | SHA3-256               | 128 bits         |

## Old - do not use

The following algorithms and sizes are still widely used but do not provide sufficient security for modern services and should be deprecated as soon as possible.

| Type                  | Algorithm and key size   | Bits of security |
|-----------------------|--------------------------|------------------|
| Asymmetric encryption | RSA 1024 bits and below  | 80 bits          |
| Asymmetric encryption | ECDSA 160 bits and below | 80 bits          |
| Symmetric encryption  | 3DES                     | 112 bits         |
| Symmetric encryption  | RC4                      |                  |
| Hash & HMAC           | SHA-1                    | 80 bits          |
| Hash & HMAC           | MD5                      | 64 bits          |

# Handling

## X509 certificates and keys

## SSH

See [Security/Guidelines/OpenSSH](Security/Guidelines/OpenSSH "wikilink").

## PGP/GnuPG

```
$ gpg --gen-key
(1) RSA and RSA (default)
[...]
Your selection? 1
[...]
What keysize do you want? (4096)
[...]
Key is valid for? (0) 2y
[...]
```

### Protection of user keys

-   Protected by strong passphrase.
-   Never copied to another system than your own workstation/personal physical disks/tokens.

### Protection of machine keys

-   Storing the key material in a hardware token or HSM is preferred over simply using a strong passphrase.
-   The keys must be accessible only by the admin user (root) and/or the system user requiring access.

Usage of machine keys should be registered in an inventory (a wiki page, LDAP, an inventory database), to allow for rapid auditing of key usage across an infrastructure.

### Expiration of keys

As GnuPG trust model belongs to your master key, some may decide to not expire their master key. This is reasonable if the master key is very well protected, and a separate sub-key (or sub-keys) are used for day to day signing and encryption. For example, the master key could be stored offline and never copied or used on an online system.

Note: It is possible to change the expiration of a key, however all clients must fetch updates on a key server or will see your key as expired.

### GnuPG settings

By default, GnuPG may use deprecated hashing algorithms such as SHA1 when used for signing. These settings ensure a more modern selection of hashing algorithms. Using long key ids over the default short key ids is also recommended. If possible, using complete fingerprints is even better.

File: `~/.gnupg/gpg.conf`

```
personal-digest-preferences SHA512 SHA384
cert-digest-algo SHA256
default-preference-list SHA512 SHA384 AES256 ZLIB BZIP2 ZIP Uncompressed
keyid-format 0xlong
```

# Definitions

## Bits of security

Security Bits estimate the computational steps or operations (not machine instructions) required to solve a cryptographic problem (i.e. crack the key/hash). Of course, these do not factor in weaknesses in the algorithms which would reduce the effective amount of security bits and therefore is only used as an indicator of the width of the total (maximum) space to exhaust to ensuring finding the key.

For a more detailed definition, see  <https://en.wikipedia.org/wiki/Key_size>, <https://en.wikipedia.org/wiki/Secure_Hash_Algorithm> and <http://www.cryptopp.com/wiki/Security_Level#Security_Bits>.
