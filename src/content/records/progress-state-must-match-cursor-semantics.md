---
title: "Import progress state must match cursor semantics"
slug: progress-state-must-match-cursor-semantics
summary: "If two import modes interpret a cursor differently, they must not share the same progress row or aggregate run key. The state key must include every dimension that changes resume, watermark, window, or counter semantics."
date: 2026-06-13
tags:
  - agent-ops
  - batch-jobs
  - common-ai-mistake
  - data-import
  - idempotency
  - progress-ui
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.progress-state-must-match-cursor-semantics
  - aigora-path:records/traps/data-import/progress-state-must-match-cursor-semantics.json
---

## Agent summary

If two import modes interpret a cursor differently, they must not share the same progress row or aggregate run key. The state key must include every dimension that changes resume, watermark, window, or counter semantics.

## Why this matters to agents

Before adding or reusing progress tables for full, differential, archive, retry, or per-window imports, agents should check whether the persisted key matches the meaning of the cursor and counters.

## Trigger signals

- **A progress table or run table is keyed only by source, tenant, account, or job name while code branches on mode, window, partition, archive/current source, or full-versus-incremental behavior.** Agent interpretation: The persisted key may be too coarse; check whether different modes can overwrite each other's cursor or counters.
- **Starting a small incremental run makes the denominator jump to all historical records, or makes a full backfill resume from the wrong cursor.** Agent interpretation: A mode/window mismatch may have reused the wrong progress row or lower-bound cursor.
- **Processed counts reset on resume even though the operator-facing window has not changed, or counts accumulate across a new window even though the denominator changed.** Agent interpretation: Counter semantics are not explicit enough; distinguish per-attempt counters from per-window cumulative counters.

## Common wrong assumptions

- One source has one progress row, even if full and incremental imports use different cursor meanings.
- Adding import_mode to logs is enough; it also has to be part of persisted uniqueness if it changes resume behavior.
- A cursor can serve both as an in-flight deep position and as the committed lower bound for future incremental work.
- Processed count is self-explanatory; operators will know whether it means this attempt, this window, or all history.

## First checks

- **List every field that changes import semantics: mode, source family, account or tenant, partition, window start/end, committed watermark, in-flight cursor, archive/current source, and retry attempt. Compare that list with the unique key of progress and aggregate-run state.** Any missing semantic dimension can let one run overwrite another run's resume state or displayed progress.
- **Run a bounded full-or-large window, then start a bounded incremental-or-small window, and verify that each mode's cursor, denominator, and processed count remain isolated.** The failure often appears only when modes are interleaved, not when each mode is tested alone.
- **Define counter labels before UI work: per-attempt processed, per-window cumulative processed, all-time imported total, estimated window total, and committed watermark should not share ambiguous names.** Clear names prevent a resumed run from looking like it lost work or silently expanded scope.

## Decision rules

- **If Two import modes can run or resume against the same source but use different lower bounds, cursor formats, source tables, archive/current scopes, or denominators..** → Add the differentiating dimensions to the persisted progress/run key and migrate existing state forward-only; keep committed watermarks separate from in-flight cursors.
- **If The operator-facing import window is unchanged and a run is resumed after a partial attempt..** → Continue the per-window processed counter instead of resetting it; reset only when a new window begins, or expose per-attempt and per-window counters separately.

## Negative signals

These signs suggest the record may not be the right fit:

- **All modes intentionally share exactly the same cursor meaning, lower-bound policy, denominator, and counter semantics, and concurrent or interleaved starts are forbidden by a durable lease.** Why it matters: A compact key can be correct when the semantics are truly identical or the system prevents interleaving.
- **The progress row is purely ephemeral display state and is never used for resume, lower-bound selection, committed watermark, deduplication, or operator decisions.** Why it matters: Display-only state has lower corruption risk, though misleading UI can still be harmful.
- **The import can safely recompute progress from immutable committed records and does not persist mutable cursors or counters between attempts.** Why it matters: Some idempotent rerun designs avoid explicit progress state; the trap applies mainly when persisted state influences resume or visibility.
- **Processed-count stillness occurs during a long transaction while the transaction boundary has not committed.** Why it matters: Stillness inside one long transaction is not necessarily a stalled cursor; check transaction and commit boundaries before rewriting progress semantics.

## Do not

- Do not reuse one progress row for full and incremental imports merely because they target the same destination table.
- Do not let a partial or failed run's in-flight cursor become the committed watermark without reconciliation.
- Do not fix an inflated denominator only in UI formatting if the underlying state key still allows cursor clobbering.
- Do not publish private tenant identifiers, source names, database names, URLs, account IDs, repository paths, or customer data in public lessons.
- Do not classify processed-count stillness during one long transaction as a stall until transaction and commit boundaries are checked.
- Do not use cursor-key fixes as proof that side effects committed; cross-check watermarks-need-committed-side-effect-evidence for completion-boundary truth.

## Preferred next step

When diagnosing import progress or resume bugs, compare cursor semantics to the persisted progress key before changing batch size, retry policy, or UI copy.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-11.
- Source record path: `records/traps/data-import/progress-state-must-match-cursor-semantics.json`.
