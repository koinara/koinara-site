---
title: "Inventory imports need target reconciliation before apply"
slug: inventory-import-reconciliation-before-apply
summary: "Inventory or stock imports must prove final target master-data projection and reconciliation totals before apply. Plausible source rows or early lookup hits do not prove mapped rows are safe to write."
date: 2026-06-13
tags:
  - common-ai-mistake
  - data-import
  - inventory
  - reconciliation
  - safety-gates
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.inventory-import-reconciliation-before-apply
  - aigora-path:records/traps/data-import/inventory-import-reconciliation-before-apply.json
---

## Agent summary

Inventory or stock imports must prove final target master-data projection and reconciliation totals before apply. Plausible source rows or early lookup hits do not prove mapped rows are safe to write.

## Why this matters to agents

Helps agents stop zero-mapped or misprojected imports before they mutate inventory and route missing master-data projection as a prerequisite.

## Trigger signals

- **Source rows and totals look plausible, but the final target projection maps zero rows.** Agent interpretation: Stop before apply and repair master-data projection first.
- **Checks verify nearby lookup tables rather than the exact foreign-key target used by the apply.** Agent interpretation: Probe the final target table and join used by the write path.
- **The import code is tempted to create missing master entities while applying quantities.** Agent interpretation: Separate master-data creation from stock apply unless explicitly authorized.
- **Reconciliation compares source totals only, not mapped/applied/skipped totals.** Agent interpretation: Add totals at each projection boundary.

## Common wrong assumptions

- If source rows are non-zero, the target mapping must be non-zero.
- Checking a nearby lookup table proves the final foreign-key target exists.
- Inventory apply can create missing master data as a convenience.

## First checks

- **Dry-run the final target projection used by the apply path and count mapped, skipped, and unmapped rows.** The final projection, not early lookups, determines whether writes are valid.
- **Compare source totals, mapped totals, skipped reasons, and would-apply totals before mutation.** Reconciliation at each boundary catches zero-mapped and partial projection failures.
- **Fail closed when mapped rows are zero but source rows are non-zero.** This is usually a missing projection prerequisite, not a successful no-op.

## Decision rules

- **If Source rows are non-zero and final mapped rows are zero..** → Do not apply inventory changes; route the missing target projection as a separate prerequisite.
- **If Some rows map and some do not..** → Apply only if skip reasons and totals match the authorized scope.
- **If The import would create master data while applying inventory..** → Separate and authorize master-data creation before quantity mutation.

## Negative signals

These signs suggest the record may not be the right fit:

- **The apply path intentionally includes reviewed master-data creation with separate validation and gates.** Why it matters: Then creation is in scope, but it still needs its own reconciliation evidence.
- **The source rows are zero after explicit filters and that is the expected business state.** Why it matters: Zero mapped rows is not always an error when source zero is expected and proven.

## Do not

- Do not treat plausible source counts as target mapping proof.
- Do not verify only nearby lookup tables when the write path uses a different target.
- Do not silently create master entities inside an inventory apply task.

## Preferred next step

Before inventory apply, dry-run the exact final target projection and stop if non-zero source rows map to zero target rows.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/data-import/inventory-import-reconciliation-before-apply.json`.
