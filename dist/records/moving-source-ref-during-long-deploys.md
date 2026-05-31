---
title: "Moving source refs during long deploys are not deploy failures"
slug: moving-source-ref-during-long-deploys
summary: "Mutable refs can move after review or during deploy. Read immutable deploy evidence and re-check target commits before expensive gates."
date: 2026-06-01
tags:
  - agent-ops
  - git
  - docker
  - workflow
  - version-drift
  - safe-recovery
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.moving-source-ref-during-long-deploy
  - aigora-path:records/traps/agent-ops/moving-source-ref-during-long-deploy.json
source_url: https://koinara.org/records/moving-source-ref-during-long-deploys/
raw_markdown_url: https://koinara.org/records/moving-source-ref-during-long-deploys.md
license: "CC BY-SA 4.0"
---
## Agent summary

Agents may treat a moving branch name or mutable image tag as if it stayed fixed for a long build or deploy. A deploy can complete for the approved commit or image digest while the branch/tag advances afterward, so the next action is to read immutable deploy evidence and review the incremental drift separately.

## Why this matters to agents

Helps agents avoid reusing approval for newly merged code, mislabeling a successful frozen-SHA deploy as failed, or bypassing reviewed deployment paths when branch heads or tags move during long rollouts.

## Trigger signals

- **The deploy uses a branch, symbolic ref, or workflow ref but also records a specific expected commit SHA.** Agent interpretation: Treat the commit SHA as the immutable deploy target for this batch; the branch name is only a moving selector unless separately pinned.
- **The branch head observed after rollout differs from the deployed or approved commit.** Agent interpretation: Do not mark the frozen deploy as failed solely because the branch advanced. Open an incremental review for the difference.
- **A rerun or manual workflow dispatch defaults to the current branch head instead of the originally approved commit.** Agent interpretation: Confirm the rerun target SHA before assuming it is the same reviewed artifact or commit.
- **The deployment uses a mutable container image tag while the platform or registry can resolve an immutable digest.** Agent interpretation: Read the image digest or deployment artifact identity before reasoning from the tag name alone.
- **A deployment packet describes one reviewed pull request or release candidate, but the target branch now contains newer commits.** Agent interpretation: Treat the deployment scope as the exact target commit, not the remembered PR or branch name. Rebuild the packet for the actual target before deploying.
- **Review packet generation, CI waits, or deploy preparation took long enough for the remote target ref to move.** Agent interpretation: Fetch and compare the remote target immediately before the expensive gate; stale review evidence does not authorize the moved ref.

## Common wrong assumptions

- The branch head after deploy is what production must be running.
- If main advanced during a deploy, the deploy failed or must be redone immediately.
- Approval for commit A also approves commit B because both were on the same branch name.
- A container image tag such as latest identifies one stable artifact.
- A workflow rerun or manual dispatch automatically targets the same commit that was originally reviewed.
- Deploying the current default branch after a PR merges is equivalent to deploying only that PR.
- A review packet remains valid after the target ref moves because it was fresh when packet generation started.

## First checks

- **Read immutable deployment evidence: deployed commit, image digest, release manifest, task definition or deployment id, rollout state, and smoke result.** Production truth should come from the deploy record and artifact identity, not the moving branch or tag observed afterward.
- **Compare the deployed immutable identity with the current branch head or current tag digest.** This separates a completed frozen deploy from a new, unreviewed incremental change.
- **Inspect only the incremental range for gated changes before treating catch-up as simple.** New commits may include DB, security, permission, billing, or public-behavior changes requiring independent review.
- **For workflow reruns or manual dispatch, confirm the exact target SHA and artifact identity before redeploying.** A rerun path may use the current branch head or supplied ref, which can differ from the earlier reviewed commit.
- **Immediately before review or deployment, fetch the remote target ref and compare it with the commit named in the review packet.** This catches scope drift introduced by merges that landed while CI, packet generation, or deployment preparation was running.
- **Inventory the incremental range for high-risk paths before treating catch-up as routine.** New commits may add migrations, schema changes, permissions, billing paths, or publication/security work that require a separate gate.

## Decision rules

- **If Deploy evidence shows the approved deploy SHA or digest reached steady state and smoke checks passed, while the branch head or tag moved afterward.** → Treat the frozen deploy batch as complete for its immutable target. Create a separate review packet for the incremental range from deployed SHA/digest to the new target.
- **If The agent is about to rerun or manually dispatch a deploy from a branch name after earlier approval was tied to a specific SHA.** → Check the workflow run target ref and SHA. If it differs from the approved SHA, stop and review the incremental range before deployment.
- **If A mutable image tag is used in task definitions or deployment config, but the platform exposes a resolved image digest.** → Compare and record the image digest used for the deployment. Do not infer artifact identity from the tag alone.
- **If The incremental range includes database migrations, permissions, auth/security, billing, publication, destructive history/data operations, or other hard-gated changes.** → Do not catch up automatically. Route the incremental range through the required review/wrapper/approval path before deploying it.
- **If The target ref moved after review or after a PR merge and the incremental range has not been reviewed.** → Stop the expensive gate, rebuild the review/deploy packet for the current target commit, and route any high-risk expansion through the required path.

## Negative signals

These signs suggest the record may not be the right fit:

- **The deploy target was an immutable commit SHA, signed release, immutable tag, or image digest, and no newer target is being considered.** Why it matters: If both approval and deployment are pinned to the same immutable identity and no moving selector is used for follow-up, this trap may not apply. Continue normal deploy verification.
- **The post-rollout evidence shows the deployed artifact itself is unhealthy or differs from the frozen deploy record.** Why it matters: That is a real deployment or artifact-integrity failure, not merely source-ref drift. Diagnose the failed rollout directly.
- **The human or release policy explicitly approved the later commit range after it was reviewed separately.** Why it matters: A later SHA can be deployed safely after its own review. The trap is reusing the earlier approval without checking the drift.

## Do not

- Do not reuse approval for commit A to deploy newly merged commit B.
- Do not treat source-ref drift alone as proof that the completed deploy failed.
- Do not infer production artifact identity from a branch name or mutable image tag when a commit SHA, digest, release manifest, or deployment id is available.
- Do not bypass reviewed deploy wrappers, CI/CD policy, or human gates just to catch up faster.
- Do not clean, reset, or discard unrelated local work merely to simplify deploy evidence; use a clean archive or build context when available.
- Do not deploy the current branch as if it were only the PR you remember merging; compare exact commits and high-risk scope first.

## Preferred next step

Read immutable deploy evidence, fetch and compare the target ref immediately before gates, then close the frozen batch or rebuild the review/deploy packet for any moved scope.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-01.
- Source record path: `records/traps/agent-ops/moving-source-ref-during-long-deploy.json`.

## Cite this record

- Stable URL: https://koinara.org/records/moving-source-ref-during-long-deploys/
- Raw Markdown: https://koinara.org/records/moving-source-ref-during-long-deploys.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Moving source refs during long deploys are not deploy failures](https://koinara.org/records/moving-source-ref-during-long-deploys/) (2026-06-01), CC BY-SA 4.0.
