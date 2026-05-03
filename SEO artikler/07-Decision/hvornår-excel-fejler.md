---
primary_keyword: hvornår Excel fejler til lagerstyring
secondary_keywords: Excel lager problemer, Excel webshop begrænsninger, Excel fejler lagerstyring, Excel vs WMS
cluster: 07-Decision
---

# Hvornår fejler Excel som lagerstyring?

Excel er det mest brugte "lagersystem" i verden. Det er gratis, fleksibelt og alle kender det. Men Excel er designet til dataanalyse – ikke til operationel lagerstyring. Der er et punkt, hvor Excel fejler – og det sker næsten altid på det værst tænkelige tidspunkt.

## Hvad bruger folk Excel til på lageret?

- Lagerbeholdning per varenummer
- Ordreregistrering og ordreopdatering
- Pluklister (manuelt udskrevet)
- Lager-lokationer (hyldekort i regneark)
- Leverandørordrer og modtagelse

Alle disse processer fungerer – med disciplin og lavt volumen. Men funktionerne er manuelt vedligeholdt, og det er her problemer opstår.

## Excel fejler ved disse scenarier

### Scenarie 1: Over 50 ordrer/dag med kompleksitet
Excel kræver manuel opdatering per ordrelinje. Ved 50 ordrer/dag med 3 linjer per ordre er det 150 manuelle opdateringer om dagen. Fejlrate: 3–8% ved manuel opdatering.

### Scenarie 2: Mere end én person redigerer
To medarbejdere i samme Excel-fil samtidigt = konflikt. En opdaterer lageret, den anden tæller. Hvem vinder? Excel håndterer ikke samtidige brugere.

### Scenarie 3: Serienumre eller batch-tracking
Excel kan i princippet håndtere serienumre – men det er et vedligeholdelsesnightmare. En fejlindtastning korrumperer sporbarhedskæden.

### Scenarie 4: Sæsonpeak
Under Black Friday tredobles volumen. Excel-processen tredobles i tidsforbrug og fejlrisiko. Et system der tager 30 minutter dagligt tager nu 90. Og fejl fordobles.

### Scenarie 5: Ny medarbejder
En ny medarbejder kender ikke Excel-strukturen. Et fejltastet "0" i en celle kan slette en hel beholdning. Excel har ingen scanning, ingen bekræftelse, ingen undo-mekanisme for reelle lagerbevægelser.

### Scenarie 6: Realtids-synkronisering
Excel er ikke forbundet til din webshop. Lager opdateres på et tidspunkt efter ordre er modtaget. I mellemtiden kan du oversælge.

## Konkret regnestykke: Excel-fejlenes pris

| Excel-fejltype | Frekvens (typisk) | Omkostning per hændelse | Månedlig tab |
|---------------|-------------------|------------------------|-------------|
| Forkert vare sendt (plukfejl) | 2–3% af ordrer | 350 kr. (direkte) / 450–850 kr. (inkl. LTV) | 3.500–8.500 kr. (50 ord/dag) |
| Oversalg (lagermismatch) | 1–2 gange/uge | 200–500 kr. i refusion + kundeservice | 1.600–4.000 kr. |
| Medarbejder-vedligehold Excel | 45–60 min/dag | 150 kr./time | 5.625–7.500 kr./måned |
| Fejl ved ny medarbejder (43% turnover) | 30.000–50.000 kr./ansættelse | — | |

**500 ordrer/dag med Excel**: ~700.000 kr./år i fejlomkostninger alene. Dertil vedligeholdstid og tabt kundeLTV.

## Hvad det koster

Excel-fejl er typisk:
- **Oversalg**: Kunder bestiller varer der ikke er på lager → returnerede ordrer, refusioner, dårlige anmeldelser
- **Forkerte forsendelser**: Forkert vare plukket → returforsendelse + ny sending = ~350 kr. per tilfælde
- **Lagermismatch**: Regnearket siger 10, der er faktisk 3 → forsinket ekspedition
- **Tidsforbrug**: Medarbejder bruger 45–60 minutter per dag på Excel-vedligeholdelse = 140.000–190.000 kr./år

## Hvornår er det tid?

Excel er ikke bæredygtigt som primært lagersystem over:
- **50 ordrer/dag** med kompleksitet (varianter, bundter, serienumre)
- **2 samtidige lagermedarbejdere**
- **Webshop-integration behov** (Excel synkroniserer ikke)
- **Sæsontoppe** der kræver ekstra mandskab

## Typiske fejl

- Tilføjer flere Excel-ark og formler frem for at skifte system
- Tror at en fælles Google Sheet løser problemet (det gør det ikke fuldt ud)
- Undervurderer datakvalitets-problemet ved overflytning til WMS
- Venter til Excel kollapser under peak

## Sådan gør du det rigtigt

1. Brug Excel til analyse og rapportering – ikke til operationel lagerstyring
2. Eksportér historik fra Excel til WMS – ryd op i data inden flytning
3. Kør Excel og WMS parallelt i 2 uger for at validere
4. Test specifikt: kør en dag med simuleret dobbelt volumen

## Det opdager de fleste for sent

1. **Excel fejler første gang på det værst mulige tidspunkt** — ikke en stille mandag, men under Black Friday hvor volumen tredobles og fejlrisikoen seksdobles; først da bliver prisen for Excel tydelig
2. **Google Sheets løser ikke det reelle problem** — mange tror at Google Sheets fikser samtidige-bruger-problemet; det gør det delvist, men løser intet af scanning, plukoptimering eller webshop-synkronisering
3. **Dataoverflytningen afslører års af rodet data** — når man endelig skal flytte til WMS opdager man at Excel-arket er fuldt af duplikater, forkerte varenumre og manglende data; oprydningen tager 2–4 gange så lang tid som forventet

## SmartPack erstatter Excel

SmartPack erstatter Excel med scanning, realtids-lagerstatus og automatisk webshop-synkronisering. TSP-algoritmer optimerer plukruter automatisk. Onboarding på 1 uge – din eksisterende data importeres.

**Hvornår SmartPack IKKE giver mening**: Under 30 ordrer/dag med én person, simple produkter og ingen varianter er Excel stadig forsvarlig. SmartPack giver først klar ROI ved 50+ ordrer/dag — breakpointet hvor fejl begynder at koste mere end systemet. Brug Excel til rapportering og analyse også efter overgang til SmartPack — deri er Excel stadig fremragende.


## Brug denne artikel
- [ ] Gennemgå listen og sæt kryds ved det der passer på din situation
- [ ] Beregn din fejlomkostning: antal fejl/md × 350 kr. = din månedlige tab
- [ ] Book 30 min med dit team til at gennemgå "Hvornår du skal handle"
- [ ] Næste skridt: kontakt SmartPack for en gratis gennemgang af dit setup
## FAQ

**Kan jeg bruge Excel og WMS parallelt?**
Ja, som overgangsløsning i 2–4 uger. Derefter: slip Excel til operationelle formål.

**Hvad med Google Sheets?**
Bedre til samtidige brugere – men løser ikke scanning, integration eller plukoptimering.

**Hvornår er 50 ordrer/dag for simpelt til Excel?**
Når du har 3+ varianter, bundter, serienumre eller krav til sporbarhed. Kompleksitet er vigtigere end volumen alene.

**Er der gratis alternativer til Excel som WMS?**
Odoo Community er gratis men kræver IT-kompetencer. Forvent 40–80 timers setup og vedligeholdelse.

**Hvad er det første tegn på at Excel fejler?**
Første oversalg. Det er det øjeblik systemet fortæller dig, at det ikke kan følge med realtids-lagerbevægelser.



