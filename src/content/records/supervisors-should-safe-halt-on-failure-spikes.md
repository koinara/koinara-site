---
title: "Long-running job supervisors should safe-halt on failure spikes"
slug: supervisors-should-safe-halt-on-failure-spikes
summary: "A supervisor that restarts every failed long-running job can turn a transient network, provider, or database outage into an infinite retry storm unless it detects rapid failure growth and stops for attention."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - long-running-jobs
  - retries
  - safe-halt
  - supervisors
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.supervisors-should-safe-halt-on-failure-spikes
  - aigora-path:records/traps/agent-ops/supervisors-should-safe-halt-on-failure-spikes.json
---

## Agent summary

A supervisor that restarts every failed long-running job can turn a transient network, provider, or database outage into an infinite retry storm unless it detects rapid failure growth and stops for attention.

## Why this matters to agents

When agents build keepalive loops, they should specify both the restart condition and the stop condition, including evidence that future operators can use to decide whether to resume.

## Trigger signals

- **Many failures share the same transport or connection class within a short window.** Agent interpretation: Prefer safe halt and handoff over blind restart.
- **The supervisor has a restart loop but no failure threshold, backoff cap, or stop reason artifact.** Agent interpretation: Add a stop condition before relying on unattended execution.

## Common wrong assumptions

- Unattended means always restart.
- A retry loop is safer than stopping because it needs less human attention.
- Connection failures are harmless if the write path is idempotent.

## First checks

- **Define maximum consecutive failures, maximum failure rate, backoff behavior, and the artifact written when the supervisor stops.** Future agents need to know whether the stop was intentional protection or a crash.
- **After a safe halt, inspect the latest failure classes before resuming instead of only checking whether the process is dead.** The process may have stopped because the guard worked as designed.

## Decision rules

- **If Failures spike in a way consistent with transport/provider outage rather than isolated item-level errors..** → Stop the loop, write counts and failure classes, and require a deliberate resume after diagnosis.

## Negative signals

These signs suggest the record may not be the right fit:

- **The job is read-only, externally idempotent, cheap, and already has exponential backoff plus alerting.** Why it matters: Automatic retries may be acceptable when blast radius and cost are bounded.
- **A human explicitly authorized an emergency retry loop with a time/cost bound and monitoring owner.** Why it matters: Some operational incidents require aggressive retries, but only with explicit bounds.

## Do not

- Do not implement Restart=always or while-true loops without a failure-spike stop condition for mutable long-running jobs.
- Do not treat a guarded safe halt as an incident by itself; inspect the stop reason first.
- Do not publish private service names, tunnel targets, account IDs, URLs, or organization-specific queue names in public lessons.
- Do not confuse failure-spike safe halts with production-incident-safe-halt-scope-boundary; cross-check that record when the stop reason is an irreversible or approval boundary rather than retry-storm protection.

## Preferred next step

When creating or reviewing a supervisor, require both restart criteria and safe-halt criteria with a durable stop summary.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/agent-ops/supervisors-should-safe-halt-on-failure-spikes.json`.
