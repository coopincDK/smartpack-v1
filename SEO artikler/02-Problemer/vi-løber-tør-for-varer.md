---
primary_keyword: løber tør for varer lager
secondary_keywords: [stockout forebyggelse, refill limit beregning, genbestilling lager, inventory management]
cluster: 02-Problemer
---

# Vi løber tør for varer – når bestsellere er udsolgt

Din bestseller (TS-BLÅ-M) sælger 12 enheder/dag. Du har 40 på lager. Leverandør leverer om 5 dage.

Dag 4: Du er udsolgt. 8 kunder får "ikke på lager". 8 × 680 kr. = 5.440 kr. tabt omsætning. Plus: 3 af dem køber hos konkurrent og vender ikke tilbage. 3 × 2.400 kr. LTV = 7.200 kr. tabt.

Total cost af én stockout: 12.640 kr.

Ved 3 stockouts/måned: 37.920 kr./måned = 455.040 kr./år.

Denne artikel viser hvordan du beregner refill limit – og aldrig løber tør igen.

## Hvad er stockout?

Stockout betyder:
- Vare er udsolgt når kunde vil købe
- Genbestilling kom for sent
- Refill limit var sat for lavt
- Leverandør leverede for sent
- Salg steg pludseligt (viral produkt)

## Refill limit: Komplet beregning

**Formel:**
Refill limit = Dagligt salg × Leveringstid (dage) × Buffer-faktor

**Buffer-faktor:**
- 1,2 = Pålidelig leverandør (leverer til tiden 95%+)
- 1,5 = Normal leverandør (leverer til tiden 80-90%)
- 2,0 = Upålidelig leverandør (leverer til tiden under 80%)

**Eksempel:**
SKU: TS-BLÅ-M
- Dagligt salg: 12 stk.
- Leveringstid: 5 dage
- Leverandør: Normal (buffer 1,5)

Refill limit = 12 × 5 × 1,5 = **90 stk.**

**Handling:** Når beholdning falder til 90 stk., bestil ny batch.

## Hvad hvis leverandør ALDRIG leverer til tiden?

**Scenarie:**
Leverandør lover 5 dage. Leverer konsistent 8-10 dage.

Du sætter buffer til 2,0. Refill limit = 12 × 5 × 2,0 = 120 stk.

Men leverandør leverer 10 dage. Du løber stadig tør.

**Løsning:**
Brug FAKTISK leveringstid (ikke lovet):
- Gennemsnit sidste 6 leveringer: 9 dage
- Refill limit = 12 × 9 × 1,5 = **162 stk.**

**Alternativ:** Skift leverandør. En leverandør der konsistent fejler er en risiko.

## Hvornår er det et problem?

Stockout er et strukturelt problem når:
- Bestsellere er udsolgt mere end 1 gang/måned
- Du ikke har refill limit for hver SKU
- Genbestilling sker "når vi husker det"
- Leverandør-leveringstid ikke er dokumenteret
- Du ikke måler stockout-rate

## Regnestykket: Hvad koster stockout?

**Scenarie: 3 stockouts/måned, gennemsnitlig varighed 4 dage**

**Direkte tab:**
- Tabt salg: 3 × 4 dage × 12 enheder/dag × 680 kr. = **97.920 kr./måned**

**Indirekte tab:**
- 30% af kunder køber hos konkurrent permanent
- 30% × 144 kunder × 2.400 kr. LTV = **103.680 kr./måned**

**Total: 201.600 kr./måned = 2.419.200 kr./år**

**Med korrekt refill limit:**
- Stockout: 0,2 gange/måned (kun ved leverandør-fejl)
- Cost: 13.440 kr./måned = 161.280 kr./år

**Besparelse: 2.257.920 kr./år**

## Hvad sker der i praksis

Bestseller sælger 12/dag. Refill limit sat til 30 ("det plejer at være nok"). Leverandør leverer om 5 dage.

Dag 3: Udsolgt. 2 dages stockout. 24 tabte salg. 16.320 kr. tabt.

Ingen justerer refill limit. Næste måned: Samme problem.

## Typiske fejl

**1. Bruge "mavefornemmelse" i stedet for data**
"Vi bestiller når det ser lavt ud" er ikke en strategi.

**2. Samme refill limit for alle varer**
A-vare (12/dag) og C-vare (1/uge) kræver forskellige refill limits.

**3. Ignorere leverandør-variabilitet**
Leverandør lover 5 dage, leverer 8. Du planlægger efter 5. Fejl.

**4. Ikke opdatere refill limit ved salgsændringer**
Vare stiger fra 5/dag til 15/dag (viral). Refill limit opdateres ikke. Stockout.

## Sådan gør du det rigtigt

**1. Beregn refill limit for alle A-varer (dag 1)**
- Eksporter salgsdata sidste 90 dage
- Beregn gennemsnitligt dagligt salg per SKU
- Tjek leverandør-leveringstid (faktisk, ikke lovet)
- Beregn refill limit

**2. Sæt automatisk genbestilling (uge 1)**
- WMS sender alarm når beholdning < refill limit
- Eller: Automatisk genbestilling

**3. Mål stockout-rate (løbende)**
- Hvor mange gange/måned løber vi tør?
- Hvilke SKU'er?
- Juster refill limit

**4. Opdater kvartalsvis**
Salg ændrer sig. Refill limit skal opdateres.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificer top 20 mest solgte SKU'er
- [ ] Beregn dagligt salg per SKU (sidste 90 dage)
- [ ] Tjek faktisk leverandør-leveringstid
- [ ] Beregn refill limit for hver SKU
- [ ] Sæt alarm i WMS ved refill limit
- [ ] Mål stockout-rate månedligt

**Formel:** Refill limit = Dagligt salg × Leveringstid × Buffer-faktor

**Næste skridt:** Læs "Vores data er rod" og "Vi mangler overblik over lageret" for fuld kontrol.

## SmartPack understøttelse

SmartPack beregner automatisk refill limit baseret på salgshistorik og leverandør-data. Systemet sender alarm når beholdning nærmer sig refill limit. Dashboard viser: Hvilke varer risikerer stockout? Om hvor mange dage? Automatisk genbestilling kan aktiveres.

## FAQ

**Hvad hvis salg er meget variabelt?**
Brug højere buffer-faktor (2,0+). Eller: Beregn baseret på peak-salg i stedet for gennemsnit.

**Hvad med sæsonvarer?**
Beregn refill limit baseret på sæson-salg. Vinterjakke: Brug november-salg, ikke årsgennemsnit.

**Hvad hvis leverandør er upålidelig?**
Høj buffer-faktor (2,0+). Eller: Skift leverandør.

**Kan vi have for høj refill limit?**
Ja. For høj = for meget kapital bundet. Find balance mellem stockout-risiko og lageromkostning.

**Hvordan måler vi stockout-rate?**
(Antal stockouts per måned) / (Antal aktive SKU'er) = Stockout-rate.
