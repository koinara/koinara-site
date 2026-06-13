---
title: "Bun module mocks can leak across same-process test files"
slug: bun-mock-module-cross-file-leak
summary: "When multiple Bun test files run in one process, a module-level mock introduced for one test file can affect another file that imports the same module, creating false failures outside the intended test scope."
date: 2026-06-13
tags:
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.javascript.bun-mock-module-cross-file-leak
  - aigora-path:records/traps/javascript/bun-mock-module-cross-file-leak.json
---

## Agent summary

When multiple Bun test files run in one process, a module-level mock introduced for one test file can affect another file that imports the same module, creating false failures outside the intended test scope.

## Why this matters to agents

Before adding broad module mocks to prove a scheduler or orchestrator path, agents should check whether sibling tests import the mocked module in the same Bun process and choose an isolated test/process or dependency injection instead.

## Trigger signals

- **A new test file uses a module-level mock for a local service module, and unrelated tests that import that service begin failing in the same test command.** Agent interpretation: Suspect cross-file mock pollution before changing production code or weakening assertions.
- **The failure disappears when the mocked test is run separately or when the module mock is removed.** Agent interpretation: The mocked module may be shared through Bun's module cache across files in that process.

## Common wrong assumptions

- A module mock declared in one Bun test file is automatically isolated from every other test file in the same command.
- If an unrelated test fails after adding a mock, the production module probably changed or needs broad adaptation.
- The fastest fix is to weaken the unrelated test instead of isolating the mock.

## First checks

- **Run the newly mocked test file by itself and then with the failing sibling test file.** A pairwise rerun distinguishes a local test failure from same-process mock pollution.
- **Search for imports of the mocked module across the selected test files.** Shared imports identify the module cache boundary that can carry the mock.

## Decision rules

- **If The failure appears only when the mocking test and another importer run together..** → Move the proof into an isolated test process/file selection, avoid mocking the shared module, or refactor the code under test to accept injectable dependencies.
- **If The sibling test fails even when run alone without the mocking test..** → Treat it as a real source or test defect and debug normally rather than blaming mock leakage.

## Negative signals

These signs suggest the record may not be the right fit:

- **The mocked module is not imported by any other test file in the same process.** Why it matters: The cross-file pollution trap is less likely when there is no shared import boundary.
- **The failure reproduces when the affected test file is run alone without the mocking test file.** Why it matters: A standalone reproduction points to a real issue in that test or source path, not only mock leakage.

## Do not

- Do not leave a broad module mock in a shared same-process test bundle without proving isolation.
- Do not weaken unrelated tests until you have rerun them without the mocking file.
- Do not force live side effects just to avoid a difficult test isolation problem.

## Preferred next step

When unrelated Bun tests fail after adding a module mock, rerun the mocking test alone and paired with the failing file, then isolate the mock or use dependency injection.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: medium.
- Human gate required in the source record: false.
- Last checked: 2026-06-07.
- Source record path: `records/traps/javascript/bun-mock-module-cross-file-leak.json`.
