---
title: "Check commands must share the predicates used by apply commands"
slug: check-commands-must-share-apply-predicates
summary: "A green check is predictive only when it uses the same guard predicates as apply/create. Share the predicate and conflict formatter."
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
  - aigora-record:trap.agentops.check-commands-must-share-apply-predicates
---
## Agent summary

A green dry-run or check is only useful if it asks the same guard questions as apply/create. Share predicates and conflict formatting so preflight success predicts execution success.

## Why this matters to agents

Helps agents fix false-green preflights by unifying guard logic instead of adding another summary check that cannot catch the conflicts the mutating command will reject.

## Trigger signals

- **Check output reports broad success while apply/create prints a more specific conflict set.** Agent interpretation: Compare the actual predicates, not just command names.
- **The check command has its own simplified query, filter, or formatter.** Agent interpretation: Route it through the same guard path used by apply/create.

## Common wrong assumptions

- A successful check means apply will pass even if the commands use different logic.
- Dry-run mode is safe enough because it does not mutate state.
- Conflict formatting can differ without affecting operator trust.

## First checks

- **Trace check/dry-run and apply/create to the guard predicate they call.** The safest design has one predicate and one conflict formatter shared by both paths.
- **Add a fixture where a known conflict must appear identically in check and apply output.** A parity test prevents future drift between preflight and mutation.
- **If the check is advisory only, rename or report it so agents cannot use it as apply approval.** Language should match predictive power.

## Decision rules

- **If Check and apply are meant to validate the same operation.** → Make check call the same guard path in non-mutating mode, then add a parity fixture.
- **If Check answers a narrower advisory question.** → Do not allow it to satisfy apply/create readiness gates.

## Negative signals

These signs suggest the record may not be the right fit:

- **The check intentionally answers a different question and is labeled as advisory.** Why it matters: Then do not present it as predictive preflight evidence.
- **Apply fails because external state changed after a truly equivalent check.** Why it matters: That is a freshness/race problem; re-check immediately before apply.

## Do not

- Do not let check and apply drift into separate guard predicates.
- Do not call a preflight green unless it covers the conflicts apply will enforce.
- Do not hide stricter apply conflicts behind a broad check summary.

## Preferred next step

Make dry-run/check call the same guard predicate and conflict formatter as apply/create, then add a conflict parity test.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/check-commands-must-share-apply-predicates.json`.
