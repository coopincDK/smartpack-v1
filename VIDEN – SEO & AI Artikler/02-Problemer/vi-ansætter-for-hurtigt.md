---
primary_keyword: ansætte lagermedarbejdere for hurtigt
secondary_keywords: [lager overkapacitet, optimering før ansættelse, lager effektivitet, reducere lageromkostninger]
cluster: 02-Problemer
article_type: problem
---

# Vi ansætter for hurtigt – når flere folk ikke løser problemet

I har 9 plukkere. I håndterer 500 ordrer/dag. Cost per order: 67 kr.

Jeres konkurrent har 6 plukkere. De håndterer 680 ordrer/dag. Cost per order: 22 kr.

Forskellen: De har WMS. I har ikke.

I betaler 3 ekstra plukkere × 35.000 kr./md = 105.000 kr./md = 1.260.000 kr./år for at kompensere for manglende procesoptimering.

Denne artikel viser hvad I skal optimere FØR I ansætter den næste.

## Kort svar

> At ansætte for hurtigt opstår når virksomheden bruger ekstra hænder til at kompensere for ineffektive processer frem for at optimere. ABC-placering, batch picking og WMS kan frigive 2,6 FTE og spare over 360.000 kr. om året.

## Hvad mener vi med "ansætte for hurtigt"?

At ansætte for hurtigt betyder:
- Ansætte flere folk uden at optimere processer først
- Bruge flere hænder til at kompensere for ineffektive systemer
- Ikke måle picks/time per medarbejder
- Antage at "mere volumen = flere folk"

Resultat: Højere lageromkostninger end nødvendigt.

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

## Hvornår er det et problem?

At ansætte for hurtigt er et problem når:
- Picks/time per medarbejder er under 80
- Du ikke har lavet ABC-analyse
- Du ikke bruger batch picking
- Cost per order overstiger 45 kr.
- Du ansætter uden at måle effektivitet først

## Regnestykket: Optimering vs. ansættelse

**Scenarie: 500 ordrer/dag, 2,5 linjer/ordre = 1.250 picks/dag**

**Uden optimering:**
- Picks/time per medarbejder: 64
- Timer nødvendig: 1.250 / 64 = 19,5 timer
- Medarbejdere (7,4 timer/dag): 19,5 / 7,4 = **2,6 = 3 plukkere**
- Cost: 3 × 35.000 kr./md = **105.000 kr./md**

**Med ABC + batch picking + WMS:**
- Picks/time: 64 × 1,75 (gevinst) = 112
- Timer nødvendig: 1.250 / 112 = 11,2 timer
- Medarbejdere: 11,2 / 7,4 = **1,5 = 2 plukkere**
- Cost: 2 × 35.000 kr./md = **70.000 kr./md**

**Besparelse: 35.000 kr./md = 420.000 kr./år**

**Plus WMS cost: 60.000 kr./år**
**Netto besparelse: 360.000 kr./år**

## Hvad sker der i praksis

Volumen stiger fra 300 til 500 ordrer/dag. Lagerchefen ansætter 2 ekstra plukkere. Cost stiger med 70.000 kr./md.

Ingen spørger: Kan vi håndtere 500 ordrer med samme team hvis vi optimerer?

Svar: Ja. ABC-placering + batch picking havde givet +60% kapacitet uden ansættelse.

## Typiske fejl

**1. "Vi har ikke tid til optimering"**
Optimering tager 1 weekend (ABC) + 1 uge (batch picking). Ansættelse koster 420.000 kr./år. Hvad er dyrere?

**2. Ikke måle picks/time**
Hvis du ikke ved hvor effektive dine plukkere er, ved du ikke om problemet er kapacitet eller proces.

**3. Ansætte under peak**
Black Friday kræver ekstra hænder. Men hvis baseline-proces er ineffektiv, ansætter du for mange.

**4. Sammenligne med andre uden at kende deres processer**
"Konkurrenten har 10 plukkere" – men bruger de WMS? Batch picking? ABC?

## Sådan gør du det rigtigt

**1. Mål nuværende effektivitet**
- Picks/time per medarbejder
- Cost per order
- Gennemsnitlig gåafstand per pluk

**2. Optimer først**
- Dag 1: ABC-placering
- Uge 1: Batch picking
- Uge 2-4: WMS

**3. Mål efter optimering**
- Ny picks/time
- Ny cost per order
- Hvor mange ordrer kan teamet nu håndtere?

**4. Ansæt kun hvis nødvendigt**
Hvis optimeret team stadig ikke kan følge med: Ansæt.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Mål picks/time per medarbejder
- [ ] Beregn cost per order
- [ ] Lav ABC-analyse
- [ ] Implementer batch picking
- [ ] Mål ny picks/time
- [ ] Beregn hvor mange ordrer teamet nu kan håndtere
- [ ] Ansæt kun hvis gap stadig eksisterer

**Formel:** Kapacitet = Antal medarbejdere × Timer/dag × Picks/time / Linjer per ordre

**Næste skridt:** Læs "Forkert vareplacering" og "Vi bruger for meget tid på pluk" for optimeringsdetaljer.

## SmartPack understøttelse

SmartPack viser picks/time per medarbejder i realtid. Dashboard viser: Hvem er mest effektiv? Hvor meget kapacitet har vi? Kan vi håndtere 20% mere volumen uden ansættelse? Systemet besvarer spørgsmålet før du ansætter.

## FAQ

**Hvornår skal vi ansætte?**
Når optimeret team kører ved 95%+ kapacitet og volumen stiger yderligere.

**Hvad er god picks/time?**
80-100 uden WMS. 100-120 med WMS. Under 80: Optimer først.

**Kan vi fyre folk efter optimering?**
Du kan omfordele. Brug frigjort kapacitet til andre opgaver (cycle counting, returhåndtering).

**Hvad hvis vi allerede har ansat for mange?**
Optimer alligevel. Brug ekstra kapacitet til vækst i stedet for at ansætte igen.

**Hvordan måler vi cost per order?**
(Total lagerløn per dag) / (Ordrer per dag) = Cost per order.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Hvornår er Excel ikke nok?](/viden/beslutning/hvornaar-excel-fejler)
- [ROI på WMS](/viden/okonomi/roi-paa-wms)
- [Tjekliste før WMS](/viden/beslutning/tjekliste-foer-wms)
