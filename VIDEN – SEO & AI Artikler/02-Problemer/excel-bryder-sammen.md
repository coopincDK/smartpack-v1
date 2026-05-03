---
primary_keyword: excel til lagerstyring problemer
secondary_keywords: [erstatte excel lager, wms vs excel, lager spreadsheet, excel lager fejl]
cluster: 02-Problemer
article_type: problem
---

# Excel bryder sammen – hvornår regnearket ikke er nok

Du åbner Excel-arket. 340 rækker. Kolonne A: SKU. Kolonne B: Lokation. Kolonne C: Antal. Kolonne D: ... vent, hvad er kolonne D? Og hvorfor viser den 47 enheder når systemet siger 52?

Du bruger 18 minutter på at finde fejlen. Det var en manuel indtastning fra tirsdag. Medarbejder 2 opdaterede ikke arket efter pluk. Nu er 3 ordrer sendt med forkert antal.

Cost: 3 × 450 kr. = 1.350 kr. Tid spildt: 18 minutter × 200 kr./time = 60 kr. Total: 1.410 kr. på én fejl.

Ved 200 ordrer/dag sker det her 2-3 gange om ugen. Det er 293.000 kr./år i Excel-fejl.

## Kort svar

> Excel til lagerstyring fejler ved over 80 ordrer/dag og 300+ SKU'er og kan koste over 400.000 kr. om året i direkte tab. Skift til WMS senest ved 50 ordrer/dag for at undgå versionskonflikt, korrupte data og ukontrolleret fejlrate.

## Hvad mener vi med "Excel til lagerstyring"?

Når vi siger Excel til lagerstyring, mener vi brugen af regneark – Excel, Google Sheets, Numbers – som primært system til at registrere lagerantal, spore bevægelser, planlægge genbestilling og koordinere ordrehåndtering.

Det fungerer til:
- Enkeltpersonsoperation med under 20 SKU'er
- Sæsonlager der kun er aktivt få gange om året
- Produktionsvirksomheder der kun bruger lageret til råvarer med lange leveringstider

Det fungerer ikke til e-commerce med vækst, varianter og daglige ordrer.

## Præcise breakpoints: Hvornår Excel knækker

### Under 30 ordrer/dag + under 100 SKU'er
**Excel virker fint.**
- 1 person kender lageret
- Manuel opdatering er hurtig
- Fejlrate acceptabel (under 1%)

### 30-80 ordrer/dag + 100-300 SKU'er
**Excel begynder at fejle.**
- 2+ personer opdaterer samme ark
- Race conditions (to opdaterer samtidig)
- Fejlrate stiger til 1,5-2,5%
- **Cost: 85.000-180.000 kr./år i fejl**

### Over 80 ordrer/dag + over 300 SKU'er
**Excel er aktivt farligt.**
- Beholdningsdata er aldrig korrekt
- Oversalg sker ugentligt
- Fejlrate over 3%
- **Cost: 400.000+ kr./år**

**Konklusion:** Skift til WMS senest ved 80 ordrer/dag. Helst ved 50.

## Hvornår er det et problem?

Excel er et aktivt problem, når to eller flere af disse gælder:
- Mere end én person redigerer regnearket (versionskonflikt)
- Du har over 50 aktive SKU'er
- Ordreantal overstiger 20 per dag
- Du har varer med varianter (størrelse, farve, model)
- Lageropdatering sker med forsinkelse – ikke i realtid
- Du har haft "Excel-nedbrud" (korrupt fil, forkert formel, kollega der overskrev data)

Klassisk symptom: du åbner filen om morgenen og den er opdateret forkert af nogen der arbejdede aftenen før. Du ved ikke, hvad der er sandt.

## Hvorfor det er vigtigt (tal)

Excel-baseret lagerstyring har en dokumenteret fejlrate på **5–8% i manuelle opdateringer**. En undersøgelse fra University of Hawaii viste, at 88% af alle regneark indeholder fejl.

Konsekvenserne i praksis:
- **Oversalg:** Du sælger varer der ikke er på lager, fordi regnearket ikke er opdateret
- **Undersalg:** Du stopper kampagner for tidligt, fordi regnearket viser falsk lav beholdning
- **Genbestillingsfejl:** Forkerte lagertal fører til for tidlig eller for sen genbestilling

En enkelt pakkefejl koster ~350 kr. direkte. Et oversalg der fører til kreditering og ny forsendelse: 450–850 kr. inkl. LTV-tab. Med 3% fejlrate og 100 daglige ordrer: over 380.000 kr. om året i direkte tab.

## Hvad sker der i praksis

To medarbejdere opdaterer regnearket sideløbende. Én trækker fejlagtigt en formel ned og overskriver 200 rækker. Ingen opdager det før kundeservice begynder at modtage klager over manglende varer.

Alternativt: En medarbejder er syg. Den eneste der kender opbygningen af filen er ikke til stede. Ingen andre kan bruge systemet.

Eller: Sortimentet vokser til 300 SKU'er. Filen er nu 45 MB, åbner i 40 sekunder og crasher med jævne mellemrum. Formler giver forkerte resultater på grund af cirkelreferencer, der opstod for seks måneder siden.

## Typiske fejl

**1. At tilføje endnu et regneark i stedet for at erstatte**
Hver gang Excel fejler, tilføjes et nyt regneark til at kompensere. Snart er der fem regneark der alle indeholder en del af sandheden – og ingen der er komplet.

**2. At bruge Excel til realtidssporing**
Excel er ikke et realtidssystem. Det er et registreringssystem. Når medarbejder A og B begge åbner filen, og A gemmer, overskriver det B's ændringer.

**3. Formelafhængighed uden dokumentation**
Nogen lavede en kompleks formel for to år siden. Den regner rigtigt, men ingen ved præcist hvad den gør. Den er nu en risikofaktor.

**4. At vente med at skifte til det er galt**
De fleste virksomheder skifter fra Excel til WMS efter en større katastrofe – oversalg i Black Friday, en fejl der koster en kunde, eller et datatab. At skifte proaktivt er langt billigere.

## Sådan gør du det rigtigt

**1. Definer et klart brudpunkt**
Sæt et konkret tal: "Vi skifter til WMS, når vi rammer 30 ordrer/dag". Vent ikke på, at problemet finder dig.

**2. Migrer med ren data**
Når du skifter fra Excel til WMS, er datakvalitet afgørende. Tag tid til at rense regnearket – fjern duplikater, ret SKU-navne, verificer antal – inden migration.

**3. Kør parallel i to uger**
Kør Excel og WMS parallelt i to uger. Identificer afvigelser. Luk Excel ned, når WMS er bekræftet korrekt.

**4. Inkludér alle brugere fra start**
Et WMS der kun bruges af én medarbejder, løser ikke problemet. Alle der rørte ved Excel, skal bruge WMS fra dag ét.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Tæl aktuelle SKU-antal og daglige ordrer
- [ ] Identificer om mere end én person redigerer regnearket
- [ ] Tjek om I har haft versionskonflikt eller datatab inden for det seneste år
- [ ] Beregn fejlomkostning: fejl per uge × 350 kr.
- [ ] Planlæg WMS-migration inden næste sæsonpeak

**Formel:** Excel-fejlomkostning = (Ordrer/dag × fejlrate) × 350 kr. × 365 dage

**Næste skridt:** Læs "For mange manuelle processer" og "For mange systemer" for en komplet digitaliseringsplan.

## SmartPack understøttelse

SmartPack erstatter Excel med et WMS der er designet til e-commerce operationer. Migration fra Excel sker via direkte import af SKU-lister og startbeholdning. Fra dag ét er lageropdatering automatisk, multi-bruger og i realtid – ingen filkonflikter, ingen formelrisiko.

Typisk migreringstid fra Excel til aktiv SmartPack-brug: 3–5 arbejdsdage.

## FAQ

**Vi har brugt Excel i 5 år – er det ikke risikabelt at skifte?**
Risikoen ved at skifte er mindre end risikoen ved at fortsætte. Data kan migreres. Det nye system giver sporbarhed Excel aldrig kan tilbyde.

**Hvad med Google Sheets – er det bedre end Excel?**
Google Sheets løser versionsproblemet (multibruger-realtid), men deler alle andre begrænsninger: ingen scanning, ingen automatisk opdatering ved bevægelse, ingen WMS-funktionalitet.

**Vi bruger Excel + Shopify – er det ikke nok?**
Shopify's lagerstyring er designet til salg, ikke til lageroperation. Det løser heller ikke scanning, plukruter eller multi-lokation.

**Hvornår er Excel OK?**
Under 20 ordrer/dag, én bruger, under 50 SKU'er uden varianter. Over disse grænser: WMS.

**Kan vi beholde Excel til rapportering?**
Ja – mange WMS (inkl. SmartPack) eksporterer til Excel. Excel som rapporteringsværktøj er fint. Excel som operationsværktøj er risikabelt.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Hvornår er Excel ikke nok?](/viden/beslutning/hvornaar-excel-fejler)
- [ROI på WMS](/viden/okonomi/roi-paa-wms)
- [Tjekliste før WMS](/viden/beslutning/tjekliste-foer-wms)
