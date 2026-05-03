---
primary_keyword: business central integration wms
secondary_keywords: [business central wms integration, bc client secret udlober, dynamics 365 lagerstyring, business central api]
cluster: 06-Tech
---

# Business Central integration med WMS – hvad du skal kende inden opsætning

Business Central (BC) er Microsofts ERP-løsning og den mest udbredte ERP i Danmark til SMV-segmentet. Integrationen med et WMS er teknisk velfungerende, men har én gotcha, der rammer næsten alle virksomheder på samme måde: client secret udløber efter 2 år, og ingen advarer dig. En dag holder din integration simpelthen op med at virke – og du ved ikke hvorfor.

## Hvad er Business Central integration?

Business Central-WMS-integration er en tovejs dataforbindelse, der typisk dækker:

**BC → WMS**:
- Salgsordrer: ordrer oprettet i BC sendes til WMS til behandling
- Varestamdata: artikler, stregkoder, priser
- Kundestamdata: leveringsadresser, betalingsbetingelser

**WMS → BC**:
- Afsendelsesbekræftelse: ordren er afsendt, tracking-nummer
- Beholdningsopdatering: aktuelle lagertal pr. lokation
- Returnering: returnerede varer og lagerregulering

## Autentificering: OAuth2 og Azure App Registration

Business Central bruger OAuth2 client credentials flow. Det kræver:

1. **Azure App Registration** i Microsoft Entra ID (tidligere Azure Active Directory)
2. **Client ID** (Application ID) – den offentlige identifikator
3. **Client Secret** – den hemmelige nøgle. Udløber. Det er her, det går galt.
4. **Tenant ID** – din Microsoft 365-organisations ID
5. **BC API-tilladelser** tildelt i App Registration: `Financials.ReadWrite.All` eller specifikke BC API-scopes

### Tokenflow:
WMS bruger Client ID + Client Secret til at hente access token fra Microsoft identity platform. Token er gyldigt i 1 time og fornyes automatisk.

**Det kritiske problem**: Client secret kan oprettes med maksimal levetid på 2 år. Udløber det, returnerer Microsoft 401 Unauthorized. Alt stopper. WMS henter ikke ordrer, BC modtager ikke afsendelsesbekræftelser.

Det er den hyppigste årsag til Business Central-integrationsnedbrud. Og det er fuldstændigt forebyggeligt.

## Hvad koster et BC client secret-udløb?

| Downtime-varighed | Tabte ordrer | Direkte tab | LTV-tab | Total omkostning |
|-------------------|--------------|-------------|---------|------------------|
| 4 timer (opdages hurtigt) | 83 ordrer (500/dag ÷ 6) | 0 kr. (ordrer venter) | Forsinkelse: ~5.000 kr. (kundeservice) | **5.000 kr.** |
| 1 dag (opdages næste morgen) | 500 ordrer | 0 kr. (ordrer venter) | Tabt salg: ~20.000 kr. (margin) | **20.000 kr.** |
| 2 dage (weekend) | 1.000 ordrer | Tabt salg: ~40.000 kr. | Churn: 1.000 × 0,08 × 2.400 = 192.000 kr. | **232.000 kr.** |
| 1 uge (opdages ved månedsafslutning) | 3.500 ordrer | Tabt salg: ~140.000 kr. | Churn: 3.500 × 0,15 × 2.400 = 1.260.000 kr. | **1.400.000 kr.** |

**Konklusion:** Et client secret-udløb opdaget efter 2 dage koster 232.000 kr. Opdaget efter en uge: 1,4 mio. kr.

**Og det sker ALTID efter præcis 2 år. Microsoft sender ingen advarsel.**

## Opsætning trin for trin

### Trin 1: Opret App Registration i Azure
1. Azure Portal → Microsoft Entra ID → App Registrations → New Registration
2. Navngiv: "WMS Integration" (eller lign.)
3. Supported account type: Single tenant
4. Gem Application (client) ID og Tenant ID

### Trin 2: Opret Client Secret
1. Certificates & Secrets → New client secret
2. Sæt udløb: 24 måneder (maksimum)
3. Gem secret value straks – den vises kun én gang
4. **Sæt kalenderreminder 30 og 60 dage før udløb**

### Trin 3: Tildel API-tilladelser
1. API permissions → Add permission → Dynamics 365 Business Central
2. Vælg `Financials.ReadWrite.All` (eller mindste privilegium)
3. Grant admin consent

### Trin 4: Konfigurér i Business Central
1. BC Admin Center → API setup
2. Tildel service-bruger til App Registration
3. Test med: `GET /api/v2.0/companies`

### Trin 5: Hent ordrer
```
GET /api/v2.0/companies({companyId})/salesOrders?$filter=status eq 'Open'
Authorization: Bearer {access_token}
```

BC returnerer JSON med åbne salgsordrer.

## BC API-specifika detaljer

BC bruger OData v4 og Microsoft Graph-kompatibelt REST API. Vær opmærksom på:

- **Pagination**: BC returnerer max 100 poster pr. kald. Brug `@odata.nextLink` til paginering.
- **Datofiltrering**: BC bruger ISO 8601 datoformat i OData-filter: `$filter=lastModifiedDateTime ge 2024-01-15T10:00:00Z`
- **Companyspecifik**: Alle API-endpoints kræver company ID. Hentes via `GET /api/v2.0/companies`.

## Det opdager de fleste for sent

- **At client secret udløber ALTID efter 2 år** — uanset om du husker det eller ej. Microsoft sender ingen email, ingen notifikation, ingen advarsel. Integrationen stopper bare. Første tegn: ordrer synkroniseres ikke.
- **At den person der oprettede App Registration er stoppet** — og ingen andre har adgang til Azure Portal. Når secret udløber, kan I ikke forny det. I skal oprette en ny App Registration fra bunden.
- **At BC API-tilladelser kan ændres af en anden admin** — en kollega "rydder op" i Azure og fjerner tilladelser. Integrationen fejler med 403 Forbidden. Ingen ved hvorfor.

## Typiske fejl

**1. Client secret udløber uden advarsel**
Hyppigste årsag til BC-nedbrud. Microsoft sender ingen notifikation. Sæt reminder 30-60 dage inden udløb og dokumentér hvem der har adgang til Azure Portal.

**2. For brede API-tilladelser**
`Financials.ReadWrite.All` giver adgang til alt. Brug mindste privilegium-princippet: giv kun adgang til de specifikke BC API'er, du bruger.

**3. Service-bruger slettet i BC**
Hvis den BC-bruger, der er konfigureret i App Registration, slettes, fejler integration med 403 Forbidden. Brug en dedikeret service-bruger, der aldrig slettes.

## Sådan gør du det rigtigt

**1. Dokumentér alle credentials med udløbsdatoer**: Opret et dokument (eller password manager entry) med Client ID, Tenant ID, secret-udløbsdato og hvem der har adgang.

**2. Rotér secret proaktivt hvert 18. måned**: Vent ikke på de 2 år. Rotér ved 18 måneder, så du aldrig er tæt på udløb i produktion.

**3. Test token-refresh i integration**: Implementér og test, at din integration korrekt håndterer token-refresh hvert 60. minut. Fejler refresh, skal alert sendes.

## Tjekliste

- [ ] Er client secret-udløbsdato dokumenteret?
- [ ] Er kalenderreminder sat 30 og 60 dage inden udløb?
- [ ] Bruges dedikeret service-bruger (ikke personlig BC-bruger)?
- [ ] Er API-tilladelser minimale (mindste privilegium)?
- [ ] Er pagination implementeret på alle list-kald?

## SmartPack: JA eller NEJ?

**JA** — hvis du vil undgå client secret-katastrofen.

SmartPack har præ-konfigureret Business Central integration via OAuth2. Client ID, Tenant ID og secret konfigureres i SmartPack admin. SmartPack advarer i admin-panelet, når client secret nærmer sig udløb (60 dage varsel + 30 dage varsel + 7 dage varsel). Ordrer hentes automatisk fra BC, behandles i WMS-flow, og afsendelsesbekræftelse med tracking sendes tilbage til BC.

**Alternativet:**
- Bygge egen BC-integration: 120.000–200.000 kr. udvikling (OAuth2 + OData + pagination)
- Manuel kalenderreminder for secret-udløb: risiko for 232.000 kr. tab ved 2-dages downtime (se tabel)
- Ingen monitoring: opdager fejl når kunder klager

**SmartPack-omkostning:** 60.000 kr./år (inkl. BC + alle andre integrationer).

**Breakeven:** Hvis SmartPack forhindrer ÉN client secret-episode (232.000 kr. ved 2 dages downtime) = **172.000 kr. sparet** i første år.

## FAQ

**Hvad er client secret i Business Central integration?**
En hemmelig nøgle tilknyttet din Azure App Registration, brugt til at autentificere API-kald. Har en levetid på maksimalt 2 år. Udløber den, fejler alle BC API-kald.

**Hvordan ved jeg, hvornår client secret udløber?**
I Azure Portal → App Registrations → din app → Certificates & secrets. Udløbsdatoen vises. Microsoft sender ingen automatisk advarsel.

**Kan jeg bruge Business Central uden App Registration?**
Nej, til API-integration. BC kræver OAuth2-autentificering via Azure App Registration. Basic auth er ikke understøttet til API.

**Hvad er OData, og hvad har det at gøre med BC?**
OData (Open Data Protocol) er det query-format BC bruger til sit REST API. Det muliggør avanceret filtrering, sortering og pagination direkte i URL-parametrene.

**Hvad sker der, hvis BC er offline?**
API-kald fejler med connection error eller timeout. WMS skal håndtere dette med retry og circuit breaker. BC-nedbrud er sjældne men forekommer ved Microsoft-opdateringer.

