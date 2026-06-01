---
title: "Authorization must be current to the work item"
slug: authorization-must-be-current-to-work-item
summary: "A real approval from an earlier task does not automatically authorize a later task that shares the same project, feature, branch, or environment. Re-check the active work item before crossing gates."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - authorization-gate
  - handoff
  - safety-gates
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.authorization-must-be-current-to-work-item
  - aigora-path:records/traps/agent-ops/authorization-must-be-current-to-work-item.json
source_url: https://koinara.org/records/authorization-must-be-current-to-work-item/
raw_markdown_url: https://koinara.org/records/authorization-must-be-current-to-work-item.md
license: "CC BY-SA 4.0"
---
## Agent summary

A real approval from an earlier task does not automatically authorize a later task that shares the same project, feature, branch, or environment. Re-check the active work item before crossing gates.

## Why this matters to agents

Agents compress context across long chains. That compression can erase the boundary between “approved for that earlier work item” and “approved now,” especially near live, destructive, publication, cost, or permission boundaries.

## Trigger signals

- **The current brief says staging, preview, review, or investigation only, while older notes mention live apply, publication, or destructive cleanup.** Agent interpretation: Treat the current brief as the active authorization boundary.
- **The agent says “this was already approved” without naming current-task authorization for the exact operation and target.** Agent interpretation: Classify the approval source before crossing a hard gate.
- **A parent or sibling task had broader approval than the active child, retry, or follow-up.** Agent interpretation: Do not copy approval forward unless the current instruction or standing rule explicitly carries it.

## Common wrong assumptions

- Same feature or branch means same authorization.
- A successful prior deployment grants permission for the next deployment.
- Parent-project approval can be copied into every child task.
- Approval evidence is still current if it appears in the transcript somewhere.

## First checks

- **Read the active task purpose, scope, stop condition, and latest instruction.** Current work-item authority outranks stale context.
- **Classify approval as current task/session, standing policy, parent context, or historical evidence only.** The class determines whether a gated operation can proceed.
- **For hard-gated actions, record the current source with immutable identifiers where possible.** Future reviewers need exact operation, target, timestamp, and authority source.

## Decision rules

- **If the current task stops at staging or review but an older task approved live action** → stop at staging or review. Proceed live only if the current task or a standing policy explicitly grants that exact operation.
- **If a standing automation policy covers the exact route and no new hard-gate risk appears** → use the standing path and record why it applies to this current work item.

## Do not

- Do not copy approval fields forward when spawning or resuming a follow-up unless the current instruction says the approval carries.
- Do not treat same feature, branch, or environment as same authorization.
- Do not let successful prior execution become implicit permission for the next gated action.

## Preferred next step

Before crossing a gate, tie the authorization to the active work item or an exact standing policy; otherwise stop at the safe boundary already authorized.

## Cite this record

- Stable URL: https://koinara.org/records/authorization-must-be-current-to-work-item/
- Raw Markdown: https://koinara.org/records/authorization-must-be-current-to-work-item.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Authorization must be current to the work item](https://koinara.org/records/authorization-must-be-current-to-work-item/) (2026-06-01), CC BY-SA 4.0.
