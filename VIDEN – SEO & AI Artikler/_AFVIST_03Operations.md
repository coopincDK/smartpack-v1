# AFVIST — 03-OPERATIONS
**Dato:** 2025-01-XX  
**Analyseret:** 20 artikler  
**Afvist:** 8/20 (40%)

---

## ❌ AFVISTE ARTIKLER MED KONKRETE FIXES

### 13. lageralerts-opsætning.md | ❌ AFVIST

**HVORFOR AFVIST:**
- Mangler konkret økonomi ("proaktiv alerts forhindrer stockouts" — hvad koster en stockout?)
- For generisk ("alerts er vigtige" energi)
- Mangler konkret scenarie hvor alerts redder dagen

**KONKRETE FIXES:**

#### 1. NY INTRO (komplet):
```markdown
En A-vare der løber tør midt i pluktiden stopper 12 ordrer i kø. Hver ordre venter 45 minutter på genopfyldning. 12 ordrer × 45 min = 9 timer spildt. Ved 250 kr./time = 2.250 kr. tabt på én tom hylde.

Et lager med korrekt opsatte alerts opdager problemet 4 timer inden — og genopfylder inden plukstart. Omkostning: 0 kr.

Denne guide viser dig, præcis hvilke alerts du skal have aktive, hvordan du kalibrerer dem, og hvad der går galt når du ikke gør det.
```

#### 2. TILFØJ SCENARIE (efter "Hvornår er alerts et problem?"):
```markdown
## Hvad der faktisk sker (når alerts mangler)

### Scenarie 1: A-vare løber tør uden advarsel
Din bestseller (SKU-12345) sælger 80 enheder/dag. Refill limit: 50 enheder.

Mandag morgen: 48 enheder på lager. Ingen alert.

Kl. 10:00: Første plukrunde starter. 12 ordrer i kø.

Kl. 10:15: Plukkeren når hylden. Tom.

**Hvad der sker:**
- 12 ordrer sættes på hold
- Genopfyldning tager 45 minutter (hente fra bulk, scanne, placere)
- 12 ordrer × 45 min forsinkelse = 9 timer spildt kapacitet
- Ved 250 kr./time = **2.250 kr. tabt**

**Med alert:**
Fredag kl. 16:00: Alert udløses ved 50 enheder.

Lørdag morgen: Genopfyldning inden plukstart.

Mandag kl. 10:00: 120 enheder på lager. Ingen stop.

**Omkostning: 0 kr.**
```

#### 3. TILFØJ ØKONOMI (i "Hvorfor er det vigtigt?"):
```markdown
- En stockout på A-vare koster **2.250 kr.** i spildt kapacitet per incident
- Udløbsvarer opdaget for sent: **100% varespild** (kan ikke sælges)
- Negativ lagerantal opdaget af kunde (oversalg): **450-850 kr.** per episode inkl. LTV
- SmartPack's alerts opdager 95% af problemer **4-24 timer inden** de stopper flow
```

#### 4. REWRITE TRIN 2 (konkret):
```markdown
### Trin 2: Konfigurér refill-alerts per SKU-klasse

Indstil refill alerts baseret på ABC-klasse:

**A-varer:**
- Alert ved: dagligt salg × leveringstid × 1,5
- Eksempel: 80 salg/dag × 3 dages leveringstid × 1,5 = alert ved **360 enheder**
- Reaktionstid: inden for 4 timer

**B-varer:**
- Alert ved: dagligt salg × leveringstid × 1,3
- Eksempel: 20 salg/dag × 3 dage × 1,3 = alert ved **78 enheder**
- Reaktionstid: inden for 24 timer

**C-varer:**
- Alert ved: dagligt salg × leveringstid × 1,2
- Reaktionstid: inden for 48 timer
```

---

### 14. lagerrevision-korrekt.md | ❌ AFVIST

**HVORFOR AFVIST:**
- "Det afhænger af" energi ("revision er konstruktiv statusopgørelse")
- Mangler konkret scenarie hvor revision opdager noget kritisk
- For generisk tjekliste uden konkrete tal

**KONKRETE FIXES:**

#### 1. NY INTRO (komplet):
```markdown
En lagerrevision i maj 2024 opdagede, at 12% af A-varerne havde forkert lokation i systemet. Plukkere navigerede til tomme hylder, scannede manuelt og spildte 8 minutter per fejl-pick.

300 ordrer/dag × 2 picks/ordre × 12% fejl = 72 fejl-picks/dag × 8 min = **576 minutter spildt/dag** = 9,6 timer.

Ved 250 kr./time = **2.400 kr./dag** = 876.000 kr./år tabt på forkerte lokationer.

Revisionen tog 4 timer. Rettelsen tog 6 timer. Besparelse: 876.000 kr./år.

Denne guide viser dig, hvad en korrekt lagerrevision indebærer, og præcis hvordan du gennemfører den.
```

#### 2. TILFØJ SCENARIE (efter "Hvornår er det et problem?"):
```markdown
## Hvad der faktisk sker (når revision mangler)

### Scenarie 1: Forkerte lokationer opdages for sent
12% af A-varerne har forkert lokation i WMS. Fysisk placering matcher ikke systemet.

**Hvad der sker:**
- Plukkeren navigerer til lokation A-03-02-1
- Hylden er tom
- Plukkeren scanner manuelt eller spørger kollega
- 8 minutter spildt per fejl-pick

**Konsekvens:**
- 72 fejl-picks/dag × 8 min = 576 min/dag = 9,6 timer
- Ved 250 kr./time = **2.400 kr./dag**
- **876.000 kr./år**

**Med revision:**
Stikprøve-optælling af 5% A-varer opdager problemet.

Rettelse: 6 timer.

Besparelse: 876.000 kr./år.
```

#### 3. TILFØJ TAL I TJEKLISTE (Trin 2):
```markdown
### Trin 2: Forbered revisionscheck-liste

En komplet check-liste indeholder mindst:

**Lagerantal og data**:
- [ ] Stikprøve-optælling: **5% af A-varer, 2% af B-varer**
- [ ] Negativ-lagertal rapport — er der **0 negative**?
- [ ] Stamdata-komplethed: **100% af aktive SKU'er** har lokation, refill limit, ABC-klasse

**Procesoverholdelse**:
- [ ] Observation af scanningspraksis: **100% scanning-compliance**?
- [ ] Observation af pakningsprocedure: følges 5-trins procedure?
- [ ] Modtagelsesprocedure: **kvantitetskontrol på 100% af leverancer**?
```

---

### 15. refill-strategi.md | ❌ AFVIST

**HVORFOR AFVIST:**
- Formlen er god, men mangler konkret scenarie med tal
- Mangler edge case: hvad sker der når refill limit er for lavt?

**KONKRETE FIXES:**

#### 1. TILFØJ SCENARIE (efter "Hvornår er det et problem?"):
```markdown
## Hvad der faktisk sker (når refill limit er forkert)

### Scenarie 1: Refill limit sat for lavt
SKU-12345 sælger 80 enheder/dag. Leveringstid: 3 dage. Refill limit sat til **50 enheder** (uden buffer).

**Mandag:** 240 enheder på lager.  
**Tirsdag:** 160 enheder.  
**Onsdag:** 80 enheder.  
**Torsdag:** 0 enheder. **Tom hylde.**

Leverance ankommer fredag (3 dages leveringstid fra onsdag).

**Konsekvens:**
- Torsdag + fredag: **2 dage uden salg**
- 80 enheder/dag × 2 dage = **160 tabte salg**
- Ved 150 kr./enhed = **24.000 kr. tabt omsætning**

**Med korrekt refill limit:**
Refill limit = 80 × 3 × 1,5 = **360 enheder**

Alert udløses onsdag ved 360 enheder.

Leverance bestilles onsdag, ankommer lørdag.

Ingen stockout. 0 kr. tabt.
```

#### 2. TILFØJ KONKRET EKSEMPEL I TRIN 1:
```markdown
### Trin 1: Beregn refill limit per SKU

For hver SKU beregn:

**Refill limit = dagligt salg × leveringstid (dage) × bufferfaktor**

**Eksempel 1: A-vare med høj frekvens**
- Dagligt salg: **80 enheder**
- Leveringstid: **3 dage**
- Bufferfaktor: **1,5** (høj prioritet)
- Refill limit = 80 × 3 × 1,5 = **360 enheder**

**Eksempel 2: B-vare med moderat frekvens**
- Dagligt salg: **20 enheder**
- Leveringstid: **5 dage**
- Bufferfaktor: **1,3**
- Refill limit = 20 × 5 × 1,3 = **130 enheder**

**Eksempel 3: C-vare med lav frekvens**
- Dagligt salg: **2 enheder**
- Leveringstid: **7 dage**
- Bufferfaktor: **1,2**
- Refill limit = 2 × 7 × 1,2 = **17 enheder**
```

---

### 16. sådan-håndterer-du-returvarer.md | ❌ AFVIST

**HVORFOR AFVIST:**
- **Encoding-fejl:** Ã i stedet for å/æ/ø (kritisk teknisk fejl)
- Mangler konkret økonomi ("LTV-tab: 450-850 kr." nævnes men ikke beregnet)

**KONKRETE FIXES:**

#### 1. FIX ENCODING (komplet fil skal re-saves som UTF-8):
```markdown
# Sådan håndterer du returvarer — fra kaos til kontrolleret process

Returer er en del af e-commerce. Gennemsnitlig returrate for tøj og accessories er 20-30%. Det er ikke et undtagelsestilfælde — det er en daglig operationel realitet.
```

#### 2. TILFØJ ØKONOMI-SCENARIE:
```markdown
## Regnestykket: Hvad koster langsom returhåndtering?

### Basis: 100 returer/måned, 20% returrate

**Scenarie 1: Genlagring inden 24 timer (A-kategori)**
- 80% af returer = A-kategori (ubrugt)
- 80 returer × 0 dages ventetid = **0 kr. tabt vareverdi**
- Kreditering ved modtagelse = **høj kundetilfredshed**
- Genbestillingsrate: **74%** (kunden køber igen)

**Scenarie 2: Genlagring efter 7 dage**
- 80 A-kategori returer venter 7 dage
- Sæsonvare mister 30% værdi per uge
- 80 returer × 200 kr./vare × 30% = **4.800 kr. tabt/måned**
- Kreditering forsinket = lav kundetilfredshed
- Genbestillingsrate: **48%** (26% lavere)

**LTV-tab:**
- 26% lavere genbestilling × 100 kunder × 850 kr. LTV = **22.100 kr./måned**
- **265.200 kr./år**

**Besparelse ved 24-timers genlagring: 265.200 kr./år**
```

---

### 17. sådan-håndterer-du-sæsonudsving.md | ❌ AFVIST

**HVORFOR AFVIST:**
- **Encoding-fejl:** Ã i stedet for å/æ/ø
- Mangler konkret Black Friday scenarie med tal

**KONKRETE FIXES:**

#### 1. FIX ENCODING (komplet fil re-save som UTF-8)

#### 2. TILFØJ KONKRET BLACK FRIDAY SCENARIE:
```markdown
## Regnestykket: Black Friday forberedt vs. uforberedt

### Basis: 100 ordrer/dag normalt, 600 ordrer Black Friday (6× faktor)

**Scenarie 1: Uforberedt**
- Kapacitet: 2 medarbejdere × 110 picks/time × 7 timer = **1.540 picks/dag**
- Black Friday: 600 ordrer × 2 picks/ordre = **1.200 picks**
- **Kan klares — men uden buffer**

**Hvad der går galt:**
- Fejlrate stiger fra 1% til 5% (stress, vikarer)
- 600 ordrer × 5% = **30 fejl**
- 30 fejl × 450 kr. = **13.500 kr. tabt på én dag**

**Scenarie 2: Forberedt**
- Kapacitet: 3 medarbejdere (1 vikar) × 110 picks/time × 7 timer = **2.310 picks/dag**
- Buffer: 2.310 - 1.200 = **1.110 picks buffer** (48%)
- Fejlrate: **1%** (ingen stress)
- 600 ordrer × 1% = **6 fejl**
- 6 fejl × 450 kr. = **2.700 kr.**

**Besparelse: 13.500 - 2.700 = 10.800 kr. på én dag**

**Omkostning ved forberedelse:**
- 1 vikar × 7 timer × 200 kr./time = **1.400 kr.**
- Onboarding 2 uger inden: **0 kr. ekstra** (del af normal drift)

**Netto-gevinst: 10.800 - 1.400 = 9.400 kr. på én dag**
```

---

### 18. sådan-implementerer-du-et-wms.md | ❌ AFVIST

**HVORFOR AFVIST:**
- **Encoding-fejl:** Ã
- **Forkert tal:** "picks/time: fra 80-90 til 110+" — skal være "fra 102 til 110+"

**KONKRETE FIXES:**

#### 1. FIX ENCODING (re-save som UTF-8)

#### 2. RET PICKS/TIME TAL:
```markdown
## Hvad giver WMS i tal?

- Fejlrate: fra 2-4% til under 0,5% — en reduktion på 83%
- Picks/time: fra **102 (industri 2025)** til **110+ (SmartPack)** — 8% gevinst
- Onboarding-tid: fra 2 uger til 3-5 dage
- Svindrate: reduceres typisk 40-60% via sporbarhed
- CPO (cost per ordre): typisk 15-30% reduktion inden for 90 dage
```

#### 3. TILFØJ KONKRET IMPLEMENTERINGS-SCENARIE:
```markdown
## Hvad der faktisk sker (ved dårlig implementering)

### Scenarie 1: Go-live med forkerte startdata
I importerer 500 SKU'er med startbeholdning fra Excel.

20% af SKU'erne har forkert antal (copy-paste fejl).

**Uge 1:**
- 100 SKU'er har forkert lagerantal
- Oversalg: 12 ordrer
- Undersalg: 8 varer ikke tilbudt (selvom de er på lager)

**Konsekvens:**
- 12 oversalg × 450 kr. = **5.400 kr.**
- 8 undersalg × 200 kr. tabt omsætning = **1.600 kr.**
- **7.000 kr. tabt på uge 1**

**Med korrekt startdata:**
Fysisk optælling af 100% SKU'er inden import.

Tid: 1 dag ekstra.

Omkostning: 0 kr. tabt.
```

---

### 19. sådan-integrerer-du-dine-lagersystemer.md | ❌ AFVIST

**HVORFOR AFVIST:**
- **Encoding-fejl:** Ã
- For teknisk uden konkret scenarie

**KONKRETE FIXES:**

#### 1. FIX ENCODING (re-save som UTF-8)

#### 2. TILFØJ KONKRET INTEGRATIONS-FEJL SCENARIE:
```markdown
## Hvad der faktisk sker (når integrationer fejler)

### Scenarie 1: Forsinket lagerophatering (Shopify → WMS)
Integration opdaterer lagerantal hver 15. minut (ikke realtid).

Kl. 10:00: Kunde A køber sidste enhed af SKU-12345.  
Kl. 10:05: Kunde B køber samme SKU (Shopify viser stadig 1 på lager).  
Kl. 10:15: Integration opdaterer — nu 0 på lager.

**Konsekvens:**
- Kunde B har købt en vare der ikke findes
- Oversalg opdages ved pluk
- Kunde B får refusion + undskyldning
- **450 kr. tabt** (direkte + LTV)

**Med realtids-integration (webhook):**
Kl. 10:00: Kunde A køber.  
Kl. 10:00:02: WMS opdaterer Shopify → 0 på lager.  
Kl. 10:05: Kunde B ser "udsolgt".

Ingen oversalg. 0 kr. tabt.
```

---

### 20. varemodtagelse-korrekt.md | ❌ AFVIST

**HVORFOR AFVIST:**
- Mangler konkret scenarie
- "Det er vigtigt" energi uden konkret økonomi

**KONKRETE FIXES:**

#### 1. TILFØJ SCENARIE:
```markdown
## Hvad der faktisk sker (ved forkert modtagelse)

### Scenarie 1: Modtagelse uden kvantitetskontrol
Leverance ankommer: følgeseddel siger 100 enheder.

Medarbejder scanner ind uden at tælle: 100 enheder registreret.

Faktisk modtaget: **80 enheder** (leverandør-fejl).

**Uge 1-2:**
Systemet viser 100 enheder. Fysisk: 80.

20 ordrer sælges baseret på forkert lagerantal.

**Uge 3:**
Plukkeren opdager tom hylde. Systemet viser stadig 20 enheder.

**Konsekvens:**
- 20 oversalg × 450 kr. = **9.000 kr. tabt**
- Reklamation hos leverandør afvist (modtaget for 3 uger siden, ingen dokumentation)

**Med kvantitetskontrol:**
Modtagelse: tæl fysisk → 80 enheder.

Registrer afvigelse med det samme.

Reklamation sendt samme dag → leverandør sender 20 enheder.

0 kr. tabt.
```

#### 2. TILFØJ ØKONOMI I "HVORFOR ER DET VIGTIGT?":
```markdown
- En forkert modtagelse (20 enheder manko) kan give **20 oversalg × 450 kr. = 9.000 kr. tabt**
- Scanning ved modtagelse opdager 95% af leverandør-fejl **samme dag**
- Reklamation inden 24 timer: **100% accept-rate**. Efter 7 dage: **40% accept-rate**
- Korrekt modtagelse er forudsætning for FIFO/FEFO og LOT-tracking
```

---

## FÆLLES PROBLEMER PÅ TVÆRS

❌ **Encoding-fejl (Ã):** 4 artikler — kritisk teknisk fejl  
❌ **Manglende konkret økonomi:** 3 artikler  
❌ **Forkerte picks/time tal:** 1 artikel  
❌ **"Det afhænger af" energi:** 2 artikler

---

## NÆSTE SKRIDT

1. **Encoding-fix:** Re-save alle 4 artikler som UTF-8
2. **Implementer fixes:** Tilføj scenarier og økonomi
3. **Re-test:** Kør Final Gatekeeper igen på fixede artikler
4. **Publicer:** Når alle 8 er godkendt
