# SCARA ETALON-4322 — Preview RAG deployment contract

Status: **NOT ACTIVATED**. This is a staging-only integration plan. Do not merge PR #1 or alter the production branch.

## Existing Cloudflare Pages
- Project: `etalon-4322`.
- Production branch: `main` (unchanged).
- Preview branch: `feature/scara-ai-kb-contract-v3`.
- Preview alias: `feature-scara-ai-kb-contract.etalon-4322.pages.dev`.
- No second Pages project or GitHub repository is needed.

## Required PREVIEW bindings (never attach production data)
Under Cloudflare Pages > etalon-4322 > Settings > Variables and Secrets / Bindings, select **Preview**, not Production:
- D1 database binding `KB_DB`: staging-only D1 database, create with a unique name.
- R2 bucket binding `KB_R2`: staging-only R2 bucket.
- Vectorize index binding `KB_VECTOR`: staging-only index with dimensions matching the chosen embedding model.
- Workers AI binding `AI` (already declared in wrangler.jsonc; verify in deployed Preview).
- Plain variable `KB_EMBED_MODEL`: exact Workers AI embedding model identifier compatible with the Vectorize index.
- Plain variable `KB_RAG_ALLOWED_HOST`: `feature-scara-ai-kb-contract.etalon-4322.pages.dev`.
- Plain variable `KB_RAG_STAGING_ENABLED`: **omit** or set `false` until all checks pass.

**Security note:** Preview Pages bindings may apply to multiple preview branches; use staging-only resources. Hostname restriction is an additional check, not tenant authentication.

## Sequence before enabling
1. Create staging D1, R2 and Vectorize; never reuse production resources.
2. Apply `kb/gate0/0001_schema.sql` to staging D1 only; verify FTS5 compatibility.
3. Prepare 19 canonical, approved service documents; do not infer a real company's capabilities.
4. Generate and independently verify manifest and SHA-256 hashes; upload immutable JSON objects to R2 and populate D1 rows/FTS5.
5. Generate embeddings and upsert Vectorize records with `kb_id`, `index_version`, `fragment_id` metadata. Poll for read visibility and verify full counts.
6. Run retrieval safety, prompt injection, and tenant isolation evaluations. Only then activate the verified generation via an audited D1 transaction.
7. Set `KB_RAG_STAGING_ENABLED=true` in **Preview only**, redeploy and run real HTTP tests; inspect source references and cost.
8. Require an explicit release approval before changing `main`.

## Fail-closed behavior
- Without the activation variable the endpoint returns HTTP 503 `RAG_NOT_ENABLED`.
- Without the required host it returns HTTP 403 `HOST_NOT_AUTHORIZED`.
- Missing D1, R2, Vectorize, Workers AI or embedding model binding yields HTTP 503 `KB_UNAVAILABLE`.
- Without an ACTIVE KB generation it returns HTTP 503 `KB_UNAVAILABLE`.
- No verified matching fragments yields `insufficient_evidence`, not an invented answer.

## Remaining engineering gaps
The schema and code are not yet an end-to-end deployment: no canonical document ingestion pipeline, no authenticated server-generated activation evidence, no Vectorize reconciliation job, no durable global quotas, no tenant authorization, no production-grade citations validation, and no voice minutes metering. Do not claim these are complete.
