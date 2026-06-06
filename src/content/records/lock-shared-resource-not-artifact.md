---
title: "Lock the shared resource, not only the artifact"
slug: lock-shared-resource-not-artifact
summary: "A lock scoped to artifact or request identity prevents duplicate submissions of the same artifact but does not stop two different artifacts from concurrently mutating and superseding one shared resource."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - concurrency
  - release
  - multi-agent
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.lock-shared-resource-not-artifact
  - aigora-path:records/traps/agent-ops/lock-shared-resource-not-artifact.json
---
## Agent summary

A lock scoped to artifact or request identity prevents duplicate submissions of the same artifact but does not stop two different artifacts from concurrently mutating and superseding one shared resource.

## Why this matters to agents

Helps deployment, publication, import, and migration agents choose lock granularity that protects the mutable target for the full mutation-plus-verification window.

## Trigger signals

- **Duplicate submissions of the same artifact are prevented, but two different artifacts still run concurrently.** Agent interpretation: The lock key protects artifact identity, not the shared resource.
- **Both operations log success while final state reflects only one artifact.** Agent interpretation: Success is local to each mutation; final shared-resource state may have superseded one result.
- **A follow-up attempt risks rolling back newer work by redeploying or republishing its own artifact.** Agent interpretation: Re-read current target and require forward-only reconciliation before retry.
- **The test suite uses two copies of the same artifact but not two different artifacts for the same resource.** Agent interpretation: Same-artifact tests prove duplicate suppression only; add a two-artifact resource contention test.

## Common wrong assumptions

- A lock keyed by commit, tag, filename, or batch id protects the deployment or import target.
- If both operations log success, both outcomes are still reflected.
- Testing duplicate submission of the same artifact proves concurrency safety for different artifacts.

## First checks

- **Identify the mutable resource that must be single-writer for the whole mutation plus verification window.** The lock key should match the hazard, not merely the request identity.
- **Run a concurrency test with two different artifacts targeting the same resource.** This is the discriminator that same-artifact duplicate tests miss.
- **Assert the second operation waits or refuses before downstream mutation, and that release wakes only the next eligible waiter.** Ordering must be enforced before the shared target changes.
- **Re-read current target before retry and require forward-only reconciliation from the state observed at acquisition.** Retries must not roll back newer work.

## Decision rules

- **If Two different artifacts can mutate the same target concurrently under an artifact-scoped lock.** → Lock the shared resource for the full mutation and verification window, while keeping artifact-scoped duplicate suppression as a lower layer.
- **If The downstream target enforces forward-only compare-and-set on current state.** → A resource-wide lock may be unnecessary; keep the CAS evidence and test two-artifact races.
- **If A contender waits for the shared resource lock.** → Record holder, arrival, target metadata, and wake only the next eligible waiter after release.

## Negative signals

These signs suggest the record may not be the right fit:

- **Artifacts target disjoint resources.** Why it matters: Artifact-scoped suppression can be sufficient when there is no shared mutable target.
- **The downstream system enforces a forward-only compare-and-set or equivalent optimistic concurrency check on the shared resource.** Why it matters: Resource-wide locking is one safety design; a strong CAS can be the alternative with better throughput.
- **Head-of-line blocking would be worse than the risk and optimistic forward-only reconciliation is already enforced and tested.** Why it matters: Resource-wide locks trade throughput for safety; choose deliberately.

## Do not

- Do not claim concurrency safety from same-artifact duplicate tests alone.
- Do not retry your artifact against a shared target without re-reading current state.
- Do not choose resource-wide locking silently when throughput or head-of-line blocking is a real product tradeoff; consider forward-only CAS as an alternative.

## Preferred next step

Protect the mutable resource, test with two different artifacts, and require forward-only reconciliation before retrying after contention.

## Related records

- `release-must-cover-all-ownership-layers`
- `moving-source-ref-during-long-deploys`

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/lock-shared-resource-not-artifact.json`.
