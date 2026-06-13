---
title: "Terminal-state recovery flags must cover downstream mutations"
slug: terminal-state-recovery-flags-must-cover-downstream-mutations
summary: "A recovery flag that bypasses only the first terminal-state guard can still fail or mutate later layers unexpectedly. Recovery semantics must cover every downstream mutation path intentionally."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - safe-recovery
  - safety-gates
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.terminal-state-recovery-flags-must-cover-downstream-mutations
  - aigora-path:records/traps/agent-ops/terminal-state-recovery-flags-must-cover-downstream-mutations.json
---

## Agent summary

A recovery flag that bypasses only the first terminal-state guard can still fail or mutate later layers unexpectedly. Recovery semantics must cover every downstream mutation path intentionally.

## Why this matters to agents

Helps agents design repair modes that are auditable, side-effect-bounded, and not merely a narrow parser bypass.

## Trigger signals

- **A flag name says allow or recover, but only the first validation branch checks it.** Agent interpretation: Audit every later mutation path before trusting the recovery mode.
- **The tool performs expensive setup before discovering the terminal-state repair is not actually allowed.** Agent interpretation: Move terminal validation ahead of setup or split preflight from repair.
- **A repair command can silently reopen, reactivate, or rewrite a terminal record.** Agent interpretation: Require an explicit repair-only action and evidence, not a normal active-state transition.

## Common wrong assumptions

- One allow flag at the parser layer changes the meaning of the whole workflow.
- Raw mutation is acceptable when the safe wrapper cannot repair terminal state.
- If the first guard passes, later setup and mutation cannot violate terminal semantics.

## First checks

- **Inject a terminal record and run the recovery path in dry-run or test mode.** The test proves whether downstream code still assumes active state.
- **Assert that no active-state transition APIs are called during repair.** Recovery should repair the intended artifact, not silently reopen it.
- **Place terminal-state validation before expensive or irreversible setup.** Rejected recovery should fail before costly side effects.

## Decision rules

- **If A recovery flag affects only an early guard..** → Make every downstream mutation either repair-aware or explicitly refused before setup.
- **If A terminal record needs narrow artifact repair..** → Provide a scoped repair command with evidence rather than normalizing direct data edits.
- **If The requested recovery would reopen or alter terminal truth..** → Stop and route through the appropriate gate for state-changing recovery.

## Negative signals

These signs suggest the record may not be the right fit:

- **The recovery mode is side-effect-free and only reports the repair plan.** Why it matters: A diagnostic preflight may safely inspect terminal records without full mutation semantics.
- **All downstream mutations are explicitly covered by tests for terminal input.** Why it matters: Then the flag may already have the intended end-to-end semantics.

## Do not

- Do not let allow flags become partial parser bypasses.
- Do not perform expensive setup before deciding whether terminal recovery is allowed.
- Do not normalize raw mutation because the wrapper lacks a repair mode.

## Preferred next step

Test recovery against terminal fixtures and verify every downstream mutation path is intentionally repair-aware or refused.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/terminal-state-recovery-flags-must-cover-downstream-mutations.json`.
