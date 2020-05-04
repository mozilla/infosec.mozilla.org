---
layout: default
resource: true
categories: [Guidelines,Risk]
title: Assessing Security Risk
description: An open framework to assess security risk from an operational perspective
---

*The goal of these documents is to help you understand how Mozilla's Security team risk framework is utilized. It also
aims to help create your own framework when official standards are too inflexible or convoluted to implement. Most of
Mozilla's framework is inspired by [ISO 31000](https://www.iso.org/iso/home/standards/iso31000.htm) and [ISO
27001](https://en.wikipedia.org/wiki/ISO/IEC_27001) and other well-known prior efforts*

It is recommended to read the [FAIR Introduction](https://web.archive.org/web/20141118061526/http://www.riskmanagementinsight.com/media/docs/FAIR_introduction.pdf)
as an introduction to how risk is generally assessed, and get familiar with the terms. Note that we do not use the FAIR
methodology, however, the concepts are well exposed in their documentation

# What is risk?
Risk is commonly defined as: `risk = impact * likelihood`

Where:
 - Impact (also called risk impact) defines 'how bad' things can get, the worst-case scenario.
 - Likelihood defines the probable frequency, or rate at which the impacts we assessed may occur.

## Risk impact
Assessing impact is a relatively finite, quantitative exercise. When imagining a threat scenario, attacks, etc. we can
define the maximum amount of how much money we might lose, or how badly our reputation would be damaged, how many
employees would be unable to work, etc.

Risk impact generally does not change quickly over time unless services and products are redesigned, large features are
added, new types of data is processed, etc.

A note on "probable worse-case impact":
We tend to assess what is often called the "reasonable worse-case impact" or "probable worse-case impact", i.e., ruling
out overly unrealistic scenarios such as "what if an asteroid the size of a city hits the planet" or "what if 4
differently located data-center catch fire", etc.

## Risk likelihood
Likelihood is defined by the frequency at which the assessed impacts may occur. Unlike assessing impacts, this can be
difficult and frustrating. Given an existing vulnerability, how do you assess if it's going to be exploited? There are
several methods, many of which qualitative with various degree of accuracy.

Likelihood is volatile and changes quickly over time. New vulnerabilities are discovered daily, and the environment in
which services are setup evolves, is reconfigured, changed constantly.

In short, while more difficult, assessing likelihood with some degree of accuracy is key to a assessing risk.

# Risk Framework

## RRA: Rapid Risk Assessment (risk impact analysis)

We analyze and assess risk with a lightweight threat model we call the RRA (Rapid Risk Assessment). It consists of a
30-60min discussion with involved parties that is service based.

Each service is assessed from a high level perspective, and sometimes the threat model it extended and completed with
details, or shortened when not necessary.  The RRA allows us to right-size risk assessments quickly and efficiently -
striking the right balance is paramount when hundred of services and vendors are used day to day.

Despite it's name, the RRA mainly focuses on assessing risk impact and only partially covers risk likelihood (such as by
recording the frequency at which bad impacts occurred in the past, if any).

- [RRA: Rapid Risk Assessment manual](risk/rapid_risk_assessment)

## Likelihood indicators

We utilize what we call likelihood indicators in order to assess the probably for an impact to occur.
Different scanners, such as the [Mozilla Observatory](https://observatory.mozilla.org), internal vulnerability scanners,
bug metrics, etc. emit short and lightweight JSON documents that contain an indicator of how likely an event or finding
is to contribute to the likelihood for a service to be attacked successfully.

- How to use, generate and understand [likelihood indicators](risk/likelihood_indicators)

## Service mapper

The service mapper is an API that collects RRA and likelihood indicator data. It calculates various scenarios based on
the `risk = impact * likelihood` formula, with some tweaks depending on the scenario being calculated.

The amount of indicators and the scenarios output allow machines and humans to quickly interpret the data and figure out
if a service or asset risk is increasing or decreasing over time. Alerts can also be generated for incident response
teams based on that data, for example.

- [Service Mapper](https://github.com/mozilla/service-map)

## Standard Levels

In order to efficiently communicate how important the risk is, we standardized our own risk levels. This is mainly
because there are several different methods that all use similar wording and different meaning, confusing everyone.

Our levels are simple and well defined (at least, according to us!). They can be used in multiple ways, to assess
criticality, risk, urgency, work-effort, etc. in a completely standardized way.

- [Standard levels reference](risk/standard_levels)
- [Scoring and other levels](risk/scoring_and_other_levels)


# Reference documents

- [Introduction to modern risk analysis](https://web.archive.org/web/20141118061526/http://www.riskmanagementinsight.com/media/docs/FAIR_introduction.pdf)
- [ISO 31000](https://www.iso.org/iso-31000-risk-management.html)
- [ISO 27001](https://en.wikipedia.org/wiki/ISO/IEC_27001)
- [In
  French - EBIOS method](https://www.ssi.gouv.fr/guide/ebios-2010-expression-des-besoins-et-identification-des-objectifs-de-securite/)
- [CIS Critical Security Controls](https://www.cisecurity.org/controls/cis-controls-list/)
- [Visualizations common in Risk Management](https://creately.com/blog/diagrams/risk-management-techniques/)
