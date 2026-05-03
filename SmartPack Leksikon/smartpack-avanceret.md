# SmartPack — Kom godt i gang og Avancerede funktioner

> Kilde: Opbygget fra vores komplette SmartPack-leksikon
> Disse artikler supplerer admin.md og terminal.md

---

## Indholdsfortegnelse

- SmartPack onboarding — opsætningsrækkefølge
- Refill limit og genopfyldningsgrænse
- Lageralerts og underretninger
- CSV-import — produkter
- CSV-import — ordrer
- Webhooks — konfiguration og opsætning

---

## SmartPack Onboarding — Opsætningsrækkefølge

### Hvad er det
En struktureret guide til at komme fra nul til live i SmartPack. Målet: fra accept af aftale til live-drift på én uge ved simple integrationer.

### Fase 1 — Datagrundlag (dag 1–2)

**Produktdata:**
1. Eksportér produktliste fra din webshop/ERP til CSV
2. Sikr at alle SKU'er er unikke, ingen specialtegn (`;` eller `,`)
3. Sørg for at alle varianter har egne SKU'er
4. Tilføj vægt og mål på alle produkter (kræves til fragt)
5. Importer produkter til SmartPack via CSV eller integration

→ Se: CSV-import — produkter
→ Se: Datahygiejne og SKU-navngivning (lagerhåndbog.md)

**Integrationer:**
1. Tilslut din webshop (Shopify, WooCommerce, e-conomic m.fl.)
   → Se: Integrationer (integrationer.md)
2. Test at ordrer importeres korrekt
3. Test at fulfillment-status sendes tilbage til shoppen

### Fase 2 — Lageropsætning (dag 2–3)

**Lagerdesigner:**
1. Admin → Lagerdesigner → Tegn lagerlayout
2. Definér haller, gangveje, reolrækker, placeringer
3. Sæt dimensioner og MaxItems per placering
4. Gem og test med "Test historiske plukkeruter"
   → Se: Lagerdesigner (admin.md)

**Varemodtagelse:**
1. Opret ankomster for dine første leverancer
2. Scan varer ind på korrekte placeringer
3. Verificér at lagertal er korrekte
   → Se: Ankomst — Behandl (terminal.md)

### Fase 3 — Hardware og printere (dag 3–4)

**Terminaler:**
1. Opsæt Newland MT9084 (Prefix=7B, Suffix=7D, Output=Simulate keystroke)
2. Installer SmartPack som web-app på terminalen
3. Test scanning på en placering og en vare
   → Se: Newland MT9084 — Opsætning (terminal.md)

**Printservice og printere:**
1. Download Printservice på Windows-PC
2. Tilslut fragtlabelprinter (Zebra) og etiketprinter (Dymo/Brother)
3. Konfigurér Share og test print
   → Se: Printservice — Opsætning (terminal.md)

### Fase 4 — Medarbejdere og profiler (dag 4–5)

**Medarbejdere:**
1. Admin → Medarbejdere → Opret alle brugere
2. Print QR-koder til hurtig login
3. Tildel roller (Terminal / Admin / Begge)
   → Se: Opret medarbejder (admin.md)

**Leveringsmetoder:**
1. Admin → Leveringsmetoder → Tilføj fragtintegration
2. Konfigurér API-nøgler fra fragtselskabet
3. Test label-generering
   → Se: Leveringsmetoder (admin.md)

**Plukkeprofiler:**
1. Opret minimum én profil (typisk Multipluks Ordre)
2. Juster maks. ordrer, brug af totes, algoritme
3. Test med en lille batch ordrer
   → Se: Introduktion til plukkeprofiler (admin.md)

### Fase 5 — Live-test (dag 5–7)

**Pilottest:**
1. Kør 10–20 ordrer igennem det fulde flow
2. Test pluk → pak → label → forsendelse
3. Test retur-flow
4. Verificér at fulfillment-status opdateres i webshop

**Fejlsøgning:**
- Fragtlabel printer ikke → Se: Labelprint — Fejl (terminal.md)
- Vare ikke fundet ved scanning → Se: Fejlkode 301 (fejlkoder.md)
- Plukliste genereres ikke → Se: Fejlkode 1300 (fejlkoder.md)

### Opsætnings-tjekliste

| ✅ | Opgave |
|----|--------|
| ☐ | Produktdata importeret med korrekte SKU'er |
| ☐ | Webshop-integration tilsluttet og testet |
| ☐ | Lagerdesigner tegnet og gemt |
| ☐ | Varer modtaget og placeret på hylder |
| ☐ | Printservice konfigureret på Windows-PC |
| ☐ | Fragtlabelprinter testet |
| ☐ | Terminaler opsatte og testet |
| ☐ | Medarbejdere oprettet med QR-koder |
| ☐ | Leveringsmetoder konfigureret |
| ☐ | Mindst én plukkeprofil oprettet |
| ☐ | Test-ordre kørt komplet igennem |
| ☐ | Fulfillment-status verificeret i webshop |

### Support ved onboarding
- **Telefon:** +45 88 20 20 19 · Tast 2
- **Email:** support@smartpack.dk
- **Chat (Sofia AI):** Tilgængelig 24/7 i Admin

---

## Refill Limit og Genopfyldningsgrænse

### Hvad er det
SmartPacks indbyggede system til at definere minimum- og maksimumsbeholdning per produkt. Når lageret falder under minimumsniveauet, markeres varen som kræver genopfyldning.

### Sti
Admin → Produkter → Rediger produkt → fanen **Genopfyldning**

### Alle felter

| Felt | Beskrivelse | Type | Eksempel |
|------|-------------|------|---------|
| **Refill limit** | Minimumsgrænse — udløser genopfyldningsstatus | Tal | `10` |
| **Max refill** | Maksimal beholdning ved genopfyldning | Tal | `50` |
| **Max forskellige placeringer** | Max antal lagerpladser for denne vare | Tal | `2` |

### Systemlogik

```
Fri lagerbeholdning ≤ Refill limit → Varen vises i genopfyldningslisten
Genopfyldning sker → Flyt varer op til Max refill
```

### Refill limit — beregning

Brug denne formel:
```
Refill limit = Dagligt salg × Leveringstid (dage) × Buffer-faktor
```

**Eksempel:**
- Dagligt salg: 15 stk.
- Leveringstid fra leverandør: 5 dage
- Buffer-faktor: 1,5 (50% ekstra)
- **Refill limit = 15 × 5 × 1,5 = 112 stk.**

### Hvad sker der når grænsen nås

| Sted | Visning |
|------|---------|
| **Indkøbsforslag** (Admin) | Varen vises som "lav beholdning" |
| **Flyt Lager** (Terminal) | Vises i genopfyldningslisten |
| **Lageralert** (hvis konfigureret) | Email-notifikation sendes |
| **Dashboard** | Tile "Lager alerts" tæller op |

### Forskel fra rød streg (manuel metode)
Refill limit i SmartPack er den **digitale version** af den røde streg på reolen. Det digitale system giver:
- Automatisk overvågning af alle SKU'er simultant
- Integration med indkøbsforslag og forecasting
- Sporbar historik

→ Se: Lagerstyring uden system — Min/max (lagerhåndbog.md) for manuel metode
→ Se: Forecasting og ABC-analyse (admin.md)

### Best practice

| Regel | Forklaring |
|-------|-----------|
| Sæt refill limit på alle A-varer | B- og C-varer kan sættes løbende |
| Brug ABC-analysen til at bestemme niveauet | A-varer: højere buffer |
| Opdatér efter sæsonændringer | Julekollektionen har andre niveauer i december end juli |
| Max refill = hvad der realistisk kan stå på hyldepladsen | Begræns til pladsens kapacitet |

### Relaterede emner
→ Se: Flyt Lager — Genopfyldningsliste fra totes (terminal.md)
→ Se: Foretrukken placering (admin.md)
→ Se: Indkøbsordrer (admin.md)

---

## Lageralerts og Underretninger

### Hvad er det
SmartPack har to typer notifikationer der advarer om lager-situationer: **Produktunderretninger** (vises på terminalen) og **Lageralerts** (vises i dashboardet og kan konfigureres til email).

---

### Type 1 — Produktunderretninger til plukker/pakker

**Hvad:** En kort tekst der vises på terminalen til den person der plukker eller pakker en specifik vare.

**Sti:** Admin → Produkter → Rediger produkt

**De to felter:**

| Felt | Vist til | Eksempel |
|------|---------|---------|
| **Underretning til plukker** | Vises under pluk på terminalen | "OBS: Tjek at det er størrelse M — ikke L" |
| **Underretning til pakker** | Vises under pakning på terminalen | "Husk: Ledsages altid af brugsanvisning" |

**Hvornår brugt:**
- Varer der let forveksles
- Varer der kræver særlig håndtering
- Skrøbelige varer
- Varer med specielle emballagekrav
- Sæsonvarer med midlertidige notes

---

### Type 2 — Lageralerts (Refill limit)

**Hvad:** Dashboard-tile der viser antal varer under deres definerede refill limit.

**Sti:** Admin → Dashboard → Tile **"Lager alerts"**

Tilen viser realtids-antal af varer der er under minimumsniveauet.

---

### Type 3 — Løbende optælling (automatisk revision)

**Hvad:** Popup på terminalen under aktiv plukning der beder medarbejderen tælle et specifikt produkts beholdning.

**Konfigureres:** Admin → Lager/Status → Revisionszoner

**Udløsningsregel:** Når lagerbeholdning falder til eller under det definerede antal, vises popuppen næste gang en medarbejder er ved placeringen.

→ Se: Løbende optælling (terminal.md)
→ Se: Revisionszoner og løbende optælling (admin.md)

---

### Manuelle lageradvarsler på ordrer

Ordrer der ikke kan plukkes fuldt markeres automatisk med status **"Missing Items"**. Vises i ordrelisten og kan filtreres.

→ Se: Ordreliste — statusser (admin.md)
→ Se: Presell (admin.md) — sælg varer der endnu ikke er på lager

---

## CSV-Import — Produkter

### Hvad er det
Import af produktdata til SmartPack via CSV-fil — bruges ved opstart, masseopdatering og migration fra andet system.

### Sti
Admin → Produkter → **Importér CSV**

### Forberedelse af CSV-filen

**Kritiske krav:**
- Filformat: `.csv` med korrekt separator
- Encoding: UTF-8 (med eller uden BOM)
- Separator: afhænger af `CultureInfo`-indstilling — `da-DK` = semikolon, `en-US` = komma

→ Se: CSV-separator (admin.md)

### Minimum-felter i produktimport CSV

| Felt | Kolonnenavn | Påkrævet | Eksempel |
|------|-------------|---------|---------|
| **SKU** | `Sku` | ✅ | `TSHIRT-BLÅ-M` |
| **Produktnavn** | `Name` | ✅ | `T-shirt blå størrelse M` |
| **Stregkode (EAN)** | `Barcode` | Anbefalet | `5701234567890` |
| **Vægt** | `Weight` | Anbefalet | `250` (gram) |
| **Bredde** | `Width` | Valgfrit | `30` (mm) |
| **Højde** | `Height` | Valgfrit | `20` (mm) |
| **Dybde** | `Depth` | Valgfrit | `10` (mm) |

### Avancerede felter

| Felt | Kolonnenavn | Eksempel |
|------|-------------|---------|
| Eksternt ID | `ExternalId` | ID fra webshop |
| Tarifkode | `TariffCode` | `6109100000` |
| Kostpris | `CostPrice` | `45.50` |
| Leverandørnummer | `SupplierItemNumber` | `SUP-001` |
| Producent | `Manufacturer` | `Nike` |
| Produkttype | `ProductType` | `Normal` / `Bundle` / `Virtual` |
| Farliggods | `IsDangerous` | `true` / `false` |
| UN-nummer | `UnNumber` | `1950` |
| Brug batch nr | `UseBatchNumber` | `true` / `false` |

### Processen trin-for-trin

1. Admin → Produkter → **Download skabelon** (hent eksempel-CSV)
2. Åbn i Excel — **åbn via Data → Fra tekst/CSV** og vælg korrekt separator
3. Udfyld dine produktdata
4. Gem som CSV med UTF-8 encoding
5. Admin → Produkter → Importér CSV → vælg fil
6. SmartPack viser en preview af importerede rækker
7. Verificér at felterne er mappet korrekt
8. Bekræft import
9. Tjek eventuelle fejlrækker i import-rapporten

### Typiske fejl ved CSV-import

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Alt i én kolonne | Forkert separator | Skift CultureInfo eller åbn med korrekt separator |
| Fejlkode 301 efter import | SKU allerede brugt | Kontrollér for duplikater — SKU skal være unikt |
| Æ, Ø, Å vises forkert | Forkert encoding | Gem filen som UTF-8 i Excel |
| Tomme felter i import | Blanke rækker i CSV | Fjern blanke rækker sidst i filen |
| Tal formateret forkert | Excel har ændret decimaler | Formatér talkolonner som tekst inden udfyldning |

### Masseopdatering
CSV-import opdaterer eksisterende produkter hvis SKU matcher. Bruges til at opdatere mål, vægt, tarifkoder eller stregkoder for mange produkter på én gang.

### Warehouse Weight via CSV
Feltet `WarehouseWeight` kan importeres via CSV til masseopsætning.
→ Se: Warehouse Weight (admin.md)

---

## CSV-Import — Ordrer

### Hvad er det
Import af ordrer til SmartPack via CSV — bruges ved manuelle ordrer fra ikke-integrerede systemer, B2B-kunder eller engangsforsendelser.

### Sti
Admin → Kunder → Ordrer → **Importér CSV** (eller via API)

### Minimum-felter i ordreimport CSV

| Felt | Påkrævet | Eksempel |
|------|---------|---------|
| **Ordrenummer** | ✅ | `ORD-2025-001` |
| **Kundenavn** | ✅ | `Jens Hansen` |
| **Adresse linje 1** | ✅ | `Strandvejen 10` |
| **By** | ✅ | `København` |
| **Postnummer** | ✅ | `2100` |
| **Land (Alpha-2)** | ✅ | `DK` |
| **SKU** | ✅ | `TSHIRT-BLÅ-M` |
| **Antal** | ✅ | `2` |
| **Leveringsmetode (method key)** | ✅ | `gls_private_droppoint` |
| **Email** | Anbefalet | `jens@mail.dk` |
| **Telefon** | Anbefalet | `+4512345678` |

### Alternativ: Opret manuel ordre
Til enkeltordrer er manuel oprettelse i Admin hurtigere end CSV-import.
→ Se: Opret manuel ordre (admin.md)

### Alternativ: API
Til automatiseret ordre-input fra systemer uden native integration.
→ Se: API-adgang (admin.md)

---

## Webhooks — Konfiguration og Opsætning

### Hvad er det
Webhooks er automatiske HTTP-notifikationer SmartPack sender til dit system ved specifikke hændelser. Bruges til at holde eksterne systemer (ERP, kundeservice, regnskab) synkroniseret med SmartPack i realtid.

### Hvornår bruges webhooks
- Dit ERP skal opdateres når en ordre afsendes
- Dit kundeservicesystem skal vide når et retur modtages
- Dit rapporteringssystem skal have data løbende
- Du har et brugerdefineret system der skal integreres

### Sti — 3PL kunder (webhook per kunde)
Admin → Kunder → vælg kunde → **Webhooks**

### Felter

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| **Webhook URL** | Din servers URL der modtager data | `https://dit-system.dk/webhook/smartpack` |
| **HMAC Secret** | Hemmelig nøgle til signaturverifikation | `sk_live_abc123...` |
| **Aktiv** | Er webhook'et aktivt | ✅ |
| **Events** | Hvilke hændelser der udløser webhook | Forsendelse, ankomst, retur... |

### Sikkerhed — HMAC-signatur
SmartPack signerer alle webhook-payloads med en HMAC-SHA256-signatur baseret på dit secret.

**Verificering på din server:**
```python
import hmac, hashlib

computed = hmac.new(
    secret.encode('utf-8'),
    payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()

if computed == received_signature:
    # Autentisk fra SmartPack
```

### Webhook events (typiske)

| Event | Hvornår udløst |
|-------|---------------|
| `order.shipped` | Ordre pakket og label genereret |
| `order.cancelled` | Ordre annulleret |
| `stock.updated` | Lageropgørelse ændret beholdning |
| `return.received` | Returvare modtaget på lageret |
| `purchase_order.received` | Indkøbsordre modtaget og afsluttet |

### Payload-format
SmartPack sender JSON-payload med `Content-Type: application/json`.

**Eksempel — ordre afsendt:**
```json
{
  "event": "order.shipped",
  "orderId": "ORD-2025-001",
  "externalOrderId": "SHOP-12345",
  "shippedAt": "2025-05-01T14:30:00Z",
  "tracking": {
    "carrier": "GLS",
    "trackingNumber": "1Z999AA10123456784",
    "trackingUrl": "https://gls-group.com/track/..."
  },
  "packages": [
    {
      "weight": 1250,
      "dimensions": { "width": 30, "height": 20, "depth": 15 }
    }
  ]
}
```

### Test og fejlfinding

| Trin | Handling |
|------|---------|
| **Test endpoint** | Brug RequestBin (requestbin.com) eller webhook.site til at modtage test-payloads |
| **Verificér levering** | Tjek Admin → Kunder → Webhooks → Loghistorik |
| **HTTPS kræves** | SmartPack sender kun til HTTPS-endpoints |
| **Svartid** | Dit endpoint skal svare med HTTP 200 inden for 30 sekunder |
| **Retry** | SmartPack forsøger at sende igen ved fejl (typisk 3 forsøg) |

### Alternativ til Webhooks — Pull via API
Har du ikke mulighed for at modtage webhooks (push), kan du bruge SmartPacks REST API til at hente data periodisk (pull).
→ Se: API-adgang (admin.md)

### Relaterede emner
→ Se: API-adgang (admin.md)
→ Se: Kundeoversigt — Webhooks-felt (admin.md)
→ Se: Integrationer (integrationer.md)

---

*SmartPack — Kom godt i gang og Avancerede funktioner · Supplement til admin.md*
