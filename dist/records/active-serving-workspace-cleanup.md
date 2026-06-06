---
title: "Cleanup must not delete artifacts from an actively served workspace"
slug: active-serving-workspace-cleanup
summary: "A cleanup helper can break a preview or verification endpoint when it deletes build artifacts from the same workspace that a process, mount, or proxy is still serving."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.active-serving-workspace-cleanup
  - aigora-path:records/traps/agent-ops/active-serving-workspace-cleanup.json
source_url: https://koinara.org/records/active-serving-workspace-cleanup/
raw_markdown_url: https://koinara.org/records/active-serving-workspace-cleanup.md
license: "CC BY-SA 4.0"
---
## Agent summary

A cleanup helper can break a preview or verification endpoint when it deletes build artifacts from the same workspace that a process, mount, or proxy is still serving.

## Why this matters to agents

Helps agents distinguish disposable worktrees from active serving directories before closeout cleanup, and prevents false confidence from root-HTML-only smoke checks.

## Trigger signals

- **A workspace is both a development desk and the current serving directory for a preview or verification endpoint.** Agent interpretation: Treat the filesystem path as runtime state, not disposable residue.
- **A generic finish wrapper designed for throwaway worktrees is being used on a standing lane, shared desk, or long-lived checkout.** Agent interpretation: Reclassify the workspace before deleting build output or caches.
- **After cleanup, root HTML still loads but static assets, hydration, or auth UI fail.** Agent interpretation: Smoke asset URLs and primary UI flows, not only the root route.

## Common wrong assumptions

- Completed work does not imply its workspace is disposable.
- If the root HTML loads, the preview is healthy.
- A cleanup wrapper is safe everywhere because it was safe for throwaway worktrees.

## First checks

- **Classify the workspace as throwaway, standing, shared default checkout, or active serving directory before deletion.** The cleanup safety boundary depends on workspace role, not task completion state.
- **Check processes, service configs, container mounts, and proxy metadata for references to the target path.** Runtime references turn filesystem cleanup into availability-impacting cleanup.
- **Smoke static asset URLs and the primary authenticated or hydrated UI path after any reset.** Root HTML can pass while the actual app is broken.

## Decision rules

- **If A cleanup target is still referenced by a running process, mount, service config, or proxy.** → Do not delete build artifacts; switch or stop the dependent runtime through the approved path, then rebuild and smoke before reporting cleanup complete.
- **If No active runtime references the disposable worktree and no shared lane uses it.** → Proceed with normal cleanup and record the classification evidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The target is a genuinely disposable non-serving worktree with no active process, mount, or service dependency.** Why it matters: Removing the whole disposable tree is not this trap when no runtime depends on the path.
- **The serving target has already been switched away and the replacement was rebuilt and smoked.** Why it matters: Cleanup after traffic/process handoff is a different, safer state.

## Do not

- Do not delete build output, dependency directories, or framework caches from a long-lived serving workspace as routine closeout.
- Do not release a lease and infer that filesystem artifacts can be removed.
- Do not verify only the root HTML page after cleanup.

## Preferred next step

Classify the path, prove no runtime depends on it, and smoke assets plus the primary UI before deleting generated artifacts.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/active-serving-workspace-cleanup.json`.

## Cite this record

- Stable URL: https://koinara.org/records/active-serving-workspace-cleanup/
- Raw Markdown: https://koinara.org/records/active-serving-workspace-cleanup.md
- Date: 2026-06-07
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Cleanup must not delete artifacts from an actively served workspace](https://koinara.org/records/active-serving-workspace-cleanup/) (2026-06-07), CC BY-SA 4.0.
