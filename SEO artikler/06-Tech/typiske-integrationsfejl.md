---
primary_keyword: typiske integrationsfejl lagerstyring
secondary_keywords: [integrationsfejl wms, webhook fejl, api sync fejl, stille fejl lagerstyring]
cluster: 06-Tech
---

# Typiske integrationsfejl i lagerstyring – og hvordan du undgår dem

Integrationen virker. Ordrer flyder ind, lager opdateres, pakker sendes. Og så en dag opdager I, at 47 ordrer ikke er behandlet siden i går morges – og ingen vidste det. Det er integrationsfejlenes natur: de sker oftest usynligt, opdages sent og koster dyrt. Her er de mest typiske fejl, hvad der forårsager dem, og hvad du gør ved det.

## Hvad er integrationsfejl?

En integrationsfejl opstår, når to systemer ikke kan kommunikere som forventet. Det kan skyldes tekniske problemer (server nede, netværksfejl, timeout), datamæssige problemer (forkert format, manglende felt) eller logiske problemer (mapping-fejl, duplikater, timing-konflikter).

Integrationsfejl har fire grundlæggende former:

**Stille fejl (silent failure)**: Systemet fejler, men rapporterer det ikke. En webhook modtages ikke, men ingen alarm udløses. Den farligste type, fordi den er usynlig.

**Hård fejl (hard fail)**: Systemet fejler og stopper. En ordre kan ikke oprettes, og brugeren ser en fejl. Ubehageligt – men lettere at opdage og fix.

**Delvis synkronisering**: Kun dele af dataen overføres korrekt. F.eks. ordren importeres, men fragtadressen mangler. Systemet tror alt er OK.

**Timing-fejl**: Data ankom i forkert rækkefølge. Et lager-update kom frem, inden ordren den refererer til var oprettet. Resulterer i "orphaned" data.

## Hvad koster integrationsfejl REELT?

| Scenarie | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------|---------|------------------------|
| BC client secret udløber (2 dage downtime) | 0 kr. (ingen ordrer synkes) | Tabt salg: ~40.000 kr. (500 ordrer/dag × 40 kr. AOV margin) | **40.000 kr. per episode** |
| Stille fejl (47 ordrer ikke importeret, opdages efter 24 timer) | 47 × 350 kr. = 16.450 kr. (genbestilling) | 47 × 0,43 × 2.400 kr. = 48.552 kr. | **64.002 kr. per episode** |
| Webhook-tab uden retry (5% af ordrer tabes ugentligt) | 175 ordrer/uge × 350 kr. = 61.250 kr. | 175 × 0,43 × 2.400 kr. = 180.600 kr. | **3.182.200 kr./år** |
| Leveringsmetode-mapping fejl (10% af ordrer får forkert fragt) | 50 ordrer/dag × 85 kr. = 4.250 kr./dag | Kundeservice + churn: ~2.000 kr./dag | **2.281.250 kr./år** |

**Konklusion:** Stille fejl er de dyreste. De opdages sent, rammer mange ordrer og skader kundetillid.

## Hvornår ser du problemerne?

Stille fejl opdages typisk ikke af systemet – de opdages af kunden ("min ordre er ikke afsendt"), af lagerpersonalet ("vi mangler varer, der ifølge systemet er på lager") eller af ledelsen ved månedlig optælling.

Signaler der bør vække alarmen:
- Lagertal i WMS afviger fra webshop uden forklaring
- Ordrer der er "unfulfilled" i Shopify, men "afsendt" i WMS
- Kunder der ikke modtager forsendelsesmail
- Dubletter i ordrelisten
- Daglige ordreantal der pludselig falder (ordrer der ikke importeres, ser ud som et fald)

## Gennemgang af de mest typiske fejl

### 1. Webhook leveres ikke / ignoreres

**Hvad sker**: Shopify sender webhook-event, men dit WMS er utilgængeligt i det øjeblik (deployment, server-restart, netværksfejl). Shopify får ikke 200 OK tilbage og forsøger retry – men dit system håndterer det ikke korrekt, og eventet forsvinder.

**Årsag**: Manglende retry-håndtering, timeout under deployment, ingen kø som buffer.

**Løsning**: Brug en message queue (Azure Service Bus, RabbitMQ) som buffer. WMS behandler fra køen, ikke direkte fra webhook.

### 2. BC client secret udløber

**Hvad sker**: Business Central-integrationen holder op med at virke – pludseligt, uden varsel. Ordrer synkroniseres ikke, lagertal opdateres ikke. Årsagen: client secret i Azure App Registration er udløbet.

**Årsag**: Business Central bruger OAuth2 med client secret, der har en maksimal levetid på 2 år. Det er den hyppigste årsag til BC-integrationsnedbrud. De fleste virksomheder sætter det op og glemmer det.

**Løsning**: Sæt kalenderreminder 30 og 60 dage før udløb. Dokumentér, hvem der har adgang til Azure App Registration. Overvej at rotere secret proaktivt hvert 18. måned.

### 3. Leveringsmetode-mapping fejler

**Hvad sker**: Kunden vælger "GLS Pakkeshop" i Shopify-checkout. I WMS mappes det til forkert fragtprodukt, fordi nøglen ikke matcher. Pakken sendes med forkert service.

**Årsag**: Shopify bruger interne nøgler til leveringsmetoder. Custom shipping-metoder i Shopify refereres internt som `shopify_custom_dk` → efterfulgt af den specifikke metodeidentifikator. Fejl i denne mapping giver forkert fragtvalg eller mislykket fulfillment.

**Løsning**: Gennemgå og test alle leveringsmetode-mappings i staging-miljø, inden du går i produktion. Tjek præcist, hvilken nøgle Shopify sender i webhook-payloaden.

### 4. Delvis synkronisering af ordrelinjer

**Hvad sker**: En ordre med 5 varelinjer importeres – men kun 4 linjer med. Den femte linje mangler, typisk fordi varen ikke findes i WMS-produktkatalog.

**Årsag**: Varenummeret i Shopify matcher ikke varenummeret i WMS. Masterdata er ikke synkroniseret.

**Løsning**: Implementér validering ved ordreimport. Hvis et varenummer ikke kan matches, skal ordren holdes i fejlkø – ikke stiltiende delvis importeres.

### 5. Timing-fejl ved lageroprettelse

**Hvad sker**: En ny vare tilføjes i Shopify og bestilles straks af en kunde. Webhook for ordren ankommer til WMS, inden varestamdata er synkroniseret. WMS kender ikke varen og fejler.

**Årsag**: Pull-synkronisering af varestamdata kører hvert 15. minut. Webhook for ordren ankommer efter 30 sekunder.

**Løsning**: WMS skal kunne håndtere "ukendt vare" gracefully – f.eks. ved at placere ordren i manuelt review-kø og hente varestamdata on-demand.

### 6. e-conomic Grant Token er trukket tilbage

**Hvad sker**: e-conomic-integration holder op med at virke. Ordrer hentes ikke, fakturakladder oprettes ikke.

**Årsag**: e-conomic bruger Grant Token-autentificering. Hvis brugeren, der oprettede token, er slettet i e-conomic (f.eks. en fratrådtmedarbejder), invalideres tokenet.

**Løsning**: Brug en servicebruger/systembruger i e-conomic til integration – ikke en personlig bruger.

## Det opdager de fleste for sent

- **At BC client secret udløber præcis 2 år efter oprettelse** — og Microsoft sender INGEN advarsel. Integrationen stopper pludseligt. Første tegn: kunder ringer og spørger hvorfor deres ordre ikke er afsendt.
- **At webhook-tab er usynlige** — Shopify sender webhook, men dit system er nede i 12 sekunder under deployment. Webhook forsvinder. Ingen alarm. Ordren behandles aldrig. Opdages først når kunden klager.
- **At e-conomic Grant Token invalideres når brugeren slettes** — den medarbejder der oprettede integrationen er stoppet for 6 måneder siden. Token er trukket tilbage. Fakturaer oprettes ikke længere. Bogholderiet opdager det ved månedsafslutning.

## Sådan gør du det rigtigt

**1. Implementér integration health dashboard**: Vis, hvornår hver integration sidst kørte succesfuldt, antal behandlede events og eventuelle fejl. Det bør være det første, driftsholdet tjekker om morgenen.

**2. Alert ved ingen aktivitet**: Hvis en integration ikke har modtaget events i 30 minutter i arbejdstiden – send alert. Fraværet af data er i sig selv et signal.

**3. Test alle fejlscenarier eksplicit**: Unit test og integrationstests skal inkludere fejlscenarier: webhook med ugyldig signatur, ordre med ukendt varenummer, API-timeout, delvis payload. Ikke kun happy path.

## Tjekliste

- [ ] Har du kalenderreminder for BC client secret-udløb?
- [ ] Er alle leveringsmetode-mappings testet i staging?
- [ ] Bruger du servicebruger (ikke personlig) til e-conomic og BC?
- [ ] Har du alert ved manglende integrationsaktivitet?
- [ ] Fejlplaceres ordrer med ukendte varenumre i review-kø?

## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå stille fejl og token-udløb.

SmartPack monitorerer alle integrationsforbindelser aktivt og viser status i administrationspanelet. Ved integrationsfejl logges detaljer med payload og fejlkode. Ordrer der fejler ved import, placeres i manuelt review – de forsvinder aldrig stille. SmartPack advarer om kommende token-udløb (60 dage før BC client secret udløber) og har built-in retry-logik på alle webhook- og API-kald.

**Alternativet:**
- Bygge egen integration: 80.000–150.000 kr. udvikling + 20.000 kr./år vedligehold
- Ingen monitoring: risiko for 3,2 mio. kr./år i webhook-tab (se tabel)
- Manuel token-tracking: kalenderreminder + håb om at den rette person ser den

**SmartPack-omkostning:** 60.000 kr./år (inkl. alle integrationer + monitoring).

**Breakeven:** Hvis SmartPack forhindrer ÉN BC client secret-episode (40.000 kr.) + ÉN stille fejl-episode (64.000 kr.) = **104.000 kr. sparet** — systemet har betalt sig selv tilbage + 44.000 kr. i overskud.

## FAQ

**Hvad er den farligste type integrationsfejl?**
Stille fejl. Systemet rapporterer intet – men data overføres ikke. Det opdages typisk af kunder eller ved manuel optælling. Dage kan gå, inden nogen opdager det.

**Hvorfor udløber BC client secret?**
Microsoft kræver rotation af client secrets i Azure AD/Entra ID. Maksimal levetid er 2 år. Det er ikke en fejl i systemet – det er en sikkerhedsforanstaltning. Men den sniger sig op på dig, hvis du ikke har reminder.

**Hvad sker der, hvis en webhook sendes to gange?**
Shopify sender retries ved manglende kvittering. Hvis dit system ikke er idempotent, oprettes der duplikat-ordrer. Implementér idempotency-nøgler baseret på ordre-ID.

**Kan jeg teste integrationer uden rigtige ordrer?**
Ja. Shopify har et "Send test notification"-funktionalitet for webhooks. Business Central og e-conomic kan testes med testmiljøer/sandbox. Brug altid sandbox ved opsætning af nye integrationer.

**Hvad er delvis synkronisering, og hvad gør jeg ved det?**
Delvis synkronisering er, når kun dele af data overføres. F.eks. ordren importeres, men adresse mangler. Detekteres via validering ved import og fejlkø med notifikation.

