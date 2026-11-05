# SCARA — ETALON CAEN 4322

**Repository:** aipath512/ETALON-4322  
**Status:** pilot demonstrativ, NEAPROBAT; nu reprezintă website-ul oficial al unei firme.

## Conținut deja încărcat în GitHub

- Homepage etalon cu carusel de 3 teme: încălzire, sanitare, climatizare; autoplay 3 secunde, săgeți și pauză.
- Gradient determinist CSS pe jumătatea stângă, design responsive, un H1.
- Catalog JSON cu 19 exemple sectoriale.
- 19 pagini individuale de servicii, 3 pagini de categorii și indexul serviciilor.
- Pagini Despre, Contact, Surse, Legal, Confidențialitate și Cookies.
- Manifest care marchează lipsa imaginilor binare originale.

## Ce NU este încă transferat din arhiva inițială

**Cele 3 fișiere WebP din pachetul ZIP nu sunt în repository.** Homepage-ul folosește temporar fotografii externe ilustrative. De asemenea, textele paginilor au fost reconstruite pentru publicarea prin conector, nu reprezintă transferul byte-cu-byte al ZIP-ului inițial. Nu se poate confirma astfel încărcarea integrală a celor 40 de fișiere originale.

Pachetul original local are 40 de fișiere (inclusiv 3 WebP). Pentru un transfer identic al pachetului, încărcați conținutul ZIP-ului în rădăcina repository-ului și înlocuiți versiunea demonstrativă curentă; verificați apoi diferențele și deployment-ul.

## Limitări ale etalonului

- Cele patru firme de referință TOP 1 nu sunt certificate prin audit CAEN.
- Catalogul de 19 servicii nu este declarat maximal sau exhaustiv.
- Website-ul nu poate fi folosit pentru a pretinde că o firmă execută serviciile afișate.
- Generarea industrială per CUI, integrarea R2/D1 și publicarea Cloudflare nu sunt incluse în acest repository demo.

**Specificație:** https://scara.dev/spec_v1.0/

## Remediere HERO original — 5 noiembrie 2026

Commitul `ffaa4dd87ad659c2fa17e0f457ee4a13968accae` a modificat homepage-ul să prefere fișierele locale:

- `assets/hero-incalzire.webp` (91.912 octeți; SHA-256 `61ab72f88e29ca8ede456424a60d670180dd3124ee0f261cc63684d132b314d3`)
- `assets/hero-sanitare.webp` (101.852 octeți; SHA-256 `3280ddec7166db7bb96072c44e23a2c82c67a2877dc80742f9c074250a542c9e`)
- `assets/hero-climatizare.webp` (141.334 octeți; SHA-256 `d83bded865fcd5819a44b6ab745ec3840e5c78b8e8d5d3dc747da79f17dc24fa`)

**Atenție:** aceste fișiere încă trebuie încărcate efectiv în repository. Fallback-ul extern Unsplash se va afișa cât timp lipsesc. Copierea lor în folderul `assets/` activează imaginile originale fără alte modificări HTML. Verificați URL-urile de asset și deploymentul Cloudflare după încărcare.
