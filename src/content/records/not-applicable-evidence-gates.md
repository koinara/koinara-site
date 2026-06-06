---
title: "Evidence gates should distinguish not applicable from missing"
slug: not-applicable-evidence-gates
summary: "A safety gate creates alarm fatigue when it blocks on absent evidence for a risk class whose trigger files or operations are absent from the current change."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - safety-gates
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.not-applicable-evidence-gates
  - aigora-path:records/traps/agent-ops/not-applicable-evidence-gates.json
---
## Agent summary

A safety gate creates alarm fatigue when it blocks on absent evidence for a risk class whose trigger files or operations are absent from the current change.

## Why this matters to agents

Helps agents design gates that remain strict for real risk surfaces while emitting auditable not-applicable evidence for out-of-scope classes.

## Trigger signals

- **The gate reports missing evidence for a class whose trigger files or operations are absent.** Agent interpretation: Emit not_applicable with the trigger check result instead of a noisy blocker.
- **Reviewers learn to bypass or ignore the gate because low-risk changes repeatedly fail on irrelevant requirements.** Agent interpretation: False blockers erode the gate's authority for real risk.
- **The review packet does not show how the agent proved an evidence class was out of scope.** Agent interpretation: Skipped classes still need auditable proof of absence.

## Common wrong assumptions

- Every absent evidence artifact is equally missing.
- A human can infer from the diff why a gate was skipped.
- False blockers are harmless because reviewers can bypass them.

## First checks

- **Define trigger conditions for each evidence class before checking for the evidence artifact.** The trigger is what separates missing from not applicable.
- **For every skipped class, emit a machine-readable not_applicable record with the trigger command/check and result.** Future reviewers need proof of absence, not silence.
- **Test three fixtures: trigger present with evidence, trigger present without evidence, and trigger absent.** The third fixture protects against alarm-fatigue false blockers.

## Decision rules

- **If Trigger conditions are absent and the trigger check is complete and trustworthy.** → Emit not_applicable with the check and result, include it in the review packet, and do not block on the absent artifact.
- **If Trigger conditions are present or the trigger check cannot be evaluated.** → Treat missing evidence as a blocker until the evidence is supplied or an authorized reviewer narrows the scope.

## Negative signals

These signs suggest the record may not be the right fit:

- **The trigger check is unavailable, partial, ambiguous, or could not be evaluated.** Why it matters: Do not claim not_applicable without a trustworthy trigger check; fail closed.
- **The change might touch live data, schema, credentials, permissions, billing, production availability, or irreversible state.** Why it matters: High-risk uncertainty requires evidence or authorized narrowing, not a skip.

## Do not

- Do not use not_applicable when the trigger check is unavailable, partial, or ambiguous.
- Do not weaken gates for live data, schema, credentials, permissions, billing, availability, or irreversible state.
- Do not hide skipped evidence classes from the review packet.

## Preferred next step

Define evidence triggers, emit auditable not_applicable records when triggers are absent, and fail closed when triggers are present or uncertain.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/not-applicable-evidence-gates.json`.
