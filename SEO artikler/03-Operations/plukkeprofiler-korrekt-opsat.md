---
primary_keyword: plukkeprofiler lager
secondary_keywords: [plukkeprofil opsætning, plukprofil wms, ordretyper pluk, picks per profil]
cluster: 03-Operations
---

# Plukkeprofiler korrekt opsat: Få systemet til at styre ordreflowet for dig

En hasteoordre lander kl. 14:00.
Systemet smider den i batch med 15 andre ordrer.

Batch plukkes kl. 16:30.
Ordren når ikke fristen. Kunden ringer.

Problemet: systemet behandler alle ordrer ens.

Ingen profiler. Ingen prioritering.
1-vare D2C-ordre plukkes som 50-linjer B2B-ordre.
Hasteoordre venter bag rutineordre.

Resultat: plukketid op, fejlrate op, SLA brudt.

Plukkeprofiler styrer automatisk:
Hvilken metode. Hvilken prioritet. Hvilket udstyr.

Ingen manuel beslutning.
Systemet vælger — baseret på ordretype, volumen, deadline.

## Hvad er plukkeprofiler?

En plukkeprofil er et regelsæt i dit lagerstyringssystem (WMS) der bestemmer, hvordan en ordre skal plukkes baseret på ordreegenskaber. Profilen definerer:

- Plukkemetode (enkeltplukning, batchplukning, zoneplukning)
- Prioritering (hasteoordre, standard, D2C vs. B2B)
- Udstyr (håndscanner, cart, automat)
- Sorteringsmetode efter pluk

## Hvornår er det et problem?

Forkert opsatte eller fraværende plukkeprofiler giver:
- Alle ordrer behandles ens – uanset om det er en 1-vare-ordre eller en 50-linjer B2B-ordre
- Hasteoordrer plukkes i kø bag store rutineordrer
- Batchpluk bruges til ordrer, der burde plukkes enkeltvist (eller omvendt)
- Plukkere skal manuelt beslutte, hvilken metode de bruger

Resultatet er øget plukketid, øget fejlrate og frustration hos medarbejderne.

## Hvorfor er det vigtigt? (tal)

- Korrekt profilstyring kan øge picks/time fra industrisnit 102 til SmartPack-niveau 110
- Batch picking med 8-16 ordrer per tur reducerer gangtid markant vs. enkeltplukning
- TSP-baserede rutealgoritmers fordele realiseres kun, hvis batchstørrelse er korrekt konfigureret per profil
- Hasteoordrer der plukkes rettidigt reducerer SLA-brud og kundeservice-eskalationer

## Trin-for-trin: Opsæt dine plukkeprofiler

### Trin 1: Kortlæg dine ordretyper
Identificér alle typer ordrer du håndterer:
- Standard D2C (en eller få varer, hurtig levering)
- B2B (mange linjer, pallevis, evt. planlagt levering)
- Hasteoordrer (same-day, nødordrer)
- Lagerflytninger (interne overførsler)
- Særlige ordrer (gavepakker, bundler, skræddersyede)

### Trin 2: Definer plukkemetode per ordretype
| Ordretype | Anbefalet metode |
|---|---|
| Standard D2C, 1-3 varer | Batchpluk, 8-16 ordrer |
| Standard D2C, 4+ varer | Enkelt- eller batchpluk, 4-8 ordrer |
| B2B, 10+ linjer | Zonepluk + sortering |
| Hasteoordrer | Enkeltplukning med højeste prioritet |
| Bundler | Særlig profil (se bundle-guide) |

### Trin 3: Konfigurér prioritetsregler
Plukkeprofilen skal inkludere prioritetsrækkefølge:
1. Hasteleverancer (markeret i ordresystemet)
2. Ordrer med cut-off i næste time
3. Standard ordrer, rækkefølge efter modtagelsestid

Systemet viser plukkerne næste ordre baseret på disse regler – uden manuel koordinering.

### Trin 4: Sæt batchstørrelser korrekt
- Under 50 ordrer/dag: max 4 per batch
- 50-200 ordrer/dag: 4-8 per batch
- 200-500 ordrer/dag: 8-16 per batch
- Over 500 ordrer/dag: kombinér med zoneplukning

Store batches i lagre med højt SKU-antal øger sorteringskompleksiteten – find balancen.

### Trin 5: Testér profiler med pilotbatch
Inden fuld udrulning: kør 20-30 ordrer gennem den nye profil med en erfaren plukker. Observér eventuelle fejl og juster.

### Trin 6: Dokumentér og træn
Skriv de aktive profiler ned i et enkelt SOP-dokument. Alle plukkere skal vide, hvilken profil der styrer dem, og hvad der sker ved afvigelse.

## Typiske fejl

**Fejl 1: Én profil for alle ordrer**
Det er som at køre alle biler igennem ét servicespor uanset om det er en cykel eller en lastbil. Differentier altid per ordretype.

**Fejl 2: For stor batchstørrelse på komplekse ordrer**
Store batches af mange-linje-ordrer giver enorme sorteringsudfordringer efter pluk. Hold batchstørrelse omvendt proportional med ordrekompleksitet.

**Fejl 3: Hasteoordrer indgår i standardbatch**
Hasteleverancer mister deres fordel, hvis de blandes ind i standardbatches. De skal have en dedikeret profil med højeste prioritet.

## Sådan gør du det rigtigt

**1. Brug automatisk profilvalg baseret på ordreattributter**
Lad systemet vælge profil – ikke medarbejderen. Definer regler: hvis ordrelinjer > 10 → zonepluk; hvis markeret haste → enkeltpluk prioritet 1.

**2. Gennemgå profiler kvartalsvis**
Ordresammensætningen ændrer sig. En profil optimeret til forretningen for 6 måneder siden er måske ikke optimal i dag.

**3. Mål effekt per profil**
Track picks/time og fejlrate separat per profil. Det viser dig præcis hvilke profiler der performer, og hvilke der skal justeres.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Kortlæg alle ordretyper i dit sortiment
- [ ] Definer plukkemetode og batchstørrelse per ordretype
- [ ] Konfigurér prioritetsregler i SmartPack
- [ ] Testér profiler med pilotbatch inden udrulning
- [ ] Dokumentér aktive profiler og træn medarbejderne

**Næste skridt**: Læs guiderne om batch picking og zoneopdeling for at maksimere effekten af dine plukkeprofiler.

## SmartPack understøttelse

SmartPack's profilmodul lader dig definere ubegrænsede plukkeprofiler med regelbaseret automatisk valg. TSP-algoritmerne beregner ruter per batch automatisk baseret på den valgte profil. Du kan monitorere picks/time og fejlrate per profil live i dashboardet.

## FAQ

**Hvad er en plukkeprofil?**
Et regelsæt i WMS der automatisk bestemmer, hvordan en ordre plukkes – plukkemetode, prioritet, batchstørrelse og sorteringsmetode.

**Hvornår bruger jeg enkeltplukning vs. batchpluk?**
Batchpluk er standard ved over 50 ordrer/dag. Enkeltpluk bruges til hasteoordrer og meget komplekse ordrer med mange linjer.

**Hvad er den ideelle batchstørrelse?**
8-16 ordrer per batch ved 200-500 ordrer/dag. Under 50 ordrer/dag: max 4 per batch. Tilpas efter lagerets størrelse og SKU-kompleksitet.

**Kan jeg have hasteleverancer og standardordrer i samme batch?**
Nej – hasteleverancer skal have en separat profil med højeste prioritet for at sikre rettidighed.

**Hvem bestemmer, hvilken profil en ordre bruger?**
Systemet – baseret på regler defineret i profilens konfiguration. Manuel valg øger fejlrisiko og er ikke skalerbart.

