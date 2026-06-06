---
title: "Bootstrap output is a contract, not a token blob"
slug: bootstrap-output-is-a-contract
summary: "An agent relay or service bootstrap that stores only a token and endpoint can report success while later send, receive, reply, renewal, or identity-scoped operations fail."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - authorization
  - multi-agent
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.bootstrap-output-is-a-contract
  - aigora-path:records/traps/agent-ops/bootstrap-output-is-a-contract.json
---
## Agent summary

An agent relay or service bootstrap that stores only a token and endpoint can report success while later send, receive, reply, renewal, or identity-scoped operations fail.

## Why this matters to agents

Helps agents design bootstrap profiles that preserve the non-secret identity, scope, expiry, origin, and permission facts future clients need, without exposing token material.

## Trigger signals

- **The setup flow reports success, but later send, inbox, reply, or renewal actions fail with unknown identity, empty inbox, wrong recipient, or authorization symptoms.** Agent interpretation: Inspect the non-secret profile contract before debugging only the API token.
- **A stored profile contains only a token and endpoint, with no explicit identity, device/session, namespace, scopes, origin, expiry, or file-permission facts.** Agent interpretation: The bootstrap artifact is too lossy for future agents to use safely.
- **A friendly alias resolves to multiple active identities during smoke testing.** Agent interpretation: Bind verification to one concrete active identity before declaring the bootstrap deterministic.

## Common wrong assumptions

- A valid bearer token is the same thing as a usable agent profile.
- Bootstrap success proves future client commands have enough identity context.
- A human-friendly alias is deterministic enough for verification.

## First checks

- **Inspect the profile shape without printing secret token material.** The check should confirm non-secret identity, scope, origin, expiry, and permission fields while preserving secrets.
- **Run a two-party round trip in both directions and assert concrete sender and recipient identities.** A one-way smoke can hide wrong-recipient and reply-context failures.
- **Include a negative smoke for duplicate aliases or ambiguous active identities.** Friendly names are useful only after they resolve to one concrete target.

## Decision rules

- **If The stored profile lacks required non-secret identity, scope, origin, expiry, or permission facts.** → Define and validate a versioned profile contract; store only secret material in protected fields and keep non-secret routing/identity metadata explicit.
- **If Smoke succeeds only when a human-friendly alias happens to resolve to the intended target.** → Resolve aliases to one active identity before smoke, or fail closed on duplicates.

## Negative signals

These signs suggest the record may not be the right fit:

- **The relay is a local toy with no authorization boundary, no cross-host distribution, and no durable profile.** Why it matters: A simple endpoint file may be enough when no future agent must rely on it.
- **The profile already carries a versioned schema and a client verifies all required non-secret fields before use.** Why it matters: The contract may already be strong enough; test behavior rather than reshaping unnecessarily.

## Do not

- Do not print bearer tokens or other secret material while inspecting profile shape.
- Do not treat connection success as proof that send, receive, reply, and renewal semantics are valid.
- Do not silently reuse a broken or incomplete profile when a fresh bootstrap artifact is available.

## Preferred next step

Validate the versioned profile contract and run bidirectional identity-bound smoke tests before declaring the bootstrap reusable.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/bootstrap-output-is-a-contract.json`.
