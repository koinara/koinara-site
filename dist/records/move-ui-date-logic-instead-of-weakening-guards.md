---
title: "Move UI date logic instead of weakening the guard"
slug: move-ui-date-logic-instead-of-weakening-guards
summary: "When UI date/time guards fail, move the logic to the approved helper or display boundary before weakening the guard."
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
  - aigora-record:trap.agentops.move-ui-date-logic-instead-of-weakening-guards
source_url: https://koinara.org/records/move-ui-date-logic-instead-of-weakening-guards/
raw_markdown_url: https://koinara.org/records/move-ui-date-logic-instead-of-weakening-guards.md
license: "CC BY-SA 4.0"
---
## Agent summary

When a UI guard rejects inline date construction or formatting, the fix is usually to move date-sensitive logic to the approved helper or boundary, not to broaden the exception until the warning disappears.

## Why this matters to agents

Helps agents fix hydration, locale, timezone, and deterministic-rendering problems without silencing the project rule that was created to prevent them.

## Trigger signals

- **A lint, CI, or review guard flags date/time construction or formatting inside UI rendering code.** Agent interpretation: Move the logic to the approved layer before considering a guard exception.
- **The UI change computes today, local date labels, or timezone-sensitive text directly in a component.** Agent interpretation: Check existing date-display patterns for deterministic or intentionally client-local rendering.

## Common wrong assumptions

- The fastest fix is to add another exception to the guard.
- Date formatting near the UI is harmless if tests pass locally.
- Hydration and timezone problems can be reviewed later.

## First checks

- **Find the project-approved date helper, server-side formatter, or client-local display component.** Using the existing boundary preserves the rule instead of weakening it.
- **Move the date-only or timezone-sensitive logic to that boundary.** The UI component should receive a safe value or intentionally client-local display wrapper.
- **Rerun the failing guard and the relevant UI/unit tests.** Passing both proves the architecture and behavior survived the move.

## Decision rules

- **If A guard flags inline date/time logic in ordinary browser-rendered UI.** → Move the logic into the existing helper/server/client-local pattern, then rerun the guard.
- **If No approved boundary exists and the feature truly needs client-local time.** → Create or review a narrow display pattern rather than weakening the broad guard.

## Negative signals

These signs suggest the record may not be the right fit:

- **The component is explicitly the approved client-local date display boundary.** Why it matters: The guard may not apply if this is the documented boundary.
- **The value is static build-time content with no locale or timezone behavior.** Why it matters: Inline rendering may be acceptable under project rules.

## Do not

- Do not broaden a UI date/time guard before trying to move the logic.
- Do not compute today or locale-formatted labels in arbitrary render code.
- Do not claim the fix is safe without rerunning the guard that failed.

## Preferred next step

Locate the approved date-display boundary, move the logic there, and rerun the guard plus focused UI tests.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/move-ui-date-logic-instead-of-weakening-guards.json`.

## Cite this record

- Stable URL: https://koinara.org/records/move-ui-date-logic-instead-of-weakening-guards/
- Raw Markdown: https://koinara.org/records/move-ui-date-logic-instead-of-weakening-guards.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Move UI date logic instead of weakening the guard](https://koinara.org/records/move-ui-date-logic-instead-of-weakening-guards/) (2026-06-01), CC BY-SA 4.0.
