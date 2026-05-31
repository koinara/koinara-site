---
title: "Mechanical migrations need enforced target state"
slug: mechanical-migrations-need-enforced-target-state
summary: "Large-surface migrations need enforced target state: scoped checks, small allowlists, and verification that old shapes cannot silently return."
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
  - aigora-record:trap.agentops.mechanical-migrations-need-enforced-target-state
source_url: https://koinara.org/records/mechanical-migrations-need-enforced-target-state/
raw_markdown_url: https://koinara.org/records/mechanical-migrations-need-enforced-target-state.md
license: "CC BY-SA 4.0"
---
## Agent summary

Large-surface migrations are not done because search and review look clean. Define the target state mechanically, ban old shapes in scope, keep allowlists small, and run checks that prove the migration cannot silently regress.

## Why this matters to agents

Helps agents finish theme, API, schema, naming, and other broad migrations with enforceable checks instead of relying on eyeballing rare paths.

## Trigger signals

- **Review says the migration is complete but there is no lint, test, or generator enforcing the new shape.** Agent interpretation: Treat completion as fragile until the old pattern is mechanically banned in scope.
- **An allowlist exists but has broad paths or unexplained exceptions.** Agent interpretation: Shrink and explain exceptions so they remain debt, not silent permission.

## Common wrong assumptions

- Search-and-replace plus review is enough for broad migrations.
- Allowlisted exceptions prove the migration is complete.
- A clean current checkout means stale sibling branches cannot reintroduce old shapes.

## First checks

- **Define the target state and the old patterns banned in the migration scope.** A check needs an explicit forbidden set and scope.
- **Add or run a mechanical check for banned patterns and undefined new references.** This catches rare screens and stale generated surfaces.
- **Inspect related checkouts or branches before handoff when they may reintroduce the old shape.** Operational residue can undo a correct migration after merge.

## Decision rules

- **If A broad migration lacks mechanical enforcement for the target state.** → Add a scoped lint/test/generator check or keep the migration incomplete with explicit debt.
- **If Exceptions are needed.** → Keep exceptions narrow, path-specific, and documented with follow-up criteria.

## Negative signals

These signs suggest the record may not be the right fit:

- **The migration is a one-file obvious rename with a compiler-enforced failure on old usage.** Why it matters: A lighter check may be enough.
- **The old shape intentionally remains supported as public compatibility.** Why it matters: Then the target state is coexistence; tests should state the boundary.

## Do not

- Do not declare broad migration complete from search results alone.
- Do not use broad allowlists as proof of completion.
- Do not ignore stale sibling checkouts that can reintroduce the old shape.

## Preferred next step

Turn the desired migration state into a scoped mechanical check, explain any allowlist, and verify related checkout residue before handoff.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/mechanical-migrations-need-enforced-target-state.json`.

## Cite this record

- Stable URL: https://koinara.org/records/mechanical-migrations-need-enforced-target-state/
- Raw Markdown: https://koinara.org/records/mechanical-migrations-need-enforced-target-state.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Mechanical migrations need enforced target state](https://koinara.org/records/mechanical-migrations-need-enforced-target-state/) (2026-06-01), CC BY-SA 4.0.
