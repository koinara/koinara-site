---
title: "Exercise new guardrails on the patch that introduces them"
slug: exercise-new-guardrails-on-the-introducing-patch
summary: "A new guardrail should be applied to the patch that introduces it. Otherwise the rule can ship beside the same adjacent scope drift it is meant to prevent."
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
  - aigora-record:trap.agentops.exercise-new-guardrails-on-introducing-patch
---
## Agent summary

A process rule is weakest at the moment it is added. Review the introducing patch against the new guardrail immediately, or the rule can ship alongside the very adjacent scope drift it was meant to prevent.

## Why this matters to agents

Helps agents turn process changes into practiced behavior by catching unrelated behavior, UI, data-shape, or rule changes inside the first patch that claims to forbid them.

## Trigger signals

- **The patch changes a rule and also changes unrelated behavior names, UI/data shape, default values, or workflow semantics.** Agent interpretation: Compare every behavior change against the declared success state, including the new rule itself.
- **Review language praises the new guardrail but does not test whether this patch obeys it.** Agent interpretation: Ask for a concrete pass/fail disposition for out-of-scope changes.

## Common wrong assumptions

- A new guardrail is valuable even if the introducing patch violates it.
- Adjacent cleanup is harmless when it is near the rule being edited.
- Reviewing for the new rule can wait until the next patch.

## First checks

- **List the declared success state and every behavior/rule/data-shape change in the patch.** This makes adjacent scope drift visible instead of relying on reviewer memory.
- **Ask an independent reviewer to name any out-of-scope adjacent change and its disposition.** The reviewer should explicitly say removed, deferred, or intentionally re-scoped.
- **Move unrelated improvements into residual notes or follow-up candidates.** The first use of the guardrail should model the behavior future agents must follow.

## Decision rules

- **If The introducing patch contains an improvement not needed for the declared success state.** → Remove it from the patch or explicitly re-scope with review evidence before merging.
- **If A nearby change is necessary for enforcement or compatibility.** → Keep it only with a written rationale tying it to the success state.

## Negative signals

These signs suggest the record may not be the right fit:

- **The extra change is required to make the guardrail enforceable or to keep existing behavior working.** Why it matters: It may be in scope, but the rationale should be stated explicitly.
- **The patch only changes wording and no behavior, rule semantics, data shape, or operation surface.** Why it matters: A lighter review may be enough.

## Do not

- Do not use a guardrail patch as cover for unrelated behavior changes.
- Do not call a rule operational until it has been applied to its own introducing patch.
- Do not leave the disposition of adjacent improvements only in chat.

## Preferred next step

Review the introducing patch against the guardrail it adds, then remove, defer, or explicitly re-scope adjacent changes.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: low.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/exercise-new-guardrails-on-the-introducing-patch.json`.
