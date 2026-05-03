---
primary_keyword: api lagerstyring
secondary_keywords: [rest api wms, api integration e-handel, accesstoken appid lagerstyring, api polling interval]
cluster: 06-Tech
---

# API i lagerstyring – sådan henter og sender dit WMS data

Mandag morgen kl. 08:34. Din Shopify-integration holder op med at hente ordrer. Access token er udløbet. 47 ordrer sidder i Shopify. WMS ved intet. Kl. 11:00 opdager lagerchefen det – fordi ingen pluklister er kommet. 3 timer tabt. 47 ordrer forsinket. Det er konsekvensen af manglende token-refresh.

## Hvad er et API?

API (Application Programming Interface) er en defineret måde for to systemer at kommunikere på. I lagerstyringssammenhæng er det primært REST API'er over HTTPS, der bruges.

Et REST API fungerer på request/response-princippet:
- Dit WMS sender en HTTP-forespørgsel til et endpoint (en URL)
- Systemet på den anden side behandler forespørgslen og sender data tilbage
- Data returneres typisk som JSON

Eksempel: WMS kalder Shopify for at hente nye ordrer:
```
GET /admin/api/2024-01/orders.json?status=open&updated_at_min=2024-01-15T10:00:00Z
Authorization: Bearer {access_token}
```

Shopify returnerer en JSON-liste med ordrer.

## Autentificering: AppId og AccessToken

De fleste API'er kræver autentificering for at verificere, at kaldet kommer fra et autoriseret system. I lagerstyringsintegrationer bruges typisk:

**AppId + AccessToken**: Et par af en app-identifikator og et adgangstoken. AppId identificerer din applikation, AccessToken beviser, at du er autoriseret. Begge sendes med hvert API-kald, typisk i HTTP-headeren.

**OAuth2 client credentials**: Bruges af Business Central og Azure-baserede systemer. Her veksles AppId + client secret til et adgangstoken med begrænset levetid (typisk 1 time). Tokenet genopfriskes automatisk. Client secret har en maksimal levetid på 2 år – udløber det, holder integrationen op med at virke.

**Grant Token**: Bruges af e-conomic. En engangs-autorisationsprocess, der resulterer i et persistent token, der kan bruges til alle efterfølgende kald.

## Hvad koster API-fejl REELT?

| Scenarie | Direkte omkostning | LTV-tab | Total omkostning |
|----------|-------------------|---------|------------------|
| Access token udløber (3 timer downtime) | 0 kr. (ordrer venter) | Forsinkelse: ~8.000 kr. (kundeservice) | **8.000 kr. per episode** |
| Rate limiting ramt (429) uden retry | 25% af ordrer tabes i 1 time | 12 ordrer × 350 kr. = 4.200 kr. | **4.200 kr. per time** |
| Pagination ikke implementeret | 750+ ordrer hentes ikke (kun første 250) | 500 ordrer × 0,43 × 2.400 = 516.000 kr. | **516.000 kr. per episode** |
| Hardkodet token i kode (udløber efter 90 dage) | 0 kr. (ordrer venter) | Downtime 1 dag: ~40.000 kr. | **40.000 kr. per episode** |

**Konklusion:** Pagination-fejl er den dyreste. Rate limiting uden retry er den hyppigste.

## API polling – hvornår og hvor tit?

API polling er periodisk hentning af data. WMS spørger Shopify: "Er der nye ordrer siden sidst?" – og gør det hvert N. minut.

Optimale polling-intervaller:
- **Ordrer**: hvert 2-5. minut (lav latency, kritisk for pluktid)
- **Produktstamdata**: hvert 15-30. minut (ændres sjældent)
- **Lagertal til webshop**: hvert 5-15. minut (balancer latency vs. API-belastning)
- **Fakturaer (e-conomic)**: hvert 5. minut (e-conomic standardinterval)

For hyppig polling giver rate limiting. De fleste platforme har grænser:
- Shopify: 2 calls/sekund (standard), 40 calls/sekund (Plus)
- e-conomic: 100 requests/minut

Overskrides grænsen, returneres HTTP 429 (Too Many Requests). Dit system skal håndtere dette gracefully med retry og backoff.

## Hvad API bruges til i lagerdrift

**Ordrehentning**: WMS henter åbne ordrer fra webshop med filter på dato/status. Typisk pull hvert 2-5. minut som supplement til webhooks.

**Lageropslag**: WMS slår varestamdata op i ERP/webshop – pris, beskrivelse, stregkode.

**Beholdningsopdatering**: WMS sender aktuelle lagertal til webshop. Shopify opdaterer visning for kunder.

**Fulfillment-bekræftelse**: WMS sender "ordre afsendt" med tracking til webshop via API-kald (POST til /fulfillments.json).

**Fragtbestilling**: WMS kalder fragtmand-API (GLS, PostNord, Bring) for at booke forsendelse og hente label som PDF.

## Fejlhåndtering i API-kald

API-kald kan fejle på mange måder. Din integration skal håndtere alle:

| HTTP Status | Betydning | Handling |
|---|---|---|
| 200 OK | Succes | Behandl data |
| 201 Created | Oprettet | Registrér ID |
| 400 Bad Request | Ugyldig forespørgsel | Log og undersøg payload |
| 401 Unauthorized | Token ugyldig/udløbet | Refresh token, alert |
| 404 Not Found | Ressource findes ikke | Log, skip eller alert |
| 429 Too Many Requests | Rate limit ramt | Backoff og retry |
| 500 Server Error | Fjernserver fejl | Retry med backoff |
| 503 Service Unavailable | Fjernserver utilgængelig | Retry med backoff |

## Det opdager de fleste for sent

- **At Shopify returnerer max 250 resultater pr. kald** — du implementerer ordrehentning. Tester med 50 ordrer. Virker perfekt. Black Friday: 1.200 ordrer. Du henter kun de første 250. 950 ordrer behandles aldrig. Opdages først når kunder ringer.
- **At access token udløber midt i arbejdsdagen** — token har 90 dages levetid. Du glemmer at implementere auto-refresh. Dag 91, kl. 08:34: alle API-kald fejler med 401. Ordrer hentes ikke. Opdages efter 3 timer.
- **At rate limiting rammer dig uden varsel** — du poller Shopify hvert 30. sekund. Virker fint ved 50 ordrer/dag. Ved 500 ordrer/dag: 429 Too Many Requests. Ingen retry-logik. 25% af ordrer tabes.

## Typiske fejl

**1. Ingen håndtering af rate limiting**
System poller for hyppigt, rammer 429, og fejler stiltiende. Løsning: implementér exponential backoff og respektér Retry-After-header.

**2. Hardkodet access token**
Token gemmes direkte i konfigurationsfil eller kode. Udløber tokenet, fejler integrationen – og finder du det hurtigt nok? Gem tokens sikkert (Azure Key Vault, environment variables) og implementér automatisk refresh.

**3. Ingen pagination-håndtering**
API'er returnerer typisk max 250 resultater pr. kald (Shopify-standard). Har du 1.000 nye ordrer, kræver det 4 kald med pagination (cursor/page-baseret). Springer du dette over, mister du ordrer.

## Sådan gør du det rigtigt

**1. Implementér circuit breaker**: Hvis et API fejler 5 gange i træk, "sluk" for kald i 5 minutter. Det beskytter mod at bombardere et system, der er nede, og giver det tid til at komme sig.

**2. Brug API som fallback for webhooks**: Webhooks er realtid, men kan miste events. API-polling hvert 5. minut som fallback sikrer, at ingen ordrer går tabt selv ved webhook-fejl.

**3. Log alle API-kald med request og response**: Ved fejlfinding er det guld at se præcist, hvad der blev sendt og hvad der kom tilbage. Gem logfiler i minimum 14 dage.

## Tjekliste

- [ ] Er access tokens gemt sikkert (ikke i kode)?
- [ ] Håndterer du HTTP 429 med retry og backoff?
- [ ] Er pagination implementeret på alle list-endpoints?
- [ ] Er API polling sat til passende interval (ikke for hyppigt)?
- [ ] Logger du alle API-kald med status?

## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå pagination-fejl og token-udløb.

SmartPack har implementeret pagination på alle list-endpoints (Shopify, WooCommerce, e-conomic, Business Central). Access tokens håndteres sikkert med auto-refresh. Rate limiting håndteres automatisk med exponential backoff (1 min → 5 min → 30 min). Alle API-kald logges med request/response og vises i integrationspanelet.

**Alternativet:**
- Bygge egen API-integration: 60.000-120.000 kr. udvikling + 15.000 kr./år vedligehold
- Ingen pagination: risiko for 516.000 kr. tab ved Black Friday (se tabel)
- Hardkodet token: risiko for 40.000 kr. tab ved udløb (se tabel)
- Ingen rate limiting-håndtering: 25% ordretab ved spidslast

**SmartPack-omkostning:** 60.000 kr./år (inkl. alle integrationer + monitoring).

**Breakeven:** Hvis SmartPack forhindrer ÉN pagination-fejl (516.000 kr.) = **456.000 kr. sparet** — ROI: 760%.

## FAQ

**Hvad er forskellen på API og webhook i lagerstyring?**
API er pull: dit system spørger aktivt. Webhook er push: det eksterne system fortæller dig, når noget sker. Begge bruges typisk i kombination.

**Hvad sker der, hvis access token udløber midt i arbejdsdagen?**
Alle API-kald fejler med HTTP 401. Ordrer hentes ikke, lager opdateres ikke. Systemet bør automatisk forsøge token-refresh og sende alert, hvis det fejler.

**Hvad er pagination, og hvorfor er det vigtigt?**
API'er returnerer data i sider (f.eks. 250 resultater ad gangen). Uden pagination-håndtering henter du kun den første side – og mister resten. Kritisk ved ordreimport.

**Kan jeg bruge samme API-token til flere systemer?**
Teknisk set ja i nogle platforme, men det er en sikkerhedsrisiko. Et kompromitteret token giver adgang til alle systemer. Brug separate tokens pr. integration.

**Hvad er et REST API?**
Et API baseret på HTTP-protokollen og standardmetoder (GET, POST, PUT, DELETE). Det mest udbredte API-design i e-handel og lagerstyring. Data udveksles typisk som JSON.
