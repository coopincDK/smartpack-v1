---
primary_keyword: reorder point
secondary_keywords: bestillingspunkt, hvornår genbestille, reorder point beregning, genbestillingspunkt
cluster: 01-Fundamentals
---

# Hvad er reorder point — og hvordan ved du præcis, hvornår du skal genbestille?

Du bestiller når du "husker det".
Du glemmer det.
Du er udsolgt i 3 dage.

3 dage × 20 stk. × 180 kr. = **10.800 kr. tabt**.

Reorder point er ikke gætteri.
Det er: dagligt salg × lead time + safety stock.
**Automatisk alarm** — før du løber tør.

---

## Hvad er reorder point?

**Reorder point** (ROP / bestillingspunkt / genbestillingspunkt) er det specifikke beholdningsniveau, der trigger en ny indkøbsordre. Når lagerniveauet falder til eller under reorder point, skal der bestilles.

Formlen er:

**Reorder Point = (Dagligt gennemsnitssalg x Lead time i dage) + Safety stock**

Eksempel:
- Dagligt salg: 15 stk.
- Lead time: 10 dage
- Safety stock: 30 stk.
- **ROP = 15 x 10 + 30 = 180 stk.**

Når beholdningen rammer 180 stk., bestilles der. Ordren ankommer (forhåbentlig) før safety stock tæres op.

---

## Hvornår er det et problem?

Reorder point er et problem, når:
- Det ikke er defineret — du bestiller, når du ”huskær” det
- Det er defineret, men aldrig opdateret siden opsætningen
- Safety stock er 0 i formlen
- Lead time er leverandørens estimat, ikke faktisk målt tid
- Du har ét reorder point for alle SKU'er uanset lead time og salgsvolumen

---

## Hvorfor det er vigtigt — i kroner

For sen genbestilling på en A-vare:
- 3 dages stockout x 20 stk./dag x 180 kr. margin = **10.800 kr.** i tabt margin
- Ekspresordre: +35% på 60 stk. x 80 kr. indkøbspris = 1.680 kr. ekstra

For tidlig genbestilling:
- 30 stk. overbeholdning x 80 kr. indkøbspris x 6% kapitalomkostning / 12 måneder = **12 kr./måned** pr. SKU — ganget med 200 SKU'er = 2.400 kr./måned i overkostning

Dårlige reorder points er et systemisk tab. Korrekte reorder points er et systemisk værn.

---

## Hvordan beregnes og opsættes reorder point i praksis?

### Trin 1: Find dagligt gennemsnitssalg
Brug de seneste 90 dages salgsdata. For saisonvarer: brug data fra tilsvarende sæson.

**Dagligt salg = total salg de seneste 90 dage / 90**

### Trin 2: Mål faktisk lead time
Brug WMS/ERP-data: hvornår blev ordren afsendt, hvornår ankom varen. Gennemsnit over de seneste 10 leverancer.

### Trin 3: Beregn safety stock
Se artiklen om safety stock for fuld formel. Simplificeret:
**Safety stock = 1,65 x standardafvigelse(dagligt salg) x sqrt(lead time)**

### Trin 4: Beregn ROP
**ROP = dagligt salg x lead time + safety stock**

**Eksempel — fuldt udregnet:**
- Dagligt salg: 8 stk. (gennemsnit 90 dage)
- Lead time: 12 dage (målt)
- Safety stock: 18 stk. (beregnet)
- **ROP = 8 x 12 + 18 = 114 stk.**

### Trin 5: Opsæt i WMS
Indtast ROP per SKU. WMS genererer alarm (eller automatisk bestillingsforslag) når beholdning rammer ROP.

### Trin 6: Revidér kvartalsvis
Salgsmønstre og lead times ændrer sig. Revidér top-20 SKU'er kvartalsvis, resten halvarsvis.

---

## Typiske fejl

**1. ROP er ikke defineret — der bestilles ad hoc**
Den mest udbredte fejl. Indkøb sker, når nogen husker det. Ingen systemisk sikring.

**2. Safety stock er 0 i formlen**
ROP = salg x lead time. Ingen buffer. Første forsinkede levering = stockout.

**3. ROP beregnet på årsgennemsnit — ikke aktuelle 90 dage**
Januars lave salg trækker ROP ned. Decembers høje salg er ikke afspejlet. ROP er for lav om jul.

**4. Ét samlet ROP for alle varianter**
ROP på ”T-shirt” i stedet for per SKU. Størrelse L løber tør, mens størrelse XS har overbeholdning.

**5. ROP opsættes én gang og glemmes**
Opsætning i 2022 med dengang-lead time og dengang-salg. Ingen revision. Tallene er foraltede.

---

## Sådan gør du det rigtigt

**1. ROP per SKU — altid**
Ingen aggregerede ROP'er. Hvert varenummer har sin egen beregning baseret på faktisk salg og faktisk lead time.

**2. Automatisk alarm i WMS**
Når beholdning rammer ROP: automatisk besked til indkøber. Ikke daglig manuel tjek.

**3. Differentiér både ROP og ordremengsætning**
ROP afgør hvornår du bestiller. Ordenmængden afgør, hvor meget du bestiller (Economic Order Quantity). Begge dele bør være beregnet, ikke guesspet.

**4. Juster ROP sæsonmæssigt**
4-6 uger før højsæson: hæv ROP (mere buffer). 4-6 uger efter: sænk ROP (slip overbeholdning).

**5. Mål, om ROP virker**
Antal stockouts per måned: er de nulstillet? Antal ekspresordrer: er de reduceret? ROP virker kun, hvis du måler outputtet.

---

## Hvornår du skal handle

- Du bestiller varer uden et systemdefineret trigger-punkt
- Du har haft stockouts de seneste 60 dage på A-varer
- Dine ROP'er er ikke opdateret de seneste 6 måneder
- Du bruger ét ROP for alle varianter af samme produkt
- Højsæson nærmer sig og dine ROP'er er ikke justeret

---

## Sådan understøtter SmartPack det

SmartPack understøtter reorder point-opsætning per SKU og genererer automatisk alarm når beholdning når ROP. Systemet viser salgshistorik og aktuel lead time per leverandør, så du har datagrundlaget til beregningen. Reorder point kan eksporteres og genberegnes kvartalsvis baseret på opdaterede tal.

---

## Brug denne artikel
- [ ] Beregn ROP for din vigtigste A-vare: dagligt salg x lead time + safety stock
- [ ] Tjek, om dit WMS i dag har definerede ROP'er for dine top-10 SKU'er
- [ ] Identificer, hvornår dine nuværende ROP'er sidst blev opdateret
- [ ] Næste skridt: Opsæt automatisk ROP-alarm i WMS for de 20 SKU'er med højest salgsvolumen

---

## FAQ

**Hvad er reorder point på dansk?**
Reorder point hedder bestillingspunkt eller genbestillingspunkt på dansk. Det er den beholdningsmængde, der trigger en ny indkøbsordre.

**Hvordan beregner jeg reorder point?**
ROP = dagligt gennemsnitssalg x lead time i dage + safety stock. Eksempel: 10 stk./dag x 7 dage + 20 stk. safety stock = 90 stk. ROP.

**Hvad er forskellen på reorder point og safety stock?**
Safety stock er bufferbeholdningen alene. Reorder point inkluderer både salgsdaekning i lead time-perioden og safety stock. Safety stock er en del af ROP-beregningen.

**Hvornår skal reorder point opdateres?**
Minimum kvartalsvis for A-varer. Halvarsvis for B/C-varer. Altid når lead time ændrer sig væsentligt eller salgsniveauet skifter.

**Kan jeg sætte reorder point automatisk i et WMS?**
Ja — alle professionelle WMS-løsninger understøtter ROP per SKU med automatisk alarm eller bestillingsforslag når beholdningen rammer niveauet.

