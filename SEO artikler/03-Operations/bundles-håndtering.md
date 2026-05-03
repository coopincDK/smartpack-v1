---
primary_keyword: bundles håndtering lager
secondary_keywords: [bundle sku lager, bundlede produkter lager, bundle modtagelse, bundle picking]
cluster: 03-Operations
---

# Bundles håndtering på lager: Modtagelse, pluk og den vigtigste regel

I modtager en palle med 50 startpakker.
Medarbejderen scanner bundle-SKU'et direkte ind.

Systemet siger: 50 bundles på lager.
Virkeligheden: 50× komponent A, 50× B, 50× C.

To uger senere sælger I komponent A separat.
Systemet siger: 0 på lager.
I har 30 stk. — låst inde i bundle-antal.

Ordren stopper. Kunden venter. I tæller manuelt.

Bundle-fejl koster 350 kr. per ordre.
Ved 20 bundle-ordrer/uge er det 364.000 kr./år.

Reglen: modtag ALDRIG bundle-SKU direkte.
Modtag komponenter. Lad systemet bygge bundlet.

## Hvad er bundles på et lager?

Et bundle er et salgbart produkt, der består af to eller flere individuelle komponenter. Eksempel: "Startpakke bestående af produkt A + produkt B + produkt C" sælges som ét SKU, men er fysisk tre separate produkter.

Bundles kan struktureres på to måder:
- **Kits bundlet ved modtagelse**: de tre produkter sættes fysisk sammen og lagres som ét bundle-SKU
- **Virtuelle bundles**: bundle-SKU'et eksisterer kun i systemet; de tre komponenter lagres individuelt og plukkes separat ved en bundle-ordre

## Den vigtigste regel: Modtag aldrig bundle-SKU direkte

**ALDRIG modtag et bundle som et enkelt bundle-SKU direkte på lageret.** Modtag i stedet komponenterne individuelt.

Årsag: Hvis du modtager og registrerer bundle-SKU'er direkte, mister du sporbarhed på de individuelle komponenter. Du kan ikke længere se, om du har nok af komponent A til at opfylde bundle-ordrer, fordi systemet kun ser bundle-enheder.

## Hvornår er det et problem?

Bundle-håndtering er problematisk, når:
- Bundle-SKU'er modtages direkte og ikke opdeles i komponenter
- Systemet har lagerantal på bundle-niveau men ikke komponent-niveau
- En komponent sælges individuelt OG som del af et bundle – og lageret kender ikke sammenhængen
- Plukkere er usikre på, om de plukker et færdigt bundle-kit eller individuelle varer

## Hvorfor er det vigtigt? (tal)

- En fejlregistreret bundle-modtagelse kan give systemfejl der cascader til alle ordrer der bruger de pågældende komponenter
- Bundle-fejl koster ~350 kr. direkte per fejlordre plus LTV-tab
- Korrekt bundle-håndtering er forudsætning for nøjagtig bestandsovervågning på komponent-niveau

## Trin-for-trin: Korrekt bundle-håndtering

### Trin 1: Definer alle dine bundles i systemet
For hvert bundle-SKU, registrér:
- Bundle-SKU-nummer
- Komponent-SKU-numre (alle individuelle varer)
- Antal af hver komponent per bundle
- Om bundlet er fysisk kit eller virtuelt

### Trin 2: Modtag altid som komponenter
Når en leverance med bundle-materialer ankommer:
- Scan og registrér komponent A: antal X
- Scan og registrér komponent B: antal Y
- Scan og registrér komponent C: antal Z

Aldrig: scan og registrér bundle-SKU: antal Z.

### Trin 3: Definer plukkestrategi for bundleordrer

**Fysisk kit (samlet bundle-sku på hylde)**:
- Plukkeren plukker ét bundle-kit fra bundle-zonen
- Systemet registrerer et fald i bundle-komponent-lager automatisk

**Virtuelt bundle (pluk af komponenter)**:
- Systemet genererer en plukliste med alle komponenter
- Plukkeren plukker A, B og C separat
- Systemet samler dem til én ordre og registrerer afgang på hvert komponent-sku

### Trin 4: Opsæt stykliste (BOM) i systemet
Bundle-definitionen i SmartPack er en Bill of Materials (BOM): liste over alle komponenter og antal. BOM'en bruges til automatisk at beregne, om der er nok til en bundle-ordre, og til at registrere afgange korrekt.

### Trin 5: Overvåg komponent-lagerniveauer, ikke bare bundle
Refill limits og alerts skal sættes på komponentniveau, ikke bundle-niveau. En bundle kan ikke opfyldes, hvis komponent A løber tør.

### Trin 6: Håndter bundling-arbejde korrekt
Hvis du kitter bundles fysisk (samler de tre komponenter i en æske):
- Registrér arbejdet som en produktionsopgave i systemet
- Afskriv komponenter fra lager
- Tilskriv færdige bundle-kits til lager

## Typiske fejl

**Fejl 1: Modtagelse af bundle-SKU direkte**
Den mest kritiske fejl. Aldrig modtag en bundle som en samlet enhed – altid komponenter.

**Fejl 2: Ingen BOM-definition i systemet**
Uden BOM ved systemet ikke, hvilke komponenter der skal afskrives ved en bundle-ordre.

**Fejl 3: Alerts sat på bundle-sku frem for komponenter**
Systemet advarer om lav beholdning på bundle-skuet, men ikke på den komponent der faktisk løber tør.

**Fejl 4: Plukkerne er usikre på bundle vs. individuel vare**
Klar markering på pluklisten og hylderne er nødvendig for at undgå forveksling.

## Sådan gør du det rigtigt

**1. Brug virtuelle bundles frem for fysiske kits, hvor muligt**
Virtuelle bundles giver langt bedre fleksibilitet og undgår dobbelt-lagerføring.

**2. Sæt refill limits på alle bundle-komponenter**
Alle komponenter der indgår i bundles skal have individuelle refill limits og alerts.

**3. Dokumentér alle bundles i en central bundleliste**
En opdateret liste over alle aktive bundles med komponenter og antal er kritisk reference for alle medarbejdere.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] List alle aktive bundles og definer BOM per bundle
- [ ] Konfigurér bundles som virtuelle eller fysiske kits i SmartPack
- [ ] Håndhæv reglen: modtag ALDRIG bundle-SKU direkte
- [ ] Sæt alerts og refill limits på komponentniveau
- [ ] Definer plukkeprocedure per bundletype
- [ ] Dokumentér bundleliste og kommunikér til alle medarbejdere

**Næste skridt**: Læs guiderne om stykliste-håndtering og produktion på lager for dybdegående implementering.

## SmartPack understøttelse

SmartPack understøtter fulde BOM-definitioner med virtuelle og fysiske bundle-strukturer. Systemet beregner automatisk om der er tilstrækkelig komponent-beholdning til en bundle-ordre og genererer plukkelister med individuelle komponent-picks. Alerts kan sættes per komponent-SKU.

## FAQ

**Hvad er den vigtigste regel ved bundle-modtagelse?**
Modtag aldrig et bundle-SKU direkte. Modtag altid komponenterne individuelt og registrér dem separat.

**Hvad er forskellen på fysisk kit og virtuelt bundle?**
Fysisk kit: komponenterne er samlet og lagret som ét bundle-sku. Virtuelt bundle: komponenterne lagres individuelt, og bundle eksisterer kun i systemet.

**Hvad er en BOM?**
Bill of Materials – en liste over alle komponenter og antal der udgør et bundle. Forudsætning for korrekt lagerberegning og afskrivning.

**Kan en komponent indgå i multiple bundles?**
Ja – og det er netop derfor komponent-niveau lagerføring er kritisk. Systemet skal beregne samlet efterspørgsel på en komponent på tværs af alle bundles.

**Hvad sker der, hvis en bundle-komponent løber tør?**
Alle bundle-ordrer der kræver den pågældende komponent kan ikke opfyldes. Refill alerts på komponentniveau forhindrer dette.

