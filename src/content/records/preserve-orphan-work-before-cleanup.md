---
title: "Preserve orphan work before cleanup"
slug: preserve-orphan-work-before-cleanup
summary: "Unknown edits or commits are evidence first, clutter second. Preserve and classify orphan work before resetting, deleting, or overwriting it."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.preserve-orphan-work-before-cleanup
---
## Agent summary

When edits or commits are found outside the expected branch, owner, or session, preserve and classify them before resetting, deleting, or overwriting. Clean status is not worth losing unknown work.

## Why this matters to agents

Helps agents recover from branch drift, abandoned sessions, and dirty worktrees without destroying useful edits or asking a human to classify raw Git state.

## Trigger signals

- **Git status shows uncommitted changes, untracked files, or detached commits that the current task did not create.** Agent interpretation: Treat them as evidence to preserve, not clutter to erase.
- **The parent branch moved and local edits no longer apply cleanly.** Agent interpretation: Capture the diff and purpose before deciding whether to split, rebase, or discard.

## Common wrong assumptions

- A clean worktree is always safer than preserving unknown changes.
- Untracked files are probably junk.
- The human should choose from raw branch labels instead of the agent classifying purpose and risk.

## First checks

- **Capture the status, diff summary, and likely purpose in a safe artifact.** A later reviewer needs evidence even if the session that made the edits is gone.
- **Classify ownership: current task, sibling task, generated residue, or unknown.** Classification decides whether to adopt, split, preserve, or ignore.
- **Only clean or discard after the classification is recorded and the applicable gate passes.** Destructive cleanup without classification loses recovery options.

## Decision rules

- **If the partial state is clearly agent-owned, local, reversible, and inside the approved scope** → Prefer a narrow revert or neutralization that returns the scope to a known-safe state; preserve and report anything with unknown ownership, evidence value, or protected effects.
- **If Unknown edits exist in a shared or task worktree.** → Save a patch or evidence summary, identify likely owner/purpose, and defer destructive cleanup until classification is recorded.
- **If The unknown edits may contain secrets or private data.** → Do not publish the diff; preserve privately and use the appropriate confidentiality path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The files are generated artifacts proven reproducible and ignored by policy.** Why it matters: They may be regenerated or cleaned through normal repo rules.
- **A reviewed destructive cleanup path has already classified the work as disposable.** Why it matters: Follow that path, preserving the classification evidence.

## Do not

- Do not reset, delete, or overwrite unknown edits to make status look clean.
- Do not paste potentially private diffs into public records or broad chats.
- Do not ask a human to choose from raw implementation labels when the agent can classify evidence.

## Preferred next step

Capture status and diff evidence, classify ownership and purpose, then clean only through a recorded safe path.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/preserve-orphan-work-before-cleanup.json`.
