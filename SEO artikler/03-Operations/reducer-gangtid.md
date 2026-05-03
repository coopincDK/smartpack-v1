---
primary_keyword: reducer gangtid lager
secondary_keywords: [gangtid pluk, gangtidsoptimering, plukkeru te optimering, kortere plukruter]
cluster: 03-Operations
---

# Reducer gangtid på dit lager: Konkrete metoder til kortere plukruter

Plukkeren går 200 meter for at hente en A-vare.
Den ligger bagerst på lageret.

Den plukkes 80 gange om dagen.
16.000 meter per dag. 16 km.

Gangtid: 50-60% af total plukketid.
Det er den faktor I ignorerer.

Flyt A-varen fra 20m til 5m afstand.
30 sekunder sparet per pluk.
80 pluk/dag = 40 minutter sparet.

TSP-algoritmer reducerer ruten 20-35%.
SmartPack: 110 picks/time.
Uden optimering: 102 picks/time.

Forskel: én medarbejder ved 300 ordrer/dag.

## Hvad er gangtid?

Gangtid er den tid en medarbejder bruger på at bevæge sig fra én lokation til en anden under en plukreunde – fra pakkebordet og frem, mellem plukpunkter og tilbage igen. Det inkluderer ikke selve plukket, scanningen eller sorteringen – kun bevægelse.

## Hvornår er det et problem?

Gangtid er et problem, når:
- Plukkere tilbagelægger lange ruter for at hente A-varer
- Ruter ikke er definerede og medarbejdere vælger suboptimale stier
- Batch picking ikke er implementeret, og samme gang tilbagelægges gentagne gange
- Pluk-starter og slutter samme sted (ineffektiv U-rute med lange diagonale strækninger)

## Hvorfor er det vigtigt? (tal)

- Gangtid udgør **50-60% af samlet plukketid** – reduktion her har den største effekt
- TSP-algoritmerne i SmartPack reducerer gennemsnitsruten med **20-35%** sammenlignet med usorterede ruter
- Flytning af A-varer tættere på pakkebordet (fra 20m til 5m) sparer ~2 min per 10 picks for denne SKU
- SmartPack-lagre opnår **110 picks/time** vs. branchesnit 102 – gangtidsoptimering er kernen

## Trin-for-trin: Reducer gangtid

### Trin 1: Mål nuværende gangtid
Brug stopure eller SmartPacks tidsregistrering til at isolere gangtid fra total plukketid. Mål for minimum 50 plukrunder. Find gennemsnitlig gangtid per pick og per ordre.

### Trin 2: Kortlæg de mest gåede ruter
Hvilke ruter tilbagelægges hyppigst? Tegn dem på lageroversigten. Er der klare mønstre i, hvilke hylder der besøges oftest? Det er dine A-varer – og de fortæller dig, om varepladseringen er optimal.

### Trin 3: Flyt A-varer tæt på pakkebordet
Den hurtigste og mest effektive gang-tid-reduktion: placer de hyppigst plukkede SKU'er i Golden Zone tæt på pakkebordet. Hvert meter reduceret afstand × picks/dag = direkte tidsbesparelse.

### Trin 4: Implementér batchpluk med TSP-ruter
Batchpluk samler picks fra flere ordrer på én runde. TSP-algoritmen (Travelling Salesman Problem) beregner den kortest mulige rute, der dækker alle plukpunkter. SmartPack beregner dette automatisk.

### Trin 5: Definer rute-princip (S-form eller U-form)
Standardruter eliminerer beslutningspausen og baglæns-kørsel:
- **U-form**: ud ad én gang, tilbage ad samme. Effektiv for korte lagre.
- **S-form (slangeroute)**: skiftevis frem og tilbage i parallelle gange. Effektiv for lange lagre med mange gange.

### Trin 6: Eliminer "dead-end" ruter
Hylder anbragt i blindgyder kræver back-tracking. Redesign layout så alle gange er gennemgående, eller placer kun lavfrekvente SKU'er i blindgyder.

### Trin 7: Mål ugentligt og publér resultater
Track gennemsnitlig gangtid per pick ugentligt. Publicér for teamet. Forbedringer synliggjorte motiverer.

## Typiske fejl

**Fejl 1: Plukkere frit vælger rute**
Selv erfarne plukkere vælger suboptimale ruter under pres. System-definerede ruter giver konsistent lavere gangtid.

**Fejl 2: Varepladseringen ikke opdateret ved sortimentsskift**
En A-vare fra for 6 måneder siden der er blevet til C-vare, fylder stadig Golden Zone og sender plukkere langt fra pakkebordet for egentlige A-varer.

**Fejl 3: Gange brugt til opbevaring**
Paller og overskudsvarer parkeret i gange tvinger plukkere til omveje. Gangarealer er hellige – intet opbevares der.

## Sådan gør du det rigtigt

**1. TSP + ABC er den vinnende kombination**
Korrekt vareplacement (ABC) sikrer, at de hyppigste picks er korte. TSP sikrer, at ruten for alle picks er optimal. Brug begge.

**2. Mål gangtid separat fra plukketid**
Total plukketid skjuler gangtid. Mål de to separat for at vide, om din indsats virker.

**3. Gennemgå plukkergange månedligt**
Et månedligt tjek af om gange er frie, ruter er korrekte og varepladseringen matcher ABC-klassen giver løbende optimering.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Mål nuværende gangtid (isoleret fra total plukketid)
- [ ] Kortlæg mest gåede ruter og sammenlign med ABC-placering
- [ ] Flyt A-varer nærmere pakkebordet
- [ ] Implementér batchpluk med TSP-ruter
- [ ] Definér og standardisér ruteprincip (S- eller U-form)
- [ ] Ryd alle gangarealer for opbevarede varer

**Næste skridt**: Læs guiderne om batch picking og ABC-analyse for at kombinere gangtidsreduktion med fuld plukkoptimering.

## SmartPack understøttelse

SmartPack beregner automatisk TSP-optimerede plukruter for alle batches og viser plukkeren den korteste rute i realtid. Gangtid per pick registreres og er tilgængeligt i dashboardet som KPI. Systemet advarer, når en SKU's placeringskategori ikke matcher dens aktuelle ABC-klasse.

## FAQ

**Hvad er gangtid på et lager?**
Den tid en medarbejder bruger på at bevæge sig mellem plukpunkter – typisk 50-60% af den totale plukketid.

**Hvad er den hurtigste måde at reducere gangtid på?**
Flyt A-varer tættere på pakkebordet. Det er den enkeltste og hurtigste gevinst.

**Hvad er forskellen på S-form og U-form plukkerute?**
U-form: ud og tilbage ad samme gang. S-form: slangeroute der skiftevis traverserer parallelle gange. S-form er bedst til store lagre med mange gange.

**Hjælper batchpluk på gangtid?**
Ja markant. Batchpluk samler plukpunkter fra mange ordrer på én runde, eliminerer gentagne ture til de samme hylder.

**Hvad er TSP-algoritmer?**
Travelling Salesman Problem-algoritmer der beregner den korteste rute, der besøger alle planlagte plukpunkter. SmartPack anvender dem automatisk til ruteoptimering.

