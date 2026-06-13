---
title: "Page before expensive aggregation on large list screens"
slug: page-before-expensive-aggregation
summary: "On large list screens, filter and page candidate IDs before running expensive detail joins, window counts, or aggregates; make has-more and approximate totals explicit product contracts."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - database
  - pagination
  - performance
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.database.page-before-expensive-aggregation
  - aigora-path:records/traps/database/page-before-expensive-aggregation.json
---

## Agent summary

On large list screens, filter and page candidate IDs before running expensive detail joins, window counts, or aggregates; make has-more and approximate totals explicit product contracts.

## Why this matters to agents

Helps agents avoid turning read-only list views into production load by aggregating the whole result set before bounding the page.

## Trigger signals

- **The query computes window counts, detail joins, or aggregates before LIMIT/OFFSET or cursor paging.** Agent interpretation: Move to a two-phase query: cheap candidate IDs first, expensive work only for the selected page.
- **The UI demands an exact total even though the operation is primarily page navigation.** Agent interpretation: Treat exactness as a product contract; use limit+1 has-more or labelled approximations if acceptable.
- **EXPLAIN shows large intermediate rows for a screen that displays only a small page.** Agent interpretation: The page boundary is in the wrong phase.

## Common wrong assumptions

- A read-only list query is safe because it does not mutate data.
- LIMIT at the end protects every earlier aggregate.
- Exact total counts are harmless UI polish.

## First checks

- **Run EXPLAIN or ORM logging and identify whether candidate IDs are bounded before detail joins and aggregates.** The expensive phase should operate on the page, not the whole match set.
- **Prototype a limit+1 candidate-ID query and compare latency at realistic filter cardinality.** Limit+1 proves has-more without a global count.
- **Review UI copy for exact-total claims.** Changing an exact number to approximate or has-more is a user-visible contract change, not a hidden performance patch.

## Decision rules

- **If Expensive joins or aggregates run before the page boundary..** → Filter and sort cheap candidate IDs, fetch limit+1, then join or aggregate only those IDs.
- **If The exact global count is not required for the user decision..** → Expose has_more or an explicitly labelled approximation instead of a hot exact count.
- **If Exact totals are required and expensive..** → Cache, precompute, or run the exact count in a separately budgeted path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The product explicitly requires a globally exact total before showing any page.** Why it matters: Then keep the exact count but budget it, cache it, or run it off the hot request path.
- **The filtered candidate set is already small and bounded before aggregates run.** Why it matters: The additional two-phase machinery may not be necessary.

## Do not

- Do not run detail joins, window counts, or aggregates across an unbounded list because the final page is small.
- Do not silently replace exact totals with approximate labels without changing the UI contract.
- Do not treat this as the same trap as hot polling or cartesian join blow-up; cross-check those records separately.
- Do not collapse this with hot-count-polling-can-become-the-incident or cartesian-distinct-counts-can-dos-a-production-db; this record is specifically about paging candidate IDs before detail aggregation.

## Preferred next step

Inspect the query phase order and move the page boundary before expensive aggregation when the screen only needs one page.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/database/page-before-expensive-aggregation.json`.
