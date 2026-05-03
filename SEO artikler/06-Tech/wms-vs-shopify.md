---
primary_keyword: wms vs shopify
secondary_keywords: [shopify lagerstyring, shopify wms integration, shopify plukoptimering, shopify lager begrænsninger]
cluster: 06-Tech
---

# WMS vs. Shopify – hvad Shopify ikke kan, og hvornår du har brug for mere

Shopify er verdens mest udbredte e-handelsplatform. Den er glimrende til at tage imod ordrer, håndtere betaling og drive en webshop. Men Shopify er ikke et lagerstyringssystem. Det ved de fleste ikke, før de begynder at vokse – og så opdager de det på den hårde måde.

## Hvad er Shopify, og hvad er et WMS?

**Shopify** er en e-handelsplatform. Den håndterer produktkatalog, betalinger, kundeoplevelse, ordremodtagelse og simpel lagertælling. Shopify ved, at du har 47 enheder af produkt X på lager. Det er det.

**Et WMS (Warehouse Management System)** ved, at de 47 enheder ligger i lokation B-04-2, at 12 af dem er reserveret til åbne ordrer, at 5 er skadet ved seneste modtagelse og venter på at blive placeret, og at den optimale plukkevej for dagens 80 ordrer er A→B→C-zonen.

Forskellen er ikke størrelse – det er fundamentalt forskellige formål.

## Hvad Shopify ikke kan

Shopify mangler følgende, som et WMS leverer:

**Plukoptimering**: Shopify genererer en simpel pakkeliste. Den ved ikke, hvordan dit lager er organiseret, og kan ikke beregne den korteste rute mellem lokationer. TSP-algoritmer (Travelling Salesman Problem) til ruteoptimering findes ikke i Shopify.

**Batch picking**: At samle pluk fra 20 ordrer i én lagerrunde og fordele ved pakkestationen er ren WMS-funktionalitet. Shopify har ingen support for det.

**Lokationsstyring**: Shopify har "locations" (butikker/lagre), men ikke granulær lokationsstyring på hylde-, rad- og plads-niveau. Du kan ikke sige "varen er i gang B, reol 3, hylde 2, plads 4."

**Sporbarhed på medarbejderniveau**: Shopify registrerer ikke, hvem der plukkede hvad. Hvis der opstår fejl, kan du ikke spore årsagen til en specifik person eller en specifik handling.

**Reelt realtidslager**: Shopify opdaterer lager ved salg, men ikke ved reservering under pluk, ved modtagelse af delvise leverancer eller ved lagerreguleringer undervejs.

**Serienummer og lotstyring**: Sporbarhed på lot- og serienummerniveau kræver et WMS. Det er særligt kritisk i fødevare-, elektronik- og medicinalbranchen.

## Hvornår er det et problem?

De fleste Shopify-sælgere mærker problemerne, når:

- De fylder over 50-100 ordrer/dag og pluk begynder at tage uforholdsmæssig lang tid
- Der er mere end 1-2 lagermedarbejdere, og ingen ved, hvem der laver fejl
- Lageret har over 500 SKU'er, og "vi ved bare, at det er her et sted" ikke længere fungerer
- Der er oversalgssituationer, fordi Shopify-lagertallet er et par timer bagud
- Returneringer ikke registreres korrekt, og genbrugslager blandes med nyt lager

Shopify's egne apps (f.eks. Stocky, Fulfillment by Shopify) adresserer dele af problemet, men giver stadig ikke fuld WMS-funktionalitet til komplekse lageroperationer.

## Hvad det koster ikke at have WMS ved vækst

**Tid**: Uden ruteoptimering bruger plukkere op til 60% af arbejdstiden på at gå. Med WMS og optimerede ruter reduceres gangtid med 20-35%.

**Fejl**: Manuelt pluk fra en ustruktureret pakkeliste giver fejlprocenter på 1-3%. WMS-styret pluk med scanning reducerer til under 0,3%.

**Oversalg**: Forsinket lageropdatering i Shopify fører til oversalg, backorders og utilfredse kunder. Særligt kritisk ved kampagner og Black Friday.

**Skalering**: Det er umuligt at skalere lagerkapacitet uden systematik. WMS giver basen for at ansætte og oplære nye plukkere hurtigt.

## Hvordan integration mellem Shopify og WMS fungerer

En korrekt integration ser sådan ud:

1. **Ordre modtages i Shopify** → webhook sender ordre-event til WMS
2. **WMS opretter plukopgave** → optimerer rute, tildeler medarbejder
3. **Plukker scanner varer** → WMS opdaterer reserveret lager i realtid
4. **Pakning og fragtlabel** → WMS genererer label (GLS, PostNord, Bring)
5. **Afsendelse bekræftet** → WMS sender fulfillment tilbage til Shopify med tracking
6. **Shopify markerer ordre som fulfilled** → kunden får forsendelsesmail

Vigtigt gotcha: Shopify custom shipping-metoder kræver korrekt nøglekonfiguration. Shopify bruger `shopify_custom_dk` som intern reference for brugerdefinerede leveringsmetoder, og den skal matche eksakt i WMS-konfigurationen for at fulfillment-bekræftelsen lander rigtigt. Fejl her giver "fulfilled but unshipped"-situationer, der er svære at debugge.

## Typiske fejl

**1. Stole på Shopify-lagertallet som sandheden**
Shopify viser, hvad der er solgt. Et WMS viser, hvad der faktisk er på hylden, hvad der er reserveret, hvad der er under modtagelse. De to tal er sjældent identiske i en aktiv lagerdrift.

**2. Ignorere fulfillment-integrationen**
Mange sætter WMS op til at plukke og pakke, men glemmer at sende status tilbage til Shopify. Kunden får ikke forsendelsesmail, ordren forbliver "unfulfilled" i Shopify, og kundeservice drukner i henvendelser.

**3. Mangle mapping for leveringsmetoder**
Når kunden vælger "GLS Pakkeshop" i Shopify-checkout, skal WMS forstå, at det betyder GLS DropPoint. Uden præcis metode-mapping ender ordrer med forkert fragtprodukt.

## Sådan gør du det rigtigt

**1. Lad Shopify eje kundeoplevelsen, WMS eje lageroperationen**: Ingen af systemerne skal forsøge at gøre begge dele. Integrationen er bindeledet.

**2. Sæt webhook-fejlhåndtering op fra dag 1**: Shopify gensender ikke fejlede webhooks ubegrænset. Implementér kø og retry-logik i WMS'et.

**3. Synkronisér lager fra WMS til Shopify, ikke omvendt**: WMS er master for beholdning. Shopify modtager opdateringer – den sender dem ikke.

## Tjekliste

- [ ] Har du over 50 daglige ordrer fra Shopify?
- [ ] Har du fejlprocent over 0,5% på pluk?
- [ ] Har din Shopify-butik haft oversalg seneste 3 måneder?
- [ ] Kender du din præcise lagerrute og placering for alle SKU'er?
- [ ] Sender WMS fulfillment-bekræftelse med tracking tilbage til Shopify automatisk?

## SmartPack understøttelse

SmartPack integrerer direkte med Shopify via webhook og API. Ordrer hentes automatisk, behandles i WMS-flow med TSP-optimerede plukruter, og fulfillment sendes tilbage til Shopify med tracking-nummer i det øjeblik varen er afsendt. SmartPack håndterer korrekt mapping af Shopify's leveringsmetoder – herunder `shopify_custom_dk` – og opdaterer lagertal i realtid via SignalR.

## FAQ

**Kan Shopify bruges som WMS?**
Til under 50 ordrer/dag med simpelt lager: ja, med forbehold. Over det: nej. Shopify mangler plukoptimering, lokationsstyring og batch picking.

**Kan WMS og Shopify køre parallelt uden integration?**
Teknisk set ja – men det betyder dobbelt-registrering, forsinkede lageropdateringer og manuel fulfillment. Det er ikke skalerbart.

**Hvad sker der, hvis webhook-forbindelsen fejler?**
Shopify forsøger at resende mislykkede webhooks i op til 5 dage med eksponentiel backoff. Men uden kvittering fra WMS kan ordrer gå tabt. Implementér altid webhook-kvittering og kø.

**Kan Shopify lave batch picking?**
Nej. Shopify kan udskrive pakkelister, men har ingen forståelse for lagerlayout, ruter eller batch-samling. Det kræver WMS.

**Hvad koster en fejllevering fra Shopify-ordrer?**
I direkte omkostninger: 2-3x forsendelsespris (tur-retur) plus håndteringstid. I indirekte: kundeoplevelse, returneringsrate og potentielt anmeldelser.

