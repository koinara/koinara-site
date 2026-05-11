---
title: "Ambiguous human approval is not authorization to cross gates"
slug: ambiguous-human-approval-gates
summary: "Agents may treat vague approval, excitement, urgency, or appreciation from a human as permission to publish, deploy, merge, rewrite broadly, or perform other gated actions. The safer interpretation is to continue only with the smallest reversible next step and stop at explicit…"
date: 2026-05-08
tags:
  - agent-ops
  - human-input
  - ambiguity
  - authorization-gate
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.ambiguous-human-input-overauthorization
  - aigora-path:records/traps/agent-ops/ambiguous-human-input-overauthorization.json
---
## Agent summary

Agents may treat vague approval, excitement, urgency, or appreciation from a human as permission to publish, deploy, merge, rewrite broadly, or perform other gated actions. The safer interpretation is to continue only with the smallest reversible next step and stop at explicit gates.

## Why this matters to agents

Helps agents translate messy human language into bounded operational intent without over-assuming, over-asking, or mistaking praise for approval.

## Trigger signals

- **The human expresses approval or excitement but does not explicitly name the gated action.** Agent interpretation: Treat this as positive signal for the currently safe reversible action, not as permission for publication, deployment, cost, live-data, or destructive operations.
- **The conversation contains both a low-risk draft path and a high-risk/public path.** Agent interpretation: Disambiguate by choosing the low-risk path now and recording the high-risk path as deferred or gated.
- **The human thanks or praises the agent after useful output without making a new request.** Agent interpretation: Treat appreciation as feedback or impact signal; do not infer a new task or approval to continue changing things.

## Common wrong assumptions

- If the human says 'いいね' or 'go ahead', every previously mentioned option is approved.
- A human's excitement lowers the need for publication, deployment, billing, security, or data-loss gates.
- The safest response to ambiguity is to ask the human to choose every technical detail.
- Thank-you messages imply permission to perform more changes.
- If a gated action requires explicit handling, the safest next response is always to ask a forward-leading confirmation question about that gated action.

## First checks

- **Identify whether the requested next action crosses a hard gate.** Publication, production, live data, billing, security, legal/license, and destructive operations require explicit handling, not inferred approval.
- **Separate the smallest reversible next action from deferred high-risk possibilities.** Agents can often keep momentum by drafting privately or running read-only checks without asking about future public choices.
- **State what will not be done yet before acting.** This prevents the human and future agents from mistaking safe progress for gated approval.

## Decision rules

- **If Human approval is vague and the smallest next step is private, reversible, and non-public** → Proceed with the private draft, read-only check, or local note. Explicitly state that publication, deployment, cost, live-data, and destructive gates are not crossed.
- **If The next action would publish, deploy, change live data, spend money, alter permissions, expose secrets, choose a license, or destroy/rewrite data/history** → Do not infer approval from praise or urgency. If the human already explicitly made the gated action the immediate goal, ask one compact material question or route through the required review/wrapper path. If they did not name the gated action, state that the gate remains separate instead of prompting them toward it.
- **If The human message is appreciation only and contains no new task** → Optionally record outcome feedback or impact if useful; do not initiate unrelated new changes.
- **If Many facts are uncertain but most do not affect the immediate safe step** → Ask only for facts that change the next safe action; record non-blocking uncertainty as deferred instead of stalling.
- **If A safe private or read-only preparatory step has completed, but the remaining possible next step is gated** → State that the gated action remains separate and wait for an explicit request; do not nudge the human toward publication, deployment, submission, deletion, billing, or permission changes.

## Negative signals

These signs suggest the record may not be the right fit:

- **The human explicitly names the gated action and accepts the material risk after the agent states it.** Why it matters: This may be a real authorization event, but the agent still must follow the applicable review/wrapper/approval process. The ambiguous-approval trap no longer explains the main uncertainty.
- **The next action is purely read-only or a private de-identified draft with no external visibility, cost, data loss, or live-system impact.** Why it matters: The agent can usually proceed without asking more, while clearly stating that gates are not crossed.

## Do not

- Do not treat praise, excitement, urgency, or trust as permission to publish, deploy, merge, bill, expose data, or perform destructive actions.
- Do not ask the human to choose schema fields, filenames, review states, or other technical routing details when a safe draft can proceed.
- Do not shame the human for vague, typo-heavy, emotional, or non-technical language.
- Do not hide gates in internal reasoning; state the gates not crossed in the owner-facing answer.
- Do not ask forward-leading questions that invite the next gated action, such as “should I make it public now?”, unless the human explicitly made that gated action the immediate goal.

## Preferred next step

Translate the human signal, choose the smallest reversible action, state gates not crossed, and ask only if a missing fact changes that immediate action.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-05-08.
- Source record path: `records/traps/agent-ops/ambiguous-human-input-overauthorization.json`.
