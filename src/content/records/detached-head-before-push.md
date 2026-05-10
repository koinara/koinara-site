---
title: "Detached HEAD work must be anchored to a branch before normal push"
slug: detached-head-before-push
summary: "Agents may make commits while Git is in detached HEAD state, then fail or loop when `git push` cannot infer a branch. The safe first move is to inspect state and create/switch to a branch that preserves the detached commits before pushing or rebasing."
date: 2026-05-08
tags:
  - git
  - detached-head
  - branch
  - workflow
  - safe-recovery
  - common-ai-mistake
  - software-git-workflow
status: public-safe-reviewed
review_state: public-safe
---
## Agent summary

Agents may make commits while Git is in detached HEAD state, then fail or loop when `git push` cannot infer a branch. The safe first move is to inspect state and create/switch to a branch that preserves the detached commits before pushing or rebasing.

## Why this matters to agents

Prevents agents from losing work or applying destructive Git commands when a commit exists outside a named branch. The useful action is state diagnosis and branch anchoring, not force push or reset.

## Trigger signals

- **Short branch status shows HEAD with no branch.** Agent interpretation: Do not assume the agent is on main/master/current feature branch; detached commits may not be reachable by a branch.
- **Plain git push fails because there is no current branch.** Agent interpretation: The next safe action is to preserve the current HEAD on a named branch, not to retry push blindly.
- **git branch --show-current prints an empty line.** Agent interpretation: Empty current branch output is consistent with detached HEAD; confirm with status before branch operations.

## Common wrong assumptions

- The current commit must already belong to main or the last visible branch.
- Retrying git push with different remote names will fix detached HEAD.
- A force push, hard reset, or checkout is a safe first response.
- Detached HEAD means the work is lost.

## First checks

- **Inspect the branch/detached state without modifying files.** Agents must know whether HEAD is attached before choosing a push or branch operation.
- **Check the current branch name.** An empty output from git branch --show-current is a simple detached HEAD signal.
- **Show recent commits and refs that may need preservation.** Before creating/switching branches, identify whether current HEAD contains work not on an existing branch.

## Decision rules

- **If Git status shows detached HEAD and the current HEAD contains work that should be kept** → Create a new branch at the current commit with `git switch -c <safe-branch-name>` before pushing or opening a PR. Choose a descriptive branch name; do not discard changes.
- **If Git is detached only for temporary inspection and there is no work to keep** → Switch back to the intended branch with `git switch <branch>` or `git switch -`; avoid carrying unreviewed detached-state assumptions into later commands.
- **If There are uncommitted changes and switching/branching may conflict** → Stop before using stash, reset, checkout, or discard-style options unless the owner explicitly approves the data-loss risk.

## Negative signals

These signs suggest the record may not be the right fit:

- **git branch --show-current prints a non-empty branch name.** Why it matters: If Git is already on a branch, this detached-HEAD recovery trap may not apply; handle upstream/push configuration separately.
- **The repository has no commits yet or is on an unborn branch.** Why it matters: Unborn branch setup is a different Git initialization case, not detached HEAD recovery.

## Do not

- Do not run `git reset --hard`, `git switch --discard-changes`, or equivalent destructive commands as the first response.
- Do not force push from detached HEAD to an existing protected branch.
- Do not switch away from detached HEAD before confirming whether current commits are reachable from a branch or tag.
- Do not assume `main` or `master` is the correct destination branch without inspecting refs and owner intent.

## Preferred next step

Run safe read-only Git state checks, then preserve detached work by creating a named branch if the work should be kept.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-05-08.
- Source record path: `records/traps/git/detached-head-before-push.json`.
