---
title: "Next.js instrumentation hooks need exclusion guards and thin dependencies"
slug: nextjs-instrumentation-hooks-need-runtime-guards
summary: "Framework instrumentation hooks run in constrained startup contexts. Guard unsupported runtimes by exclusion, keep the hook thin, and prove it fires once in a production-equivalent start."
date: 2026-06-13
tags:
  - common-ai-mistake
  - frontend
  - nextjs
  - react
  - testing
  - workflow
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.frontend.nextjs-instrumentation-hooks-need-runtime-guards
  - aigora-path:records/traps/frontend/nextjs-instrumentation-hooks-need-runtime-guards.json
---

## Agent summary

Framework instrumentation hooks run in constrained startup contexts. Guard unsupported runtimes by exclusion, keep the hook thin, and prove it fires once in a production-equivalent start.

## Why this matters to agents

Helps agents avoid bundling server-only runner graphs into framework startup hooks or skipping runtimes because an expected runtime variable is undefined.

## Trigger signals

- **The guard only runs when a runtime value equals the expected supported runtime.** Agent interpretation: Guard by excluding known unsupported runtimes; an undefined value may still be the desired server runtime.
- **The hook imports a large runner graph or server-only modules directly.** Agent interpretation: Move the heavy dependency behind a thin dynamic boundary or runtime-specific loader.
- **Build or startup errors mention unsupported schemes or runtime-only modules from the hook path.** Agent interpretation: Treat the hook as a constrained startup surface, not a normal application module.

## Common wrong assumptions

- A startup hook can import anything a normal server route can import.
- Undefined runtime means the hook is not running in the supported runtime.
- A successful build proves the hook fires exactly once at startup.

## First checks

- **Build after adding or changing the instrumentation hook.** Import-graph and runtime-boundary failures often surface only at build time.
- **Start the app in the closest production-equivalent mode and verify the hook fires once.** Development hot reload can hide missing or repeated startup behavior.
- **Review imports from the hook entrypoint and move heavy/server-only graphs behind thin adapters.** Thin hooks reduce runtime compatibility failures.

## Decision rules

- **If The hook must skip unsupported runtimes..** → Skip known unsupported runtime values and allow unspecified supported server startup when the framework uses that convention.
- **If The hook imports heavy or server-only implementation graphs..** → Keep the hook as a small dispatcher and load runtime-specific work only inside the supported runtime.
- **If The hook cannot be proven to fire once in production-equivalent mode..** → Add a safe diagnostic marker or test until single-fire startup behavior is observed.

## Negative signals

These signs suggest the record may not be the right fit:

- **The hook is pure telemetry with no runtime-specific imports and has an explicit supported-runtime contract.** Why it matters: The thin-hook trap may not apply, but still verify single-fire startup behavior.
- **Processed-count stillness occurs during a long transaction in an import job.** Why it matters: That is an import progress signal, not an instrumentation stall; see progress-state-must-match-cursor-semantics.

## Do not

- Do not bundle background job runners or server-only module graphs directly into instrumentation startup hooks.
- Do not assume positive runtime detection is reliable when the framework may leave it undefined.
- Do not keep unrelated lease or import-resume lessons in this record; link those records instead.

## Preferred next step

Inspect the instrumentation hook as a constrained startup surface: exclusion guard, thin imports, production-equivalent single-fire proof.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-13.
- Source record path: `records/traps/frontend/nextjs-instrumentation-hooks-need-runtime-guards.json`.
