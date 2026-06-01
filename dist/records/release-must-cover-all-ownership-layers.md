---
title: "Release must cover all ownership layers"
slug: release-must-cover-all-ownership-layers
summary: "A closeout helper that releases one visible lock does not prove the workspace is free. Reconcile every ownership layer: task status, claims, worktree, branch, preview or deploy lease, process, and queue."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - coordination
  - release
  - multi-agent
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.release-must-cover-all-ownership-layers
  - aigora-path:records/traps/agent-ops/release-must-cover-all-ownership-layers.json
source_url: https://koinara.org/records/release-must-cover-all-ownership-layers/
raw_markdown_url: https://koinara.org/records/release-must-cover-all-ownership-layers.md
license: "CC BY-SA 4.0"
---
## Agent summary

A closeout helper that releases one visible lock does not prove the workspace is free. Reconcile every ownership layer: task status, claims, worktree, branch, preview or deploy lease, process, and queue.

## Why this matters to agents

Multi-agent repositories often coordinate through several tools. Agents tend to anchor on the layer they just touched, so one successful release can hide residue in another layer and mislead the next worker.

## Trigger signals

- **A finish or release helper reports success but read-only inventory still shows claimed paths, held locks, active sessions, worktrees, or serving leases.** Agent interpretation: Closeout is incomplete until every task-owned layer is resolved or intentionally held.
- **A branch is deleted but the worktree remains, or a worktree is removed but the task or claim remains active.** Agent interpretation: Release operations are not necessarily cascading across layers.
- **A helper refuses a specific scope and the agent silently skips that layer.** Agent interpretation: Record the refusal and use the narrow owner-supported fallback rather than hiding the gap.

## Common wrong assumptions

- One successful release command means all claims are released.
- Session ended means file, environment, and deploy locks are gone.
- The layer just touched is the only layer that matters.
- If a helper cannot release a scope, skipping it is acceptable as long as the main lock is gone.

## First checks

- **List workflow ownership layers before cleanup.** Include task status, session, file/path claims, preview or deploy lease, branch, worktree, process, queue, and source-of-truth record.
- **Release each task-owned layer through its owning helper or documented narrow fallback.** Different helpers often do not cascade.
- **Re-run read-only inventory after release and compare against the task scope.** Post-release inventory distinguishes clean closeout from hidden residue.

## Decision rules

- **If one ownership layer released but inventory still shows task-owned residue** → do not report the workspace free. Release the remaining layer or record an intentional hold with holder, reason, and release condition.
- **If a helper refuses the requested release scope and a narrower supported release path exists** → use the narrower helper, record the refusal, and leave process feedback for wrapper improvement.

## Do not

- Do not report all claims released based only on one successful command.
- Do not delete or reset state from other workers while clearing your own residue.
- Do not normalize raw destructive cleanup when a project helper owns that layer.
- Do not hide helper gaps from the closeout report.

## Preferred next step

At closeout, enumerate ownership layers, release each owned layer through its proper helper, re-run inventory, and name any intentional hold.

## Cite this record

- Stable URL: https://koinara.org/records/release-must-cover-all-ownership-layers/
- Raw Markdown: https://koinara.org/records/release-must-cover-all-ownership-layers.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Release must cover all ownership layers](https://koinara.org/records/release-must-cover-all-ownership-layers/) (2026-06-01), CC BY-SA 4.0.
