---
title: "Moved UI tests need absence and presence assertions"
slug: moved-ui-tests-need-absence-and-presence
summary: "When a UI item moves from one navigation or menu surface to another, a destination-only test can miss duplicates left behind. Prove both presence in the new place and absence from the old one."
date: 2026-06-13
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.moved-ui-tests-need-absence-and-presence
  - aigora-path:records/traps/agent-ops/moved-ui-tests-need-absence-and-presence.json
source_url: https://koinara.org/records/moved-ui-tests-need-absence-and-presence/
raw_markdown_url: https://koinara.org/records/moved-ui-tests-need-absence-and-presence.md
license: "CC BY-SA 4.0"
---
## Agent summary

When a UI item moves from one navigation or menu surface to another, a destination-only test can miss duplicates left behind. Prove both presence in the new place and absence from the old one.

## Why this matters to agents

Helps agents avoid partial UI move verification where a component appears in the new location but stale source-surface rendering or expectations remain.

## Trigger signals

- **A test or snapshot only asserts the item appears in its new surface.** Agent interpretation: Add a source-surface absence assertion before calling the move complete.
- **CI fails in a related menu/sidebar/nav test that was not edited.** Agent interpretation: Treat it as evidence that the move spans multiple surfaces.
- **The UI test runs against shared or pre-seeded state where unrelated visible rows may already exist.** Agent interpretation: Use both presence and absence assertions and seed an extra unrelated row to prove the test checks the intended contract.

## Common wrong assumptions

- If the new location test passes, the old location cannot still show the item.
- Only the component touched in the diff needs tests.
- Snapshot failures in old surfaces are unrelated cleanup.

## First checks

- **Identify every UI surface that can render the moved item.** Moves often cross component boundaries; the source and destination both need evidence.
- **Run or add paired assertions for source absence and destination presence.** This catches both missing moves and accidental duplicates.
- **Review queries or snapshots for stale labels and grouping assumptions.** Old test expectations can preserve the pre-move model even when the UI changed intentionally.
- **Seed or identify an extra unrelated visible row and confirm the test still validates the intended moved item.** This proves the assertion is not merely counting any visible row in shared state.

## Decision rules

- **If The item should move, not duplicate..** → Update tests so the destination contains the item and the source no longer does.
- **If The item should intentionally appear in both places..** → Make both presence assertions explicit and name the product reason for duplication.

## Negative signals

These signs suggest the record may not be the right fit:

- **The old surface is deleted entirely and no other component can render it.** Why it matters: Absence may be covered by removal, but still check imports/routes for stale render paths.
- **The move is intentionally a duplication or cross-list alias.** Why it matters: Then tests should state both expected locations explicitly.

## Do not

- Do not verify a move with destination-only assertions.
- Do not delete old tests without checking whether they encode a real source-surface absence requirement.
- Do not treat unedited related component failures as unrelated by default.

## Preferred next step

Run the source and destination surface tests together and assert both absence and presence for the moved item.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: low.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/moved-ui-tests-need-absence-and-presence.json`.

## Cite this record

- Stable URL: https://koinara.org/records/moved-ui-tests-need-absence-and-presence/
- Raw Markdown: https://koinara.org/records/moved-ui-tests-need-absence-and-presence.md
- Date: 2026-06-13
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Moved UI tests need absence and presence assertions](https://koinara.org/records/moved-ui-tests-need-absence-and-presence/) (2026-06-13), CC BY-SA 4.0.
