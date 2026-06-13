---
title: "Agent hosts need bounded polling by default"
slug: agent-hosts-need-bounded-polling
summary: "A relay client that assumes every AI host can run an indefinite foreground long-poll can hang, starve a command-bounded session, or produce no actionable output."
date: 2026-06-13
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - multi-agent
  - concurrency
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.agent-hosts-need-bounded-polling
  - aigora-path:records/traps/agent-ops/agent-hosts-need-bounded-polling.json
---

## Agent summary

A relay client that assumes every AI host can run an indefinite foreground long-poll can hang, starve a command-bounded session, or produce no actionable output.

## Why this matters to agents

Helps agents package long-running receive/listen behavior for different execution hosts by making timeout, backgrounding, cancellation, and progress semantics explicit.

## Trigger signals

- **A long-poll command works in an interactive shell but blocks or times out inside another AI coding environment.** Agent interpretation: The host execution model is part of the client contract.
- **The client documentation names only an indefinite listen command and no finite receive, timeout, cancellation, or background mode.** Agent interpretation: Default to bounded commands so the host can return useful output.
- **Other actors cannot tell whether the listener is idle, hung, or still within safe read-only scope.** Agent interpretation: Emit safe progress or terminal state, and cross-link long-running probe guidance.

## Common wrong assumptions

- If a command works in one shell, it will work in every agent host.
- Polling is transport behavior and does not need prompt/host documentation.
- No output means nothing happened, not that the host is stuck.

## First checks

- **Provide a finite receive/poll command with timeout as the documented default.** Command-bounded hosts need a path that returns useful output.
- **Document and test backgrounding, cancellation, and progress output for any indefinite mode.** Long-running commands need lifecycle semantics to be safe for handoff.
- **Run polling smoke tests in each supported agent host, not only an interactive shell.** The failure is often host-specific.

## Decision rules

- **If The supported host is command-bounded or non-interactive..** → Use finite polling with a timeout and explicit empty result, then document indefinite listening as an advanced mode.
- **If A long-running receive command cannot emit safe progress or be cancelled..** → Do not run it as an agent default; redesign lifecycle or use a supervised background mechanism.
- **If The work is long-running but can emit aggregate progress safely..** → Follow the related long-running-probe progress pattern for cadence and redaction.

## Negative signals

These signs suggest the record may not be the right fit:

- **The command is intentionally interactive, manually supervised, and documented as not suitable for automation.** Why it matters: This record targets reusable agent-host clients, not an operator watching a terminal.
- **The host provides a durable background job manager with explicit cancellation and the client integrates with it.** Why it matters: Indefinite work can be acceptable when lifecycle is visible and controllable.

## Do not

- Do not make indefinite foreground polling the only documented receive path.
- Do not assume an AI coding session can safely host a forever-running client.
- Do not hide timeout/cancellation assumptions in human-only prose.
- Do not include private service names, internal URLs, account identifiers, incident identifiers, private repository paths, tenant/store names, setup-card field names, low-level endpoint strings or organization-specific tooling in public lessons.
- Do not use host-level bounded polling guidance as the whole answer when the status endpoint itself runs hot exact counts; cross-check hot-count-polling-can-become-the-incident.

## Preferred next step

Offer bounded polling first; only use indefinite listen mode when timeout, progress, backgrounding, and cancellation are documented and host-tested.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/agent-hosts-need-bounded-polling.json`.
