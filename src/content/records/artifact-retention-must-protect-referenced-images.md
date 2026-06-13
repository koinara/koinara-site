---
title: "Artifact retention must protect referenced images"
slug: artifact-retention-must-protect-referenced-images
summary: "Retention policies must protect images and artifacts still referenced by active services, rollback targets, or recovery plans. Otherwise cleanup breaks rollback during the incident that needs it."
date: 2026-06-13
tags:
  - agent-ops
  - common-ai-mistake
  - container-registry
  - deployment
  - release
  - safe-recovery
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.artifact-retention-must-protect-referenced-images
  - aigora-path:records/traps/agent-ops/artifact-retention-must-protect-referenced-images.json
---

## Agent summary

Retention policies must protect images and artifacts still referenced by active services, rollback targets, or recovery plans. Otherwise cleanup breaks rollback during the incident that needs it.

## Why this matters to agents

Helps agents avoid deleting deploy artifacts that are still part of the live or rollback safety envelope.

## Trigger signals

- **A retention policy selects artifacts by age or tag count without checking active and rollback references.** Agent interpretation: Diff references against retained artifacts before applying cleanup.
- **Rollback instructions name an artifact that may no longer exist in the registry or store.** Agent interpretation: Treat rollback as unproven until the referenced artifact is fetched or verified.
- **Cleanup is bundled with incident recovery or release closeout.** Agent interpretation: Protect the referenced artifact set before deleting anything.

## Common wrong assumptions

- Old tags are safe to delete because current deploy uses the latest tag.
- Rollback plans are valid even if the referenced artifact was garbage-collected.
- Registry cleanup is low-risk hygiene during release work.

## First checks

- **List active, pending, and rollback artifact references as immutable digests or exact IDs.** Tags can move; retention safety needs the actual referenced artifacts.
- **Diff the referenced artifact set against registry or artifact-store manifests before and after policy changes.** This proves retention did not remove safety-critical artifacts.
- **Keep cleanup separate from incident rollback unless references are protected.** Cleanup can destroy the recovery path while trying to tidy it.

## Decision rules

- **If Retention would delete an active, pending, or rollback-referenced artifact..** → Do not apply retention until the reference is moved, archived, or explicitly retired.
- **If References are protected and dry-run shows only unreferenced artifacts removed..** → Proceed with cleanup under the normal change path and keep manifest evidence.
- **If Rollback artifact availability is unknown during an incident..** → Fetch or inspect the artifact reference before relying on rollback.

## Negative signals

These signs suggest the record may not be the right fit:

- **The system has a separately verified immutable artifact archive for rollback.** Why it matters: Retention can be safe when rollback references are protected elsewhere.
- **The artifact is proven unreferenced by live, pending, and rollback targets.** Why it matters: Then cleanup may proceed through the normal safe path.

## Do not

- Do not delete artifacts by age alone when live or rollback references exist.
- Do not assume tags are stable rollback evidence.
- Do not publish private registry names, deployment identifiers, or internal handoff pointers in the record.

## Preferred next step

Before artifact retention cleanup, diff active and rollback references against the artifacts that the policy will keep.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/agent-ops/artifact-retention-must-protect-referenced-images.json`.
