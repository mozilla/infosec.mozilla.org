---
layout: default
resource: true
categories: [Guidelines]
title: Standard Levels
description: Standardized levels for security risk, effort and other measurements.
---

*The goal of this document is to ensure consistency, coherence between
security documents. All Mozilla security documentation must follow the
recommendations below.*

This document establishes standard level conventions, in particular:

  - Level color coding
  - Name or name schemes
  - Level expectation

**Looking for scores instead?** While all document **must** still express risk using the standard levels, you can refer
to the [Scoring and other levels](scoring_and_other_levels) guideline for scoring, pass/fail, RFC2119 definitions,
document readiness, etc.

# Standard Documentation Levels

We strongly emphasize on presenting risk levels in all documents, pages, etc. It allows for a common representation of
risk regardless of tools and other nomenclature used. If you use a scoring system for example, and your score is F, you
are at higher risk - but it could mean different things on different tools. For this reason, the risk levels are the
most important levels and **must** always be followed and present.

See also [Assessing Security Risk](/guidelines/assessing_security_risk) for an introduction to risk and our processes related to
risk.

## Standard risk levels definition and nomenclature

*The risk levels also represent a simplified ISO 31000 equivalent (and are non-compliant with ISO 31000).* These levels
are also used to display important, effort, risk impact, risk probability and any risk related level.

<table>
<thead>
<tr class="header">
<th><p>Risk Level</p></th>
<th><p>Expectations</p></th>
<th><p>Rationale</p></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><span style="background-color: #d04437; border-radius: .25em; color: #ffffff; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">MAXIMUM Risk</span> <span style="color: #ccc; font-size: 0.5em; font-style: italic">HTML Color code #d04437</span></p></td>
<td><p><em>This is the most important level, where the risk is especially great.</em></p>
<ul>
<li><strong>Attention</strong>: Full attention from all concerned parties required.</li>
<li><strong>Impact</strong>: High or maximum impact.</li>
<li><strong>Effort</strong>: All resources engaged on fixing issues. Following standard/guidelines is required.</li>
<li><strong>Risk acceptance</strong>: Rarely accepted as residual risk, must be discussed, and must be mitigated or remediated.</li>
<li><strong>Exception time (SLA)</strong>: Recommend fixing <strong>immediately</strong>.</li>
</ul></td>
<td><ul>
<li>Red signifies &quot;most important&quot;.</li>
<li>Maximum is a level. Critical is not.</li>
</ul></td>
</tr>
<tr class="even">
<td><p><span style="background-color: #ffd351; border-radius: .25em; color: #594300; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">HIGH Risk</span> <span style="color: #ccc; font-size: 0.5em; font-style: italic">HTML Color code #ffd351</span></p></td>
<td><ul>
<li><strong>Attention</strong>: Full attention from all concerned parties required.</li>
<li><strong>Impact</strong>: Medium, high or maximum impact.</li>
<li><strong>Effort</strong>: Some key resources engaged on fixing the issue. Following standard/guidelines is required.</li>
<li><strong>Risk acceptance</strong>: Risk must be discussed, and must at least be mitigated.</li>
<li><strong>Exception time (SLA)</strong>: Recommend remediation within <strong>7 days</strong>.</li>
</ul></td>
<td><ul>
<li>Yellow generally signifies &quot;warning&quot;. In our case it correlates to &quot;important&quot;.</li>
</ul></td>
</tr>
<tr class="odd">
<td><p><span style="background-color: #4a6785; border-radius: .25em; color: #ffffff; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">MEDIUM Risk</span> <span style="color: #ccc; font-size: 0.5em; font-style: italic">HTML Color code #4a6785</span></p></td>
<td><ul>
<li><strong>Attention</strong>: Attention from all concerned parties.</li>
<li><strong>Impact</strong>: Low, medium or high impact.</li>
<li><strong>Effort</strong>: <em>Best effort</em>. Following standard/guidelines is required.</li>
<li><strong>Risk acceptance</strong>: Risk should be discussed, and at least mitigated.</li>
<li><strong>Exception time (SLA)</strong>: Recommend remediation within <strong>90 days</strong>.</li>
</ul></td>
<td><ul>
<li>Blue is calm and neutral.</li>
</ul></td>
</tr>
<tr class="even">
<td><p><span style="background-color: #cccccc; border-radius: .25em; color: #000000; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">LOW Risk</span> <span style="color: #ccc; font-size: 0.5em; font-style: italic">HTML Color code #cccccc</span></p></td>
<td><ul>
<li><strong>Attention</strong>: Expected but not required.</li>
<li><strong>Impact</strong>: Low or medium impact.</li>
<li><strong>Effort</strong>: <em>Best effort</em> and <strong>best practices</strong> expected.</li>
<li><strong>Risk acceptance</strong>: Risk may often be accepted as residual risk.</li>
<li><strong>Exception time (SLA)</strong>: Indefinitely.</li>
</ul></td>
<td><ul>
<li>Gray is a low contrast color, which signifies not too important. It's also less catchy.</li>
<li>Green is not used as green means &quot;ok to do&quot;, which is not a level.</li>
</ul></td>
</tr>
<tr class="odd">
<td><p><span style="background-color: #ffffff; border: solid 1px #aaaaaa; border-radius: .25em; color: #000000; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">UNKNOWN Risk</span> <span style="color: #ccc; font-size: 0.5em; font-style: italic">HTML Color code #ffffff</span></p></td>
<td><ul>
<li>Data collection is expected.</li>
<li>This level is expected to change to one of the other levels.</li>
</ul></td>
<td><ul>
<li>White represent the emptiness/lack of data.</li>
</ul>
<p>This is <strong>not a true level</strong>, it is used when there to represent that we do not have enough data to correctly assess the level (i.e. data collection work is required).</p>
<p>Note: communicating the risk of not knowing is challenging and prone to failure, in particular when once data has been gathered, the risk appears to in fact be low.</p>
<p>This concept is also known as <em>&quot;trust, but verify&quot;</em> - i.e. unknown does not distrust (by assign it a higher risk) the service, user, etc. by default.</p></td>
</tr>
<tr class="even">
</tr>
</tbody>
</table>

## Examples of usage

<span style="background-color: #cccccc; border-radius: .25em; color: #000000; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">LOW Risk</span>

  - **Attention** Service owner or delivery team may look at it, through email or other means.
  - **Effort** Flip a configuration switch, change a password, lookup a document, etc.
  - **Risk acceptance** Accept risk of leaking non-sensitive data as peer-review process is light.

<span style="background-color: #4a6785; border-radius: .25em; color: #ffffff; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">MEDIUM Risk</span>
  - **Attention** Service owner or delivery team must be informed via bug, document, etc.
  - **Effort** Take a group decision, create standards, lookup statistics, manual upgrades, etc.
  - **Risk acceptance** Mitigate the risk of attackers accessing the admin panel by using SSO.

<span style="background-color: #ffd351; border-radius: .25em; color: #594300; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">HIGH Risk</span>
  - **Attention** Ensure service, product owner is aware via bug and pings.
  - **Effort** Implement a new security control, code a new feature, change all company user passwords, etc.
  - **Risk acceptance** Hotfix to mitigate within the next few days, eventually turn off if it takes too long.

<span style="background-color: #d04437; border-radius: .25em; color: #ffffff; display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">MAXIMUM Risk</span>
  - **Attention** Ensure service,product, capability owner is aware via bug and pings.
  - **Effort** Implement a new security design/change product design, etc.
  - **Risk acceptance** Turn service off/put it behind VPN until fixed/ASAP.

  - Your site scored
    <span style="background-color: #ffd351; border-radius: .25em; color: #594300; display: inline-block; font-weight:
bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase; text-align: center;">C</span> to
the HTTP observatory tests, it is at <span style="background-color: #4a6785; border-radius: .25em; color: #ffffff;
display: inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform:
uppercase; text-align: center;">MEDIUM Risk</span>.
  - You have 1 immediately exploitable RCE vulnerability of maximum
    impact and are at <span style="background-color: #d04437; border-radius: .25em; color: #ffffff; display:
inline-block; font-weight: bold; margin: .1em 0; min-width: 6em; padding: .05em .5em; text-transform: uppercase;
text-align: center;">MAXIMUM Risk</span>.
