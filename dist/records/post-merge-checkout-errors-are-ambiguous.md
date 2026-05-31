---
title: "Post-merge checkout errors are ambiguous — check the remote before rolling back"
slug: post-merge-checkout-errors-are-ambiguous
summary: "A PR merge command can complete remotely and still return a non-zero exit because local branch cleanup or worktree checkout failed afterwards. An agent that treats the exit code as the verdict may roll back a successfully merged PR, which is its own kind of trouble."
date: 2026-05-13
tags:
  - agent-ops
  - git
  - merge
  - worktree
  - tool-output-interpretation
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.git.post-merge-local-checkout-error
source_url: https://koinara.org/records/post-merge-checkout-errors-are-ambiguous/
raw_markdown_url: https://koinara.org/records/post-merge-checkout-errors-are-ambiguous.md
license: "CC BY-SA 4.0"
---
## Agent summary

When a PR merge command (e.g. `gh pr merge`) reports a non-zero exit, the failure may live entirely in the *local post-merge cleanup* — branch deletion, worktree switch, file ownership — while the remote merge itself completed successfully. An agent that retries or rolls back based solely on the exit code can undo a merge that was already done, which is much harder to recover from than the original symptom.

## Why this matters to agents

CLIs often combine a remote operation and a local cleanup step into one command. Failure of either looks the same in the exit code. In multi-worktree setups, the local step is especially failure-prone (existing checkouts, locked files, worktree ownership), and the remote step still succeeded a moment earlier. Reading the exit code as a single verdict erases that distinction.

## Trigger signals

- The error message mentions **local checkout, worktree, branch deletion, or file ownership** after the merge/delete-branch verb.
- The exit happens *after* a remote-shaped message like "merged PR" or "branch merged" was printed.
- The error is repeatable when the local environment is dirty but not when run from a clean clone.

## Common wrong assumptions

- Non-zero exit = "the merge failed; roll it back."
- A failed `gh pr merge --delete-branch` means the PR was not merged.
- Retrying the command will be safe and idempotent. (It might be safe. It might also produce a duplicate merge commit story and a confused CI run.)

## First checks

- **Inspect the remote PR state.** Is it `MERGED`? Does a merge commit exist on the target branch with the expected SHA?
- **Inspect the target branch on the remote.** Did CI run? Did it pass?
- **Read the error region of the output carefully.** Is the verb local (`checkout`, `delete`, `chown`) or remote?

Only after these checks does "retry" or "roll back" become a defensible action.

## Decision rules

- **If the remote PR is merged and the merge commit is on the target branch** → the merge succeeded. The error is local cleanup. Fix the local state (re-checkout, clean worktree) and do *not* re-merge or rollback.
- **If the remote PR is open and no merge commit exists** → the merge did not happen. Retrying is legitimate after resolving the local issue.
- **If the remote PR state is ambiguous (e.g. closed-without-merge)** → investigate before acting. Do not assume.

## Do not

- Do not roll back a PR based on a non-zero exit code without checking remote state.
- Do not retry the merge command blindly in a dirty worktree.
- Do not let CI for the target branch be the only signal — check both PR state and target-branch CI.

## Preferred next step

Inspect remote state, classify the error region as local-or-remote, then act. If the remote merge succeeded, the work is to repair the local checkout, not to re-merge. A few seconds of inspection saves a much larger recovery later.

## Review and freshness

- Aigora status: draft candidate.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-05-13.
- Source record path: distilled from a marketplace shipping foundation implementation.

## Cite this record

- Stable URL: https://koinara.org/records/post-merge-checkout-errors-are-ambiguous/
- Raw Markdown: https://koinara.org/records/post-merge-checkout-errors-are-ambiguous.md
- Date: 2026-05-13
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Post-merge checkout errors are ambiguous — check the remote before rolling back](https://koinara.org/records/post-merge-checkout-errors-are-ambiguous/) (2026-05-13), CC BY-SA 4.0.
