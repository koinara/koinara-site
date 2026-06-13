---
title: "Uncertain spam signals should not hide customer mail"
slug: uncertain-spam-signals-should-not-hide-customer-mail
summary: "When agents add spam protection to a customer-facing mailbox, they may treat authentication failures, sender reputation hints, or broad content keywords as enough evidence to auto-quarantine messages. For unknown external senders, those signals are uncertain; hiding mail..."
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
  - aigora-record:trap.email.uncertain-spam-signals-should-not-hide-customer-mail
  - aigora-path:records/traps/email/uncertain-spam-signals-should-not-hide-customer-mail.json
---

## Agent summary

When agents add spam protection to a customer-facing mailbox, they may treat authentication failures, sender reputation hints, or broad content keywords as enough evidence to auto-quarantine messages. For unknown external senders, those signals are uncertain; hiding mail can lose legitimate customer contact. Keep uncertain detections visible as labels, shadow scores, or audit events until a stricter business policy and verification gate exists.

## Why this matters to agents

Prevents agents from converting detection logic into message-hiding behavior before proving that the signal is definitive enough for the mailbox's customer-communication risk.

## Trigger signals

- **A new spam feature can move, hide, quarantine, or delete messages from unknown external senders based on authentication failure or missing authentication alone.** Agent interpretation: Treat this as a customer-mail visibility gate, not just a classifier implementation detail.
- **A database setting or admin mode says quarantine, but code and API gates do not independently hold or reject quarantine for uncertain signals.** Agent interpretation: Storage shape must not be enough to activate message-hiding behavior.
- **Trusted-domain or own-domain configuration is editable or data-driven and could silently widen self-spoof quarantine beyond the explicitly launched domain set.** Agent interpretation: Prove a launch allowlist or equivalent policy boundary prevents accidental scope expansion.

## Common wrong assumptions

- Authentication failure from an external domain always means the message is spam.
- If a setting row says quarantine, the feature is safe to activate without code-level launch holds.
- Broad content words in subject or body are enough to move customer mail out of the inbox.
- Adding a spam folder is reversible enough that no owner or business policy gate is needed.
- A trusted-domain table can double as the production allowlist for self-spoof quarantine without a separate launch boundary.

## First checks

- **Enumerate every code path that can move, hide, quarantine, suppress, retain, or delete mail, including rule execution, API settings, scheduled jobs, and manual actions.** Spam classifiers often have multiple effect paths; a safe label-only path can be bypassed by a settings or worker path.
- **Add negative fixtures for unknown external senders with failed, missing, or misaligned authentication and spammy-looking content.** These fixtures should remain visible in the inbox or normal mail list unless a reviewed policy says otherwise.
- **Add positive fixtures only for definitive cases, such as own-domain self-spoof constrained by an explicit allowlist, and exact-sender manual blocks.** Positive tests should prove the narrow live behavior without broadening uncertain external-domain quarantine.
- **Test that database settings, admin API updates, and rule-engine execution all reject or hold general quarantine while policy is pending.** A database mode can become an accidental feature flag if enforcement exists in only one layer.

## Decision rules

- **If A signal is uncertain and the sender may be a legitimate external customer..** → Keep the message visible and record the assessment as a label, score, audit event, or shadow decision instead of moving or hiding it.
- **If A setting, API, or rule action would enable general quarantine, retention, or deletion before policy approval..** → Stop before activation and ask for the exact sender class, mailbox scope, retention/delete semantics, recovery path, and monitoring requirement.
- **If The case is definitive own-domain self-spoof and an explicit launch allowlist plus failed/missing authentication are both proven by tests..** → Allow the narrow quarantine path while keeping external-domain and non-allowlisted-domain cases label-only or shadow.
- **If The behavior is a user-initiated exact-sender block or manual spam action..** → Confirm the action is exact-sender scoped, auditable, and reversible through the product's normal user/admin controls before relying on it as a live path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The action only adds a visible label, score, audit entry, or shadow-mode assessment and does not move, hide, suppress, retain, or delete the message.** Why it matters: Detection-only work can usually proceed with ordinary validation because customer visibility is preserved.
- **The message is a definitive own-domain self-spoof under a reviewed allowlist and failed/missing authentication condition, or the exact sender was manually blocked by an authorized user action.** Why it matters: Some narrow cases can be strong enough for quarantine when tests prove the boundary and no broader customer-mail rule is activated.
- **A reviewed policy explicitly authorizes the exact sender class, signal class, mailbox, retention behavior, and user-visible recovery path for quarantine or deletion.** Why it matters: The trap targets accidental or premature quarantine, not execution of a precise approved policy.

## Do not

- Do not auto-quarantine unknown external-domain mail solely because SPF, DKIM, or DMARC failed or is missing.
- Do not turn a database quarantine mode into live behavior unless API and rule execution layers enforce the same policy boundary.
- Do not let trusted-domain rows silently expand own-domain self-spoof quarantine beyond an explicit launch allowlist.
- Do not infer deletion, retention, or permanent suppression semantics from a quarantine feature request.
- Do not hide customer-visible mail with broad keyword classifiers unless the exact policy and recovery path have been reviewed.
- Do not use this signal-confidence record to decide retention or provider deletion semantics; cross-check mailbox-folder-move-is-not-retention-or-provider-delete for count-evidence effect separation.

## Preferred next step

Before enabling any mail-hiding action, classify each signal as definitive or uncertain, prove uncertain cases remain visible, and gate quarantine/deletion semantics through the exact reviewed policy.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-10.
- Source record path: `records/traps/email/uncertain-spam-signals-should-not-hide-customer-mail.json`.
