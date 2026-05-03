---
primary_keyword: fulfillment sync wms
secondary_keywords: [fulfillment tracking shopify, ordre afsendt status, wms fulfillment integration, tracking nummer shopify]
cluster: 06-Tech
---

# Fulfillment sync – fra plukket ordre til bekræftet forsendelse

Torsdag kl. 15:34. Pakken er forseglet. Fragtlablen er printet. Scanner pakken ved afsendelse. WMS registrerer: "Afsendt". Fulfillment-API-kald til Shopify... timeout. Retry... fejler. Pakken er afsendt. Shopify ved intet. Kunden modtager ingen forsendelsesmail. Fredag morgen: "Hvorfor er min ordre ikke afsendt?" Pakken er allerede hos GLS.

## Hvad er fulfillment sync?

Fulfillment sync er processen, hvor WMS bekræfter til webshopen, at en ordre er plukket, pakket og afsendt – komplet med tracking-nummer og fragtinformation. Det er den sidste del af ordreflowet, der lukker cirklen og fortæller kunden: "Pakken er på vej."

I teknisk forstand: WMS sender en POST-request til webshopens fulfillment-API med:
- Ordre-ID
- Tracking-nummer
- Fragtmand-kode
- Pakkens vægt og dimensioner (i nogle systemer)
- Tidsstempler for pluk og afsendelse

Webshop markerer ordren fulfilled, gemmer tracking, og sender automatisk forsendelsesmail til kunden.

## Hvad koster fulfillment-sync-fejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Fulfillment-API timeout (ingen retry) | 5% af ordrer = 25/dag | Kundeservice: 2.500 kr./dag | 25 × 0,22 × 2.400 = 13.200 kr./dag | **5.737.500 kr./år** |
| notify_customer=false | 10% af ordrer = 50/dag | Kundeservice: 5.000 kr./dag | 50 × 0,15 × 2.400 = 18.000 kr./dag | **8.395.000 kr./år** |
| Tracking-nummer format fejler | 3% af ordrer = 15/dag | Kundeservice: 1.500 kr./dag | 15 × 0,10 × 2.400 = 3.600 kr./dag | **1.862.500 kr./år** |

**Konklusion:** notify_customer=false er den dyreste fejl. Fulfillment-timeout uden retry er den hyppigste.

## Hvad der sker, når fulfillment sync fejler

**Kunden modtager ikke forsendelsesmail**: Shopify sender automatisk mail ved fulfilled-status. Sker det ikke, tror kunden, at ordren ikke er behandlet.

**Ordren forbliver "Unfulfilled" i Shopify**: Kundeservice ser en ulukket ordre og bruger tid på at undersøge – selvom pakken allerede er sendt.

**Dobbelt-fulfillment**: Hvis WMS forsøger at sende fulfillment igen (retry), og Shopify ikke er idempotent på det (sjældent, men muligt), kan der oprettes to fulfillments.

**Tracking-nummer mangler**: Shopify fulfilerer ordren, men tracking er tomt. Kunden kan ikke spore pakken, og kundeoplevelsen falder.

## Fulfillment-processen i detaljer

### Trin 1: Afsendelse registreres i WMS
Plukker/pakker scanner pakken ved afsendelse. WMS:
- Registrerer tidsstempler (plukket, pakket, afsendt)
- Bekræfter at fragtlabel er genereret
- Opdaterer intern ordrestatus til "Afsendt"

### Trin 2: WMS kalder webshop-API
WMS sender fulfillment til Shopify (eksempel):
```
POST /admin/api/2024-01/orders/{order_id}/fulfillments.json
{
  "fulfillment": {
    "tracking_number": "GLS-1234567890",
    "tracking_company": "GLS",
    "notify_customer": true
  }
}
```

`notify_customer: true` er kritisk – det trigger forsendelsesmailen.

### Trin 3: Shopify bekræfter
Shopify returnerer 201 Created med fulfillment-objekt. WMS gemmer fulfillment-ID fra Shopify som kvittering.

### Trin 4: Fejlhåndtering
Fejler API-kaldet:
- WMS gemmer afventende fulfillment i retry-kø
- Forsøger igen med eksponentiel backoff
- Sender alert efter N fejlede forsøg

## Specielle tilfælde

**Delvis fulfillment**: En ordre på 3 varer, men kun 2 er på lager. WMS sender delvis fulfillment for de 2 varer. Shopify opretter delforsendelse. Den resterende linje forbliver open.

**Multi-pakke forsendelse**: En stor ordre pakkes i 2 kasser med separate tracking-numre. WMS sender to fulfillment-objekter til Shopify, begge tilknyttet samme ordre.

**Annullering efter fulfillment**: Kunden annullerer, men pakken er allerede afsendt. WMS og webshop skal håndtere "fulfillment annullering" som separat event.

**Retur**: Kunden returnerer varen. WMS registrerer returnering, lager opdateres. I Shopify oprettes evt. refund/return-objekt via API.

## Typiske fejl

**1. notify_customer udelades eller sættes til false**
Kunden modtager ikke forsendelsesmail. Simpel fejl med mærkbar kundeeffekt. Verificér altid at notify_customer er true i produktionsopsætning.

**2. Tracking-nummer formatteres forkert**
GLS, PostNord og Bring har specifikke tracking-nummer-formater. Et forkert format medfører, at Shopify ikke kan vise trackinget korrekt, og kundens trackinglink virker ikke.

**3. Ingen retry ved fulfillment-fejl**
API-kald til Shopify fejler (timeout, 500-fejl). Uden retry forbliver ordren "Unfulfilled" for evigt. WMS skal have persistent retry-kø.

## Sådan gør du det rigtigt

**1. Log fulfillment-ID fra Shopify**: Gem Shopify's fulfillment-ID i WMS ved succesfuldt kald. Det er din kvittering og giver dig mulighed for at debugge og evt. annullere fulfillment.

**2. Verificér fulfillment næste dag**: Daglig kontrol: har alle "afsendt" ordrer i WMS en tilsvarende fulfilled-status i Shopify? Afvigelser er fejlsignal.

**3. Test med alle fragtmænd**: Fulfillment-sync varierer lidt pr. fragtmand. Test eksplicit med GLS, PostNord, Bring – og eventuelt med delvise forsendelser og multi-pakke.

## Tjekliste

- [ ] Sendes fulfillment automatisk til webshop ved afsendelse?
- [ ] Er notify_customer sat til true?
- [ ] Gemmes Shopify fulfillment-ID i WMS?
- [ ] Er retry-logik implementeret på fulfillment-API-kald?
- [ ] Verificeres dagligt at alle afsendte ordrer er fulfilled i webshop?

## SmartPack understøttelse

SmartPack sender automatisk fulfillment til Shopify og WooCommerce i det øjeblik en pakke afscannes ved afsendelse. Tracking-nummer, fragtmand og tidsstempler inkluderes. notify_customer er altid aktiveret. Fejlede fulfillment-kald placeres i retry-kø og kan genafspilles manuelt. SmartPack dashboard viser live-status på alle afventende fulfillments.

## FAQ

**Hvad er fulfillment i Shopify?**
En fulfillment er en registrering i Shopify om, at (dele af) en ordre er afsendt. Den indeholder tracking-nummer, fragtmand og tidsstempler. Oprettelse af fulfillment trigger forsendelsesmailen til kunden.

**Hvornår sendes forsendelsesmailen til kunden?**
Shopify sender forsendelsesmailen automatisk, når en fulfillment oprettes med `notify_customer: true`. Det sker typisk inden for sekunder.

**Kan jeg sende fulfillment manuelt?**
Ja, direkte i Shopify admin. Men i et WMS-setup bør det ske automatisk. Manuel fulfillment er fejlbehæftet og ikke skalerbart.

**Hvad sker der, hvis jeg sender fulfillment to gange til samme ordre?**
Shopify vil typisk returnere fejl (ordre er allerede fully fulfilled). Implementér idempotency-check i WMS baseret på Shopify fulfillment-ID.

**Kan fulfillment-sync bruges til dropshipping?**
Ja. Dropshipping-leverandørens system sender fulfillment-bekræftelse til WMS/webshop, når varen er afsendt fra leverandørens lager. Teknisk identisk med standard fulfillment.
