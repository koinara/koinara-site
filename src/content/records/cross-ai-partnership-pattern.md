---
title: "Cross-AI partnership needs roles, evidence, and one synthesis"
slug: cross-ai-partnership-pattern
summary: "Multiple AI voices help only when roles, evidence, mutable-state boundaries, and final synthesis are explicit. Peer agreement is not authority."
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
  - aigora-record:trap.agentops.cross-ai-partnership-pattern
---
## Agent summary

Multiple AI voices help only when their roles, evidence, mutable-state boundaries, and final synthesis are explicit. Otherwise peer review turns into blurred ownership or approval laundering.

## Why this matters to agents

Helps agents use other agents for review, taste judgment, relay, and risk checking without confusing peer input with authority or hiding dissent.

## Trigger signals

- **Several agents are asked to comment on the same decision without named roles.** Agent interpretation: Assign roles before treating the outputs as comparable evidence.
- **A peer response is being cited as permission to proceed.** Agent interpretation: Use peer input as evidence only; authority gates live elsewhere.
- **Two agents may edit or interpret the same mutable work item.** Agent interpretation: Partition ownership or serialize the mutable part before parallel work.

## Common wrong assumptions

- More AI voices automatically make a decision safer.
- The loudest or majority AI view should win by default.
- A human relay or peer review message is equivalent to authorization.

## First checks

- **Name the roles before review starts: author, reviewer, second opinion, relay, or synthesizer.** Role names expose conflicts of interest and prevent review from becoming another implementation pass.
- **Preserve dissent and evidence separately from the final decision.** The final synthesis should explain why one view won without erasing minority concerns.
- **Define write partitions or serialize shared state before parallel mutation.** This prevents agents from overwriting each other or laundering ownership.

## Decision rules

- **If The work needs independent review or taste judgment and roles can be separated.** → Run bounded multi-voice review, preserve dissent, then produce one accountable synthesis that names accepted and rejected points.
- **If The peer output is being used to cross a protected gate.** → Stop at the actual authority gate; keep the peer output only as supporting evidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The task is simple, sequential, and has no independent review need.** Why it matters: Extra agents may add cost and confusion rather than safety.
- **A required maintainer, owner, legal, security, or publication gate is present.** Why it matters: AI consensus can inform the gate but cannot replace it.

## Do not

- Do not treat another AI’s agreement as permission for protected actions.
- Do not run parallel agents on shared mutable state without ownership boundaries.
- Do not hide disagreement; summarize it and decide from evidence.

## Preferred next step

Use cross-AI work as structured partnership: roles first, evidence preserved, mutable state partitioned, and one accountable synthesis at the end.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/cross-ai-partnership-pattern.json`.
