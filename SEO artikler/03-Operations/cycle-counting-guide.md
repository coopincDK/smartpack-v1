---
primary_keyword: cycle counting lager
secondary_keywords: [løbende optælling lager, lageroptælling metode, cycle count guide, lagernøjagtighed]
cluster: 03-Operations
---

# Cycle counting guide: Optæl løbende og behold kontrollen over dit lager

Systemet siger: 47 stk. på lager.
Hylden er tom.

Ordren er solgt. Kunden venter. Medarbejderen leder.
I finder varen — forkert lokation, forkert antal.

Det sker 3 gange om ugen.
Hver fejl koster 15 min research + 350 kr. i fejlhåndtering.

Ved 150 fejl/år: 525.000 kr. tabt.

Cycle counting tæller 3-4 SKU'er om dagen.
A-varer månedligt. B kvartalsvis. C årligt.

Ingen nedlukning. Ingen kaos.
99%+ nøjagtighed inden for 90 dage.

## Hvad er cycle counting?

Cycle counting (løbende optælling) er en metode, hvor du kontinuerligt optæller et udvalg af SKU'er frem for at gennemføre én stor periodetælling. SKU'erne roterer, så alle varer tælles inden for et defineret interval.

Standardfrekvens baseret på ABC-klassificering:
- **A-varer**: Optælles **månedligt**
- **B-varer**: Optælles **kvartalsvis**
- **C-varer**: Optælles **årligt**

Denne frekvens sikrer, at de mest kritiske varer (høj salgsvolumen) har høj nøjagtighed, mens ressourcerne ikke bruges overdrevent på lavfrekvente SKU'er.

## Hvornår er det et problem?

Manglende cycle counting viser sig ved:
- Systemlagerantal passer ikke med det fysiske lager
- Negative lagerantal i systemet (sælger varer du ikke har)
- Forsinkede ordrer pga. manglende varer der "skulle" være på lager
- Manuelle korrektioner er nødvendige dagligt

Fejl i lagerantal er ofte årsag til pakkefejl, forsinket levering og kundeservice-eskalationer.

## Hvorfor er det vigtigt? (tal)

- Lageruoverensstemmelser koster direkte penge: fejlordrer koster ~**350 kr.** direkte per fejl
- SmartPack's løbende optællings-popup advarer dig i realtid ved afvigelser
- Virksomheder med cycle counting har typisk **99%+ lagernøjagtighed** vs. 93-95% ved periodisk optælling
- Korrekte lagernøgletal er forudsætningen for alle andre procesoptimeringer

## Trin-for-trin: Implementér cycle counting

### Trin 1: Klassificér alle SKU'er med ABC-analyse
Cycle counting-frekvens er baseret på ABC-klassen. Gennemfør ABC-analysen (se separat guide) og sørg for, at alle SKU'er er klassificerede.

### Trin 2: Byg en optællingspplan
Baseret på ABC-klassificeringen:
- Liste alle A-varer og planlæg én optælling per månedlig cyklus
- Liste alle B-varer og fordel over 4 kvartaler
- Liste alle C-varer og fordel over 12 måneder (evt. i forbindelse med periodisk optælling)

Eksempel: 200 SKU'er – 40 A-varer tælles månedligt (ca. 2/dag), 60 B-varer tælles kvartalsvis (ca. 1/dag), 100 C-varer tælles årligt (ca. 0,4/dag). Total: 3-4 SKU'er tælles per arbejdsdag.

### Trin 3: Vælg optælingstidspunkt
Optæl enten:
- Morgen inden plukaktivitet starter (lavest interference)
- I lavtrafik-perioder (fx frokostpause)
- Sidst på dagen

Undgå optælling under spids-aktivitet – fejlraten stiger.

### Trin 4: Brug scanning til optælling
Scan varen → tæl fysisk antal → indtast i systemet. Systemet sammenligner med forventet antal og markerer afvigelser. **Aldrig** gæt – tæl altid fysisk.

### Trin 5: Undersøg afvigelser omgående
Finder du en afvigelse (fx system siger 50, fysisk er 43): undersøg inden korrektionen. Årsag kan være:
- Ikke-registrerede pluk
- Fejlmodtagelse
- Tyveri eller svind
- Forkert placering (varen er på en anden lokation)

Korriger kun, når du forstår årsagen.

### Trin 6: Log og analyser afvigelsesmønstre
Registrér alle afvigelser med årsag. Analyser månedligt:
- Hvilke SKU'er har hyppige afvigelser?
- Er der mønstre (specifikke hyldezoner, specifikke medarbejdere, specifikke tidsperioder)?

### Trin 7: Justér ABC-klassificering ved behov
Hvis en C-vare pludselig viser hyppige afvigelser, overvej at opgradere den til B og øge optællings-frekvensen.

## Typiske fejl

**Fejl 1: Tælle uden at forstå afvigelser**
At korrigere et lagerantal uden at forstå årsagen løser ikke problemet – det gentager sig næste gang.

**Fejl 2: Springe C-varer over**
C-varer har lav plukhyppighed, men afvigelser kan stadig give problemer når de endelig sælges. Inkludér dem i den årlige cyklus.

**Fejl 3: Optælle under højtravl**
Optælling i spidsperioder giver unøjagtige resultater fordi varer er i transit (plukket men ikke pakket). Brug lavtrafik-perioder.

**Fejl 4: Ingen skriftlig afvigelsesprotokol**
Afvigelser der ikke dokumenteres og analyseres, giver ikke lærdom. Skab en fast registreringsrutine.

## Sådan gør du det rigtigt

**1. Gør cycle counting til en daglig vane, ikke et projekt**
3-4 SKU'er per dag tager 10-15 minutter. Det er håndterbart og giver langt bedre nøjagtighed end en kvartalsvis stor optælling.

**2. Brug SmartPack's løbende optællings-popup**
SmartPack's popup-funktion guider medarbejderen direkte til den næste planlagte optælling og registrerer resultatet med det samme.

**3. Belønning af nøjagtighed frem for pres**
Medarbejdere der melder afvigelser åbent og hurtigt, hjælper systemet. Skab en kultur, hvor det er okay at finde og rapportere fejl.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Klassificér alle SKU'er med ABC-analyse
- [ ] Byg en måneds/kvartals/årsplan for optælling
- [ ] Definér tidspunkt for daglig optælling
- [ ] Implementér scanningsbaseret optælling
- [ ] Etablér afvigelsesprotokol med obligatorisk årsagsregistrering
- [ ] Analyser afvigelsesmønstre månedligt

**Næste skridt**: Læs guiderne om lageralerts og datahygiejne for at forbinde cycle counting med proaktiv lagerovervågning.

## SmartPack understøttelse

SmartPack's cycle counting-modul indeholder løbende optællings-popup, der guider medarbejdere til planlagte optællinger. Systemet logger afvigelser automatisk og giver dig en afvigelsesrapport per SKU og zone. "Lager alerts"-dashboardet advarer, hvis en SKU's fysiske antal afviger markant fra systemantal.

## FAQ

**Hvad er cycle counting?**
En metode til løbende lageroptælling, hvor en delmængde af SKU'er tælles dagligt – frem for én stor periodisk optælling der kræver produktionsstop.

**Hvornår tæller man A-, B- og C-varer?**
A-varer månedligt, B-varer kvartalsvis, C-varer årligt. Frekvensen afspejler salgshyppighed og betydning for lagernøjagtighed.

**Kan cycle counting erstatte den periodiske optælling?**
Ja – virksomheder med velfungerende cycle counting-program har ikke brug for den klassiske halvårlige nedlukning. Regulatoriske krav kan dog i visse brancher kræve en periodisk totaltælling.

**Hvad gør jeg, når jeg finder en afvigelse?**
Undersøg årsagen inden du korrigerer. Afvigelse uden årsagsforklaring er en mistet læringsmulighed.

**Hvor mange SKU'er tæller man per dag?**
Typisk 3-5 SKU'er per dag. Det tager 15-20 minutter og er nemt at integrere i den daglige drift.

