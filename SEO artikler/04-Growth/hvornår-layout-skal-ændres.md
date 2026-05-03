---
primary_keyword: hvornår lager layout skal ændres
secondary_keywords: lager redesign, lager layout optimering, flowoptimering lager, lagerlayout
cluster: 04-Growth
---

# Hvornår skal dit lagerlayout ændres?

Dit layout fungerede perfekt ved 50 ordrer/dag.
Ved 300 ordrer/dag koster det dig 127.000 kr./år.

A-varerne ligger bagerst.
Pakkestationen står i hjørnet.
Plukkerne går 9 km ekstra om dagen.

Det opdager de fleste først når plukketiden stiger 38%.
Og de ansætter en ekstra person i stedet for at flytte 20 varer.

420.000 kr./år i unødvendig løn.
Problemet var ikke kapacitet.
Det var 42 meter.

## Hvad er et lagerlayout?

Lagerlayout definerer, hvordan varer er organiseret i det fysiske rum: placering af reoler, gangstruktur, pakkestationer, modtagelsesareal og forsendelseszone. Et godt layout minimerer den tilbagelagte distance fra hylde til pakkestation og skaber logisk flow uden flaskehalse.

Et dårligt layout er ikke kun uhensigtsmæssigt – det er dyrt. Hvert unødigt skridt er tabt tid, og tabt tid er tabt penge.

## Hvornår er layoutet et problem?

Dit layout skal ændres, når:

- **Plukkere krydser hinandens veje** konstant – skaber ventetid og risiko for fejl
- **A-varerne er længst væk fra pakkestationen** – hver tur tager unødigt lang tid
- **Pakkestationer er flaskehalse** – kø ved pakkebordet trods god plukkapacitet
- **Modtagelsesarealet er for tæt på forsendelseszonen** – ind- og udgående varer blandes
- **Gangbredden er for smal til materialehåndtering** – trucks og vogne kan ikke passere hinanden
- **Sortimentet er vokset ud over layoutets logik** – nye produktkategorier er bare "sat et sted"

## Hvorfor det er vigtigt – i kroner

**Regnestykke: 300 ordrer/dag, 5 plukkere**

**Nuværende layout (uoptimeret):**
- Gennemsnitlig plukrute: 850m per tur
- Plukketid per ordre: 6,2 minutter
- Picks/time: 72 (langt under benchmark 102)
- 5 plukkere × 7,4 timer × 72 picks = 2.664 picks/dag
- 300 ordrer × 2,5 linjer = 750 picks nødvendige
- **Overskud: 1.914 picks/dag ubrugt kapacitet**

**Optimeret layout (A-varer frem, racetrack-gange):**
- Gennemsnitlig plukrute: 520m per tur (39% kortere)
- Plukketid per ordre: 3,8 minutter
- Picks/time: 110 (SmartPack-benchmark)
- 5 plukkere × 7,4 timer × 110 picks = 4.070 picks/dag
- **Kan håndtere 1.628 ordrer/dag med samme bemanding**

**Årlig besparelse:**
- Alternativt: Reducer fra 5 til 3,3 plukkere = **1,7 FTE sparet**
- 1,7 × 35.000 kr./md × 12 md = **714.000 kr./år**

**Hvad koster layout-ændringen:**
- 2 dage nedlukning (weekend): 0 kr. tabt omsætning
- Flytning af 180 SKU'er til A-zone: 16 timer arbejde = 3.200 kr.
- Ny reol-opsætning: 28.000 kr.
- **Total: 31.200 kr.**

**ROI: 16 dage.**

## Det opdager de fleste for sent

**Scenarie 1: "Bestselleren flytter – layoutet gør ikke"**
Webshop sælger sportsudstyr. December 2023: Yogamåtter er A-vare (placeret forreste reol). Marts 2024: Løbesko bliver ny A-vare (placeret bagerste reol, 42m fra pakkestation).

Layoutet opdateres ikke. Plukkere går 42m × 2 (frem og tilbage) = 84m ekstra per ordre med løbesko.

Løbesko i 60% af ordrer. 180 ordrer/dag × 60% = 108 ordrer × 84m = **9.072m ekstra dagligt** = 9 km.

En plukker går 4,5 km/h. 9 km / 4,5 = **2 timer spildt dagligt** = 400 kr./dag = **100.000 kr./år.**

De opdager det i august – efter 5 måneder. **Tabt: 41.600 kr.**

**Scenarie 2: "Pakkestationen er forkert placeret"**
Lager ved 280 ordrer/dag. Pakkestation placeret i hjørne (historisk: der var stikkontakt). Gennemsnitlig afstand fra pluk-slutpunkt til pakkestation: 28m.

280 ordrer × 28m × 2 (plukker skal tilbage) = 15.680m dagligt.

Flytter pakkestation til centrum. Ny gennemsnitsafstand: 11m.

280 ordrer × (28m - 11m) × 2 = 9.520m sparet dagligt.

9,52 km / 4,5 km/h = 2,1 timer sparet = **105.000 kr./år.**

Cost at flytte pakkestation: El-arbejde 8.400 kr. + 1 dags nedlukning (lørdag) = 8.400 kr.

**ROI: 29 dage.**

**Scenarie 3: "Sortimentet vokser – layoutet gør ikke"**
Webshop starter med 120 SKU'er. Layout designet til det. 18 måneder senere: 680 SKU'er.

Nye varer placeres "hvor der er plads" – ingen ABC-logik. Plukkere krydser deres egne spor 6-8 gange per batch.

Plukketid stiger fra 3,2 min/ordre til 5,8 min/ordre (81% stigning).

200 ordrer/dag × 2,6 min ekstra × 250 dage = 21.666 minutter = 361 timer = **72.200 kr./år tabt.**

De måler det ikke – de ansætter bare en ekstra plukker. **Cost: 420.000 kr./år i unødvendig løn.**

## Hvordan det fungerer i praksis

**Analyse-trin:**

1. **Mål eksisterende plukruter**: Brug WMS-data eller stopwatch. Hvad er gennemsnitlig tid per ordrelinje? Per ordre?

2. **Lav heatmap over plukhyppighed**: Hvilke lokationer plukkes mest? Er de tæt på pakkestationen?

3. **Kortlæg flow**: Tegn bevægelsesmønsteret for en gennemsnitlig arbejdsdag. Identificér unødige krydsninger og flaskehalse.

4. **Definér optimalt layout**: A-varer tæt på pakke, B og C bag efter. Pakkestationer ved forsendelseszonen. Modtagelse adskilt.

5. **Implementér gradvist**: Start med at flytte de 20 mest solgte varer. Mål forbedring.

**Gangstruktur:**
- Tværgange (racetrack-layout) giver hurtigere adgang til midterreoler
- Étvejsgange reducerer kollisioner
- Gennemgående gange til trucks holdes fri for plukaktivitet

## Typiske fejl

1. **Redesigner alt på én gang** – Et totalt layout-overhaul under drift er risikabelt. Gør det trinvis.

2. **Glemmer pakkestation-positionering** – Pakkestationen er endepunktet for al plukaktivitet. Dens placering er den vigtigste enkeltbeslutning i layoutet.

3. **Tilpasser ikke layout til sortiment** – Et layout designet til store kartonvarer fungerer ikke til småvarer med mange SKU'er.

## Sådan gør du det rigtigt

1. **Opdatér layout ved hvert volumen-breakpoint** – 50, 200 og 500 ordrer/dag er naturlige tidspunkter for layout-revision.

2. **Brug WMS-data til beslutninger** – Plukfrekvens per lokation er de data, du har brug for. SmartPack giver dig dem automatisk.

3. **Involver plukkerne i designet** – De bruger lageret 8 timer om dagen og har værdifuld viden om flaskehalse.

## Hvornår skal du handle?

**Nu** hvis plukketid per ordre er over 4 minutter og du ikke har kigget på layoutet de seneste 12 måneder.

**Inden peak** hvis gangstrukturen skaber kø og kaos under spidsbelastning.

**Planlagt** som del af WMS-implementering – det er det naturlige tidspunkt at redesigne med data.

## SmartPacks understøttelse

SmartPack genererer automatisk plukfrekvensdata per lokation. Du kan se, hvilke lokationer der plukkes 50 gange om dagen, og hvilke der plukkes én gang om ugen. Det er grundlaget for en datadrevet layout-beslutning. Systemets A*-pathfinding optimerer ruterne inden for dit nuværende layout – og ved en ny lokationsstruktur beregner det straks de nye optimale ruter.

## FAQ

**Hvor tit skal layout revideres?**
Minimum én gang om året, og ved hvert volumen-breakpoint. Nye produktkategorier er også signal for revision.

**Hvad er racetrack-layout?**
En gangstruktur med tværgange, der giver plukkere mulighed for at "snu" og tage den korteste vej. Velegnet til lagre med mange SKU'er.

**Skal jeg stoppe driften for at redesigne?**
Ikke nødvendigvis. Start med at flytte de mest plukede varer tæt på pakkestationen. Det kan gøres i weekenden uden driftsafbrydelse.

**Hjælper WMS med layout-design?**
Indirekte: WMS giver dig de data, du behøver for at træffe beslutningen – plukfrekvens, tidsdata, fejllokationer. SmartPack visualiserer det i realtid.

**Hvad er den største layout-fejl?**
At placere A-varer (højt omsatte) langt fra pakkestationen. Det er den kostbareste enkeltfejl i et lagerlayout.

