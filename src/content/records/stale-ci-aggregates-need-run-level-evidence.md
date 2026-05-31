---
title: "Stale CI aggregates need run-level evidence"
slug: stale-ci-aggregates-need-run-level-evidence
summary: "Aggregate CI status can lag or disagree with workflow runs. Inspect run conclusions, URLs or IDs, and timestamps before deciding."
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
  - aigora-record:trap.agentops.stale-ci-aggregates-need-run-level-evidence
---
## Agent summary

Aggregate CI status can lag or disagree with underlying workflow runs after merges and transitions. Before waiting, failing, or reporting success, inspect the concrete run conclusions, URLs, IDs, and timestamps.

## Why this matters to agents

Helps agents avoid unnecessary waiting loops and false status reports when a pull request or branch aggregate is stale but individual CI runs have already concluded.

## Trigger signals

- **Aggregate check status remains pending or stale after a workflow run appears complete.** Agent interpretation: Inspect the underlying run details before declaring a block.
- **Different CI surfaces disagree about the same commit or pull request.** Agent interpretation: Prefer concrete run IDs and timestamps as evidence.

## Common wrong assumptions

- The aggregate status is always fresher than the workflow run page.
- A pending aggregate means no useful CI evidence exists.
- A green individual job means the required check policy is satisfied without checking the target commit.

## First checks

- **Open or query the individual workflow runs for the exact target commit.** Run-level conclusion and timestamp reveal whether the aggregate is merely stale.
- **Record run conclusion, run URL or ID, and completion timestamp in the gate evidence.** Concrete evidence prevents vague "CI seems stuck" reports.
- **Compare required-check names against the runs you inspected.** A completed run only satisfies the gate if it corresponds to the required check for the target commit.

## Decision rules

- **If Aggregate status is stale but underlying required runs for the exact target commit have succeeded.** → Report the run-level evidence and refresh/retry the aggregate query before waiting longer.
- **If Aggregate is pending because required runs are skipped or absent.** → Do not bypass the gate; inspect workflow trigger/required-check configuration through the normal review path.

## Negative signals

These signs suggest the record may not be the right fit:

- **Underlying runs are also pending, queued, or missing for the target commit.** Why it matters: Waiting or triggering the expected run may be correct.
- **A required check is genuinely absent because a workflow was skipped by path, branch, or policy filters.** Why it matters: That is a required-check semantics problem, not just aggregate lag.

## Do not

- Do not wait indefinitely on a stale aggregate without checking underlying runs.
- Do not report CI green from an underlying run unless it matches the exact target commit and required check.
- Do not bypass required checks because an aggregate UI looks confused.

## Preferred next step

Compare the aggregate with underlying workflow run conclusions, URLs/IDs, and timestamps for the exact target commit before deciding.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/stale-ci-aggregates-need-run-level-evidence.json`.
