---
primary_keyword: opdel ordrer lager
secondary_keywords: [single line ordrer, multi-line ordrer, ordretyper lager, batch picking single multi, ordreflow lager]
cluster: 03-Operations
article_type: guide
---

# Sådan opdeler du ordrer – single vs. multi-line

Jeres plukker brugte 6 timer i går på 180 ordrer. 120 af dem var single-line — én vare per ordre. Han gik 120 gange til de samme 15 hylder. Hvis han havde batched dem, havde han gået 12 gange. Det er forskellen på 4 timers arbejde og 6 timers arbejde — med samme antal ordrer. Denne artikel viser hvordan du opdeler ordrer så du får 30-40% mere kapacitet uden at ansætte.

## Kort svar

Single-line ordrer (1 vare) bør samles i batches og plukkes af samme person på én runde. Multi-line ordrer kræver en individuel plukrute. Behandler du dem ens, går du glip af 20-40% kapacitetsgevinst der ikke koster noget.

---

## Hvad er en single-line ordre?

En ordre med én ordrelinje: kunden har købt ét produkt (eller én variant i ét antal). Eksempel: 1 stk. blå T-shirt i str. M.

**Karakteristik:** Hurtig at plukke. Lav kompleksitet. Egner sig til batch-picking.

## Hvad er en multi-line ordre?

En ordre med to eller flere ordrelinjer: kunden har købt forskellige produkter eller varianter. Eksempel: blå T-shirt + hvide sokker + kasket.

**Karakteristik:** Kræver besog på flere lokationer. Højere fejlrisiko. Egner sig til individuel plukrute.

---

## Hvorfor det er vigtigt at behandle dem forskelligt

**Scenarie:** Du har 200 ordrer. 140 er single-line. 60 er multi-line.

Hvis du behandler alle 200 ens (individuelle plukruter): hver ordre får sin egen runde. Du går 200 gange til samme hylder.

Hvis du batcher de 140 single-lines: du går til hvert lokation én gang og henter 8-10 enheder. Du går 20 runder i stedet for 140. Kapacitetsgevinst: 60-70% på den mængde.

**I kroner:** 120 sparede runder × 2 min/runde × 4,17 kr./min = **1.000 kr./dag = 250.000 kr./år** i arbejdstid.

## Hvad der går galt uden opdeling

Mandag morgen. 220 ordrer i køen. Alle behandles ens. Plukker starter kl. 8. Kl. 14 er han stadig ikke færdig. Cut-off til fragtfirma er kl. 15. 40 ordrer når ikke med. Kunder får mail om forsinkelse. 12 af dem annullerer.

**Tab: 18.000 kr. i omsætning + dårlige reviews.** Ikke fordi plukker er langsom — fordi single-line-ordrer ikke var batched.

---

## Single-line: batch-picking

Batch-picking er den rigtige metode til single-line ordrer. Du samler 10-20 ordrer der alle indeholder den samme eller nærtliggende varer og plukker dem i én runde.

**Opsætning:**
1. Sorter indkomne ordrer efter ordrelinjeantal
2. Isoler alle single-line ordrer
3. Sorter dem efter vare-lokation
4. Send plukkeren afsted med samlet picklædsel

**Begrænsning:** Kasse-sortering. Med 20 ordrer i en runde skal plukkeren have 20 separate kasser — eller en tote med skillerum. Løsningen er plukkevogne med nummererede rum.

---

## Multi-line: individuel plukrute

Multi-line ordrer klæber sig til individuelle plukruter. Hvert pluk er en del af den samme ordre, og rækkefølgen skal være optimeret.

**Optimeret plukrute:** WMS'et genererer ruten så medarbejderen bevæger sig i én retning gennem lageret uden at vende tilbage. Uden WMS: sorter picklædslen manuelt efter lokationsrækkefølge før print.

**Zone-picking som alternativ:** For store lagre kan multi-line ordrer deles på tværs af zoner. Medarbejder A plukker fra zone 1, B fra zone 2. Ordrerne samles ved pakkebordet. Reducerer gangtid markant.

---

## En tredje type: udgåede varer og hasteordrer

**Hasteordrer** (B2B-ordrer, presseordrer, VIP-kunder): behandles altid enkeltvis og prioriteres over den normale kø. Sæt dem i et separat spor.

**Udgåede varer/backorder:** Ordrer med varer der ikke er på lager skal isoleres automatisk så de ikke blokerer normale ordrer i køen.

---

## Praktisk implementering uden WMS

Har du ikke et WMS endnu, kan du lægge grundstrukturen manuelt:

1. Print alle ordrer morgen kl. 7
2. Sæt dem i to bunker: single-line og multi-line
3. Sorter single-line-bunken efter varekode/lokation
4. Pluk al single-line først i én samlet runde
5. Kør derefter multi-line individuelt

Det tager 10 minutter at opsætte. Det sparer 1-2 timer om dagen ved 150+ ordrer = **125.000-250.000 kr./år i arbejdstid**.

---

## Hvad WMS gør automatisk

Et WMS som SmartPack kategoriserer automatisk:
- Ordrer efter linjeantal
- Prioritet (hastemarked, cut-off tid, forsendelsestype)
- Plukkemetode (batch, individuel, zone)

Du behøver ikke tænke over det. Du får bare de rigtige opgaver i den rigtige rækkefølge.

---

## Hvornår du skal handle

- Du behandler alle ordrer ens uanset kompleksitet
- Din gennemsnitlige ekspeditionstid stiger når ordrevolumet stiger (det burde det ikke)
- Medarbejdere går gentagne gange til de samme lokationer på separate ture
- Du har hasteordrer der blandes med normale ordrer

---

## FAQ

**Hvornår er batch-picking en fordel?**
Når du har mindst 20-30% single-line ordrer og et dagligt volumen over 50 ordrer. Under det er gevinsten marginal.

**Kan zone-picking bruges på et lille lager?**
Kun hvis lageret er fysisk opdelt i distinkte zoner med klare grænser. På et lille lager under 100 m² giver det sjeldent mening.

**Hvad gør jeg med ordrer der har både single- og multi-line?**
Behandl dem som multi-line. En ordre er så kompleks som dens svagreste led.

## Læs også

- [Batch picking guide](/viden/drift/batch-picking-guide)
- [De 7 fejl i plukning](/viden/drift/7-fejl-i-plukning)
- [Sådan reducerer du plukketid](/viden/drift/saadan-reducerer-du-plukketid)
