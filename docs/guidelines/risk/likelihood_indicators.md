---
layout: default
resource: true
categories: [Guidelines, Risk]
title: Likelihood Indicators
description: A model for determining how security controls affect risk
---

*The goal of this document is to describe a methodology for determining what
effect on the likelihood component of risk a missing security control will have*

# Overview

Service risk is composed both of the impact when a risk is manifested as well as
the likelihood that the risk will manifest. Impact can be assessed in a
[Rapid Risk Assessment](guidelines/risk/rapid_risk_assessment)
and is primarily based on the data which the service handles.
Likelihood on the other hand is primarily driven by the presence or absence of
security controls in the service.

What follows is a methodology for associating likelihood indicators with
security controls.

# Meaning of the likelihood indicators

The likelihood indicator for a given security control is the likelihood that
a vulnerability in the service will be exploited in a calendar year due to the 
absence of the security control.

The indicators use the [Standard levels reference](standard_levels)
and can be translated as:
* <span class="risk-low">LOW</span> likelihood : The absence of this security 
  control is unlikely to cause a risk to manifest. It may cause security 
  incident response to be slower or more difficult. This causes HIGH and MAXIMUM
  impacts to result in MEDIUM risk.
* <span class="risk-medium">MEDIUM</span> likelihood : The absence of this
  security control may cause a risk to manifest in the coming year. This
  security control is important but with additional supporting controls may not
  be required. This causes MAXIMUM impacts to result in HIGH risk.
* <span class="risk-high">HIGH</span> likelihood : The absence of this security
  control will probably cause a risk to manifest in the coming year. This
  security control is important and should only be missing for LOW impact
  services. This causes MEDIUM and HIGH impacts to result in HIGH risk and
  MAXIMUM impacts to result in MAXIMUM risk.
* <span class="risk-maximum">MAXIMUM</span> likelihood : The absence of this
  security control will cause a risk to manifest in the coming year. This
  security control is required. This causes MEDIUM impacts to result in HIGH
  risk. This causes HIGH and MAXIMUM impacts to result in MAXIMUM risk.

# Determining the likelihood indicator for a security control

When determining the likelihood indicator for a security control consider

* How easy is it for a threat agent to determine the existence of a vulnerability
* How easy is it for a threat agent to determine that a control to protect
  against the vulnerability is missing
* How easy is it for a threat agent to exploit a vulnerability in the service
  when that control is missing
* To what degree do missing security controls make it easier to discover
  vulnerabilities in the service
* Are there current ongoing attacks on other services which are protected by
  this security control
* How often has the service suffered an incident due to this or this type of 
  missing control in the past?

## The Reverse Engineering Method

This method involves thinking of hypothetical data being protected by the
security control, calculating the risks resulting from that data's impact level
and the various possible likelihood indicator levels and looking for which
resulting risk matches best.

### LOW likelihood

| Impact  | Risk   |
| ------- | ------ |
| <span class="risk-low">LOW</span>         | <span class="risk-low">LOW</span>       |
| <span class="risk-medium">MEDIUM</span>   | <span class="risk-low">LOW</span>       |
| <span class="risk-high">HIGH</span>       | <span class="risk-low">LOW</span>       |
| <span class="risk-maximum">MAXIMUM</span> | <span class="risk-medium">MEDIUM</span> |

### MEDIUM likelihood

| Impact  | Risk   |
| ------- | ------ |
| <span class="risk-low">LOW</span>         | <span class="risk-low">LOW</span>       |
| <span class="risk-medium">MEDIUM</span>   | <span class="risk-medium">MEDIUM</span> |
| <span class="risk-high">HIGH</span>       | <span class="risk-medium">MEDIUM</span> |
| <span class="risk-maximum">MAXIMUM</span> | <span class="risk-high">HIGH</span>     |

### HIGH likelihood

| Impact  | Risk    |
| ------- | ------- |
| <span class="risk-low">LOW</span>         | <span class="risk-medium">MEDIUM</span>   |
| <span class="risk-medium">MEDIUM</span>   | <span class="risk-high">HIGH</span>       |
| <span class="risk-high">HIGH</span>       | <span class="risk-high">HIGH</span>       |
| <span class="risk-maximum">MAXIMUM</span> | <span class="risk-maximum">MAXIMUM</span> |

### MAXIMUM likelihood

| Impact  | Risk    |
| ------- | ------- |
| <span class="risk-low">LOW</span>         | <span class="risk-medium">MEDIUM</span>   |
| <span class="risk-medium">MEDIUM</span>   | <span class="risk-high">HIGH</span>       |
| <span class="risk-high">HIGH</span>       | <span class="risk-maximum">MAXIMUM</span> |
| <span class="risk-maximum">MAXIMUM</span> | <span class="risk-maximum">MAXIMUM</span> |

# Communicating the likelihood indicator

Likelihood indicators should be sent in the [Service Mapper
format](https://github.com/mozilla/service-map/blob/master/models/v1/indicators/indicator.py#L61-L89)
