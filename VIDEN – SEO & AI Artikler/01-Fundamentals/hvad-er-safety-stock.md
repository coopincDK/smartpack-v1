---
primary_keyword: safety stock
secondary_keywords: bufferlager, sikkerhedslager beregning, safety stock formel, buffer beholdning
cluster: 01-Fundamentals
---

# Hvad er safety stock — og hvordan beregner du det korrekt?

Leverandøren lover 7 dage.
Den leverer dag 11.
Du har ingen buffer.

Du er udsolgt i 4 dage.
15 stk./dag × 4 dage × 200 kr. = **12.000 kr. tabt**.

Safety stock er ikke "for meget på lager".
Det er **beregnet forsikring** mod stockout — og billigere end tabet.

---

## Hvad er safety stock?

**Safety stock** (sikkerhedslager eller bufferlager) er en ekstra beholdning ud over den forventede salgsbeholdning, der holdes som buffer mod to former for usikkerhed:

1. **Efterspørgselsusikkerhed**: Salget er højere end forecastet i leveringstidsperioden
2. **Lead time-usikkerhed**: Leverandøren leverer senere end forventet

Safety stock er ikke dead stock. Det er ikke ”for meget på lager”. Det er en bevidst investering i servicegrad.

---

## Hvornår er det et problem?

**For lidt safety stock:**
- Stockouts når efterspørgslen topper eller leveringen forsinkes
- Ekspresordrer til leverandør til højere priser
- Tabte kunder

**For meget safety stock:**
- Kapital bundet unyttig i varer der ikke sælger
- Lagerplads brugt på buffer, der aldrig trigges
- Dyrere for slow-movers og varer med kort holdbarhed

**Safety stock på 0:** Du gætter på, at efterspørgsel og leveringstid altid er præcis som planlagt. Det er de ikke.

---

## Hvorfor det er vigtigt — i kroner

En stockout på en A-vare i 3 dage:
- Tabt salg: 15 stk./dag x 3 dage x 200 kr. margin = **9.000 kr.**
- Ekspresordre: +40% på indkøbspris af 45 stk. x 100 kr. = 1.800 kr. ekstra
- Kundetab: ukvantificerbart, men estimat ~450-850 kr. per tabt kunderelation

Ved 5 stockouts per måned på A-varer: **45.000 kr./måned i tabt margin** alene.

Sammen med fejlpakninger (~350 kr. direkte per fejl) er stockouts den største skjulte omkostning i lageroperation.

---

## Hvordan beregner du safety stock i praksis?

### Simpel metode (god til at komme i gang)

**Safety stock = Z x standardafvigelse af dagligt salg x sqrt(lead time i dage)**

Where Z er service level-faktoren:
- 90% servicegrad: Z = 1,28
- 95% servicegrad: Z = 1,65
- 99% servicegrad: Z = 2,33

**Eksempel:**
- Produkt X: gennemsnitligt dagligt salg = 10 stk.
- Standardafvigelse af dagligt salg = 3 stk.
- Lead time = 7 dage
- Ønsket servicegrad: 95% (Z = 1,65)

Safety stock = 1,65 x 3 x sqrt(7) = 1,65 x 3 x 2,65 = **~13 stk.**

### Udvidet metode (inkl. lead time-variation)

**Safety stock = Z x sqrt((lead time x varians af dagligt salg) + (dagligt salg)^2 x varians af lead time)**

Denne formel er vigtig, når leverandørens leveringstid varierer meget.

### Simpel tommelfingerregel
For hurtig opsætning: **Safety stock = gennemsnitligt dagligt salg x (halv lead time)**

Eksempel: 10 stk./dag x (7/2) = **35 stk.** Overestimerer lidt, men hurtig at beregne.

---

## Typiske fejl

**1. Samme safety stock hele året**
Sæsonændringer ændrer både salg og variation. Safety stock under Black Friday bør være højere end i januar.

**2. Safety stock beregnes på gennemsnit — ikke variation**
Den simple tommelfingerregel ”X dages salg” ignorerer, at variation er det, safety stock skal dække. To varer med samme gennemsnit kan have vidt forskellig variation.

**3. For høj servicegrad på alle SKU'er**
99% servicegrad på en C-vare er dyrt og unyttig. Sæt højere servicegrad på A-varer, lavere på C-varer.

**4. Safety stock opdateres aldrig**
Du beregnede safety stock for 2 år siden. Sortimentet, salgsniveauet og leverandørerne har ændret sig. Genberegn kvartalsvis.

**5. Safety stock og reorder point forveksles**
Safety stock er bufferbeholdningen. Reorder point inkluderer safety stock PLUS forventet forbrug i lead time-perioden. De er ikke det samme.

---

## Sådan gør du det rigtigt

**1. Beregn, gæt ikke**
Brug formlen. Selv den simple tommelfingerregel er bedre end mavefølelse. Kend dine tal: dagligt gennemsnit, standardafvigelse, lead time.

**2. Differentier servicegrad per ABC-kategori**
- A-varer: 95-99% servicegrad
- B-varer: 90-95%
- C-varer: 80-90%

**3. Juster for saisonudsving**
Forøg safety stock 4-6 uger før højsæson. Sænk den gradvist i lavsæson for at frigive kapital.

**4. Revidér kvartalsvis**
Salgsmønstre og lead times ændrer sig. Kvartalsvise genberegninger er minimum — månedlig for A-varer.

**5. Mål actual service level**
Hvor tit var du faktisk udsolgt per SKU per måned? Det mål fortæller, om din safety stock holder. Ikke en rettelse bagud — en kalibrering fremad.

---

## Hvornår du skal handle

- Du har haft stockouts på A-varer de seneste 2 måneder
- Du har ingen formel for safety stock — det er et skøn
- Din lageromstætning er lav, men du har stadig stockouts (forkert mix)
- Sæson nærmer sig og du er usikker på beholdningsniveauer
- Du bruger samme safety stock-niveau for alle SKU'er

---

## Sådan understøtter SmartPack det

SmartPack registrerer salgshistorik og lead time per SKU, der danner databæren for safety stock-beregning. Systemet viser aktuel beholdning vs. reorder point og kan konfigureres til automatisk advarsel, når safety stock nærmes. Eksport af salgsdata gør det nemt at beregne standardafvigelse og opdatere safety stock i dit indkøbsværktøj.

---

## Brug denne artikel
- [ ] Find standardafvigelsen på dagligt salg for dine top 5 A-varer (brug 90 dages salgsdata)
- [ ] Beregn safety stock for én A-vare: Z x stdev(dagligt salg) x sqrt(lead time)
- [ ] Sammenlign med din nuværende faktiske buffer-beholdning — er der forskel?
- [ ] Næste skridt: Opsæt differentieret servicegrad per ABC-kategori og genberegn safety stock

---

## FAQ

**Hvad er safety stock på et lager?**
Safety stock er en ekstra bufferbeholdning ud over forventet salgsbeholdning, der holdes for at undgå stockout når efterspørgslen overstiger forecast eller leveringen forsinkes.

**Hvordan beregner jeg safety stock?**
Simplest: Safety stock = Z-værdi (servicegrad) x standardafvigelse dagligt salg x kvadratrod af lead time. For 95% servicegrad: Z = 1,65.

**Hvad er forskellen på safety stock og reorder point?**
Safety stock er bufferbeholdningen. Reorder point = (dagligt salg x lead time) + safety stock. Reorder point inkluderer safety stock som en del af beregningen.

**Hvornår skal jeg øge safety stock?**
Før højsæson, når lead time-variation stiger, når salgsvar-iationen stiger, eller når du skifter leverandør.

**Koster safety stock ikke bare penge?**
Ja — og det er en bevidst investering i servicegrad. Kapitalomkostningen af safety stock er lavere end kostprisen på stockout og tabte kunder. Beregn break-even: hvad koster stockout vs. hvad koster bufferbeholdningen?

