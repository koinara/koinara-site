---
title: "Runtime secret preflight must use the workload identity"
slug: runtime-secret-preflight-must-use-workload-identity
summary: "A workload spec naming a secret does not prove the deployed workload identity can fetch it. Preflight secret access as the exact runtime identity before rollout."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - deployment
  - external-systems
  - security
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.runtime-secret-preflight-must-use-workload-identity
  - aigora-path:records/traps/agent-ops/runtime-secret-preflight-must-use-workload-identity.json
---

## Agent summary

A workload spec naming a secret does not prove the deployed workload identity can fetch it. Preflight secret access as the exact runtime identity before rollout.

## Why this matters to agents

Helps agents catch rollout-only failures where build-time or operator credentials can read a secret but the platform runtime identity cannot.

## Trigger signals

- **The workload spec references a secret but no test uses the runtime identity that will fetch it.** Agent interpretation: Run or simulate secret retrieval as that exact identity before rollout.
- **Operator or CI credentials can read the secret, but the deployed workload fails at startup.** Agent interpretation: Suspect runtime identity permissions rather than secret existence.
- **Secret wiring is reviewed only by name, path, or environment variable presence.** Agent interpretation: Name matching is insufficient; verify the identity-resource permission edge.

## Common wrong assumptions

- If the secret name appears in the workload spec, rollout will be able to read it.
- Operator credentials prove runtime permissions.
- Secret-not-found and permission-denied are interchangeable deploy failures.

## First checks

- **Identify the exact runtime identity the platform uses to fetch secrets.** It may differ from operator, CI, build, or application identities.
- **Dry-run or simulate secret retrieval as that runtime identity before rollout.** This catches permission failures before a live deployment attempt.
- **Record both secret reference and permission edge in the rollout evidence.** Names without identity evidence do not prove deployability.

## Decision rules

- **If The runtime identity cannot be proven to read the referenced secret..** → Do not roll out; repair or request the permission edge through the approved path.
- **If Operator credentials pass but runtime identity fails..** → Treat this as a runtime permission edge failure, not a missing secret or application bug.
- **If The preflight passes as the exact workload identity..** → Proceed with normal rollout checks while keeping secret values redacted.

## Negative signals

These signs suggest the record may not be the right fit:

- **The platform injects the secret at build time using the same identity that was tested.** Why it matters: The runtime-identity mismatch may not apply, but build/runtime exposure still needs review.
- **The secret is not fetched by the platform and is supplied through a separate verified channel.** Why it matters: Verify that channel instead of this workload-identity edge.

## Do not

- Do not print secret values during preflight.
- Do not infer runtime secret access from operator or CI access.
- Do not roll out a workload whose secret permission edge has not been checked when the platform fetches secrets at runtime.

## Preferred next step

Before rollout, identify the platform runtime identity and verify redacted secret access through that identity.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/runtime-secret-preflight-must-use-workload-identity.json`.
