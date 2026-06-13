---
title: "Mailbox folder moves are not retention or provider deletion"
slug: mailbox-folder-move-is-not-retention-or-provider-delete
summary: "Mailbox folder moves, retention reservations, and provider-side deletion are separate state transitions. Prove each with count evidence before treating a move request as destructive retention or delete work."
date: 2026-06-13
tags:
  - authorization-gate
  - common-ai-mistake
  - email
  - external-systems
  - safety-gates
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.email.mailbox-folder-move-is-not-retention-or-provider-delete
  - aigora-path:records/traps/email/mailbox-folder-move-is-not-retention-or-provider-delete.json
---

## Agent summary

Mailbox folder moves, retention reservations, and provider-side deletion are separate state transitions. Prove each with count evidence before treating a move request as destructive retention or delete work.

## Why this matters to agents

Prevents agents from turning a reversible visibility/routing change into data loss or provider-side mutation while still honoring explicit folder-routing intent.

## Trigger signals

- **A human says to move mail to a spam, archive, trash, or quarantine folder, and the code or cleanup plan also touches retention, scheduled deletion, provider delete state, or server-side delete reservations.** Agent interpretation: Split the requested folder move from every deletion or retention effect before applying changes.
- **A live cleanup converts a tag, label, or classifier result into folder membership for many existing messages.** Agent interpretation: Count source labels and destination-folder inventory, then verify that stale delete/staging state is either intentionally preserved or intentionally cleared.

## Common wrong assumptions

- A request to move mail between folders automatically includes retention changes or provider-side deletion.
- Putting a message in a spam folder means it should also be scheduled for deletion.
- A cleanup from spam labels to spam folders should preserve or create server-delete reservations by default.
- Trash, spam, quarantine, and provider-side delete are equivalent because the UI hides the message from the inbox.
- If a folder move is reversible in the app, provider-side deletion is also safe to include.
- Source tag counts are enough for a live cleanup review without destination-folder inventory and delete-state counts.

## First checks

- **List every data field, queue, job, or provider call that can delete, purge, expire, or hide the message outside the requested folder move.** Folder state and deletion state often live in different tables or workers; a cleanup can accidentally carry both.
- **Before live cleanup, count source labels/tags, destination folder inventory, existing delete reservations, and rows with both old and new states.** These counts prove whether the plan is a move, a duplicate state, or a deletion-state mutation.
- **After the transaction, verify moved count, remaining source links, destination count delta, and delete reservation count delta.** Post-checks catch partial moves and accidental retention/deletion side effects.

## Decision rules

- **If The user asked for a folder move but did not explicitly authorize deletion, retention expiry, or provider-side mutation..** → Move the messages within the mailbox model, preserve recoverability, and do not enqueue provider/server deletion unless a separate gate authorizes it.
- **If The cleanup plan would preserve, create, or execute delete reservations for messages being moved to a non-delete folder..** → Stop and present counts for source labels, target folder, and delete reservations; require explicit deletion/retention policy before proceeding with delete effects.
- **If A reviewed policy explicitly asks for retention or provider deletion after foldering..** → Run the normal hard-gate path with retention duration, scope, dry-run counts, rollback/recovery limits, and post-apply verification.

## Negative signals

These signs suggest the record may not be the right fit:

- **The change only updates an internal folder pointer or visible label and tests show it does not enqueue deletion, update provider delete state, or shorten retention.** Why it matters: A reversible mailbox organization change is usually lower risk than a deletion or provider mutation, though live data still needs normal safeguards.
- **A separate reviewed policy explicitly authorizes the retention period, delete scope, provider-side mutation, recovery path, and verification evidence.** Why it matters: The trap is accidental bundling; explicit deletion policy can proceed through the appropriate gate.

## Do not

- Do not infer provider-side deletion from a request to move messages into a spam, archive, trash, or quarantine folder.
- Do not combine label-to-folder cleanup with retention or server-delete changes unless the delete semantics are explicitly authorized.
- Do not review a live mail cleanup using only source label counts; include target folder inventory and delete-state counts.
- Do not publish private mailbox domains, account names, message subjects, or customer data in public lessons.
- Do not merge this with uncertain-spam visibility policy; cross-check uncertain-spam-signals-should-not-hide-customer-mail when signal confidence is the issue.
- Do not over-read a human request scope; compare ambiguous-human-input-overauthorization when authorization wording is ambiguous.

## Preferred next step

When mail foldering and deletion are both present, split the plan into visibility/folder state, retention policy, and provider mutation; verify counts for each before writing live data.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-11.
- Source record path: `records/traps/email/mailbox-folder-move-is-not-retention-or-provider-delete.json`.
