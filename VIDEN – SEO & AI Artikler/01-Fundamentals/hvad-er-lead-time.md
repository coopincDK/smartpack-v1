---
primary_keyword: lead time
secondary_keywords: leveringstid lager, lead time beregning, leverandør lead time, indkøb leveringstid
cluster: 01-Fundamentals
---

# Hvad er lead time — og hvorfor koster det dig penge, hvis du undervurderer den?

Leverandøren lover 5 dage.
Den faktiske tid er 9 dage.
Du bestiller for sent.

Du er udsolgt i 1 uge.
20 stk./dag × 7 dage × 150 kr. = **21.000 kr. tabt**.

Lead time er ikke leverandørens estimat.
Det er din målte virkelighed — eller din tabte margin.

---

## Hvad er lead time?

**Lead time** (leveringstid) er den samlede tid fra en indkøbsordre afsendes til varen er tilgængelig til salg på lageret. Lead time inkluderer:

1. **Ordrebehandling hos leverandør**: tid fra bestilling til afsendelse (1-5 dage)
2. **Transporttid**: fra leverandør til dit lager (1-21+ dage afh. af geografi)
3. **Modtagelse og put-away**: tid fra ankomst til vare er registreret og tilgængelig (0,5-2 dage)

**Total lead time = ordrehåndterings-tid + transporttid + modtagelsestid**

For en dansk leverandør kan det være 3-7 dage. For en kinesisk leverandør 30-60 dage.

---

## Hvornår er det et problem?

Lead time er et problem, når:
- Du bestiller for sent og er udsolgt mens ordren er undervejs
- Lead time varierer meget og du ikke har buffer for det
- Du bruger leverandørens estimat og ikke den målte, faktiske lead time
- Dine reorder points er beregnet på forkert lead time
- Saisonkrav ikke er planlagt 1-2 lead times i forvejen

---

## Hvorfor det er vigtigt — i kroner

Et udsolgt A-produkt i én uge koster direkte:
- Tabt salg: 20 stk./dag x 7 dage x 150 kr. margin = **21.000 kr.** i tabt margin
- Kundetab: Kunder der køber hos konkurrenten — måske for altid
- Ekspresordre til leverandør: +30-50% på indkøbspris + ekspresfragt

Af samme grund — når en ordre er forkert og må returneres: ~350 kr. direkte, ~450-850 kr. inkl. LTV-tab. Lead time-fejl skaber stockouts, der i praksis svarer til at have en fejllevering — bare foran din hele kundebase på én gang.

---

## Hvordan fungerer lead time-beregning i praksis?

### Trin 1: Mål faktisk lead time per leverandør
Brug historiske data: hvornår sendte du ordren, hvornår ankom varen? Gennemsnit + standardafvigelse. Leverandørens estimat er ikke dit tal.

**Eksempel:**
- Leverandør A: gennemsnit 8 dage, standardafvigelse 2 dage
- Leverandør B: gennemsnit 14 dage, standardafvigelse 6 dage

### Trin 2: Brug lead time i reorder point-beregning
**Reorder point = dagligt salg x lead time (dage) + safety stock**

For leverandør A (8 dage) og 10 stk. dagligt salg + 20 stk. safety stock:
- Reorder point = 10 x 8 + 20 = **100 stk.**

Når beholdningen rammer 100 stk., bestilles der.

### Trin 3: Juster for lead time-variation
For leverandører med høj variation (leverandør B: +/-6 dage): brug den øvre del af intervallet i safety stock-beregningen. Leverødør B bør behandles som 20 dages lead time i sikkerhedsbeholdningsberegning.

### Trin 4: Revidér lead time kvartalsvis
Leverings-performance ændres. En leverandør, der var pålidelig for 6 måneder siden, kan være upotilædelig i dag. Mål løbende.

---

## Typiske fejl

**1. Du bruger leverandørens opgivne lead time**
Leverandøren siger 5 dage. Den faktiske tid er 9. Din reorder point er for lav.

**2. Lead time antages konstant**
Lead time varierer — saisonmæssigt (leverandørens kapacitet under højsæson), geografisk (vejrforsinkelser, havneforsinkelser), og hurtigt (leverandørskift, produktionsforsinkelse). Antag variation.

**3. Modtagelsestid regnes ikke med**
Varen ankommer fredag eftermiddag. Lørdag sker der intet. Mandag morgen put-away. Tirsdag er den tilgængelig. 4 ekstra dage, du ikke regnede med.

**4. Alle leverandører har samme reorder point-logik**
En leverandør med 3 dages lead time og en med 30 dages bør have vidt forskellige reorder points. Standardiser aldrig på tværs.

**5. Lead time for saisonvarer er ikke planlagt**
Black Friday: du bestiller i uge 45. Kinesisk leverandør: 35 dages lead time. Du er udsolgt i uge 43.

---

## Sådan gør du det rigtigt

**1. Mål faktisk lead time per leverandør — ikke leverandørens estimat**
Brug WMS/ERP data: ordre afsendt x, vare modtaget y. Beregn gennemsnit og standardafvigelse over de seneste 12 leverancer.

**2. Brug lead time + variation i safety stock**
Safety stock bør kompensere for lead time-variation, ikke kun gennemsnittet. Se artiklen om safety stock for fuld beregning.

**3. Automatiske reorder point-alarmer**
WMS bør advare automatisk, når beholdning rammer reorder point. Ingen manuel opfølgning.

**4. Revidér lead times kvartalsvis**
Kompilér leveringsdata per leverandør og opdater reorder points. Det tager 30 minutter og sparer måneders stockout-frustration.

**5. Planlæg saisonbehov 2 lead times i forvejen**
Black Friday-lager bestilles minimum 2 x lead time før kampagnestart for at have buffer på forsinkelse.

---

## Hvornår du skal handle

- Du har været udsolgt på en A-vare de seneste 60 dage
- Du bruger leverandørens estimerede lead time, ikke målt faktisk lead time
- Dine reorder points er ikke opdateret siden systemet blev sat op
- Lead time varierer mere end +/-50% fra gennemsnittet
- Du nærmer dig højsæson og har ikke planlagt ekstra beholdning

---

## Sådan understøtter SmartPack det

SmartPack registrerer ordretidspunkt og modtagelsestidspunkt per leverandør, så faktisk lead time er altid målbar. Systemet kan opsaettes med automatiske reorder point-alarmer per SKU baseret på dagligt salg og konfigureret lead time. Lead time-data eksporteres per leverandør til brug i indkøbsplanlægning.

---

## Brug denne artikel
- [ ] Identificer dine top 3 leverandører og mål faktisk gennemsnitlig lead time fra data
- [ ] Sammenlign med de lead times, du bruger i dine reorder point-beregninger
- [ ] Beregn korrekt reorder point for din største A-vare: dagligt salg x lead time + safety stock
- [ ] Næste skridt: Opsæt automatisk reorder point-alarm i dit WMS for top-10 A-varer

---

## FAQ

**Hvad er lead time på et lager?**
Lead time er den samlede tid fra en indkøbsordre sendes til varen er tilgængelig på lageret — inkl. leverandørens ordrebehandling, transporttid og modtagelsestid.

**Hvad er normal lead time fra Kina?**
See-fragt fra Kina er typisk 25-40 dage. Luftfragt 5-10 dage. Dertil kommer ordrebehandling hos leverandøren (3-15 dage) og modtagelsestid. Total: 30-60 dage for søfragt.

**Hvad er forskellen på lead time og leveringstid til kunden?**
Lead time er din tid fra indkøbsordre til vare på lager. Leveringstid til kunden er din tid fra kundeordre til levering. To vidt forskellige mål.

**Hvordån påvirker lead time mit safety stock?**
Safety stock skal dække usikkerhed i både efterspørgsel og lead time. Højere lead time-variation kræver højere safety stock. Se artiklen om safety stock.

**Kan lead time reduceres?**
Ja — ved at vælge leverandører tættere på, indgå VMI-aftaler (vendor managed inventory), forkorte ordrebehandlingstid eller skifte til luftfragt for kritiske varer.

