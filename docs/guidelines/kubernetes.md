---
layout: default
---

*The goal of this document is to help you understand the basics of how to securely implement [Kubernetes](http://kubernetes.io/docs/) at Mozilla.
All Mozilla sites and deployment should follow the recommendations below.
The Enterprise Information Security (Infosec) team maintains this document as a reference guide.*


# Why Kubernetes?
## Container-Based Approach
Kubernetes is a platform used to deploy containers to cloud environments. Mozilla has been using containers to develop and deploy applications for over a year, most notably powering <http://www.mozilla.org/>

## Efficiencies of Clusters Over AMI Per Application Model
Because Kubernetes hosts containers on clusters of machines, all deployed applications inherit the clusters security best practices, alerting, logging and monitoring. These are implemented once and developers only need to develop alerting/monitoring specific to their application.

## Platform Agnostic
A Kubernetes cluster can run on AWS, Rackspace, Google Compute or bare metal. This is not what one would describe as turn-key (at the moment) but with Kubernetes this is at least possible and mitigates vendor lock in risk. Additionally you can run Kubernetes on your laptop, something that is not possible with Amazon centric solutions.

## Mature / Robust
Kubernetes is a large, mature open-source project under active development. Mozilla does not have to invest resources in feature development, bug fixes, maintaining documentation and training materials or other similar tasks.

# General Security Guidelines
## AWS Security
If deploying to AWS, Mozilla AWS security standards apply: <https://mana.mozilla.org/wiki/display/POLICIES/Standard%3A+AWS+Security>

## TLS
When implementing TLS, follow Mozilla's Server Side TLS configuration guide: <https://wiki.mozilla.org/Security/Server_Side_TLS> Digicert or Let's Encrypt certificates can be installed for public facing services. Kubernetes API & workers use self-signed temporary certs by default for their internal communications.

## SSH
When implementing SSH, follow Mozilla's [OpenSSH Guidelines](openssh). If using Deis, deploy SSH keys per user as described here: <https://deis.com/docs/workflow/users/ssh-keys/>

## OpenVPN
If using OpenVPN to tunnel `kubectl` traffic, implement VPN with MFA using: <https://github.com/mozilla-it/duo_openvpn>

# Deis User Registration

As noted here: <https://deis.com/docs/workflow/users/registration/#controlling-registration-modes> the default for Deis is to allow user registration from anyone. This must be changed to admin\_only as described in the link by either:

Patch the deployment:
`kubectl --namespace=deis patch deployments deis-controller -p '{"spec":{"template":{"spec":{"containers":[{"name":"deis-controller","env":[{"name":"REGISTRATION_MODE","value":"disabled"}]}]}}}}'`

Edit the deployment directly:
`kubectl --namespace=deis edit deployments deis-controller`

## Deis Controller Whitelists

If using Deis, consider enforcing controller whitelists for IP ranges expected to interact with the deis-controller service: <https://deis.com/docs/workflow/managing-workflow/security-considerations/#ip-whitelist>

# Additional references

- <https://kubernetes.io/> (Main site for kubernetes)
- <https://deis.com/docs/workflow/quickstart/> (Deis Workflow quick start for k8s/helm/app deployment)
- <http://2016.video.sector.ca/video/189177390> (SecTor 2016 Introductory Presentation on Kubernetes security)

