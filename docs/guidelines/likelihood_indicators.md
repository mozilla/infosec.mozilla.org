---
layout: default
resource: true
categories: [Guidelines]
title: Likelihood Indicators
description: A model for determining how security controls affect risk
---

*The goal of this document is to describe a methodology for determining what
effect on risk a missing security control will have*

# Overview

Service risk is composed both of the impact when a risk is manifested as well as
the likelihood that the risk will manifest. Impact can be assessed in a
[Rapid Risk Assessment](https://wiki.mozilla.org/Security/Risk_management/Rapid_Risk_Assessment#Recording_risk_impacts)
and is primarily based on the data which the service handles.
Likelihood on the other hand is primarily driven by the presence or absence of
security controls in the service.

What follows is a methodology for associating likelihood indicators with
security controls. These likelihood indicators can then be integrated into the
[Risk Integration Architecture](https://mana.mozilla.org/wiki/display/SECURITY/Risk+Integration+Architecture).

# Meaning of the likelihood indicators

The likelihood indicator for a given security control is the likelihood that
the service will be exploited in a calendar year due to the absence of the
security control.

The indicators use the [standard levels](https://wiki.mozilla.org/Security/Standard_Levels)
and mean
* LOW : The absence of this security control is unlikely to cause a risk to
  manifest. It may cause security incident response to be slower or more
  difficult. This causes HIGH and MAXIMUM impacts to result in MEDIUM risk.
* MEDIUM : The absence of this security control may cause a risk to manifest in
  the coming year. This security control is important but with additional
  supporting controls may not be required. This causes MAXIMUM impacts to
  result in HIGH risk.
* HIGH : The absence of this security control will probably cause a risk to
  manifest in the coming year. This security control is important and should
  only be missing for LOW impact services. This causes MEDIUM and HIGH impacts
  to result in HIGH risk and MAXIMUM impacts to result in MAXIMUM
  risk.
* MAXIMUM : The absence of this security control will cause a risk to manifest
  in the coming year. This security control is required. This causes MEDIUM 
  impacts to result in HIGH risk. This causes HIGH and MAXIMUM impacts to result
  in MAXIMUM risk.

# Determining the likelihood indicator for a security control

When determining the likelihood indicator for a security control consider

* How easy is it for a threat agent to determine that the control is missing
* How easy is it for a threat agent to exploit the fact that the control is
  missing
* How well known are the paths of exploitation mad possible by the absence of
  this security control
* Are there current ongoing attacks on other services which are protected by
  this security control

## The Reverse Engineering Method

This method involves thinking of hypothetical data being protected by the
security control, calculating the risks resulting from that data's impact level
and the various possible likelihood indicator levels and looking for which
resulting risk matches best.

<div style="float:left; width: 25%;">

### LOW likelihood

| Impact  | Risk   |
| ------- | ------ |
| LOW     | LOW    |
| MEDIUM  | LOW    |
| HIGH    | LOW    |
| MAXIMUM | MEDIUM |

</div><div style="float:left; width: 25%;">

### MEDIUM likelihood

| Impact  | Risk   |
| ------- | ------ |
| LOW     | LOW    |
| MEDIUM  | MEDIUM |
| HIGH    | MEDIUM |
| MAXIMUM | HIGH   |
</div><div style="float:left; width: 25%;">

### HIGH likelihood

| Impact  | Risk    |
| ------- | ------- |
| LOW     | MEDIUM  |
| MEDIUM  | HIGH    |
| HIGH    | HIGH    |
| MAXIMUM | MAXIMUM |
</div><div style="float:left; width: 25%;">

### MAXIMUM likelihood

| Impact  | Risk    |
| ------- | ------- |
| LOW     | MEDIUM  |
| MEDIUM  | HIGH    |
| HIGH    | MAXIMUM |
| MAXIMUM | MAXIMUM |
</div>

# Communicating the likelihood indicator

Likelihood indicators should be sent in the [standard ServiceUI format](https://mana.mozilla.org/wiki/display/SECURITY/Risk+Integration+Architecture#RiskIntegrationArchitecture-RESTInterfaces(ofServiceUI))
to the ServiceUI.