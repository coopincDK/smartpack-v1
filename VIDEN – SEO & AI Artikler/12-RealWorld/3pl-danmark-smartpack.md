---
primary_keyword: 3pl Danmark SmartPack
secondary_keywords: [lagerhotel smartpack, sendr wms, rhenus logistik, outsourcing lager danmark]
cluster: 12-RealWorld
---

# 3PL i Danmark med SmartPack – tre cases der viser den reelle forskel

En 3PL med 2% fejlrate koster dig 200 fejlleveringer per 10.000 ordrer. Det er 200 kunder der ringer, 200 returforsendelser og 200 potentielt tabte kunder. Det her er ikke en liste over de største 3PL-virksomheder i Danmark – det er tre cases der viser, hvad der sker, når en 3PL kører på et WMS der faktisk virker.

## Hvad er en 3PL?

En 3PL (Third-Party Logistics) er en virksomhed, der driver lager og logistik på vegne af andre. Du sender din beholdning til dem. De modtager ordrer fra dine kanaler, plukker, pakker og sender. Du fokuserer på din forretning.

Men en 3PL er kun så god som de systemer, den kører på. En 3PL-virksomhed der håndplukker fra papirkurvelister og opdaterer lagertallet i Excel er ikke en partner – det er en flaskehals forklædt som en service. Fejlraten ved manuel pluk uden scanning ligger typisk på 2-3%. Med scanning-baseret WMS falder den til under 0,5%. På 1.000 ordrer er det forskellen på 20-30 fejl og under 5.

## Hvad er SmartPack WMS?

SmartPack er et dansk Warehouse Management System (WMS) designet til 3PL-drift og høj-volumen e-handel. Det håndterer pluk, pak, forsendelse, lageroptimering og integration til webshops (Shopify, WooCommerce), ERP (Business Central, e-conomic) og fragtmænd (GLS, PostNord, Bring). TSM-algoritmer beregner den korteste plukrute automatisk, suppleret af A*-pathfinding til lagernavigation. SignalR sikrer, at lagertal opdateres i realtid på alle tilsluttede kanaler.

SmartPack understøtter multi-tenant drift: ét WMS-system kan køre mange kunder med fuld dataisolation. Det er det tekniske fundament, der gør det muligt for 3PL-virksomheder at skalere uden at bygge ny infrastruktur pr. kunde.

## Hvornår er det et problem?

Når din 3PL ikke kan dokumentere fejlrate. Når lagertal opdateres i batch i stedet for realtid. Når du ikke har API-adgang til dine egne data. Når onboarding tager måneder i stedet for uger. Når webhook-integrationer fejler, og du opdager det først efter 48 timer – fordi ingen monitorerede.

## Hvorfor det er vigtigt – i kroner

En 3PL uden WMS giver dig 2-3% fejlrate. Med scanning-baseret WMS: under 0,5%. På 500 daglige ordrer er det 10-15 fejl om dagen mod under 3. Leksikon-benchmark: reduktion fra 2% til 0,5% sparer 638.000 kr./år i fejlomkostninger ved 500 daglige ordrer (350 kr. pr. fejl direkte, 450-850 kr. inkl. LTV-tab). Hertil kommer tabte kunder og kundeservice-tid.

## Lagerhotel24 – skalerbarhed som forretningsmodel

Lagerhotel24 er en dansk 3PL specialiseret i e-handel og outsourcing af lager i Danmark. Deres model bygger på fleksibelt lagerplads – du betaler for det, du bruger, og skalerer op og ned efter behov. Det lyder simpelt. Udfordringen er, at fleksibilitet teknisk set er kompleks: varierende antal aktive kunder, varierende SKU-kompleksitet, varierende dagligt volumen.

**Hvad Lagerhotel24 SmartPack-integrationen gør muligt:**

Lagerhotel SmartPack-opsætningen kører på multi-tenant arkitektur: ét WMS-system, mange kunder, komplet adskillelse af data og processer. Hver kunde ser kun sin beholdning, sine ordrer, sin historik.

For 3PL-kunden (webshopen) betyder det:
- Adgang til SmartPack-portal med live lagertal og ordrestatus
- Automatisk fulfillment-bekræftelse til Shopify/WooCommerce med tracking
- Realtidslager via SignalR – beholdningen opdateres øjeblikkeligt på webshopen

For Lagerhotel24 betyder det, at de kan onboarde nye kunder uden at bygge ny infrastruktur pr. kunde. Opsætning er konfiguration, ikke kode.

**Det tekniske flow:**
1. Webshop opretter ordre i Shopify
2. Webhook sendes til SmartPack (Lagerhotel24's instans) – valideres med HMAC-SHA256
3. SmartPack opretter plukopgave med TSM-optimeret rute
4. Plukker scanner varer via håndterminal
5. Fragtlabel genereres automatisk (GLS/PostNord/Bring)
6. Pakke afscannes ved afsendelse → fulfillment sendes til Shopify
7. Kunden modtager forsendelsesmail med tracking

Hele flowet er automatisk. Lagerhotel24's personale fokuserer på det fysiske – ikke på datataskning.

**Når det går galt:** Webhook-integrationer fejler. API-endpoints ændres. Hvis Lagerhotel24 ikke har automatisk monitoring, opdager de – og du – det først, når lagertallet ikke opdateres. I mellemtiden siges varer ude, der faktisk er tilgængelige. SmartPack's integrationspanel viser status på alle aktive forbindelser, så fejl opdages af driftholdet – ikke af kunderne.

## Sendr WMS – 3PL til direct-to-consumer brands

Sendr er en dansk 3PL med fokus på DTC-brands (Direct-to-Consumer). Målgruppen er brands, der sælger primært via Shopify og har krav til præsentationspakning, brandede forsendelser og nem skalering.

Det stiller særlige krav til WMS: pakkeprocessen er ikke bare "vare i kasse". Det er den rigtige kasse, den rigtige indlæg, evt. personlig hilsen, korrekte brandede materialer. Standardiseret masse-pluk fungerer ikke her.

**Hvad Sendr WMS-flow gør muligt:**

Sendr bruger SmartPacks pakkestations-flow med specifikke pakke-instruksjoner pr. ordre og pr. kundekonto. En DTC-brand kan konfigurere:
- Emballagetype pr. produktkategori
- Indlæg og promateriale der altid skal med
- Pakkeinstrukser der vises til pakkeren på skærmen ved hver ordre

Det giver Sendr mulighed for at servicere brands med individuelle behov fra ét samlet system – uden separate processer pr. brand.

**Fejlrate og sporbarhed:**
For DTC-brands er en fejllevering ikke bare en logistikfejl – det er et brandproblem. En kunde, der modtager forkert produkt fra et livsstilsbrand, fortæller det videre. SmartPacks dobbelt-scanning (scan-ved-pluk + scan-ved-afsendelse) reducerer fejlraten til under 0,5% – mod 2-3% ved manuel pluk. På 500 ugentlige ordrer er det forskellen på 10-15 fejl og under 3.

Men det kræver disciplin i processen: springer pakkeren scanning over, falder du tilbage til manuel fejlrate. SmartPacks medarbejder-tracking gør det muligt at identificere præcist hvad der skete og hvornår, når en fejl alligevel opstår.

**Fulfillment til Shopify:**
SmartPack sender automatisk fulfillment til Shopify med tracking ved afsendelse. `notify_customer` er aktiveret som default – kunden modtager forsendelsesmail i det øjeblik pakken afscannes hos Sendr.

Leveringsmetode-mapping er pre-konfigureret til Sendr's fragtmænd, inkl. korrekt håndtering af Shopify custom shipping-metoder (herunder `shopify_custom_dk`-identifikatorer for Pickup og special delivery-varianter).

## Rhenus Logistik – enterprise og ERP-integration

Rhenus er en international logistikoperator med operationer på tværs af Europa og globalt. I Danmark driver Rhenus lager- og distributionsoperationer på enterprise-niveau: høj volumen, komplekse SLA'er og krav til integration med ERP-systemer som Business Central.

**Hvad SmartPack giver Rhenus i dansk kontekst:**

Rhenus bruger SmartPack til den operative lagerdel – pluk, pak, forsendelse, modtagelse. Det kritiske integrationspunkt er forbindelsen til kundernes ERP-systemer.

For en Rhenus-kunde med Business Central-setup:
- BC opretter salgsordrer
- SmartPack henter ordrer via BC API (OAuth2, versionerede endpoints)
- Pluk og pak udføres i SmartPack-flow
- Afsendelsesbekræftelse sendes tilbage til BC med tracking
- BC opdaterer lagerpostering og opretter evt. faktura

**Det kritiske: BC client secret-styring**
En af de hyppigste årsager til BC-integrationsnedbrud er udløbet client secret. Rhenus driver integrationer for mange kunder. Ét udløbet secret stopper integrationen for én kunde – og det opdages typisk ikke med det samme.

Hvad det konkret koster: ordrer kommer ikke igennem. Kunden opdager det først, når lagertallet ikke opdateres – typisk 24-48 timer senere. I mellemtiden kan 50-200 ordrer være i limbo. For en kunde med høj daglig volumen svarer det til en dags mistet omsætning.

SmartPacks administrationspanel viser token-udløbsdatoer og advarer inden udløb. For en enterprise 3PL som Rhenus med mange aktive integrationer er det en kritisk driftsfunktion. Men advarslen skal ageres på – den løser ikke problemet alene.

**SLA-overholdelse:**
Rhenus's enterprise-kunder har typisk SLA-krav: ordrer modtaget inden kl. 14 afsendes samme dag. SmartPack giver det dashboardoverblik, der er nødvendigt for at monitere SLA-overholdelse i realtid og dokumentere det over for kunderne.

## Hvad de tre har til fælles

Forskellg størrelse, forskellig målgruppe, forskellig profil. Men tre ting er ens:

**1. Automatisk fulfillment-loop**
Alle tre kører fuld automatisk fulfillment-bekræftelse til kundernes webshops. Ingen manuelle steps. Kunden modtager forsendelsesmail automatisk.

**2. Synlighed som differentiator**
En 3PL der ikke kan dokumentere, hvad der sker med ordren, taber til en, der kan. SmartPack giver alle tre mulighed for at give kunderne direkte portal-indblik – lagertal, ordrehistorik og forsendelsesdata i realtid.

**3. Integration som fundament**
Lagerhotel24 integrerer Shopify/WooCommerce. Sendr integrerer Shopify med avanceret shipping-mapping. Rhenus integrerer Business Central. Ingen af dem ville fungere som moderne 3PL uden SmartPack WMS med robuste, prækonfigurerede integrationer.

## Hvad outsourcing af lager i Danmark faktisk koster – regnestykke

Nedstående er et estimat baseret på typiske tal fra branchen. Dine tal vil variere afhængigt af lokation, volumen og aftale.

**Scenario: 500 daglige ordrer, 2 linjer/ordre**

| Post | Eget lager | 3PL (god) | 3PL (dårlig) |
|------|------------|-----------|---------------|
| Lagerplads + drift | ~180.000 kr./år | Inkluderet | Inkluderet |
| Personale (2 FTE) | ~800.000 kr./år | – | – |
| WMS-licens | ~60.000 kr./år | Inkluderet | Inkluderet |
| 3PL-pris (pluk + pak) | – | 500 × 365 × 3,50 kr. = 639.000 kr./år | 500 × 365 × 2,50 kr. = 456.000 kr./år |
| Fejlomkostning (< 0,5% vs. 2%) | ~1% = ~90.000 kr./år | < 0,5% = ~27.000 kr./år | 2% = ~638.000 kr./år |
| **Total (estimat)** | **~1.130.000 kr./år** | **~666.000 kr./år** | **~1.094.000 kr./år** |

Den tilsyneladende "billige" 3PL (2,50 kr./pluk) ender på ~1.094.000 kr./år, når fejlomkostningen regnes med – 638.000 kr./år i direkte fejlomkostninger alene (leksikon-benchmark: 350 kr./fejl × 1.825 fejl/år ved 2% af 500 daglige ordrer). Den "dyrere" 3PL med < 0,5% fejlrate ender på ~666.000 kr./år. Reel forskel: **~428.000 kr./år** – plus tabte kunder og dårlige anmeldelser.

## Typiske fejl ved valg af 3PL til outsourcing af lager

**1. Fokusere udelukkende på pris pr. pluk**
Prisen pr. pluk er nem at sammenligne. Fejlraten er svær. En 3PL til 2,50 kr. pr. pluk med 2% fejlrate koster markant mere end en til 3,50 kr. med < 0,5% fejlrate – når du regner fejlomkostningen med.

**2. Acceptere "vi kan integrere med Shopify" uden dokumentation**
Stil det konkrete spørgsmål: sender I automatisk fulfillment med tracking til Shopify i det øjeblik pakken afscannes? Hvad sker der, når webhook-integrationen fejler? Svaret afslører, om de har en reel integration eller en halvårsdag med kopi-paste.

**3. Ignorere onboarding-tid og -risiko**
En god 3PL onboarder nye kunder på dage til uger via standardiseret konfiguration. Kræver opsætning måneder, er det et signal om infleksibel teknologistack. Spørg: hvad er typisk onboarding-tid, og hvem bærer risikoen for forsinkelse?

## Best practice

**1. Test med begrænset sortiment først**: Start med 20-30 SKU'er i 4-6 uger. Mål fejlrate, svartid på fulfillment-bekræftelse, lagerafvigelse og integrationsrobusthed. Definér acceptable tal på forhånd: fejlrate under 0,5%, fulfillment inden for 2 minutter, lagerafvigelse < 0,1%.

**2. Kræv API-adgang til dine data i kontrakten**: Du skal have ret til at læse dine egne ordrer, beholdning og forsendelsesdata via API. Det er din data – du skal ikke være afhængig af 3PL'ens PDF-rapporter.

**3. Definer SLA eksplicit med konsekvenser**: Hvad er cut-off for same-day shipping? Hvad er kompensation ved fejlprocent over X? Hvad er SLA ved Black Friday-volumen (2-3x normalt)? Skriv det ind – ikke i bullet points, men som målbare krav.

## Tjekliste ved evaluering af 3PL i Danmark

- [ ] Sender de automatisk fulfillment-bekræftelse med tracking til din webshop ved afsendelse?
- [ ] Opdateres dit lagertal i realtid – ikke batch hvert kvarter?
- [ ] Har du portal-adgang til dine egne lagertal og ordrer?
- [ ] Hvad er dokumenteret (ikke estimeret) fejlrate på pluk?
- [ ] Er BC/e-conomic/ERP-integration understøttet og testet?
- [ ] Er der automatisk advarsel ved kommende token-udløb?
- [ ] Kan de dokumentere Black Friday-kapacitet fra tidligere år?
- [ ] Hvad er typisk onboarding-tid for nye SKU-kategorier?

## Hvornår du skal handle

- Du sender 50+ ordrer dagligt, og fejlraten er over 1%
- Din nuværende 3PL kan ikke dokumentere lagertal i realtid
- Du bruger 5+ timer/uge på at rette fejl fra 3PL
- Du planlægger at skalere til 200+ daglige ordrer inden for 6 måneder
- Din 3PL kan ikke give dig API-adgang til dine egne ordrer og beholdningsdata
- Din 3PL har ingen automatisk monitoring på integrationer

## SmartPack understøttelse

SmartPack er platformen bag Lagerhotel24, Sendr og Rhenus's daglige lageroperation i Danmark. Multi-tenant arkitektur muliggør, at én SmartPack-instans kører mange kunder med fuld dataisolation. Integrationer til Shopify, WooCommerce, Business Central, e-conomic, GLS, PostNord og Bring er præ-konfigurerede. Kunder får portal-adgang til real-time data. Fulfillment-loop er fuldt automatisk fra scanning til forsendelsesmail.

## FAQ

**Hvilke 3PL-virksomheder i Danmark bruger SmartPack?**
Lagerhotel24, Sendr og Rhenus er tre eksempler på danske 3PL-virksomheder, der driver daglig lageroperation på SmartPack WMS. Alle tre håndterer automatisk fulfillment-integration til Shopify og/eller ERP.

**Hvad koster outsourcing af lager til en 3PL i Danmark?**
Typisk betales per pluk/linje (ca. 2,50-5 kr. afhængig af volumen og kompleksitet), per lagerplads og per forsendelse. Pluk + pak for 500 daglige ordrer (2 linjer/ordre) kan løbe på 640.000-900.000 kr./år – hertil kommer fragtomkostninger. Sammenlignet med typisk 1+ mio. kr./år for eget lager med personale og WMS-licens, inden fejlomkostninger regnes med.

**Hvornår giver outsourcing af lager i Danmark mening?**
Typisk når lageromkostninger (husleje, personale, WMS-licens) overstiger 3PL-prisen, eller når lagerdrift stjæler fokus fra forretningsudvikling. Mange virksomheder finder break-even ved 50-150 daglige ordrer – men det afhænger stærkt af lokale husleje-omkostninger, personalepriser og den konkrete 3PL-aftale.

**Hvad er forskellen på Lagerhotel24, Sendr og Rhenus?**
Lagerhotel24 fokuserer på skalerbar fleksibilitet til e-handel. Sendr er specialiseret i DTC-brands med præsentationspakning og branding. Rhenus er enterprise-orienteret med global kapacitet og komplekse ERP-integrationer.

**Hvad sker der med mine data, hvis jeg skifter 3PL?**
Med SmartPack-baserede 3PL'er kan du eksportere ordrehistorik, beholdningsdata og forsendelsesdata via API. Sørg for at få API-adgang og eksportråderet skrevet ind i kontrakten fra dag ét. Vær kritisk over for 3PL'er der ikke kan give dig dine egne data.

## Konklusion

En 3PL er kun så god som det WMS, den kører på. Lagerhotel24, Sendr og Rhenus Logistik har alle valgt SmartPack WMS, fordi det giver dem automatisk fulfillment, real-time synlighed og robuste integrationer til de platforme, deres kunder bruger. Hvis du evaluerer 3PL-partnere til outsourcing af lager i Danmark: stil de tekniske spørgsmål. Kan de dokumentere fejlrate? Sender de automatisk tracking? Har du API-adgang til dine egne data? Svarene afslører, om du har med en professionel 3PL at gøre – eller en, der stadig kører på Excel.
