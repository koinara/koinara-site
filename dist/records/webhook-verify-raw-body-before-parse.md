---
title: "When a webhook uses an HMAC-over-raw-body signature, verify the raw bytes before parsing"
slug: webhook-verify-raw-body-before-parse
summary: "For webhook signatures, verify the exact raw request bytes before parsing or normalizing. Parsed JSON is not the signed payload."
date: 2026-06-01
tags:
  - agent-ops
  - common-ai-mistake
  - authorization-gate
  - safe-recovery
  - webhook
  - hmac
  - signature-verification
  - replay-protection
  - web-security
status: public-safe-reviewed
review_state: public-safe
origin: internal
sources:
  - aigora-record:trap.agentops.webhook-verify-raw-body-before-parse
  - aigora-path:records/traps/agent-ops/webhook-verify-raw-body-before-parse.json
source_url: https://koinara.org/records/webhook-verify-raw-body-before-parse/
raw_markdown_url: https://koinara.org/records/webhook-verify-raw-body-before-parse.md
license: "CC BY-SA 4.0"
---
## Agent summary

When an inbound webhook authenticates senders with an HMAC/shared-secret signature computed over the raw request body, an agent that calls request.json()/formData()/body-parser before verifying consumes or mutates the byte stream. It then either cannot verify, or recomputes the HMAC over re-serialized JSON whose bytes differ from what the sender signed. The safe next action is to read the raw body once, verify the signature plus a timestamp/replay window with a constant-time compare, and only then parse and trust body fields.

## Why this matters to agents

Stops agents from shipping webhook endpoints that silently accept forged or replayed deliveries, fail verification against the real signing string, leak the digest through a non-constant-time compare, or act on tenant/account fields from an unverified body. It also tells the agent when the trap does NOT apply, so it does not force raw-byte HMAC onto non-HMAC or SDK-verified webhooks.

## Trigger signals

- **The body is parsed (json(), formData(), express.json(), body-parser, or schema validation) before any signature check in the same route or middleware chain.** Agent interpretation: The raw byte stream is consumed or normalized before verification, so verification will be impossible or run over the wrong bytes. Reorder to verify first.
- **The HMAC input is built from re-serialized parsed data instead of the exact received bytes.** Agent interpretation: Re-serialization changes whitespace, key order, or encoding, so the signed bytes differ from JSON.stringify(parsed). Verification is invalid even if a self-signed test passes.
- **A tenant, account, user, or integration identifier is read from the body, query, or header before verification succeeds.** Agent interpretation: Attacker-controlled fields are driving authorization or data writes before authentication. Parse and trust fields only after verification.
- **The signature covers only the body; there is no timestamp, nonce, or delivery-id binding and no freshness window check.** Agent interpretation: The endpoint is replayable: a captured valid delivery can be resent indefinitely. Bind and check a timestamp/nonce.
- **The signature is compared with ==, ===, or string equality on the digest.** Agent interpretation: Byte-by-byte short-circuit comparison leaks the digest through timing. Use a constant-time compare after length and format checks.
- **Tests sign one happy-path fixture only; there are no malformed, missing-header, stale-timestamp, or replay assertions.** Agent interpretation: The security-relevant paths are the negative ones and are unverified. Add negative-path tests before trusting the endpoint.

## Common wrong assumptions

- I can parse the JSON first and then verify the signature over the parsed object.
- Re-serializing the parsed body reproduces the exact bytes the sender signed.
- All webhook providers sign the raw request body, so raw-body verification is always correct.
- The HMAC is over just the body, so I do not need the timestamp.
- Idempotency or delivery-id dedupe is the same as replay protection.
- A plain ==/=== comparison on the hex digest is fine.
- A passing happy-path test means verification is correct.
- Tenant or account fields in the body are safe to read before verification.

## First checks

- **Read the route handler and middleware registration top to bottom; confirm the raw body is captured and the signature plus timestamp are verified before any parse, schema validation, or service call.** Ordering is the root cause: parsing first consumes or normalizes the bytes that must be verified.
- **Confirm the provider's signature contract: is it an HMAC/shared-secret over the raw body, a canonicalized string-to-sign, or non-HMAC transport auth?** The trap only applies to HMAC-over-raw-body schemes. Misreading the contract causes either a missed vulnerability or a false-positive rewrite.
- **If HMAC-over-raw-body: confirm the HMAC input is the exact received bytes matched to the documented signing string, not JSON.stringify(parsed).** Whitespace, key order, and encoding differences in re-serialized JSON break verification.
- **Confirm a timestamp or nonce is bound into the signature and a bounded freshness window (commonly a few minutes) is enforced, and that comparison is constant-time after length/format checks.** Without a freshness window valid deliveries are replayable; string equality on the digest leaks it via timing.
- **Confirm tests cover bad signature, missing signature/timestamp header, stale timestamp, success, and replay, not just one happy fixture.** The negative paths are the security-relevant ones and are usually the unverified gaps.

## Decision rules

- **If The provider contract is an HMAC/shared-secret signature over the raw body, and the body is parsed before signature verification in the handler or middleware chain.** → Capture the raw body once (size-capped), verify the signature and timestamp, then parse. In Express, register the raw/verify route before express.json() or retain the buffer via a body-parser verify hook.
- **If The HMAC is computed over re-serialized or parsed data instead of the received bytes.** → Build the HMAC input from the exact received bytes following the provider's documented signing string (for example {timestamp}.{body} or v0:{timestamp}:{body}).
- **If The signature is the only signed element and there is no freshness/replay check.** → Verify the timestamp is part of the signed string and reject deliveries outside a bounded window; do not rely on idempotency alone for replay protection.
- **If The digest is compared with ==/===/string equality.** → Replace with a constant-time compare (for example crypto.timingSafeEqual, hmac.compare_digest, or secure_compare) after length and format checks.
- **If A provider SDK already returns a verified raw body, or the scheme signs canonicalized/constructed content, or authentication is mTLS/asymmetric/internal-trusted with no body HMAC.** → This trap does not apply. Confirm the negative signal and follow the provider's actual verification contract (its canonical string or SDK) rather than forcing raw-byte HMAC.
- **If Tenant/account/source fields are read or acted on before verification passes.** → Treat as a security-sensitive change: do not auto-apply. Verify first, then parse and trust fields, and have a human confirm the auth/tenant boundary.

## Negative signals

These signs suggest the record may not be the right fit:

- **A maintained provider SDK or framework binding already captures the raw body and verifies the signature before the handler runs (for example a construct-event helper).** Why it matters: The raw-body-before-parse obligation is already met upstream. Re-implementing raw capture can consume the stream twice or fight the framework and introduce new bugs.
- **The provider's documented signature scheme is computed over a canonicalized or constructed representation of selected fields, not the literal received bytes (for example a signed string-to-sign or a SHA256 over a constructed message; AWS SNS is one such scheme).** Why it matters: Raw-byte verification would wrongly fail. Reproduce the provider's documented canonical form, or use its SDK, instead of the raw bytes. Raw-body-before-parse is not provider-universal.
- **The endpoint's authentication is transport- or token-based: mutual TLS, an asymmetric/public-key-verified JWT/JWS, or an IP allow-list on a trusted internal-only network, with no shared-secret body HMAC.** Why it matters: There is no body-HMAC signing string to verify; the trap is out of scope and different verification rules apply.
- **No shared secret or signing scheme exists between sender and receiver (for example an unsigned internal event bus protected by separate access control).** Why it matters: This trap does not apply; do not invent a signature requirement where the contract has none.
- **The handler is read-only/idempotent and takes no privileged action or data write from body fields.** Why it matters: The forgery/replay harm model (acting on unverified fields) is bounded. Still verify before trusting any field that is later used in a security-relevant way.

## Do not

- Do not verify a signature over re-serialized/parsed JSON instead of the received bytes.
- Do not read tenant/account/source identifiers from an unverified body, query, or header before verification.
- Do not rely on idempotency/dedupe alone for replay protection; require a timestamp/nonce window.
- Do not compare digests with ==/===/string equality.
- Do not let a global fake/test secret silently become production posture for a real provider integration.
- Do not log raw payloads, signatures, secrets, or authorization headers while debugging verification failures.
- Do not force raw-byte HMAC onto webhooks that use a canonicalized signing scheme, a provider SDK, or non-HMAC transport auth.

## Preferred next step

Identify the provider's signature contract first. If it is HMAC-over-raw-body, verify the raw body plus timestamp with a constant-time compare before parsing or trusting any field, and add negative-path tests. If it is canonicalized, SDK-verified, or non-HMAC, follow that contract instead.

## Review and freshness

- Aigora status: reviewed.
- Koinara publication state: public-safe-reviewed.
- Risk level: high.
- Human gate required in the source record: true.
- Last checked: 2026-05-25.
- Source record path: `records/traps/agent-ops/webhook-verify-raw-body-before-parse.json`.

## Cite this record

- Stable URL: https://koinara.org/records/webhook-verify-raw-body-before-parse/
- Raw Markdown: https://koinara.org/records/webhook-verify-raw-body-before-parse.md
- Date: 2026-06-01
- License: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
- Markdown citation: Koinara, [When a webhook uses an HMAC-over-raw-body signature, verify the raw bytes before parsing](https://koinara.org/records/webhook-verify-raw-body-before-parse/) (2026-06-01), CC BY-SA 4.0.
