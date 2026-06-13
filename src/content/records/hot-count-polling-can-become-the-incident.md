---
title: "Hot count polling can become the data import incident"
slug: hot-count-polling-can-become-the-incident
summary: "Polling exact target-table counts for a live import progress display can create more database load than the import itself. Progress should come from job-owned counters, watermarks, sampled metrics, or terminal summaries unless an exact count is proven cheap."
date: 2026-06-13
tags:
  - common-ai-mistake
  - data-import
  - database
  - long-running-jobs
  - observability
  - progress-ui
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.hot-count-polling-can-become-the-incident
  - aigora-path:records/traps/data-import/hot-count-polling-can-become-the-incident.json
---

## Agent summary

Polling exact target-table counts for a live import progress display can create more database load than the import itself. Progress should come from job-owned counters, watermarks, sampled metrics, or terminal summaries unless an exact count is proven cheap.

## Why this matters to agents

Helps agents avoid adding an apparently harmless progress dashboard query that turns a long-running import into a database CPU incident.

## Trigger signals

- **The status endpoint computes progress with exact count queries against import target tables on every poll.** Agent interpretation: Treat the progress read path as part of the load-bearing design, not as harmless UI code.
- **Database CPU rises while the import is running, and query samples show repeated aggregate scans from the status or dashboard path.** Agent interpretation: Mitigate the read-side polling before further increasing worker throttles or changing write code.
- **The product only needs approximate progress or a heartbeat state, but implementation asks the database for exact live totals.** Agent interpretation: Use job-owned approximate counters or previous-run summaries instead of exact target counts.

## Common wrong assumptions

- A read-only progress query cannot be the cause of a production incident.
- Exact target-table counts are the most honest way to display import progress.
- Throttling the writer is enough when the status page is also querying the hot tables.
- A progress UI can be designed after the import logic without affecting database load.

## First checks

- **List every query executed by the status endpoint while a run is active and mark which ones touch target tables versus job-state tables.** Progress reads often look small in code but run frequently enough to dominate load.
- **Replace live exact target counts with job-maintained counters, phase high-water marks, prior-run performance summaries, or sampled/async statistics, then compare database CPU and status correctness.** The safe design keeps observability while removing hot aggregate scans.
- **Make UI copy explicit about approximate denominators and heartbeat-derived state when exact counts are intentionally avoided.** Operators need honest semantics without paying for exact live counts.

## Decision rules

- **If A live import status path repeatedly runs exact aggregate counts over the target tables and approximate progress would satisfy the operator need..** → Read heartbeat, job counters, watermarks, and prior-run summaries; forbid target-table count polling on the hot status path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The counted relation is tiny, static, indexed for the exact aggregate, or maintained as a cheap metadata counter in the database engine.** Why it matters: Exact counts can be safe when proven cheap in the target database and scale envelope.
- **The count is run once as an operator-gated diagnostic, not repeatedly on the user-facing hot path.** Why it matters: One-off diagnostics have a different risk profile from background polling.

## Do not

- Do not add repeated exact count(*) polling to a live import dashboard without measuring the real query plan and refresh cadence at production scale.
- Do not claim the import writer is the only load source until the progress/status read path has been profiled.
- Do not hide approximate semantics; label estimated denominators and ETA clearly.
- Do not publish private provider names, tenant identifiers, database names, internal URLs, account IDs, or repository paths in public lessons.
- Do not treat this as only generic bounded polling; cross-check agent-hosts-need-bounded-polling for host polling cadence and cartesian-distinct-counts-can-dos-a-production-db/page-before-expensive-aggregation for query-shape count traps.

## Preferred next step

When asked for live import progress, design the status path from job-owned state first and treat exact target-table counts as an operator-gated diagnostic unless proven cheap.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-11.
- Source record path: `records/traps/data-import/hot-count-polling-can-become-the-incident.json`.
