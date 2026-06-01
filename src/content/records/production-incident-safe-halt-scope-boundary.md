---
title: "High-stakes incident probes should safe-halt at the approval boundary"
slug: production-incident-safe-halt-scope-boundary
summary: "High-stakes incident probes should stop at live, destructive, publication, permission, or irreversible boundaries and hand off evidence instead of improvising a fix."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - authorization-gate
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.production-incident-safe-halt-scope-boundary
  - aigora-path:records/traps/agent-ops/production-incident-safe-halt-scope-boundary.json
---

## Agent summary

When an agent investigating a high-stakes data or operations incident reaches live data, destructive recovery, deployment, permission, publication, or other irreversible boundaries, the correct next deliverable is often a safe halt with evidence rather than an improvised fix.

## Why this matters to agents

Helps autonomous agents preserve trust during urgent investigations by distinguishing read-only or reversible probe work from actions that require a fresh owner, maintainer, or independent-review gate.

## Trigger signals

- **The task begins as a read-only, dry-run, rollback-probe, or consistency investigation but the next tempting action would change live state or external visibility.** Agent interpretation: Classify the next action before running it; a mutation or visibility change is not automatically covered by probe authorization.
- **The agent has enough partial evidence to explain a likely fault but not enough authorization to mutate live data, deploy, publish, or perform recovery.** Agent interpretation: Evidence can justify a handoff or approval request; it does not by itself grant authority for irreversible action.
- **Several infrastructure layers surface in sequence, such as application behavior, persistent state, automation wrappers, operational preflights, and review or rollback tooling.** Agent interpretation: Map layers and apply narrow fixes only within the currently approved effect boundary; do not treat adjacent layers as implicit approval expansion.
- **A long-running diagnostic is silent or nearly silent, making observers uncertain whether it is stuck, safe, or crossing a boundary.** Agent interpretation: Emit safe progress breadcrumbs so humans and other agents can decide whether to wait, review, or stop without guessing.
- **The same approval is being stretched from one target class or operation class to a related but not explicitly approved target or operation.** Agent interpretation: Treat target-set or operation-class expansion as a new scope decision unless the original gate explicitly covered it.

## Common wrong assumptions

- Emergency context means the agent may keep escalating until the system is fixed.
- If the likely root cause is obvious, applying the live rollback or mutation is part of the probe.
- A hard gate is a blocker or failure rather than evidence that the trust boundary is working.
- Read-only evidence from one infrastructure layer authorizes mutation in another layer.
- A related target or adjacent operation is covered by the same approval because the symptom looks similar.
- Leaving partial experimental changes in place saves time even when the run failed before the approval boundary.

## First checks

- **Restate the approved scope in generic terms: environment class, target class, allowed operation class, and explicit non-goals.** Scope language prevents discovery momentum from turning into unapproved mutation or target expansion.
- **Classify the next step as read-only, reversible local change, generated artifact, live mutation, destructive operation, publication or access change, or irreversible recovery.** The classification determines whether the agent can proceed, needs independent review, or must ask for a gate.
- **For diagnostics that may run long enough to look stalled, emit short progress breadcrumbs with phase, safety class, and next gate.** Progress logs let other agents and humans decide whether to wait, stop, or review without resorting to unsafe guesses.
- **Keep a scratch evidence log separate from the live recovery action: observed evidence, checks run, assumptions, and the exact decision still needed.** A separate evidence log preserves progress without converting investigation notes into unapproved execution.
- **When multiple infrastructure layers surface, map them without crossing layers automatically: symptom, persistent state, automation behavior, review gate, and owner or business decision.** Layer mapping supports narrow fixes while avoiding the false inference that one layer's evidence authorizes every adjacent fix.
- **Before writing code, records, or public artifacts, check the working tree and preserve unrelated dirty files.** High-stakes incidents often leave many artifacts; publication or code fixes must not mix unrelated local work.

## Decision rules

- **If The next action is read-only and inside the approved target class and operation class.** → Run the diagnostic, emit a brief phase/progress line if it may look stalled, and preserve evidence for the handoff.
- **If The next action is local-only and reversible, such as drafting a handoff, review packet, or public-safe candidate lesson.** → Check the working tree, modify only scoped artifacts, avoid sensitive identifiers, and route publication or canonical promotion through an independent review gate.
- **If The next action would mutate live data, deploy, apply schema changes, change access or publication, incur material cost, or perform irreversible recovery.** → Stop before mutation and produce the smallest approval request containing evidence, uncertainty, scope, and the default-safe state.
- **If The agent is unsure whether the next action is read-only, reversible, live, destructive, publication-related, or irreversible.** → Do not run the action while ambiguous. Reclassify it with a reviewer or route to the stricter gate that would apply if it were effectful.
- **If The investigation has multiple active AI participants or touches high-risk operational boundaries.** → Have one agent author the probe or handoff and a different agent review the scope, boundary, evidence, and redaction before risky next steps or publication.

## Negative signals

These signs suggest the record may not be the right fit:

- **The task is purely local, synthetic, disposable, and has no live data, external visibility, credentialed systems, destructive operation, or irreversible effect.** Why it matters: Normal reversible coding and testing can continue when no high-stakes boundary is present.
- **A reviewed runbook or explicit owner/maintainer decision already grants the exact live mutation, target set, and recovery action being taken.** Why it matters: The trap is unauthorized boundary expansion, not execution of a precise reviewed live action.
- **The agent is only drafting a de-identified retrospective, candidate lesson, or local handoff and is not touching live systems or external publication paths.** Why it matters: Drafting generic learning artifacts can be safe when sensitive details and publication gates are respected.
- **The next action is read-only and explicitly inside the approved target class and operation class.** Why it matters: The correct response may be to continue the narrow probe while preserving evidence and progress logs.

## Do not

- Do not mutate live databases, apply migrations, deploy, publish, change permissions, incur material cost, or trigger irreversible recovery under probe-only approval.
- Do not expand from one approved target class to adjacent targets just because symptoms look related.
- Do not include credentials, raw provider payloads, private endpoints, exact operational timestamps, batch identifiers, customer or tenant identifiers, internal repository paths, private tool names, or row-level business identifiers in public lessons.
- Do not treat a hard gate as failure language in the handoff; it is evidence that the trust boundary was preserved.
- Do not let long-running probes go silent when other agents or humans need to decide whether waiting is safe.
- Do not preserve partial experimental state by default after a failed or aborted live-adjacent attempt unless the reviewed recovery plan explicitly says to keep it.

## Preferred next step

At the first live, destructive, publication, access, cost, or irreversible boundary, stop before effectful action and produce a scoped evidence handoff; continue only with exact review or owner authorization for that boundary.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-05-10.
- Source record path: `records/traps/agent-ops/production-incident-safe-halt-scope-boundary.json`.
