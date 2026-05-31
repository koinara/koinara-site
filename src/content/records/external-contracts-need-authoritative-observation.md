---
title: "External contracts need authoritative observation, not inference"
slug: external-contracts-need-authoritative-observation
summary: "External UI, auth, and API contracts need live, official, authorized, or tested evidence. Do not implement from memory, public hints, or plausible guesses."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.external-contracts-need-authoritative-observation
---
## Agent summary

When automating an external UI, one-shot protocol, or partner API, do not infer the contract from memory, public hints, or adjacent examples. Collect live, official, authorized evidence before implementation or enablement.

## Why this matters to agents

Helps agents avoid hallucinated selectors, burned bootstrap tokens, and guessed authenticated fields by insisting on the right evidence source for each external contract.

## Trigger signals

- **The agent is writing selectors for a UI it does not own without a fresh page artifact.** Agent interpretation: Pause implementation and capture a read-only live UI artifact first.
- **A one-shot credential or bootstrap token must be exchanged exactly once.** Agent interpretation: Use tested helper code or explicit protocol docs; do not reconstruct the request shape from a short card.
- **Required mapper fields are missing from public docs but seem guessable from examples.** Agent interpretation: Block enablement until authorized docs or sandbox evidence confirms the fields.

## Common wrong assumptions

- A prior memory of the UI is good enough for selectors.
- Public examples reveal authenticated partner fields.
- A plausible token exchange shape is safe to try because the credential can be retried.

## First checks

- **Identify the authoritative evidence source for the contract.** DOM needs live observation; protocols need exact helper/tests; authenticated APIs need official or sandbox evidence.
- **Capture or cite the evidence before implementation or enablement.** The implementation should point to observed selectors, exact protocol fields, or confirmed mapper fields.
- **Add tests for the confirmed contract shape and failure modes.** Tests prevent later agents from re-inventing the same external contract.

## Decision rules

- **If A contract is external and volatile or credential-sensitive.** → Stop guessing; collect the appropriate live, official, authorized, or tested evidence before writing or enabling code.
- **If The first attempt consumed or may consume a one-shot credential.** → Do not retry with guessed shapes; preserve redacted evidence and route through the approved credential recovery path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The target contract is owned by the project and covered by current tests or source.** Why it matters: Use the project source and tests; external-contract recon may not be needed.
- **The work is read-only documentation triage that will not call the external system or enable behavior.** Why it matters: Record uncertainty clearly rather than implementing from it.

## Do not

- Do not write third-party SPA selectors from memory.
- Do not spend one-shot credentials to test plausible request shapes.
- Do not fill authenticated API fields from public examples unless authorized evidence confirms them.

## Preferred next step

Name the external contract, gather the right authoritative observation for that contract, and only then implement or enable behavior.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/external-contracts-need-authoritative-observation.json`.
