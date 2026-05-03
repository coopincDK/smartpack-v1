---
primary_keyword: hvad er lagerstyring
secondary_keywords: lagerstyring webshop, inventory management dansk, lagerstyring system, lager administration
cluster: 01-Fundamentals
---

# Hvad er lagerstyring — og hvorfor fejler de fleste webshops på det?

Lagerstyring er ikke at vide, hvad du har på lager. Det er at vide præcis hvad du har, hvor det er, hvornår det løber ud, og hvad det koster dig **lige nu**. De fleste webshops er gode til ét af de fire. Ingen af delene holder dig ude af problemer.

Og du opdager det for sent — når kunden klager, når revisor stiller spørgsmål, eller når Black Friday afslører at dit "system" var håb og Excel.

---

## Hvad er lagerstyring?

**Lagerstyring** (inventory management) er den samlede disciplin, der handler om at styre varebeholdningens niveau, placering, bevægelser og værdier. Det dækker alt fra indkøbsplanl

ægning og modtagelse til daglig drift og udgående forsendelse.

God lagerstyring sikrer, at du har de rigtige varer, i de rigtige mængder, på det rigtige tidspunkt — hverken for meget eller for lidt. Begge dele koster penge.

---

## Det opdager de fleste for sent

**Uge 48, mandag morgen:**
Din webshop viser 47 stk. af bestseller-SKU. Systemet bekræfter ordren. Plukkeren finder 3 stk. på hylden. De resterende 44? Solgt for 6 uger siden, men aldrig opdateret i systemet. 12 kunder får aflysning. 3 af dem køber aldrig igen.

**Måned 11, regnskabsafslutning:**
Revisor beder om lagerværdi. Du printer fra systemet: 2,4 mio. kr. Fysisk optælling viser 1,9 mio. kr. Forskellen? 500.000 kr. i "forsvundne" varer, fejlregistreringer og udløbne produkter. Det skal nedskrives. Nu.

**Black Friday, dag 2:**
Ordrevoluemen er 6× normal. Lageret kan ikke følge med. Ikke fordi I mangler folk — men fordi ingen ved hvor varerne er, hvad der er plukket, og hvad der er tilbage. Kaos. Fejlrate stiger til 4%. Kunderne husker det.

---

## Hvornår er det et problem?

**For meget på lager:**
- Kapital er bundet i varer der ikke sælger
- Lagerplads bruges til slow-movers
- Varer udløber eller forældes

**For lidt på lager:**
- Udsolgt = tabt salg og skuffede kunder
- Ekspresbestillinger hos leverandør til højere priser
- Kunder skifter til konkurrenter og vender ikke altid tilbage

**Dårlig sporbarhed:**
- Du ved ikke, hvad der reelt er på hylden — kun hvad systemet siger
- Fejl opdages ved klager, ikke ved optælling
- Reklamationer på udløbne eller forkerte varer

---

## Hvad koster dårlig lagerstyring? (konkret regnestykke)

| Problem | Hyppighed | Direkte tab | LTV-tab | Total/år |
|---------|-----------|-------------|---------|----------|
| Oversalg (vare ikke på lager) | 2% af ordrer | 350 kr./fejl | 450 kr. | **584.000 kr.** (200 ordrer/dag) |
| Dead stock (ingen rotation i 6 mdr.) | 250.000 kr. × 6% kapitalomkostning | — | — | **15.000 kr.** |
| Lageromstætning under 2×/år | Bundet kapital 2 mio. kr. × 6% | — | — | **120.000 kr.** |
| Manuel afstemning (1 time/dag) | 250 arbejdsdage × 250 kr./time | — | — | **62.500 kr.** |
| **TOTAL** | | | | **~781.500 kr./år** |

Dette er for et **mellemstort lager** (200 ordrer/dag, 2 mio. kr. varelager). Skaler op efter dit volumen.

---

## Hvordan fungerer lagerstyring i praksis?

### Step 1: Klassificer dit sortiment (ABC-analyse)
- **A-varer**: 20% af SKU'er, 80% af omsætning. Prioriteres i pluk og plads.
- **B-varer**: Midterfeltet. Følges månedligt.
- **C-varer**: Mange SKU'er, lille omsætning. Gennemgås kvartalsvis for udfasning.

### Step 2: Sæt reorder points
For hvert produkt beregnes bestillingspunktet: **dagligt salg × leveringstid + safety stock**. Når beholdningen rammer dette niveau, trigges en genbestilling — automatisk eller som alarm.

### Step 3: Modtagelseskontrol
Alt, der ankommer, tælles og scannes ind mod indkøbsordren. Afvigelser registreres og eskaleres. Ingen varer lægges på lager uden system-bekræftelse.

### Step 4: Løbende optælling (cycle counting)
I stedet for én stor årlig lukkeopgørelse tælles dele af lageret løbende — typisk A-varer ugentligt, B-varer månedligt, C-varer kvartalsvist.

### Step 5: KPI-opfølgning
- Lagernøjagtighed (mål: > 98%)
- Lageromstætning (mål: 4-8×/år)
- Dage med lager (mål: < 45-60 dage for de fleste kategorier)
- Fill rate (mål: > 97%)

---

## Typiske fejl

**1. Ingen systematisk modtagelseskontrol**
Varer lægges på lager uden at tælle mod indkøbsordren. Fejl opdages 3 måneder senere, når kunden klager. Konsekvens: 500.000 kr. nedskrivning ved årsafslutning fordi systemet viser varer der ikke findes.

**2. Et system for mange**
Webshop, ERP, regneark og WMS er ikke synkroniserede. Saldoen i Shopify passer ikke med det fysiske lager. Ingen ved, hvad der er korrekt. Resultat: 2% af ordrer bekræftes på varer der ikke findes = 584.000 kr./år i fejlomkostning.

**3. Samme reorder point hele året**
Sommer og vinter er ikke ens. Statiske bestillingspunkter betyder enten for tidlige (bundet kapital) eller for sene (udsolgt) genbestillinger. Tab: 120.000 kr./år i unødvendig lagerbinding.

**4. Slow-movers ryddes aldrig**
C-varer, der ikke har solgt i 6 måneder, tager plads og kapital. 250.000 kr. × 6% = 15.000 kr./år direkte tab. Gennemgå dem kvartalsvis og beslut: udfas, rabatter eller retuner til leverandør.

**5. Lagernøjagtighed måles ikke**
Du ved ikke, at du har et problem, før kunden fortæller dig det. Eller revisor gør.

---

## Sådan gør du det rigtigt

**1. Rens stamdata FØR du går live med nyt system**
Fejl i SKU-navne, manglende EAN, forkerte mål/vægt — det koster 10× mere at rette bagefter. Brug 2 uger på at rense data. Ellers bruger du 6 måneder på at rette fejl.

**2. Ét sandhedssystem — ingen undtagelser**
Alt lagerbevægelse registreres ét sted. Ikke "systemet for det meste" og Excel for resten. Enten er systemet sandheden, eller også er det værdiløst.

**3. Mål lagernøjagtighed månedligt — under 98% er et handlingspunkt**
Cycle counting + månedlig KPI-rapportering. Under 98% betyder du taber penge hver dag. Ikke "det kunne være bedre" — du taber penge.

**4. Dynamiske bestillingspunkter — juster kvartalsvis**
Sommer og vinter er ikke ens. Statiske reorder points betyder enten for tidlige (bundet kapital) eller for sene (udsolgt) genbestillinger. Brug de seneste 13 måneders data.

**5. Dead stock-gennemgang hver kvartal — beslut, sælg, kasser**
Varer uden rotation i 6 måneder tager plads og binder kapital. Beslut: rabatsalg, retur til leverandør, eller kassation. At vente løser ingenting.

---

## Real scenario: Hvad der sker når lagerstyring fejler

**Virksomhed:** Webshop, 180 ordrer/dag, 850 SKU'er  
**System:** Shopify + Excel  
**Problem:** Lagersaldi opdateres manuelt én gang om dagen

**Uge 47, onsdag:**
Kampagne kører. Bestseller-SKU sælger 40 stk. på 3 timer. Excel opdateres først kl. 16. I mellemtiden bekræftes 15 ordrer på varer der ikke findes. Kundeservice bruger 6 timer på at håndtere aflysninger og klager.

**Direkte tab:**
- 15 ordrer × 350 kr. (fejlomkostning) = 5.250 kr.
- 6 timer kundeservice × 250 kr. = 1.500 kr.
- Estimeret LTV-tab (3 kunder køber ikke igen) = 3.600 kr.
- **Total: 10.350 kr. på én dag**

**Løsning:**
WMS med realtids-synkronisering. Investering: 150.000 kr. ROI: under 4 måneder.

---

## Hvornår du skal handle

- Din lagernøjagtighed er under 98%
- Du har oplevet udsolgte varer med usolgt beholdning i systemet
- Lageromstætningen er under 3×/år (kritisk — under 2×/år er akut)
- Du bruger mere end 1 time om ugen på at afstemme lagersaldi
- Du kan ikke svare på "hvad er min lagerværdi i dag?" inden for 5 minutter

---

## Sådan understøtter SmartPack det

SmartPack giver dig realtids lagerstatus per placering — ikke kun total beholdning. ABC-analyse og lageromstætning er bygget ind som standard KPI-visninger. Systemet understøtter automatiske reorder-point alarmer og cycle counting med håndscanner.

**Hvornår giver SmartPack IKKE mening:**
- Under 30 ordrer/dag med under 50 SKU'er — Excel kan stadig fungere
- Enkelt-SKU operationer uden varianter
- Virksomheder der ikke har kapacitet til at implementere scanning og ændre processer

**Hvornår giver det mening:**
- Over 50 ordrer/dag
- Over 100 aktive SKU'er
- Lagerafvigelser koster kundeservice-tid hver uge
- Du overvejer at ansætte endnu en lagermedarbejder for at følge med

---

## Brug denne artikel
- [ ] Kør en ABC-analyse på dit sortiment: sorter alle SKU'er efter omsætning og identificer top 20%
- [ ] Beregn din aktuelle lageromstætning: (vareforbrug de seneste 12 mdr.) ÷ (gennemsnitlig lagerværdi)
- [ ] Mål lagernøjagtighed: tæl 20 tilfældige SKU'er og sammenlign med systemsaldo
- [ ] Næste skridt: Definer reorder points for dine top 10 A-varer

---

## FAQ

**Hvad er lagerstyring på en webshop?**
Lagerstyring på en webshop handler om at holde styr på, hvilke varer der er på lager, i hvilke mængder og på hvilke placeringer — så kunder aldrig bestiller noget, du ikke kan levere.

**Hvad er god lageromstætning?**
For de fleste e-commerce virksomheder er 4-8 gange om året sundt. Under 3 gange betyder, at for meget kapital er bundet i langsomt sælgende varer. Under 2 gange er kritisk.

**Hvornår skal jeg have et lagerstyringssystem?**
Når Excel ikke længere er nok — typisk over 30-50 daglige ordrer, mere end 100 aktive SKU'er eller når lagerafvigelser begynder at koste kundeservice-tid.

**Hvad er lagernøjagtighed?**
Lagernøjagtighed er graden af overensstemmelse mellem det fysiske lager og systemets registrerede beholdning. Under 98% er et problem; de bedste lagre holder 99,5%+.

**Kan jeg styre lager i Shopify uden et WMS?**
Shopify har basale lagerfunktioner der fungerer til 10-20 ordrer om dagen med simpelt sortiment. Over det mister du sporbarhed på placeringer, kan ikke styre LOT/batch, og har ingen pluk-optimering.

