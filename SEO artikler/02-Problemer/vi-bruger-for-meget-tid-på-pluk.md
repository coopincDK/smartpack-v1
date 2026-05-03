---
primary_keyword: ineffektiv pluk lager
secondary_keywords: [reducere pluktid, optimere plukproces, picks per time, batch picking implementering]
cluster: 02-Problemer
---

# Vi bruger for meget tid på pluk – når plukkere går for langt

Dine plukkere går 12 km dagligt. I et lager på 250 m². Det svarer til at gå fra København til Roskilde. Hver dag. For at plukke 300 ordrer.

Deres konkurrent går 6 km for 400 ordrer. Samme lagerstørrelse.

Forskellen: De bruger batch picking + ABC-placering + WMS-optimerede ruter. I går 1 ordre ad gangen i tilfældig rækkefølge.

Cost: 1 FTE ekstra = 420.000 kr./år spildt på ineffektiv pluk.

Denne artikel viser hvordan I halverer pluktid uden at ansætte.

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

## Hvad er ineffektiv pluk?

Ineffektiv pluk betyder:
- 1 ordre ad gangen (single-order picking)
- Ingen optimeret rute (plukker vælger selv)
- A-varer ligger langt fra pakkestation
- Ingen scanning (tid spildt på at lede efter rigtig vare)
- Manuel plukliste (papir eller Excel)

## Hvornår er det et problem?

Pluk er ineffektivt når:
- Picks/time under 80
- Plukkere går over 10 km/dag i lager under 300 m²
- Gennemsnitlig pluktid per ordre over 4 minutter
- Cost per order over 40 kr.
- Plukkere bruger tid på at "lede" efter varer

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

## Hvad sker der i praksis

Plukker A plukker 1 ordre ad gangen. Går til zone A, henter vare 1. Går til zone C, henter vare 2. Går til zone A igen (anden ordre). Total: 14 km/dag.

Plukker B (efter batch picking): Plukker 12 ordrer samtidig. Går til zone A én gang, henter alle varer fra zone A til alle 12 ordrer. Total: 7 km/dag.

Resultat: Plukker B er 2x hurtigere. Samme løn. Dobbelt output.

## Typiske fejl

**1. "Batch picking er for kompliceret"**
Dag 1-test tager 2 timer. Gevinst: +30-40% hastighed. Hvad er kompliceret?

**2. Vente på WMS før batch picking**
Batch picking virker uden WMS. Start i dag med manuel batch.

**3. For store batches**
20+ ordrer per batch = forvirring ved sortering. Sweet spot: 10-14.

**4. Ikke måle før/efter**
Hvis du ikke måler, ved du ikke om det virker.

## Sådan gør du det rigtigt

**1. Mål baseline (dag 0)**
- Picks/time nuværende
- Km gået per dag
- Tid per ordre

**2. Implementer ABC-placering (dag 1)**
- Flyt 20 mest solgte varer tæt på pakkestation
- Mål: +15-20% hastighed

**3. Implementer batch picking (uge 1)**
- Start med 10 ordrer per batch
- Mål: +30-40% hastighed

**4. Implementer WMS (uge 2-4)**
- Optimerede ruter (TSP-algoritmer)
- Mål: +10-15% hastighed

**Total gevinst: +70-90% hastighed**

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Mål picks/time nuværende
- [ ] Mål km gået per dag
- [ ] Lav ABC-analyse og flyt A-varer
- [ ] Test batch picking med 10 ordrer
- [ ] Mål ny picks/time
- [ ] Optimer batchstørrelse
- [ ] Implementer WMS for fuld optimering

**Formel:** Picks/time = Total picks per dag / Total timer brugt på pluk

**Næste skridt:** Læs "Plukruter er ineffektive" og "Forkert vareplacering" for fuld optimering.

## SmartPack understøttelse

SmartPack optimerer plukruter automatisk via TSP-algoritmer. Systemet grupperer ordrer i batches baseret på lokation. Plukliste viser optimal rækkefølge. Resultat: Picks/time stiger fra 64 til 110+. Km gået halveres.

## FAQ

**Hvad er god picks/time?**
80-100 uden WMS. 100-120 med WMS + batch picking. Under 80: Optimer.

**Kan vi lave batch picking uden WMS?**
Ja. Manuel batch virker fint. WMS automatiserer det bare.

**Hvor stor skal batches være?**
10-14 ordrer for de fleste. Test og find jeres sweet spot.

**Hvad hvis ordrer er meget forskellige?**
Batch kun ordrer med geografisk overlap. WMS gør det automatisk.

**Hvordan måler vi km gået?**
Fitness tracker på plukker i 1 dag. Eller: Estimer baseret på gennemsnitlig plukafstand × antal pluk.
