---
primary_keyword: håndtering af plukfejl
secondary_keywords: [plukfejl lager, fejl ved pluk, plukfejl håndtering, fejl ordre lager]
cluster: 03-Operations
---

# Håndtering af plukfejl: Fra opdag til korrektiv handling og forebyggelse

En plukfejl opdages.
Ved pakning: 10 min tabt + ny plukrunde.
Ved kunden: 350 kr. direkte tab + 450-850 kr. LTV-tab.

Problemet: I ved ikke HVORNÅR fejlen sker.

Ingen registrering. Ingen analyse.
Samme 3 SKU'er laver 60% af fejlene.
I fixer dem ikke — fordi I ikke ved det.

Ved 1% fejlrate og 500 ordrer/dag:
5 fejl/dag × 350 kr. = 1.750 kr./dag.
638.000 kr./år.

Med scanning: 0,5% fejlrate.
319.000 kr. sparet.

Men kun hvis I tracker, analyserer og reagerer.

## Hvad er plukfejl?

En plukfejl opstår, når en medarbejder plukker en forkert vare, forkert antal eller plukker fra en forkert lokation. Det kan opdages:
- Af plukkeren selv (øjeblikkelig korrektion)
- Af pakkeansvarlig (fejl opdaget ved pakning)
- Af kunden (fejl opdaget efter levering)

Jo tidligere fejlen opdages, jo billigere er den.

## Hvornår er det et problem?

Plukfejl er systemisk, når:
- Fejlraten er over 1% af samlede ordrer
- De samme SKU'er gentagne gange involveret i fejl
- Fejl opdages primært af kunden – ikke internt
- Ingen registrering eller analyse af fejlmønstre

## Hvorfor er det vigtigt? (tal)

- Opdagelse ved pluk: korrektion tager 2-3 minutter, ingen ekstra forsendelse
- Opdagelse ved pakning: korrektion tager 5-10 minutter, evt. nyt pluk
- Opdagelse af kunde: **~350 kr. direkte** + 450-850 kr. inkl. LTV-tab
- Manuel plukning: 3% fejlrate. Med scanning: **0,5% fejlrate** (83% reduktion)
- Forebyggelse er altid billigere end korrektiv handling

## Trin-for-trin: Håndtér plukfejl korrekt

### Trin 1: Definer tre opdagelses-scenarier og reaktion per scenario

**Scenario 1: Fejl opdaget af plukkeren**
- Stop. Returner forkert vare til korrekt lokation
- Scan og bekræft returnering i systemet
- Pluk korrekt vare og bekræft i systemet
- Log fejlhændelsen med SKU og årsag

**Scenario 2: Fejl opdaget ved pakning**
- Stop ordrepakningprocessen
- Returner ordre til pluktilstand i systemet
- Send til nyt pluk (evt. hastelabel)
- Log fejlhændelsen med SKU, medarbejder og tidspunkt

**Scenario 3: Fejl opdaget af kunde**
- Registrér kundeklage og fejldetaljer omgående
- Igangsæt RMA-proces
- Send korrekt vare med hasteprioritering
- Log fejlhændelsen og årsag

### Trin 2: Registrér alle fejl systematisk
Enhver plukfejl registreres med:
- Dato og tidspunkt
- SKU-nummer (fejlet vare)
- Lokation
- Medarbejder-ID
- Årsag (scanning sprunget over, forkert label, forvekslet SKU osv.)

### Trin 3: Analyser fejlmønstre månedligt
Kør månedlig fejlrapport og identificér:
- Top 5 fejl-SKU'er
- Top fejlmedarbejdere (til konstruktiv opfølgning)
- Top fejl-årsager
- Fejl-tidsmønstre (sidst på dagen, mandag morgen)

### Trin 4: Implementér forebyggende indsatser
For hvert mønster identificeres en specifik indsats:
- Hyppig forveksling mellem to SKU'er → adskil fysisk, tilføj billede i pluklisten
- Scanning sprunget over → Systemkrav skærpes
- Specifik medarbejder med høj fejlrate → Opfølgning og genoplæring

### Trin 5: Evaluer effekt af indsatser
Mål fejlraten per SKU og medarbejder månedsbasis. Er fejlraten faldende for en behandlet SKU? Er genoplæringen effektiv?

## Typiske fejl

**Fejl 1: Fejl registreres ikke**
Uden registrering er forebyggelse umulig. Fejl der gentager sig ubemærket er systemets største svaghed.

**Fejl 2: Fokus på skyld frem for årsag**
En medarbejder der straffes for fejl skjuler dem fremover. Fokus skal være på systemet og årsagen – ikke individet.

**Fejl 3: Handling forsinkes**
En fejl opdaget torsdag der undersøges næste mandag mister sporbarhed. Reagér inden for 24 timer.

**Fejl 4: Ingen opfølgning på forebyggelsestiltag**
En SKU flyttes for at forebygge forveksling, men ingen tjekker om fejlraten faktisk faldt. Mål altid effekten.

## Sådan gør du det rigtigt

**1. Opret en fast fejlrapport-rutine**
Månedlig fejlanalyse som fast punkt i lagerledelsens mødeplan. Data fremfor mavefornemmelse.

**2. Del fejldata med teamet konstruktivt**
"Vi havde 12 plukfejl i maj – her er de 3 mønstre vi arbejder på" er kultur-byggende. "Medarbejder X lavede 4 fejl" er det ikke.

**3. Brug scanning som første forsvarslinje**
De fleste plukfejl forhindres af scanning. Sørg for, at scanning aldrig kan springes over.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Definer reaktionsprocedure for alle tre opdagelses-scenarier
- [ ] Implementér obligatorisk fejlregistrering med årsag
- [ ] Kør månedlig fejlanalyse og identificér top 5 mønstre
- [ ] Implementér specifikke forebyggende indsatser per mønster
- [ ] Mål effekt af indsatser månedsbasis

**Næste skridt**: Læs guiderne om stregkoder og pakkefejl for at styrke den tekniske forebyggelse.

## SmartPack understøttelse

SmartPack logger alle scan-fejl og pluk-afvigelser automatisk. Fejlrapporten per SKU, medarbejder og tidsperiode er tilgængeligt direkte i dashboardet. "Lager alerts" advarer i realtid, når en specifik SKU har unormal fejlrate i den løbende optælling.

## FAQ

**Hvad er den billigste måde at håndtere en plukfejl?**
Opdage den med det samme – af plukkeren selv. En fejl opdaget inden ordre forlader lageret koster 2-3 minutter. Samme fejl opdaget af kunden koster 350-850 kr.

**Hvornår er 1% plukfejlrate for høj?**
Ved 500 ordrer/dag og 1% fejlrate = 5 fejl/dag × 350 kr. = 1.750 kr./dag = ~640.000 kr./år. Ja, det er for højt.

**Hvad er de hyppigste årsager til plukfejl?**
Scanning sprunget over, forveksling af visuelt lignende SKU'er, forkert/ulæselig label og stressfejl i spidsperioder.

**Kan man nå 0% plukfejlrate?**
Næsten – men ikke helt. Under 0,1% er opnåeligt med dobbelt scanning og gode processer. Nul er en teoretisk grænse.

**Hvad gør jeg, hvis den samme medarbejder konsistent laver fejl?**
Start med konstruktiv opfølgning og genoplæring. Undersøg om det er en systemisk årsag (dårlig label, forvekslingsrisiko). Hvis fejlraten ikke forbedres efter konkret opfølgning, er det en HR-sag.

