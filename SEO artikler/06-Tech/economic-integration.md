---
primary_keyword: e-conomic integration wms
secondary_keywords: [economic wms integration, economic grant token, economic fakturakladde, economic ordrer lagerstyring]
cluster: 06-Tech
---

# e-conomic integration med WMS – ordrer, fakturaer og Grant Token

Mandag morgen kl. 08:12. e-conomic-integration holder op med at virke. Ordrer hentes ikke. Fakturakladder oprettes ikke. Årsag: Grant Token invalideret. Hvorfor? Den medarbejder der autoriserede integrationen for 18 måneder siden er stoppet. IT slettede hendes e-conomic-konto fredag eftermiddag. Token invalideret øjeblikkeligt. Ingen advarsel.

## Hvad er e-conomic integration?

e-conomic-WMS-integration dækker typisk:

**e-conomic → WMS**:
- Ordrer hentes fra e-conomic (typisk B2B-ordrer oprettet manuelt i e-conomic)
- Kundeoplysninger og leveringsadresser
- Varenumre og priser

**WMS → e-conomic**:
- Fakturakladde oprettes ved pakning
- Beholdningsopdatering
- Eventuelt: automatisk fakturagodkendelse og afsendelse til kunden

## Autentificering: Grant Token

e-conomic bruger ikke OAuth2 eller API-nøgler som de fleste moderne systemer. Det bruger en **Grant Token** – et persistent autoriseringstoken, der genereres ved en engangs-autorisationsproces.

### Sådan fungerer det:
1. En e-conomic-bruger med rettigheder autoriserer din applikation i e-conomic (via e-conomics Developer Portal)
2. Autorisationsprocessen genererer et **Grant Token** – en lang tekststreng
3. Grant Token gemmes i WMS-konfigurationen
4. WMS bruger Grant Token + App Secret Key til alle API-kald

Grant Token udløber ikke automatisk. Men det invalideres, hvis:
- Brugeren der autoriserede, slettes i e-conomic
- Administratoren trækker applikationens adgang tilbage i e-conomic

### Det kritiske scenarie
En medarbejder (typisk den, der stod for opsætningen) fratræder. IT-afdelingen sletter brugerens e-conomic-konto. Grant Token invalideres øjeblikkeligt. e-conomic-integration holder op med at virke – næste morgen, midt i en arbejdsdag, uden varsel.

**Løsning**: Brug altid en dedikeret systembruger/servicebruger til Grant Token-autorisering. Aldrig en personlig bruger.

## Hvad koster Grant Token-invalidering?

| Downtime-varighed | Tabte ordrer | Direkte tab | LTV-tab | Total omkostning |
|-------------------|--------------|-------------|---------|------------------|
| 4 timer (opdages hurtigt) | 0 (ordrer venter i e-conomic) | 0 kr. | Forsinkelse: ~5.000 kr. (kundeservice) | **5.000 kr.** |
| 1 dag (opdages næste morgen) | 0 (ordrer venter) | 0 kr. | Tabt salg: ~20.000 kr. (margin) | **20.000 kr.** |
| 1 uge (opdages ved månedsafslutning) | 0 (ordrer venter) | Fakturaer mangler: ~140.000 kr. | Cashflow-tab: ukvantificerbar | **140.000 kr.+ ** |

**Konklusion:** Grant Token-invalidering opdaget efter 1 uge koster minimum 140.000 kr. i manglende fakturaer + cashflow-problemer.

**Og det sker ALTID når den autoriserende bruger slettes. e-conomic sender ingen advarsel.**

## Ordrehentning – hvert 5. minut

e-conomic-ordrer hentes via polling (ikke webhook). SmartPack og de fleste WMS-systemer poller e-conomic API hvert 5. minut for nye ordrer.

```
GET /invoices/drafts?skippages=0&pagesize=25
X-AppSecretToken: {app_secret}
X-AgreementGrantToken: {grant_token}
```

e-conomic returnerer fakturakladder med status "draft" – det er ordrer klar til behandling.

Filters der typisk bruges:
- Kun kladder over en bestemt dato
- Specifikke debitorgrupper (B2B vs. B2C)
- Specifikke varenumre/varegrupper

## Fakturakladde ved pakning

En central del af e-conomic-integrationen: WMS opretter fakturakladde i e-conomic ved pakning – ikke ved ordremodtagelse, ikke ved afsendelse – men ved det præcise tidspunkt, pakken forsegles.

Hvorfor ved pakning?
- Det er det tidspunkt, du ved præcist, hvad der er med i forsendelsen (delvis pakning, substitutioner)
- Det stemmer overens med regnskabsprincipper: varen forlader lageret → transaktion oprettes

Workflow:
1. Plukker plukker varer og ankommer til pakkestation
2. Pakker bekræfter indhold og pakker
3. WMS opretter fakturakladde i e-conomic via API med præcist indhold
4. Fragtlabel genereres, pakke forsegles og afsendes
5. Fakturakladden kan evt. godkendes automatisk til endelig faktura

## Typiske fejl

**1. Grant Token autoriseret af personlig bruger**
Fratræder medarbejderen, invalideres token. Brug altid servicebruger.

**2. Fakturakladde oprettes ved ordremodtagelse**
Varen er måske ikke pakket endnu. Delvis pakning eller substitution er ikke reflekteret. Vent til pakningstidspunktet.

**3. Varenummer matcher ikke**
e-conomic varenumre skal matche WMS varenumre præcist. Masterdata-uoverensstemmelse giver fejl ved fakturakladde-oprettelse.

## Sådan gør du det rigtigt

**1. Brug servicebruger til Grant Token**: Opret en dedikeret e-conomic-bruger (f.eks. "WMS Service") udelukkende til integration. Sørg for, at den bruger aldrig slettes.

**2. Dokumentér Grant Token og App Secret Key sikkert**: Gem dem i password manager med noter om, hvem der har adgang og hvilken e-conomic-bruger der autoriserede.

**3. Opsæt alert ved e-conomic API-fejl**: Fejler hentning af ordrer fra e-conomic 3 gange i træk, sendes alert til driftsansvarlig. Stille fejl her betyder, at ordrer ikke behandles.

## Tjekliste

- [ ] Er Grant Token autoriseret af servicebruger (ikke personlig)?
- [ ] Er App Secret Key og Grant Token gemt sikkert?
- [ ] Oprettes fakturakladde ved pakning (ikke ordremodtagelse)?
- [ ] Er varenumre synkroniserede mellem WMS og e-conomic?
- [ ] Er alert konfigureret ved API-fejl?

## SmartPack understøttelse

SmartPack henter ordrer fra e-conomic hvert 5. minut via polling. Grant Token og App Secret Key konfigureres i SmartPack admin. Fakturakladde oprettes automatisk ved pakning med præcist indhold. SmartPack sender alert, hvis e-conomic API fejler gentagne gange. Integration testes med e-conomic demo-miljø inden go-live.

## FAQ

**Hvad er et Grant Token i e-conomic?**
Et persistent autoriseringstoken, der genereres ved en engangs-autorisationsproces af en e-conomic-bruger. Bruges af WMS til alle API-kald. Invalideres, hvis den autoriserende bruger slettes.

**Hvornår hentes ordrer fra e-conomic?**
I SmartPack hentes ordrer fra e-conomic hvert 5. minut via API-polling. e-conomic understøtter ikke webhooks.

**Hvad er en fakturakladde i e-conomic?**
En ufuldstændig faktura, der kan redigeres. I WMS-sammenhæng oprettes en fakturakladde ved pakning med det præcise ordreindhold. Den godkendes derefter (manuelt eller automatisk) til endelig faktura.

**Kan e-conomic-integration bruges med Shopify-ordrer?**
Ja. Ordrer fra Shopify behandles i WMS, og e-conomic opdateres via WMS-integration med bogføring og faktura. Shopify er ikke direkte forbundet til e-conomic i dette setup.

**Hvad sker der, hvis e-conomic er nede?**
API-kald fejler. Ordrer hentes ikke. WMS skal have retry-logik og alert-mekanisme. Ordrer kan behandles manuelt, men fakturakladder oprettes ikke, før forbindelsen er genoprettet.
