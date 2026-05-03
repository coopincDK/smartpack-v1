# AFVISTE ARTIKLER — Batch: Retur + RealWorld

**Dato:** 2025-01-XX  
**Gatekeeper:** SmartPack Final Gatekeeper  
**Resultat:** 4/7 afvist

**Primære afvisningsårsager:**
1. Generisk intro uden konkret virksomhedsprofil (4/4 afviste)
2. Manglende edge cases med konkrete konsekvenser (4/4 afviste)
3. Økonomi-tal uden samlet regnestykke (3/4 afviste)

---

## ❌ AFVIST 1: beskadigede-returvarer.md

**Cluster:** 13-Retur  
**Type:** Guide

### HVORFOR AFVIST:
- ❌ Test 1 (SHIT DET ER OS): Intro er generisk. "En returvare ankommer. Æsken er flad" — kunne være enhver webshop
- ❌ Test 3 (ØKONOMI): Tal er der (linje 38-41), men scenariet er abstrakt. "1.000 returvarer à 300 kr." — hvem har det? Mangler konkret virksomhedsprofil
- ❌ Test 4 (DET GÅR GALT): Ingen edge cases. Hvad hvis en vare returneres beskadiget 5 gange? Hvad hvis leverandør nægter reklamation?
- ❌ Test 6 (ANTI-KONSULENT): Linje 61: "Højeste margin" — tomt udsagn uden tal

### KONKRETE FIXES:

#### FIX 1: NY INTRO (erstat linje 8-10)
```markdown
# Håndtering af beskadigede returvarer: Hvad gør du i praksis?

Du sælger køkkenudstyr. En KitchenAid-mixer returneres. Æsken er flad i det ene hjørne. Mixeren har en ridse på basen. Den kostede dig 2.400 kr. i indkøb, sælger til 3.999 kr. Er den 0 kr. værd nu? De fleste webshops behandler den som om den er. Den kasseres eller samler støv. Resultat: 2.400 kr. tabt. Her er hvad du gør i stedet — og hvordan du redder 1.200-2.800 kr. af værdien.
```

#### FIX 2: REWRITE ØKONOMI-AFSNIT (erstat linje 38-41)
```markdown
**Forskel i kr. — konkret case:**

Webshop: 150 returvarer/måned, gennemsnitlig indkøbspris 250 kr., salgspris 500 kr.

**Ustruktureret håndtering:**
- 35% (53 varer) gensælges til fuld pris: 53 × 500 kr. = 26.500 kr.
- 15% (23 varer) B-stock til 50%: 23 × 250 kr. = 5.750 kr.
- 50% (74 varer) kasseres: 0 kr.
- **Total inddrevet: 32.250 kr./måned**
- **Tabt værdi: 150 × 250 kr. - 32.250 kr. = 5.250 kr./måned = 63.000 kr./år**

**Struktureret håndtering:**
- 60% (90 varer) gensælges: 90 × 500 kr. = 45.000 kr.
- 25% (38 varer) B-stock til 60%: 38 × 300 kr. = 11.400 kr.
- 10% (15 varer) dele/kassation: 15 × 40 kr. = 600 kr.
- **Total inddrevet: 57.000 kr./måned**
- **Forskel: 24.750 kr./måned = 297.000 kr./år**
```

#### FIX 3: TILFØJ EDGE CASES (ny sektion efter linje 78)
```markdown
## Hvad der går galt (og hvad du gør)

**Edge 1: Leverandør nægter reklamation trods dokumentation**
Sker i 20-40% af tilfælde. Løsning: Sælg varen som B-stock selv i stedet for at vente på svar. Tab: 40% af værdi. Alternativ tab ved at vente: 100%.

**Edge 2: Vare returneres beskadiget 3+ gange**
Hvis samme SKU returneres beskadiget gentagne gange, er det et emballageproblem. Stop salg, skift emballage, genoptag. Koster 2-5 dages tabt salg, men stopper blødningen.

**Edge 3: Hygiejnisk uforsalgbar (tøj, kosmetik)**
Kan ikke sælges videre. Kassation eller donation. Acceptabel rate: under 2% af retur. Over det: produktkvalitet eller kundesegment er problemet.
```

---

## ❌ AFVIST 2: returrate-benchmarks.md

**Cluster:** 13-Retur  
**Type:** Data

### HVORFOR AFVIST:
- ❌ Test 1 (SHIT DET ER OS): Intro er okay, men mangler konkret virksomhedsprofil. "Din returrate er 18%" — hvem er "du"?
- ❌ Test 4 (DET GÅR GALT): Signaler er der (linje 37-44), men ingen konkret konsekvens. Hvad sker der hvis du ignorerer signal 1 i 6 måneder?
- ❌ Test 5 (HANDLING): Tabel linje 65-71 er god, men mangler "start her i morgen"-instruktion
- ❌ Test 6 (ANTI-KONSULENT): Linje 38: "Skal undersøges" — hvem? Hvordan? Hvornår?

### KONKRETE FIXES:

#### FIX 1: NY INTRO (erstat linje 8-10)
```markdown
# Returrate benchmarks for dansk e-commerce: Hvornår har du et problem?

Du driver en tøjwebshop. 2.400 ordrer/måned. 432 returvarer. Det er 18%. Er det godt eller dårligt? Svaret: det er i den lave ende for mode. Men hvis du solgte elektronik, ville 18% retur være katastrofalt — 2× normal rate. Forskellen: 259.200 kr./år i unødvendige returomkostninger. Her er hvordan du ved om DIN rate er et problem.
```

#### FIX 2: REWRITE SIGNAL-AFSNIT (erstat linje 37-44)
```markdown
## De tre signaler der fortæller dig noget er galt

**Signal 1: Returrate stiger måned for måned**
Eksempel: Januar 12% → Februar 14% → Marts 16%. Sortiment uændret.

**Hvad det betyder:** Produktkvalitet falder (leverandørskift?) eller plukkefejl stiger (nyt personale?).

**Hvad du gør NU:**
1. Kør returårsags-rapport for seneste 90 dage (tag 30 min)
2. Identificer top 3 SKU'er med højest returrate
3. Stop salg af SKU med >40% retur indtil årsag er fundet

**Konsekvens ved at ignorere:** Ved 300 ordrer/dag og stigning fra 12% til 18% over 6 måneder = 6% × 300 × 180 dage × 160 kr./retur = **518.400 kr. ekstra returomkostning**.

**Signal 2: Én produktkategori står for over 40% af returneringer**
Eksempel: Du sælger 12 kategorier. "Bukser" er 8% af salg, men 43% af retur.

**Hvad det betyder:** Specifikt problem med størrelsesvejledning, produktbeskrivelse eller leverandørkvalitet for den kategori.

**Hvad du gør NU:**
1. Tilføj målguide til alle bukser (implementer i morgen)
2. Tilføj fit-noter ("falder stort", "smal i benet")
3. Mål effekt efter 30 dage

**Signal 3: "Andet" er top-returårsag**
Hvis >20% af returårsager er "Andet", ved du ikke hvorfor kunder returnerer.

**Hvad du gør NU:** Redesign returformular med specifikke valgmuligheder (se FAQ).
```

#### FIX 3: TILFØJ HANDLING-SEKTION (efter linje 72)
```markdown
## Start her i morgen: 3 handlinger der reducerer retur

**Handling 1 (15 min):** Kør returårsags-rapport for seneste 30 dage. Identificer top-årsag. Hvis det er "passer ikke" → handling 2. Hvis det er "forkert vare" → handling 3.

**Handling 2 (2 timer):** Tilføj størrelsesvejledning til top 10 mest returnerede produkter. Brug leverandørens målskema eller mål selv.

**Handling 3 (1 uge):** Implementer scanning ved pluk. Eliminerer 90% af "forkert vare"-retur.
```

---

## ❌ AFVIST 3: skjulte-gebyrer-3pl.md

**Cluster:** 12-RealWorld  
**Type:** Guide

### HVORFOR AFVIST:
- ❌ Test 1 (SHIT DET ER OS): Intro er stærk (linje 10), men mangler virksomhedsprofil. Hvem er "du"? Hvilken størrelse webshop?
- ❌ Test 3 (ØKONOMI): Tal er spredt (linje 21-51), men mangler samlet regnestykke. Hvad er TOTAL uventet omkostning for en konkret virksomhed?
- ❌ Test 4 (DET GÅR GALT): Ingen edge cases. Hvad hvis 3PL fakturerer forkert? Hvad hvis du opdager skjult gebyr efter 6 måneder?

### KONKRETE FIXES:

#### FIX 1: NY INTRO (erstat linje 8-10)
```markdown
# Skjulte gebyrer hos 3PL-leverandører: Det du glemte at regne med

Du driver en webshop med 1.200 ordrer/måned. Du fik et tilbud fra en 3PL: 2,50 kr. per pluk, 0,85 kr. per pakkelinje, 1.200 kr./måned i lagerleje for 20 paller. Du regnede: (1.200 × 2,50) + (1.200 × 2 linjer × 0,85) + 1.200 = 8.280 kr./måned. Første faktura: 14.700 kr. Forskel: 6.420 kr./måned = 77.040 kr./år. Hvad skete der?
```

#### FIX 2: TILFØJ SAMLET REGNESTYKKE (ny sektion efter linje 52)
```markdown
## Hvad det reelt koster: komplet case

**Webshop-profil:**
- 1.200 ordrer/måned
- 2,2 linjer per ordre i gennemsnit
- 15% returrate (180 retur/måned)
- 4 leverandørleverancer/måned
- 80 SKU'er, 20 paller lager

**Tilbudt pris:**
- Pluk: 2,50 kr. × 1.200 = 3.000 kr.
- Pakkelinje: 0,85 kr. × 2.640 = 2.244 kr.
- Lagerleje: 1.200 kr.
- **Total tilbudt: 6.444 kr./måned**

**Reel faktura:**
- Pluk: 3.000 kr.
- Pakkelinje: 2.244 kr.
- Lagerleje: 1.200 kr.
- Minimum-gebyr difference: 1.556 kr. (minimum var 8.000 kr., du nåede kun 6.444 kr.)
- Modtagelse: 4 leverancer × 220 kr. = 880 kr.
- Returhåndtering: 180 × 22 kr. = 3.960 kr.
- Peak-tillæg (uge 47): 15% på 400 ordrer = 450 kr.
- Account management: 1.500 kr.
- **Total reel: 14.790 kr./måned**

**Forskel: 8.346 kr./måned = 100.152 kr./år**
```

#### FIX 3: TILFØJ EDGE CASES (ny sektion efter linje 64)
```markdown
## Hvad der går galt (og hvordan du reagerer)

**Edge 1: 3PL fakturerer gebyr der ikke står i kontrakten**
Sker oftere end du tror. Løsning: Afvis faktura skriftligt, henvis til kontrakt, kræv kreditnota. Betal ikke "for at holde god stemning".

**Edge 2: Du opdager skjult gebyr efter 6 måneder**
Eksempel: "Special handling" på 8 kr./ordre har kørt i 6 måneder = 57.600 kr. Kan du få pengene tilbage? Kun hvis gebyret ikke var i kontrakten OG du kan dokumentere at det aldrig blev kommunikeret.

**Edge 3: Minimum-gebyr gælder selv i lavvolumen-måneder**
Juli: 600 ordrer (ferie). Du betaler stadig for 1.000. Løsning: Forhandl sæsonudsving ind i kontrakten på forhånd.
```

---

## ❌ AFVIST 4: onboarding-3pl.md

**Cluster:** 12-RealWorld  
**Type:** Guide

### HVORFOR AFVIST:
- ❌ Test 1 (SHIT DET ER OS): Intro er generisk. "De fleste webshops" — hvem specifikt?
- ❌ Test 3 (ØKONOMI): Mangler konkret omkostning af nedetid. "3-7 dages nedetid" — hvad koster det i kroner?
- ❌ Test 4 (DET GÅR GALT): Tabel linje 67-72 er god, men mangler konsekvens i kroner
- ❌ Test 5 (HANDLING): Køreplan er der, men mangler "dag 1 starter nu"-instruktion

### KONKRETE FIXES:

#### FIX 1: NY INTRO (erstat linje 8-10)
```markdown
# Onboarding hos en 3PL: Den 30-dages køreplan uden at miste salgsdage

Du driver en webshop med 180 ordrer/dag à 850 kr. i gennemsnit. Omsætning: 153.000 kr./dag. Du skal skifte fra eget lager til 3PL. De fleste webshops undervurderer kompleksiteten og ender med 3-7 dages nedetid. Ved 5 dages nedetid mister du 765.000 kr. i omsætning (eller 50% kapacitet = 382.500 kr.). Her er køreplan der undgår det.
```

#### FIX 2: REWRITE FEJL-TABEL (erstat linje 67-72)
```markdown
## De fejl der koster salgsdage

| Fejl | Konsekvens | Omkostning (ved 180 ordrer/dag) | Undgåelse |
|---|---|---|---|
| Integration ikke testet før go-live | Ordrer når ikke 3PL i 2-3 dage | 306.000-459.000 kr. tabt | Test end-to-end 7 dage før go-live |
| A-varer modtaget uden EAN | Kan ikke plukkes i 1-2 dage | 153.000-306.000 kr. tabt | Korrekte EAN-koder på ALT |
| For hurtig overgang (alt på én dag) | Kaos + 50% kapacitet i 5 dage | 382.500 kr. tabt | Parallelkørsel i min. 3 dage |
| Ingen aftalt cut-off tid | Kunder forventer same-day, 3PL kører næste dag | 15-25% flere kundeservice-henvendelser | Aftal cut-off i kontrakten + kommunikér til kunder |
```

#### FIX 3: TILFØJ START-NU SEKTION (efter linje 73)
```markdown
## Start onboarding i dag: første 3 handlinger

**Handling 1 (i dag, 30 min):** Eksportér komplet SKU-liste med EAN, vægt, dimensioner. Tjek at ALLE SKU'er har EAN-kode. Mangler nogen? Bestil labels nu.

**Handling 2 (i morgen, 1 time):** Book kickoff-møde med 3PL. Aftal: datafiled-format, integrations-metode, cut-off-tid, parallelkørsel-periode.

**Handling 3 (dag 3, 2 timer):** Opret testordre i dit system. Send til 3PL's test-miljø. Bekræft at fulfillment-event kommer tilbage. Gentag til det virker.
```

---

## KONKLUSION

Disse 4 artikler er AFVIST og sendes til Reality Enforcer med komplet fix-liste.

**Næste skridt:** Implementer alle 3 fixes per artikel, kør tests igen.
