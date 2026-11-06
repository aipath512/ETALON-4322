// ETALON-4322: cunoștințe sectoriale, nu oferta unei firme reale.
// Mențineți sincronizarea cu services.json și cele 19 pagini HTML.
export const services = [
  {
    "title": "Montaj și înlocuire centrale termice",
    "url": "/servicii/incalzire/centrale-termice/",
    "description": "Montajul sau înlocuirea unei centrale termice presupune verificarea amplasamentului, demontarea echipamentului existent când este cazul, fixarea centralei noi și racordarea acesteia la instalațiile de apă și încălzire. După execuție sunt necesare probe de etanșeitate și verificări de compatibilitate. Punerea în funcțiune, admiterea funcționării și verificarea tehnică periodică sunt operațiuni distincte, supuse cerințelor aplicabile.",
    "limitations": "PIF și VTP nu se confundă cu montajul; autorizările trebuie verificate.",
    "operations": [
      "amplasare",
      "racordare tur-retur",
      "scurgere condens",
      "probe"
    ],
    "sectorial_only": true
  },
  {
    "title": "Montaj și înlocuire radiatoare",
    "url": "/servicii/incalzire/radiatoare/",
    "description": "Montarea sau înlocuirea radiatoarelor începe cu alegerea poziției, fixărilor și racordurilor compatibile cu circuitul de încălzire. Operațiunea poate include schimbarea robineților de tur și retur, montarea unui cap termostatic și aerisirea după umplerea instalației. Înainte de predare trebuie verificată etanșeitatea îmbinărilor și încălzirea uniformă a corpului.",
    "limitations": "Echilibrarea întregului sistem nu este implicit inclusă.",
    "operations": [
      "calorifer",
      "robineți",
      "aerisitor",
      "verificare etanșeitate"
    ],
    "sectorial_only": true
  },
  {
    "title": "Radiatoare decorative și portprosop",
    "url": "/servicii/incalzire/radiatoare-portprosop/",
    "description": "Radiatoarele decorative sau portprosop sunt corpuri de încălzire folosite frecvent în băi. Instalarea lor presupune verificarea dimensiunilor, a rezistenței suportului, a distanțelor de prindere și a poziției racordurilor. După conectare se verifică etanșeitatea și funcționarea pe circuitul termic; varianta electrică necesită o evaluare separată a instalației de alimentare.",
    "limitations": "Portprosopul este explicit prezentat în sursa comercială, însă nu dovedește prestația sau autorizarea unei firme noi; tarifele de pe pagină sunt etichetate 2023.",
    "operations": [
      "radiator de baie",
      "console",
      "racorduri",
      "aerisire"
    ],
    "sectorial_only": true
  },
  {
    "title": "Încălzire în pardoseală",
    "url": "/servicii/incalzire/incalzire-pardoseala/",
    "description": "Încălzirea în pardoseală utilizează circuite amplasate sub finisaj, cu distribuție și reglare a agentului termic. Execuția include pregătirea traseelor, poziționarea tuburilor, conectarea distribuitorului și verificarea etanșeității înaintea acoperirii instalației. Automatizarea pe zone, șapa și finisajul trebuie delimitate clar în ofertă, deoarece nu reprezintă automat aceeași lucrare.",
    "limitations": "Dimensionarea, șapa și finisajul pot fi servicii separate.",
    "operations": [
      "circuite pardoseală",
      "distribuitor",
      "probe de presiune",
      "termostate"
    ],
    "sectorial_only": true
  },
  {
    "title": "Pompe de căldură",
    "url": "/servicii/incalzire/pompe-caldura/",
    "description": "Instalarea unei pompe de căldură presupune stabilirea amplasamentului și verificarea compatibilității cu distribuția termică a clădirii. În funcție de model, lucrările includ unități interioare sau exterioare, racorduri hidraulice, evacuarea condensului și integrarea comenzilor. Înaintea punerii în funcțiune se verifică parametrii instalației și instrucțiunile producătorului.",
    "limitations": "Nu se promit economii fără calcul; pot exista cerințe de certificare pentru circuit frigorific.",
    "operations": [
      "unități pompă de căldură",
      "racord hidraulic",
      "automatizări",
      "reglaje"
    ],
    "sectorial_only": true
  },
  {
    "title": "Distribuție termică și automatizare",
    "url": "/servicii/incalzire/distributie-termica/",
    "description": "Distribuția termică conectează sursa de căldură la radiatoare, circuitele din pardoseală și alte terminale. Lucrarea poate include conducte, distribuitoare, pompe de circulație, filtre, armături și dispozitive de reglaj. Automatizarea prin termostate sau senzori permite controlul pe zone numai dacă instalația este configurată și verificată corespunzător.",
    "limitations": "Instalațiile electrice și automatizările speciale se contractează distinct.",
    "operations": [
      "pompe recirculare",
      "distribuitoare",
      "termostate",
      "reglare debite"
    ],
    "sectorial_only": true
  },
  {
    "title": "Întreținerea instalațiilor termice",
    "url": "/servicii/incalzire/mentenanta-termica/",
    "description": "Întreținerea unei centrale sau instalații termice reunește inspecții, curățări și verificări în funcție de echipament. Pot fi analizate presiunile, schimbătorul, arzătorul, vasul de expansiune și elementele de siguranță. Intervențiile de reparare și înlocuirea pieselor se documentează separat, iar revizia de întreținere nu echivalează cu verificarea tehnică periodică ISCIR.",
    "limitations": "VTP și PIF sunt proceduri distincte, posibil reglementate.",
    "operations": [
      "revizie",
      "service",
      "curățare schimbător",
      "verificare presiune"
    ],
    "sectorial_only": true
  },
  {
    "title": "Instalații de alimentare cu apă",
    "url": "/servicii/sanitare/alimentare-apa/",
    "description": "Instalațiile de alimentare cu apă asigură distribuția apei reci și, după caz, a apei calde la punctele de consum. Lucrările includ trasee de conducte, racorduri, robineți de izolare și verificarea etanșeității. Branșamentul la rețeaua publică este separat de distribuția interioară și poate necesita documentații, acorduri și intervenția unor operatori autorizați.",
    "limitations": "Lucrările pe rețeaua publică nu se presupun incluse.",
    "operations": [
      "conducte apă",
      "robineți",
      "branșament",
      "probe de presiune"
    ],
    "sectorial_only": true
  },
  {
    "title": "Instalații de canalizare și evacuare",
    "url": "/servicii/sanitare/canalizare/",
    "description": "Instalațiile de canalizare transportă apele uzate sau pluviale către sistemul de evacuare, folosind trasee, pante și racorduri adecvate. Execuția poate include conducte, sifoane, cămine sau porțiuni de rețea exterioară, în funcție de proiect. Desfundarea și inspecția video sunt operațiuni distincte care ajută la diagnosticarea blocajelor sau a degradărilor.",
    "limitations": "Racordurile exterioare și intervențiile edilitare se ofertează separat.",
    "operations": [
      "conducte canalizare",
      "racorduri",
      "desfundare",
      "inspecție CCTV"
    ],
    "sectorial_only": true
  },
  {
    "title": "Montaj obiecte sanitare",
    "url": "/servicii/sanitare/obiecte-sanitare/",
    "description": "Montajul obiectelor sanitare privește fixarea și racordarea lavoarelor, vaselor WC, bideurilor, chiuvetelor și rezervoarelor. Înaintea instalării se verifică poziția alimentărilor și evacuării, suportul de prindere și compatibilitatea racordurilor. După montaj se controlează funcționarea, evacuarea apei și eventualele pierderi la îmbinări.",
    "limitations": "Mobilierul, finisajele și mutarea traseelor nu se includ implicit.",
    "operations": [
      "lavoar",
      "vas WC",
      "bideu",
      "chiuvetă"
    ],
    "sectorial_only": true
  },
  {
    "title": "Cabine de duș și dușuri walk-in",
    "url": "/servicii/sanitare/dusuri/",
    "description": "Montarea unei cabine de duș sau a unei soluții walk-in presupune verificarea spațiului, a planeității pardoselii și a poziției scurgerii. Configurația poate include cădiță, rigolă, baterie, paravan și garnituri de etanșare. Funcționarea trebuie testată prin evacuarea controlată a apei, iar hidroizolația și placarea se delimitează ca lucrări distincte.",
    "limitations": "Dușul walk-in și rigola sunt documentate explicit; hidroizolația, finisajele și montarea paravanului necesită delimitare contractuală.",
    "operations": [
      "cabină duș",
      "rigolă",
      "paravan",
      "etanșare"
    ],
    "sectorial_only": true
  },
  {
    "title": "Baterii, robineți și racorduri",
    "url": "/servicii/sanitare/baterii-robineti/",
    "description": "Înlocuirea unei baterii sau a unui robinet presupune izolarea alimentării cu apă, demontarea armăturii vechi și montarea unor racorduri compatibile. Se verifică poziția garniturilor, etanșeitatea îmbinărilor și funcționarea la diferite debite. Robineții de trecere, cei termostatici și bateriile de lavoar îndeplinesc funcții diferite și trebuie identificați corect.",
    "limitations": "Înlocuirea conductelor deteriorate nu este implicit inclusă.",
    "operations": [
      "baterii",
      "robinete de trecere",
      "racorduri",
      "garnituri"
    ],
    "sectorial_only": true
  },
  {
    "title": "Reparații și remedieri scurgeri",
    "url": "/servicii/sanitare/reparatii-sanitare/",
    "description": "Remedierea unei scurgeri începe prin localizarea defectului și izolarea circuitului afectat. În funcție de material și de acces se poate înlocui o garnitură, un racord sau o porțiune de conductă. După reparație, instalația se repune treptat sub presiune și se verifică etanșeitatea; refacerea pereților sau pardoselii poate necesita intervenții suplimentare.",
    "limitations": "Detectarea defectelor ascunse și finisajele necesită evaluare distinctă.",
    "operations": [
      "țevi sparte",
      "infiltrații",
      "racorduri",
      "probă de presiune"
    ],
    "sectorial_only": true
  },
  {
    "title": "Modernizarea instalațiilor unei băi",
    "url": "/servicii/sanitare/modernizare-baie/",
    "description": "Modernizarea instalațiilor unei băi implică adaptarea alimentării cu apă și a evacuării la o configurație nouă de obiecte sanitare. Se pot reface traseele, înlocui armături și pregăti punctele de montaj pentru lavoar, WC și duș. Probele de etanșeitate sunt necesare înainte de închiderea instalațiilor în pereți sau pardoseli.",
    "limitations": "Renovarea completă și lucrările electrice nu sunt incluse implicit.",
    "operations": [
      "refacere instalație baie",
      "trasee apă",
      "evacuare",
      "probe"
    ],
    "sectorial_only": true
  },
  {
    "title": "Montaj aer condiționat",
    "url": "/servicii/climatizare/montaj-aer-conditionat/",
    "description": "Montajul aerului condiționat presupune amplasarea unității interioare și a celei exterioare, conectarea traseelor și evacuarea condensului. Sunt importante accesul pentru întreținere, alimentarea electrică și limitele producătorului. După montare se efectuează verificările tehnice necesare și pornirea controlată a echipamentului.",
    "limitations": "Intervențiile cu agent frigorific pot necesita personal certificat.",
    "operations": [
      "split",
      "suport unitate",
      "traseu frigorific",
      "condens"
    ],
    "sectorial_only": true
  },
  {
    "title": "Sisteme multisplit",
    "url": "/servicii/climatizare/multisplit/",
    "description": "Un sistem multisplit conectează mai multe unități interioare la o unitate exterioară comună. Alegerea echipamentelor și a traseelor depinde de putere, lungimea circuitelor și destinația fiecărei încăperi. Instalarea trebuie să includă configurarea distribuției și testarea individuală a unităților, respectând limitele stabilite de producător.",
    "limitations": "Nu se confundă cu sistemele VRF și nici cu echipamente centrale industriale.",
    "operations": [
      "multisplit",
      "control pe zone",
      "trasee frigorifice",
      "testare"
    ],
    "sectorial_only": true
  },
  {
    "title": "Ventilație și confort interior",
    "url": "/servicii/climatizare/ventilatie/",
    "description": "Ventilația mecanică contribuie la evacuarea aerului viciat și introducerea aerului proaspăt, în funcție de debitele necesare încăperilor. Soluțiile pot utiliza ventilatoare, tubulaturi, filtre și unități cu recuperare de căldură. În spații comerciale sau industriale pot fi utilizate centrale de tratare a aerului, cu reglaje și automatizări specifice.",
    "limitations": "Dimensionarea și automatizarea complexă nu sunt incluse în toate configurațiile.",
    "operations": [
      "ventilație mecanică",
      "recuperare căldură",
      "filtre",
      "CTA"
    ],
    "sectorial_only": true
  },
  {
    "title": "Diagnostic și reparații climatizare",
    "url": "/servicii/climatizare/reparatii-ac/",
    "description": "Diagnosticarea unei instalații de climatizare începe cu simptomele observate: răcire insuficientă, zgomote, opriri sau pierderi de apă. Se verifică filtrele, alimentarea, drenajul și parametrii de funcționare, apoi se stabilește intervenția necesară. Repararea poate presupune componente electrice, mecanice sau frigorifice, în limitele competențelor autorizate.",
    "limitations": "Completarea agentului frigorific nu trebuie să înlocuiască remedierea pierderii.",
    "operations": [
      "diagnostic AC",
      "condens",
      "pierderi agent",
      "reparații"
    ],
    "sectorial_only": true
  },
  {
    "title": "Întreținerea sistemelor de climatizare",
    "url": "/servicii/climatizare/mentenanta-ac/",
    "description": "Întreținerea climatizării include curățarea filtrelor, verificarea evacuării condensului și controlul funcționării unităților interioare și exterioare. Revizia poate identifica din timp blocaje sau componente uzate. Frecvența și operațiunile depind de echipament, mediul de utilizare și recomandările producătorului; reparațiile suplimentare se documentează separat.",
    "limitations": "Nu se promit eficiențe sau rezultate sanitare fără dovezi tehnice.",
    "operations": [
      "curățare AC",
      "filtre",
      "revizie",
      "verificare drenaj"
    ],
    "sectorial_only": true
  }
];
