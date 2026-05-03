---
primary_keyword: pim vs wms
secondary_keywords: [pim system lager, wms masterdata, produktinformation system, pim wms forskel]
cluster: 06-Tech
article_type: forklaring
---

# PIM vs. WMS: Hvor bor dine masterdata?

Du opdaterer produktvægt i Shopify fra 450g til 380g (ny emballage). 3 måneder senere opdager du at fragtomkostningerne er 4.200 kr. højere end forventet. Dit WMS brugte stadig 450g. Fragtsystemet beregnede volumenvægt forkert i 2.400 forsendelser. 1,75 kr. for meget per pakke. Det er ikke en teknisk fejl. Det er mangel på klarhed om hvem der ejer data.

## Kort svar

PIM (Product Information Management) ejer produktdata der er marketingfokuseret: navn, beskrivelse, billeder, kategorier, SEO-metadata. WMS ejer operationelle data: lagerniveau, lokation, plukdata, bevaegelsehistorik. De er ikke konkurrenter. De er komplementaere. Problemet opstår når ingen har besluttet hvem der ejer hvad.

---

## Hvad PIM ejer

- Produktnavn og titel (til webshop og markedspladser)
- Beskrivelse og features
- Billeder og medier
- Kategori og attributter (strørrelse, farve, materiale)
- SEO-metadata
- Tekniske specifikationer
- Leverandør-relationer og indkøbs-informationer

**PIM syndikerer til:** Webshop, markedspladser (Amazon, Zalando), trykte kataloger, ERP.

## Hvad WMS ejer

- Lagerniveau per lokation
- Bevaegelsehistorik (ind, ud, retur)
- Plukdata og pick-confirmations
- Reorder points og min/max-niveauer
- Batch/lot-numre og udløbsdatoer
- Lokationskoder og zonestatus

**WMS syndikerer til:** Webshop (lagerniveau), fragtplatform (forsendelsesdata), ERP (regnskab).

---

## Hvad de deler (og hvad der går galt)

EAN/stregkode, vægt og dimensioner skal være ens i begge systemer. Hvis din PIM siger 450 gram og dit WMS siger 380 gram, er din fragtpris forkert og din volumenvægt-beregning er forkert.

**Konkret case:** 2.400 forsendelser over 3 måneder med forkert vægt i WMS. Volumenvægt-beregning forkert = 1,75 kr. for meget per pakke = **4.200 kr. tab**. Opdaget først når nogen manuelt sammenlignede fakturaer.

**Løsning:** Ét system ejer produktmasterdata (typisk PIM eller ERP). WMS modtager ændringer via API inden for 24 timer. Manuel dobbelt-vedligeholdelse er ikke en løsning — det fejler altid.

---

## Har du brug for et PIM?

| Situation | PIM nødvendig? |
|---|---|
| Under 200 SKU'er, én kanal | Nej — Shopify er nok |
| 200-1.000 SKU'er, 2-3 kanaler | Overvejer det |
| Over 1.000 SKU'er | Ja |
| Kompleks attributstruktur (mode, elektronik) | Ja |
| Eksport til markedspladser (Zalando, Amazon) | Ja |

De fleste webshops under 1.000 SKU'er har ikke brug for et dedikeret PIM. Shopify + en velstruktureret metafield-opsætning er tilstrækkelig.

---

## FAQ

**Hvad koster et PIM?**
- Shopify metafields: 0 kr. (inkluderet)
- Plytix (SMV-PIM): fra 1.200 kr./måned
- Akeneo: fra 15.000 kr./måned

Under 500 SKU'er: brug Shopify. Over 1.000 SKU'er + markedspladser: invester i dedikeret PIM.

**Kan mit WMS fungere som PIM?**
Kun hvis det har produktbeskrivelses-felter, billeder og SEO-funktioner. Det har de fleste WMS'er ikke — det er ikke deres primære formål.

**Hvad er forskellen på PIM og ERP?**
ERP ejer finansielle transaktioner, indkøbsordrer og debitorer. PIM ejer produktinformation. WMS ejer fysisk lager. Alle tre er separate concerns — men må kommunikere via API.

## Læs også
- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Integrationer forklaret](/viden/tech/integrationer-forklaret)
- [Dataflow i e-commerce](/viden/tech/dataflow-i-ecommerce)
