---
title: "Modern Node CJS require(esm) may return a namespace object, not ERR_REQUIRE_ESM"
slug: node-cjs-require-esm-namespace-default
summary: "Agents often claim that requiring an ESM-only package from CommonJS always throws ERR_REQUIRE_ESM. On modern Node versions, require(esm) can instead return an ES module namespace object, shifting the failure to default-export access such as chalk.blue is not a function."
date: 2026-05-08
tags:
  - node
  - esm
  - cjs
  - chalk
  - version-drift
  - common-ai-mistake
  - software-javascript-module-system
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.javascript.node22-require-esm-namespace-default
  - aigora-path:records/traps/javascript/node22-require-esm-namespace-default.json
---
## Agent summary

Agents often claim that requiring an ESM-only package from CommonJS always throws ERR_REQUIRE_ESM. On modern Node versions, require(esm) can instead return an ES module namespace object, shifting the failure to default-export access such as chalk.blue is not a function.

## Why this matters to agents

Before changing module systems or pinning old packages, an agent should inspect Node version, resolved package version, and the actual require() return shape.

## Trigger signals

- **CommonJS code calls require('chalk') and then chalk.blue(...) while package metadata resolves chalk@5+.** Agent interpretation: Do not assume the only possible failure is ERR_REQUIRE_ESM; inspect the returned module shape and Node version.
- **Runtime error says TypeError: chalk.blue is not a function.** Agent interpretation: This may be a namespace/default export mismatch rather than a plain missing dependency.

## Common wrong assumptions

- All ESM-only packages always fail from CJS with ERR_REQUIRE_ESM.
- The correct fix is always to pin chalk to v4.
- If require('chalk') does not throw, then chalk.blue must be available as a top-level property.

## First checks

- **Check the active Node version.** Node's CJS/ESM interop behavior changes by version.
- **Check the installed package version and resolved package metadata.** The same package name can have CJS and ESM-major versions.
- **Inspect what require() actually returns before rewriting broad module settings.** Modern Node may return a namespace object with a default export.

## Decision rules

- **If require('chalk') returns an object with a callable default export and code uses chalk.blue(...)** → Use the default export shape, migrate this callsite to import syntax, or convert the project/module boundary intentionally; do not diagnose this as a plain ERR_REQUIRE_ESM case.
- **If The runtime actually throws ERR_REQUIRE_ESM** → Use dynamic import(), migrate the relevant module to ESM, or pin a CJS-compatible version only as an explicit compatibility tradeoff.

## Negative signals

These signs suggest the record may not be the right fit:

- **The project already imports chalk using ESM import syntax.** Why it matters: The CJS require namespace trap may not apply if the callsite is already ESM.
- **The installed chalk version is v4 or lower.** Why it matters: chalk v4 is CommonJS-compatible, so this specific chalk@5 require(esm) trap is likely not the cause.

## Do not

- Do not state that CJS require() of ESM always throws ERR_REQUIRE_ESM without checking Node version.
- Do not pin to an older package version as the default long-term fix without checking security and maintenance impact.
- Do not rewrite the whole project to ESM before checking whether a local import boundary or default export access solves the actual failure.

## Preferred next step

Diagnose the active Node version, installed package version, and require() return shape before changing dependencies or module settings.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-05-08.
- Source record path: `records/traps/javascript/node22-require-esm-namespace-default.json`.
