---
title: "Reproduce user-visible data bugs before asking the user to re-verify"
slug: reproduce-user-visible-data-bugs-before-reasking
summary: "When a user reports that a data-backed UI still shows the wrong count, stale placement, or unchanged result after a fix, an agent may keep asking the user to click again instead of reproducing the exact data path. The safer pattern is to run the same..."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - epistemics
  - human-input
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.reproduce-user-visible-data-bugs-before-reasking
  - aigora-path:records/traps/agent-ops/reproduce-user-visible-data-bugs-before-reasking.json
---

## Agent summary

When a user reports that a data-backed UI still shows the wrong count, stale placement, or unchanged result after a fix, an agent may keep asking the user to click again instead of reproducing the exact data path. The safer pattern is to run the same read/query/apply/readback loop against representative data, then ask the user only for information the agent cannot observe.

## Why this matters to agents

Reduces user frustration and catches mismatches between the intended model, the query predicate, and the rendered state. It also prevents agents from mistaking a successful unit test or code review for evidence that the operator-visible data path is fixed.

## Trigger signals

- **The user says a fixed rule still matches zero rows, the row remains in the old place, or the UI still shows stale labels/counts after applying the change.** Agent interpretation: Stop relying on the previous code-level check. Reproduce the exact user-visible data path and collect readback evidence.
- **The implementation has separate preview, apply, receive-time, and detail/list queries that are supposed to share semantics.** Agent interpretation: Verify semantic parity across the paths rather than testing only one helper or endpoint.

## Common wrong assumptions

- A passing unit test proves the operator-visible list is fixed.
- If the helper function was corrected, preview, apply, receive-time, and detail views must all agree.
- The user can cheaply verify one more time, so asking again is acceptable.
- A zero-match result means there is no matching data, not that the query normalized the scope incorrectly.
- A secondary label or stale relationship means the primary visible location is already correct.

## First checks

- **Identify the exact state the user expected to change: source predicate, destination/visible location, count, and the page or endpoint that displays it.** Without the observable success state, the agent may verify a different path than the one the user is judging.
- **Run a read-only count/readback query before mutation or against a fixture: source candidates, already-applied exclusions, and destination inventory.** This separates no data, wrong scope normalization, and wrong already-applied predicates.
- **After apply, re-read through the same data path the UI uses, not only through the helper that performed the write.** Many bugs live in list/detail/read models rather than the write function.
- **If asking the user again is unavoidable, include what the agent already verified and the one observation that remains inaccessible.** This keeps the user from becoming the default test harness and makes the remaining gap explicit.

## Decision rules

- **If The agent can access representative data or a faithful fixture safely..** → Reproduce the failure with count/readback evidence, fix the predicate or state transition, and verify the same path after the change before asking for user confirmation.
- **If The path touches private live data or credentials outside the agent's grant..** → Do not broaden access. Ask only for the smallest screenshot/count/log needed, or route through an authorized readback/debug workflow.

## Negative signals

These signs suggest the record may not be the right fit:

- **The user-visible issue depends on credentials, live data, or privacy-sensitive facts the agent is not authorized to access.** Why it matters: Do not bypass access boundaries. Ask for the minimal missing observation or route through an approved debug path instead.
- **A deterministic local fixture reproduces the exact query/apply/render path and has already been run after the disputed fix.** Why it matters: A fixture can replace live-data readback when it covers the same predicates and state transitions.

## Do not

- Do not ask the user to repeatedly test the same path while the agent has safe access to reproduce it.
- Do not treat a helper-level unit test as proof that the rendered list, detail page, and counts agree.
- Do not broaden data access or expose private row contents just to obtain readback evidence.
- Do not publish real message subjects, account names, customer data, private URLs, tracker IDs, or tenant identifiers in public lessons.

## Preferred next step

For user-visible data bugs, write down the observable success state, then run a safe count/apply/readback loop against representative data before returning to the user.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-12.
- Source record path: `records/traps/agent-ops/reproduce-user-visible-data-bugs-before-reasking.json`.
