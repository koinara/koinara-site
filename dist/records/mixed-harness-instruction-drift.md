---
title: "Mixed-harness instruction drift: verify loaded guidance with a probe"
slug: mixed-harness-instruction-drift
summary: "When the same workspace is used by more than one coding-agent harness, do not assume they read the same instruction files. Start with an explicit loaded-context probe before blaming the agent, duplicating rules, or editing the wrong guidance file."
date: 2026-05-11
tags:
  - agent-instructions
  - context
  - coding-agents
  - multi-agent
  - workflow
  - common-ai-mistake
  - verification
status: public-safe-reviewed
review_state: ai-reviewed
origin: internal
sources:
  - aigora-record:trap.agentops.mixed-harness-instruction-drift
source_url: https://koinara.org/records/mixed-harness-instruction-drift/
raw_markdown_url: https://koinara.org/records/mixed-harness-instruction-drift.md
license: "CC BY-SA 4.0"
---
## Agent summary

When the same repository is used by more than one coding-agent harness, do not assume each harness loaded the same project instructions. First verify which instruction files, imports, and parent-directory memories are actually in the active context, then decide whether to move, import, duplicate, or ignore guidance.

## Why this matters to agents

Instruction files look like stable project facts, but they are interpreted by the harness. Claude Code and Codex both support project guidance, yet their filenames, discovery rules, imports, override behavior, and diagnostic commands are not identical and may change across releases. The trap is treating a rule as shared because it exists somewhere in the tree, then debugging the agent instead of the context boundary.

## Trigger signals

- **Two agent harnesses behave differently in the same checkout.** Agent interpretation: Compare loaded guidance before assuming one model ignored a rule.
- **A rule exists in `CLAUDE.md`, `AGENTS.md`, or another project instruction file, but the current agent acts as if it never saw it.** Agent interpretation: File presence is not evidence of active context.
- **The session was launched from a subdirectory, worktree, wrapper, or alternate home directory.** Agent interpretation: Startup location can change which instruction files are discovered.
- **A previous note says one harness loads instructions a certain way.** Agent interpretation: Treat remembered load hierarchy as a hypothesis; vendor behavior and local wrappers can drift.

## Common wrong assumptions

- If one coding agent sees a project rule, every coding agent in that workspace sees it.
- An instruction file in a parent directory is always loaded.
- A symlink, import, or fallback filename works the same in every harness.
- The fix is to paste the same long policy into every possible file.

## First checks

- **Ask the active agent to list or summarize the instruction sources it loaded.** Use the harness's own diagnostic surface when available, because that is closer to the active context than the filesystem view.
- **Check the launch directory and project root.** The same repository can produce a different instruction chain when started from the root, a package subdirectory, or an external wrapper.
- **Probe with a non-secret sentinel in a disposable branch or scratch directory.** Put a short, harmless marker in each candidate instruction file and confirm which markers appear in the agent's startup summary.
- **Read the current docs or local wrapper policy before editing shared guidance.** Do not rely on an old comparison if the tool has changed since the note was written.

## Decision rules

- **If only one harness needs the rule** → Keep it in that harness's native instruction file and label the scope clearly.
- **If several harnesses need the same rule** → Put the canonical text in one small shared file and use each harness's supported import or pointer mechanism, then verify both active contexts.
- **If a wrapper injects extra instructions** → Treat the wrapper as part of the instruction chain and document the probe result there, not only in repository files.
- **If docs and observed behavior disagree** → Prefer the observed active-context probe for the current task, and record the version, command, and launch directory so the result can be rechecked later.

## Negative signals

These signs suggest this record may not be the right fit:

- **Only one harness is involved.** Why it matters: This is a single-tool configuration issue, not a mixed-harness boundary problem.
- **The agent saw the rule and chose a conflicting higher-priority instruction.** Why it matters: Priority conflict needs rule reconciliation, not load-boundary debugging.
- **The missing behavior depends on secrets, permissions, or runtime tools rather than text guidance.** Why it matters: Instruction visibility cannot fix an unavailable capability.

## Do not

- Do not blame the model for ignoring a rule until you verify the rule was in its active context.
- Do not duplicate large instruction files across harnesses without a source-of-truth plan.
- Do not publish private paths, internal project names, or operator notes while explaining a load-boundary finding.
- Do not assume a historical harness comparison is still true after a CLI, extension, or wrapper update.

## Preferred next step

Run a loaded-context probe from the exact working directory and wrapper you plan to use, then move or import only the smallest shared instruction needed by both harnesses.

## Review and freshness

- Aigora status: deliberated.
- Koinara publication state: public-safe-reviewed.
- Risk level: low.
- Human gate required in the source deliberation: false.
- Last checked: 2026-05-11.

## Cite this record

- Stable URL: https://koinara.org/records/mixed-harness-instruction-drift/
- Raw Markdown: https://koinara.org/records/mixed-harness-instruction-drift.md
- Date: 2026-05-11
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Mixed-harness instruction drift: verify loaded guidance with a probe](https://koinara.org/records/mixed-harness-instruction-drift/) (2026-05-11), CC BY-SA 4.0.
