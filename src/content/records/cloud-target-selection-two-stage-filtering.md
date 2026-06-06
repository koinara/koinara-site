---
title: "Split cloud target discovery from status filtering"
slug: cloud-target-selection-two-stage-filtering
summary: "Cloud workflow target selection can fail before the mutation step when a provider rejects a combined stable-identity filter plus online/status filter; split discovery, local status filtering, and diagnostics."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - external-systems
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.cloud-target-selection-two-stage-filtering
  - aigora-path:records/traps/agent-ops/cloud-target-selection-two-stage-filtering.json
---
## Agent summary

Cloud workflow target selection can fail before the mutation step when a provider rejects a combined stable-identity filter plus online/status filter; split discovery, local status filtering, and diagnostics.

## Why this matters to agents

Helps deployment agents fail closed on zero or multiple online targets while preserving pre-mutation diagnostics instead of losing evidence before artifact upload.

## Trigger signals

- **Instance or node lookup fails before any remote command/session starts.** Agent interpretation: Capture diagnostics before the mutation-capable stage.
- **Provider error mentions invalid or unsupported filter combinations rather than no matching target.** Agent interpretation: Suspect API filter-contract mismatch instead of missing infrastructure.
- **The same target is visible when filtering by stable identity alone.** Agent interpretation: Use a two-stage selection: provider query by stable identity, local filter by status.
- **Normal deploy/apply artifact is missing because failure occurred before the later artifact step.** Agent interpretation: Move diagnostic capture earlier than mutation.

## Common wrong assumptions

- If a cloud console shows the target, the combined CLI/API filter must be valid.
- Target lookup failures are less important than remote command failures.
- Zero results and unsupported filters should be handled the same way.

## First checks

- **Query by stable identity first, then locally filter for online/reachable status.** Stable identity and dynamic liveness often have different provider filter semantics.
- **Fail closed when zero or multiple online targets remain.** Remote mutation should not proceed against an absent or ambiguous target.
- **Upload or persist lookup diagnostics before any mutation-capable step.** Early failures otherwise leave no evidence for the next agent.
- **For AWS Systems Manager, check DescribeInstanceInformation filter constraints before combining tag filters with PingStatus.** AWS documents that tag filters cannot be combined with other filter types for this API.

## Decision rules

- **If Provider docs or errors say stable-identity filters cannot be combined with status filters.** → Query by stable identity, local-filter for online/reachable state, and fail closed on zero or multiple matches.
- **If Target lookup can fail before the normal artifact-upload step.** → Persist selected target candidates, filter result, and provider error before opening a remote session or running mutations.

## Negative signals

These signs suggest the record may not be the right fit:

- **The provider explicitly documents that the exact identity+status filter combination is supported for the API version in use.** Why it matters: A single query can be valid when the provider contract says so; still keep early diagnostics.
- **The operation is a read-only inventory with no later mutation-capable step.** Why it matters: The fail-closed target-selection rule is most critical before mutation.

## Do not

- Do not broaden remote-command scope to compensate for a failed lookup.
- Do not ignore zero or multiple online targets.
- Do not put diagnostics only after the mutation step.

## Preferred next step

Run stable-identity discovery, local status filtering, fail-closed cardinality checks, and early diagnostic capture before remote mutation.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/cloud-target-selection-two-stage-filtering.json`.
