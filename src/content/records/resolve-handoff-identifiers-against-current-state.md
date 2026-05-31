---
title: "Resolve handoff identifiers against current state"
slug: resolve-handoff-identifiers-against-current-state
summary: "Task IDs, issue IDs, migration names, and artifact numbers in handoffs can go stale. Resolve identifiers against current state before attaching work."
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
  - aigora-record:trap.agentops.resolve-handoff-identifiers-against-current-state
---
## Agent summary

Identifiers in handoffs and design notes can go stale. Before attaching work, status, or tests to a task ID, migration filename, issue, or release number, resolve it against the current source of truth.

## Why this matters to agents

Helps agents avoid filing evidence under the wrong anchor or following stale migration numbers after rebases and mainline movement.

## Trigger signals

- **The handoff ID was provisional, old, or copied from a previous session.** Agent interpretation: Resolve it in the tracker or source before using it as the work anchor.
- **A migration or numbered artifact was planned before rebasing or merging mainline.** Agent interpretation: Inspect the final directory and tests before recording the identifier.

## Common wrong assumptions

- A named ID in a handoff is current because it was correct when written.
- Migration numbers in design notes survive rebases unchanged.
- If the title looks similar, the anchor must be the same work item.

## First checks

- **Resolve the ID in the authoritative current system before attaching artifacts.** This prevents status or files from landing on the wrong work item.
- **For numbered files or migrations, inspect the directory after rebasing and update tests/docs to the final name.** The final merged identifier is what future agents will search for.
- **Record rejected stale IDs when confusion is likely to recur.** A note prevents the next agent from repeating the same stale-anchor mistake.

## Decision rules

- **If A handoff identifier cannot be verified as the current target.** → Resolve the current target or create the correct anchor through the normal workflow before writing artifacts or status.
- **If A final migration or numbered artifact differs from the design note.** → Update handoff/tests/docs to the final merged identifier and preserve the stale number only as historical context.

## Negative signals

These signs suggest the record may not be the right fit:

- **The identifier is immutable and has been verified immediately before use.** Why it matters: Record the verification and proceed.
- **The identifier appears only as historical context, not as an execution anchor.** Why it matters: Do not over-process historical references.

## Do not

- Do not attach work to a task, issue, or migration number solely because a handoff named it.
- Do not leave stale design-note identifiers as the only searchable clue.
- Do not ask a human to choose between IDs until the agent has resolved current status and purpose.

## Preferred next step

Resolve every execution identifier against current state, then record the final ID and any rejected stale ID before handoff.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/resolve-handoff-identifiers-against-current-state.json`.
