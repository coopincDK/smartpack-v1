---
primary_keyword: produktion på lager
secondary_keywords: [lager produktion, kitting lager, samling på lager, produktion wms]
cluster: 03-Operations
article_type: beslutning
---

# Produktion på lager: Kitting, samling og stykliste-håndtering i WMS

Mange lagre udfører lettere produktionsopgaver: kitting, samling, mærkning, prinsætning og bundling. Disse aktiviteter kræver en anden behandling end standard lageroperationer. Denne guide viser dig, hvordan du håndterer produktion på lager korrekt i systemet og i praksis.

## Kort svar

Produktion på lager håndterer kitting, samling og mærkning som egentlige produktionsopgaver i systemet. Formålet er at afskrive komponenter korrekt og tilskrive færdige produkter til lagerbeholdningen via styklister.

## Hvad er produktion på lager?

Produktion på lager er alle aktiviteter, der transformerer råvarer eller komponenter til et salgbart produkt:
- **Kitting**: samle komponenter til et kit/bundle
- **Assembly**: montere dele til et produkt
- **Co-packing**: ompakning eller mærkning for specifik kunde/marked
- **Prissætning og mærkning**: tilføje prisetiketter, instruktioner osv.
- **Konfiguration**: tilpasse et produkt til en specifik ordres specifikationer

Fælles for alle: de forbruger lagerkomponenter og skaber et nyt salgbart SKU.

## Hvornår er det et problem?

Produktion på lager er et problem, når:
- Produktionsaktiviteter ikke registreres i systemet
- Komponent-afgang ikke registreres ved kitting (lagerantal passer ikke)
- Færdige kits ikke tilskrives korrekt lager
- Produktionsopgaverne forstyrrer plukflow fordi ingen zone er afsat

## Hvorfor er det vigtigt? (tal)

- Uregistreret komponentforbrug fører til forkerte lagerantal og pakkefejl til ~350 kr. per styk
- Manglende produktionsregistrering er en hyppig årsag til negative lagerantal
- Korrekt produktionsstyring muliggør præcis kapacitetsplanlægning og tidsoptimering

## Trin-for-trin: Håndter produktion på lager korrekt

### Trin 1: Definér stykliste (BOM) for hvert produceret SKU
Før noget produceres: opret en Bill of Materials (BOM) i SmartPack for det færdige produkt:
- Komponent-SKU liste
- Antal per komponent per enhed
- Evt. arbejdstid

### Trin 2: Opret en produktionsordre i systemet
For hvert kitting/assembly-job: opret en produktionsordre der specificerer:
- Hvad der produceres (færdigt SKU)
- Antal enheder
- Hvilke komponenter der forbruges (fra BOM)
- Hvornår og af hvem

### Trin 3: Reserver komponenter
Produktionsordren reserverer automatisk de nødvendige komponentmæder fra lager. Dette forhindrer, at plukkere plukker komponenter der er reserverede til produktion.

### Trin 4: Gennemfør produktionen i dedikeret zone
Produktionsaktiviteter bør foregå i en dedikeret produktionszone – adskilt fra plukkegange og pakkebordet. Dette minimerer interferens med det normale flow.

### Trin 5: Registrér afgang af komponenter
Når produktionen starter: scan komponenterne ud af lager. Systemet registrerer afgang per komponent baseret på BOM × antal enheder.

### Trin 6: Registrér færdige enheder til lager
Når produktionen er afsluttet: scan det færdige produkt ind på lager med korrekt lokation. Systemet tilskriver lagerantallet for det færdige SKU.

### Trin 7: Haandter LOT og serienumre
Hvis det færdige produkt kræver LOT-nummer: tildel et nyt LOT-nummer ved produktion. Registrér hvilke komponent-LOT'er der indgik i produktionen (sporbarhed).

## Typiske fejl

**Fejl 1: Produktion uden produktionsordre**
Kitting udført uden systemregistrering giver forkerte lagerantal på komponenter og manglende lager på det færdige produkt.

**Fejl 2: Produktionszone blander sig med plukzone**
Kitting-aktivitet midt på lageret forstyrrer plukflow og øger fejlrisiko.

**Fejl 3: BOM ikke opdateret ved komponentskift**
Leverandøren skiftede en komponent – men BOM'en er ikke opdateret. Næste produktionsordre registrerer forkert komponent-afgang.

**Fejl 4: Færdige kits ikke tilskrives lager**
Produktionen er færdig, men ingen scanner de færdige enheder ind. Lagersystemet har ingen af dem.

## Sådan gør du det rigtigt

**1. Planlæg produktion i lavtrafik-perioder**
Kitting under spids-plukaktivitet forstyrrer flow. Planlæg produktionsopgaver til morgen inden pluk-start eller til eftermiddag.

**2. Brug produktionsordrer til kapacitetsplanlægning**
En liste over åbne produktionsordrer giver lederens mulighed for at fordele arbejde optimalt.

**3. Tjek komponent-beholdning inden produktionsordre oprettes**
Bekræft altid, at nok komponenter er tilgængelige. Halvfærdig produktion er dyrere end udskudt produktion.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Definér BOM for alle producerede SKU'er
- [ ] Etablér produktionszone adskilt fra plukzone
- [ ] Opret produktionsordrer i systemet inden kitting starter
- [ ] Registrér komponent-afgang ved produktionsstart
- [ ] Registrér færdige enheder til lager ved produktionsafslutning
- [ ] Opdatér BOM'er ved komponentskift

**Næste skridt**: Læs guiderne om bundles-håndtering og LOT/batch-håndtering for at forbinde produktion med sporbarhed.

## SmartPack understøttelse

SmartPack's produktionsmodul understøtter BOM-definitioner, produktionsordrer, komponent-reservation og automatisk afskrivning ved scanning. Færdige enheder tilskrives lager ved afslutning af produktionsordren. LOT-numre kan knyttes til produktionspartiet med fuld komponent-sporbarhed.

## FAQ

**Hvad er en BOM?**
Bill of Materials – en stykliste der definerer hvilke komponenter og i hvilke mængder der indgår i produktionen af én enhed af et SKU.

**Hvornår kræver jeg en produktionsordre?**
Altid, når komponenter forbruges og et nyt SKU produceres – selv ved enkle kitting-opgaver. Det er fundamentet for korrekte lagerantal.

**Kan jeg producere uden at reservere komponenter?**
Du kan, men det er en risiko: komponenter der anvendes til produktion kan allerede være reserveret til en salgsordre.

**Hvad er en produktionszone?**
Et dedikeret fysisk område til kitting, assembly og co-packing – adskilt fra pluk- og pakkegangene for at undgå flow-interferens.

**Hvad sker der, hvis en komponent løber tør under produktion?**
Stop produktionen, registrér delvise enheder, og afvent genopfyldning. Halvfærdig produktion registreres som work-in-progress i systemet.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Forkert lagerantal og komponenter](/viden/problemer/forkert-lagerantal)
