---
title: "Long-running HTTP handlers are fragile batch runners"
slug: long-running-http-is-not-a-batch-runner
summary: "A large import or backfill should not depend on one HTTP request staying open through a load balancer or proxy. Use a resident worker or short start request plus durable progress and idempotent resume behavior."
date: 2026-06-13
tags:
  - agent-ops
  - batch-jobs
  - common-ai-mistake
  - data-import
  - http
  - load-balancers
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.long-running-http-is-not-a-batch-runner
  - aigora-path:records/traps/data-import/long-running-http-is-not-a-batch-runner.json
---

## Agent summary

A large import or backfill should not depend on one HTTP request staying open through a load balancer or proxy. Use a resident worker or short start request plus durable progress and idempotent resume behavior.

## Why this matters to agents

When an agent is asked to run or build a long import, this record should make it check transport timeouts before treating a 504/timeout as only an application bug.

## Trigger signals

- **The requested implementation runs the whole import inside one API route, controller, function, or web request.** Agent interpretation: Design a job handoff instead of stretching the HTTP timeout.
- **The operation has chunking, ETA, progress rows, or resume requirements.** Agent interpretation: The user-facing request should start or observe the job, not be the job owner.

## Common wrong assumptions

- Increasing the HTTP timeout is enough to make a long import reliable.
- A gateway timeout means the server-side work failed.
- Chunking inside a request is equivalent to a durable worker.
- Progress UI can be added later without first deciding where job state lives.

## First checks

- **List every request timeout between the browser/client and the handler: client, framework, proxy, load balancer, platform, and database driver.** The smallest timeout sets the real synchronous budget.
- **Prove job state survives HTTP disconnect by starting a bounded run, disconnecting or exceeding the former timeout, and reading progress from a durable source.** This distinguishes a worker design from a merely longer request.

## Decision rules

- **If The expected runtime can exceed a gateway/proxy/client timeout or must keep running after the operator page closes..** → Make HTTP start/status endpoints short and bounded; run the import in a resident worker, queue consumer, scheduler, or platform job with idempotent resume/retry semantics.

## Negative signals

These signs suggest the record may not be the right fit:

- **The entire operation is proven to finish comfortably below every relevant platform timeout and has no need to continue after disconnect.** Why it matters: A simple synchronous request can be correct for genuinely small bounded work.
- **The platform provides a first-class long-running job primitive behind the same API surface.** Why it matters: The architectural issue is not HTTP syntax itself but tying job lifetime to a client request.

## Do not

- Do not stretch only one timeout without checking upstream and downstream limits.
- Do not treat a timed-out client request as proof that the background work stopped; verify runtime state separately.
- Do not publish private URLs, tenant identifiers, account IDs, database names, or internal repository paths in public lessons.

## Preferred next step

When a batch API may run long, design the HTTP surface as start/status/control and put job ownership in a worker with durable progress.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/data-import/long-running-http-is-not-a-batch-runner.json`.
