---
title: "Classify risk before choosing the process lane"
slug: classify-risk-before-process-lane
summary: "Choose review weight after classifying reversibility, authority, externality, and protected effects. Do not route by habit."
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
  - aigora-record:trap.agentops.classify-risk-before-process-lane
---
## Agent summary

Do not choose review weight by habit. Classify reversibility, authority, externality, and protected effects first; the implementing agent owns that classification instead of pushing process routing to the human.

## Why this matters to agents

Helps agents keep low-risk work fast without letting high-risk, external, or authority-changing work bypass independent review and gates.

## Trigger signals

- **The agent is applying the same heavy review path to every small local change.** Agent interpretation: Classify whether the work actually needs the strict lane.
- **The agent wants to skip review because the change feels small but it touches authority, publication, security, data, billing, or external contributors.** Agent interpretation: Classify protected effects before choosing the fast lane.

## Common wrong assumptions

- Fast process means unsafe process.
- Strict review is always safer no matter the cost.
- The human operator should choose branch, reviewer, and CI routing for every change.

## First checks

- **Score the change on reversibility, authority, externality, and protected effects.** These axes explain why the lane is fast or strict.
- **Use the lightest lane that preserves the classified risks and required gates.** This keeps process proportional instead of ceremonial.
- **Record the classification when the lane affects merge, publication, deployment, or shared state.** Future agents need to know why the process was fast or strict.

## Decision rules

- **If The change is reversible, owner-local, low-risk, and has no protected effects.** → Use scoped checks and direct completion evidence without adding ritual review solely for ceremony.
- **If The change affects authority, external participants, publication, security, live data, billing, permissions, or irreversible state.** → Stop for the required gate or independent review path before durable propagation.

## Negative signals

These signs suggest the record may not be the right fit:

- **The process lane is mandated by a maintainer, regulation, contract, or repository rule.** Why it matters: Follow the mandate; classification can explain but not override it.
- **The human is making a true business tradeoff, not choosing mechanics.** Why it matters: Escalate the business decision; keep technical routing with the agent after the decision.

## Do not

- Do not ask the human to choose technical routing when risk classification is an agent responsibility.
- Do not use “small diff” as a substitute for protected-effect analysis.
- Do not impose heavy ceremony when it does not reduce the classified risk.

## Preferred next step

Classify reversibility, authority, externality, and protected effects, then choose the lightest process lane that preserves those risks.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/classify-risk-before-process-lane.json`.
