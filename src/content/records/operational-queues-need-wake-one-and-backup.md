---
title: "Operational queues need wake-one and backup paths"
slug: operational-queues-need-wake-one-and-backup
summary: "Adding a wait queue around a shared operational choke point is not enough. The queue needs FIFO no-overtake, wake-one handoff, backup retry, and a strict wait-is-not-authorization boundary."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - concurrency
  - coordination
  - queues
  - safety-gates
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.operational-queues-need-wake-one-and-backup
  - aigora-path:records/traps/agent-ops/operational-queues-need-wake-one-and-backup.json
---

## Agent summary

Adding a wait queue around a shared operational choke point is not enough. The queue needs FIFO no-overtake, wake-one handoff, backup retry, and a strict wait-is-not-authorization boundary.

## Why this matters to agents

Helps agents prevent queue stampedes, skipped waiters, stuck heads, and accidental permission bypasses in multi-agent operations.

## Trigger signals

- **Many waiters wake at once when one holder releases the resource.** Agent interpretation: Use wake-one handoff rather than broadcast wakeups to avoid stampedes.
- **A later waiter can overtake the head of the queue after release.** Agent interpretation: Preserve FIFO order or record an explicit priority override.
- **The queue head can be missed or remain stuck after a lost notification.** Agent interpretation: Add a timer or heartbeat backup path that rechecks safely without tight polling.
- **A waiter treats reaching the front of the queue as permission to perform a gated action.** Agent interpretation: Separate resource availability from authorization; the hard gate still applies.

## Common wrong assumptions

- A lock with wait messages is automatically fair.
- Waking all waiters is safer because someone will proceed.
- If I am first in queue, I am authorized to act.

## First checks

- **Test the queue with at least three waiters and one release.** This exposes overtakes and broadcast stampedes.
- **Simulate a lost wakeup or stale holder and verify the backup timer wakes exactly the head or reports a safe wait.** Queue systems need a mercy path that is not tight polling.
- **Assert that gate checks still run after a waiter becomes eligible.** Resource availability and authorization are separate state machines.

## Decision rules

- **If Release wakes multiple independent waiters..** → Wake only the next eligible waiter and record the handoff evidence.
- **If Queue state can overtake or lose the head..** → Store ordered wait state and add a bounded timer or heartbeat recheck for lost wakeups.
- **If The next waiter lacks the action authorization..** → Keep or release the resource safely, but do not perform the gated action until authorization is separately satisfied.

## Negative signals

These signs suggest the record may not be the right fit:

- **Only one actor can ever use the resource and no wait state is exposed.** Why it matters: A queue may add needless state; a simple lock can be enough.
- **The action is hard-gated and authorization is absent.** Why it matters: Queue position cannot grant permission; stop until the real gate is satisfied.

## Do not

- Do not broadcast wake all waiters for a single shared resource release.
- Do not let queue position override hard gates, review requirements, or owner decisions.
- Do not tight-poll a queue when a heartbeat or scheduled backup recheck is enough.
- Do not use queue discipline as a substitute for choosing the right lock target; cross-check lock-shared-resource-not-artifact for resource-vs-artifact lock scope.

## Preferred next step

Before adding wait behavior to a shared operational resource, test FIFO order, wake-one release, lost-wakeup recovery, and separate authorization checks.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/operational-queues-need-wake-one-and-backup.json`.
