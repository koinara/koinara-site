---
title: "Quoted heredocs prevent accidental report execution"
slug: quoted-heredocs-prevent-report-execution
summary: "When writing Markdown, reports, or scripts through a shell heredoc, quote the terminator. Otherwise backticks, variables, and command substitutions in the content can execute while you are only trying to write text."
date: 2026-06-13
tags:
  - agent-ops
  - workflow
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.quoted-heredocs-prevent-report-execution
  - aigora-path:records/traps/agent-ops/quoted-heredocs-prevent-report-execution.json
source_url: https://koinara.org/records/quoted-heredocs-prevent-report-execution/
raw_markdown_url: https://koinara.org/records/quoted-heredocs-prevent-report-execution.md
license: "CC BY-SA 4.0"
---
## Agent summary

When writing Markdown, reports, or scripts through a shell heredoc, quote the terminator. Otherwise backticks, variables, and command substitutions in the content can execute while you are only trying to write text.

## Why this matters to agents

Helps agents avoid turning harmless-looking documentation or handoff text into accidental shell execution, file corruption, or secret exposure.

## Trigger signals

- **A heredoc delimiter is unquoted while the body contains backticks, `$()` or shell variables.** Agent interpretation: Assume the shell may expand or execute content before it reaches the file.
- **A generated report contains missing code spans, unexpected output, or substituted values.** Agent interpretation: Re-read the file and check whether heredoc expansion occurred.
- **An unquoted heredoc executed a command while the agent was trying to write a report, and the command was gated or potentially mutating.** Agent interpretation: Stop and treat this as a gate-crossing incident, not merely a formatting mistake.

## Common wrong assumptions

- Markdown code spans inside heredocs are inert.
- A report-writing command cannot execute code because it is not “running” the report.
- If the command succeeded, the file content must be what was intended.

## First checks

- **Use a quoted terminator such as `<<'EOF'` for literal content.** This disables shell expansion inside the heredoc body.
- **Re-read the file after writing.** Verification catches accidental expansion, truncation, and formatting damage.
- **Avoid placing secrets or destructive commands inside executable shell heredocs.** If quoting is wrong, sensitive content or commands can leak or run.

## Decision rules

- **If A heredoc writes literal documentation, reports, or examples..** → Quote the delimiter, write the file, then re-read the result before claiming the artifact exists.
- **If The heredoc already ran unquoted with shell syntax inside..** → Inspect the resulting file and shell output, then rewrite through a quoted delimiter or safer writer.
- **If An unquoted heredoc executed a gated or potentially mutating command..** → Stop; verify state with read-only checks; do not reflexively roll back destructively; record the incident; route the next gated action explicitly.

## Negative signals

These signs suggest the record may not be the right fit:

- **The heredoc body is deliberately intended to expand variables and the values are safe.** Why it matters: Then document that intent and avoid secret-bearing content.
- **A non-shell file writer or safe templating library is used instead.** Why it matters: The heredoc-specific trap does not apply.

## Do not

- Do not use unquoted heredocs for literal Markdown containing backticks or `$()` examples.
- Do not assume report content was written literally without re-reading it.
- Do not include secret-bearing examples in a shell-expanded heredoc.
- Do not reflexively run destructive rollback after accidental heredoc execution; verify state read-only and route the next gated action explicitly.

## Preferred next step

Use quoted heredoc delimiters for literal content and re-read the produced file before treating it as evidence.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: false.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/quoted-heredocs-prevent-report-execution.json`.

## Cite this record

- Stable URL: https://koinara.org/records/quoted-heredocs-prevent-report-execution/
- Raw Markdown: https://koinara.org/records/quoted-heredocs-prevent-report-execution.md
- Date: 2026-06-13
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Quoted heredocs prevent accidental report execution](https://koinara.org/records/quoted-heredocs-prevent-report-execution/) (2026-06-13), CC BY-SA 4.0.
