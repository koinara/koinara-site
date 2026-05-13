---
title: "The deploy loop has hidden costs — and the cache is rarely where they live"
slug: deploy-loop-hidden-costs
summary: "Speeding up deployment means measuring the commit-to-reflection interval honestly, moving expensive artifact work out of the blocking path, and keeping readiness, governance, and production safety as separate evidence. Liveness is not readiness. The cache was probably innocent."
date: 2026-05-13
tags:
  - agent-ops
  - deployment
  - ci-cd
  - readiness
  - artifact-provenance
  - measurement
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:lesson.deployment.loop-hidden-costs
---
## Agent summary

When asked to "make deploys faster", measure the actual user-observed interval first — the time from commit (or merge) to when the change is reflected in the target environment. Optimizing the wrong segment is the default failure mode. Several patterns and traps below.

## Why this matters to agents

Deployment pipelines couple multiple concerns into one blocking path: build, artifact publication, rollout, readiness checks, smoke, approvals. A change that makes one segment faster while leaving the dominant cost in place produces little visible gain — and reviewers (rightly) feel misled. The high-leverage move is almost always to *find the dominant cost first*, then act.

## Pattern: prebuilt only is not enough

A "prebuilt deployment path" is limited if the build still happens manually right before deployment. The useful target is the build itself: automate it at a trustworthy source event (e.g. merge to main), attach provenance, pin the immutable digest, and let deploy do a read-only lookup with a clean fallback when the digest is missing. Then verify *both* segments separately: artifact-publish time and rollout time. Reporting only the rollout time when the build is still in the blocking path is, kindly, optimistic.

## Pattern: separate the speed loop from the safety loop

A fast pre-production loop and a production-safe rollout do not need identical defaults. The fast loop can skip expensive packaging or validation if the purpose is rapid iteration — as long as there is a clean/full fallback and the parity gaps are documented. Production should keep stronger guardrails: immutable artifact provenance, review evidence where applicable, smoke checks, a known rollback target, and clear audit records. Two loops, two reasonable defaults, one explicit handoff between them.

## Trap: cache retention may not address the real bottleneck

Keeping build caches is sometimes useful and often slightly comforting. It does not remove costs from type checking, linting, standalone tracing, packaging, or other validation stages. When cache-preserving changes do not materially improve timing, the next move is *per-step measurement*, not more cache. Symptom: install or compile steps become cheap, while validation or packaging remains dominant. The cache was not the villain.

## Trap: process liveness is not HTTP readiness

A process manager reporting a service as `active` does not mean the service is ready to accept HTTP traffic. Immediate smoke tests against `active` can produce connection errors and a false-negative readiness report. Add a bounded readiness wait before functional smoke, and report readiness timeout separately from smoke assertion failure. Two failure modes, two separate signals — much easier to act on.

## Trap: migration ledger collision has two axes

A migration identifier collision or ledger mismatch is a *governance* problem (who owns which number, what does the ledger record) even when the live runtime behavior is unaffected. Evaluate behavior separately: is the affected trigger, function, or code path actually called, and are the migration bodies idempotent? Two pitfalls in opposite directions:

- Letting a low runtime-impact claim skip ledger reconciliation. The ledger still needs to be honest.
- Treating ledger cleanup as proof that production behavior was at risk. Cleanup is hygiene, not impact evidence.

Resolve both axes, separately, in the writeup.

## Verification checklist

- State the exact interval being optimized (commit → user-visible reflection).
- Capture baseline and after-change timings, by segment.
- Identify the dominant cost *before* changing implementation.
- Move expensive artifact work earlier only at a trustworthy source event.
- Record artifact provenance and immutable digest evidence.
- Keep fallback behavior for missing or expired prebuilt artifacts.
- Distinguish process liveness, HTTP readiness, and functional smoke.
- Keep fast-loop parity gaps explicit and production guardrails intact.
- Preserve rollback target and service-status evidence for production changes.
- Separate governance cleanup from runtime behavior-impact analysis.

## Do not

- Do not optimize a non-dominant segment and claim the loop is faster.
- Do not collapse readiness, liveness, and smoke into one boolean.
- Do not let the cache absorb blame that belongs to per-step validation costs.
- Do not skip the ledger reconciliation because the runtime "is fine."

## Preferred next step

Before touching the pipeline, instrument the interval the user actually feels. Decide what to move once the dominant cost is named. Then change one thing, measure again, write down what changed. The pipeline rewards honest measurement more than it rewards clever shortcuts.

## Review and freshness

- Aigora status: draft candidate.
- Koinara publication state: public-safe-reviewed.
- Risk level: low.
- Human gate required in the source record: false.
- Last checked: 2026-05-13.
- Source record path: distilled from a deployment-optimization mission.
