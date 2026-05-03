# AFVISTE ARTIKLER – 02-Problemer

**Batch rapport:** 19/25 afvist (76%)

**Primære afvisningsårsager:**
1. Manglende konkrete kr.-tal i intro (12 artikler)
2. Generisk "det er vigtigt"-sprog uden edge cases (8 artikler)
3. Ingen "det går galt"-scenarier (7 artikler)

---

## ❌ AFVIST: afhængighed-af-nøglemedarbejdere.md

### HVORFOR
- **Test 1 FEJL:** Intro er generisk. "Når én person ved alt" – hvem? Hvilket lager? Hvor mange ordrer?
- **Test 3 FEJL:** Mangler konkret økonomi. Hvad koster det PRÆCIS når nøglepersonen siger op?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis dokumentation ikke hjælper fordi processen ER personen?

### KONKRETE FIXES

**NY INTRO (komplet):**
```markdown
Din bedste plukker siger op. Hun kendte lageret udenad, kunne finde enhver vare på 8 sekunder og plukkede 127 linjer/time – 25% over teamgennemsnittet. Hendes afløser bruger 4 uger på at nå 70% af hendes niveau. I mellemtiden: 18 fejlordrer, 6 kundeservice-eskalationer, 1 negativ Trustpilot-anmeldelse der koster 3 konverteringer = 12.000 kr. i tabt omsætning.

Det er ikke et personaleproblem. Det er et systemproblem. Denne artikel viser præcis hvad det koster – og hvordan du bygger et lager der overlever når nøglepersoner forsvinder.
```

**MANGLENDE ØKONOMI (komplet):**
Tilføj efter "Hvorfor det er vigtigt":
```markdown
## Regnestykket: Hvad koster nøglemedarbejder-afhængighed?

**Scenarie: Webshop ved 280 ordrer/dag, 1 nøgleplukker**

**Uge 1 (nøgleperson syg):**
- Afløser plukker 68 linjer/time (vs. 102 normal)
- Ekstra tid: 280 ordrer × 2,2 linjer × (1/68 - 1/102) timer = 3,2 timer/dag
- Cost: 3,2 timer × 200 kr. × 5 dage = **3.200 kr.**
- Fejlrate stiger fra 0,8% til 2,1% = 2,8 fejl/dag × 450 kr. = **6.300 kr.**

**Måned 3 (nøgleperson siger op):**
- Rekruttering: 40.000 kr.
- Onboarding 4 uger (50% produktivitet): 4 uger × 5 dage × 3,2 timer × 200 kr. = **12.800 kr.**
- Tabt: **59.100 kr.**

**Med WMS + dokumentation:**
- Onboarding: 1,5 uge til fuld produktivitet
- Cost: 18.000 kr.
- **Forskel: 41.100 kr. spart**
```

**MANGLENDE EDGE CASE:**
Tilføj under "Det opdager de fleste for sent":
```markdown
### Edge case: Når dokumentation ikke er nok

Webshop dokumenterer alt. 47 siders manual. Nøgleperson siger op. Afløser læser manualen.

Problemet: Nøglepersonen løste 80% af problemerne via "mavefornemmelse" – ikke dokumenterede regler. Hvilke varer der kan ligge sammen. Hvilke kunder der altid reklamerer. Hvilke SKU'er der ofte forveksles.

Det står ikke i manualen. Det KAN ikke stå i manualen.

**Løsning:** WMS med scanning eliminerer "mavefornemmelse"-behovet. Systemet stopper forkerte pluk. Systemet markerer problematiske SKU'er. Systemet guider – ikke personen.
```

---

## ❌ AFVIST: dårlig-onboarding-af-medarbejdere.md

### HVORFOR
- **Test 1 FEJL:** "Nye medarbejdere er ikke produktive" – hvor lang tid? Hvilket lager? Hvad er benchmark?
- **Test 3 FEJL:** "30.000-50.000 kr. per medarbejder" – men hvad er alternativet? Hvad koster HURTIG onboarding?
- **Test 5 FEJL:** Ingen handling. Artiklen siger "lav onboarding-program" – men HVORDAN?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Din nye plukker starter mandag. Onsdag har hun lavet 3 kritiske fejl, sendt forkert vare til 2 kunder og brugt 40 minutter på at finde en SKU der stod 6 meter fra hende. Fredag spørger hun: "Hvor er toilettet?"

Det er ikke hendes skyld. Det er jeres onboarding.

En ny medarbejder der når fuld produktivitet på 1,5 uge koster jer 18.000 kr. i tabt kapacitet. En der bruger 4 uger koster 52.000 kr. – plus fejlomkostninger. Ved 43% annual turnover i lagerbranchen gentager I det her hvert 14. måned.

Denne artikel viser præcis hvordan I bygger en onboarding der virker fra dag 1.
```

**MANGLENDE HANDLING (komplet):**
Tilføj ny sektion "Dag-for-dag onboarding-plan":
```markdown
## Dag-for-dag onboarding der virker

### Dag 1 (4 timer)
- **09:00-09:30:** Rundvisning. Toilet, kantine, nødudgange, pakkestation.
- **09:30-10:00:** Systemadgang. Login, scanner, WMS-interface.
- **10:00-11:30:** Shadow erfaren plukker. Observer 15 ordrer.
- **11:30-12:00:** Frokost + Q&A.
- **12:00-13:00:** Pluk 5 ordrer selv med supervisor ved siden.

### Dag 2-3 (fuld dag)
- Pluk solo med scanning-validering.
- Mål: 60% af normal picks/time (61 picks/time hvis benchmark er 102).
- Supervisor tjekker hver 2. time.

### Dag 4-7
- Fuld produktion.
- Mål: 85% af normal picks/time (87 picks/time).
- Daglig 10-minutters check-in.

### Dag 8-10
- Fuld produktivitet forventet (102 picks/time).
- Ugentlig check-in.

**Kritisk:** Med WMS-guidet pluk er dag 8-10 realistisk. Uden WMS tager det 3-4 uger.
```

---

## ❌ AFVIST: excel-bryder-sammen.md

### HVORFOR
- **Test 2 FEJL:** "Excel er ikke skalerbart" – men HVORNÅR præcis? Ved 50 ordrer? 100? 200?
- **Test 3 FEJL:** Mangler konkret kr.-tab. Hvad koster Excel-fejl?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis Excel faktisk virker fint ved 150 ordrer?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Du åbner Excel-arket. 340 rækker. Kolonne A: SKU. Kolonne B: Lokation. Kolonne C: Antal. Kolonne D: ... vent, hvad er kolonne D? Og hvorfor viser den 47 enheder når systemet siger 52?

Du bruger 18 minutter på at finde fejlen. Det var en manuel indtastning fra tirsdag. Medarbejder 2 opdaterede ikke arket efter pluk. Nu er 3 ordrer sendt med forkert antal.

Cost: 3 × 450 kr. = 1.350 kr. Tid spildt: 18 minutter × 200 kr./time = 60 kr. Total: 1.410 kr. på én fejl.

Ved 200 ordrer/dag sker det her 2-3 gange om ugen. Det er 293.000 kr./år i Excel-fejl.
```

**MANGLENDE BREAKPOINT (komplet):**
Tilføj ny sektion:
```markdown
## Præcise breakpoints: Hvornår Excel knækker

### Under 30 ordrer/dag + under 100 SKU'er
**Excel virker fint.**
- 1 person kender lageret
- Manuel opdatering er hurtig
- Fejlrate acceptabel (under 1%)

### 30-80 ordrer/dag + 100-300 SKU'er
**Excel begynder at fejle.**
- 2+ personer opdaterer samme ark
- Race conditions (to opdaterer samtidig)
- Fejlrate stiger til 1,5-2,5%
- **Cost: 85.000-180.000 kr./år i fejl**

### Over 80 ordrer/dag + over 300 SKU'er
**Excel er aktivt farligt.**
- Beholdningsdata er aldrig korrekt
- Oversalg sker ugentligt
- Fejlrate over 3%
- **Cost: 400.000+ kr./år**

**Konklusion:** Skift til WMS senest ved 80 ordrer/dag. Helst ved 50.
```

---

## ❌ AFVIST: forkert-vareplacering.md

### HVORFOR
- **Test 1 FEJL:** Intro mangler "shit det er os"-moment
- **Test 2 FEJL:** "A-varer skal placeres rigtigt" – men HVOR mange meter spares?
- **Test 6 FEJL:** Fuld af "det er vigtigt at" og "virksomheder bør"

### KONKRETE FIXES

**NY INTRO:**
```markdown
Din plukker går 42 meter for at hente din bestseller. 180 gange om dagen. Det er 7,5 km dagligt – kun for ÉN vare.

Flyt den vare 6 meter tættere på pakkestationen. Spar 36 meter × 180 = 6,5 km/dag. En plukker går 4,5 km/h. Det er 1,4 timer sparet dagligt = 280 kr./dag = 70.000 kr./år.

Det tog 12 minutter at flytte varen.

Denne artikel viser hvilke 20 varer du skal flytte – og hvor meget du sparer på hver.
```

**FJERN KONSULENT-SPROG:**
Før:
> "Det er vigtigt at virksomheder analyserer deres vareplacering og sikrer at A-varer placeres optimalt."

Efter:
> "Lav ABC-analyse i dag. Flyt de 20 mest solgte varer i morgen. Mål besparelsen på fredag."

---

## ❌ AFVIST: ingen-scanning.md

### HVORFOR
- **Test 3 FEJL:** "Scanning reducerer fejl" – men fra HVAD til HVAD?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis scanning faktisk SÆNKER hastigheden?
- **Test 5 FEJL:** "Implementer scanning" – men HVORDAN dag 1?

### KONKRETE FIXES

**MANGLENDE TAL:**
Tilføj efter intro:
```markdown
## Regnestykket: Scanning vs. ingen scanning

**200 ordrer/dag, uden scanning:**
- Fejlrate: 2,8%
- Fejl/dag: 5,6 × 450 kr. = 2.520 kr.
- Fejl/år: 630.000 kr.

**200 ordrer/dag, med scanning:**
- Fejlrate: 0,6%
- Fejl/dag: 1,2 × 450 kr. = 540 kr.
- Fejl/år: 135.000 kr.

**Besparelse: 495.000 kr./år**

**Investering:**
- 5 håndscannere: 25.000 kr.
- WMS med scanning: 60.000 kr./år
- **Total år 1: 85.000 kr.**

**ROI: 62 dage**
```

**EDGE CASE:**
```markdown
### Hvad hvis scanning sænker hastigheden?

Det gør den – de første 3 dage.

Dag 1-3: Plukker scanner langsomt. Picks/time falder fra 102 til 78 (24% drop).
Dag 4-7: Plukker vænner sig til. Picks/time: 95.
Dag 8+: Plukker er hurtigere end før. Picks/time: 108.

**Hvorfor hurtigere?**
Ingen tid spildt på at lede efter forkerte varer. Ingen tid på at rette fejl. Systemet guider – plukker følger.

**Netto efter 2 uger: +6% hastighed + 78% færre fejl.**
```

---

## ❌ AFVIST: lager-er-rodet.md

### HVORFOR
- **Test 1 FEJL:** "Rodet lager koster tid" – HVOR meget tid? Hvad er forskellen?
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 5 FEJL:** "Ryd op" er ikke en handling. HVORDAN rydder man op dag 1?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Din plukker står med en ordre. SKU: TS-BLÅ-M. Systemet siger: "Hylde A3". Han går til A3. Der er 6 kasser. Ingen labels. Han åbner kasse 1: TS-RØD-L. Kasse 2: TS-GRØN-S. Kasse 3: TS-BLÅ-M. Fundet.

Tid brugt: 2,5 minutter. Skulle tage 15 sekunder.

180 ordrer/dag × 2,5 linjer/ordre = 450 pluk. Hvis 40% kræver "lede-tid" på 2 minutter ekstra:
180 pluk × 2 min = 360 minutter = 6 timer spildt dagligt = 1.200 kr./dag = 300.000 kr./år.

Det er prisen for rod.
```

**HANDLING DAG 1:**
```markdown
## Oprydningsplan: Uge 1

### Dag 1 (4 timer)
- Identificer de 50 mest solgte SKU'er (A-varer)
- Tildel hver en FAST lokation (A1-01, A1-02, osv.)
- Print labels
- Placer varer

### Dag 2-3
- Resten af sortiment får faste lokationer
- Opdater system (Excel/WMS)
- Fjern alt uden fast plads

### Dag 4-5
- Test: Kan enhver medarbejder finde enhver vare på under 30 sekunder?
- Hvis nej: juster labels og placering

**Kritisk:** Lav IKKE fuld oprydning på én gang. Start med A-varer – det giver 80% af gevinsten.
```

---

## ❌ AFVIST: manglende-processer.md

### HVORFOR
- **Test 2 FEJL:** Kunne handle om ethvert lager. Intet konkret.
- **Test 5 FEJL:** "Lav processer" – men HVILKE processer dag 1?
- **Test 6 FEJL:** Fuld af "virksomheder bør" og "det er vigtigt"

### KONKRETE FIXES

**NY INTRO:**
```markdown
Ny medarbejder starter. Du siger: "Pluk de ordrer der står på listen."

Han spørger: "Hvilken rækkefølge?"
Du: "Ligemeget."

Han spørger: "Hvad hvis varen ikke er der?"
Du: "Spørg mig."

Han spørger: "Scanner jeg?"
Du: "Hvis du vil."

Dag 3: Han har lavet 4 fejl. Det er ikke hans skyld. I har ingen processer.

Cost: 4 fejl × 450 kr. = 1.800 kr. på 3 dage. Ved 43% turnover gentager I det her hver 14. måned.
```

**HVILKE PROCESSER DAG 1:**
```markdown
## De 5 kritiske processer (prioriteret)

### 1. Plukproces (implementer DAG 1)
**Uden proces:**
- Plukker vælger selv rækkefølge
- Ingen scanning
- Fejlrate: 2,8%

**Med proces:**
1. Modtag plukliste fra WMS (sorteret efter lokation)
2. Scan hver vare
3. Systemet bekræfter korrekt vare
4. Placer i tote med ordrenummer
5. Afslut batch ved pakkestation

**Resultat:** Fejlrate 0,6%. Picks/time +25%.

### 2. Modtagelsesproces (implementer UGE 1)
### 3. Returproces (implementer UGE 2)
### 4. Cycle counting (implementer UGE 3)
### 5. Fejlhåndtering (implementer UGE 4)

**Kritisk:** Lav IKKE alle processer på én gang. Én proces per uge.
```

---

## ❌ AFVIST: returproces-er-kaos.md

### HVORFOR
- **Test 3 FEJL:** "$20-30 per retur" – men hvad er det i DKK? Og hvad er alternativet?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis returvare er beskadiget – hvem beslutter?
- **Test 5 FEJL:** "Lav returprocedure" – men HVAD skal der stå i den?

### KONKRETE FIXES

**MANGLENDE ØKONOMI:**
```markdown
## Regnestykket: Kaotisk vs. systematisk returhåndtering

**200 returner/måned, kaotisk:**
- Gennemsnitlig tid fra modtagelse til genindlæst: 72 timer
- Kapital bundet i returvarer: 200 × 400 kr. × 3 dage = 240.000 kr. bundet
- Renteomkostning (15% p.a.): 240.000 × 0,15 / 12 = 3.000 kr./måned
- Fejl (forkert genindlæsning): 8% × 200 × 180 kr. = 2.880 kr./måned
- **Total: 5.880 kr./måned = 70.560 kr./år**

**200 returner/måned, systematisk:**
- Gennemsnitlig tid: 12 timer
- Kapital bundet: 200 × 400 kr. × 0,5 dag = 40.000 kr.
- Renteomkostning: 500 kr./måned
- Fejl: 1% × 200 × 180 kr. = 360 kr./måned
- **Total: 860 kr./måned = 10.320 kr./år**

**Besparelse: 60.240 kr./år**
```

**EDGE CASE:**
```markdown
### Hvad hvis returvare er beskadiget?

**Uden procedure:**
Medarbejder er usikker. Lægger varen i "måske"-bunken. 3 uger senere: Varen er stadig der. Kasseres.

**Med procedure:**
**Tilstandsvurdering (3 kategorier):**
- **A (salgbar ny):** Uåbnet emballage, ingen skader → Genindlæs til fuld pris
- **B (salgbar med note):** Åbnet, men funktionel → Genindlæs til 70% pris eller outlet
- **C (kassering):** Beskadiget, mangler dele → Kassér, registrer svind

**Beslutning tages af:** Supervisor (ikke plukker)
**Tid:** Max 2 minutter per vare
**Resultat:** Ingen "måske"-bunke. Alt håndteres samme dag.
```

---

## ❌ AFVIST: shopify-er-ikke-nok.md

### HVORFOR
- **Test 1 FEJL:** "Shopify er ikke et WMS" – men HVORNÅR præcis er det et problem?
- **Test 3 FEJL:** Tal er der, men mangler sammenligning. Hvad koster Shopify-fejl vs. WMS?
- **Test 7 FEJL:** Ingen SmartPack-differentiering. Hvornår giver SmartPack mening vs. IKKE?

### KONKRETE FIXES

**MANGLENDE BREAKPOINT:**
```markdown
## Præcise breakpoints: Hvornår Shopify knækker

### Under 30 ordrer/dag
**Shopify er fint.**
- Lagerstyring i Shopify admin
- Manuel opdatering acceptabel
- Oversalg sjældent

### 30-80 ordrer/dag
**Shopify begynder at fejle.**
- Forsinkelse i lageropdate ring ved høj trafik
- Oversalg 1-2 gange/måned
- **Cost: 2 × 450 kr. × 12 = 10.800 kr./år**

### Over 80 ordrer/dag
**Shopify er aktivt farligt.**
- Oversalg ugentligt under kampagner
- Ingen lokationsstyring
- Plukfejl 2-3%
- **Cost: 280.000+ kr./år**

**Konklusion:** Implementer WMS senest ved 80 ordrer/dag.
```

**SMARTPACK JA/NEJ:**
```markdown
## SmartPack: Hvornår JA, hvornår NEJ

**JA til SmartPack hvis:**
- Over 50 ordrer/dag + Shopify som webshop → Integration inkluderet, oversalg elimineres
- Planlægger Black Friday → 6× volumen kræver WMS, ikke Shopify-apps
- Fejlrate over 1,5% → Scanning reducerer til 0,6%

**NEJ til SmartPack hvis:**
- Under 30 ordrer/dag + simpelt sortiment → Shopify er billigere
- Bruger Shopify POS + fysisk butik primært → Shopify-økosystem er nok

**Konkret kr.-konsekvens:**
| Scenarie | Shopify alene | Shopify + SmartPack | Forskel |
|----------|---------------|---------------------|----------|
| 200 ordrer/dag, 3% fejl | 270.000 kr./år fejl | 45.000 kr./år fejl | **225.000 kr. spart** |
| Black Friday (1.200 ordrer) | 15-30 oversalg = 13.500 kr. | 0 oversalg | **13.500 kr. spart** |
```

---

## ❌ AFVIST: vi-ansætter-for-hurtigt.md

### HVORFOR
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 3 FEJL:** "Optimer før du ansætter" – men HVAD optimerer man?
- **Test 5 FEJL:** Ingen handling. Hvad gør man DAG 1 hvis man allerede har ansat for mange?

### KONKRETE FIXES

**NY INTRO:**
```markdown
I har 9 plukkere. I håndterer 500 ordrer/dag. Cost per order: 67 kr.

Jeres konkurrent har 6 plukkere. De håndterer 680 ordrer/dag. Cost per order: 22 kr.

Forskellen: De har WMS. I har ikke.

I betaler 3 ekstra plukkere × 35.000 kr./md = 105.000 kr./md = 1.260.000 kr./år for at kompensere for manglende procesoptimering.

Denne artikel viser hvad I skal optimere FØR I ansætter den næste.
```

**HVAD OPTIMERER MAN:**
```markdown
## Optimeringshierarki (før ansættelse)

### 1. ABC-placering (implementer DAG 1)
**Før:** A-varer spredt tilfældigt
**Efter:** A-varer 0-15m fra pakkestation
**Gevinst:** +15-25% picks/time = 0,8 FTE spart
**Cost:** 0 kr. (flyt varer i weekend)

### 2. Batch picking (implementer UGE 1)
**Før:** 1 ordre ad gangen
**Efter:** 8-16 ordrer per tur
**Gevinst:** +30-40% picks/time = 1,2 FTE spart
**Cost:** 0 kr. (proces-ændring)

### 3. WMS med optimerede ruter (implementer UGE 2-4)
**Før:** Manuel rutevalg
**Efter:** TSP-algoritmer
**Gevinst:** +10-20% picks/time = 0,6 FTE spart
**Cost:** 60.000 kr./år (SmartPack)

**Total gevinst: 2,6 FTE spart = 1.092.000 kr./år**

**Hvis du ansætter i stedet: 1.092.000 kr./år spildt**
```

---

## ❌ AFVIST: vi-bruger-for-meget-tid-på-pluk.md

### HVORFOR
- **Test 1 FEJL:** Encoding-fejl (Ã¥ i stedet for å) – teknisk problem
- **Test 2 FEJL:** "Pluk er dyrt" – men HVOR dyrt sammenlignet med hvad?
- **Test 5 FEJL:** "Implementer batch picking" – men HVORDAN dag 1?

### KONKRETE FIXES

**FIX ENCODING FØRST** (kritisk teknisk fejl)

**MANGLENDE SAMMENLIGNING:**
```markdown
## Regnestykket: Ineffektiv vs. effektiv pluk

**300 ordrer/dag, ineffektiv pluk:**
- Picks/time: 64
- 300 ordrer × 2,5 linjer = 750 picks
- 750 / 64 = 11,7 timer nødvendig
- 11,7 / 7,4 timer/dag = 1,6 plukkere
- **Rundet op: 2 plukkere**

**300 ordrer/dag, effektiv pluk:**
- Picks/time: 110 (SmartPack)
- 750 picks / 110 = 6,8 timer
- 6,8 / 7,4 = 0,9 plukkere
- **Rundet op: 1 plukker**

**Forskel: 1 FTE = 420.000 kr./år**
```

**BATCH PICKING DAG 1:**
```markdown
## Implementer batch picking: Dag 1-guide

### Dag 1 morgen (2 timer)
1. Identificer 10 ordrer med geografisk overlap (samme zone)
2. Print samlet plukliste (sorteret efter lokation)
3. Hent 10 totes (kasser med ordrenummer)
4. Pluk alle varer i én tur
5. Sorter ved pakkestation

### Dag 1 eftermiddag
- Gentag med 12 ordrer
- Mål tid: Hvor lang tid tog 12 ordrer vs. 12 separate ture?

### Dag 2-5
- Optimer batchstørrelse (test 8, 12, 16 ordrer)
- Find sweet spot (typisk 10-14 for de fleste)

**Kritisk:** Start UDEN WMS. Lav manuel batch. Mål gevinst. Implementer WMS bagefter.
```

---

## ❌ AFVIST: vi-løber-tør-for-varer.md

### HVORFOR
- **Test 3 FEJL:** "Refill limit = dagligt salg × leveringstid × buffer" – men hvad er buffer-faktoren?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis leverandør lover 3 dage men leverer 7?
- **Test 5 FEJL:** "Definer refill limit" – men HVORDAN beregner man det dag 1?

### KONKRETE FIXES

**MANGLENDE BUFFER-FORKLARING:**
```markdown
## Refill limit: Komplet beregning

**Formel:**
Refill limit = Dagligt salg × Leveringstid (dage) × Buffer-faktor

**Buffer-faktor:**
- 1,2 = Pålidelig leverandør (leverer til tiden 95%+)
- 1,5 = Normal leverandør (leverer til tiden 80-90%)
- 2,0 = Upålidelig leverandør (leverer til tiden under 80%)

**Eksempel:**
SKU: TS-BLÅ-M
- Dagligt salg: 12 stk.
- Leveringstid: 5 dage
- Leverandør: Normal (buffer 1,5)

Refill limit = 12 × 5 × 1,5 = **90 stk.**

**Handling:** Når beholdning falder til 90 stk., bestil ny batch.
```

**EDGE CASE:**
```markdown
### Hvad hvis leverandør ALDRIG leverer til tiden?

**Scenarie:**
Leverandør lover 5 dage. Leverer konsistent 8-10 dage.

Du sætter buffer til 2,0. Refill limit = 12 × 5 × 2,0 = 120 stk.

Men leverandør leverer 10 dage. Du løber stadig tør.

**Løsning:**
Brug FAKTISK leveringstid (ikke lovet):
- Gennemsnit sidste 6 leveringer: 9 dage
- Refill limit = 12 × 9 × 1,5 = **162 stk.**

**Alternativ:** Skift leverandør. En leverandør der konsistent fejler er en risiko.
```

---

## ❌ AFVIST: vores-data-er-rod.md

### HVORFOR
- **Test 1 FEJL:** "43% tracker ikke inventory korrekt" – men hvad er konsekvensen?
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 5 FEJL:** "Lav dataoprydning" – men HVAD rydder man op i dag 1?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Dit system viser 47 enheder af SKU TS-BLÅ-M. Plukker går til hylden. Der er 31.

Du sælger 16 enheder du ikke har. 16 kunder får "beklager, udsolgt". 16 refunderinger. 16 × 680 kr. gennemsnitsordre = 10.880 kr. tabt omsætning.

Og 4 af dem skriver aldrig til jer igen. 4 × 2.400 kr. LTV = 9.600 kr. tabt.

**Total cost af ÉN forkert beholdning: 20.480 kr.**

Ved 200 SKU'er og 5% data-fejlrate sker det her 10 gange/måned = 204.800 kr./år.

Dette er prisen for rod i data.
```

**OPRYDNING DAG 1:**
```markdown
## Dataoprydning: Uge 1-plan

### Dag 1 (4 timer)
**Fokus: A-varer (20% af SKU'er, 80% af salg)**

1. Identificer 50 mest solgte SKU'er
2. Fysisk optælling af hver
3. Sammenlign med system
4. Ret afvigelser

**Forventet:** 15-25% afvigelser på første optælling

### Dag 2-3
**Fokus: B-varer**
- Samme proces
- Forventet: 10-15% afvigelser

### Dag 4-5
**Fokus: C-varer**
- Samme proces
- Forventet: 5-10% afvigelser

**Resultat efter uge 1:**
- Inventory accuracy fra 85% til 98%+
- Oversalg elimineret
- 204.800 kr./år spart

**Kritisk:** Lav IKKE alt på én gang. Start med A-varer – det giver 80% af gevinsten.
```

---

## ❌ AFVIST: manglende-kapacitet.md

### HVORFOR
- **Test 1 FEJL:** "Kapacitet er et problem" – men HVORNÅR præcis?
- **Test 3 FEJL:** Mangler konkret økonomi. Hvad koster manglende kapacitet?
- **Test 5 FEJL:** "Udvid kapacitet" – men HVORDAN dag 1 uden at ansætte?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Det er tirsdag. I har 420 ordrer i systemet. Jeres kapacitet: 400 ordrer/dag.

I klarer det – med 3 timers overtid. Cost: 3 timer × 3 plukkere × 300 kr. = 2.700 kr.

Onsdag: 440 ordrer. 5 timers overtid. Cost: 4.500 kr.

Torsdag: 1 plukker sygemeldt (udbrændt). Kapacitet falder til 280 ordrer/dag. Backlog: 160 ordrer.

Fredag: Backlog 320 ordrer. I stopper kampagnen. Tabt omsætning: 320 × 680 kr. = 217.600 kr.

**Total cost af 1 uge over kapacitet: 224.800 kr.**

Dette er prisen for ikke at kende din kapacitetsgrænse.
```

**UDVID KAPACITET UDEN ANSÆTTELSE:**
```markdown
## Kapacitetsudvidelse: 3 metoder (ingen ansættelse)

### Metode 1: ABC-placering (implementer DAG 1)
**Før:** A-varer spredt
**Efter:** A-varer 0-15m fra pakkestation
**Gevinst:** +20% kapacitet (400 → 480 ordrer/dag)
**Cost:** 0 kr.
**Tid:** 1 weekend

### Metode 2: Batch picking (implementer UGE 1)
**Før:** 1 ordre ad gangen
**Efter:** 10-14 ordrer per tur
**Gevinst:** +35% kapacitet (480 → 648 ordrer/dag)
**Cost:** 0 kr.
**Tid:** 1 uge

### Metode 3: WMS med optimerede ruter (implementer UGE 2-4)
**Før:** Manuel rutevalg
**Efter:** TSP-algoritmer
**Gevinst:** +15% kapacitet (648 → 745 ordrer/dag)
**Cost:** 60.000 kr./år
**Tid:** 2-4 uger

**Total gevinst: 400 → 745 ordrer/dag (+86%) uden ansættelse**
```

---

## ❌ AFVIST: manglende-prioritering.md

### HVORFOR
- **Test 1 FEJL:** "Prioritering er vigtigt" – men HVAD sker der hvis man ikke prioriterer?
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 5 FEJL:** "Lav prioritering" – men HVILKE ordrer prioriteres HVORDAN?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Kl. 14:00: Premiumkunde (abonnement, 12.000 kr./år LTV) bestiller. Skal sendes samme dag for at nå levering i morgen.

Kl. 14:30: Standardkunde (første ordre, 680 kr.) bestiller.

Jeres plukker tager dem i rækkefølge de kom ind. Standardkunde plukkes først. Premiumkunde plukkes kl. 15:45. Cutoff var 15:30.

Premiumkunde får levering 1 dag forsinket. Ringer og klager. Opsiger abonnement.

**Cost: 12.000 kr. LTV tabt fordi I ikke prioriterede.**

Ved 5% af premiumkunder der oplever dette = 60.000 kr./år tabt.
```

**PRIORITERINGSMATRIX:**
```markdown
## Prioriteringsmatrix: Hvilke ordrer først?

### Prioritet 1 (pluk FØRST)
- Premiumfragt (betalt ekstra for hurtig levering)
- Abonnementskunder (høj LTV)
- B2B-kontrakter (store ordrer, faste kunder)
- Ordrer tæt på cutoff

### Prioritet 2 (pluk NORMAL)
- Standardordrer inden for normal leveringstid
- Første-gangs-kunder (vigtige for LTV)

### Prioritet 3 (pluk SIDST)
- Ordrer med lang leveringstid
- Gratis fragt (ingen hastelevering)

**Implementering:**
WMS tildeler automatisk prioritet baseret på:
1. Kundetype (premium/standard)
2. Fragtype (express/normal)
3. Ordretidspunkt (cutoff-afstand)

**Resultat:** Premiumkunder får ALTID levering til tiden. LTV-tab elimineres.
```

---

## ❌ AFVIST: manglende-realtidsdata.md

### HVORFOR
- **Test 1 FEJL:** "Realtidsdata er vigtigt" – men HVAD sker der uden det?
- **Test 3 FEJL:** Mangler konkret økonomi. Hvad koster forsinket data?
- **Test 5 FEJL:** "Få realtidsdata" – men HVORDAN dag 1?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Kl. 10:00: Kunde bestiller SKU TS-BLÅ-M. Webshop viser "på lager".

Kl. 10:15: Plukker opdager: Varen er udsolgt. Sidste enhed blev plukket kl. 09:45. Systemet opdaterede ikke.

Kl. 10:30: Kundeservice ringer til kunde. "Beklager, udsolgt. Refunderer."

Kunde: "Men det stod på lager!" Skriver 1-stjernet anmeldelse.

**Cost:**
- Tabt ordre: 680 kr.
- Kundeservice-tid: 15 min × 250 kr./time = 62 kr.
- Negativ anmeldelse: 3 tabte konverteringer × 680 kr. = 2.040 kr.
- **Total: 2.782 kr.**

Ved 8 oversalg/måned = 267.000 kr./år.

Dette er prisen for forsinket data.
```

**REALTIDSDATA DAG 1:**
```markdown
## Implementer realtidsdata: Uge 1

### Dag 1-2: Webhook-integration
**Uden WMS:**
1. Shopify → Zapier → Google Sheets (opdaterer hvert 5. minut)
2. Cost: 0 kr. (Zapier free tier)
3. Resultat: Forsinkelse reduceret fra 2 timer til 5 minutter

**Med WMS:**
1. Shopify → SmartPack API (opdaterer realtid)
2. Cost: Inkluderet i SmartPack
3. Resultat: 0 forsinkelse

### Dag 3-5: Test
- Bestil testordre
- Tjek hvor hurtigt beholdning opdateres
- Juster hvis nødvendigt

**Resultat:** Oversalg elimineret. 267.000 kr./år spart.
```

---

## ❌ AFVIST: manglende-sporbarhed.md

### HVORFOR
- **Test 1 FEJL:** "Sporbarhed er vigtigt" – men HVAD sker der uden det?
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 5 FEJL:** "Implementer sporbarhed" – men HVORDAN dag 1?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Kunde ringer: "Jeg fik forkert vare."

Du spørger: "Hvem plukkede din ordre?"
Svar: "Ved ikke."

Du spørger: "Hvornår blev den plukket?"
Svar: "Ved ikke."

Du spørger: "Hvilken batch var den i?"
Svar: "Ved ikke."

Du kan ikke finde årsagen. Du kan ikke forhindre gentagelse. Du sender ny vare og håber.

3 uger senere: Samme fejl. Samme kunde. Samme SKU.

**Cost:**
- 2 fejl × 450 kr. = 900 kr.
- Kunde opsiger: 2.400 kr. LTV tabt
- **Total: 3.300 kr.**

Med sporbarhed havde du fundet årsagen efter første fejl. Spart: 2.400 kr.
```

**SPORBARHED DAG 1:**
```markdown
## Implementer sporbarhed: Uge 1

### Dag 1: Papir-sporbarhed (0 kr.)
1. Print plukliste med:
   - Ordrenummer
   - Tidspunkt
   - Plukker-initialer
2. Plukker skriver initialer + tidspunkt ved afslutning
3. Arkiver i mappe (1 uge)

**Resultat:** Ved fejl kan du finde hvem + hvornår.

### Uge 2-4: Digital sporbarhed (WMS)
1. Plukker scanner login ved start
2. Hver scanning registreres med:
   - Medarbejder-ID
   - Tidspunkt
   - Lokation
   - SKU
3. Ved fejl: Fuld audit trail tilgængelig

**Resultat:** Præcis årsag til enhver fejl. Gentagelse forhindres.
```

---

## ❌ AFVIST: oversalg.md

### HVORFOR
- **Test 3 FEJL:** "Oversalg koster penge" – men HVOR meget præcis?
- **Test 4 FEJL:** Ingen edge case. Hvad hvis oversalg sker TRODS realtidsdata?
- **Test 7 FEJL:** Ingen SmartPack-differentiering. Hvornår JA/NEJ?

### KONKRETE FIXES

**MANGLENDE ØKONOMI:**
```markdown
## Regnestykket: Hvad koster oversalg?

**Scenarie: 200 ordrer/dag, 2% oversalg**

**Direkte cost per oversalg:**
- Refundering: 680 kr. (gennemsnitsordre)
- Kundeservice: 20 min × 250 kr./time = 83 kr.
- **Total direkte: 763 kr.**

**Indirekte cost:**
- 30% af kunder vender ikke tilbage
- 30% × 2.400 kr. LTV = 720 kr.
- **Total indirekte: 720 kr.**

**Total cost per oversalg: 1.483 kr.**

**Årlig cost:**
- 200 ordrer/dag × 2% = 4 oversalg/dag
- 4 × 250 dage = 1.000 oversalg/år
- 1.000 × 1.483 kr. = **1.483.000 kr./år**

**Med WMS (0,1% oversalg):**
- 200 × 0,1% = 0,2 oversalg/dag
- 50 oversalg/år × 1.483 kr. = 74.150 kr./år

**Besparelse: 1.408.850 kr./år**
```

**EDGE CASE:**
```markdown
### Hvad hvis oversalg sker TRODS realtidsdata?

**Scenarie:**
Du har WMS. Realtidsdata. Men oversalg sker stadig.

**Årsag:**
To kunder klikker "Køb" samtidig (inden for 0,2 sekunder). Systemet tjekker beholdning: 1 stk. Begge ordrer godkendes.

**Løsning:**
Database-locking:
1. Første ordre "låser" beholdningen
2. Anden ordre venter 0,3 sekunder
3. Beholdning opdateret → anden ordre afvises

**Implementering:**
SmartPack bruger database-locking som standard. Shopify alene gør ikke.

**Resultat:** Oversalg elimineret – selv ved samtidig bestilling.
```

**SMARTPACK JA/NEJ:**
```markdown
## SmartPack: Hvornår JA, hvornår NEJ

**JA til SmartPack hvis:**
- Oversalg over 1%/måned → Database-locking eliminerer det = 1.408.850 kr./år spart
- Shopify + over 80 ordrer/dag → Shopify-forsinkelse skaber oversalg
- Black Friday-volumen → 6× load skaber race conditions

**NEJ til SmartPack hvis:**
- Under 30 ordrer/dag + ingen kampagner → Oversalg sjældent
- Fysisk butik primært → Shopify POS er nok

**Konkret kr.-konsekvens:**
| Scenarie | Uden SmartPack | Med SmartPack | Forskel |
|----------|----------------|---------------|----------|
| 200 ordrer/dag, 2% oversalg | 1.483.000 kr./år | 74.150 kr./år | **1.408.850 kr. spart** |
```

---

## ❌ AFVIST: slow-moving-stock.md

### HVORFOR
- **Test 1 FEJL:** "Dead stock binder kapital" – men HVOR meget præcis?
- **Test 2 FEJL:** Generisk. Kunne handle om ethvert lager.
- **Test 5 FEJL:** "Identificer dead stock" – men HVORDAN dag 1?

### KONKRETE FIXES

**NY INTRO:**
```markdown
Du har 180.000 kr. i varer der ikke har bevæget sig i 6 måneder.

De fylder 12 m² lager. Leje: 800 kr./m²/måned = 9.600 kr./måned = 115.200 kr./år.

De binder kapital: 180.000 kr. × 15% renteomkostning = 27.000 kr./år.

De blokerer plads for A-varer der kunne sælge.

**Total cost: 142.200 kr./år for varer der aldrig sælges.**

Denne artikel viser hvordan du identificerer dead stock – og hvad du gør ved det.
```

**IDENTIFICER DEAD STOCK DAG 1:**
```markdown
## Identificer dead stock: Dag 1-guide

### Trin 1: Eksporter salgsdata (30 min)
- Sidste 90 dages salg per SKU
- Sorter efter antal solgt (lavest først)

### Trin 2: Identificer kategorier (30 min)
**Dead stock (0 salg i 90 dage):**
- Lagerværdi: X kr.
- Antal SKU'er: Y

**Slow-moving (1-3 salg i 90 dage):**
- Lagerværdi: X kr.
- Antal SKU'er: Y

### Trin 3: Beslut handling (1 time)
**Dead stock:**
- Udsalg (50% rabat)
- Donation (skattefradrag)
- Kassering (sidste udvej)

**Slow-moving:**
- Reducer beholdning til 1-2 enheder
- Flyt til C-zone (bagest i lager)
- Stop genbestilling

**Resultat:** 142.200 kr./år frigivet kapital + plads.
```
