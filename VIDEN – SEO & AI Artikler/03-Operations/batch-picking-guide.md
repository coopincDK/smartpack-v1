---
primary_keyword: batch picking guide
secondary_keywords: [batchpluk lager, batch picking wms, pluk flere ordrer, picks per time batch]
cluster: 03-Operations
article_type: beslutning
---

# Batch picking guide: Plukt 8-16 ordrer på én tur og halvér din gangtid

I plukker 300 ordrer om dagen.
Hver medarbejder går samme rute 40 gange.

Fordi I plukker én ordre ad gangen.

Samme vare. Samme hylder. Samme 200 meter.
40 gange.

Batch picking samler 8-16 ordrer på én tur.
Systemet beregner ruten. Plukkeren går én gang.

Forskel: 102 picks/time → 110 picks/time.
Det er én medarbejder sparet ved 300 ordrer/dag.
26.000 kr./år per plukker.

Men uden TSP-algoritmer går det galt.
Forkert sortering. Dobbelt gangtid. Kaos ved pakning.

## Kort svar

Batch picking samler 8-16 ordrer i én plukreunde via TSP-ruteoptimeringsalgoritmer. Formålet er at reducere gangtid med 40-60% og øge picks/time fra 102 til 110+, svarende til 26.000 kr./år sparet per plukker.

## Hvad er batch picking?

Batch picking betyder, at én plukker henter varer til flere ordrer i én runde. I stedet for at gå til hylden 12 gange for 12 separate ordrer til den samme vare, går plukkeren én gang og samler til alle 12 ordrer.

Systemet (WMS) grupperer ordrer i batches og beregner den optimale rute ved hjælp af **TSP-algoritmer** (Travelling Salesman Problem). Plukkeren modtager en samlet plukliste og sorterer undervejs i totes eller fack per ordre.

**Uden TSP-algoritme:** Plukkeren går i den rækkefølge ordrerne er listet. Det betyder dobbelt-gang, krydsende ruter og 30-40% spildt gangtid.

**Med TSP-algoritme:** Systemet beregner den korteste rute der dækker alle plukpunkter. Gangtid reduceres med 40-60%.

## Hvornår er det et problem?

Batch picking er ikke implementeret eller korrekt sat op, når:
- Plukkere plukker én ordre ad gangen og tilbagelægger maks. gangtid
- Samme vare plukkes gentagne gange på separate ture
- Gangtid udgør mere end 50% af den samlede plukketid
- Kapaciteten rammer et loft, selvom ordrevolumet er håndterbart

## Hvorfor er det vigtigt? (tal)

- Batch picking kan reducere gangtid med **40-60%** sammenlignet med enkeltplukning
- SmartPack-lagre med batch picking opnår **110 picks/time** vs. branchesnit 102
- TSP-optimerede ruter minimerer dobbelt-gang og baglæns-kørsel
- Kombination af batch picking med ABC-placering er den kraftigste samling af optimeringstiltag

**Konkret eksempel:**
300 ordrer/dag, gennemsnit 2 picks = 600 picks. 
- Enkeltpluk: ca. 102 picks/time = ~5,9 timer per medarbejder
- Batchpluk 110 picks/time = ~5,5 timer per medarbejder
- **Gevinst: 24 minutter/dag per medarbejder = 2 timer/uge = 104 timer/år**

Ved 250 kr./time = **26.000 kr./år sparet per medarbejder.**

## Hvad der faktisk sker (når det går galt)

### Scenarie 1: Batch picking uden WMS
I beslutter jer for at "prøve batch picking" uden systemunderstøttelse. Plukkeren får en papir-liste med 12 ordrer.

**Hvad der sker:**
- Plukkeren går i den rækkefølge listen er skrevet
- Passerer samme hylde 3-4 gange fordi ordrerne ikke er optimeret
- Blander varer mellem ordrer fordi der ingen scan-til-tote er
- Fejlrate stiger fra 3% til 8%

**Resultat:** Batch picking tager LÆNGERE tid end enkeltpluk + højere fejlrate. I opgiver det efter 2 uger.

### Scenarie 2: Forkert batchstørrelse
I sætter batchstørrelse til 16 ordrer fordi "mere er bedre". Men jeres gennemsnitlige ordre har 6 linjer.

**Hvad der sker:**
- 16 ordrer × 6 linjer = 96 picks per batch
- Plukkeren har 16 totes på vognen
- Sortering under pluk tager 3-5 sekunder per vare (finder rigtig tote)
- 96 picks × 4 sek = **384 sekunder = 6,4 minutter spildt KUN på sortering**

**Resultat:** Gevinsten ved reduceret gangtid spises op af sorteringstid. Netto-gevinst: 0%.

### Scenarie 3: Hasteoordrer blandet ind
En kunde betaler for same-day levering. Ordren havner i en standardbatch med 12 andre ordrer.

Batchen tager 45 minutter at plukke. Hasteoordren venter i kø.

**Resultat:** SLA-brud. Kunden får refusion. I mister 200 kr. + goodwill.

### Scenarie 4: Black Friday uden justering
Normalt kører I 8 ordrer per batch. Black Friday: 6× volumen.

I beholder batchstørrelse på 8. Men nu er der 600 ordrer i kø i stedet for 100.

**Hvad der sker:**
- Batches dannes langsomt fordi systemet venter på at samle 8 "passende" ordrer
- Ordrer med sjældne SKU'er venter i timevis
- Gennemsnitlig ordretid stiger fra 45 min til 3 timer

**Resultat:** I kan ikke levere til cut-off. 200 ordrer forskydes til næste dag.

## Det opdager de fleste for sent

- **At batch picking UDEN TSP-algoritme er langsommere end enkeltpluk** — I implementerer batch picking manuelt (papir-liste). Plukkeren går i den rækkefølge ordrerne er listet. Passerer samme hylde 4 gange. Gangtid stiger 40%. I opgiver batch picking efter 2 uger.
- **At batchstørrelse skal justeres HVER gang sortimentet ændrer sig** — I lancerer nye produktlinjer med flere varianter. Gennemsnitlig picks/ordre stiger fra 2 til 4. Jeres batchstørrelse på 16 ordrer giver nu 64 picks per batch. Sorteringstid eksploderer. Gevinsten forsvinder.
- **At vikarer har 5×8× længere sorteringstid end erfarne** — men I måler det ikke separat. Black Friday: 40% vikarer. Batch picking bryder sammen. I ved ikke hvorfor.

## Trin-for-trin: Implementér batch picking

### Trin 1: Vurdér om batch picking passer til dit volumen
Batchpluk giver reel gevinst fra ca. **50 ordrer/dag** opefter. Under 50 ordrer er overhead ved sortering sjældent det værd.

Breakpoints:
- 50-200 ordrer/dag → 4-8 ordrer per batch
- 200-500 ordrer/dag → 8-16 ordrer per batch
- Over 500 ordrer/dag → kombiner batch picking med zoneopdeling

### Trin 2: Sørg for system-understøttelse
Batch picking kræver et WMS der kan:
- Gruppere ordrer i batches
- Beregne optimale plukruter (TSP-algoritme)
- Vise plukkeren, hvilken ordre/tote den næste vare tilhører
- Håndtere sortering under pluk

**Uden systemunderstøttelse risikerer du fejlsortering og mister gevinsten.**

### Trin 3: Konfigurér batchstørrelse
Batchstørrelse afhænger af:
- Antal picks per ordre (jo mere picks, jo færre ordrer per batch)
- Lagerets størrelse og SKU-tæthed
- Tilgængeligt plukkeur (totes, vogn)
- Sorteringskapacitet efter pluk

**Start med 8 ordrer per batch og justér baseret på plukketid og fejlrate.**

### Trin 4: Brug totes med klare ordremarkering
Én tote per ordre. Totes skal mærkes klart – enten med ordrenummer, stregkode eller farve. Plukkeren scanner toten, inden varen lægges i – systemet bekræfter korrekthed.

### Trin 5: Definer en klar sorteringsproces
Sortering under pluk (scan → læg i rigtig tote) er metoden i SmartPack. Alternativt sortering på pakkebordet efter pluk-runden. Definer ét klart princip og hold det konsekvent.

### Trin 6: Træn plukkerne i den nye metode
Batchpluk er nyt for mange medarbejdere. Gennemfør en introduktionsrunde med erfaren medarbejder som guide. Fokusér på:
- Rute-logik (følg systemet, ikke intuition)
- Scanningstidspunkt (inden varen lægges i tote)
- Håndtering af scanning-fejl

### Trin 7: Mål og juster løbende
Mål picks/time og fejlrate ugentligt, separat for batch-plukket vs. enkelt-plukket. Justér batchstørrelse og profiler baseret på data.

## Typiske fejl

**Fejl 1: For store batches på komplekse ordrer**
Batches med 16 ordrer, der hver har 8-10 linjer, skaber enorme sorteringsudfordringer. Hav differentierede batchstørrelser per ordretype.

**Fejl 2: Batch picking uden systemunderstøttelse**
Manuel batchpluk (liste på papir, sortering i hovedet) fungerer for 2-3 ordrer men skalerer ikke til 8-16. Brug aldrig batch picking uden WMS-understøttelse.

**Fejl 3: Blande hasteoordrer i standardbatches**
En hasteoordre der havner i en 16-ordres batch venter i kø. Hasteleverancer skal have en dedikeret profil med enkeltpluk.

**Fejl 4: Ignorere TSP – plukke i egen rækkefølge**
Plukkere der afviger fra systemets anbefalede rute (f.eks. "det er hurtigere hvis jeg går modsat") underminerer TSP-gevinsten.

## Sådan gør du det rigtigt

**1. Kombiner batch picking med zoneopdeling ved højt volumen**
Over 500 ordrer/dag: plukkere arbejder i dedikerede zoner, og sorteringsbånd samler til den endelige ordre. Skalerer langt bedre end ren batchpluk.

**2. Brug separate totes-typer per batchstørrelse**
En lille tote til 2-3-linje-ordrer, stor vogn til 8-16-ordres batches. Giver bedre flow og færre sorteringsfejl.

**3. Benchmark ugentligt og publicér resultater for teamet**
Synlighed om picks/time motiverer. Sammenlign uge-over-uge, ikke person-mod-person.

## Regnestykket: Hvad giver batch picking REELT?

### Basis: 300 ordrer/dag, 2 picks/ordre = 600 picks

**Uden batch picking (enkeltpluk):**
- Picks/time: 102
- Timer per dag: 600 ÷ 102 = **5,88 timer**
- Medarbejdere nødvendige (7-timers skift): **1 medarbejder**

**Med batch picking (8 ordrer/batch, TSP-optimeret):**
- Picks/time: 110
- Timer per dag: 600 ÷ 110 = **5,45 timer**
- **Gevinst: 0,43 timer/dag = 26 min/dag**

### Ved 500 ordrer/dag (1.000 picks)

**Uden batch picking:**
- Timer: 1.000 ÷ 102 = **9,8 timer**
- Medarbejdere: **2 (med overtid)**

**Med batch picking:**
- Timer: 1.000 ÷ 110 = **9,1 timer**
- Medarbejdere: **1,3 (kan klares af 2 uden overtid)**

**Besparelse:**
- 0,7 timer/dag × 250 kr./time = **175 kr./dag**
- **63.875 kr./år per lager**

### ROI
- WMS med batch picking-modul (SmartPack): **60.000 kr./år**
- Besparelse: **63.875 kr./år**
- **Payback: under 12 måneder**

Og det er KUN gangtidsbesparelsen. Ikke medregnet: lavere fejlrate, bedre skalerbarhed, kortere onboarding.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Vurdér om volumen overstiger 50 ordrer/dag
- [ ] Konfigurér batchstørrelser per ordretype
- [ ] Sørg for systemunderstøttelse med TSP-rutegenerering
- [ ] Anskaf totes med klar ordremarering
- [ ] Definer sorteringsproces og dokumentér den
- [ ] Træn alle plukkere inden fuld udrulning
- [ ] Mål picks/time og fejlrate fra dag 1

**Næste skridt**: Læs guiderne om plukkeprofiler og zoneopdeling for at kombinere effekterne.

## SmartPack: JA eller NEJ?

**JA** — hvis du vil have TSP-optimering og scan-til-tote.

SmartPack's batch picking modul bruger TSP-algoritmer til automatisk ruteoptimering og grupperer ordrer efter konfigurerede profiler. Systemet tvinger scan-til-tote, så sorteringsfejl opdages i realtid. Batchstørrelse justeres automatisk baseret på ordrekompleksitet (picks/ordre).

**Konkret forskel:**
- Uden batch picking: 102 picks/time, 700.000 kr./år i lageromkostninger ved 500 ordrer/dag
- Med SmartPack batch picking: 110 picks/time, **636.125 kr./år**
- **Besparelse: 63.875 kr./år**

Du kan monitorere picks/time per medarbejder og per batchstørrelse direkte i dashboardet.

**Alternativet:**
- Manuel batch picking (papir-liste): 40% LANGSOMMERE end enkeltpluk (ingen TSP)
- WMS uden TSP-algoritme: 30% gevinst tabt (vs. 60% med TSP)
- Ingen scan-til-tote: 8% fejlrate ved batch picking (vs. 0,5% med scanning)

**SmartPack-omkostning:** 60.000 kr./år.

**Breakeven:** Besparelse 63.875 kr./år > omkostning 60.000 kr./år = **3.875 kr. overskud** i første år. Hvert efterfølgende år: 63.875 kr. sparet.

## FAQ

**Hvad er batch picking?**
Batchpluk er en metode, hvor én plukker samler varer til 4-16 ordrer i én runde, i stedet for at plukke én ordre ad gangen. Det reducerer gangtid markant.

**Hvornår er batch picking en god idé?**
Fra ca. 50 ordrer/dag. Under 50 er overhead ved sortering sjældent besværet værd.

**Hvad er TSP-algoritmer?**
Travelling Salesman Problem – matematiske algoritmer der beregner den korteste rute, der besøger alle plukpunkter. Bruges i SmartPack til automatisk ruteoptimering. Uden TSP spildes 30-40% af gangtidsgevinsten.

**Hvor mange ordrer bør der være i en batch?**
8-16 ordrer per batch er optimalt ved 200-500 ordrer/dag. Under 50 ordrer/dag: max 4-8 per batch. Juster baseret på ordrekompleksitet og lagerets størrelse.

**Kan batch picking bruges til B2B-ordrer?**
Ja, men med lavere batchstørrelse. Store B2B-ordrer (10+ linjer) kræver typisk 2-4 per batch, evt. zoneplukning.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Lav picks per time](/viden/problemer/lav-picks-per-time)
