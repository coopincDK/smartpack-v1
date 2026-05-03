---
primary_keyword: hvornår batch picking stopper med at virke
secondary_keywords: batch picking optimering, batch picking fejl, pick strategi, optimal batch størrelse
cluster: 04-Growth
article_type: vaekst
---

# Hvornår holder batch picking op med at virke?

Batch picking er en af de mest effektive plukmetoder.
Indtil du presser den for hårdt.

Ved 20+ ordrer per batch begynder fejlraten at stige.
Ved 30 ordrer er den fordoblet.

Det opdager de fleste først når Black Friday rammer.
6× volumen. Batches på 25-30 ordrer "for at følge med".
Fejlrate går fra 1,2% til 4,8% på 3 dage.

23 fejlordrer første dag.
47 kundehenvendelser.
10.350 kr. tabt.

Det er ikke batch picking der fejler.
Det er størrelsen.

## Kort svar

> Batch picking holder op med at virke, når batchen overstiger 16–20 ordrer – over den grænse stiger fejlraten markant og spiser hele effektivitetsgevinsten.

## Hvad er batch picking?

Batch picking betyder, at én plukker samler varer til flere ordrer på én gang i stedet for at gå én tur per ordre. I stedet for 20 ture til hylden for 20 separate ordrer plukkes de i én tur med en vognkasse opdelt i rum – én per ordre.

Optimal batch-størrelse er typisk **8-16 ordrer per tur** ifølge best practice. Under 8 ordrer udnytter du ikke ruten nok. Over 16 ordrer begynder sortering og fejlrisiko at stige.

## Hvornår holder det op med at virke?

Batch picking bryder ned, når:

- **Batchen er for stor**: Over 16-20 ordrer øger sorteringstid og fejlrate markant
- **Ordrekompleksiteten er høj**: Mange ordrelinjer per ordre gør det svært at holde styr på, hvad der tilhører hvad
- **Lagerlokationerne er kaotiske**: Uden optimeret plukrute ender du med at krydse dit eget spor
- **Sorteringen foregår manuelt**: Uden scanning eller pick-to-light er fejlraten på store batches 3-5% – dobbelt normalratten
- **Volumenpres fra peak season**: Under Black Friday med 6× normal kapacitet er batch picking med store batches fejlmagnet

## Hvorfor det er vigtigt – i kroner

Den direkte omkostning per fejl er ~350 kr. Inklusiv LTV-tab: 450-850 kr. per fejl.

Reducer fejlraten fra 2% til 0,5% = spare **638.000 kr./år** på 500 ordrer/dag.

Effektiv batch picking er en af de hurtigste veje til den besparelse.

**Regnestykke: Hvad koster for store batches?**

500 ordrer/dag × 250 dage = 125.000 ordrer/år

**Scenarie A: Optimal batch (8-16 ordrer, fejlrate 0,8%)**
- 125.000 × 0,8% = 1.000 fejl/år
- 1.000 × 450 kr. = 450.000 kr./år

**Scenarie B: For store batches (20-30 ordrer, fejlrate 2,4%)**
- 125.000 × 2,4% = 3.000 fejl/år
- 3.000 × 450 kr. = 1.350.000 kr./år

**Difference: 900.000 kr./år**

Omvendt: En batch-strategi der ikke er optimeret koster:
- **Øget plukketid**: Plukker bruger 20-30% ekstra tid på sortering
- **Øget fejlrate**: Fejlblandede ordrer kræver repack og kundeservice
- **Demotiverede medarbejdere**: Kompleks og frustrerende proces øger churn (43% annual turnover × 35.000 kr. = 15.050 kr. per medarbejder)

## Hvordan det fungerer i praksis

**Optimal workflow:**
1. WMS genererer en batch på 8-16 ordrer baseret på geografisk overlap i lageret
2. Plukker modtager samlet plukkeliste sorteret efter lokation (A*-optimeret rute)
3. Plukker scanner hvert produkt og systemet tildeler det til korrekt ordre
4. Sorteret ved pakkestationen – ikke undervejs

**Hvornår batch picking virker bedst:**
- Høj andel af single- eller two-line orders
- Sortiment med mange ensartede varer
- Klart definerede lokationer og gange

**Hvornår du bør skifte til anden strategi:**
- Mange ordrer med 5+ linjer: Zone picking eller wave picking
- Sortiment med tunge/store varer: Single order picking
- Meget tidskritiske ordrer: Priority picking, ikke batching

## Det opdager de fleste for sent

**Scenarie 1: Black Friday-krakket**
Du går fra 80 ordrer/dag til 480. Batch-størrelsen sættes til 25-30 ordrer "for at følge med". Resultat: Fejlraten går fra 1,2% til 4,8% på 3 dage. 23 ordrer sendes forkert første dag. Kundeservice får 47 henvendelser. Cost: 23 × 450 kr. = 10.350 kr. på én dag.

**Scenarie 2: Den erfarne plukker siger op**
Din bedste medarbejder kunne håndtere batches på 18-20 ordrer uden fejl. Hun siger op. Afløseren kan max 12 ordrer. Du opdager at hele systemet var bygget på én persons hukommelse – ikke på proces.

**Scenarie 3: Sortimentet vokser stille**
For 6 måneder siden var batch picking perfekt. I dag har I 340% flere SKU'er. Plukkerne krydser deres egne spor 4-5 gange per batch. Plukketiden er steget 38% – men I målte det ikke.

## Typiske fejl

1. **For store batches** – At sætte batch-størrelse til 30+ fordi det "sparer ture" ignorerer, at sorteringstiden og fejlraten äter gevinsten op. Hver ordre over 16 i en batch øger fejlrisikoen med 0,3 procentpoint.

2. **Batching uden geografisk logik** – Batche ordrer der kræver varer spredt over hele lageret eliminerer plukrutegevinsten. WMS skal batche ordrer med geografisk overlap – ellers går du samme rute 3 gange.

3. **Manuel sortering uden scanning** – Plukker holder styr på 15 ordrer i hovedet. Det fejler. Scanning er ikke optionelt ved batching. Fejlrate uden scanning: 3,2%. Med scanning: 0,6%.

## Sådan gør du det rigtigt

1. **Hold batches på 8-16 ordrer** – Dette er det dokumenterede optimum. Afveg ikke uden specifik grund og datamåling.

2. **Kræv WMS-genererede batches** – Lad ikke plukkere selv vælge, hvad de batcher. Algoritmen gør det bedre.

3. **Mål fejlrate per batchstørrelse** – Du kan finde dit specifikke optimum ved at spore fejlrate på batches af 5, 10, 15, 20 ordrer over 30 dage.

## Hvornår skal du handle?

**Nu** hvis din fejlrate er over 1,5% og du bruger batch picking uden WMS-support.

**Inden peak season** hvis din batch-strategi er manuelt styret – Black Friday med manuel batching er et lotteri.

**Som prioritet** hvis plukkere rapporterer forvirring og sorteringsproblemer dagligt.

## SmartPacks understøttelse

SmartPack's batch-algoritme genererer automatisk optimale batches baseret på geografisk lokationsoverlap og ordrekompleksitet. Systemet respekterer 8-16 ordrers-grænsen og skalerer batch-størrelse dynamisk baseret på volumen. Under peak season kan du manuelt justere batch-parametre eller lade systemet skalere automatisk. Scanning validerer hvert pluk og tildeler varen til korrekt ordre i realtid.

## FAQ

**Hvad er den optimale batchstørrelse?**
8-16 ordrer per tur er dokumenteret best practice. Dit præcise optimum afhænger af lagerlayout og ordrekompleksitet – mål din fejlrate ved forskellige størrelser.

**Kan man batch-picke ordrer med mange linjer?**
Det er muligt, men vanskeligt. Over 5 linjer per ordre er zone picking eller wave picking typisk mere effektivt.

**Hvad gør SmartPack ved batch-optimering?**
SmartPack bruger TSP-algoritmer (Traveling Salesman Problem) til at clustere ordrer med geografisk overlap og A*-pathfinding til at optimere ruterne inden for hvert batch.

**Hvordan undgår jeg sorterings-fejl?**
Scanner hvert pluk og lad WMS tildele det korrekte rum/kasse. Manuel sortering under tidspres er fejlkilden.

**Hvornår skal jeg skifte fra batch til wave picking?**
Når dit daglige volumen overstiger 500 ordrer med høj ordreLinje-kompleksitet. Wave picking koordinerer plukkere på tværs af zoner og egner sig til høj volumen.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Hvornår skal du outsource dit lager?](/viden/vaekst/hvornaar-skal-du-outsource-lager)
- [Cost per ordre](/viden/okonomi/cost-per-ordre)
- [3PL vs. eget lager](/viden/beslutning/3pl-vs-eget-lager)
