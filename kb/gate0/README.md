# Gate 0 — integritate KB ETALON-4322

Implementare inițială **offline**, fără Cloudflare bindings, fără indexare Vectorize și fără deploy. Necesită Node.js 20+.

`node --test kb/gate0/manifest.test.mjs`

Pentru generare: `node kb/gate0/build.mjs config.json output/manifest.json`. Fișierul config conține `root`, `kbVersion`, `indexVersion`, `embeddingModel`, `files` (fiecare: `path`, `artifact_id`, `fragment_id`, `fragment_revision`, `language`, `jurisdiction`). Documentele sunt JSON cu `text` sau `embedding_text`. Hash-ul `raw_sha256` verifică octeții R2, `content_sha256` verifică serializarea canonică, `embedding_input_sha256` verifică exact textul de intrare în model.

**Atenție:** `manifest.json.sha256` este hash extern al manifestului. **Nu** se generează sau se confirmă `.ots` aici; ancorarea OTS necesită integrare separată și verificare. Vectorize eventual consistency, readiness, atomic pointer switch, rollback, source licensing, FTS ingestion, tenant isolation, voice metering și RAG API **nu sunt implementate** de acest pachet.

Schema D1 din `0001_schema.sql` este propunere de migrare, neaplicată. `kb_fragment_fts` nu impune încă integritate relațională; Workerul trebuie să filtreze pe versiune și să valideze hash-urile. Înainte de producție: test de index visibility și activare tranzacțională verificată.
