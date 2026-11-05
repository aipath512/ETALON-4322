# ETALON-4322 — SCARA AI ASSISTANT V3.0 — Implementation contract (Gate 0)

Status: PROPOSED / NOT DEPLOYED. This document specifies the shared KB-backed assistant; the existing `/api/chat` remains a demo with a hardcoded catalog.

## Invariants

1. Exactly one logical sector KB `ETALON-4322` serves all approved sites with primary or secondary CAEN 4322.
2. One versioned widget and one multi-tenant assistant API. Text is enabled on all plans; premium voice is an optional entitlement (20 minutes/month for the 20 EUR tier). No independent voice KB.
3. R2 is the canonical content store. D1 stores structured catalog, tenants, confirmed offerings, entitlement state, KB generation pointers and immutable artifact/chunk references. Vectorize stores embeddings and metadata, not the canonical truth. A Worker orchestrates retrieval; the LLM synthesizes only from retrieved, verified context.
4. CAEN association is NOT evidence that a specific company offers any of the 19 catalog services. Tenant claims are read only from separately confirmed D1 rows.
5. No production rollout until Gate 0 integrity and isolation tests pass.

## Canonical identity

Each chunk has: `kb_id`, `schema_version`, `kb_version`, `artifact_id`, `fragment_id` (stable logical ID), `fragment_revision`, `content_sha256`, `embedding_input_sha256`, `embedding_model`, `embedding_model_version`, `index_version`, `vector_id`, `r2_key`, `jurisdiction`, `language`, `source_ids`, `review_status`.

- Hash canonical UTF-8 bytes with documented normalization/serialization. Any change to bytes changes the hash.
- `fragment_id` is logical; `content_sha256` identifies exact content; `index_version` is independent from `kb_version`.
- Each immutable manifest lists sorted artifact/chunk hashes, model settings, and expected index IDs. Store `manifest.sha256` separately to avoid self-referential hashing; anchor its digest using `manifest.json.ots`. A pending OTS proof is not a confirmed timestamp.
- Embeddings must be generated from bytes whose SHA-256 equals `embedding_input_sha256`. OTS does not verify embedding semantics.

## Index publication and rollback

1. Write versioned objects to R2; validate manifest and provenance.
2. Populate D1 exact metadata and lexical FTS index for an INACTIVE generation.
3. Build Vectorize generation in a dedicated namespace (or separate index if provider namespace semantics are unsuitable); never overwrite active generation in place.
4. Poll/verify query visibility and expected IDs (eventual consistency), run retrieval and safety regression tests; mark generation READY only after all gates pass.
5. Atomically update D1 active generation pointer; each request pins exactly one generation for its lifetime.
6. Keep previous R2 content and indexes for rollback. Rollback changes D1 pointer; it does not assume instant vector deletion.
7. Reject mismatched versions and missing fragments; never silently mix generations.

## Query execution

`POST /api/assistant/v1/chat` JSON:
```json
{"message":"De ce caloriferul este rece jos?","language":"ro","session_id":"opaque-client-session"}
```

Site identity MUST be resolved and authorized server-side from registered host/site credentials; client-supplied tenant IDs are not authorization. Enforce per-tenant quotas and origin policy. Response:
```json
{"reply":"...","language":"ro","kb_id":"ETALON-4322","kb_version":"...","index_version":"...","sources":[{"fragment_id":"...","content_sha256":"..."}],"mode":"rag","request_id":"..."}
```

- FAST PATH: exact normalized lookup against approved, unambiguous canonical Q&A only; never rely on an arbitrary cosine threshold.
- RAG PATH: D1 structured filters + lexical FTS + Vectorize semantic search, deduplicate/rerank, retrieve R2 fragments, verify hashes and provenance, then send only bounded context to LLM.
- User input and retrieved text are untrusted data, separated structurally from system/developer instructions. Ignore instructions embedded in source material. Test prompt injection and cross-tenant data extraction.
- If evidence is insufficient, explicitly say so and ask a clarifying question; do not invent commercial claims, authorization, availability, prices or hazardous repair steps.
- LLM provider/model, timeout, streaming behavior and fallback must be fixed in configuration and validated before SLA claims.

## Shared widget and voice

- Versioned JS/CSS loaded from one centrally managed URL; API compatibility matrix and cache policy are mandatory.
- Text mode on all plans. Optional microphone + speech playback only when supported; browser capability detection and explicit fallback to text.
- Premium server-side STT/TTS is a distinct entitlement, limited to 1200 seconds per billing month for the EUR 20 plan. Server-side accounting must prevent concurrent overspend.
- One animated avatar component; optional centrally rotated GIF variants. Animation is presentation only.
- Never claim speech support for a language/browser combination without a compatibility test.

## Tenant isolation

D1 stores confirmed services, tier, assistant enablement, quotas and active generation pointer. Commercial answers must be assembled from a separately labeled, verified tenant-facts context, not inferred from the sector KB. Session state is scoped by tenant and session, with explicit retention and deletion policies. No cross-tenant conversation sharing.

## Gate 0 acceptance tests (automated)

1. Modified canonical fragment fails SHA-256 validation.
2. Wrong embedding input hash fails publication.
3. Incomplete or not-yet-visible Vectorize generation cannot become ACTIVE.
4. Every request uses one pinned `kb_version/index_version`.
5. Rollback returns to prior tested generation without reindexing.
6. Malicious retrieved text cannot override assistant instructions in adversarial tests.
7. Tenant A cannot access tenant B commercial facts, sessions, or quotas.
8. Text-only tier cannot invoke premium voice; voice quota exhaustion degrades to text.
9. Unsupported browser microphone degrades to accessible text UI.
10. Existing ETALON demo `/api/chat` remains operational until a separately approved cutover.

## Delivery order

Gate 0: canonical schemas + deterministic manifest/OTS tooling + D1 migrations + versioned index tests.
Gate 1: R2/D1/FTS/Vectorize retrieval Worker and source-grounded LLM integration.
Gate 2: universal widget, text + optional voice, tenant entitlement and telemetry.
Gate 3: verified corpus for 19 services, safety and multilingual evaluation, controlled rollout.

## Current repository facts (2026-11-05)

- `services.json`: 19 sector services, all `confirmed_for_company: false`.
- `ai-data/knowledge.js`: 19 entries with three repeated generic descriptions.
- `functions/api/chat.js`: Workers AI `@cf/meta/llama-3.1-8b-instruct-fp8` with static imported JS catalog, NOT R2/D1/Vectorize retrieval.
- No assertion of Cloudflare deployment, bindings, complete technical corpus, production voice metering or SLA is made by this document.
