---
primary_keyword: dataflow e-handel lagerstyring
secondary_keywords: [ordreflow wms, data integration e-commerce, lager dataflow shopify, ordre til forsendelse flow]
cluster: 06-Tech
---

# Dataflow i e-handel – fra ordre til forsendelse trin for trin

Torsdag kl. 14:23. En kunde klikker "Køb". Ordren oprettes i Shopify. Webhook sendes til WMS. WMS modtager... ingenting. Webhook-endpoint var nede i 12 sekunder under deployment. Ordren forsvinder. Stille fejl. Opdages først fredag morgen når kunden ringer: "Hvorfor er min ordre ikke afsendt?"

## Hvad er dataflow i e-handel?

Dataflow beskriver, hvordan information bevæger sig mellem systemer i håndteringen af en ordre. Fra kundens klik i webshopen til pakken er afleveret hos fragtmanden involverer en moderne e-handelsoperation typisk 4-7 systemer, der udveksler data med hinanden.

De primære systemer:
- **Webshop** (Shopify, WooCommerce): ordremodtagelse, kundekommunikation
- **WMS**: lageroperationer, pluk, pak, forsendelse
- **ERP**: økonomi, fakturering, indkøb (e-conomic, Business Central)
- **Fragtmand**: transportbestilling, label-generering, tracking
- **Betalingsgateway**: betalingsverifikation (Stripe, Quickpay, Nets)

## Det fulde dataflow – trin for trin

### Trin 1: Ordre modtages i webshop
Kunden gennemfører checkout. Webshop opretter ordre og:
- Bekræfter betaling via betalingsgateway
- Sender ordrebekræftelse til kunden
- Trigger webhook `orders/create` til WMS

**Data der overføres**: ordre-ID, kundeoplysninger, leveringsadresse, valgt fragtmetode, ordrelinjer (varenummer, antal, pris), eventuelle rabatter.

### Trin 2: WMS modtager og validerer ordre
WMS modtager webhook, validerer HMAC-signatur og opretter intern ordre. Validering:
- Kendes alle varenumre?
- Er der tilstrækkelig beholdning?
- Er leveringsadresse komplet?
- Matcher fragtmetode en konfigureret fragtprofil?

Fejler validering: ordre placeres i review-kø med fejlårsag.

### Trin 3: Plukopgave genereres
WMS opretter plukopgave:
- Beregner TSP-optimeret rute for plukkeren
- Konsoliderer eventuelt med andre ordrer i batch pick
- Tildeler til ledig medarbejder via håndterminal

### Trin 4: Pluk udføres
Plukker modtager opgave på håndterminal:
- Rute vises trin for trin
- Hvert pluk bekræftes med scanning (stregkode/QR)
- WMS opdaterer reserveret lager i realtid

### Trin 5: Pakning
Plukker ankommer til pakkestation:
- Pakkeseddel printes (eller vises digitalt)
- Varer pakkes og vejes
- WMS kalder fragtmand-API: booking af forsendelse
- Fragtlabel modtages og printes
- Pakke scannes og afsendelse registreres

**Kritisk data til fragtAPI** (afhænger af fragtmand):
- GLS: metode-nøgle (gls_private_droppoint, gls_business_delivery, gls_flex_delivery), pakkedata
- PostNord: MISKOS-nummer (9-cifret, obligatorisk)
- Bring: telefonnummer i format +47 efterfulgt af 9 eller 4 cifre (fastnet/mobil)

### Trin 6: Fulfillment-status sendes til webshop
WMS sender fulfillment-bekræftelse til Shopify/WooCommerce:
- Ordre markeres som fulfilled
- Tracking-nummer registreres
- Shopify sender automatisk forsendelsesmail til kunden

### Trin 7: ERP opdateres
Afhænger af ERP-opsætning:
- **e-conomic**: fakturakladde oprettes ved pakning, godkendes til faktura
- **Business Central**: afsendelsespost oprettes, lagerpostering bogføres

### Trin 8: Lagertal synkroniseres til webshop
WMS opdaterer lagerbeholdning i webshop:
- Fratrukket det solgte antal
- Plus eventuel ny beholdning fra varemodtagelse
- Webshop viser korrekt antal for kunder

## Hvad koster dataflow-brud REELT?

| Brudpunkt | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total omkostning |
|-----------|-------------------------------|-------------------|---------|------------------|
| Webhook leveres ikke (Trin 1→2) | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |
| Varenummer matcher ikke (Trin 2) | 2% af ordrer = 10/dag | 10 × 350 kr. = 3.500 kr./dag | Manuel review: 1.500 kr./dag | **1.825.000 kr./år** |
| Fragtmand-API fejler (Trin 5) | 1% af ordrer = 5/dag | Manuel bestilling: 500 kr./dag | Forsinkelse: 2.000 kr./dag | **912.500 kr./år** |
| Fulfillment sendes ikke (Trin 6) | 3% af ordrer = 15/dag | Kundeservice: 1.500 kr./dag | 15 × 0,22 × 2.400 = 7.920 kr./dag | **3.438.000 kr./år** |

**Konklusion:** Webhook-tab er den dyreste fejl. Fulfillment-fejl er den hyppigste.

## Det opdager de fleste for sent

- **At webhook-tab er usynlige** — Shopify sender webhook kl. 14:23. Dit WMS er nede i 12 sekunder under deployment. Webhook forsvinder. Ingen alarm. Ordren behandles aldrig. Opdages først når kunden ringer fredag morgen.
- **At varenummer-mismatch strander ordrer stille** — ny vare tilføjes i Shopify torsdag. Første kunde bestiller fredag morgen. Webhook ankommer til WMS. Varenummer kendes ikke. Ordre placeres i review-kø. Ingen alarm. Opdages mandag morgen ved gennemgang.
- **At fragtmand-API-fejl ikke altid giver alarm** — GLS API returnerer 500 Internal Server Error. WMS logger fejlen. Ingen alarm sendes. Pakke står klar, men label mangler. Opdages først ved cut-off.

## Hvor dataflow bryder sammen

Dataflowet er en kæde. Hvert led er et potentielt brudpunkt:

**Webhook leveres ikke** (Trin 1→2): Ordre skabt i webshop, men WMS modtager den aldrig. Stille fejl.

**Varenummer matcher ikke** (Trin 2): Ordre importeres, men varenummer fra Shopify kendes ikke i WMS. Ordre strander i review.

**Fragtmand-API fejler** (Trin 5): Pakning er klar, men fragtlabel kan ikke hentes. Manuel omvej kræves.

**Fulfillment sendes ikke** (Trin 6): Pakke er sendt, men Shopify opdateres aldrig. Ordre er "unfulfilled" for evigt, kunden modtager ikke mail.

**ERP-opdatering fejler** (Trin 7): Faktura oprettes ikke, lagerpostering mangler. Regnskab afviger fra virkelighed.

## Typiske fejl

**1. Antage at data flyder automatisk uden monitorering**
Dataflow er ikke sæt-og-glem. Det kræver aktiv monitorering af hvert trin.

**2. Ingen end-to-end test på nye varer**
Nye produkter testes ikke i det fulde flow. Opdages ved første rigtigt salg.

**3. Mangle fallback ved fragtAPI-fejl**
Hvis fragtbestilling fejler, bør der være en manuel backup-procedure. Mange virksomheder har ikke det – og opdager det ikke, før pakken er for sent afsendt.

## Sådan gør du det rigtigt

**1. Visualisér flowet**: Tegn det præcist. Hvem sender hvad til hvem, hvornår? Identificér alle integrationspunkter. Det er grundlaget for fejlfinding.

**2. Test med edge cases**: Ordre med 20 varelinjer, ordre med ukendt fragtmetode, ordre til udlandet, ordre der annulleres midt i plukket. Alle disse forekommer.

**3. Hav en plan for partielle fejl**: Hvad sker der, hvis trin 5 fejler? Trin 7? Definer fallback-procedure for hvert kritisk trin.

## Tjekliste

- [ ] Er det fulde dataflow dokumenteret (systemkort)?
- [ ] Monitoreres hvert integrationspunkt aktivt?
- [ ] Er fragtmand-API testet med alle brugte fragtprodukter?
- [ ] Er fulfillment-tilbagekald til webshop verificeret?
- [ ] Er der fallback-procedure ved fragtAPI-fejl?

## SmartPack underst øttelse

SmartPack implementerer hele dataflowet fra ordremodtagelse til fulfillment-bekræftelse. Webhooks modtages, valideres og behandles asynkront. TSP-optimerede plukruter beregnes automatisk. Fragtintegrationer (GLS, PostNord, Bring og andre) er præ-konfigurerede. Fulfillment sendes automatisk til Shopify/WooCommerce ved afsendelse. Lagertal opdateres via SignalR i realtid.

## FAQ

**Hvad er det vigtigste trin i e-handels dataflowet?**
Trin 6 – fulfillment-bekræftelse til webshop – overses hyppigst og har direkte kundesynlig effekt. Glemmes dette, tror kunden, at ordren ikke er afsendt.

**Kan et WMS køre uden ERP-integration?**
Ja. WMS kan håndtere lagerdriften selvstændigt. ERP-integrationen er nødvendig for bogføring og fakturering, men ikke for selve pluk/pak/forsendelse.

**Hvad er realtidslager, og hvornår er det kritisk?**
Realtidslager er, at webshopen altid viser den faktiske beholdning. Det er kritisk ved kampagner, Black Friday og for varer med lav lagerbeholdning, hvor oversalg er en reel risiko.

**Hvor lang tid tager det fulde flow?**
I et godt integreret system: ordre modtaget → plukopgave klar: under 2 minutter. Pluk + pak: 5-15 minutter pr. ordre. Fulfillment tilbage til webshop: sekunder efter afsendelse.

**Hvad er TSP-optimering?**
Travelling Salesman Problem-algoritme der beregner den korteste rute for at besøge alle plukpunkter i et lager. Reducerer gangtid med 20-35%.
