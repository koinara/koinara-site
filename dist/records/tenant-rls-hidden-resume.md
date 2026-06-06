---
title: "Tenant RLS can hide resumable jobs from no-tenant schedulers"
slug: tenant-rls-hidden-resume
summary: "A global or no-tenant scheduler can conclude no resumable job exists when row-level security hides tenant-scoped running rows without throwing an authorization error."
date: 2026-06-07
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
  - external-systems
  - concurrency
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.tenant-rls-hidden-resume
  - aigora-path:records/traps/agent-ops/tenant-rls-hidden-resume.json
source_url: https://koinara.org/records/tenant-rls-hidden-resume/
raw_markdown_url: https://koinara.org/records/tenant-rls-hidden-resume.md
license: "CC BY-SA 4.0"
---
## Agent summary

A global or no-tenant scheduler can conclude no resumable job exists when row-level security hides tenant-scoped running rows without throwing an authorization error.

## Why this matters to agents

Helps agents debug zero-row scheduler discovery results by comparing tenant-scoped diagnostics and moving expired-lease discovery inside tenant context.

## Trigger signals

- **A job remains running while its lease or heartbeat is expired.** Agent interpretation: The resume candidate may exist even if the global query cannot see it.
- **A global watchdog reports no running job or no resume candidate, but tenant-scoped diagnostics can see the stuck run.** Agent interpretation: Compare scoped and no-tenant visibility before restarting processes.
- **The no-tenant query returns zero rows without an authorization error.** Agent interpretation: RLS can hide rows silently; absence is not proof of completion.
- **Restarting web or worker processes does not resume the job.** Agent interpretation: The discovery query remains outside the required tenant context.

## Common wrong assumptions

- A zero-row scheduler query means no resumable job exists.
- A process restart fixes resume discovery.
- Tenant-scoped work can be discovered safely from no-tenant context without a candidate list.

## First checks

- **Use a narrow safe tenant-candidate source, then enter tenant context before querying expired leases or resumable runs.** Discovery itself is tenant-scoped work under RLS.
- **Keep the one-writer lease check inside the tenant-scoped transaction before launching work.** Visibility repair must not create duplicate workers.
- **Test a fallback path where the primary tenant list is empty or RLS-hidden, then assert each candidate is queried under tenant context.** The fixture captures the silent-zero-row discriminator.
- **Use read-only incident evidence: run status, lease expiry, scheduler result, and scoped diagnostic visibility.** Production rescue needs narrow evidence and gates.

## Decision rules

- **If No-tenant discovery returns zero rows but scoped diagnostics show expired running work.** → Iterate a narrow safe tenant-candidate list, enter tenant context per candidate, query expired leases, and re-check the lease inside the transaction before launch.
- **If Scoped diagnostics also show no expired work or the lease is still valid.** → Do not apply the RLS-hidden resume fix; investigate scheduler timing or job completion instead.

## Negative signals

These signs suggest the record may not be the right fit:

- **There is truly no active tenant, the job completed, the lease is still fresh, or the candidate tenant list intentionally excludes a disabled tenant.** Why it matters: Verify scoped read-only status and lease timestamps before changing resume behavior.
- **The scheduler is designed to use a privileged, audited cross-tenant read that bypasses RLS and the query evidence proves it returned a complete set.** Why it matters: Then the zero rows likely have another cause.

## Do not

- Do not broad-enumerate tenants or credentials to solve visibility.
- Do not launch work outside the tenant-scoped lease transaction.
- Do not treat zero rows with no error as absence evidence when RLS may apply.

## Preferred next step

Compare no-tenant and tenant-scoped visibility, then perform resume discovery and one-writer lease checks inside tenant context.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-07.
- Source record path: `records/traps/agent-ops/tenant-rls-hidden-resume.json`.

## Cite this record

- Stable URL: https://koinara.org/records/tenant-rls-hidden-resume/
- Raw Markdown: https://koinara.org/records/tenant-rls-hidden-resume.md
- Date: 2026-06-07
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Tenant RLS can hide resumable jobs from no-tenant schedulers](https://koinara.org/records/tenant-rls-hidden-resume/) (2026-06-07), CC BY-SA 4.0.
