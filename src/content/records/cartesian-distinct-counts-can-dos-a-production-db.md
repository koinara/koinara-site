---
title: "Cartesian distinct counts can DoS a production database"
slug: cartesian-distinct-counts-can-dos-a-production-db
summary: "A query that counts distinct entities after joining multiple option, dimension, or composition tables can accidentally materialize a cartesian product. Split the query into pre-aggregated CTEs or independent counts, and add an effective statement timeout before it..."
date: 2026-06-13
tags:
  - common-ai-mistake
  - database
  - performance
  - production-incident
  - query-planning
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.database.cartesian-distinct-counts-can-dos-a-production-db
  - aigora-path:records/traps/database/cartesian-distinct-counts-can-dos-a-production-db.json
---

## Agent summary

A query that counts distinct entities after joining multiple option, dimension, or composition tables can accidentally materialize a cartesian product. Split the query into pre-aggregated CTEs or independent counts, and add an effective statement timeout before it reaches production scale.

## Why this matters to agents

Helps agents recognize that a read-only aggregate can create a production outage when distinct counts are computed over a blown-up join graph.

## Trigger signals

- **The SQL joins axes, values, cells, products, or other many-to-many dimensions and then calls count(distinct ...) over the joined result.** Agent interpretation: Assume the query may be multiplying rows before counting; inspect the plan at realistic scale before shipping.
- **Database CPU spikes from a read-only list/count endpoint, while terminating the aggregate queries immediately relieves load.** Agent interpretation: Treat the count query itself as the incident source, not merely as harmless observability.
- **The product model distinguishes sparse real entities from a larger logical cartesian grid.** Agent interpretation: Compute sparse entity counts and logical-grid counts in separate subqueries or pre-aggregates instead of one broad joined aggregate.

## Common wrong assumptions

- A read-only count cannot be the cause of an outage.
- count(distinct ...) makes a broad join safe because duplicates are removed at the end.
- The logical combination count and real sparse row count should be computed in the same joined query.
- Adding more indexes will fix a query whose main cost is row multiplication.

## First checks

- **Run EXPLAIN/EXPLAIN ANALYZE on the count query at realistic scale and inspect estimated versus actual rows at each join.** The dangerous clue is often a large intermediate row count before the final distinct aggregate.
- **Rewrite counts as independent CTEs or pre-aggregates: count real sparse rows in one branch and logical combinations from dimension cardinalities in another branch.** Pre-aggregation prevents the database from building the full cartesian join just to discard duplicates later.
- **Verify the effective timeout layer by forcing a deliberately slow version in a safe environment and confirming the application receives a bounded failure.** Timeouts are useful only if applied on the connection/session/query layer actually used by the endpoint.

## Decision rules

- **If A hot endpoint joins multiple many-to-many dimensions before count(distinct ...), and the UI only needs separate sparse and logical counts..** → Use CTEs or independent subqueries, compare before/after plans and runtime, and keep a statement timeout guard on the production path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The joined relations are provably tiny, bounded, and protected by tests or database constraints that prevent multiplication.** Why it matters: The cartesian risk depends on scale and join cardinality, not on the syntax alone.
- **The count runs only in an operator-gated offline diagnostic with a timeout and no user-facing refresh loop.** Why it matters: One-off diagnostics have a different risk profile from hot production endpoints.

## Do not

- Do not rely on count(distinct ...) to rescue a query after a broad cartesian join has already happened.
- Do not ship a production list endpoint aggregate without checking cardinality at realistic data scale.
- Do not remove timeout guards after the query is optimized; keep bounded failure for regression safety.
- Do not publish private product names, URLs, tenant identifiers, repository paths, database names, or incident timestamps beyond de-identified evidence.
- Do not merge this with hot-count-polling-can-become-the-incident or page-before-expensive-aggregation; they are related count-load traps with different mechanisms.

## Preferred next step

When adding counts over variant/dimension structures, design the count query from cardinalities and sparse facts separately, then prove the plan does not materialize the full combination space.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-13.
- Source record path: `records/traps/database/cartesian-distinct-counts-can-dos-a-production-db.json`.
