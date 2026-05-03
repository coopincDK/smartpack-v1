---
primary_keyword: woocommerce integration wms
secondary_keywords: [woocommerce wms opsætning, woocommerce rest api lagerstyring, woocommerce webhook, woocommerce fulfillment]
cluster: 06-Tech
---

# WooCommerce integration med WMS – hvad du skal vide

Torsdag kl. 14:47. WooCommerce-ordre oprettes. Webhook sendes til WMS. WMS modtager... fejl. Webhook-signatur validering fejler. Årsag: WooCommerce secret key ændret af kollega i går. Ingen notifikation. 23 ordrer siden i går sidder i WooCommerce. WMS ved intet. Opdages fredag morgen. 18 timer forsinket.

## Hvad er WooCommerce-integration?

WooCommerce-integration med WMS er en tovejs dataforbindelse:

**WooCommerce → WMS**: Ordrer, kundedata, fragtvalg, betalingsstatus.

**WMS → WooCommerce**: Ordrestatus-opdatering (processing → completed), tracking-information, lageropdatering.

WooCommerce bruger REST API med OAuth 1.0a autentificering (Consumer Key + Consumer Secret) til API-kald, og WordPress-webhooks til push-notifikationer.

## Hvad koster WooCommerce-integrationsfejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Webhook-signatur validering fejler | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 18 timer: ~75.000 kr. | **75.000 kr. per episode** |
| Consumer Key med kun Read adgang | 100% af ordrer (kan ikke opdatere) | 0 kr. (ordrer venter) | Downtime 4 timer: ~10.000 kr. | **10.000 kr. per episode** |
| Lagerstyring ikke aktiveret pr. produkt | 20% af produkter | Oversalg: 10 ordrer/dag × 2.400 kr. = 24.000 kr./dag | N/A | **8.760.000 kr./år** |

**Konklusion:** Lagerstyring ikke aktiveret er den dyreste fejl. Webhook-signatur-fejl stopper alt.

## WooCommerce API-opsætning

### Trin 1: Aktivér REST API og generér nøgler
I WooCommerce → Settings → Advanced → REST API:
- Opret ny API-nøgle
- Tildel Read/Write adgang
- Gem Consumer Key og Consumer Secret

### Trin 2: Konfigurér webhooks
I WooCommerce → Settings → Advanced → Webhooks:
- Opret webhook for event: Order created
- Delivery URL: dit HTTPS WMS-endpoint
- Status: Active
- Version: WC API v3

WooCommerce bruger en secret key til webhook-signering (HMAC-SHA256, ligesom Shopify). Validér signaturen i headeren `X-WC-Webhook-Signature`.

### Trin 3: Ordrehentning via API
```
GET /wp-json/wc/v3/orders?status=processing&after=2024-01-15T10:00:00
Authorization: OAuth {consumer_key}:{consumer_secret}
```

WooCommerce returnerer JSON med ordredetaljer. `status=processing` er det typiske filter – ordrer der er betalt og klar til behandling.

### Trin 4: Ordrestatus-opdatering
WMS opdaterer ordrestatus ved afsendelse:
```
PUT /wp-json/wc/v3/orders/{order_id}
{
  "status": "completed",
  "meta_data": [
    {"key": "_tracking_number", "value": "GLS123456"},
    {"key": "_tracking_provider", "value": "GLS"}
  ]
}
```

WooCommerce sender automatisk "ordre afsendt"-mail til kunden ved completed-status, hvis WooCommerce Shipment Tracking plugin er installeret og konfigureret.

## Særlige hensyn til WooCommerce

**Serveropsætning varierer**: WooCommerce kører på WordPress, der kan hoste overalt – shared hosting, VPS, dedikeret server, WooCommerce.com. Webhook-latency og API-svartid varierer enormt afhænger af serverens ydeevne.

**Plugin-konflikter**: Tredjeparts-plugins kan ændre ordre-flow, statusnavne eller API-endpoints. Test altid med den præcise plugin-stack fra produktionsinstallationen.

**SSL-certifikat**: API og webhooks kræver gyldig HTTPS. Mange WooCommerce-installationer på shared hosting har selv-signerede certifikater eller udløbne certifikater. Verificér inden integration.

**Lagerstyring aktiveret?**: WooCommerce har en indstilling "Manage stock" pr. produkt. Hvis den ikke er aktiveret, kan WMS ikke opdatere lager via API.

## Typiske fejl

**1. OAuth-nøgler med for lav adgang**
Consumer key oprettet med kun Read adgang. WMS kan hente ordrer, men ikke opdatere status eller lager. Opret altid med Read/Write.

**2. Webhook delivery URL er HTTP, ikke HTTPS**
WooCommerce tillader HTTP webhook-endpoints (til forskel fra Shopify). Men det er en sikkerhedsrisiko og en potentiel fejlkilde i produktionsmiljøer med streng firewall-konfiguration.

**3. Glemme at aktivere lagerstyring pr. produkt**
WooCommerce lageropdatering virker kun, hvis "Manage stock" er aktiveret for hvert produkt. Masseimport af produkter sætter det ikke altid til aktiv.

## Sådan gør du det rigtigt

**1. Brug WooCommerce CLI til masseopsætning**: WP-CLI muliggør masseaktivering af lagerstyring, API-nøgle-generering og webhook-opsætning via kommandolinje – hurtigere og mere reproducerbart end manuelt via UI.

**2. Monitorér webhook-leveringsstatus**: WooCommerce logger webhook-leveringer under Settings → Advanced → Webhooks. Tjek regelmæssigt for fejlede leveringer.

**3. Implementér API-polling som backup**: WooCommerce webhooks er mere ustabile end Shopify. API-polling hvert 5. minut som fallback sikrer, at ingen ordrer går tabt ved webhook-fejl.

## Tjekliste

- [ ] REST API aktiveret med Read/Write Consumer Key?
- [ ] Webhook konfigureret med HTTPS endpoint og HMAC-validering?
- [ ] Manage stock aktiveret pr. produkt?
- [ ] Ordrestatus-opdatering testet (processing → completed)?
- [ ] SSL-certifikat gyldigt og ikke selvunderskrevet?

## SmartPack understøttelse

SmartPack understøtter WooCommerce via REST API og webhook-integration. Consumer Key og Secret konfigureres i SmartPack admin. Webhook-levering monitoreres automatisk. Ordrestatus opdateres til completed ved afsendelse. Lageropdatering sker via WooCommerce inventory API.

## FAQ

**Hvad er Consumer Key i WooCommerce?**
En API-autentificeringsnøgle, der identificerer og autoriserer din WMS-integration. Genereres i WooCommerce → Settings → Advanced → REST API.

**Hvad er forskellen på WooCommerce og Shopify integrationer?**
Teknisk set bruger de begge REST API og webhooks, men WooCommerce er mere variabel i opsætning og kræver mere server-specifik tilpasning. Shopify er mere standardiseret.

**Kan WooCommerce webhooks levere uordenligt?**
Ja. WooCommerce webhooks retries ved fejl, men levering er ikke garanteret ordenede. WMS skal håndtere out-of-order delivery gracefully.

**Hvad sker der, hvis WooCommerce-serveren er langsom?**
API-kald tager længere tid. Webhook-svar kan overstige timeouts. Det er et hosting-problem – ikke et integrationsproblem. Overvej bedre hosting eller caching-løsning.

**Kan jeg integrere WooCommerce uden plugins?**
Ja. WooCommerce har built-in REST API og webhook-support. Ingen plugins kræves til grundlæggende ordreintegration. Shipment Tracking plugin anbefales for tracking-display til kunden.
