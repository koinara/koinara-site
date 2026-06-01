---
title: "Shared authenticated browser contexts need page leases"
slug: shared-auth-browser-context-needs-page-leases
summary: "When browser automations share authenticated state, feature jobs should lease pages or tabs from a provider-owned context instead of closing the shared context from consumer cleanup."
date: 2026-06-01
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - browser-automation
  - concurrency
  - external-systems
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.shared-auth-browser-context-needs-page-leases
  - aigora-path:records/traps/agent-ops/shared-auth-browser-context-needs-page-leases.json
source_url: https://koinara.org/records/shared-auth-browser-context-needs-page-leases/
raw_markdown_url: https://koinara.org/records/shared-auth-browser-context-needs-page-leases.md
license: "CC BY-SA 4.0"
---
## Agent summary

When browser automations share authenticated state, feature jobs should lease pages or tabs from a provider-owned context instead of closing the shared context from consumer cleanup.

## Why this matters to agents

Shared login state is convenient, but a shared browser context is a lifecycle boundary. If one job closes it, overlapping sibling jobs can fail with generic page-closed errors or report success from local DOM state rather than provider-confirmed state.

## Trigger signals

- **One browser job closes a context or browser shortly before another reports page closed, context closed, navigation abort, or an unknown crash.** Agent interpretation: Suspect consumer-owned cleanup of a shared authenticated resource.
- **Feature callers receive a shared context or page and call close in cleanup.** Agent interpretation: Move lifecycle ownership back to the session provider and expose per-job leases.
- **A proposed fix serializes all browser automation because one provider-side job is ambiguous.** Agent interpretation: Separate page/context sharing from the narrow provider job that may need its own mutex.

## Common wrong assumptions

- Sharing a saved login means sharing one page is safe.
- The caller that acquired a context may close the whole context on cleanup.
- Serializing every browser job is the only durable fix.
- If an edited field still shows the typed value, the provider accepted the mutation.

## First checks

- **Build an overlap timeline.** Include acquisition, page creation, provider requests, cleanup, context close, and sibling failure.
- **Audit cleanup ownership.** Consumers should release page leases; the session provider should own context and browser retirement.
- **Verify external mutation by reload, reopen, or provider-rendered readback.** Reading the same edited DOM confirms local typing, not provider acceptance.

## Decision rules

- **If multiple automations share authenticated browser state** → return a new page or tab lease per automation, refcount active leases, and close the shared context only when provider-owned retirement policy allows it.
- **If only one provider-side report, download, or mutation is ambiguous** → protect that provider job with a narrow mutex rather than serializing unrelated browser flows.

## Do not

- Do not hand the same page object to independent automations.
- Do not let feature cleanup close a shared authenticated context or browser.
- Do not log cookies, storage state, raw provider payloads, or credentials while diagnosing.
- Do not infer provider acceptance from the same editable DOM after typing.

## Preferred next step

Put authenticated browser lifecycle behind a provider-owned session manager and give feature jobs lease-scoped pages with explicit release semantics.

## Cite this record

- Stable URL: https://koinara.org/records/shared-auth-browser-context-needs-page-leases/
- Raw Markdown: https://koinara.org/records/shared-auth-browser-context-needs-page-leases.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Shared authenticated browser contexts need page leases](https://koinara.org/records/shared-auth-browser-context-needs-page-leases/) (2026-06-01), CC BY-SA 4.0.
