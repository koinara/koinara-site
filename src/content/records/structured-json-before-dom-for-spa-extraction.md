---
title: "Prefer structured JSON before DOM rows for SPA extraction"
slug: structured-json-before-dom-for-spa-extraction
summary: "After authorized observation of an authenticated SPA, content-filtered same-origin JSON payloads are often a safer extraction source than brittle DOM rows; keep per-item source telemetry and an explicit DOM fallback."
date: 2026-06-13
tags:
  - agent-ops
  - browser-automation
  - common-ai-mistake
  - external-systems
  - retrieval
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.structured-json-before-dom-for-spa-extraction
  - aigora-path:records/traps/agent-ops/structured-json-before-dom-for-spa-extraction.json
---

## Agent summary

After authorized observation of an authenticated SPA, content-filtered same-origin JSON payloads are often a safer extraction source than brittle DOM rows; keep per-item source telemetry and an explicit DOM fallback.

## Why this matters to agents

Helps agents build extraction tools that are stable, observable, and auth-safe without overfitting to transient DOM or opaque endpoint names.

## Trigger signals

- **DOM selectors can find visible rows but miss stable identifiers, hidden fields, or pagination state.** Agent interpretation: Inspect captured same-origin JSON payload shapes before committing to DOM scraping.
- **Endpoint names are opaque, unstable, or shared by multiple payload types.** Agent interpretation: Filter by content shape and required fields, not just URL substrings.
- **Extracted items lack source-field or missing-reason telemetry.** Agent interpretation: Add per-item telemetry so extraction drift becomes visible.

## Common wrong assumptions

- The visible DOM is always the safest extraction source.
- Endpoint URL names are reliable enough filters for SPA payloads.
- Missing identifiers can be silently skipped if most rows extract.

## First checks

- **Capture authorized same-origin JSON payloads and identify content-shape predicates for the needed records.** Content shape is often more stable than endpoint names or DOM layout.
- **Add parser tests for primary payload, fallback payload, missing identifier, and DOM fallback cases.** Tests keep extraction failures observable as the SPA evolves.
- **Emit per-item source-field and missing-reason telemetry.** Telemetry distinguishes no data from extraction drift.

## Decision rules

- **If Authorized structured payloads contain the needed identifiers and fields..** → Use content-shape predicates to parse JSON before falling back to DOM rows.
- **If Structured payloads are absent or outside the authorized session..** → Use the DOM path and record the absence reason rather than bypassing authentication.
- **If Telemetry shows missing identifiers or fallback spikes..** → Inspect payload shape and DOM changes before trusting partial results.

## Negative signals

These signs suggest the record may not be the right fit:

- **Using network payloads would require bypassing authentication or accessing data outside the authorized UI session.** Why it matters: Do not broaden access; stay within the authorized observation boundary.
- **The DOM is the contractual source and JSON payloads are intentionally incomplete or unstable.** Why it matters: Then DOM extraction with stronger assertions may be the safer contract.

## Do not

- Do not bypass authentication or broaden data access to obtain JSON.
- Do not filter only by opaque endpoint names when content shape is available.
- Do not silently drop items with missing identifiers.
- Do not apply extraction guidance to browser mutations; cross-check admin-form-writers-need-warmup-and-readback when the task writes remote admin state.

## Preferred next step

In an authorized SPA session, inspect same-origin JSON payload shapes, add parser/fallback tests, and emit per-item source telemetry.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/structured-json-before-dom-for-spa-extraction.json`.
