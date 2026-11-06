# SCARA ETALON-4322 — Registru de surse V1

Data inițializării: 2026-11-06. Stare: **inventar inițial, NU catalog tehnic validat**. Scop: fundamentarea celor 19 fișe CAEN 4322 pentru site și asistentul text/voice cu D1 + FTS5. Nu presupune descărcarea sau dreptul de republicare a documentelor.

## Surse candidate și gradul de verificare

| ID | Sursă | Familii | Stare | Utilizare / limitare |
|---|---|---|---|---|
| S01 | [REHVA — Guidebook Repository](https://www.rehva.eu/hvac-guidebook-repository) | incalzire,climatizare | verificat-index | Bibliografie HVAC; unele ghiduri sunt contra cost |
| S02 | [REHVA — European Guidebooks](https://www.rehva.eu/eshop) | incalzire,climatizare | verificat-index | Ghiduri pentru încălzire de joasă temperatură, ventilație, igienă, commissioning; nu copia conținutul plătit |
| S03 | [Daikin România — instalare aer condiționat](https://www.daikin.ro/ro_ro/rezidential/suport/instalare/aer-conditionat.html) | climatizare | verificat-pagina | FAQ B2C privind amplasare, instalare și specialiști |
| S04 | [Daikin România — manual de instalare AC (model specific)](https://www.daikin.ro/content/dam/document-library/installation-manuals/ac/sky-air/fua-a/FUA-A_Installation%20manual_4PRO469441-1F_Romanian.pdf) | climatizare | verificat-document | Exemplu tehnic specific modelului; nu generaliza parametri la alte modele |
| S05 | [EUR-Lex — Regulamentul UE 2024/573](https://eur-lex.europa.eu/eli/reg/2024/573/oj?locale=ro) | climatizare | de-verificat-detaliat | Cadru juridic gaze fluorurate; verifică obligațiile actuale și actele conexe înainte de publicare |
| S06 | [ISCIR](https://www.iscir.ro/) | incalzire | portal | Portal instituțional; prescripția aplicabilă fiecărui echipament rămâne de identificat |
| S07 | [ANRE](https://anre.ro/) | incalzire | portal | Portal instituțional; cerințele privind gaze trebuie verificate pe tip de lucrare |
| S08 | [IEA Heat Pumping Technologies](https://heatpumpingtechnologies.org/) | incalzire | portal | Materiale generale pompe de căldură; identificarea documentelor concrete este în așteptare |
| S09 | [REHAU România](https://www.rehau.com/ro-ro) | incalzire,sanitare | portal | Documentație sisteme conducte și încălzire în pardoseală; selectare fișe concrete ulterior |
| S10 | [Geberit România](https://www.geberit.ro/) | sanitare | portal | Documentație instalații sanitare; selectare manuale concrete ulterior |
| S11 | [Wavin](https://www.wavin.com/) | sanitare | portal | Documentație conducte și evacuare; selectare manuale concrete ulterior |
| S12 | [Caleffi](https://www.caleffi.com/) | incalzire | portal | Documentație distribuție și control hidraulic; selectare fișe concrete ulterior |

**Legendă:** `verificat-pagina/document/index` = pagina sau documentul a fost identificat prin cercetare publică; nu echivalează cu audit tehnic/juridic. `portal` = numai sursă-candidat, fără document individual validat. `de-verificat-detaliat` = necesită citire și mapare punctuală. Nu extrage afirmații normative dintr-un simplu portal.

## Maparea preliminară la cele 19 servicii existente

| # | Serviciu (identic cu ai-data/knowledge.js) | Familia | Surse candidate | Stare fișă |
|---|---|---|---|---|
| 1 | [Întreținerea sistemelor de climatizare](/servicii/climatizare/mentenanta-ac/) | climatizare | S01, S02, S03, S04, S05 | PENDING |
| 2 | [Montaj aer condiționat](/servicii/climatizare/montaj-aer-conditionat/) | climatizare | S01, S02, S03, S04, S05 | PENDING |
| 3 | [Sisteme multisplit](/servicii/climatizare/multisplit/) | climatizare | S01, S02, S03, S04, S05 | PENDING |
| 4 | [Diagnostic și reparații climatizare](/servicii/climatizare/reparatii-ac/) | climatizare | S01, S02, S03, S04, S05 | PENDING |
| 5 | [Ventilație și confort interior](/servicii/climatizare/ventilatie/) | climatizare | S01, S02, S03, S04, S05 | PENDING |
| 6 | [Montaj și înlocuire centrale termice](/servicii/incalzire/centrale-termice/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 7 | [Distribuție termică și automatizare](/servicii/incalzire/distributie-termica/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 8 | [Încălzire în pardoseală](/servicii/incalzire/incalzire-pardoseala/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 9 | [Întreținerea instalațiilor termice](/servicii/incalzire/mentenanta-termica/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 10 | [Pompe de căldură](/servicii/incalzire/pompe-caldura/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 11 | [Montaj și înlocuire radiatoare](/servicii/incalzire/radiatoare/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 12 | [Radiatoare decorative și portprosop](/servicii/incalzire/radiatoare-portprosop/) | incalzire | S01, S02, S06, S07, S08, S09, S12 | PENDING |
| 13 | [Instalații de alimentare cu apă](/servicii/sanitare/alimentare-apa/) | sanitare | S09, S10, S11 | PENDING |
| 14 | [Baterii, robineți și racorduri](/servicii/sanitare/baterii-robineti/) | sanitare | S09, S10, S11 | PENDING |
| 15 | [Instalații de canalizare și evacuare](/servicii/sanitare/canalizare/) | sanitare | S09, S10, S11 | PENDING |
| 16 | [Cabine de duș și dușuri walk-in](/servicii/sanitare/dusuri/) | sanitare | S09, S10, S11 | PENDING |
| 17 | [Modernizarea instalațiilor unei băi](/servicii/sanitare/modernizare-baie/) | sanitare | S09, S10, S11 | PENDING |
| 18 | [Montaj obiecte sanitare](/servicii/sanitare/obiecte-sanitare/) | sanitare | S09, S10, S11 | PENDING |
| 19 | [Reparații și remedieri scurgeri](/servicii/sanitare/reparatii-sanitare/) | sanitare | S09, S10, S11 | PENDING |

## Reguli de redactare și acceptanță

1. Pentru fiecare serviciu: ID stabil, familie, descriere originală B2C, operațiuni posibile, beneficii fără promisiuni, sinonime, minimum 5 FAQ, limitări, surse cu URL/document/ediție/pagină unde există.
2. Distingem explicația generală despre o activitate de **serviciul efectiv prestat de o firmă**: acesta se afișează doar după confirmarea firmei.
3. Manualele specifice unui produs nu sunt reguli universale; prescripțiile și autorizațiile se verifică pentru jurisdicția și tipul lucrării.
4. Nu copiăm texte protejate și nu inventăm prețuri, certificări, disponibilitate sau competențe.
5. Nicio fișă `PENDING` nu devine `APPROVED` fără verificarea surselor și control editorial; doar fișele aprobate intră în răspunsuri comerciale.
6. Acest registru nu schimbă aplicația, schema D1, Cloudflare Preview sau producția.

## Următorul lot

Selectarea documentelor concrete și extragerea faptelor pentru 5 servicii climatizare, cu surse la nivel de afirmație; apoi încălzire și sanitare. După validare: fișe, sinonime, FTS5, router, integrare și teste.
