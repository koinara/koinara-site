---
title: "Progress artifacts must be visible from the runtime that displays them"
slug: progress-artifacts-need-runtime-visible-bridge
summary: "A progress UI or status API can look blank even while a job is running if it reads a local artifact path that exists only on the agent/operator host and not inside the production runtime serving the UI."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - long-running-jobs
  - operations
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.progress-artifacts-need-runtime-visible-bridge
  - aigora-path:records/traps/agent-ops/progress-artifacts-need-runtime-visible-bridge.json
---

## Agent summary

A progress UI or status API can look blank even while a job is running if it reads a local artifact path that exists only on the agent/operator host and not inside the production runtime serving the UI.

## Why this matters to agents

Before wiring a progress page to files, logs, or run-state artifacts, agents should prove that the display runtime can read the same source, or add a durable bridge such as a database row, object-storage object, or service endpoint.

## Trigger signals

- **The progress source path starts with a local workspace, temp directory, or operator-host path while the display code runs in a remote production or preview runtime.** Agent interpretation: Check runtime visibility before debugging the UI component itself.
- **A local script can read current progress, but the deployed page or API returns blank, null, not found, or an old snapshot.** Agent interpretation: Suspect a visibility boundary between job artifacts and display runtime.
- **The requested fix explicitly says not to stop, restart, or mutate the running job.** Agent interpretation: Use a read-only bridge or snapshot path; do not 'fix' visibility by moving or restarting the owner process without authorization.

## Common wrong assumptions

- If an agent can read a progress file locally, the production UI can read it too.
- A blank progress page means the job is not running or the React component is broken.
- The quickest visibility fix is to restart the job inside the web runtime.
- Sidecar bridges are permanent architecture rather than temporary operational adapters unless explicitly retired.

## First checks

- **Name the job owner runtime and the display runtime, then prove whether the progress source exists inside both.** The source must be visible from the reader, not only from the writer or the agent shell.
- **Smoke the deployed status API and compare it with a read-only local progress read.** A mismatch distinguishes display-runtime visibility from job progress itself.
- **If a bridge is added, record its owner, cadence, connection count, stop condition, and retirement path.** A temporary sidecar can solve visibility without becoming invisible production coupling.

## Decision rules

- **If The progress artifact is local to the job host and invisible to the display runtime..** → Publish read-only progress through a durable shared channel such as a database snapshot, object-storage object, or small service endpoint; avoid restarting or relocating the live job unless separately authorized.
- **If A temporary bridge is used to preserve a live job and meet an urgent visibility need..** → Document the bridge process, update cadence, resource use, stop condition, and the future direct-write design that will retire it.

## Negative signals

These signs suggest the record may not be the right fit:

- **The job owner and display runtime share the same durable mounted volume with documented read permissions and lifecycle.** Why it matters: A file source can be valid when runtime visibility is explicitly designed and verified.
- **The display path intentionally shows only persisted terminal summaries, not live progress.** Why it matters: A blank live-progress card may be expected if the product does not promise live status.
- **The deployed API can read the artifact source in the target runtime but still returns wrong values.** Why it matters: Then the defect is more likely parsing, auth, tenant selection, caching, or rendering rather than artifact visibility.

## Do not

- Do not assume local filesystem artifacts are available to a remote or containerized display runtime.
- Do not stop or restart a live job merely to move its progress writer closer to the UI unless the operation is authorized.
- Do not leave a temporary progress bridge without a named owner, stop condition, and retirement path.
- Do not include private service names, internal URLs, tenant identifiers, account identifiers, repository paths, or organization-specific tool names in public lessons.

## Preferred next step

When a progress UI is blank but local run-state exists, first prove runtime visibility of the progress source; then bridge through a shared durable channel if needed.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/agent-ops/progress-artifacts-need-runtime-visible-bridge.json`.
