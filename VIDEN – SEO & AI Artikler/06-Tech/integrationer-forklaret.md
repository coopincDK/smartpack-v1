---
primary_keyword: integrationer lagerstyring
secondary_keywords: [wms integration forklaret, api webhook lagerstyring, system integration e-handel, wms shopify integration]
cluster: 06-Tech
---

# Integrationer forklaret – sådan taler dine systemer sammen

Mandag morgen kl. 08:47. Lagerchefen åbner WMS. 0 nye ordrer. Underligt – normalt 47 ordrer om natten. Tjekker Shopify: 52 ordrer. Webhook-integration fejlet kl. 23:34 søndag. Ingen alarm. 52 ordrer sidder i Shopify. WMS ved intet. Stille fejl. Opdages efter 9 timer.

## Hvad er en integration?

En integration er en automatiseret forbindelse mellem to systemer, der gør det muligt for dem at udveksle data uden manuel indgriben. I lagerstyringssammenhæng er de vigtigste integrationer:

- **Webshop → WMS**: Ordrer sendes til WMS til behandling
- **WMS → Webshop**: Fulfillment-status og tracking sendes tilbage
- **WMS → ERP**: Beholdning, afsendelse og eventuel fakturering
- **WMS → Fragtmand**: Fragttransport bestilles, labels genereres
- **WMS → Indkøbssystem**: Genbestilling ved minimum-lager

Integrationerne udgør rygraden i et moderne lagerflow. En svag integration er i praksis en flaskehals, uanset hvor godt hvert enkelt system er.

## Integrationstyper: API vs. Webhook

De to dominerende teknologier er **API (pull)** og **Webhook (push)**. De er ikke konkurrenter – de løser forskellige problemer og bruges ofte i kombination.

### API – du spørger, systemet svarer

API (Application Programming Interface) fungerer som et spørgsmål-svar-system. Dit WMS sender en forespørgsel til f.eks. Shopify: "Vis mig alle ubehandlede ordrer fra de seneste 10 minutter." Shopify svarer med en liste.

Det kræver:
- AppId og AccessToken (autentifikation)
- Et endpoint (URL til API'et)
- En planlagt hentning (polling) – typisk hvert 1-5. minut

API egner sig godt til: periodisk synkronisering, opslag, opdatering af lagertal.

### Webhook – systemet fortæller dig, når noget sker

En webhook er en push-notifikation. Shopify sender dig automatisk en besked, når en ordre oprettes – du behøver ikke spørge. Det sker i realtid.

Krav til webhook-modtagelse:
- HTTPS-endpoint (usikrede HTTP accepteres ikke)
- Svartid under 30 sekunder (ellers timeout og retry)
- HMAC-SHA256 signaturvalidering (bekræfter, at beskeden er ægte)

Webhooks egner sig godt til: ordremodtagelse, betalingsbekræftelse, statusopdateringer.

### Filintegration – det tredje alternativ

Ældre systemer bruger stadig filbaseret integration: CSV- eller XML-filer udveksles via FTP/SFTP. Det er langsomt, fejlprone og svært at monitorere – men det eksisterer, særligt i ERP-sammenhæng.

## Hvad koster integrationsfejl REELT?

| Fejltype | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Webhook-tab uden retry | 5% af ordrer = 25/dag | 25 × 350 kr. = 8.750 kr./dag | 25 × 0,43 × 2.400 = 25.800 kr./dag | **12.605.625 kr./år** |
| Ingen HMAC-validering → svindel | 1 falsk ordre/måned | Svindel: ~8.000 kr./episode | Tab af payment processor: ukvantificerbar | **96.000 kr./år** |
| Polling for hyppigt → rate limiting | 100% af ordrer (total stop) | 0 kr. (ordrer venter) | Downtime 2 timer: ~8.000 kr. | **8.000 kr. per episode** |
| Ingen retry-logik | 3% af API-kald fejler | 15 ordrer/dag × 350 kr. = 5.250 kr./dag | 15 × 0,43 × 2.400 = 15.480 kr./dag | **7.566.750 kr./år** |

**Konklusion:** Webhook-tab uden retry er den dyreste fejl. Ingen retry-logik er den hyppigste.

## Hvornår er integrationer et problem?

Integrationer fejler ikke spektakulært. De fejler stille. Det er det farligste scenarie:

- En ordre modtages i Shopify – men webhook leveres ikke til WMS (og ingen opdager det)
- Lagertal opdateres i WMS – men API-synkronisering til Shopify er fejlet i 2 timer
- Fragtbestilling sendes – men fragtmand-API returnerer fejl, der ikke logges

Stille fejl er langt farligere end hårde fejl. En hård fejl stopper systemet – det opdages. En stille fejl fortsætter usynligt og opbygger datasæt, der afviger fra virkeligheden.

## Integrationsmønstre i e-handel

**Synkron integration**: System A kalder System B og venter på svar, før det fortsætter. Simpelt, men sårbart – hvis B er langsom, bremser det A.

**Asynkron integration**: System A sender beskeden og fortsætter. Beskeden lander i en kø og behandles, når B er klar. Mere robust, men kræver fejlhåndtering i køen.

**Event-drevet integration**: Hændelser (ordre oprettet, vare plukket, pakke afsendt) trigger automatisk alle relevante systemer. Det er den mest skalerbare arkitektur og det, SmartPack bruger.

## Typiske fejl

**1. Ingen retry-logik**
Webhooks og API-kald fejler. Netværket fejler. Servere er nede. Uden automatisk retry mister du data. Implementér eksponentiel backoff: prøv igen efter 1 min, 5 min, 30 min.

**2. Manglende signaturvalidering**
Webhooks fra Shopify indeholder en HMAC-SHA256-signatur. Validerer du den ikke, kan hvem som helst sende falske ordre-events til dit endpoint. Det er en sikkerhedsbrist, ikke bare en teknisk anbefaling.

**3. Polling for hyppigt eller for sjældent**
API-polling hvert 30. sekund giver unødvendig belastning og rate limiting. Polling hvert 30. minut giver for lang forsinkelse. Justér interval til faktisk behov – for de fleste: 2-5 minutter for ordrer, 15-30 minutter for lagertal.

**4. Ignorere integration health monitoring**
Uden monitoring ved du ikke, hvornår en integration sidst kørte succesfuldt. Integrationsfejl opdages typisk af kunderne – det er for sent.

## Sådan gør du det rigtigt

**1. Log alt**: Hvert API-kald og webhook-modtagelse bør logges med timestamp, payload og respons-kode. Logging er din primære fejlsøgningsressource.

**2. Brug idempotente endpoints**: Hvis samme webhook leveres to gange (det sker), må systemet ikke oprette to ordrer. Implementér idempotency-nøgler.

**3. Adskil systemer med en message queue**: En kø (RabbitMQ, Azure Service Bus, AWS SQS) beskytter mod spikes og giver buffer ved kortvarige nedbrud.

## Tjekliste

- [ ] Er alle webhooks konfigureret med HMAC-SHA256 validering?
- [ ] Har du retry-logik på alle API-kald og webhook-modtagelse?
- [ ] Monitorerer du integration health (sidst succesfuldt kald)?
- [ ] Logger du alle integrationsevents med tilstrækkelig detaljegrad?
- [ ] Er der alerting ved integrationsfejl?

## SmartPack understøttelse

SmartPack bruger event-drevet integration med webhook-support og periodisk API-polling. Alle webhooks valideres med HMAC-SHA256. Integrationer til Shopify, WooCommerce, e-conomic og Business Central er præ-konfigurerede. SmartPack logger alle integrationshændelser og viser integration health i administrationspanelet – du ser straks, hvornår en integration sidst kørte succesfuldt.

## FAQ

**Hvad er forskellen på API og webhook?**
API er pull: du spørger og får svar. Webhook er push: systemet fortæller dig, når noget sker. Brug webhook til realtidshændelser, API til periodiske opslag.

**Skal min webhook have HTTPS?**
Ja, uden undtagelse. Shopify, WooCommerce og alle moderne platforme afviser HTTP-endpoints. Uden HTTPS valideres HMAC-signaturen heller ikke korrekt.

**Kan jeg have for mange integrationer?**
Teknisk set nej – men kompleksiteten stiger. Hvert integrationspunkt er et potentielt fejlpunkt. Prioritér integrationer med høj forretningsværdi og god vedligeholdelighed.

**Hvad er idempotency i integration?**
At det samme kald kan gentages uden at skabe duplikat-data. En ordre-webhook der leveres to gange må ikke skabe to ordrer i WMS. Det sikres via idempotency-nøgler (typisk ordre-ID).

**Hvad koster en integrationsnedbrud?**
Direkte: ordrer der ikke behandles, manuelt arbejde. Indirekte: forsinkede leverancer, utilfredse kunder, tabt tillid. Nedbrud i 2 timer på en travl dag kan betyde 30-50 forsinkede ordrer.
