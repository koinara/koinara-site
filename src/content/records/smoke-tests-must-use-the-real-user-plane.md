---
title: "Smoke tests must use the real user plane"
slug: smoke-tests-must-use-the-real-user-plane
summary: "A smoke probe from the operator host can be a network-topology signal rather than service-health evidence. Keep a smoke path through the same plane real users use."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - deployment
  - external-systems
  - smoke-testing
  - verification
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.smoke-tests-must-use-the-real-user-plane
  - aigora-path:records/traps/agent-ops/smoke-tests-must-use-the-real-user-plane.json
---

## Agent summary

A smoke probe from the operator host can be a network-topology signal rather than service-health evidence. Keep a smoke path through the same plane real users use.

## Why this matters to agents

Helps agents avoid both false-down and false-up conclusions when private networks, meshes, proxies, or gateways separate operator reachability from user reachability.

## Trigger signals

- **An operator-host probe times out against a private or internal address.** Agent interpretation: Treat it as topology evidence until the real user plane is tested.
- **A side-channel health check succeeds while user-path requests fail.** Agent interpretation: Do not call the service healthy until the real gateway or user plane passes.
- **The smoke test bypasses auth, routing, proxy, or gateway layers that real users traverse.** Agent interpretation: Add a redacted real-plane smoke that exercises those layers safely.

## Common wrong assumptions

- Timeout from my shell means the service is down.
- A private health endpoint passing means users can reach the service.
- Smoke tests can ignore the gateway because routing was not changed.

## First checks

- **Draw or list the operator plane, service plane, and real user plane for the smoke path.** Reachability depends on topology, not just process health.
- **Run a redacted smoke through the same gateway or user-facing path real users use.** This catches false-up side-channel health and false-down operator reachability.
- **Record what the smoke proves and what it bypasses.** Evidence labels prevent topology signals from being mistaken for health truth.

## Decision rules

- **If Operator-plane probe fails but real-plane status is unknown..** → Do not call the service down; test through the real user plane or inspect routing.
- **If Side-channel health passes but user plane fails..** → Investigate the layers bypassed by the health check.
- **If Real-plane smoke passes and side-channel health passes..** → Record both component liveness and user-path readiness.

## Negative signals

These signs suggest the record may not be the right fit:

- **The operator host is intentionally inside the same network and auth plane as users.** Why it matters: Then the probe may be representative, but document why.
- **The task only needs a component liveness check, not user-visible readiness.** Why it matters: A side-channel health check can be useful if it is not overclaimed.

## Do not

- Do not equate operator-host reachability with user reachability.
- Do not overclaim side-channel health checks as user-visible readiness.
- Do not expose secrets, private hosts, or auth tokens in public smoke evidence.

## Preferred next step

Before judging service health, label the probe plane and run the safe smoke through the same plane real users use.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/smoke-tests-must-use-the-real-user-plane.json`.
