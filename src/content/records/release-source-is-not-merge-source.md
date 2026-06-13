---
title: "Release source is not merge source"
slug: release-source-is-not-merge-source
summary: "A reviewed feature being ready to merge does not authorize deploying the current integration branch head. Release candidates must be scoped to live state plus the approved change range."
date: 2026-06-13
tags:
  - agent-ops
  - authorization-gate
  - common-ai-mistake
  - release
  - safety-gates
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.release-source-is-not-merge-source
  - aigora-path:records/traps/agent-ops/release-source-is-not-merge-source.json
---

## Agent summary

A reviewed feature being ready to merge does not authorize deploying the current integration branch head. Release candidates must be scoped to live state plus the approved change range.

## Why this matters to agents

Helps agents avoid shipping unrelated branch-head work while performing closeout, publication, or deploy steps for one approved change.

## Trigger signals

- **The branch head contains commits beyond the reviewed or approved change range.** Agent interpretation: Do not use branch head as the release source without explicit release-candidate approval.
- **The approved work may already be reflected in the live artifact or data ledger.** Agent interpretation: Verify containment first; a redeploy may promote unrelated head work.
- **A deploy instruction names a feature, not a complete release candidate.** Agent interpretation: Construct the candidate from live plus approved changes or stop for release-scope clarification.

## Common wrong assumptions

- If a feature was reviewed, the current branch head is safe to deploy.
- A closeout redeploy is harmless when the target already contains the fix.
- Merged means authorized for every environment.

## First checks

- **Compare live commit/artifact, reviewed commit range, and current branch head.** This reveals unrelated commits that would be promoted by a head deploy.
- **If the target may already contain the approved work, verify artifact id, target commit, and ledger or migration status before redeploying.** Already-live containment can make redeploy unnecessary and risky.
- **Record excluded commits and candidate construction.** Release evidence must show what did not ship as well as what did.

## Decision rules

- **If Branch head includes work outside the approved change range..** → Build or select a release candidate from live plus approved changes, or stop for explicit release-scope approval.
- **If Live artifact and data state already contain the approved work..** → Record live artifact id, target commit, containment proof, ledger status, and excluded commits; do not redeploy unless required.
- **If The branch head is the approved release candidate..** → Proceed through the normal release path with the exact commit range and review evidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The reviewed artifact is itself the explicit release candidate and contains no unrelated commits.** Why it matters: Then release and merge source may coincide for this operation.
- **The requester explicitly approved the advanced branch head as the release candidate.** Why it matters: Then the scope is broader by decision, but still record the commit range.

## Do not

- Do not equate merge source with release source.
- Do not redeploy just to “close out” if containment evidence proves the target already has the approved work.
- Do not ship advanced branch-head work under a narrow feature approval.
- Do not confuse this release-candidate scoping trap with moving-source-ref-during-long-deploy, where the ref moves during an in-flight deploy, or authorization-must-be-current-to-work-item, where stale approval is reused across work items.

## Preferred next step

Before release, compare live, approved range, and branch head; deploy only the explicit release candidate or record already-live containment.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/release-source-is-not-merge-source.json`.
