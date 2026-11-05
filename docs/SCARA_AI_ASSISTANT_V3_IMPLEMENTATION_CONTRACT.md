# ETALON-4322 — SPEC V3.1 · Contract consolidat al deciziilor

**Statut:** specificație aprobată ca direcție arhitecturală; implementarea RAG de producție NU este confirmată. **V2.0 este arhitectură de referință, nu contract executabil.** Acest document înlocuiește contractul V3.0 preliminar din acest fișier. Nu autorizează deploy sau migrarea producției.

## 1. Decizii obligatorii (fără alternative implicite)

- **O singură KB sectorială ETALON-4322**, pentru CAEN Rev.3 4322 principal SAU secundar; catalog inițial de **19 servicii**: 7 încălzire, 7 sanitare, 5 climatizare. Codul CAEN nu dovedește că firma execută toate serviciile.
- **O singură implementare logică de chatbot/asistent AI** (widget comun, API comun, motor Hybrid RAG comun) pentru N site-uri, fără KB, embeddings sau LLM separat per firmă.
- **Același text de răspuns**, sintetizat din KB și datele firmei confirmate, este afișat sau redat vocal; **nu există o KB vocală**.
- **R2** stochează conținutul canonic și sursele, **D1 SQL** stochează catalogul, relațiile, datele confirmate ale firmelor, versiunile și drepturile; **Vectorize** stochează embeddings/referințe; **LLM** sintetizează din fragmente recuperate; **un Worker** orchestrează.
- **Text inclus** în pachetele 10/15/20 EUR/lună. **Voce premium inclusă numai în pachetul 20 EUR/lună, limitată la 20 minute/lună** și contorizată server-side. Lipsa/epuizarea vocii nu oprește textul.
- **Șase limbi inițiale**: RO, EN, FR, ES, DE, IT. Arhitectura permite ulterior 24 de limbi, dar acestea nu sunt promise ca funcționale înainte de testare. Jurisdicția normelor este separată de limba răspunsului.
- Avatar animat GIF în bula asistentului, cu posibilitatea de până la 10 variante rotite central la fiecare oră; fără blocarea navigării sau a controalelor paginii.

## 2. Identitate și integritate (Gate 0)

Identificatori obligatorii: `kb_id`, `schema_version`, `kb_version`, `artifact_id`, `fragment_id` logic stabil, `fragment_revision`, `content_sha256`, `embedding_input_sha256`, `embedding_model`, `embedding_model_version`, `index_version` separat de KB, `vector_id`, `r2_key`, `jurisdiction`, `language`, `source_ids`, `review_status`.

- Specificați serializarea canonică UTF-8 înainte de calcularea SHA-256; hash-ul identifică octeții, nu sensul.
- Manifestul conține lista sortată a fișierelor și fragmentelor, hash-urile și parametrii de indexare. Hash-ul manifestului se stochează separat în `manifest.sha256` (fără autoreferință).
- **OpenTimestamps**: se generează `manifest.json.ots`; politica de activare cere verificarea integrității SHA-256 și a stării ancorării OTS. O dovadă OTS în așteptare nu se prezintă ca timestamp confirmat. Condiția exactă de activare (OTS confirmat sau doar ancorare inițiată) trebuie decisă explicit înainte de producție.
- Embeddings se generează din intrarea al cărei SHA-256 este `embedding_input_sha256`. OTS nu demonstrează corespondența semantică dintre text și vector.

## 3. Publicare și rollback fără presupuneri de consistență imediată

`DRAFT → VALIDATED → INDEXING → READY → TESTED → ACTIVE`.

1. Scriere R2 imuabilă per versiune, validare manifest, surse și drepturi de utilizare.
2. Populare D1 metadata și **FTS5 lexical** pentru generația inactivă.
3. Populare Vectorize în namespace/index distinct per `index_version`; fără suprascrierea generației active.
4. Verificare explicită a vizibilității și completitudinii indexului (Vectorize este eventually consistent), plus evaluări de retrieval și siguranță.
5. Comutare **atomică doar a pointerului D1**; cererea fixează o singură pereche `kb_version/index_version` până la final.
6. Păstrarea generației precedente pentru rollback prin pointer, fără ștergere instantanee de vectori. Nu se pretinde atomicitate distribuită R2+D1+Vectorize.

## 4. API unic și rutare

API țintă: `POST /api/assistant/v1/chat`. Identitatea tenantului este stabilită server-side dintr-o înregistrare de domeniu/site autorizată, nu dintr-un `tenant_id` arbitrar trimis de browser. Răspunsul include `request_id`, `reply`, `language`, `kb_version`, `index_version`, `mode`, `sources` (fragment ID + hash). Contract OpenAPI și format de streaming sunt livrabile obligatorii, încă nescrise.

- **FAST PATH**: numai răspunsuri canonice unice, aprobate, potrivire deterministă sau criteriu calibrat pe set de validare; nu un prag cosine 0.78 ales arbitrar.
- **RAG PATH**: D1 filtre exacte + FTS5 lexical + Vectorize semantic → deduplicare/reranking → fragmente din R2 verificate SHA-256 → LLM → răspuns verificabil.
- Separare structurală system/developer instructions vs. input și documente recuperate, tratate ca date neîncredere. Teste adversariale prompt injection.
- Informațiile sectoriale generale și **datele comerciale confirmate ale firmei** sunt recuperate în contexte distincte, cu etichete de proveniență; nu se deduc oferte, prețuri, disponibilitate sau autorizări din CAEN/KB.
- Dacă lipsesc dovezi, se cere clarificare sau se declară limita; nu se furnizează proceduri periculoase pentru gaz, electricitate, presiune sau agent frigorific.

## 5. Model, fallback și performanță

Alegerea finală a LLM, a modelului embeddings, a versiunilor, timeouturilor, streamingului, circuit breaker și fallback-ului este **decizie deschisă, obligatorie înainte de SLA**. Implementarea demonstrativă folosește Workers AI Llama 3.1 8B; aceasta **nu certifică** modelul de producție. Nu promitem 99,9% SLA sau p95 8 secunde fără măsurători end-to-end. În absența LLM, răspunsurile canonice FAST PATH pot funcționa; altfel eroare explicită, nu răspuns inventat.

## 6. Widget unic, voce și sesiuni

- Un singur JS/CSS versionat distribuit central, cu contract de compatibilitate API, cache și rollback. Nu injectăm simultan două widgeturi.
- Text în toate pachetele. Pentru 20 EUR/lună: STT/TTS premium activat prin entitlement D1, **1200 secunde/lună** cu contorizare server-side și control al concurenței; fallback la text.
- Funcțiile vocale ale browserului, dacă sunt folosite, sunt opționale și testate per browser/versiune/limbă; **nu sunt echivalate cu vocea premium garantată**.
- GIF în interiorul bulei; până la 10 variante, rotație centrală orară opțională, păstrând un avatar stabil pe durata sesiunii.
- Istoric izolat per tenant/sesiune; alegerea D1 vs Durable Objects pentru stare activă, retenția, ștergerea și consimțământul sunt decizii de implementare deschise. Nu se reutilizează conversații între firme.

## 7. Conținut, proveniență și siguranță

Cele 19 servicii necesită fișe tehnice **distincte** (nu cele trei descrieri generice actuale), întrebări, intenții, scenarii, surse, data verificării, jurisdicție, licență și `review_status`. Documentele proprietare nu se copiază în KB fără drepturi. Regulile de siguranță și de escaladare sunt localizate pe jurisdicție, independent de limba vizitatorului. Corpusul și setul de evaluare se construiesc împreună; nu se declară exhaustivitate fără dovadă.

## 8. Testare, observabilitate, economie

Teste executabile cu input, rezultat așteptat și prag: identitate/hash, index incomplet, generație fixată, rollback, lexical vs. semantic recall, faithfulness, refuz corect, prompt injection, izolare tenant, drepturi text/voce, limită 1200 secunde, browsere și limbi. LLM-as-judge se completează cu verificare umană pentru cazuri critice.

Loguri și tracing cu `request_id`, versiuni KB/index/model, latență, erori, utilizare și cost/tenant; datele personale sunt minimizate. Bugetele comerciale se validează pe trafic real înainte de extindere.

## 9. Ordine de implementare (nu extindem domeniul prematur)

**Gate 0:** contract fragment/hash/index + scheme JSON + manifest determinist/OTS + migrații D1 + strategie Vectorize + teste integritate/rollback.

**Gate 1:** corpus minim verificat și set de evaluare + R2/D1/FTS5/Vectorize + Worker RAG + LLM/fallback; pilot end-to-end **un singur tenant, text**.

**Gate 2:** widget unic și compatibil, izolare completă, metrici/costuri, pilot pe 10 firme după aprobări.

**Gate 3:** voce premium cu cote și teste browser, apoi șase limbi validate; extinderea la 24 de limbi și N site-uri numai după certificare.

## 10. Ce eliminăm din vechile formulări

- Nu spunem că R2 → D1 → Vectorize → LLM este un lanț strict serial la fiecare întrebare: **indexarea** R2 → D1/Vectorize este separată de **interogarea** Worker → D1/FTS/Vectorize → R2 → LLM.
- Nu afirmăm că OTS elimină drift-ul semantic, că Vectorize este imediat consistent sau că rollback-ul e tranzacție distribuită.
- Nu afirmăm că promptul singur garantează zero halucinații.
- Nu confundăm catalogul CAEN cu serviciile confirmate ale firmei.
- Nu confundăm voice din browser cu serviciul premium de 20 minute.
- Nu afirmăm că V3.1 este deja implementat, testat sau publicat.

## 11. Situație constatată în repository (2026-11-05)

- `services.json`: 19 servicii, `confirmed_for_company=false`.
- `ai-data/knowledge.js`: 19 intrări, descrieri generice repetate pe trei familii.
- `functions/api/chat.js`: Workers AI `@cf/meta/llama-3.1-8b-instruct-fp8` și catalog JS static; **NU** citește KB R2/D1/Vectorize.
- Niciun deploy, binding Cloudflare, indexare completă sau voice premium nu este atestat de această specificație.
