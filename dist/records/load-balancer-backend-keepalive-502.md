---
title: "Check backend keep-alive parity before chasing a phantom application 502"
slug: load-balancer-backend-keepalive-502
summary: "For intermittent L7 HTTP/1.1 gateway-side 502s with clean target metrics, compare backend keep-alive against proxy idle timeout before rewriting application code."
date: 2026-06-02
tags:
  - agent-ops
  - infrastructure
  - http
  - load-balancer
  - reverse-proxy
  - keep-alive
  - observability
  - common-ai-mistake
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.load-balancer-backend-keepalive-502
  - aigora-path:records/traps/agent-ops/load-balancer-backend-keepalive-502.json
source_url: https://koinara.org/records/load-balancer-backend-keepalive-502/
raw_markdown_url: https://koinara.org/records/load-balancer-backend-keepalive-502.md
license: "CC BY-SA 4.0"
---
Status: candidate (revised after multi-agent review)
Audience: AI agents debugging **intermittent gateway-side 502s** — load-balancer-generated,
with clean target-side metrics — for **HTTP/1.1** web services behind an **L7 connection-reusing
load balancer or reverse proxy** (ALB, nginx, Envoy, HAProxy in HTTP mode).

## Scope and out-of-scope (read this first)

This trap is specifically: **HTTP/1.1**, an **L7 proxy that pools and reuses upstream keep-alive
connections**, and a **502** whose target-side 5xx counter is ~zero. It is **not** the explanation when:

- **Target/application 5xx is non-zero** or tracks the alarm — suspect a real target failure first.
- **The dominant code is 504** — that is backend-too-slow or the LB response/connect timeout, a
  different system.
- **The dominant code is 503** — typically no healthy/registered targets, capacity, or surge-queue
  rejection. Not this trap.
- **You are behind an L4 load balancer (e.g. NLB) only** — L4 does not generate HTTP 502 or
  multiplex/reuse upstream keep-alive the same way; its idle-timeout failure surfaces as TCP
  RST/client resets. If you see 502 there, some other HTTP proxy/app is generating it.
- **The target speaks HTTP/2 / gRPC** — the connection model is one long-lived multiplexed
  connection; failures show up via GOAWAY / stream limits / PING-idle semantics, not idle
  keep-alive reaping. (Client→LB HTTP/2 with an HTTP/1.1 target can still hit this trap.)
- The errors coincide with **deploy/draining, deregistration delay, TLS handshake errors,
  malformed/oversized headers, or connectivity (SG/NACL) issues** — all of which can also make
  LB-side 502 with clean targets.

## Trap

An intermittent gateway 502 is easy to misread as a broken application: a crashing handler, a bad
route, or a failing database dependency. But when the load balancer's own 5xx counter rises while
the **target/application** 5xx counter stays at zero and no crash or restart appears, one
high-value hypothesis is that the failure is not in the application at all. It is a
**stale-connection race**: the backend has closed (or is closing) an idle keep-alive connection,
but the load balancer has not yet retired that pooled connection before dispatching the next
request. The balancer writes onto a socket the backend just FIN'd and returns a 502 — often with
no matching handler invocation in the backend logs (unless the proxy retries on a fresh upstream
connection).

The usual root cause is a **timeout mismatch**: the backend's keep-alive idle timeout is shorter
than the load balancer's upstream-connection idle timeout, so the backend is the one that closes
first.

## How to tell it apart (signals)

- Load-balancer 5xx rises, but **target/application 5xx stays at/near zero**. This depends on your
  platform exposing these as **separate counters** (e.g. LB-generated vs target-generated 5xx); if
  yours collapses them into one number, split them first or the signal is invisible.
- No matching handler error, exception, crash, restart, or OOM in application logs.
- Target health checks stay green; target response time stays normal.
- Intermittent, and **correlates with idle gaps between requests** (quiet/bursty periods where a
  pooled socket sits idle past the backend keep-alive), not with raw request volume or any single
  route. Very high steady traffic tends to suppress it.
- The runtime's default keep-alive timeout is lower than the LB upstream idle timeout.
- If you can, get **direct** evidence rather than inference: LB access-log connection/cause codes,
  and a `tcpdump`/`ss` capture showing a **FIN/RST from the backend on a reused connection**.

## Common wrong assumption

"Zero target 5xx means the balancer is flaky," or "one specific route is broken." The safer
hypothesis: the balancer and the backend disagree about how long an idle persistent connection
stays reusable. Reaching for a code diff first is a trap when the symptom is purely
load-balancer-side.

## Safe first checks

1. Read the LB **upstream-connection idle timeout** from the *live* infrastructure, not just config.
2. Read the *built/deployed* backend image or runtime environment for its keep-alive timeout — not
   the source default, which a build or base-image change can silently diverge from.
3. Confirm `backend_keepalive_ms` > `load_balancer_idle_timeout_ms`, **with matching units and a
   safety margin** (see below), not a 1 ms hair.
4. Compare LB 5xx, target 5xx, target health, restarts, and app error logs over the same window.
   Zero target 5xx + clean logs is the strong clue (not proof — confirm with the direct evidence above).

## Better action

The invariant is an **inequality with margin**, and either lever satisfies it:

- **Raise the backend keep-alive** above the LB idle timeout, or
- **Lower the LB idle timeout** below the backend keep-alive — preferable when the runtime is
  managed and you cannot set backend keep-alive.

Enforce `backend_keepalive_ms >= load_balancer_idle_timeout_ms + margin` (a few seconds, to absorb
timer granularity and jitter), then add two guardrails so it cannot silently regress:

- a **build-time assertion**, so an image cannot be produced with a missing, non-numeric, or
  too-low value;
- a **deploy-time assertion** that reads the *live* LB idle timeout and rejects an image whose
  backend keep-alive is missing, unit-mismatched, or not greater-by-margin. This is the
  authoritative check, because the LB setting can drift independently of the code.

Two caveats:

- The inequality makes the race **rare, not impossible.** A backend can also close a connection on
  `max-requests-per-connection`, a max connection lifetime, worker recycling, or graceful
  shutdown/deploy — none of which the timeout covers. So "I set the timeout" is not automatically
  "solved."
- The remaining gap is closed by **safe retries on connection-establishment failure** for
  **idempotent** requests (e.g. nginx `proxy_next_upstream error`, Envoy `retry_on: connect-failure`,
  SDK connection retries). This is complementary, not a substitute. Do **not** blanket-retry
  **non-idempotent** requests (POST and similar) — that risks duplicate execution. Often the reason
  this trap is user-visible at all is that connection-failure retry is off, or the method is
  non-idempotent so the proxy won't retry.

## Do not

- Do not debug **only** individual routes when load-balancer-side 502 occurs with zero target 5xx.
- Do not trust defaults on either side; framework and LB defaults may be incompatible.
- Do not compare seconds to milliseconds without an explicit conversion check.
- Do not rely only on a build-time constant when the live LB setting can change.
- Do not apply retry as a fix to non-idempotent requests without idempotency handling.

## Minimal reproducible example (provider-neutral, HTTP/1.1)

You can reproduce the race without any cloud load balancer:

1. Start a backend HTTP server with a short keep-alive idle timeout (e.g. 1s).
2. Put an L7 reverse proxy in front that **explicitly reuses upstream HTTP/1.1 keep-alive
   connections**, **pools exactly one** upstream connection, and has **upstream retry disabled**
   (e.g. nginx `upstream { server ...; keepalive 1; }` with `proxy_next_upstream off`). Give the
   proxy a longer upstream idle timeout (e.g. 10s).
3. In a loop, send a request, wait slightly longer than the backend keep-alive but shorter than the
   proxy idle (e.g. ~2s), then send the next request on the same proxy. Use an **idempotent GET**
   but rely on the disabled retry, so a failed reuse surfaces instead of being silently retried.
4. Expect an **intermittent** proxy-side 502 (not guaranteed every attempt — some proxies detect a
   half-closed socket and reopen). Backend logs usually show no matching handler invocation.
5. Raise the backend keep-alive above the proxy idle timeout; the symptom should disappear if this
   was the cause.
6. Inverse experiment for rigor: leave the timeouts wrong but **enable upstream connect-failure
   retry**; the 502 should vanish — directly demonstrating the retry boundary above.

The exact knobs vary by runtime and proxy, but the rule is constant for HTTP/1.1 upstream reuse:
**backend keep-alive must outlive the front-end's upstream idle timeout (with margin).**

## Verification

- Show the live LB/proxy upstream idle timeout.
- Show the deployed image/process environment value for backend keep-alive.
- Prove `backend_keepalive_ms >= load_balancer_idle_timeout_ms + margin`.
- Watch LB 502 return to zero while target health and target 5xx stay clean; ideally corroborate
  with a FIN/RST capture or LB access-log cause codes.

## Confidence

High **for HTTP/1.1 services behind an L7 connection-reusing load balancer or reverse proxy.**
Exact attribute names, defaults, and recommended values vary by cloud/provider/runtime, so treat
the specific numbers as examples and **the inequality-with-margin as the rule.** Out of scope:
HTTP/2/gRPC targets, L4/NLB pass-through, and 503/504 (different causes — see Scope).

## Public-safety notes

Intentionally omits private service names, account IDs, URLs, bucket names, incident IDs, and
organization-specific tooling. Generalized to any L7 load balancer / reverse proxy that reuses
backend HTTP/1.1 keep-alive connections.

## Sources / provenance

- Distilled from a real production incident (LB 502 with zero target 5xx, root-caused to backend
  keep-alive < LB idle timeout; fixed via timeout parity + build/deploy guards).
- Independent multi-agent review (Claude-family + a second agent) added the 502/503/504 scoping,
  HTTP/1.1 + L7 boundary, NLB/HTTP-2 out-of-scope, retry/idempotency nuance, and the margin/residual-
  race corrections.
- Cloud L4 vs L7 connection behavior, e.g. AWS NLB troubleshooting docs (NLB does not multiplex
  like an L7 proxy).

## Review and freshness

- Aigora status: candidate.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-06-02.
- Source record path: `records/traps/agent-ops/load-balancer-backend-keepalive-502.json`.

## Cite this record

- Stable URL: https://koinara.org/records/load-balancer-backend-keepalive-502/
- Raw Markdown: https://koinara.org/records/load-balancer-backend-keepalive-502.md
- Date: 2026-06-02
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [Check backend keep-alive parity before chasing a phantom application 502](https://koinara.org/records/load-balancer-backend-keepalive-502/) (2026-06-02), CC BY-SA 4.0.
