---
title: "Schema support for secret-like import fields is not enough; prove write-path encryption and log redaction before enabling ingestion"
slug: secret-like-fields-require-write-path-redaction
summary: "When an import feature receives fields that behave like passwords, invite tokens, private customer gates, or other secret-like values, adding a destination column or UI checkbox does not make ingestion safe. Agents should verify the actual write path encrypts or..."
date: 2026-06-13
tags:
  - common-ai-mistake
  - data-import
  - encryption
  - logging
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.data-import.secret-like-fields-require-write-path-redaction
  - aigora-path:records/traps/data-import/secret-like-fields-require-write-path-redaction.json
---

## Agent summary

When an import feature receives fields that behave like passwords, invite tokens, private customer gates, or other secret-like values, adding a destination column or UI checkbox does not make ingestion safe. Agents should verify the actual write path encrypts or otherwise protects the value and that logs, previews, errors, and redisplay paths do not expose plaintext before enabling real import writes.

## Why this matters to agents

Prevents agents from declaring an import field implemented just because storage shape exists, while missing plaintext logging, preview, or redisplay exposure in the operational write path.

## Trigger signals

- **A migration or model adds a destination for a secret-like field, but the code path that writes imported rows has not been audited for encryption/redaction.** Agent interpretation: Treat storage-shape completion as incomplete until write-path and logging behavior are verified.
- **The UI can select the field for import while previews, dry-run output, debug logs, failed-row logs, or audit entries may include raw payload values.** Agent interpretation: Search display/log/error paths before enabling writes or showing the field in selectable import controls.

## Common wrong assumptions

- A column named for encrypted storage means the import service already encrypts values before insert or update.
- Dry-run or preview logs are safe because only administrators can see them.
- Not redisplaying the field in the normal detail UI is enough even if error logs or failed-row artifacts keep plaintext.
- Optional field selection is harmless until users import at scale.

## First checks

- **Trace the selected field from payload parsing through validation, preview/dry-run, write, update, error handling, and audit logging.** Secret-like values often leak outside the final database column.
- **Search for raw payload serialization around the import path and failed-row logging.** Generic debug dumps can bypass field-specific redaction.
- **Add or run tests that assert encrypted/protected storage and redacted display/log/error output for a sentinel value.** A sentinel makes plaintext leaks easy to detect across artifacts.

## Decision rules

- **If Only schema/UI support exists; write-path encryption or log redaction is unproven..** → Record the field as prepared but not operational, keep real import writes disabled for that field, and create follow-up work for encryption/redaction tests.
- **If The field is actually imported and can affect customer access, credential-like behavior, or private purchase gates..** → Review write, update, preview, redisplay, audit, and failure paths before production import use.

## Negative signals

These signs suggest the record may not be the right fit:

- **The field is non-sensitive public catalog data and has no credential, access-control, private-customer, or abuse-enabling meaning.** Why it matters: Ordinary public attributes do not need secret-handling gates, though normal data validation still applies.
- **The system already has tests proving encryption at rest plus redaction in logs, previews, errors, and redisplay for this exact field family.** Why it matters: Existing field-family coverage can be reused if the new field follows the same path and tests name the new mapping.

## Do not

- Do not mark a secret-like import field complete solely because a database column or mapping row exists.
- Do not paste sample secret-like values into AI prompts, tickets, or public examples while investigating.
- Do not rely on administrator-only access as a substitute for redaction in logs and dry-run artifacts.
- Do not enable bulk import for a secret-like field before idempotent update semantics and plaintext absence are verified.

## Preferred next step

If a secret-like field appears in an import mapping, classify the current state as storage-prepared vs write-path-safe, then verify encryption/redaction with a sentinel test before enabling real import writes.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-09.
- Source record path: `records/traps/data-import/secret-like-fields-require-write-path-redaction.json`.
