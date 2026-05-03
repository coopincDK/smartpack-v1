# SmartPack Integrationer — Komplet Leksikon

> **Version:** SmartPack v1.34.0.0

---

## Indholdsfortegnelse
- Generelle principper for fragtintegrationer
- Business Central (BC)
- Shopify
- Visma e-conomic
- GLS
- PostNord
- Bring
- BFT Logistik
- DanDomain
- Herodesk
- WooCommerce
- API — generelt

---

## Generelle principper for fragtintegrationer

### Hvad er det
SmartPack videresender ordredata til fragtintegrationerne. SmartPack kender ikke den enkelte kundes fragtaftale, addons eller serviceaftaler.

### Hvornår kontaktes fragtselskabet direkte
- Spørgsmål om specifikke leveringsmetoder og hvad kundens aftale dækker
- Fejlkoder der kommer direkte fra fragtselskabets API
- Afklaringer om addons og services

→ Når afklaret med fragtselskabet: SmartPack kan hjælpe med opsætning.

### UPS — særlig note
UPS har mange leveringsmetoder og addons. Fejlkoder fra UPS (fx `Missing or invalid Shipper AttentionName`, kode 120110) opstår typisk i kommunikationen mellem fragtintegrationen og UPS — ikke nødvendigvis i SmartPack. Kunden skal kontakte UPS direkte (eller Webshipper/Shipmondo).

---

## Business Central (BC)

### Hvad er det
Integration der synkroniserer ordrer og produkter to-vejs mellem Microsoft Business Central og SmartPack.

### Hvad synkroniseres

| Retning | Data |
|---------|------|
| BC → SmartPack | Ordrer til pluk og pak |
| BC → SmartPack | Produkter/varer |
| SmartPack → BC | Fulfillment-status |

### Krav til opsætning

| Krav | Detalje |
|------|---------|
| **SmartPack-udvidelse** | Installeres i BC via `.app`-fil (Udvidelsesstyring) |
| **Microsoft Entra-applikation** | Kræver `API.ReadWrite.All`-tilladelse til Dynamics 365 BC |
| **SmartPack PermissionSet** | "SmartPack - Main" + "D365 - Basic" + "Giv samtykke" |

### ⚠️ Client secret udløber efter 2 år

Client secret i Microsoft Entra udløber automatisk.
**Sæt en kalenderreminder** ved opsætning — udløbet secret er den hyppigste årsag til at BC-integrationen holder op.

**Forny:** Microsoft Entra → din applikation → Certifikater og hemmeligheder → tilføj ny secret → opdatér i SmartPack.

### Kendte fejltyper

| Fejl | Årsag | Løsning |
|------|-------|---------|
| **OrderLineAlreadyExists** | Bundle-underlinjer allerede markeret som fuldført i BC | Undersøg bundle-opsætning |
| **Duplikerede SKU'er** | External ID-mapping forkert | Fjern external ID → kør fuld sync |
| **Webhook queue problemer** | Queue blokerer fuld sync | Undersøg queue-status i Job Monitor |
| **Integration virker ikke** | Udløbet client secret | Forny secret i Microsoft Entra |

### Job Monitor — normal adfærd
Job Monitor kører konstant — **dette er normalt og forventet.** Webhooks fra BC sender løbende hændelser til SmartPack.

| Adfærd | Forklaring |
|--------|-----------|
| Job Monitor altid aktiv | Webhooks kører løbende — **ikke en fejl** |
| Enkelt fejl i loggen | Automatisk retry — én fejl er ikke vedvarende problem |

---

## Shopify

### Hvad synkroniseres

| Retning | Data |
|---------|------|
| Shopify → SmartPack | Ordrer |
| Begge veje | Produkter |
| SmartPack → Shopify | Fulfillment og tracking |
| SmartPack → Shopify | Retur og kreditering (kræver Shopify-integration) |

### ⚠️ KRITISK: Manuel ordre i Shopify — Custom shipping

Når du opretter en **manuel ordre i Shopify** og vælger **"Custom shipping"** (fritekst, fx "Gratis levering"), tildeler SmartPack automatisk method key `shopify_custom_dk` — som **standard er mappet til Pickup**.

| Valg i Shopify | Resultat i SmartPack |
|---------------|---------------------|
| "Shipping rates" → vælg fra liste | ✅ Korrekt leveringsmetode |
| "Custom shipping" (fritekst) | ❌ `shopify_custom_dk` → **Pickup** |

**Løsning:** Vælg altid **"Shipping rates"** ved manuelle Shopify-ordrer.

### Kendte fejltyper

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Forkerte varenumre / manglende telefon | Mangelfuld data | Ret på ordren |
| Massefejl efter produktændring | Bundle ændret i Shopify | Konsultér SmartPack support inden større bundle-ændringer |
| Produkter med status "pending" | Manglende produktdata | Udfyld alle produktfelter |
| Variant ikke valgbar i returportal | External ID-mismatch | Slet External ID → genstart → Full Sync |

### Shopify Presell — metafields
Leveringsdatoer fra indkøbsordrer kan sendes til Shopify:
`smartpack.next_po_deliverydate_{location}`

---

## Visma e-conomic

### Hvad synkroniseres

| Retning | Data |
|---------|------|
| e-conomic → SmartPack | Salgsordrer (anbefalet status: "sendt") |
| e-conomic → SmartPack | Produktkatalog (SKU, navn, stregkoder, priser) |
| SmartPack → e-conomic | Fakturakladde når ordre pakkes |
| SmartPack → e-conomic | Lagerværdi (dagligt / ugentligt / månedligt / kvartalsvis / halvårligt / årligt) |

### Krav

| Krav | Detalje |
|------|---------|
| **Grant Token** | Genereres via e-conomic autorisationsside |
| **Webhooks** | Anbefales for realtidsopdateringer |

### Normal adfærd
- Ordrer hentes hvert **5. minut**
- Produkter opdateres via webhooks ved ændringer
- Lagerværdi synkroniseres efter konfigureret frekvens

### Kendte fejltyper

| Problem | Tjek |
|---------|------|
| Ordrer importeres ikke | Grant Token gyldig? Status = "sendt"? |
| Fakturakladde oprettes ikke | "Opret fakturakladde" aktiveret? Ordre pakket? |
| Lagerværdi fejler | Kladdenummer + konto-IDs korrekte? (standard: debet 5520, kredit 1355) |

---

## GLS

### Krav

| Data | Fra GLS (YourGLS) |
|------|------------------|
| **Username** | YourGLS login |
| **Password** | YourGLS password |
| **ContactId** | YourGLS → Administration → Afsenderadministration |
| **CustomerId** | YourGLS → Administration → Afsenderadministration |

### Leveringsmetoder

| Metode | Beskrivelse | Max vægt | Method Key |
|--------|-------------|----------|-----------|
| GLS Erhvervslevering | Erhvervsadresse | 30 kg | `gls_business_delivery` |
| GLS Hjemmelevering | Privat (kræver email + mobil) | 30 kg | `gls_private_delivery` |
| GLS FlexDelivery | Privat m. fleksibel aflevering | 30 kg | `gls_flex_delivery` |
| GLS Forced Deposit | Pakken stilles altid | 30 kg | `gls_private_delivery_deposit` |
| GLS Pakkeshop | Levering til pakkeshop (kræver email + mobil) | 20 kg | `gls_private_droppoint` |
| GLS ShopReturn | Returlabel til pakkeshop | 20 kg | `gls_shop_return` |
| GLS ShopReturn QR | Returlabel som QR til email | 20 kg | `gls_shop_return_qr` |
| GLS Return Pickup | Afhentning til retur | 30 kg | `gls_return_pickup` |

### DepositService

| Indstilling | Adfærd |
|-------------|--------|
| `auto` (standard) | Aktiveres kun hvis leveringsinstruktioner på ordren |
| `always` | Pakken stilles altid |
| `never` | Bruges aldrig — sæt under Parameters + flueben i "Include" |

### Tilvalg (addons)
- `email_notification` (standard aktiveret)
- `express10`
- `express12`
- `add_on_liability_service` (forsikring)

### GLS fejlbeskeder

| Fejl | Årsag | Løsning |
|------|-------|---------|
| `Flexdelivery not possible` | Metoden understøttes ikke til landet | Vælg anden leveringsmetode |
| `Directshop not allowed` | Pakkeshop ikke tilladt til landet | Brug erhvervs- eller hjemmelevering |
| Booking fejler | Manglende email eller mobil | Tilføj email + mobilnummer på ordren |

### Testmode
Tilgængeligt med V2 API — forsendelser bookes mod GLS testmiljø.

---

## PostNord

### Krav

| Data | Detalje |
|------|---------|
| **MISKOS-nummer** | 9-cifret (også kaldet GTT-nummer eller produktionskundenummer) |

### Installation
Apps/Integrationer → Browse App Library → PostNord

Leveringsmetoder tilføjes under Delivery Methods-fanen.

### Nyere versioner
Forbedret validering ved manglende toldoplysninger.

---

## Bring

### Telefonnummer-krav

**Kritisk:** Telefonnummer skal starte med `+47` og det første ciffer efter `+47` skal være **9 eller 4** (mobilnummer).

| Nummer | Gyldigt |
|--------|---------|
| `+4798765432` | ✅ Gyldigt (starter med 9) |
| `+4748765432` | ✅ Gyldigt (starter med 4) |
| `+4712345678` | ❌ Ugyldigt (starter med 1) |

---

## BFT Logistik

### Hvad er det
Fragtintegration primært til møbel- og storgodslevering med tidsbestemt levering.

### Krav

| Data | Detalje |
|------|---------|
| **Brugerkode** | Fra BFT |
| **Hemmelig kode** | Fra BFT |

### Delivery Service koder

| Kode | Beskrivelse |
|------|-------------|
| `7` | Standard (08–21) |
| `6` | Dag (08–16) |
| `1` | Aften (17–21) |
| `4` | Tidsbestemt (4-timers interval) |

### Tillægsservice

- Opbæring
- Indbæring
- Udpakning
- Bortskaffelse

---

## DanDomain

### Hvad er det
Integration der automatisk bogfører og sender faktura i DanDomain når en ordre pakkes i SmartPack.

### ⚠️ KRITISK: Fakturamail sendes kun én gang

**Fakturamailen til kunden kan kun sendes én gang.** Verificér kundens email-adresse inden afsendelse.

### Aktivering
DanDomain-appen → Settings → sæt flueben i:
- **Create invoice**
- **Send invoice to mail**

---

## Herodesk

### Hvad er det
Integration med Herodesk kundeserviceplatform.

### Installation
Browse App Library → Herodesk → Configure App → Approve

### Krav

| Felt | Detalje |
|------|---------|
| **Organization identifier** | Det der står **inden `.app`** i din Herodesk-URL |

**Eksempel:** Herodesk URL er `minvirksomhed.app.herodesk.io` → Organization identifier = `minvirksomhed`

---

## WooCommerce

### Krav

| Data | Fra WooCommerce |
|------|----------------|
| **Consumer Key** | WooCommerce → Indstillinger → Avanceret → REST API |
| **Consumer Secret** | Samme sted |
| **Store URL** | Din WooCommerce-butiksadresse |

### Rettigheder
API-nøglen skal have **Læse/Skrive** rettigheder.

→ Se: WooCommerce integration (Admin.md — Systemindstillinger)

---

## API — Generelt

### Krav
- **AppId** og **AccessToken**
- Opret: Admin → Indstillinger → Apps → **Tilføj private app**

### Dokumentation og Changelog
https://demo.smartpack.dk/

### Integrationer — oversigt
https://smartpack.dk/integrationer/

---

*SmartPack Integrationer Leksikon · v1.34.0.0*
