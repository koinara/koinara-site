---
title: "Mail provider DNS screens are not authoritative DNS"
slug: authoritative-dns-not-provider-ui
summary: "When diagnosing SPF, DKIM, DMARC, or MX failures, an agent can mistake a mail host or SaaS control panel that displays generated DNS records for the place where public DNS is actually served. The control panel may be correct locally while the authoritative registrar/DNS..."
date: 2026-06-13
tags:
  - common-ai-mistake
  - email
  - external-systems
  - safety-gates
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.email.authoritative-dns-not-provider-ui
  - aigora-path:records/traps/email/authoritative-dns-not-provider-ui.json
---

## Agent summary

When diagnosing SPF, DKIM, DMARC, or MX failures, an agent can mistake a mail host or SaaS control panel that displays generated DNS records for the place where public DNS is actually served. The control panel may be correct locally while the authoritative registrar/DNS provider has no matching public record.

## Why this matters to agents

Prevents agents from chasing application credentials, code, or propagation guesses before proving which DNS provider is authoritative for the queried name.

## Trigger signals

- **A provider UI says SPF, DKIM, DMARC, MX, or a selector exists, but external checks or message headers still show missing or failing authentication.** Agent interpretation: Split generated settings from publicly served DNS and query the authoritative nameservers directly.
- **The team is about to rotate credentials, change mail code, or add workarounds because a DNS-backed mail check fails.** Agent interpretation: First prove authoritative DNS state; otherwise the proposed fix may be irrelevant and riskier than the root cause.

## Common wrong assumptions

- A mail host control panel that displays a DKIM key has published that key to the public Internet.
- A DNS checker in one vendor console is enough evidence for every subdomain and selector.
- If authentication fails after a record was entered somewhere, the next step is credential or application debugging.
- DNS propagation is the default explanation before checking delegation and authoritative nameservers.

## First checks

- **Find the authoritative nameservers for the exact domain or subdomain being tested.** Only the authoritative DNS provider determines what public resolvers can see.
- **Compare the record host/name expected by the provider with the host/name actually queried in headers or diagnostics.** DKIM selector and subdomain mistakes can look like unpublished DNS even when some related record exists.
- **After publication, verify through both authoritative query and a fresh message header or provider test.** The record existing in DNS and the mail system using/aliging it are separate facts.

## Decision rules

- **If The generated DNS record is visible in a vendor UI but absent from authoritative DNS..** → Publish the record at the authoritative provider or correct delegation; do not rotate credentials or patch application mail logic for this symptom.
- **If The operation would mutate production DNS, credentials, mail routing, or delivery policy..** → Stop at the relevant operational gate and present the authoritative-query evidence and exact record names.

## Negative signals

These signs suggest the record may not be the right fit:

- **The provider shown in the UI is also confirmed as an authoritative nameserver for the exact zone or delegated subdomain.** Why it matters: Then the provider UI may be a valid source of public DNS truth, though external query verification is still useful.
- **External authoritative DNS queries show the required record and message headers still fail for a different reason.** Why it matters: Then the remaining problem is more likely alignment, selector mismatch, provider signing, SMTP envelope, or application configuration.

## Do not

- Do not treat a generated DNS record shown in a mail/SaaS panel as proof of public DNS publication.
- Do not change application credentials or mail code before checking authoritative nameservers when the symptom is DNS-backed authentication failure.
- Do not paste private domains, selectors, account names, or provider console screenshots into public lessons.

## Preferred next step

For mail authentication failures, first identify authoritative DNS and query the exact MX/TXT/selector record there; then decide whether the fix is DNS publication, provider signing/alignment, or application behavior.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-11.
- Source record path: `records/traps/email/authoritative-dns-not-provider-ui.json`.
