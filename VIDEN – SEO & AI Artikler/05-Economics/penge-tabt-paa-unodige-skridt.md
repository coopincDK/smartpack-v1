---
primary_keyword: penge tabt lager unodige skridt
secondary_keywords: [gangtid lager koster penge, ineffektiv plukrute, lager spildtid, gangtid optimering lager]
cluster: 05-Economics
article_type: økonomi
---

# Hvor mange penge du mister på unødige skridt

En lagermedarbejder går i gennemsnit 15-20 km om dagen på et mellemstort lager. Halvdelen af de skridt er unødige. Det er ikke et flid-problem — det er et layoutproblem og et rutineproblem. Og det koster dig mere end du regner med.

## Kort svar

Gangtid er den største skjulte omkostning på de fleste lagre. Den ses ikke på en faktura, men den udgjør 50-70% af den samlede tid brugt per ordre. Reducer gangtiden med 30%, og du kan håndtere 30% flere ordrer med det samme personale.

---

## Hvad et skridt koster

Lad os sætte tal på det.

**Medarbejderomkostning:** 250 kr./time inkl. sociale bidrag. Det er 4,17 kr./minut.

**Gangtid per ordre (uoptimeret lager):** 3-5 minutter i gange alene ved 200 ordrer/dag og et lager på 300 m².

**Gangtid per ordre (optimeret lager):** 1,5-2 minutter.

**Forskel per ordre:** 1,5-3 minutter = **6-12 kr. per ordre**.

**På 200 ordrer/dag:** 1.200-2.400 kr./dag = **300.000-600.000 kr./år** i spildt arbejdstid.

Det er penge du i princippet betaler for at gå frem og tilbage.

---

## De tre største kilder til unødige skridt

### 1. A-varer for langt væk

De 20% af dine varer der udgør 80% af dine ordrer (A-varer) er placeret tilfaldigt rundt på lageret. Plukkeren går langt for at hente dem mange gange om dagen.

**Konsekvens:** Hvert ekstra 10-15 meter per pluk ved 200 daglige ordrer på en A-vare = 2-3 km ekstra per dag.

**Løsning:** ABC-analyse. Sæt A-varerne i en zone der er max 5-10 meter fra pakkebordet.

### 2. Picklædsel sorteret forkert

Picklædslen er sorteret efter ordrenummer. Plukkeren går til gang C, derefter gang A, derefter gang C igen.

**Konsekvens:** Dobbelt og tredobbelt coverage af de samme ruter.

**Løsning:** Sorter altid picklædsler efter lokationsrækkefølge. Det koster 0 kr. at implementere.

### 3. Ingen batch-picking på single-line ordrer

Plukkeren håndterer 80 single-line ordrer på lokation A-01-02. Med individuelle runder: 80 ture til A-01-02. Med batch-picking: 4-6 ture.

**Konsekvens:** 74 unødige ture til samme lokation på en dag.

**Løsning:** Batch single-line ordrer (se artikel om orderopdeling).

---

## Beregn din gangtids-omkostning

Enkel model:

1. Tag din gennemsnitlige ordrehåndteringstid (minutter per ordre)
2. Estimér hvor 60% er gangtid (typisk)
3. Gangtid per ordre × ordrer per dag × 250 arbejdsdage × medarbejderrate (kr./min)

**Eksempel:** 4 min/ordre × 60% gangtid = 2,4 min. × 200 ordrer × 250 dage × 4,17 kr. = **498.000 kr./år i ren gangtid**.

---

## Hvad du kan gøre uden at flytte lageret

**Dag 1: Lav ABC-analyse.** Find dine 20 bedstsælgende varer. Flyt dem tættere på pakkebordet. Det tager en eftermiddag.

**Dag 2: Ret picklædsler.** Sortér picklædsler efter lokationsgang før print. Det tager et par minutter i din ordre-software.

**Uge 2: Indfør batch-picking på single-line ordrer.** Del ordrekøen i to. Pluk single-line ordrer samlet.

**Uge 3-4: Mål resultatet.** Hvad er den gennemsnitlige ekspeditionstid nu? Sammenlign med før.

---

## Hvad WMS gør automatisk

Et WMS beregner den optimale plukrute for hvert sats af ordrer (TSM-algoritme). Du behøver ikke tænke over sortering. Du behøver ikke batch manuelt. Det sker automatisk, hvert eneste sekund, for hvert eneste pluk.

Ved 200 daglige ordrer: typisk 25-40% reduktion i gangtid sammenlignet med manuelle ruter.

---

## Hvornår du skal handle

- Din gennemsnitlige ekspeditionstid er over 4 minutter per ordre
- Du mærker at kapaciteten ikke vokser selv om du ansætter flere
- Dine medarbejdere går mange ture til de samme lokationer på en dag
- Du har ingen ABC-analyse af din varoplacering

---

## FAQ

**Er gangtid virkelig så stor en del af lageromkostninger?**
For de fleste lagre er gangtid 50-70% af den totale tid brugt per ordre. Det er den største enkeltpost — men den eneste som sjeldent måles.

**Hvad er en god ekspeditionstid per ordre?**
Veloptimerede lagre med WMS og scanning: 2-3 minutter per ordre inkl. pakning. Manuelle lagre: 4-8 minutter.

**Kan jeg måle min gangtid uden dyrt udstyr?**
Ja. Tag tid på 10 ordrer med ur. Ikkeér pluk-til-pakke tid. Del med 10. Det er dit nuværende udgangspunkt.

## Læs også

- [Sådan reducerer du plukketid](/viden/drift/saadan-reducerer-du-plukketid)
- [ROI på lageroptimering](/viden/okonomi/roi-paa-wms)
- [De 7 fejl i plukning](/viden/drift/7-fejl-i-plukning)
