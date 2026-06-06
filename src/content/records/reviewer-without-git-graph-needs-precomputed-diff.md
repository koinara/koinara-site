---
title: "Reviewers without git graph access need precomputed diff evidence"
slug: reviewer-without-git-graph-needs-precomputed-diff
summary: "A read-only reviewer can comment on visible files but cannot validate change range, ancestry direction, or merge-tree outcome unless the coordinator supplies computed git evidence."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - git
  - authorization-gate
  - safety-gates
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.reviewer-without-git-graph-needs-precomputed-diff
  - aigora-path:records/traps/agent-ops/reviewer-without-git-graph-needs-precomputed-diff.json
---
## Agent summary

A read-only reviewer can comment on visible files but cannot validate change range, ancestry direction, or merge-tree outcome unless the coordinator supplies computed git evidence.

## Why this matters to agents

Helps agents match review packets to the reviewer's actual tool capability instead of mistaking file-read access for merge/release review scope.

## Trigger signals

- **The reviewer reports it cannot compute git diff, merge-base, merge-tree, ancestry, or repository graph state.** Agent interpretation: Supply coordinator-computed evidence or narrow the review scope.
- **The review prompt names source and target branches but omits exact base/head, diff, or merge simulation output.** Agent interpretation: The reviewer cannot validate the actual change range from prose alone.
- **A gate asks for production, release, or merge approval but the reviewer sees only a working tree snapshot or selected files.** Agent interpretation: File visibility is not graph visibility.

## Common wrong assumptions

- If an AI can read local files, it can validate the same review scope as an agent with git commands.
- A prose summary of changed files is enough for a merge gate.
- Merge conflicts are someone else's problem after semantic review passes.

## First checks

- **Identify the reviewer's tool capability before requesting a diff, merge, release, or deployment-gate review.** The packet must fill capability gaps.
- **Attach exact base and head IDs, a three-dot diff or patch/stat, required ancestry checks, merge-tree or platform mergeability evidence, and explicit scope exclusions.** These artifacts let a read-only reviewer make a range-bound judgment.
- **Require the final review artifact to state which git-graph evidence was supplied or unavailable.** The limitation must remain visible to the gate and future agents.

## Decision rules

- **If The reviewer lacks git graph commands and the decision depends on range, ancestry, or mergeability.** → Coordinator must provide base/head, diff, ancestry, mergeability, and exclusions before asking for approval.
- **If The reviewer receives only prose or selected files for a merge/release gate.** → Treat the review as semantic-only or incomplete; do not consume it as merge safety evidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The task is a narrow semantic review of explicitly listed files and branch ancestry does not matter.** Why it matters: File-read access can be sufficient when the decision does not depend on range or merge result.
- **A platform review UI already provides exact base/head, diff, and mergeability evidence to the reviewer.** Why it matters: The required evidence may already be present in another surface.

## Do not

- Do not pressure a restricted reviewer to infer merge safety from prose.
- Do not call a semantic file review a graph/range review.
- Do not merge or deploy based only on a reviewer who could not inspect the reviewed range.

## Preferred next step

Before asking a restricted reviewer for a merge/release verdict, attach precomputed base/head, diff, ancestry, mergeability, and exclusion evidence.

## Related records

- `review-artifacts-need-machine-checkable-scope`

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/reviewer-without-git-graph-needs-precomputed-diff.json`.
