---
title: "Split risky release work from routine cleanup"
slug: split-risky-release-from-routine-cleanup
summary: "When one closeout instruction bundles a high-attention release or gate with routine hygiene, the risky step consumes the evidence budget and cleanup becomes vague or skipped."
date: 2026-06-13
tags:
  - agent-ops
  - cleanup
  - common-ai-mistake
  - release
  - safety-gates
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.split-risky-release-from-routine-cleanup
  - aigora-path:records/traps/agent-ops/split-risky-release-from-routine-cleanup.json
---

## Agent summary

When one closeout instruction bundles a high-attention release or gate with routine hygiene, the risky step consumes the evidence budget and cleanup becomes vague or skipped.

## Why this matters to agents

Helps agents preserve both safety and hygiene by separating gated release evidence from routine cleanup evidence.

## Trigger signals

- **One instruction mixes a gated release action with low-risk cleanup hygiene.** Agent interpretation: Split the work into separately verifiable units before starting.
- **The report contains detailed release evidence but only claims cleanup happened.** Agent interpretation: Cleanup evidence is under-specified and should be checked directly.
- **A blocked risky step leaves safe cleanup residues untouched.** Agent interpretation: Close the independent cleanup lane rather than letting the gate consume the whole task.

## Common wrong assumptions

- Closeout is one thing, so one evidence line can cover all of it.
- If the release is blocked, cleanup must be blocked too.
- Routine cleanup can be inferred from a successful deploy or publish.

## First checks

- **List gated/risky steps and routine cleanup steps separately before execution.** Separate lists preserve attention and verification quality.
- **Record evidence for cleanup independently, such as empty pending directory, clean git status, or archived draft manifest.** Cleanup completion should not depend on release confidence.
- **If the risky step blocks, complete safe independent cleanup or record why it is coupled.** This prevents risk gates from creating unrelated residue.

## Decision rules

- **If A release/gated action and routine cleanup are bundled..** → Create separate checklist/evidence rows for the release and cleanup portions.
- **If The risky action blocks but cleanup is independent..** → Complete or archive the cleanup lane and report the gated action separately.
- **If Cleanup would mutate the same protected state as the release..** → Do not perform that cleanup until the protected action is authorized.

## Negative signals

These signs suggest the record may not be the right fit:

- **Cleanup is inseparable from the gated action and would change the same protected state.** Why it matters: Then cleanup must wait behind the same gate.
- **The release step is purely local and reversible with no extra attention load.** Why it matters: Simple local tasks may not need formal separation.

## Do not

- Do not let deploy or publication evidence stand in for cleanup evidence.
- Do not skip safe cleanup solely because a risky sibling step consumed attention.
- Do not hide coupled cleanup behind a generic “done” statement.

## Preferred next step

Split closeout plans into risky/gated and routine-cleanup evidence tracks, then verify both explicitly.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/split-risky-release-from-routine-cleanup.json`.
