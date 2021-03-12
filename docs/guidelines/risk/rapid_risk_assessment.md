---
layout: default
resource: true
categories: [Guidelines,Risk]
title: Rapid Risk Assessment (RRA)
description: A rapid methodology to perform risk analysis and create a lightweight threat model.
---

We all regularly use a risk based methodology when making decisions in day to day life, without thinking about it. The
Rapid Risk Assessment or Rapid Risk Analysis (RRA) methodology helps formalize this type of decision making and ensures
that the process is reproducible, consistent and the results are easy to communicate.

See also [Assessing Security Risk](/guidelines/assessing_security_risk) for an introduction to risk and our processes related to
risk.

# Rapid Risk Assessment

**A typical Rapid Risk Analysis/Assessment (RRA) takes about 30 minutes.** It is not a security review, a full
threat-model, a vulnerability assessment, or an audit. These types of activities may however follow an RRA if deemed
appropriate or necessary.

The main objective of the RRA is to understand the value and impact of a service to the reputation, finances,
productivity of the project or business. It is based on the data processed, stored or simply accessible by services.

Note that the RRA does not focus on enumerating and analyzing security controls. The RRA process is intended for
analyzing and assessing services, not processes or individual controls.

## Preamble

Data is the most important item in risk management. Software, websites,
infrastructure, networks and people handle, process, exchange and store
data.

The RRA focuses on creating a summary of the risks associated with your
data. Key points:

  - **Quick!** The RRA takes 30 to 60 minutes maximum.
  - **Very high-level**. Details are for complete threat models. The RRA can become a complete threat model over time
    though!
  - **Concise, readable**. Short and with clear risk levels.
  - **Easy to update**. Can be run during any phase of the project development and continuously updated.
  - **Informative**. Collects risk impact and a data dictionary. Also collections information about how the service
    functions.
  - **Let you know what to do**. The RRA includes the list of recommendations from the security team with a priority for
    each item.

This helps to make the following type of risk-based decisions:

  - Is the security provided by a given platform appropriate to host a
    specific classification of data?
  - How much should we care about maintenance, etc?
  - Is there anything obvious we should really look at fixing right now?
  - Where should we focus our efforts to significantly increase the security or the service?
  - Did we forgot anything, or had any blind spot we hadn't though of?

## Sample use scenario

Firefox accounts store user data:
- What happens if that data is disclosed to the world? What happens if the service goes down? What happens if the data is modified by someone unauthorized?
- Do these events put us at financial risk? Is our productivity affected? Is our reputation affected?
- What types of data does Firefox accounts handle? How sensitive is the primary type of data used by Firefox accounts?

The RRA risk table facilitates discovering the answers to these questions.

# How-to: Request an RRA of your service

To manually request an RRA, please [file a bug](https://bugzilla.mozilla.org/enter_bug.cgi?product=Security+Assurance&component=Rapid%20Risk%20Analysis) to our component. Please include basic information about the project, a diagram, any relevant links and 0-2 additional people to invite for the assessment.


# How-to: Attending and running RRAs

## When to run RRAs? What do I need to bring or do?

RRAs are designed to be created and updated as needed, at any time, with or without an associated meeting. That being
said, you should run the first RRA during the design or architecture phase of new services together with a trained risk
analyst.

It is also recommended to have these things available for the RRA creation:

- Name of a person or/and team responsible for the service.
- Data flow diagram.
- List the kind of data that will be processed or stored: secrets, credentials, public data, confidential data, and anything else that may be important for this service.
- An understanding of how the service works.

## When NOT to run an RRA?

RRAs can only be run on services. If you have a question about a specific feature or design choice, and how it's going
to impact other services: find which service your feature is tied to and see if there is already an RRA available.
Otherwise, request an RRA for that service, this will help us (and you) assess your feature or design choice!

**Note on large services**
Large services may be be split into multiple smaller services or sub-services that handle a specific type of data and
expose a limited set of features. This choice has to be made when running the RRA. If the sub-services are owned by
different teams, it is a strong indicator that multiple RRAs should be run.

Large services that cannot be split up not only lead to a complex assessment, but also may indicate that the service
itself needs to be re-designed in a more secure fashion.

## What to focus on during an RRA?

  - Getting **value for the service owner**. The service owner needs to understand what is most important to protect and
    if they have any blind spot.
  - **Data**. Fill in the data dictionary. You need to know most of the data the service will have access to, stored or
    processed.
  - **Impact assessment**. The RRA is the authority for impact levels and these are paramount. How bad can things get,
    what's the worse case scenario?
  - **Recording threat scenarios**. What attack scenarios were considered? Would someone else understand it?

What to **NOT** focus on:

  - Gathering security controls and figuring out how effective they are.  Don't do that! This information may be
    recorded if it comes up but do not focus on it as this is very time consuming. If the service is considered risky,
specific processes can be recommended in the RRA recommendations section to assess specific controls separately.
  - Likelihood, Security provided by service. Don't spent much time there! It is very hard to assess likelihood in most
    scenarios, and easy to get lost in "what if". We have specific, separate processes to assess likelihood. Some quick
questions may still help though, such as "what's the security history of this service?"

# Guided process for risk analysts: Running your RRA in ~30 minutes

This is a guided example of how to run an initial RRA. You will:

- Invite the relevant people to a meeting.
- Help them figure out risk impacts and record everything in the RRA doc.
- Help them figure out the next steps.
- Make them feel like they own the RRA document (and they do!).

## Before the initial RRA meeting

  - Ensure no previous RRA exist; if it does, just enhance the current RRA document
  - Create a copy of the RRA template in the RRA Google Drive directory.
    - Mozilla employees can make a copy of the template with this [redirect](https://public.us-west-2.infosec.mozilla.org/web-tools/redirect-to-new-RRA-doc.html)
    - Everyone can view the [RRA template](https://docs.google.com/document/d/1QMRdBLlQYqbn5lMmrOIBwS55Yh9fIYNp4dO3-HMyiyk/edit)
  - Invite 1 or 2 members (product/service owners, lead engineers, etc.) related
    to the service with a bit of technical knowledge.
  - Ensure the invitees attempt to bring a data flow diagram and have an understanding of the data the service stores or
    processes.
  - You do not want more than 4 or 5 people total as this will slow down the RRA significantly. Most RRAs are
    run 1 on 1 (2 people total).
  - Make sure everyone invited has **edit** rights to the document, and
    have the document opened in front of them when the RRA starts (you can also just share your screen).
  - If this is anyone's first RRA, ensure they understand the goals of the RRA and give them a short introduction to
    what the different steps will be. This both help them follow, and show that you have control of the meeting (see
next section on time management).

## Initial RRA meeting

### Time management - take control

You will be responsible for the time management when running the first RRA for a service.
This means, you will sometimes have to cut a discussion short and be assertive: we have a tendency to jump directly to
discussing security controls during risk discussions. While valuable, this is not the initial purpose of the RRA, and
controls can be better discussed once the impacts have been clearly defined.

Example red flags that indicate you should re-focus the current discussion:

- The discussion languishes (>1 minute) around "how to mitigate this very issue" or "we're doing X to ensure this never happens".
- The discussion focuses on process preferences, changes, etc. instead of just filing the RRA document.
- The discussion about how the service works takes too long (>15 minutes) and the owner has to lookup every single
  detail (you only need an overview at this stage, or the owner has to come back when they know what service they want
to look at).

A good tip is to **reserve 60 minutes** of RRA time in the calendar, and plan to run the RRA for only **30 minutes**.
This leaves you with some room for error, and handle services that weren't well understood by their owners. Best case
scenario, everyone will be happy when you cut the meeting short after only 30 minutes. In any case, always watch the
clock! Having to use more than 60 minutes for the initial RRA is considered a failure and should not happen.



### Running the RRA meeting

**Note**: If this is your first RRA, ensure that someone who has run RRAs previously is present to help you. It is good
to have attended multiple RRAs before starting your own. Your experience and understanding is key to running a
successful RRA that will help the teams and keep the service safe.

**RRA Utilities**: There is a menu at the top of the document called the "RRA Utilities" menu. Use it to set risk
impact, levels, data classification and marking the RRA as reviewed. Do use it as our scripts rely on this to copy RRAs
to our RRA API.

#### Metadata (1min)

- Fill in the service name
- Fill in the service owner: ask whom would be taking the decision to turn the service off in case of an incident, if
  it's unclear. That is the service owner.
- Lookup the owner's closest director or VP and add this as well.
- Leave "service data classification" and "highest risk impact" empty for now.

#### Service Notes (5min)

This is where you put any notes that you feel are relevant to the understanding of the service, security, etc.
Ask the service owner what the service does and a little bit of how it works. Ensure that you understand the service
well.
You should be able to reformulate what the service does, and the service owner to agree on your formulation.
Generally, you want to copy a diagram of some sort and have links back to the RRA request bug, and the service's own
website (which may be a vendor). This is also a good time to mention [the vendor questionnaire](https://docs.google.com/document/d/1idP1gGuEgeinoL6m_hsZ8lQ8wz64BeI-S53n_9kwMkU/edit?usp=sharing)
 if this is a vendor and it hasn't been filled in.

Feel free to go back to this section at any time to add any further notes.

#### Data Dictionary (5-10 minutes)

We want to know about all data the service will process or store (and not *just* store). Any data the service can touch
or see is to be considered.
You will need to ask the team or service owner about what *kind* of data the service processes or stores. Here are some
examples:

- Specific configuration data
- User or service credentials, secrets
- User data
- etc.

Set the data classification for each data type in the dictionary, such as "PUBLIC", "STAFF CONFIDENTIAL", etc. by using
the "RRA Utilities" menu.
Mozilla uses [standard classification levels](https://wiki.mozilla.org/Security/Data_Classification).

When you figure out what the bulk or the most important data is, set this as the "Service Data Classification" in the
RRA metadata.

#### Threat Scenarios (5-10 minutes)

This is where we discuss potential attack scenarios and figure out how bad things could go (worse-case scenario).
The RRA document itself contains tips about this section as well.
We do not record the threat types, attacker types, etc. in this model in order to save time.
Think about the easiest attack vectors ("threat scenarios"). While we focus on recording impact, you should also ask if
anything already happened and make a note if so, as this indicates a possible higher likelihood for the impact to occur.

Record all results and **make sure that you set an impact level** (use the "RRA Utilities" menu for this)

**Confidentiality**: What happens if all the data is disclosed to the world?

**Integrity**: What happens if the data is incorrect, misleading, website defaced, etc.?

**Availability**: What happens if the data or service is missing, deleted, or currently unreachable?

For each, run through these questions and assign an impact level if appropriate:

  - Reputation issues
    - Do we get in mainstream news? (<span class="risk-maximum">MAXIMUM impact</span>)
    - Do we get in the technical news? (<span class="risk-high">HIGH impact</span>)
    - Do we receive emails, bugs, twitter messages, etc? (<span class="risk-medium">MEDIUM impact</span>)
    - Not much? (<span class="risk-low">LOW impact</span>)
  - Productivity issues
    - Are small teams occupied on dealing with the issue for
      - Less than 24h? (<span class="risk-low">LOW impact</span>)
      - Less than 2 days? (<span class="risk-medium">MEDIUM impact</span>)
      - Less than a week? (<span class="risk-high">HIGH impact</span>)
      - More? (<span class="risk-maximum">MAXIMUM impact</span>)
    - How about large teams, or the entire company, or our user-base?
      - Less than 2h? (<span class="risk-low">LOW impact</span>)
      - Less than 24h? (<span class="risk-medium">MEDIUM impact</span>)
      - Less than 2 days? (<span class="risk-high">HIGH impact</span>)
      - More? (<span class="risk-maximum">MAXIMUM impact</span>)
  - Financial issues?
    - Would it cost money? How much?

Enhance these scenarios, eventually to create a complete threat model if the assessed impacts are HIGH or MAXIMUM and
if further security work is required, or the RRA is revisited.

##### Additional tips

- Whenever the productivity impact is HIGH or MAXIMUM, there is probably also a financial impact due to the cost of the
  workforce being impacted.
- Financial risk is sometimes hard to define, in particular when tied to contracts. When in doubt, skip it.
- If you have any HIGH or MAXIMUM impacts, propose that a more complete threat model and pen-test be run.
- Educate the project owners and lead developers of the project about the meaning of these risks and how the RRA can
  help them make decisions such as which operational environment to select, what technologies to use, and how much
effort to put into securing the project.

#### Recommendations (5 minutes)

While the RRA is not meant as a complete review, recommendations do come
up and this is a great time to have a quick 5 minute chat about these.

- Ensure all recommendations that came up (from you or the team) are mentioned here. It's also ok to fill them as you
  go!
- Use the "RRA Utilities" menu to set an impact for the recommendation ("if followed, how much would it help the
  service?") as this allow service owners to prioritize work.
- Ensure logging and access control have been mentioned. Can these be improved? Should we alert on events?
- Does this service have an incident response plan defined?
- Is the service using SSO for login?
- Is there a web site that can be assessed? If so, you can file a vulnerability assessment request directly.
- Did the service follow the security checklist and
  [principles](/fundamentals/security_principles)?

### Wrapping up

- Make sure you've filled the "Service Data Classification" up top according to your data dictionary (what you consider
  to be either the bulk of the data or the most important data is your classification)
- Make sure you've also filled the "Highest Risk Impact", this is basically the high impact recorded in the threat
  scenarios.
- Double check with the team:
  - Present the current risk impact and ask if they think it's reasonable.
  - Present the current recommendations and ask if they think anything's missing and what they should start with.
  - Ask the team if there's any additional security related question they want to ask or if anything wasn't covered.
- Add Google docs comments to the recommendations and assign the comment to the service owner, to ensure they've also
  been notified by email.
- Make sure you have marked the RRA as reviewed by yourself in the "RRA Utilities" menu.

## Reference documents and similar work

- <https://binary.protect.io/workcard.pdf>
- <https://en.wikipedia.org/wiki/ISO_31000>
- <https://web.archive.org/web/20141118061526/http://www.riskmanagementinsight.com/media/docs/FAIR_introduction.pdf>

## RRA Links

- [Current RRA requests](https://mzl.la/2c4a09F)
- [New RRA
  request](https://bugzilla.mozilla.org/enter_bug.cgi?product=Security+Assurance&component=Rapid%20Risk%20Analysis)
- [New Vulnerability
  Assessment](https://bugzilla.mozilla.org/enter_bug.cgi?product=Security+Assurance&component=Vulnerability%20Assessment)
- [RRA Support code for the Google Docs template](https://github.com/mozilla/infosec.mozilla.org/blob/master/misc/RRACodeMaster.js)
- [RRA Parsing code (convert to spreadsheet/db) for the Google Docs template](https://github.com/mozilla/infosec.mozilla.org/blob/master/misc/RRA2Spreadsheet.js)
