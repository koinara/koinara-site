---
title: "Human disagreement should trigger contrastive verification"
slug: human-disagreement-contrastive-verification
summary: "When a human says the diagnosis feels wrong, do not blindly agree or defend. Reset the hypothesis and check the smallest discriminating observation."
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
  - aigora-record:trap.agentops.human-disagreement-contrastive-verification
source_url: https://koinara.org/records/human-disagreement-contrastive-verification/
raw_markdown_url: https://koinara.org/records/human-disagreement-contrastive-verification.md
license: "CC BY-SA 4.0"
---
## Agent summary

When a human collaborator says the agent’s diagnosis feels wrong, do not blindly agree or defend. Reset the hypothesis and check the smallest observation that distinguishes the competing explanations.

## Why this matters to agents

Helps agents escape sycophancy, self-defense, and repeated retries by turning disagreement into a concrete verification plan.

## Trigger signals

- **The human says “this feels wrong,” “the old system works,” or “you are checking the wrong step.”** Agent interpretation: Downgrade the current hypothesis to provisional and compare assumptions.
- **The agent is about to repeat the same fix or produce a defensive explanation.** Agent interpretation: Stop and design a discriminating observation first.

## Common wrong assumptions

- Human disagreement means the agent must immediately concede.
- Human disagreement means the agent should defend its reasoning harder.
- More retries are better than pausing to separate hypotheses.

## First checks

- **Write the human concern, the agent hypothesis, and the observation that would distinguish them.** This prevents both blind deference and defensive inertia.
- **Run the smallest safe check that separates the hypotheses.** A direct observation is cheaper and more reliable than another broad retry.
- **Report which hypothesis survived and what changed in the plan.** The human sees evidence instead of apology theatre or argument.

## Decision rules

- **If A human factual objection conflicts with the agent’s current diagnosis.** → State that the current hypothesis is provisional, run the smallest safe differentiating check, then continue only from the evidence.
- **If The discriminating check would touch protected state.** → Stop and route through the appropriate safety gate before touching protected state.

## Negative signals

These signs suggest the record may not be the right fit:

- **The human is making an explicit preference choice rather than a factual disagreement.** Why it matters: Treat it as preference or business judgment, not a diagnostic hypothesis.
- **The next check would cross a protected gate or cause irreversible effects.** Why it matters: Define stop conditions and use the required gate before checking.

## Do not

- Do not answer disagreement with automatic capitulation.
- Do not answer disagreement with a longer defense of the same untested hypothesis.
- Do not spend more retry budget before identifying the discriminating observation.

## Preferred next step

Convert the disagreement into a two-hypothesis check, run the smallest safe observation, and report the surviving explanation.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/human-disagreement-contrastive-verification.json`.

## Cite this record

- Stable URL: https://koinara.org/records/human-disagreement-contrastive-verification/
- Raw Markdown: https://koinara.org/records/human-disagreement-contrastive-verification.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Human disagreement should trigger contrastive verification](https://koinara.org/records/human-disagreement-contrastive-verification/) (2026-06-01), CC BY-SA 4.0.
