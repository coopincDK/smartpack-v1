---
primary_keyword: integration stopper webshop
secondary_keywords: [API integration fejl, WMS integration stop, webshop lager integration nedbrud, integration monitoring]
cluster: 11-EdgeCases
---

# Integration stopper: Når API'et mel lem webshop og lager går ned

Webshop kører.
Ordrer tikker ind.
Men lageret ser ingenting.

API-integrationen er brudt.
4 timer går.
200 ordrer sidder fast.

Kl. 16:30 ringer en kunde: "Hvor er min pakke?"
Du opdager det.
For sent.

Ved 4 timers stop: 129.000 kr. i tabt drift.
Og du havde ingen alarm.

## Hvad er en integration-fejl?

API-integrationen mel lem webshop (Shopify, WooCommerce, Magento etc.) og WMS er den kritiske datakommunikation der sørger for at ordrer overføres til lageret. Når den fejler:
- Ordrer sidder i webshopppen og når ikke WMS
- Lager-opdateringer når ikke webshopen (oversalg-risiko)
- Tracking-numre genereres men sendes ikke til kunden

## Fejltyper

**1. API-timeout**: systemet forsøger kommunikation men får ingen svar inden tidsfristen
**2. Autentifikationsfejl**: API-nøgle eller token er udløbet
**3. Dataformat-fejl**: opdatering i webshop ændrede format af data WMS forventer
**4. Rate-limiting**: for mange API-kald per tidsenhed – fragtleverandør eller webshop throttler
**5. Netværksfejl**: Forbindelsen mel lem servere er brudt

## Opdagelse: overvvågning er nøglen

### Aktiv overvågning (den rigtige måde)
- Alert når ingen ordrer er synkroniseret i 15–30 minutter (på en dag med ordrer)
- Alert når API-fejlrate overstiger 5%
- Alert når lager-saldo-opdatering er forsinket > 5 minutter

Værktøjer: Datadog, New Relic, UptimeRobot, eller WMS's indbyggede integration-log.

### Passiv opdagelse (den dårlige måde)
Kundeservice får opkald: "Min ordre er ikke afsendt endnu." Det er for sent – du er bag tidsfristen.

## Hvad koster det – i hårde tal?

| Integration-stop varighed | Ordrer akkumuleret (50/time) | Forsinkede ordrer | Kundeservice (30 min/ordre) | LTV-tab (10% churn) | Total omkostning |
|---------------------------|------------------------------|-------------------|----------------------------|---------------------|------------------|
| 2 timer | 100 | 100 × 350 kr. = 35.000 kr. | 25.000 kr. | 4.500 kr. | **64.500 kr.** |
| 4 timer | 200 | 200 × 350 kr. = 70.000 kr. | 50.000 kr. | 9.000 kr. | **129.000 kr.** |
| 8 timer (arbejdsdag) | 400 | 400 × 350 kr. = 140.000 kr. | 100.000 kr. | 18.000 kr. | **258.000 kr.** |

**Ved 3 integration-stops/år (gennemsnit 4 timer): 387.000 kr./år**

## Det opdager de fleste for sent

1. **Integrationen fejler kl. 10:00, opdages kl. 16:30** – Ingen bemærker at ordrer ikke synkroniseres. Webshop kører. Kunder får ordrebekræftelse. Men lageret ser ingenting. Kl. 16:30 ringer en kunde: “Hvor er min pakke?” 325 ordrer er akkumuleret. Alle skal ekspederes i morgen. Panik. Opdagelse: I har ingen integration-monitor.

2. **API-token udløber kl. 03:00 om natten** – Automatisk fornyelse var ikke sat op. Token udløber. Integration stopper. Ingen bemærker det før kl. 09:00. 6 timers ordrer (300 stk.) sidder fast. Opdagelse: når I manuelt skal importere 300 ordrer og opdager at halvdelen er duplikater fordi integrationen ikke er idempotent.

3. **Webshop-opdatering bryder API-format** – Shopify opdaterer sin API. Din integration forventer gammelt format. Den bryder. Men I har ingen staging-test. Opdagelse: når 2 dages ordrer (800 stk.) skal håndteres manuelt, fordi integrationen skal re-kodes.

## Når integrationen er brudt: hvad gør du?

### Trin 1: Diagnostiser fejlen
- Tjek integration-log i WMS og webshop
- Identificer fejltype (timeout, auth, format, rate-limit)
- Tidsst emplet: hvornår stoppede den?

### Trin 2: Håndter akkumulerede ordrer
- Eksporter ordrer modtaget siden integration-stop fra webshop
- Importer manuelt til WMS (eller brug fallback-procedure)

### Trin 3: Fix integrationen
- Timeout: genstart integration-service
- Auth: forny API-token/-nøgle
- Format: revert kode-ændring eller opdater WMS-mapping
- Rate-limit: implementer backoff og kø-mekanisme

### Trin 4: Verificer at den virker
Send en test-ordre. Verificer at den når WMS inden for 2 minutter.

### Trin 5: Root-cause og forebyggelse
Hvord an kan dette forhindres fremover? Bedre overvågning? Webhook vs. polling?

## Forebyggelse

- **Overvågning med alert** – før kunden klager
- **Idempotent integration** – genseending af ordre må ikke skabe duplikater
- **Webhook over polling** – webhooks reagerer straks, polling er forsinket og ressourcekrævende
- **API-token rotation** – automatisk fornyelse inden udløb
- **Staging-test ved opdateringer** – test integration mod staging før produktionsdeploy

## Typiske fejl

- **Ingen integration-overvågning** – du opdager fejlen via kundereklamation
- **API-token udløber** – ingen automatisk fornyelse
- **Duplikerede ordrer ved re-integration** – integration ikke idempotent
- **Webshop-opdatering bryder API** – ingen staging-test
- **Rate-limiting ikke håndteret** – integration stopper ved spidslast

## Best practice

- Aktiv overvågning med alerts (15-min ingen sync = alarm)
- Automatisk API-token fornyelse
- Idempotent ordreoverførsel
- Webhook-baseret integration (ikke polling)
- Staging-test af alle integration-påvirkende opdateringer

## Brug denne artikel: tjekliste

- [ ] Integration-overvågning med alert sat op
- [ ] API-token automatisk fornyelse konfigureret
- [ ] Idempotent integration bekræftet (ingen duplikater ved re-send)
- [ ] Staging-test procedure på plads ved opdateringer
- [ ] Fallback-procedure for manuelt ordre-import dokumenteret

**Næste skridt:** Opsæt en simpel overvågnings-alert: ingen ordrer synkroniseret i 30 minutter = e-mail/SMS alarm. Det er det vigtigste enkelt-skridt.

## SmartPack: JA eller NEJ?

**JA, hvis:**
- Over 100 ordrer/dag (integration-stop koster 64.500+ kr. per hændelse)
- Du har oplevet integration-stop (selv én gang – det sker igen)
- Ingen integration-monitor eller automatisk token-fornyelse
- Flere integrationer (webshop + fragt + 3PL)

**NEJ, hvis:**
- Under 30 ordrer/dag med manuel ordre-håndtering som fallback
- Allerede har robust API-monitor og idempotent integration

**Hvad koster alternativet?**

| Alternativ | Integration-stops/år | Gns. varighed | Årlig omkostning | Forskel vs. SmartPack |
|------------|----------------------|---------------|------------------|----------------------|
| Ingen monitor, manuel import | 6-8 | 4 timer | 516.000-774.000 kr. | **+516.000-774.000 kr./år** |
| Monitor, men ingen auto-fix | 4 | 3 timer | 387.000 kr. | **+387.000 kr./år** |
| Monitor + auto-token-fornyelse | 2 | 2 timer | 129.000 kr. | **+129.000 kr./år** |
| SmartPack (monitor + auto-fix + idempotent) | 0-1 | 30 min | 0-32.250 kr. | — |

**SmartPack's integration-engine overvåger alle API-forbindelser i realtid** og sender alarm ved fejl inden 5 minutter. Automatisk token-fornyelse og idempotent ordreoverførsel er standard. Ved integration-stop: automatisk fallback til manuel import-guide med pre-validering.

## FAQ

**Hvad er et API?**
Application Programming Interface – den tekniske forbind else mel lem to systemer. Din webshops API sender ordrer til dit WMS's API.

**Hvad er forskellen på webhook og polling?**
Webhook: WMS får besked straks når ny ordre er i webshop. Polling: WMS spørger webshop hvert N minut "er der nye ordrer?". Webhook er hurtigere og mere effektivt.

**Hvad er idempotent integration?**
En integration hvor gensending af den samme ordre ikke skaber duplikater. Kritisk ved integration-fejl og re-sync.

**Hvord an tjekker man om integrationen virker?**
Lav en test-ordre. Tjek om den dukker op i WMS inden for 2 minutter.

**Hvad er rate-limiting?**
En begrænsning på antal API-kald per tidsenhed. Overskrides den: API svarer med fejl og stopper yderligere kald midlertidigt.
