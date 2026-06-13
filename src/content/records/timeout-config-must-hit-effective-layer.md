---
title: "Timeout fixes must be applied at the effective layer"
slug: timeout-config-must-hit-effective-layer
summary: "Changing a timeout option in the nearest request call may not affect the actual deadline. Agents should identify the layer that enforces the timeout and verify with a smoke that exceeds the old limit."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - data-import
  - database
  - timeouts
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.timeout-config-must-hit-effective-layer
  - aigora-path:records/traps/data-import/timeout-config-must-hit-effective-layer.json
---

## Agent summary

Changing a timeout option in the nearest request call may not affect the actual deadline. Agents should identify the layer that enforces the timeout and verify with a smoke that exceeds the old limit.

## Why this matters to agents

Prevents agents from repeatedly patching timeout literals that look plausible but are ignored by the driver, pool, proxy, or platform actually enforcing the deadline.

## Trigger signals

- **Failures still happen at the same fixed duration after a timeout option was changed nearby.** Agent interpretation: The changed option is probably not the enforcing layer.
- **The client has multiple timeout scopes such as request, pool, connection, statement, socket, proxy, or load balancer.** Agent interpretation: Map the timeout hierarchy before changing code.

## Common wrong assumptions

- The timeout option closest to the query is always the one being enforced.
- A code diff that increases a timeout proves the runtime deadline changed.
- A successful fast query validates a timeout fix.

## First checks

- **Create a timeout map naming every layer that can cancel the call and its current configured deadline.** The actual deadline is the earliest active cancellation source.
- **Run a bounded smoke that is expected to take longer than the old deadline and shorter than the new one, then record measured duration and success/failure.** Only a >old-timeout smoke proves the effective deadline moved.

## Decision rules

- **If A timeout remains fixed after local option changes or the client exposes pool/global timeout settings..** → Change the enforcing layer, keep the operation bounded, and verify with a timed smoke that crosses the former deadline.

## Negative signals

These signs suggest the record may not be the right fit:

- **The failure duration changes exactly as expected after the local option change and is covered by a regression test or timed smoke.** Why it matters: The effective layer may already have been identified.
- **The slow operation should be optimized or indexed rather than allowed to run longer.** Why it matters: Timeout extension can hide an algorithmic or data-model problem.

## Do not

- Do not claim a timeout fix from a fast-path smoke that completes below the old deadline.
- Do not increase timeouts to mask an unbounded query, missing index, or runaway batch without a separate design check.
- Do not publish private driver configs, hostnames, tenant identifiers, SQL text containing business data, or internal paths in public lessons.

## Preferred next step

When a timeout patch seems ignored, map cancellation layers and verify the selected layer with a timed smoke exceeding the former limit.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/data-import/timeout-config-must-hit-effective-layer.json`.
