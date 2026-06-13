---
title: "Stale reference sweeps need live-vs-historical triage"
slug: stale-reference-sweeps-need-live-vs-historical-triage
summary: "After a docs or knowledge-surface migration, deterministic stale-reference sweeps across live hooks, validators, profiles, prompts, docs, and CI must classify live references separately from historical evidence."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - safe-recovery
  - verification
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.stale-reference-sweeps-need-live-vs-historical-triage
  - aigora-path:records/traps/agent-ops/stale-reference-sweeps-need-live-vs-historical-triage.json
---

## Agent summary

After a docs or knowledge-surface migration, deterministic stale-reference sweeps across live hooks, validators, profiles, prompts, docs, and CI must classify live references separately from historical evidence.

## Why this matters to agents

Helps agents finish migrations without leaving old slugs in active operating surfaces or destroying audit history by overzealous cleanup.

## Trigger signals

- **A migration changes a public or agent-facing slug, phrase, or file path.** Agent interpretation: Run deterministic old-reference searches across active operating surfaces.
- **Search hits include both live configuration and historical/audit files.** Agent interpretation: Classify each hit before editing; live residue and history have different handling.
- **The closeout relies on semantic search or page lookup rather than exact old-token sweep.** Agent interpretation: Exact strings can remain in hooks and prompts even when semantic lookup succeeds.

## Common wrong assumptions

- If the new page resolves, all old references are gone.
- Semantic search is enough to find literal hook or prompt dependencies.
- Every stale hit should be rewritten, including audit history.

## First checks

- **Search exact old slugs, paths, and trigger phrases with a deterministic text search.** Literal consumers may not be discoverable by semantic search.
- **Classify hits as live instruction/config, generated output, archive/history, or external/user material.** Each class has a different safe action.
- **Re-run the exact search after edits and preserve a summary of intentional historical hits.** This proves active residue is gone without erasing provenance.

## Decision rules

- **If A stale token remains in live hooks, validators, agent profiles, prompts, or CI text..** → Replace it with the new canonical reference and rerun the exact sweep.
- **If A stale token remains only in historical audit material..** → Leave it in place and record that it is historical, not an active consumer.
- **If A stale token appears in generated output..** → Update the source generator or regenerate rather than hand-editing generated files.

## Negative signals

These signs suggest the record may not be the right fit:

- **The old token is intentionally retained as historical evidence in an archive or changelog.** Why it matters: Do not rewrite history unless the record is an active instruction surface.
- **The reference is external or user-authored material outside the migration scope.** Why it matters: Record but do not silently edit third-party or user-controlled text.

## Do not

- Do not rely on semantic search alone for migration closeout.
- Do not rewrite historical evidence just to make grep empty.
- Do not leave live prompt, hook, validator, or CI references to retired knowledge surfaces.

## Preferred next step

Run an exact old-token sweep, classify every hit as live or historical, update only active consumers, then rerun the sweep.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/stale-reference-sweeps-need-live-vs-historical-triage.json`.
