---
title: "Request-side datetime filters need literal and precision checks"
slug: external-api-query-datetime-literal-precision
summary: "A differential import can repeatedly fetch the same records when an external search API accepts a timestamp filter string but silently honors only the date portion or a lower precision than the cursor uses."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - external-systems
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.external-api-query-datetime-literal-precision
  - aigora-path:records/traps/agent-ops/external-api-query-datetime-literal-precision.json
source_url: https://koinara.org/records/external-api-query-datetime-literal-precision/
raw_markdown_url: https://koinara.org/records/external-api-query-datetime-literal-precision.md
license: "CC BY-SA 4.0"
---
## Agent summary

A differential import can repeatedly fetch the same records when an external search API accepts a timestamp filter string but silently honors only the date portion or a lower precision than the cursor uses.

## Why this matters to agents

Helps agents debug cursor-advances-but-membership-does-not-change symptoms at the upstream query-parser boundary instead of chasing downstream deduplication first.

## Trigger signals

- **Each run returns the same small count and the same record identities even though the saved cursor advances.** Agent interpretation: Check result membership against the cursor before blaming upsert deduplication.
- **Upsert metrics are mostly or entirely unchanged, such as saved count equaling unchanged count.** Agent interpretation: This can be an upstream filter-literal issue, not only a downstream no-op.
- **The external API accepts the raw query without a clear parse error.** Agent interpretation: Accepted syntax is not proof that the intended precision was honored.
- **Boundary-count checks around the exact cursor time do not explain the repeated membership.** Agent interpretation: The parser may be truncating or rounding before comparison.

## Common wrong assumptions

- A moving cursor means the upstream query is narrowing the result set.
- If the API did not reject the query, it understood every timestamp character as intended.
- Unchanged upserts always mean downstream deduplication is working correctly.

## First checks

- **Log or snapshot the final query string in a redacted safe form.** Agents need the literal actually sent, not just the intended cursor value.
- **Assert the provider-documented quote, offset, and timestamp precision in a query-builder test.** External search syntax is a parser contract.
- **Verify with real or fixture data that changing the cursor changes result membership, not only aggregate counts.** Membership is the discriminator for truncation/rounding.
- **Compare this request/query-side literal issue with any response-side timezone or nested-model record before merging hypotheses.** The related public record covers different API shape failures.

## Decision rules

- **If Cursor advances but returned identities remain fixed and the outbound datetime literal does not match documented quote/precision form.** → Change the query builder to emit the documented literal form, including quotes and supported precision, then rerun a membership-changing fixture.
- **If Repeated unchanged rows are explained by another writer, duplicate notifications, or a stable dataset boundary.** → Do not apply the parser-precision trap; investigate the real repeated-write mechanism.

## Negative signals

These signs suggest the record may not be the right fit:

- **Another ingestion path legitimately saved the same records first.** Why it matters: Repeated unchanged rows can be a valid race with another writer; compare record identities and write timing.
- **Multiple notifications point to the same entity by design.** Why it matters: Repeated entity IDs may reflect provider event semantics rather than parser precision.
- **The external API documentation explicitly supports the exact quote, offset, and fractional precision being sent and a fixture proves membership changes.** Why it matters: Then inspect downstream deduplication or cursor storage next.

## Do not

- Do not expand production import scope to test the hypothesis.
- Do not log raw credentials or private customer identifiers in query evidence.
- Do not merge this with response-side timezone or nested-model failures without preserving the request-side membership discriminator.

## Preferred next step

Capture the exact safe query string, match documented datetime literal precision, and prove cursor changes alter result membership.

## Related records

- `external-api-timezone-and-nested-models`

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/external-api-query-datetime-literal-precision.json`.

## Cite this record

- Stable URL: https://koinara.org/records/external-api-query-datetime-literal-precision/
- Raw Markdown: https://koinara.org/records/external-api-query-datetime-literal-precision.md
- Date: 2026-06-07
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Request-side datetime filters need literal and precision checks](https://koinara.org/records/external-api-query-datetime-literal-precision/) (2026-06-07), CC BY-SA 4.0.
