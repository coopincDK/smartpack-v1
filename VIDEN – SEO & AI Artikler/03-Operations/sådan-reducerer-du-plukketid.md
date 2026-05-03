---
primary_keyword: reducere plukketid
secondary_keywords: [plukketid lager, hurtigere pluk, plukkehastighed, picks per time]
cluster: 03-Operations
article_type: beslutning
---

# Sådan reducerer du plukketid: Guide til hurtigere og mere præcis ordrehåndtering

300 ordrer om dagen.
2 picks per ordre = 600 picks.

Ved 102 picks/time: 5,9 timer.
Ved 110 picks/time: 5,5 timer.

Forskel: 24 minutter per dag.
2 timer per uge. 104 timer per år.

Det er én medarbejder.

Plukketid bestemmer om I kan skalere.
Hvis plukketid stiger — selvom lageret ikke vokser — er noget galt.

Dårlig vareplacering. Ingen rutedefinition. Ingen batch.

Industrisnit 2025: 102 picks/time.
SmartPack-lagre: 110 picks/time.

8% kapacitetsgevinst.
Uden ekstra personale.

## Kort svar

Reduktion af plukketid opnås ved at kombinere ABC-placering, batch picking og optimerede plukruter. Formålet er at øge picks/time fra branchesnittets 102 til 110+ og spare 24+ minutter per medarbejder per dag.

## Hvad er plukketid?

Plukketid er den tid, der går fra en medarbejder starter på en ordre, til alle varer er samlet og klar til pakning. Det inkluderer gangtid, søgetid, scanningstid og eventuelle afbrud.

Industrigennemsnittet for picks per time lå i 2025 på **102 picks/time**. SmartPack-optimerede lagre opnår **110 picks/time** – en forskel der ved 300 ordrer/dag kan betyde én hel medarbejder sparet eller omdisponeret.

## Hvornår er plukketid et problem?

Plukketid er kritisk, når:

- Ordrefuldførelse tager længere tid end SLA tillader
- Du skal bruge flere medarbejdere for at holde trit med ordrevolumen
- Travle perioder medfører fejl, fordi plukkerene stresser
- Nye medarbejdere bremser hele linjen i onboarding-perioden

Et rødt flag: hvis plukketid per ordre stiger, selvom lageret ikke er vokset, er det et tegn på dårlig vareplacement eller manglende rutedefinition.

## Hvorfor er det vigtigt? (tal)

- Forskel på 102 vs. 110 picks/time = **ca. 8% kapacitetsgevinst** uden ekstra personale
- Kortere plukketid = kortere leveringstid = højere kundetilfredshed
- Hvert fejlpluk koster ~**350 kr. direkte** og op til **850 kr.** inkl. LTV-tab – hurtigere pluk med scanning reducerer fejlrate fra 3% til 0,5%
- Ved 500 ordrer/dag og gennemsnit 2 pluk per ordre = 1.000 picks/dag – 8% gevinst = 80 picks frigjort = ca. 45 min/dag per medarbejder

## Trin-for-trin: Reducér plukketid

### Trin 1: Mål nuværende plukketid
Før du kan forbedre, skal du måle. Registrér for mindst 100 ordrer:
- Tid fra pluk-start til pluk-afslutning
- Antal picks per ordre
- Hvilke varer der tog længst tid

Brug SmartPacks dashboard eller en simpel tidtagning. Find gennemsnittet og identificer outliers.

### Trin 2: Indfør ABC-baseret vareplacement
A-varer (20% af SKU'er, 80% af salg) skal stå i Golden Zone: knæ- til brysthøjde, maksimalt 20 meter fra pakkebordet. Hvert skridt tæller – en A-vare placeret 15 meter væk fra pakkebordet vs. 3 meter væk giver ved 80 picks/dag en besparelse på ca. 20 minutters gangtid dagligt.

### Trin 3: Implementér batch picking
I stedet for én ordre ad gangen samler medarbejderen 8-16 ordrer per tur (afhængig af ordrekompleksitet). SmartPack's batchplukning bruger **TSP-algoritmer** til at beregne den korteste rute, der dækker alle picks for batchen.

Breakpoints for batchstørrelse:
- Under 50 ordrer/dag: enkeltplukning eller 2-4 pr. tur
- 50-200 ordrer/dag: 4-8 pr. tur
- 200-500 ordrer/dag: 8-16 pr. tur
- Over 500 ordrer/dag: kombinér batch picking med zoneopdeling

### Trin 4: Definer og standardisér plukkegangen
En fast rute eliminerer dobbelt-gang og beslutningspauser. Enten U-form (gå ind og ud samme ende) eller S-form (slangeroute). Rutens retning skal modsvare reolopstillingens nummerering.

Hæng ruten op ved plukkestarten – nye medarbejdere skal kunne følge den uden vejledning.

### Trin 5: Reducer søgetid med scanning og korrekte labels
Scanningsfejlrate er typisk 3% ved manuelt pluk, men falder til **0,5%** med scanning – en **83% reduktion**. Men scanning hjælper kun, hvis labels sidder korrekt og er scannable. Tjek:
- Labels er placeret på fronten af hylden, ikke oven på varerne
- Stregkoder er ikke beskadigede eller snavsede
- Hyldeetiketter matcher systemets lokationskoder

### Trin 6: Eliminer afbrud i plukkegangen
Hvert afbrud (spørgsmål til kolleger, søgning efter udstyr, ventetid ved flaskehalse) koster tid. Identificér de 3 hyppigste årsager til afbrud og fjern dem strukturelt.

### Trin 7: Mål og bel+nn løbende
Opsæt ugentlige KPI-møder: picks/time per medarbejder, fejlrate, ordrer gennemført til tid. Fejl og langsom pluk hænger typisk sammen – løs dem parallelt.

## Typiske fejl

**Fejl 1: Batch picking uden systemunderstøttelse**
Batchpluk uden et system, der fortæller hvilken vare, der tilhører hvilken ordre, skaber rod i sorteringen. Brug altid et WMS (som SmartPack) til batchhåndtering.

**Fejl 2: Ignorere gangtid**
Mange fokuserer på scanningstid og ignorer gangtid. Men gangtid udgør typisk 50-60% af total plukketid. Plasseringsoptimering er vigtigere end scanning-speed.

**Fejl 3: Fastsætte ruter én gang og aldrig revidere**
Sortiment ændrer sig. En A-vare i dag er måske C-vare om 6 måneder. Revidér vareplacering kvartalsvis.

## Sådan gør du det rigtigt

**1. Kombiner batch picking med zoneopdeling ved højt volumen**
Over 200 ordrer/dag: opdel lageret i zoner, og lad plukkere arbejde i én zone per runde. Sorteringsbånd eller totes samler til sidst.

**2. Brug lydguide eller pick-by-light ved høj fejlrate**
Visuelt eller audio-feedback ved pluk eliminerer søgetid yderligere og er særlig effektiv ved onboarding.

**3. Involver plukkerne i rutedesign**
De ved, hvilke ruter der er ineffektive. Et kvartalsmøde med fokus på optimering giver bedre resultater end topdown-beslutninger.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Mål nuværende plukketid for mindst 100 ordrer
- [ ] Gennemfør ABC-analyse og flyt A-varer til Golden Zone
- [ ] Implementér batchpluk tilpasset ordrevolumet
- [ ] Definer og standardisér plukkegange
- [ ] Sørg for at alle labels er scannbare og korrekt placeret
- [ ] Sæt KPI'er op og mål ugentligt

**Næste skridt**: Læs guiderne om batch picking og ABC-analyse for dybere implementeringstrin.

## SmartPack understøttelse

SmartPack beregner automatisk batchstørrelse og plukkerende ud fra ordrevolumen og TSP-algoritmer. Du kan se picks/time per medarbejder i realtid og identificere, hvilke SKU'er og zoner der trækker plukketiden op. Systemet foreslår også optimerede varerplacering baseret på historisk plukhyppighed.

## FAQ

**Hvad er en god plukketid?**
Industrigennemsnittet er 102 picks/time (2025). SmartPack-optimerede lagre rammer 110+ picks/time. Det vigtigste er at måle dit eget baseline og forbedre det løbende.

**Hvornår bør jeg bruge batch picking?**
Batchpluk giver gevinst fra ca. 50 ordrer/dag opefter. Under 50 ordrer/dag er den administrative overhead sjældent besværet værd.

**Hvad er TSP-algoritmer i forbindelse med pluk?**
Travelling Salesman Problem-algoritmer beregner den korteste rute, der dækker alle plukpunkter i en batch. SmartPack anvender dette til automatisk ruteoptimering.

**Kan jeg reducere plukketid uden at flytte varer rundt?**
Ja – batchpluk og ruteoptimering giver gevinst selv uden vareflytnng. Men den største gevinst kommer ved at kombinere begge indsatser.

**Hvor meget reducerer scanning plukfejlene?**
Korrekt scanning reducerer fejlraten fra ca. 3% til 0,5% – en reduktion på 83%. Det svarer til at halvere antallet af kostbare retuursager.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Lav picks per time og høj plukketid](/viden/problemer/lav-picks-per-time)


