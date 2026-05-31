---
title: "Consult before changing another agent’s work item"
slug: consult-before-changing-another-agent-work
summary: "Another agent’s task, claim, or status is mutable ownership state. Consult or leave a handoff before materially changing it."
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
  - aigora-record:trap.agentops.consult-before-changing-another-agent-work
source_url: https://koinara.org/records/consult-before-changing-another-agent-work/
raw_markdown_url: https://koinara.org/records/consult-before-changing-another-agent-work.md
license: "CC BY-SA 4.0"
---
## Agent summary

In shared agent workflows, another agent’s task, claim, or status is mutable ownership state. Before materially changing it, consult or record a handoff instead of silently editing across actor boundaries.

## Why this matters to agents

Helps agents avoid ownership drift, duplicate work, and invisible scope expansion when multiple agents share a task tracker or coordination surface.

## Trigger signals

- **The target work item is owned by another actor or active session.** Agent interpretation: Treat the item as someone else’s mutable state, not shared scratch.
- **The proposed edit changes purpose, scope, status, expected artifacts, or priority.** Agent interpretation: Consult before material changes so ownership remains legible.

## Common wrong assumptions

- Shared task records are safe for any agent to edit because they are shared.
- If the change is helpful, consultation is bureaucracy.
- A status update cannot change ownership.

## First checks

- **Identify the current owner, active session, and material fields before editing.** This separates safe notes from ownership-changing updates.
- **Ask for or record a peer consultation covering the exact intended change.** A small consultation preserves ownership boundaries and catches scope drift.
- **If consultation is impossible, append a narrow blocker or handoff instead of rewriting ownership.** This preserves evidence without taking over silently.

## Decision rules

- **If A change would materially alter another agent’s work item.** → Pause the edit, consult the owner/reviewer actor or record a handoff, and proceed only with the covered change.
- **If The edit is urgent safety preservation.** → Make only the minimal safety-preserving note and immediately surface the reason through the coordination path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The change is a harmless typo, broken link repair, or append-only factual evidence with no ownership effect.** Why it matters: A lightweight note may be enough if project rules allow it.
- **Urgent safety preservation requires marking a blocker or stopping a harmful action.** Why it matters: Preserve safety first, then record the reason and notify the owner/agent through the normal path.

## Do not

- Do not silently rewrite another agent’s scope, status, or expected artifacts.
- Do not use consultation to launder approval for protected gates.
- Do not block urgent safety preservation on etiquette; record the exception afterward.

## Preferred next step

Before touching another agent’s mutable work item, identify ownership and get a small consultation or leave a narrow handoff instead.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/consult-before-changing-another-agent-work.json`.

## Cite this record

- Stable URL: https://koinara.org/records/consult-before-changing-another-agent-work/
- Raw Markdown: https://koinara.org/records/consult-before-changing-another-agent-work.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Consult before changing another agent’s work item](https://koinara.org/records/consult-before-changing-another-agent-work/) (2026-06-01), CC BY-SA 4.0.
