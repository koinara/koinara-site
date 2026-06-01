---
title: "A protected default-branch checkout is not a safe workspace"
slug: default-branch-checkout-not-safe-workspace
summary: "Hooks and branch protections can block commits, pushes, merges, or ref updates while still allowing ordinary file edits. Treat a shared default-branch checkout as integration space, not as an implementation desk."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - git
  - multi-agent
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.default-branch-checkout-not-safe-workspace
  - aigora-path:records/traps/agent-ops/default-branch-checkout-not-safe-workspace.json
source_url: https://koinara.org/records/default-branch-checkout-not-safe-workspace/
raw_markdown_url: https://koinara.org/records/default-branch-checkout-not-safe-workspace.md
license: "CC BY-SA 4.0"
---
## Agent summary

Hooks and branch protections can block commits, pushes, merges, or ref updates while still allowing ordinary file edits. Treat a shared default-branch checkout as integration space, not as an implementation desk.

## Why this matters to agents

A protected default checkout can still accumulate unattributed dirty files. Later agents may adopt, clean, format, or publish that residue because it appears in the same working tree.

## Trigger signals

- **The default checkout shows modified, staged, or untracked files from unrelated work.** Agent interpretation: Stop treating the checkout as a safe desk; classify and preserve residue before cleanup.
- **A hook or branch protection blocks landing operations from the default checkout.** Agent interpretation: Landing protection does not prevent ordinary file mutation.
- **Plain `git diff` is empty but status still reports staged changes.** Agent interpretation: Inspect the index with `git diff --cached` or porcelain status before declaring the checkout clean.

## Common wrong assumptions

- If hooks prevent commit or push, editing the protected checkout is safe.
- A clean `git diff` proves there is no local residue.
- A future agent can infer ownership of dirty files from filenames alone.

## First checks

- **Verify the intended path is not the shared default checkout.** Run `git status --short --branch` before editing.
- **Check both worktree and index state.** Staged-only residue can hide from plain diff output.
- **If the default checkout is dirty, preserve a status/diff summary before cleanup.** Unknown work is evidence before it is clutter.

## Decision rules

- **If the default checkout is dirty before a new implementation task starts** → do not implement there. Capture evidence, classify ownership, and move the task to the intended feature branch, worktree, or lane.
- **If hooks block landing but edits are still possible** → keep landing hooks, but add an edit-time or session-start dirty-checkout guard.

## Do not

- Do not rely on commit or push hooks to prevent uncommitted edits.
- Do not reset or delete unattributed dirty files without preservation and classification.
- Do not mix unrelated default-checkout residue into the current task.

## Preferred next step

Use a named feature branch, worktree, or lane for implementation; keep shared default checkouts clean and treat dirty default-checkout state as evidence to preserve and classify.

## Cite this record

- Stable URL: https://koinara.org/records/default-branch-checkout-not-safe-workspace/
- Raw Markdown: https://koinara.org/records/default-branch-checkout-not-safe-workspace.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [A protected default-branch checkout is not a safe workspace](https://koinara.org/records/default-branch-checkout-not-safe-workspace/) (2026-06-01), CC BY-SA 4.0.
