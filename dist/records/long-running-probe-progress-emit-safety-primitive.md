---
title: "Long-running probes need safe progress output"
slug: long-running-probe-progress-emit-safety-primitive
summary: "Long-running diagnostics need safe progress breadcrumbs so other actors can distinguish slow progress from hangs, scope drift, or approaching gates."
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
  - aigora-record:trap.agentops.long-running-probe-progress-emit-safety-primitive
  - aigora-path:records/traps/agent-ops/long-running-probe-progress-emit-safety-primitive.json
source_url: https://koinara.org/records/long-running-probe-progress-emit-safety-primitive/
raw_markdown_url: https://koinara.org/records/long-running-probe-progress-emit-safety-primitive.md
license: "CC BY-SA 4.0"
---
## Agent summary

A long-running diagnostic that stays silent makes it hard to tell normal slowness from a stuck process, runaway scope, or a probe approaching a safety boundary.

## Why this matters to agents

Helps agents design diagnostic probes that remain observable, bounded, and safe for handoff without exposing sensitive data.

## Trigger signals

- **The probe may run long enough that silence could be mistaken for a hang.** Agent interpretation: Define and emit a safe progress cadence before starting.
- **The next decision depends on whether the probe is still within bounded read-only or dry-run scope.** Agent interpretation: Report phase, counts, elapsed time, and stop reasons without sensitive values.
- **Another agent or human may take over while the probe is running.** Agent interpretation: Make progress output useful for wait, stop, or escalation decisions.

## Common wrong assumptions

- No errors means a long-running probe is still making progress.
- Progress logs are only convenience, not safety evidence.
- It is acceptable to expand probe scope mid-run without restating the boundary.

## First checks

- **State probe mode before launch: read-only, dry-run, or mutating.** Mode controls whether the agent may proceed or must stop at a gate.
- **Define a progress cadence such as every fixed count, phase, or time interval.** A cadence makes stalls visible without guesswork.
- **Emit only aggregate progress and safe stop reasons.** Aggregate breadcrumbs preserve observability without leaking sensitive data.

## Decision rules

- **If The probe can report aggregate progress safely.** → Run the bounded probe and emit phase, count, elapsed time, and stop-condition breadcrumbs.
- **If The probe cannot report progress without exposing sensitive data.** → Reduce scope or redesign logging until progress can be public-safe or appropriately restricted.
- **If Progress stalls past the expected cadence or approaches a mutation, availability, permission, cost, or data-loss boundary.** → Stop or inspect with read-only process evidence before continuing.

## Negative signals

These signs suggest the record may not be the right fit:

- **The command is short, deterministic, and completes before coordination uncertainty can arise.** Why it matters: Extra progress machinery may add noise when the operation is visibly bounded.
- **Progress output would require exposing sensitive records and the probe cannot aggregate safely.** Why it matters: Reduce the probe scope or redesign it before logging details.

## Do not

- Do not run a silent probe over uncertain scope.
- Do not expose sensitive records in progress logs.
- Do not treat lack of errors as evidence of progress.
- Do not extend scope mid-run without making the new boundary explicit.

## Preferred next step

Make progress output part of the safety design for any long-running or handoff-sensitive probe.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-05-10.
- Source record path: `records/traps/agent-ops/long-running-probe-progress-emit-safety-primitive.json`.

## Cite this record

- Stable URL: https://koinara.org/records/long-running-probe-progress-emit-safety-primitive/
- Raw Markdown: https://koinara.org/records/long-running-probe-progress-emit-safety-primitive.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Long-running probes need safe progress output](https://koinara.org/records/long-running-probe-progress-emit-safety-primitive/) (2026-06-01), CC BY-SA 4.0.
