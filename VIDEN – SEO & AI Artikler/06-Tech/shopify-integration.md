---
primary_keyword: shopify integration wms
secondary_keywords: [shopify wms opsætning, shopify webhook opsætning, shopify fulfillment api, shopify lager integration]
cluster: 06-Tech
---

# Shopify integration med WMS – komplet opsætningsguide

Shopify er det nemmeste sted at starte. Det er også det sted, hvor integrationen har flest gotchas, du ikke støder på, før du er i produktion. Custom shipping-metoder, leveringsmetode-mapping, HMAC-validering, fulfillment-flow – det er detaljer, der sender dit system i grøften, hvis du ikke kender dem. Her er det, du rent faktisk skal vide.

## Hvad er Shopify-integration med WMS?

Shopify-WMS-integration er en tovejsforbindelse:

**Shopify → WMS**: Ordrer, kundeopplysninger, valgt fragtmetode, betalingsstatus.

**WMS → Shopify**: Fulfillment-bekræftelse med tracking-nummer, lagertals-opdatering, evt. ordreannullering.

Integrationen bruger to mekanismer:
- **Webhooks** (push): Shopify sender ordre-events til WMS i realtid
- **REST API** (pull): WMS henter periodisk ordrer og opdaterer lager

## Opsætning trin for trin

### Trin 1: Opret Custom App i Shopify
I Shopify Admin → Apps → App and sales channel settings → Develop apps:
- Opret ny custom app med navn (f.eks. "SmartPack Integration")
- Tildel scopes: `read_orders`, `write_fulfillments`, `read_inventory`, `write_inventory`
- Generer API-nøgler: Admin API access token (bruges som AccessToken)

### Trin 2: Konfigurér webhooks
Registrér webhooks for relevante events:
- `orders/create` – nye ordrer
- `orders/cancelled` – annulleringer
- `orders/updated` – ændringer
- `app/uninstalled` – app fjernet

Endpoint skal være HTTPS. Test webhook-levering via Shopify Admin: Send test notification.

### Trin 3: HMAC-validering i WMS
Shopify webhook-secret genereres i app-konfigurationen. WMS skal validere hvert indkommende webhook:
```
computed = Base64(HMAC-SHA256(raw_body, webhook_secret))
if computed != request.headers["X-Shopify-Hmac-Sha256"]:
    return 401
```

Aldrig skip denne validering i produktion.

### Trin 4: Leveringsmetode-mapping

Dette er den mest oversete gotcha i Shopify-integration. Shopify bruger interne nøgler til at identificere leveringsmetoder. Custom shipping rates, der er oprettet i Shopify, refereres med præfikset `shopify_custom_dk` som leveringsmetode-identifikator.

Eksempel: Du har oprettet en leveringsmetode kaldet "Afhentning i butik". I webhook-payloaden fra Shopify refereres den som en custom-type. I WMS skal du mappe denne til den korrekte fragtprofil: `Pickup`.

Fejl i denne mapping resulterer i:
- Forkert fragtprodukt bestilles
- Fulfillment kan ikke oprettes (fragtprofil matcher ikke)
- Ordren strander i WMS

Verificér præcist, hvilken nøgle Shopify sender i `shipping_lines[0].code` i webhook-payloaden. Test med et reelt testordre.

## Hvad koster forkert Shopify-mapping?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Leveringsmetode-mapping fejl (forkert fragtprodukt) | 10% af ordrer = 50/dag | 50 × 85 kr. (fragtdifference) = 4.250 kr./dag | Kundeservice: 2.000 kr./dag | **2.281.250 kr./år** |
| location_id mangler ved fulfillment | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 4 timer: ~10.000 kr. | **10.000 kr. per episode** |
| HMAC-validering skippet (sikkerhedsbrud) | 1 falsk ordre/måned | Svindel: ~8.000 kr./episode | Omdømmetab: ukvantificerbar | **96.000 kr./år** |
| Webhook-tab uden retry | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |

**Konklusion:** Leveringsmetode-mapping og webhook-retry er de to dyreste fejl. Begge er 100% forebyggelige.

### Trin 5: Fulfillment-endpoint
WMS sender fulfillment til Shopify ved afsendelse:
```
POST /admin/api/2024-01/orders/{id}/fulfillments.json
{
  "fulfillment": {
    "location_id": 123456789,
    "tracking_number": "GLS1234567",
    "tracking_company": "GLS",
    "notify_customer": true
  }
}
```

`location_id` skal matche Shopify-lagerlokationen (hentes via `GET /locations.json`).

### Trin 6: Lageropdatering
Lagertal sendes til Shopify via inventory levels API:
```
POST /admin/api/2024-01/inventory_levels/set.json
{
  "location_id": 123456789,
  "inventory_item_id": 987654321,
  "available": 42
}
```

`inventory_item_id` er Shopify's interne ID for varen – ikke dit varenummer. Hent mapping via produktsync.

## Det opdager de fleste for sent

- **At `shopify_custom_dk` IKKE er en fejl** — det er Shopifys interne reference for custom shipping rates. Mange tror det er en bug og prøver at "fixe" det. Resultatet: mapping fejler, ordrer strander.
- **At location_id ændrer sig når du flytter fra staging til produktion** — I hardkoder location_id fra jeres test-shop. Går live. Alle fulfillments fejler med "location not found". Ingen ordrer afsendes.
- **At Shopify API-versioner udfases efter 12 måneder** — I bruger `2023-01`. Shopify udfaser den 1. april 2024. Integrationen bryder. I opdager det når ordrer ikke længere importeres.

## Typiske fejl

**1. Custom shipping-metode matcher ikke i WMS**
Shopify custom shipping-metoder bruger interne identifikatorer. Shopify_custom_dk → Pickup er et eksempel på mapping, der skal konfigureres eksplicit og testes.

**2. location_id mangler eller er forkert ved fulfillment**
Shopify kræver location_id ved fulfillment. Mange glemmer dette eller bruger en hardkodet ID fra staging. Hent altid location_id dynamisk eller konfigurér det eksplicit pr. installation.

**3. API-version ikke specificeret**
Shopify API'er versioneres (f.eks. `2024-01`). Bruger du ikke versioneret endpoint, kan breaking changes ramme din integration uden varsel.

## Sådan gør du det rigtigt

**1. Brug Shopify's sandbox**: Test altid ny opsætning i en development store inden produktion.

**2. Abonner på Shopify changelog**: Shopify udfaser API-versioner hvert år. Hold styr på deprecation-datoer.

**3. Implementér order reconciliation**: Kør daglig sammenligning: har alle Shopify-ordrer fra i går en tilsvarende WMS-ordre? Afvigelser er fejlsignal.

## Tjekliste

- [ ] Custom App oprettet med korrekte scopes?
- [ ] Webhooks konfigureret og HMAC-validering implementeret?
- [ ] Alle leveringsmetoder mappet og testet?
- [ ] location_id konfigureret korrekt?
- [ ] fulfillment-endpoint testet med notify_customer=true?
- [ ] Lageropdatering verificeret i Shopify-admin efter test?

## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå leveringsmetode-mapping-fejl og webhook-tab.

SmartPack har præ-konfigureret Shopify-integration med webhook-modtagelse, HMAC-validering, automatisk fulfillment og lageropdatering. Leveringsmetode-mapping konfigureres i SmartPack admin panel – herunder håndtering af custom shipping-metoder (`shopify_custom_dk` → `Pickup` er præ-konfigureret). Alle Shopify API-kald bruger versionerede endpoints og opdateres automatisk ved Shopify API-udfasninger.

**Alternativet:**
- Bygge egen Shopify-integration: 60.000–100.000 kr. udvikling + 15.000 kr./år vedligehold
- Manuel mapping-test: risiko for 2,3 mio. kr./år i leveringsmetode-fejl (se tabel)
- Ingen webhook-retry: risiko for 12,6 mio. kr./år i tabte ordrer (se tabel)

**SmartPack-omkostning:** 60.000 kr./år (inkl. Shopify + alle andre integrationer).

**Breakeven:** Hvis SmartPack forhindrer 1% leveringsmetode-fejl (228.000 kr./år) + 1% webhook-tab (2,5 mio. kr./år) = **2,73 mio. kr. sparet** — ROI: 4.550%.

## FAQ

**Hvad kræves for at integrere Shopify med et WMS?**
En custom app i Shopify med korrekte API-scopes, webhook-konfiguration med HMAC-validering, leveringsmetode-mapping og fulfillment-endpoint.

**Hvad er shopify_custom_dk?**
Den interne Shopify-reference for brugerdefinerede leveringsmetoder (custom shipping rates). Skal mappes korrekt i WMS til den tilsvarende fragtprofil.

**Kan jeg integrere Shopify uden webhook og kun bruge API-polling?**
Ja, men det giver forsinkelse på ordrebehandling. Webhooks er stærkt anbefalet for ordrehændelser. API-polling kan bruges som fallback.

**Hvad er Shopify API-versioner?**
Shopify versionerer sit API kvartalsvis (f.eks. 2024-01). Ældre versioner udfases med 12 måneders varsel. Brug altid versionerede endpoints.

**Hvad sker der, hvis min Shopify custom app slettes?**
Access token invalideres øjeblikkeligt. Alle integrationer holder op med at virke. Gem app-credentials sikkert og hav procedure for geoprettelse.

