---
title: "Webhook acknowledgements and auth identity must follow the provider contract literally"
slug: webhook-ack-layer-and-auth-identity
summary: "Webhook receivers can fail by treating transport success, structured provider result codes, persistence timing, and authentication identity as one layer. Model each contract layer explicitly."
date: 2026-06-13
tags:
  - agent-ops
  - authorization
  - common-ai-mistake
  - external-systems
  - web-security
  - webhook
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.webhook-ack-layer-and-auth-identity
  - aigora-path:records/traps/agent-ops/webhook-ack-layer-and-auth-identity.json
---

## Agent summary

Webhook receivers can fail by treating transport success, structured provider result codes, persistence timing, and authentication identity as one layer. Model each contract layer explicitly.

## Why this matters to agents

Helps agents avoid hiding actionable provider result codes, acknowledging before durable persistence, or trusting display identifiers as authentication truth.

## Trigger signals

- **The provider documentation distinguishes HTTP acknowledgement from an application-level result code.** Agent interpretation: Return the transport status the provider expects and put actionable receiver-known errors in the structured body.
- **The handler uses a public display identifier, URL slug, or request label as authentication truth.** Agent interpretation: Fail closed until the provider contract says that identifier is security-relevant and verifies it cryptographically or through a trusted channel.
- **The handler returns success to the provider before the local side effect is durably persisted.** Agent interpretation: Move acknowledgement after durable persistence or make retry/reconciliation semantics explicit.

## Common wrong assumptions

- HTTP 200 always means the webhook operation succeeded semantically.
- A 4xx response is the clearest way to communicate every receiver-known error.
- A public account or object identifier in the payload is enough to authenticate the sender.

## First checks

- **Read the provider contract for transport acknowledgement, structured result body, retry behavior, and auth identity separately.** Webhook contracts often split these layers in non-obvious ways.
- **Log safe diagnostics such as hash prefix and payload length rather than raw secret or payload values.** Diagnostics should prove parsing/auth paths without leaking credentials or private content.
- **Test the known-error path and the durable-persist-before-ack path.** Both paths often pass happy-path smoke while still failing real provider retries.

## Decision rules

- **If The provider expects HTTP 200 with a structured result code for receiver-known errors..** → Return the documented transport acknowledgement and encode the actionable error in the structured response body.
- **If Auth truth is ambiguous or based only on public identifiers..** → Reject or quarantine the request until the authenticated identity source is verified against the contract.
- **If The external sender may retry based on acknowledgement timing..** → Persist the local side effect before acknowledging, or document a retry-safe reconciliation path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The provider explicitly requires non-2xx transport failures for the exact condition.** Why it matters: Then the structured-body pattern may be wrong; follow the documented retry contract.
- **The identifier is a signed claim or verified subject in the provider contract.** Why it matters: Then it can contribute to auth, but only after signature and freshness checks.

## Do not

- Do not collapse HTTP status, application result code, persistence, and authentication identity into one boolean success flag.
- Do not expose raw secrets or payloads in diagnostics.
- Do not accept a public display identifier as authorization proof by default.

## Preferred next step

Map the webhook contract into transport, result-body, auth-identity, and persistence-timing layers before editing the handler.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/webhook-ack-layer-and-auth-identity.json`.
