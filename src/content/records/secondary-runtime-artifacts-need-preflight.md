---
title: "Preflight secondary runtime artifacts before reload"
slug: secondary-runtime-artifacts-need-preflight
summary: "A service config can validate while reload still fails because a secondary runtime artifact path such as a log, socket, cache, PID directory, or certificate store already exists with unsafe ownership or permissions."
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
  - aigora-record:trap.agentops.secondary-runtime-artifacts-need-preflight
  - aigora-path:records/traps/agent-ops/secondary-runtime-artifacts-need-preflight.json
---
## Agent summary

A service config can validate while reload still fails because a secondary runtime artifact path such as a log, socket, cache, PID directory, or certificate store already exists with unsafe ownership or permissions.

## Why this matters to agents

Helps infrastructure agents preflight the files a service opens at reload/start time, not only the primary config syntax, while keeping evidence-narrowing as a separate held topic.

## Trigger signals

- **Config validation succeeds, but reload or start fails with a path, permission, ownership, or writability error.** Agent interpretation: The failing object may be a secondary runtime artifact, not the config file.
- **The failed path is a log file, socket, cache, PID directory, certificate path, or similar runtime artifact.** Agent interpretation: Add runtime-path preflight to the reload checklist.
- **The path already exists before reload with ownership the service account cannot write.** Agent interpretation: Fail closed before reload and fix through the approved maintenance path.

## Common wrong assumptions

- Config-valid means reload-safe.
- The only file that matters is the config file being validated.
- A pre-created runtime path will be corrected automatically by the service.

## First checks

- **Extract every runtime path the service will open during reload/start and stat it before reload.** Secondary artifacts can fail after syntax validation.
- **Check expected owner, group, permissions, parent directory execute bits, and writability as the service account.** Root-owned or stale artifacts can be invisible to config validators.
- **Simulate a mis-owned runtime artifact in a disposable fixture and confirm preflight fails before reload.** A fixture prevents the check from becoming documentation-only.

## Decision rules

- **If A secondary runtime artifact exists with ownership or permissions the service cannot use.** → Do not reload into failure; fix or recreate the artifact through the approved path, then rerun preflight and config validation.
- **If All secondary runtime artifacts are absent or writable as expected and config validation passes.** → Proceed with the already-approved reload path and record preflight evidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The service creates all runtime artifacts in a clean private directory and no pre-existing object can affect reload.** Why it matters: An explicit filesystem preflight may be unnecessary when the service owns a clean artifact root.
- **The reload failure points to syntax, missing include, unavailable upstream, or another primary config error.** Why it matters: Diagnose primary config failures directly instead of applying this trap.

## Do not

- Do not paste broad provider or infrastructure output into public/user-facing summaries as a substitute for focused preflight evidence.
- Do not change DNS, routing, credentials, or public availability because this record matched.
- Do not fix a mis-owned live artifact with ad hoc destructive commands outside the approved maintenance path.

## Preferred next step

Before reload, preflight both primary config and secondary runtime paths as the service account; fail closed on unsafe pre-existing artifacts.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/secondary-runtime-artifacts-need-preflight.json`.
