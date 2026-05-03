---
primary_keyword: real-time inventory lagerstyring
secondary_keywords: [realtidslager e-handel, lager opdatering realtid, signalr lager, live lagertal wms]
cluster: 06-Tech
---

# Real-time inventory – hvorfor lagertal aldrig må være forsinket

Torsdag kl. 14:23. Kunde bestiller. Webshop viser "5 på lager". Ordre oprettes. Kl. 14:47: plukker går til hylde. 0 stk. De 5 blev solgt via anden kanal for 2 timer siden. Lager-sync kører hvert 15. minut. Sidste sync: kl. 14:00. Oversalg. Ringer til kunden fredag morgen: "Vi kan ikke levere." Kunde annullerer. LTV-tab: 2.400 kr.

## Hvad er real-time inventory?

Real-time inventory er et lagerbehandlingssystem, hvor lagertal altid afspejler den faktiske, aktuelle beholdning – opdateret inden for sekunder af enhver hændelse, der ændrer det.

Hændelser der skal opdatere lager i realtid:
- Salg modtaget (reservation)
- Salg bekræftet/plukket (forbrug)
- Vare modtaget på lager (tilgang)
- Vare returneret (tilgang)
- Lagerregulering (korrektion)
- Kassation (fragang)

Konventionelle systemer opdaterer lagertallet periodisk – f.eks. hvert 15. minut via API-batch. I de 15 minutter kan der ske meget.

## Hvad koster manglende real-time inventory?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Oversalg (15 min sync-forsinkelse) | 2% af ordrer = 10/dag | 10 × 350 kr. = 3.500 kr./dag | 10 × 2.400 = 24.000 kr./dag | **10.037.500 kr./år** |
| Phantom inventory (lager-sync fejler) | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 2.400 = 60.000 kr./dag | **25.093.750 kr./år** |
| Reservation ikke implementeret | 10% af ordrer = 50/dag | 50 × 350 kr. = 17.500 kr./dag | 50 × 2.400 = 120.000 kr./dag | **50.187.500 kr./år** |

**Konklusion:** Reservation ikke implementeret er den dyreste fejl. Oversalg er den hyppigste.

## Teknologien bag: SignalR og push-arkitektur

Traditionel polling: WMS beder webshopen "vis mig lagertallet" hvert 15. minut.

Real-time push: WMS sender "lagertallet er ændret" øjeblikkeligt til alle tilsluttede systemer.

**SignalR** er Microsofts teknologi til realtidskommunikation. Det muliggør push-notifikationer fra server til klient via WebSocket (med fallback til long-polling). I lagerstyringssammenhæng bruges SignalR til at opdatere badge-tællere – de tal der viser lagerantal i UI'et – øjeblikkeligt, uden at nogen behøver at trykke "Genindlæs".

Når en plukker scanner en vare, opdateres lagervisningen på:
- Webshop (Shopify, WooCommerce) via API-kald
- WMS interne dashboard via SignalR
- Evt. ERP via integration

Alt sker inden for sekunder af scanningen.

## Hvornår er det kritisk?

Real-time inventory er kritisk under:

**Kampagner og flash sales**: Når du sætter en vare på tilbud med begrænset antal, kan oversalg ske i minuttet. Polling-baserede systemer er for langsomme.

**Black Friday og spidsbelastning**: Hundredvis af samtidige ordrer. Hvert sekund tæller. Selv 5 minutters forsinkelse i lageroppdatering kan give 10-50 oversalg.

**Multi-channel**: Shopify og WooCommerce sælger samme vare. Uden realtids reservation opdateres den anden kanal ikke hurtigt nok.

**Højrotationsvarer**: Bestsellere med 10-20 salg om dagen. Polling hvert 15. minut giver konstant risiko for oversalg.

## Reservation vs. faktisk beholdning

Et ofte overset aspekt af real-time inventory: forskel på reserveret og faktisk lager.

**Faktisk lager**: Hvad der fysisk er på hylderne.

**Reserveret lager**: Allerede bestilt, men ikke plukket endnu. Ordrer der er modtaget, men behandling ikke er afsluttet.

**Disponibelt lager** = Faktisk – Reserveret

Det er det disponible lager, webshopen skal vise kunderne. Mange systemer viser faktisk lager – og det fører til oversalg.

Eksempel:
- Faktisk lager: 5 enheder
- Reserveret (åbne ordrer): 3 enheder
- Disponibelt: 2 enheder – det er hvad webshoppen bør vise

## Realtidsopdatering i praksis

### Hændelseskæde ved et salg:
1. Ordre modtages i Shopify (11:34:22)
2. Webhook sendes til WMS (11:34:23 – 1 sekund)
3. WMS reserverer 1 enhed (11:34:23)
4. WMS sender disponibelt lagertal til Shopify via API (11:34:24 – 2 sekunder)
5. Shopify opdaterer produktsiden: "2 på lager" (11:34:25 – 3 sekunder)

Med polling ville trin 4-5 ske ved næste polling-interval: op til 15 minutter senere.

## Typiske fejl

**1. Opdatere lager ved afsendelse, ikke ved reservering**
Det faktiske lager falder kun, når pakken forlader lageret. Reservationsstyring er ikke implementeret. Kunder ser lagertallet, der ikke tager højde for åbne ordrer.

**2. Asynkron opdatering med lang forsinkelse**
Lageroppdatering sættes i kø og behandles med lav prioritet. I spidstimer kan forsinkelsen vokse til minutter.

**3. Ikke opdatere alle kanaler**
Lager opdateres i Shopify, men WooCommerce opdateres glemmes. Oversalg på den glemte kanal.

## Sådan gør du det rigtigt

**1. Implementér reservation ved ordremodtagelse**: Fra det øjeblik ordren modtages i WMS, registreres en reservation. Det er det disponible lager, der synkroniseres til webshop.

**2. Brug push-teknologi (webhooks/SignalR) til ændringer**: Push er hurtigere og mere effektivt end polling for hændelsesdrevne opdateringer.

**3. Opsæt low-stock alerts**: Når disponibelt lager falder under en tærskel (f.eks. 3 enheder), sendes alert til indkøbsansvarlig og vises i WMS dashboard.

## Tjekliste

- [ ] Reserveres lager ved ordremodtagelse (ikke kun ved afsendelse)?
- [ ] Viser webshopen disponibelt lager (faktisk minus reserveret)?
- [ ] Opdateres alle salgskanaler inden for 60 sekunder?
- [ ] Er low-stock alerts konfigureret?
- [ ] Er der testet for race-conditions under belastning?

## SmartPack understøttelse

SmartPack opdaterer lagertal i realtid via SignalR. Badge-tællere i WMS UI opdateres øjeblikkeligt ved hvert salg, modtagelse og regulering. Webshop-synkronisering (Shopify, WooCommerce) sker via push inden for sekunder. Reservation implementeres ved ordremodtagelse. Disponibelt lager (faktisk minus reserveret) synkroniseres til alle kanaler.

## FAQ

**Hvad er real-time inventory?**
Lagertal der opdateres inden for sekunder af enhver ændring – salg, modtagelse, regulering. Modsætningen er polling-baserede systemer med forsinkelse på minutter.

**Hvad er SignalR, og hvad bruges det til?**
Microsofts bibliotek til realtidskommunikation. Brugt i SmartPack til at opdatere lagervisning øjeblikkeligt i WMS UI, uden at brugeren behøver genindlæse.

**Hvad er forskel på faktisk og disponibelt lager?**
Faktisk lager er det, der fysisk er på hylden. Disponibelt lager er faktisk minus reserveret (åbne ordrer). Webshopen skal vise disponibelt – ikke faktisk – for at undgå oversalg.

**Hvornår er forsinkelse i lageropdatering acceptabel?**
For lavrotationsvarer med god beholdning: op til 15 minutters forsinkelse er ok. For bestsellere, kampagnevarer og multi-channel: aldrig. Her er realtid nødvendigt.

**Kan jeg aktivere real-time inventory efterfølgende?**
Ja, forudsat WMS understøtter reservation og push-integration. Det kræver konfigurationsændring og test – ikke altid kode.
