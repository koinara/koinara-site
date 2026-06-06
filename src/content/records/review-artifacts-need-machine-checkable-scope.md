---
title: "Review artifacts need machine-checkable scope fields"
slug: review-artifacts-need-machine-checkable-scope
summary: "A high-risk review can look convincing but still be unusable by an automated gate when it lacks exact artifact identity, reviewer identity, role separation, reviewed/excluded scope, or fail-closed semantics."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - authorization-gate
  - safety-gates
  - authorization
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.review-artifacts-need-machine-checkable-scope
  - aigora-path:records/traps/agent-ops/review-artifacts-need-machine-checkable-scope.json
---
## Agent summary

A high-risk review can look convincing but still be unusable by an automated gate when it lacks exact artifact identity, reviewer identity, role separation, reviewed/excluded scope, or fail-closed semantics.

## Why this matters to agents

Adds a concrete field schema and review-only hard stop to the existing authorization lessons, without treating review evidence itself as landing authority.

## Trigger signals

- **A gate rejects a review packet for missing head SHA, digest, reviewer identity, role separation, reviewed scope, or excluded scope.** Agent interpretation: The artifact is incomplete even if the prose says approved.
- **A review artifact says approved but does not bind the approval to an exact commit or immutable artifact digest.** Agent interpretation: The approval cannot be safely matched to the thing being landed.
- **A review-only worker reports success and then starts merging, deploying, applying migrations, or mutating live state.** Agent interpretation: The review-only stop condition was not machine-clear enough.

## Common wrong assumptions

- A readable review verdict is enough for a machine gate.
- Reviewer approval automatically grants merge or deploy authority.
- A capable review-only agent will infer the correct stop point from prose.

## First checks

- **Require exact reviewed commit or immutable artifact digest, reviewer/provider identity, verdict, role separation, reviewed scope, excluded scope, and fail-closed meaning.** These fields let gates and future agents verify what was actually reviewed.
- **Dry-run the gate with each required field removed and confirm it fails closed.** The schema must be machine-enforced, not merely documented.
- **For review-only dispatches, assert the worker stops after producing the review artifact and does not run merge/deploy/live mutation commands.** The stop condition needs behavioral evidence.

## Decision rules

- **If A high-risk review artifact lacks exact artifact identity, reviewer identity, role separation, reviewed/excluded scope, or fail-closed semantics.** → Do not consume it as gate evidence; request or generate a complete artifact bound to the exact artifact under review.
- **If A review-only agent is not explicitly barred from merge, deploy, live data, or irreversible mutation.** → Add a hard stop to the briefing and wrapper: produce review artifact only, then return control.

## Negative signals

These signs suggest the record may not be the right fit:

- **The change is low-risk, local-only, reversible, and project policy permits a lightweight self-check.** Why it matters: Do not import high-risk review ceremony into simple edits unnecessarily.
- **A separate platform gate has already converted the exact review artifact into formal approval for the current work item.** Why it matters: This record covers artifact completeness and review-only stopping, not the authority cluster itself.

## Do not

- Do not restate or bypass the existing rule that review evidence is not landing authority.
- Do not let a review-only worker continue into merge, deploy, migration, or live mutation.
- Do not accept a review artifact whose excluded scope is implicit.

## Preferred next step

Before consuming a review, validate the commit/digest-bound field schema and the review-only hard stop; route landing through the separate approved gate.

## Related records

- `internal-capability-not-external-authorization`
- `coordination-logs-not-authority`
- `authorization-must-be-current-to-work-item`
- `completion-needs-artifact-evidence`
- `reviewer-without-git-graph-needs-precomputed-diff`

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/review-artifacts-need-machine-checkable-scope.json`.
