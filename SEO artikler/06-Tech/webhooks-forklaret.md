---
primary_keyword: webhooks forklaret lagerstyring
secondary_keywords: [hvad er webhooks, webhook shopify wms, webhook HMAC SHA256, webhook vs api]
cluster: 06-Tech
---

# Webhooks forklaret – realtidsnotifikationer til dit lagersystem

Forestil dig, at du hele dagen ringer til postvæsenet og spørger: "Er der breve til mig?" Det er API-polling. En webhook er det modsatte: postvæsenet ringer til dig, når der er et brev. Det er ikke en lille forskel – det er fundamentalt anderledes i e-handelssammenhæng, og det er grunden til, at alle moderne integrationer bruger webhooks til tidskritiske hændelser.

## Hvad er en webhook?

En webhook er en HTTP-anmodning, som et eksternt system (Shopify, WooCommerce, e-conomic) sender til dit system, når en bestemt hændelse sker. Det er push-notifikationer til software.

Typiske webhook-events i e-handel:
- `orders/create` – ny ordre modtaget
- `orders/cancelled` – ordre annulleret
- `orders/updated` – ordre ændret (adresse, linjeskift)
- `fulfillments/create` – forsendelse oprettet
- `inventory_levels/update` – lagertal opdateret
- `products/create` – nyt produkt oprettet

Shopify sender disse automatisk til den URL, du har registreret. Dit WMS modtager dem, behandler dem og kvitterer med HTTP 200 OK.

## Tekniske krav til en webhook-modtager

For at modtage webhooks korrekt er der tre ufravigelige krav:

**1. HTTPS er obligatorisk**
Shopify og alle andre moderne platforme afviser HTTP-endpoints. Du skal have et gyldigt SSL-certifikat. Self-signed certifikater accepteres ikke i produktionsmiljøer.

**2. Svartid under 30 sekunder**
Shopify forventer HTTP 200 inden for 30 sekunder. Overskrides det, anses leveringen som mislykket, og Shopify forsøger retry. Tunge processer (f.eks. opdatering af database, kald til fragtAPI) bør aldrig ske synkront i webhook-handleren – put jobbet i en kø og returner 200 straks.

**3. HMAC-SHA256 signaturvalidering**
Shopify inkluderer en header `X-Shopify-Hmac-Sha256` med en hash af payload, signeret med dit webhook secret. Du skal validere denne signatur, før du behandler payload. Gør du det ikke, accepterer du potentielt falske requests.

## Hvad koster webhook-fejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Timeout (>30 sek svartid) → webhook deaktiveres | 100% af ordrer efter 5 dage | 0 kr. (ordrer venter) | Downtime 2 dage: ~40.000 kr. | **40.000 kr. per episode** |
| Ingen HMAC-validering → svindel-ordre | 1 falsk ordre/måned | Svindel: ~8.000 kr./episode | Tab af payment processor: ukvantificerbar | **96.000 kr./år** |
| Webhook-tab uden retry-logik | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |
| Ikke-idempotent handler → duplikat-ordrer | 2% af ordrer = 10/dag | 10 × 350 kr. = 3.500 kr./dag | Kundeservice: 1.500 kr./dag | **1.825.000 kr./år** |

**Konklusion:** Webhook-tab uden retry er den dyreste fejl. HMAC-skip er den farligste. Begge er 100% forebyggelige.

Valideringslogik (pseudokode):
```
computed_hmac = Base64(HMAC-SHA256(raw_body, webhook_secret))
if computed_hmac != header["X-Shopify-Hmac-Sha256"]:
    return HTTP 401
```

## Webhook retry-mekanisme

Shopify sender webhooks i realtid. Hvis leveringen fejler (netværksfejl, timeout, server nede), forsøger Shopify igen:

- Retry 1: efter ca. 1 minut
- Retry 2-N: med eksponentiel backoff
- Total periode: op til 5 dage
- Efter 5 dage: webhook-abonnementet deaktiveres, og du modtager en notifikation

Det betyder: du kan midlertidigt miste leveringer, men de ankommer bagud. Systemet skal kunne håndtere ordrer der ankommer ude af sekvens.

Det betyder også: du bør ikke behandle webhook-data blindt uden at verificere tilstand i kildesystemet for kritiske hændelser.

## Idempotency – den usynlige fejlkilde

Fordi Shopify kan sende samme webhook flere gange, skal din handler være idempotent: behandling af samme event to gange må ikke resultere i to ordrer, to fragtlabels eller to lagerafjusteringer.

Implementering:
- Gem `webhook_id` eller ordre-ID i en processed_events-tabel
- Tjek ved modtagelse: er dette event allerede behandlet?
- Returner 200 OK (ikke 409 eller fejl) – så Shopify stopper med at gensende

## Webhooks vs. API polling – hvornår bruger du hvad?

| Situation | Brug webhook | Brug API polling |
|---|---|---|
| Ny ordre modtaget | ✅ | ❌ for langsomt |
| Lagertal synkronisering | ❌ for mange events | ✅ |
| Ændring i kundeprofil | ✅ | ✅ begge virker |
| Batch-import af produkter | ❌ | ✅ |
| Fulfillment-status opdatering | ✅ | ✅ |

Tommelfingerregel: brug webhook til hændelser du skal reagere på hurtigt. Brug API til periodisk synkronisering af tilstand.

## Det opdager de fleste for sent

- **At Shopify deaktiverer webhook-abonnement efter 5 dage med fejl** — dit system er nede i 12 timer. Shopify prøver retry. Efter 5 dage: webhook deaktiveret. I opdager det når ordrer ikke længere importeres. Ingen alarm blev sendt.
- **At en webhook kan sendes FLERE gange** — I bygger ikke idempotent handler. Shopify sender samme ordre to gange (retry). I opretter to ordrer, sender to pakker, debiterer kunden to gange. Opdages når kunden klager.
- **At HTTPS er IKKE det samme som HMAC-validering** — I har HTTPS. I tror det er sikkert. Men I validerer ikke HMAC. Enhver kan sende falske webhooks til jeres endpoint. Opdages når svindel-ordrer håber op.

## Typiske fejl

**1. Behandle tunge opgaver synkront i webhook-handler**
Webhook-handler starter fragtbestilling, sender e-mail og opdaterer tre databaser – alt synkront. Svartid overskrider 30 sekunder. Shopify anser leveringen som fejlet og sender retry. Nu behandles ordren to gange.

**2. Skippe HMAC-validering "midlertidigt"**
Under udvikling springes validering over for at spare tid. Det glider ind i produktion. Resultatet: enhver kan sende fabricerede ordre-events til dit system.

**3. Ikke håndtere webhook-deaktivering**
Efter for mange fejl deaktiverer Shopify webhook-abonnementet. Hvis du ikke monitorerer dette, kører systemet videre – men modtager ingen events. Ordrer behandles ikke.

## Sådan gør du det rigtigt

**1. Returner 200 straks, behandl asynkront**: Webhook-handler gemmer event i kø og returnerer 200. Baggrundsjob behandler fra køen. Simpelt mønster, robust arkitektur.

**2. Log råt payload ved modtagelse**: Gem det rå JSON-payload ved modtagelse, inden det behandles. Hvis behandling fejler, har du payloaden til at re-behandle manuelt.

**3. Monitorér webhook-abonnementsstatus**: Tjek regelmæssigt (ugentligt eller automatisk), at dine webhook-abonnementer er aktive hos Shopify. En API-check er nok: `GET /webhooks.json`.

## Tjekliste

- [ ] Er webhook-endpoint HTTPS med gyldigt SSL-certifikat?
- [ ] Valideres HMAC-SHA256 signatur på alle indkommende webhooks?
- [ ] Returneres HTTP 200 inden for 30 sekunder?
- [ ] Behandles tunge operationer asynkront (kø)?
- [ ] Er handler idempotent (duplicate events skaber ikke duplikater)?
- [ ] Monitoreres webhook-abonnementsstatus?

## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå webhook-tab og sikkerhedsbrud.

SmartPack modtager webhooks fra Shopify, WooCommerce og andre platforme med fuld HMAC-SHA256 validering. Alle webhooks puttes i en intern event-kø og behandles asynkront – svartid til platform er typisk under 200ms (langt under 30 sek-grænsen). Systemet er fuldt idempotent på ordre-ID-niveau (duplikater ignoreres automatisk). Webhook-aktivitet vises i SmartPack administrationspanel med status, tidsstempler og eventuelle fejl.

**Alternativet:**
- Bygge egen webhook-modtager: 40.000–80.000 kr. udvikling (HTTPS + HMAC + kø + idempotency)
- Ingen retry-logik: risiko for 12,6 mio. kr./år i tabte ordrer (se tabel)
- Ingen HMAC-validering: risiko for 96.000 kr./år i svindel (se tabel)
- Synkron behandling (>30 sek): risiko for webhook-deaktivering (40.000 kr. per episode)

**SmartPack-omkostning:** 60.000 kr./år (inkl. webhook-modtagelse + alle andre integrationer).

**Breakeven:** Hvis SmartPack forhindrer 1% webhook-tab (2,5 mio. kr./år) = **2,44 mio. kr. sparet** — ROI: 4.067%.

## FAQ

**Hvad er en webhook?**
En push-notifikation fra et eksternt system (f.eks. Shopify) til dit system. Shopify sender automatisk en HTTP POST til din URL, når en ordre oprettes, ændres eller annulleres.

**Hvorfor kræver webhooks HTTPS?**
Uden HTTPS kan data aflyttes, og HMAC-signaturen kan ikke betros. Alle seriøse platforme kræver HTTPS-endpoints til webhooks af sikkerhedsmæssige årsager.

**Hvad sker der, hvis min webhook-handler er for langsom?**
Shopify anser leveringen som fejlet og forsøger retry. Hvis din handler er langsom på grund af synkront arbejde, risikerer du at modtage og behandle samme event to gange.

**Hvad er HMAC-SHA256, og hvorfor er det vigtigt?**
HMAC-SHA256 er en kryptografisk signatur, der verificerer, at en webhook er sendt af Shopify og ikke er manipuleret undervejs. Uden validering kan hvem som helst sende falske events til dit system.

**Kan jeg teste webhooks lokalt?**
Ja, med tunneling-værktøjer som ngrok eller Tailscale Funnel. De giver et offentligt HTTPS-endpoint, der tunneler til din lokale server. Brug til udvikling – aldrig i produktion.

