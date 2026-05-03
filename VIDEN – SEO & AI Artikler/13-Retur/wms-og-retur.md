---
primary_keyword: wms retur automatisering
secondary_keywords: [wms returhaandtering, automatisk kreditering retur, retur wms integration, retur webshop system]
cluster: 13-Retur
article_type: guide
---

# WMS og retur: Sådan automatiserer du kreditering

Hver retur koster dig penge to gange: én gang i håndtering, én gang i kundeservice-tid. De fleste webshops bruger 15-25 minutter per retur på manuel behandling. Det er 250 kr. per retur ved 1.000 kr./time. Sådan eliminerer du størsteparten af det.

## Kort svar

Et WMS med retur-modul scanner varen ind, tildeler den et spor (gensalg / B-stock / kassation), opdaterer lager automatisk og sender krediterings-signal til webshop. Kunden får refusion inden for minutter. Du bruger 2-3 minutter per retur i stedet for 15-25.

---

## Det manuelle forløb vs. det automatiserede

| Trin | Manuel process | Med WMS |
|---|---|---|
| Retur modtages | Lagt i bunke | Scannet ind ved modtagelse |
| Registrering | Manuel i webshop-backend | Automatisk via scan |
| Inspektion | Subjektiv vurdering | Tjekliste i WMS-terminal |
| Kreditering | Kundeservice sender refusion | Automatisk ved „godkendt”-status |
| Genlægning | Manuel til hylde | WMS anviser lokation |
| Tid per retur | 15-25 min | 2-5 min |
| Kost per retur | 62-104 kr. | 8-21 kr. |

**Ved 500 retur/måned:** Manuel = 31.000-52.000 kr./måned. Automatiseret = 4.000-10.500 kr./måned. **Besparelse: 20.500-41.500 kr./måned.**

---

## Sådan fungerer et automatiseret retur-flow

**Trin 1: Kunden registrerer retur online**
Kunden går ind på din webshop, vælger årsag og får en returlabel. RMA-nummer (Return Merchandise Authorization) genereres og linkes til ordren.

**Trin 2: WMS modtager forhands-advisering**
Når kunden registrerer returen, sender webshop automatisk en „forventet retur” til WMS. WMS ved allerede hvilken vare der kommer, fra hvilken ordre og hvad årsagen er.

**Trin 3: Varen ankommer — scanning**
Medarbejder scanner pakken ind. WMS viser: ordre-info, forventet indhold, tjekliste.

**Trin 4: Inspektion via WMS-tjekliste**
Medarbejder besvarer 3-5 spørgsmål: Intakt? Emballage? Mgl. dele? WMS tildeler automatisk spor: Gensalg / B-stock / Kassation.

**Trin 5: Automatisk kreditering**
Ved „Godkendt til gensalg”: krediterings-webhook sendes til Shopify/WooCommerce. Kunden får refusion automatisk. Ingen kundeservice involveret.

**Trin 6: Lager opdateres**
Varen får tildelt lokation. SmartPack opdaterer lagerniveauer i realtid.

---

## Hvad du behøver for at implementere det

1. **Et WMS med retur-modul** — ikke alle WMS'er har det som standard
2. **Returregistrering på din webshop** — kunden skal kunne starte returen online
3. **Webhook-integration** — WMS og webshop skal kommunikere (SmartPack understøtter Shopify og WooCommerce)
4. **Definerede inspektion-kriterier** — hvad udgør „godkendt”, hvad er „B-stock”?

---

## FAQ

**Hvad hvis kunden ikke registrerer returen online?**
Varen ankommer uanmeldt. De fleste WMS'er håndterer dette via manuel RMA-oprettelse ved scanning. Tilbyd dog altid online-registrering — det giver bedre data og hurtigere behandling.

**Kan jeg automatisere retur uden et fuldt WMS?**
Delvist. Returnly og Loop (Shopify-apps) automatiserer kreditering og returportal. Men lager-opdatering og inspektion-flow kræver WMS-integration for fuld effekt.

## Læs også
- [Returlogistik: fra tab til neutral](/viden/retur/returlogistik-fra-tab-til-neutral)
- [Håndtering af beskadigede returvarer](/viden/retur/beskadigede-returvarer)
