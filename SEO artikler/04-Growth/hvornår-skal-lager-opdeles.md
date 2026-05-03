---
primary_keyword: hvornår skal lager opdeles
secondary_keywords: lageropdelinger, zone lager, ABC-analyse lager, lagerstruktur
cluster: 04-Growth
---

# Hvornår skal dit lager opdeles i zoner?

Et enkelt lager med varer spredt tilfældigt fungerer til en vis størrelse. Herefter koster det tid – og penge – at lade det forblive ustruktureret. Zone-opdeling er en af de hurtigste måder at øge picks/time på.

## Hvad er zone-opdeling?

Zone-opdeling betyder, at du inddeler dit lager i logiske områder baseret på, hvad der plukkes mest, hvad der vejer mest, eller hvad der hører naturligt sammen. Den mest kendte model er ABC-analyse:

- **A-varer**: Høj omsætning, placeres tættest på pakkestationen
- **B-varer**: Middel omsætning, midterzone
- **C-varer**: Lav omsætning, bagest i lageret

Andre zoneopdelinger: temperaturzoner, størrelseszoner, farlige varer, sæsonvarer.

## Hvornår er det et problem?

Zoneløst lager begynder at koste for meget, når:

- Du har over **200 SKU'er** og plukketiden er over 3 minutter per ordre
- **A-varer** udgør over 20% af dine ordrelinjer, men er spredt tilfældigt
- Medarbejdere tilbagelægger unødige kilometer pr. vagtdag
- Du har **sæsonvarer**, der ikke skifter placering i off-season
- Onboarding af nye medarbejdere tager over én dag, fordi lageret er uoverskueligt

## Hvorfor det er vigtigt – i kroner

Plukketid er penge. En medarbejder koster ~200 kr./time. Hvis du plukker 102 linjer/time (industri gns. 2025) uden optimering og 110 linjer/time med, er forskellen:

- 110 vs. 102 picks/time (industri gns. 2025) = 37% effektivitetsstigning
- På 200 pluk/dag: 1,8 timers forskel = 360 kr./dag = **90.000 kr./år per medarbejder**

Zone-opdeling alene kan give 15-25% effektiviseringsforbedring uden at ansætte en ekstra person.

Hertil kommer fejlreduktion: Klare zoner giver mere overskuelige plukruter, og med A*-pathfinding i SmartPack plukkes den korteste rute automatisk.

## Hvad koster det at vente 6 måneder med zone-opdeling?

Ved 200 ordrer/dag uden ABC-zoner:
- Ekstra plukketid: 1,8 timer/dag × 200 kr. × 125 dage = **45.000 kr.**
- Kunne have implementeret zone-opdeling på 2 dage (cost: 8.000 kr.)
- **Forskel: 37.000 kr. tabt**

Ved 500 ordrer/dag:
- Ekstra plukketid: 90.000 kr./år × 0,5 = **45.000 kr. tabt på 6 måneder**

**Black Friday uden zone-opdeling:**
Ved 500 ordrer/dag normal = 3.000 ordrer/dag Black Friday. A-varer (20% af sortiment, 80% af ordrer) er spredt tilfeldig. Plukkere krydser deres egne spor 8-12 gange per batch. Plukketid stiger 60%. Skal rekruttere 8 ekstra vikarer (i stedet for 4). **Ekstra cost: 180.000 kr. på 3 uger**.

## Hvordan det fungerer i praksis

**Trin 1:** Lav ABC-analyse på dine varer. De fleste e-commerce webshops vil finde, at 20% af varerne står for 80% af ordrerne (Pareto).

**Trin 2:** Placer A-varer i den zone, der kræver mindst bevægelse fra pakkestationen. Typisk de første 5-10 reoler fra pakkebordet.

**Trin 3:** Definer klare gangnavne og lokationskoder. Et WMS som SmartPack bruger lokationskoder (fx A-01-03) til at guide plukker præcist.

**Trin 4:** Opdater logik kvartalsvis. Sæsonvarer skal rykkes frem forud for sæson.

**Trin 5:** Mål picks/time før og efter. Forvent 15-25% forbedring.

## Typiske fejl

1. **Opdeler én gang og glemmer det** – Sortiment og salgsmønstre ændrer sig. A-varer fra i fjor er måske C-varer i dag. Zone-opdeling skal vedligeholdes.

2. **For mange zoner** – Tre til fem zoner er normalt nok. 15 zoner skaber forvirring og fejl.

3. **Glemmer at kommunikere ændringer til personalet** – En ny zone er ubrugelig, hvis medarbejderne ikke ved den eksisterer.

## Sådan gør du det rigtigt

1. **Start med ABC** – Det er den enkleste opdeling og giver typisk størst effekt. Analyser dine ordredata for de seneste 90 dage.

2. **Brug WMS til at håndhæve zonelogikken** – Manuel zone-opdeling holder ikke under spidsbelastning. WMS sikrer, at plukker guides til den rigtige zone automatisk.

3. **Planlæg zone-revision forud for peak season** – Opdater A-varernes placering 4-6 uger inden Black Friday eller anden spidsbelastning.

## Hvornår skal du handle?

**Med det samme** hvis plukketid per ordre er over 4 minutter og sortimentet er over 200 SKU'er.

**Inden næste sæson** hvis du aldrig har lavet en ABC-analyse på dit lager.

**Som del af WMS-implementering** – det er det naturlige tidspunkt at redesigne lagerstrukturen.

## SmartPacks understøttelse

SmartPack håndterer zone-opdeling som en kernefunktion. Systemet bruger A*-pathfinding til at beregne optimal plukrute på tværs af zoner og opdaterer automatisk, hvilke varer der er A-varer baseret på salgsdata. Du kan definere zoner og lokationskoder direkte i systemet, og plukkerne guides via mobilscanner til den korteste rute.

## FAQ

**Hvor mange zoner er optimalt?**
Typisk 3-5. ABC-zoner (3) er udgangspunktet. Tilføj temperatur- eller størrelseszoner, hvis dit sortiment kræver det.

**Skal jeg flytte alle varer på én gang?**
Nej. Start med at flytte dine 20 mest solgte varer tæt på pakkestationen. Det giver størstedelen af gevinsten med minimalt besvær.

**Kan SmartPack styre zoner automatisk?**
Ja. SmartPack kan konfigureres til automatisk at anbefale zone-ændringer baseret på salgsdata.

**Hvad hvis lageret er for lille til zoner?**
Selv på et lille lager kan du organisere A-varer tæt på udgangen. Det handler om logik, ikke kvadratmeter.

**Hvor lang tid tager det at implementere zone-opdeling?**
En simpel ABC-zone-opdeling kan gennemføres på 1-2 dage. Med WMS er opsætning og lokationskodning typisk klaret på en dag.
