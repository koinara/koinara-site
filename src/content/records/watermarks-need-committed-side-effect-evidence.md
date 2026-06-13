---
title: "Import watermarks need committed side-effect evidence"
slug: watermarks-need-committed-side-effect-evidence
summary: "An import watermark or success marker should advance only from committed side effects. Audit rows and progress evidence must not become resume truth until the durable write they describe has actually succeeded."
date: 2026-06-13
tags:
  - batch-jobs
  - common-ai-mistake
  - data-import
  - idempotency
  - safe-recovery
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.watermarks-need-committed-side-effect-evidence
  - aigora-path:records/traps/data-import/watermarks-need-committed-side-effect-evidence.json
---

## Agent summary

An import watermark or success marker should advance only from committed side effects. Audit rows and progress evidence must not become resume truth until the durable write they describe has actually succeeded.

## Why this matters to agents

Helps agents distinguish in-flight progress, audit visibility, committed watermarks, and external acknowledgements when repairing imports or retries.

## Trigger signals

- **A watermark advances before the destination mutation commits.** Agent interpretation: Treat the watermark as unsafe; separate in-flight cursor from committed lower bound.
- **Evidence rows are written before the side effect they claim to prove.** Agent interpretation: Make those rows attempt/audit state only, not resume state.
- **A whole batch fails with the same downstream exception class after source reads succeed.** Agent interpretation: Investigate the local side-effect path before assuming an upstream outage.

## Common wrong assumptions

- If source reads succeeded, the import can advance the watermark.
- Audit rows are harmless even when resume logic later reads them as truth.
- A uniform exception across the batch must mean the upstream system is down.

## First checks

- **Trace the order of source read, destination write, audit/progress write, watermark advance, and external acknowledgement.** The committed side effect must be the boundary for success.
- **Probe a failed run and verify whether its rows can influence future resume lower bounds.** Failed attempts should be visible but not promoted automatically.
- **Classify exception uniformity before retrying.** Uniform local exceptions usually require code/config repair, not upstream backoff.

## Decision rules

- **If A watermark, lower bound, or success marker advances before durable destination commit..** → Move the state transition after the committed side effect and keep in-flight cursors separate.
- **If Failed attempt evidence exists but is not safe for resume..** → Keep it visible for audit while excluding it from resume selection unless a reviewed repair promotes it.
- **If Uniform downstream exceptions appear after successful source reads..** → Inspect local destination schema, permissions, serialization, and transaction boundaries before broad upstream retries.

## Negative signals

These signs suggest the record may not be the right fit:

- **The destination operation is atomic with the watermark update in one durable transaction.** Why it matters: The completion boundary may already be correct, though external acknowledgements still need review.
- **The progress evidence is explicitly labelled attempt-only and never read by resume logic.** Why it matters: Attempt logs can be useful without becoming committed state.

## Do not

- Do not let failed-run cursors become committed watermarks by accident.
- Do not acknowledge external notifications before the local persistence contract is satisfied; see webhook-ack-layer-and-auth-identity.
- Do not hide partial attempts; make them audit-visible but not authoritative.
- Do not use committed side-effect evidence as a substitute for persisted cursor-key design; cross-check progress-state-must-match-cursor-semantics when modes/windows can overwrite progress state.

## Preferred next step

Trace the import state transitions and ensure only committed destination effects can advance resume or watermark truth.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/data-import/watermarks-need-committed-side-effect-evidence.json`.
