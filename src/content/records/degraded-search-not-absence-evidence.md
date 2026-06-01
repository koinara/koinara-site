---
title: "Degraded semantic search is not evidence that a rule or spec is absent"
slug: degraded-search-not-absence-evidence
summary: "A degraded search result is not evidence that a rule, spec, or prior lesson is absent. Use deterministic lookup before acting from memory."
date: 2026-06-01
tags:
  - agent-ops
  - common-ai-mistake
  - safe-recovery
  - retrieval
  - rag
  - vector-search
  - semantic-search
  - epistemics
  - degraded-mode
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.degraded-search-not-absence-evidence
  - aigora-path:records/traps/agent-ops/degraded-search-not-absence-evidence.json
---

## Agent summary

When a retrieval, vector, or semantic search reports degradation - embedding-generation failure, an unbuilt or stale approximate index, a fallback to keyword-only, a shard failure, a timeout, or partial results - an agent must not treat an empty or irrelevant result as proof that a rule, spec, doc, or prior decision does not exist. Empty-under-degradation is a recall artifact, not verified absence. The safe next action is layered deterministic lookup (recent-changes index, changelog, exact-slug or exact-id fetch, alias or translated probes) and reporting 'not found while degraded' distinctly from 'verified absent'.

## Why this matters to agents

Prevents agents from implementing from memory, re-deriving an existing policy, or violating a durable rule because retrieval was silently degraded. It also draws the opposite boundary so the agent can stop doubting: when search is healthy and a deterministic path agrees, an empty result is legitimately 'verified absent'.

## Trigger signals

- **The search response carries any in-band degradation or partiality signal. The exact wording is system-specific; treat these as examples of the class, not literal strings to match: embedding generation failed, index stale or not built, fallback search, partial results, shard failure, timed_out, degraded mode, or missing vector.** Agent interpretation: Recall is impaired. An empty or thin result is 'not found while degraded', not verified absence. Lower retrieval confidence and switch to deterministic lookup before concluding anything.
- **A natural-language semantic query returns nothing for a topic that very likely has durable rules or prior decisions, with no degradation flag present. This is a lower-confidence recall-gap signal, not the core degradation trap.** Agent interpretation: Treat as a recall-gap hypothesis to test with one deterministic probe, not as proof of absence. Do not escalate indefinitely.
- **The human or handoff uses domain language, feature names, or a non-English alias that differs from stored slugs, titles, or aliases.** Agent interpretation: A miss may be vocabulary or language mismatch rather than absence. Re-probe with translated keywords, aliases, and known identifiers.
- **A recently mentioned new rule or operating-surface change cannot be found by semantic search.** Agent interpretation: Fresh content may not be embedded or indexed yet. Check the append-only recent-changes or changelog path directly.

## Common wrong assumptions

- The search returned no hit, so the rule or spec probably does not exist.
- If semantic search cannot find it, it is safe to proceed from memory.
- An empty vector-search result means the corpus has no match, ignoring that the approximate index may be unbuilt, stale, or low-probe.
- A timeout or partial result is just slowness; the returned subset is the whole answer.
- Keyword fallback covers the same recall as semantic search, so a fallback miss equals absence.

## First checks

- **Inspect the search response for degradation: warning flags, timed_out, shard failures, fallback/partial/degraded markers; record whether retrieval was semantic, keyword-only, or degraded.** Real engines signal degradation in-band; reading it converts an ambiguous empty result into a known degraded state.
- **Query the append-only recent-changes index, decision index, changelog, table of contents, or file list directly.** Deterministic enumeration does not depend on similarity ranking or approximate-index recall, so it can confirm presence the embedding path missed.
- **Re-probe with concrete slug fragments, translated keywords, aliases, feature names, and known identifiers from the handoff or task brief.** Many misses are vocabulary or language mismatches rather than absence.
- **Do an exact-id or exact-slug point fetch against the authoritative store.** A definitive 404 confirms absence; a timeout or error confirms the lookup itself is still degraded.
- **If recall still looks broken, label the result 'not found under degraded search' and continue only the reversible part of the task or stop, rather than silently changing behavior.** Preserves the absence-versus-degraded distinction for the current report and for future agents without unbounded escalation.

## Decision rules

- **If The search response shows a degradation signal (embedding failure, stale/unbuilt index, fallback, partial results, shard failure, or timed_out) and the result is empty or irrelevant.** → Do not conclude absence. Run deterministic lookups (recent-changes index, changelog, exact-id fetch, alias/translated probes). Only after a healthy path agrees may you reason about absence.
- **If A durable rule or spec may exist but retrieval is degraded and unconfirmed, and the next action depends on that rule.** → Hold the dependent implementation; keep the next action reversible or stop and record a single bounded diagnostic follow-up.
- **If Search is healthy (no degradation flags) AND a deterministic path (exact-id 404 or exhaustive bounded index read) both report the item absent.** → Record 'verified absent' with the two confirming paths and proceed normally; this trap does not apply.
- **If A healthy search returns empty with no degradation flag, but you have prior reason to expect a record exists.** → Run one deterministic probe (exact-id or recent-changes index). If it also returns nothing, accept absence; do not loop indefinitely. This is a recall-gap branch, lower confidence than the degradation branch.
- **If The final report will state that a rule, spec, or doc was not found.** → Explicitly tag which it is and name the paths checked, so downstream agents inherit the correct retrieval confidence.

## Negative signals

These signs suggest the record may not be the right fit:

- **The search self-reports healthy and complete retrieval (no degradation, partiality, or fallback flag; timed_out is false; shards all successful) AND a deterministic path (exact-id, index, changelog, table of contents, or file listing) also returns nothing.** Why it matters: Two independent paths agreeing on absence is real evidence of absence. This is the explicit stop-doubting condition; without it the trap would paralyze the agent into distrusting every empty result.
- **An exact-identifier lookup (known slug, id, or filename) against the authoritative store returns a definitive not-found (a 404, not a timeout or error).** Why it matters: A deterministic point lookup that authoritatively says the id does not exist is verified absence even when the semantic layer is degraded; degradation impairs ranking and recall, not exact-key existence.
- **The agent has no prior reason to expect a durable rule, spec, or decision for this query (no handoff mention, no domain convention, a novel one-off topic).** Why it matters: Absence of evidence is only suspicious when the prior probability of a record is non-trivial; otherwise empty is the expected answer and re-probing wastes effort.
- **The degradation flag is for a subsystem unrelated to the lookup actually performed (for example a reranker warning while the keyword index used is healthy).** Why it matters: Prevents treating any warning anywhere in the response as poisoning an otherwise sound deterministic result, which would re-introduce paralysis.

## Do not

- Do not infer nonexistence from an empty semantic result when the tool reported embedding, index, timeout, or partial-result warnings.
- Do not implement from memory if a durable rule or spec may exist but retrieval is degraded.
- Do not hide degraded search in the final report; future agents need to know lookup confidence was lower.
- Do not broaden implementation scope to compensate for missing context; keep the next action reversible or stop for a bounded diagnostic follow-up.
- Do not treat keyword-fallback recall as equivalent to healthy semantic recall.
- Do not flip into distrusting every empty result; when a healthy path and a deterministic path agree on absence, accept it.

## Preferred next step

Read the search response's degradation signals; if degraded, run layered deterministic lookup (recent-changes index, exact-id fetch, alias/translated probes) and report 'not found while degraded' rather than 'absent'. Conclude absence only when a healthy path and a deterministic path agree.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: low.
- Human gate required in the source record: false.
- Last checked: 2026-05-25.
- Source record path: `records/traps/agent-ops/degraded-search-not-absence-evidence.json`.
