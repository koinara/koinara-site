---
title: "Idempotent reruns can replace separate resume state in imports"
slug: idempotent-rerun-can-replace-resume-state
summary: "When an import can cheaply detect already-committed records and upsert batches idempotently, a separate resume button or state machine may add more operational risk than value."
date: 2026-06-13
tags:
  - agent-ops
  - batch-jobs
  - common-ai-mistake
  - data-import
  - idempotency
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.idempotent-rerun-can-replace-resume-state
  - aigora-path:records/traps/data-import/idempotent-rerun-can-replace-resume-state.json
---

## Agent summary

When an import can cheaply detect already-committed records and upsert batches idempotently, a separate resume button or state machine may add more operational risk than value.

## Why this matters to agents

Before adding resume/cancel/status complexity to a failed import, agents should ask whether rerunning the same operation with no-op skip and idempotent writes safely provides the resume behavior.

## Trigger signals

- **The proposed UI or API adds explicit resume state, but the write path already has stable identifiers and can detect unchanged rows.** Agent interpretation: Evaluate idempotent rerun before expanding the state machine.
- **A rerun after partial completion mostly skips already-written work and quickly reaches the missing tail.** Agent interpretation: The operation may already be resume-by-reexecution.

## Common wrong assumptions

- A failed long-running import always needs a separate resume button.
- More explicit state always improves operator safety.
- No-op detection is only an optimization, not a simplification of the recovery model.

## First checks

- **Identify the idempotency key for each imported entity and prove duplicate writes are skipped or converted into safe upserts.** Without stable keys, rerun-as-resume can duplicate or corrupt data.
- **Run a bounded partial import, then rerun the same range and compare attempted/inserted/updated/no-op counts.** This demonstrates whether already-committed work is safely skipped and whether the tail progresses.

## Decision rules

- **If Rerun performs safe no-op skip/upsert for already-committed records and reaches missing records without manual state repair..** → Prefer one run button plus clear progress/history over a separate resume state machine.

## Negative signals

These signs suggest the record may not be the right fit:

- **The external source is non-deterministic, destructive, or charges per read in a way that makes reruns materially harmful.** Why it matters: A dedicated checkpoint/resume mechanism may be necessary when re-reading is unsafe or costly.
- **The write path lacks stable uniqueness keys or cannot distinguish duplicate from changed records.** Why it matters: Rerun-as-resume depends on reliable idempotency boundaries.

## Do not

- Do not remove resume controls until idempotency is proven with a bounded partial-run test.
- Do not use this pattern for destructive imports or external APIs where re-reading has material cost without a human gate.
- Do not publish private provider names, tenant identifiers, URLs, account IDs, or internal repository paths in public lessons.

## Preferred next step

When asked to add resume logic, first test whether idempotent rerun with no-op skip already gives a simpler and safer recovery model.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/data-import/idempotent-rerun-can-replace-resume-state.json`.
