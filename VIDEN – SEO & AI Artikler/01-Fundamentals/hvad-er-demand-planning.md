---
primary_keyword: demand planning
secondary_keywords: lagerplanlaegning, forecasting lager, efterspørgselsplanlægning, lager forecast
cluster: 01-Fundamentals
---

# Hvad er demand planning — og hvordan undgår du at købe for meget eller for lidt?

Du bestiller 200 stk.
Du sælger 47.
De resterende 153 ligger i 8 måneder.
500.000 kr. bundet kapital × 6% = **30.000 kr./år tabt**.

Du bestiller for lidt af bestselleren.
3 dages stockout × 20 stk./dag × 200 kr. margin = **12.000 kr. tabt**.

Demand planning er forskellen.
Forecast baseret på data — ikke mavefølelse.
**748.200 kr./år** i undgået over- og underbeholdning.

---

## Hvad er demand planning?

**Demand planning** (efterspørgselsplanlægning) er processen med at forudsige fremtidig efterspørgsel på varer baseret på historisk salg, saisonudsving, kampagner og markedsforhold — og derefter tilpasse lager- og indkøbsplaner til den forventede efterspørgsel.

Demand planning er ikke gisning. Det er systematisk brug af data til at træffe bedre indkøbsbeslutninger.

Kerneværktøjer:
- **ABC-analyse**: Prioriter indkøbsfokus på de varer, der driver omsætningen
- **Saisonindeks**: Identificer, hvornår efterspørgslen stiger og falder
- **Lageromstætning**: Mål, hvor hurtigt beholdningen omsættes (mål: 4-8 gange/år)
- **Forecast-modeller**: Glidende gennemsnit, eksponentiel glætning, eller regel-baserede beregninger

---

## Hvornår er det et problem?

Demand planning er et problem, når:
- Du regelmæssigt er udsolgt på bestsellere, men har for meget på slow-movers
- Indkøb sker baseret på mavefølelse frem for data
- Sæsonskift overrasker dig (du har for lidt til jul, for meget i januar)
- Lageromstætningen er under 3 gange om året
- Du ikke har overblik over, hvilke varer der driver 80% af omsætningen

---

## Hvorfor det er vigtigt — i kroner

**For meget på lager:**
- Bundet kapital: 500.000 kr. overbeholdning x 6% kapitalomkostning = 30.000 kr./år tabt
- Spild ved udløb eller foreldelse
- Lagerpladsomkostning på overbeholdning

**For lidt på lager:**
- Tabt salg: Udsolgt A-vare i 3 dage x 20 stk./dag x 200 kr. margin = 12.000 kr. tabt
- Ekspresordrer til leverandør: premium-fragt og højere indkøbspriser
- Kundetab: kunder, der køber hos konkurrenten og måske ikke vender tilbage

En pakkefejl grundet forkert beh. koster ~350 kr. direkte. Men en manglende vare, der tvinger kunden væk, koster potentielt ~450-850 kr. i LTV-tab.

---

## Hvordan fungerer demand planning i praksis?

### Trin 1: ABC-analyse
Klassificer sortimentet:
- **A-varer**: Top 20% SKU'er, 80% af omsætning. Forecast med høj præcision.
- **B-varer**: Midterfelt. Månedlig gennemgang.
- **C-varer**: Lavt volumen. Simpel min/max-styring.

### Trin 2: Saisonanalyse
Sammelign omsætning per uge/måned over de seneste 2 år. Identificer:
- Højsæson (Black Friday, jul, sommer)
- Lavsæson (januar, august)
- Interne kampagneeffekter

### Trin 3: Forecast per SKU
For A-varer: beregn forventet salg per uge baseret på historik justeret for trend og saisonindex.

Forænkling: **Forecast = gennemsnitligt ugentligt salg x sæsonindex x trend-faktor**

### Trin 4: Beregn indkøbsbehov
**Indkøbsbehov = (forecast x lead time i uger) + safety stock - nuværende beholdning - åbne ordrer**

### Trin 5: Indkøbsordre og opfølgning
Generer indkøbsforslag per leverandør. Sammenlign modtaget vs. forventet. Justere forecast baseret på afvigelser.

---

## Typiske fejl

**1. Forecast baseret på årsgennemsnit — ikke sæson**
Du bestiller 4 ugers forvæntet salg. Men det er november og næste 4 uger er Black Friday. Du er udsolgt 3 dage inde.

**2. Ingen opfølgning på forecast-nøjagtighed**
Du forecaster, men måler aldrig, om du ramte rigtigt. Fejlmønstre gentages år efter år.

**3. Alle SKU'er behandles ens**
Samme forecast-logik på A-vare som på C-vare. A-varer kræver høj præcision, C-varer kan klares med simple min/max-regler.

**4. Lead time indregnes ikke**
Du bestiller, når du er ved at løbe tør. Men leveringstid er 3 uger. Du er udsolgt i 2 uger.

**5. Kampagner kommunikeres ikke til indkøb**
Marketing kører Black Friday-kampagne. Indkøb er ikke orienteret. Lager er tomt på dag 2.

---

## Sådan gør du det rigtigt

**1. ABC-analyse er startpunktet for alt**
Du kan ikke forecaste 500 SKU'er med samme nøjagtighed. Prioriter de 20%, der driver 80% af omsætningen.

**2. Brug 13 måneders historik som baseline**
13 måneder inkluderer ful årscyklus + én måned overlæg. Det fanger sæsoneffekter uden at gammel data overvægter.

**3. Mål forecast accuracy månedligt**
MAE (Mean Absolute Error) eller MAPE (Mean Absolute Percentage Error). Under 20% MAPE er godt for de fleste sortimenter.

**4. Sæt kampagnekalender i dit planlaeggingsværktøj**
Marketingkampagner bør være synlige i indkøbsplanlægningen. Minimum 4 uger forvarsel til leverandør.

**5. Lageromstætning er dit sundhedsmål**
Mål lageromstætning månedligt. Mål: 4-8 gange/år. Under 3 gange: for meget på lager. Over 10 gange: risiko for udsolgt.

---

## Hvornår du skal handle

- Din lageromstætning er under 3 gange/år
- Du har været udsolgt på A-varer de seneste 2 måneder
- Indkøbsbeslutninger tages uden datagrundlag
- Du har aldrig lavet en ABC-analyse af dit sortiment
- Black Friday/jul overraskede dig med for lidt på lager

---

## Sådan understøtter SmartPack det

SmartPack indeholder ABC-analyse og lageromstætningsrapporter som standardfunktioner. Systemet viser salgshistorik per SKU og signalerer automatisk, når reorder point nåes. Kombiner SmartPacks salgsdata med et forecast-værktøj eller ExcelKI for komplet demand planning-opsætning.

---

## Brug denne artikel
- [ ] Kør en ABC-analyse: sorter alle SKU'er efter omsætning de seneste 12 måneder
- [ ] Beregn din lageromstætning: vareforbrug 12 mdr. / gennemsnitlig lagerværdi
- [ ] Identificer de 5 SKU'er, du var udsolgt på de seneste 3 måneder
- [ ] Næste skridt: Sæt individuelle reorder points for dine top 10 A-varer baseret på lead time + safety stock

---

## FAQ

**Hvad er demand planning på dansk?**
Demand planning hedder efterspørgselsplanlægning på dansk — det er processen med at forudsige fremtidig efterspørgsel og tilpasse indkøb og lagerbeholdning derefter.

**Hvad er en god lageromstætning?**
For de fleste e-commerce virksomheder er 4-8 gange/år sundt. Under 3 gange indikerer overbeholdning; over 10-12 gange er der risiko for for mange stockouts.

**Hvad er ABC-analyse i lagerstyring?**
ABC-analyse klassificerer sortimentet i tre grupper: A-varer (20% af SKU'er, 80% af omsætning), B-varer (midterfelt) og C-varer (mange SKU'er, lille omsætning). Bruges til at prioritere indkøb og plads.

**Hvornår skal jeg forecaste og hvornår skal jeg bare bestille mere?**
For A-varer: forecast. For C-varer: min/max regler (bestil X når beholdning er under Y) er billigere og godt nok.

**Hvor langt frem skal jeg forecaste?**
Mindst én lead time frem — typisk 2-8 uger. For sæsonvarer: 8-12 uger før sæson for at sikre leverandørkapacitet.

