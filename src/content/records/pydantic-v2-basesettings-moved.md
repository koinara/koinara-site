---
title: "Pydantic v2 moved BaseSettings to pydantic-settings"
slug: pydantic-v2-basesettings-moved
summary: "Agents often use Pydantic v1 examples and write `from pydantic import BaseSettings`. With Pydantic v2 this raises PydanticImportError because BaseSettings moved to the separate `pydantic-settings` package."
date: 2026-05-08
tags:
  - python
  - pydantic
  - pip
  - version-drift
  - common-ai-mistake
  - software-python-packaging
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.python.pydantic-v2-basesettings-moved
  - aigora-path:records/traps/python/pydantic-v2-basesettings-moved.json
---
## Agent summary

Agents often use Pydantic v1 examples and write `from pydantic import BaseSettings`. With Pydantic v2 this raises PydanticImportError because BaseSettings moved to the separate `pydantic-settings` package.

## Why this matters to agents

Before downgrading Pydantic or rewriting settings code broadly, an agent should check the installed Pydantic major version, whether pydantic-settings is installed, and update the import path for v2 projects.

## Trigger signals

- **Python code imports BaseSettings directly from pydantic while pydantic resolves to v2.** Agent interpretation: Do not assume Pydantic v1 import paths still apply; check whether pydantic-settings should be used.
- **Runtime error says BaseSettings has been moved to the pydantic-settings package.** Agent interpretation: The immediate diagnosis is Pydantic v2 settings-package split, not a generic missing module or Python path problem.

## Common wrong assumptions

- Pydantic v1 examples remain valid for Pydantic v2 projects.
- The fix is always to downgrade pydantic to v1.
- PydanticImportError means pydantic itself is missing or the Python path is broken.
- Installing pydantic alone is enough for BaseSettings in v2.

## First checks

- **Check the active Python and Pydantic versions in the same environment that fails.** Dependency solvers and IDEs may use a different environment than the failing runtime.
- **Search for the old BaseSettings import path.** The old import path is the direct trigger for this Pydantic v2 failure.
- **Check whether pydantic-settings is installed in the failing environment.** Pydantic v2 settings management lives in a separate package.

## Decision rules

- **If Pydantic v2 is installed and code imports BaseSettings from pydantic** → Add `pydantic-settings` to the project dependencies and update the import to `from pydantic_settings import BaseSettings`. Keep the change local to settings code first.
- **If The project intentionally requires Pydantic v1 compatibility because upstream dependencies are not v2-ready** → Pin or constrain Pydantic v1 only as an explicit compatibility decision, document the reason, and avoid mixing v1-only imports with v2-only dependency ranges.
- **If The import path is already pydantic_settings but the application still fails** → Do not keep applying this trap. Diagnose installation environment, missing pydantic-settings, settings validation, `.env` loading, or package resolver mismatch.

## Negative signals

These signs suggest the record may not be the right fit:

- **The project intentionally pins Pydantic v1 and import succeeds in the active environment.** Why it matters: Pydantic v1 still exposes BaseSettings from pydantic; this v2 migration trap may not apply. Avoid unnecessary dependency churn.
- **The code already imports BaseSettings from pydantic_settings.** Why it matters: If the v2 import path is already used, the failure is likely elsewhere, such as package installation, environment mismatch, or settings field validation.

## Do not

- Do not blindly downgrade Pydantic to v1 as the first fix for a v2 project.
- Do not change all Pydantic model code when only settings imports are failing.
- Do not install pydantic-settings in one environment while running the application in another environment without verifying the active interpreter.
- Do not treat candidate guidance as canonical without checking versions and import paths.

## Preferred next step

Check the active Pydantic version and old BaseSettings import path, then add pydantic-settings and update the import only if the v2 settings split matches.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-05-08.
- Source record path: `records/traps/python/pydantic-v2-basesettings-moved.json`.
