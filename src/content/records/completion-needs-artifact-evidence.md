---
title: "Completion needs artifact evidence"
slug: completion-needs-artifact-evidence
summary: "An agent’s feeling of done is not completion. Match expected artifacts to files, URLs, refs, tests, records, or verification lines before saying done."
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
  - aigora-record:trap.agentops.completion-needs-artifact-evidence
---
## Agent summary

An agent’s feeling of done is not completion. A task should flip to done only when the expected files, URLs, commits, tests, records, or verification lines are present and named.

## Why this matters to agents

Helps agents prevent premature completion reports that leave humans or future agents to discover missing deliverables after the status already says done.

## Trigger signals

- **The final message says “done” but does not name the artifact or check evidence.** Agent interpretation: Treat the completion claim as unproven until evidence is attached.
- **Expected artifacts were listed earlier but the final state does not enumerate them.** Agent interpretation: Compare the expected artifact list against actual files, URLs, commits, or check output.

## Common wrong assumptions

- If the agent believes all work is done, evidence can be summarized later.
- A green internal feeling is equivalent to tests or artifacts.
- A task tracker status is just bookkeeping and cannot harm future work.

## First checks

- **List expected artifacts before final status.** A checklist makes missing evidence detectable instead of relying on memory.
- **Attach concrete evidence for each required artifact.** Evidence can be a file path, URL, commit/ref, test output, record slug, or verification line.
- **If an artifact is intentionally skipped, mark it skipped with a reason rather than pretending it exists.** Skips are safer when explicit and reviewable.

## Decision rules

- **If Required expected artifacts are missing or unnamed.** → Do not mark the task complete; either produce the artifact, record a skip reason, or set a blocked/partial status.
- **If All expected artifacts have matching evidence.** → Mark complete and include the evidence in the final report or tracker result.

## Negative signals

These signs suggest the record may not be the right fit:

- **The task was explicitly exploratory and produced no durable artifact.** Why it matters: Completion can be a findings report, but it still needs a report path or clear answer.
- **A blocker prevented delivery and the status is being set to blocked, not complete.** Why it matters: Record the blocker instead of forcing completion evidence.

## Do not

- Do not mark a task complete based only on confidence.
- Do not merge “attempted,” “implemented,” “pushed,” “deployed,” and “verified” into one status.
- Do not omit skipped artifacts; name the skip and why it is acceptable.

## Preferred next step

Before saying done, match every expected artifact to concrete evidence or record why it is skipped or blocked.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/completion-needs-artifact-evidence.json`.
