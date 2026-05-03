---
primary_keyword: edi integration leverandor
secondary_keywords: [edi lager, electronic data interchange, asn edi, ordrebekraeftelse edi, edi webshop]
cluster: 06-Tech
article_type: guide
---

# EDI-integrationer med leverandører (ASN og ordrebekæftelse)

Din største leverandør sender dig en faktura på email. Du taster den manuelt ind i dit system. Det tager 20 minutter. Leverandøren gør det 50 gange om dagen med alle sine kunder. Alle taster det manuelt ind. Det er den analoge verden EDI erstatter.

## Kort svar

EDI (Electronic Data Interchange) er automatiseret udveksling af forretningsdokumenter mellem systemer: ordrer, ordrebekæftelser, faktura og ASN (Advanced Shipment Notice). Det erstatter manuelt dataindtastning og reducerer fejl med 60-80%.

---

## De tre vigtigste EDI-dokumenter for et webshop-lager

### 1. Purchase Order (PO) / EDI 850
Din ordre til leverandøren sendes automatisk fra dit WMS når reorder point rammes. Ingen emails, ingen manuell ordre-tastning.

**Gevinst:** Ordretid reduceres fra 20-30 min til under 1 min. Fejlrate tæt på 0%.

### 2. ASN (Advanced Shipment Notice) / EDI 856
Leverandøren sender en elektronisk „pakkeliste” før varen ankommer: hvilke varer, hvilke mængder, hvilke pallenumre, forventet levering.

**Gevinst:** Dit WMS ved hvad der ankommer før det ankømmmer. Modtagelse går fra 45-60 min til 10-15 min (scanning mod ASN i stedet for manuel optelling).

### 3. Invoice (INVOIC) / EDI 810
Faktura sendes elektronisk og matches automatisk mod PO og ASN. Tre-vejs match: PO × ASN × Invoice. Afvigelser flagges automatisk.

**Gevinst:** Faktura-godkendelse går fra 20-30 min til under 2 min. Eliminerer fejl ved manuel tastning.

---

## Er EDI relevant for dig?

| Situation | EDI relevant? |
|---|---|
| Under 5 leverandører, manuelle processer | Måske — vent |
| 5-20 leverandører, høj ordre-frekvens | Ja, prioriter PO og ASN |
| Over 20 leverandører | Ja — nødvendigt |
| Leverandør kræver EDI (Amazon, Zalando) | Ja — obligatorisk |

**Skalerings-signal:** Når du bruger mere end 3 timer om ugen på manuel ordre- og faktura-håndtering, er EDI-ROI positiv.

---

## Implementation: Hvad det kræver

**1. Leverandøren skal understøtte EDI**
De største leverandører (Nete, NNE, større importorer) har EDI. Små lokale leverandører: typisk ikke. Brug API-integration eller webforms i stedet.

**2. Dit WMS skal understøtte EDI**
SmartPack understøtter EDI-integration via Tradegate og Descartes. Check med din WMS-leverandør om understottede formater (EDIFACT, X12, XML).

**3. En middleware-platform (valgfrit)**
EDI-platforme som Crossfire, Edifix eller Corevist forstår mange EDI-standarder og oversaetter mellem systemer. Kost: 1.500-5.000 kr./måned afhængig af volumen.

---

## FAQ

**Er EDI kun for store virksomheder?**
Historisk: ja. I dag: nej. Cloud-baserede EDI-platforme har gjort det tilgængelig fra 500-1.500 kr./måned. Break-even typisk ved 3-5 leverandører med høj ordrefrekvens.

**Hvad er forskellen på EDI og API?**
API er realtids to-vejs kommunikation (som Shopify-webhooks). EDI er batch-baseret asynkron udveksling (som email men automatisk). Til lagerstyring: API til webshop, EDI til leverandører er den typiske opdeling.

## Læs også
- [Integrationer forklaret](/viden/tech/integrationer-forklaret)
- [WMS og ERP integration](/viden/tech/wms-erp-integration)
- [Dataflow i e-commerce](/viden/tech/dataflow-i-ecommerce)
