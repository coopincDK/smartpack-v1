---
primary_keyword: WMS ERP integration
secondary_keywords: wms erp forbindelse, lager erp integration, economic wms, dynamics 365 lager
cluster: 06-Tech
---

# WMS-ERP integration – når lageret og regnskabet skal tale samme sprog

Mandag morgen kl. 09:15. Modtagelse af 4 paller fra leverandør. Scanner ind i WMS. Kl. 11:00: bogholder ringer. "Hvor er varemodtagelsen? Jeg skal bogføre." WMS og ERP taler ikke sammen. Manuel dobbeltregistrering. 45 minutter spildt. Sker 3 gange/uge. 135 min/uge × 200 kr./time = 27.000 kr./måned = 324.000 kr./år i spildt tid.

## Hvad er WMS-ERP integration?

ERP (Enterprise Resource Planning) håndterer økonomi, indkøb, HR og salg. WMS håndterer lager-operationer. Integration sikrer at de to systemer deler data automatisk:

**Fra WMS til ERP:**
- Varetilgang (modtagelse) → ERP registrerer lagertilvækst og gæld til leverandør
- Pluk/forsendelse → ERP registrerer lagerreduktion og udløser fakturering
- Returmodtagelse → ERP registrerer lagerforøgelse og kreditnota-grundlag

**Fra ERP til WMS:**
- Indkøbsordrer → WMS modtager forventet vareankomst
- Kundeordrer → WMS modtager ordrer til behandling
- Produktdata (nyt produkt, ny pris) → WMS opdateres

## Hvad koster manglende WMS-ERP integration?

| Scenarie | Hyppighed (ved 500 ordrer/dag) | Direkte omkostning | LTV-tab | Total årlig omkostning |
|----------|-------------------------------|-------------------|---------|------------------------|
| Manuel dobbeltstastning | 100% af ordrer | 500 × 3 min × 200 kr./time = 50.000 kr./måned | Fejlrate 1-3%: ~180.000 kr./år | **780.000 kr./år** |
| Forsinket fakturering | 10% af ordrer = 50/dag | Cashflow-tab: ~25.000 kr./måned | Tabt renteindtægt: ~15.000 kr./år | **315.000 kr./år** |
| Varenummer-mismatch | 5% af ordrer = 25/dag | Manuel review: 2.500 kr./dag | Forsinkelse: 5.000 kr./dag | **2.737.500 kr./år** |

**Konklusion:** Varenummer-mismatch er den dyreste fejl. Manuel dobbeltstastning er den hyppigste.

## Hvad sker der uden integration?

**Manuel dobbeltstastning:**
Modtagelse registreres i WMS → medarbejder gentaster i ERP → 1-3% fejlrate i datatransfer.

**Forsinket regnskab:**
Lager-bevægelser registreres i ERP dagen efter eller ugen efter. Realtids-beholdning og P&L er aldrig synkroniserede.

**Manglende fakturering:**
Forsendelse i WMS udløser ikke fakturering i ERP automatisk. Fakturaer glemmes eller forsinkes.

**For 500 ordrer/dag:** Manuel synkronisering = 1-2 timers dagligt dobbeltarbejde = **130.000-260.000 kr./år i lønomkostning**.

## Standard ERP-systemer og WMS-integration

| ERP-system | Integrationsmetode | Kompleksitet |
|-----------|-------------------|--------------|
| e-conomic | REST API | Lav |
| Microsoft Dynamics 365 | API + connector | Medium |
| SAP Business One | API + connector | Medium-høj |
| Navision/BC | API | Medium |
| Uniconta | API | Lav |
| Odoo | Native eller API | Lav (Odoo har WMS-modul) |

## Hvad integrationen kræver teknisk

**Minimumskrav:**
- Varenummer-mapping (samme varenummer i begge systemer)
- Bevægelsesbeskeder (modtagelse, pluk, retur) synkroniseres begge veje
- Fejlhåndtering (failed syncs fanges og alarmerer)

**Best-practice:**
- Real-time synkronisering (ikke batch)
- Bi-direktionel synkronisering
- Audit-trail (hvad blev synkroniseret hvornår, og af hvem)

## Hvornår er integration kritisk?

Integration er kritisk, når:
- Du har over 100 ordrer/dag (manuelt er ikke skalerbart)
- Du har et dedikeret regnskabsteam der arbejder separat fra lager
- Fakturering er afhængig af lager-bevægelser
- Du skal have realtids lager-værdier i regnskabet (balance)

## Typiske fejl

1. **Bruger ét-vejs integration** – Ordrer fra ERP til WMS, men beholdning og forsendelse ikke tilbage til ERP.

2. **Ignorerer varenummer-mismatch** – ERP bruger interne varenumre. WMS bruger EAN. Ingen mapping = ingen integration.

3. **Ingen test i production-lignende miljø** – Integration der virker i test fejler ofte under reel volumen.

## Sådan gør du det rigtigt

1. **Definer data-ejerskab** – Hvem er master for produktdata? ERP (typisk) eller WMS? Definér det klart fra start.

2. **Start med én-vejs og byg ud** – Ordrer fra ERP → WMS som første trin. Derefter beholdnings-synk og forsendelsesbekræftelse.

3. **Kræv forudbygget connector** – Custom ERP-integration er dyrt. Forudbyggede connectors til e-conomic, Dynamics m.fl. er standard for moderne WMS.

## SmartPack understøttelse

SmartPack har forudbyggede integrationer til e-conomic, Uniconta og Microsoft Dynamics 365. Integration opsættes typisk på 2-4 timer og er bi-direktionel: ordrer, beholdning og forsendelsesbekræftelse synkroniseres automatisk. Fejlede synk-forsøg alarmerer automatisk.

## FAQ

**Skal WMS og ERP have samme varenummerstruktur?**
Ikke nødvendigvis – men mapping-tabellen er kritisk. Sæt tid af til at sikre korrekt mapping inden go-live.

**Hvad er bedst: WMS-modul i ERP eller separat WMS?**
ERP-WMS-modul (fx SAP, Dynamics, Odoo): god integration, men typisk lavere lager-funktionalitet. Separat best-of-breed WMS: bedre lager-funktionalitet, kræver integration. SMV under 500 ordrer/dag: separat cloud-WMS er typisk bedst.

**Hvad koster custom ERP-integration?**
50.000-200.000 kr. afhængigt af systemers kompleksitet.

**Kan integration håndtere multi-currency og multi-company?**
Ja, for ERP-systemer der understøtter det (SAP, Dynamics). Kræver specifik konfiguration.

**Hvad er typisk implementeringstid for WMS-ERP integration?**
Med forudbygget connector: 1-3 uger. Custom-integration: 2-6 måneder.
