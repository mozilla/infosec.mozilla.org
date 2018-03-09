---
layout: default
resource: true
categories: [Guidelines]
title: Phishing
description: A fraudulent practice of sending emails (or other communications) purporting to be from reputable companies in order to induce individuals to reveal personal information, such as passwords and credit card numbers.
---

*The goal of this document is to help educate users about the risks of phishing attacks.  This document can be used both as a pro-active and a re-active aid to help reduce the likelihood of falling victim to a phishing attack.*

# Background

Phishing is an attack used by the computer hacking and fraud community to lure people to fraudulent websites that mimic ones they would normally use. They do this by creating e-mails that appear like they are being sent by a legitimate company or sender.

Phishing emails often have the following characteristics:

  - Phishing emails may ask you to click on a link in the e-mail, which would take you to a mock-up of the legitimate company's website where you are asked for your login credentials or other sensitive information (e.g. personally identifiable information (PII)).
  - Phishing emails can have a forged sender's address to mask an attacker's identity and make the email seem legitimate
  - Attackers can also create misleading hyperlinks inside of emails
  - Attackers will often use phishing emails with malicious attachments that are coerced to be opened or executed to compromise your system

# Intuition

Your own intuition is probably your best asset for easily detecting phishing attacks.  If an email seems out of place, unsolicited or asks you to take a weird action, stop and consider whether you are in a phishing scenario.  If you find yourself in this state, the below information will be helpful in supporting those "weird feels" with evidence that would validate those concerns.   If at any time you get a feeling something isn't right, you are encouraged to investigate further. If you feel out of your depth, please raise it with your information security team ([infosec@mozilla.com](mailto:infosec@mozilla.com) if at Mozilla) for further review and validation.

# Email Headers

Email headers are a great way to deduce the true origin of a given email.  As noted above, emails often contain a format section which is forgable by an attacker to make it seem as though an email came from a different source.  If you're using Gmail, here's a good reference [2](https://support.google.com/mail/answer/29436?hl=en) for viewing the headers of a given email.  When viewing the full headers, it's important to understand who actually sent a given email.  As noted above, formatting content within emails can be tampered with to make an email seem as though it's from someone else.

One of the more common techniques with phishing emails is to abuse the From: field content. This often looks like...

```
From: Chris Beard (cbeard@mozilla.com) <abadguy@evil.com>
To: You <you@example.com>
Subject: An Example Subject
```

If you observe this or some other behavior that suggests you've received a phishing email, please raise it with your information security team ([infosec@mozilla.com](mailto:infosec@mozilla.com) if at Mozilla) for further review. Attach a copy of the email headers for review.

# Links

Links in email addresses can be misleading when crafted in HTML, much like a link on any webpage.  It's important to hover over any links provided in emails before clicking them to ensure they take you to the correct domain.  This hover action will present you with a preview of the URL in the bottom of your email client.

A common tactic for detecting malicious URLs in email is simply making sure the link is to the right domain. Phishing attacks will often leverage common looking domains with one character subsituted in the hopes of getting you to trust them.

A legitimate link for mozilla.org would look like this when hovered...

`https://mozilla.org/`

However, an attacker may replace the 'l' with a numerical 1 to try and trick you...

`https://mozi11a.org/`

If you observe this or some other behavior that suggests you've received a phishing email and have been coerced into clicking a malicious link, it's important to raise it with your information security team ([infosec@mozilla.com](mailto:infosec@mozilla.com) if at Mozilla) for further review and attach the email headers (see above) and provide the example URL for further review.

# Attachments

Phishing emails often contain attachments in the hope that you will click and run them and compromise your workstation.  If you need to open an email attachment, make sure that you can confirm that the sender of that email is truely the sender and not a spoofed email made to look as if it was a trusted sender.  This can often be determined by examing the email headers (more details above) and generally whether that email was out of the blue from someone you rarely talk to or is outside the norm.

There are a number of malicious attachment types that are more dangerous than others, which include:

- PDF Documents (very powerful, can have embedded malcious content)
- MS Word/Excel Document (very powerful, especially in cases where Macros need to be enabled)
- Bash/.exe Files (extremely dangerous)

If you observe this or some other behavior that suggests someone is sending you unsolicited dangerous attachment types raise it with your information security team ([infosec@mozilla.com](mailto:infosec@mozilla.com) if at Mozilla) for further review and attach the email headers (see above) and provide the example attachment for further review.


## References/Additional Reading

- <https://support.google.com/mail/answer/29436?hl=en>
