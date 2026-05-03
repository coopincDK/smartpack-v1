---
primary_keyword: fragtintegrationer wms
secondary_keywords: [gls integration wms, postnord miskos nummer, bring integration wms, fragtlabel api lagerstyring]
cluster: 06-Tech
---

# Fragtintegrationer forklaret – GLS, PostNord, Bring og hvad der skiller dem

Torsdag kl. 13:47. Pakkestation. Scanner pakken. WMS kalder GLS API. Fejl: "Invalid service code". Årsag: gls_droppoint i stedet for gls_private_droppoint. Mapping-fejl. Pakken kan ikke sendes. 47 pakker klar. Alle samme fejl. Cut-off om 1 time. Opdager fejlen. Retter mapping. Genbestiller alle 47 labels. Kl. 14:52. Cut-off nået – lige akkurat.

## Hvad er fragtintegration?

Fragtintegration er WMS'ets forbindelse til fragtmænds systemer. Når en pakke er klar til afsendelse, kalder WMS fragtmand-API'et og:

1. Sender pakkedata (modtageradresse, vægt, dimensioner, valgt fragtprodukt)
2. Modtager tracking-nummer og forsendelsesID
3. Henter fragtlabel som PDF eller ZPL (til labelprinter)
4. Printer label og klæber på pakken

Alt sker typisk inden for 1-3 sekunder fra scanning af pakken.

## Fragtmænd og deres integration

### GLS

GLS er den mest brugte fragtmand i dansk e-handel. GLS-API'et er relativt simpelt, men metode-nøglerne er kritiske.

**Metode-nøgler (skal matche præcist):**
- `gls_private_droppoint` – levering til GLS-pakkeshop/droppoint
- `gls_business_delivery` – erhvervslevering direkte til virksomhed
- `gls_flex_delivery` – privat hjemmelevering med fleksibel levering

Nøglerne matches mod den leveringsmetode, kunden valgte i webshopen. Fejl i mapping giver enten forkert fragtprodukt eller mislykket label-generering.

GLS-pakkedata der kræves:
- Modtageradresse (komplet)
- Pakkers vægt i gram
- Pakkeshop-ID (ved droppoint-levering)

GLS Pakkeshop-ID: hentes via GLS's pakkeshop-API baseret på det droppoint-ID, kunden valgte i checkout.

### PostNord

PostNord kræver et ekstra registrerings-element sammenlignet med GLS: **MISKOS-nummer**.

**MISKOS-nummer**: Et 9-cifret kundenummer hos PostNord. Det er din virksomheds PostNord-kundeidentifikator og skal inkluderes i hvert API-kald. Uden det afviser PostNord API-kaldet.

MISKOS-nummeret udleveres af PostNord ved kundeaftaleindgåelse. Gem det sikkert – det er obligatorisk i alle PostNord API-kald.

PostNord API-endpoint for labelgenerering:
```
POST /rest/logistics/order/v1/{MISKOS}
Authorization: Bearer {access_token}
{
  "shipment": {
    "sender": {...},
    "receiver": {...},
    "consignor": {"quickId": "{MISKOS}"},
    "parcels": [{"weight": {"value": 1500, "unit": "GRM"}}]
  }
}
```

PostNord understøtter produktkoder: MyPack Collect (pakkeboks), MyPack Home (hjemmelevering), PostNord Express.

### Bring

Bring (PostNord Norge) bruges primært til norske leverancer. Bring-integration har ét specifikt krav til telefonnummer-format, der giver overraskende mange fejl.

**Telefonnummer-format**: Bring kræver at modtagerens telefonnummer starter med `+47` efterfulgt af enten:
- 9 cifre (mobilnummer)
- 4 cifre (fastnetnummer – sjælden i dag)

Format: `+479XXXXXXXX` (mobil) eller `+4722XXXXXX` (fastnet).

Et telefonnummer uden `+47`-præfiks, med spaces, med bindestreger eller med forkert cifre-antal afvises af Bring API. Det er en validerings-fejl der altid burde fanges i WMS-frontend, men ofte ikke gør det.

Bring-specifikke pakkedata:
- Produktkode: `SERVICEPAKKE` (standard pakkeshop), `BPAKKE_DOREN` (hjemmelevering)
- Afsender- og modtagerinformation komplet
- Vægt i gram

## Hvad koster fragtintegration-fejl?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Forkert GLS metode-nøgle | 10% af ordrer = 50/dag | 50 × 85 kr. (fragtdifference) = 4.250 kr./dag | Kundeservice: 2.000 kr./dag | **2.281.250 kr./år** |
| MISKOS-nummer mangler (PostNord) | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 4 timer: ~10.000 kr. | **10.000 kr. per episode** |
| Bring telefonnummer-format fejler | 15% af ordrer til Norge = 8/dag | Manuel korrektion: 800 kr./dag | Forsinkelse: 1.600 kr./dag | **876.000 kr./år** |

**Konklusion:** Forkert GLS metode-nøgle er den dyreste fejl. MISKOS-mangler stopper alt.

## Fragtvalg og mapping

Flowet fra kundeklik til fragtlabel:

1. Kunden vælger "GLS Pakkeshop" i Shopify-checkout
2. Shopify gemmer valget som shipping_line med metodenøgle
3. WMS modtager ordren og mapper metodenøgle til intern fragtprofil
4. Intern fragtprofil mapper til GLS API-produktkode: `gls_private_droppoint`
5. WMS sender bookingforespørgsel til GLS API
6. GLS returnerer tracking-nummer og label-PDF
7. Label printes på pakkestationen

Fejl opstår typisk i trin 3-4: mapping mellem webshop-metodenøgle og WMS-fragtprofil.

## Typiske fejl

**1. Forkert GLS metode-nøgle**
`gls_droppoint` i stedet for `gls_private_droppoint`. GLS API returnerer fejl eller bestiller forkert produkt. Altid brug de præcise nøgler fra GLS integration-dokumentation.

**2. MISKOS-nummer mangler for PostNord**
API-kald sendes uden MISKOS. PostNord returnerer 403 Forbidden eller 400 Bad Request. MISKOS er obligatorisk i URL-stien, ikke kun i body.

**3. Bring telefonnummer-format fejler**
Kunden har indtastet "20 12 34 56" i checkout. WMS sender `+4720123456` – 8 cifre efter +47. Bring afviser. Implementér telefonnummer-validering og -formatering i ordreimport.

## Sådan gør du det rigtigt

**1. Test alle fragtprodukter explicit**: GLS privat, GLS erhverv, PostNord hjemmelevering, PostNord pakkeboks, Bring – test hvert enkelt med en testorder inden go-live.

**2. Gem fragtmand-svar som log**: Track-nummer, booking-ID og evt. fejlbesked gemmes pr. ordre. Det er kritisk for fejlfinding og reklamationer.

**3. Implementér fragtmand-fallback**: Hvis primær fragtmand API er nede, er der alternativ procedure (manuel bestilling). Fragtmand-API-nedbrud forekommer – hav en plan.

## Tjekliste

- [ ] Er alle GLS metode-nøgler konfigureret og testet?
- [ ] Er PostNord MISKOS-nummer konfigureret i WMS?
- [ ] Valideres Bring-telefonnumre til +47-format inden afsendelse?
- [ ] Er fragtmand-svar (track-nummer) gemt pr. ordre?
- [ ] Er alle fragtprodukter testet med rigtige testadrasser?

## SmartPack understøttelse

SmartPack understøtter GLS, PostNord og Bring med præ-konfigurerede integrationer. GLS metode-nøgler konfigureres i fragtopsætning og matches mod webshop-leveringsmetoder. PostNord MISKOS-nummer konfigureres i fragtprofilen. Bring-telefonnummervalidering er built-in. Fragtlabels genereres og printes automatisk ved pakning. Tracking-numre gemmes på ordreniveau og videresendes til webshop ved fulfillment.

## FAQ

**Hvad er MISKOS-nummer og hvem har det?**
Et 9-cifret PostNord-kundenummer, der identificerer din virksomhed i PostNords system. Det udleveres af PostNord ved aftaleoprettelse. Det er obligatorisk i alle API-kald til PostNord.

**Hvad er GLS metode-nøgler?**
Interne identifikatorer for GLS-fragtprodukter brugt i API-integration. De tre primære: `gls_private_droppoint`, `gls_business_delivery`, `gls_flex_delivery`. Skal matches præcist mod webshop-leveringsmetoder.

**Hvad sker der, hvis fragtmand-API er nede?**
Pakkens label kan ikke genereres. WMS bør have alert ved API-fejl og procedure for manuel bestilling som backup.

**Kan jeg sende med flere fragtmænd fra samme WMS?**
Ja. WMS konfigureres med fragtprofiler pr. fragtmand. Valg af fragtmand sker automatisk baseret på ordrekriterierne: leveringsland, fragtmetode valgt af kunden, pakke-dimensioner.

**Hvad er ZPL-format til fragtlabels?**
Zebra Programming Language – et printerspecifikt format til thermallabel-printere (Zebra, Zebra-kompatible). Hurtigere og mere præcis end PDF til høj-volumen labelprint. Understøttes af de fleste fragtmænd.
