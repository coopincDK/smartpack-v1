---
primary_keyword: mangler overblik lager
secondary_keywords: [lager dashboard, realtidsdata lager, lager KPI, lagerstyring overblik]
cluster: 02-Problemer
---

# Vi mangler overblik over lageret – når du ikke ved hvad der sker

Kl. 10:00: Kunde bestiller SKU TS-BLÅ-M. Webshop viser "på lager".

Kl. 10:15: Plukker opdager: Varen er udsolgt. Sidste enhed blev plukket kl. 09:45. Systemet opdaterede ikke.

Kl. 10:30: Kundeservice ringer til kunde. "Beklager, udsolgt. Refunderer."

Kunde: "Men det stod på lager!" Skriver 1-stjernet anmeldelse.

**Cost:**
- Tabt ordre: 680 kr.
- Kundeservice-tid: 15 min × 250 kr./time = 62 kr.
- Negativ anmeldelse: 3 tabte konverteringer × 680 kr. = 2.040 kr.
- **Total: 2.782 kr.**

Ved 8 oversalg/måned = 267.000 kr./år.

Dette er prisen for forsinket data.

## Hvad mener vi med "mangler overblik"?

Mangler overblik betyder:
- Du ved ikke hvor mange ordrer der venter
- Du ved ikke om I er foran eller bagud
- Lagerbeholdning opdateres med forsinkelse
- Ingen dashboard med KPI'er
- Du spørger plukkere: "Hvordan går det?"

Resultat: Du styrer blindt.

## Implementer realtidsdata: Uge 1

### Dag 1-2: Webhook-integration
**Uden WMS:**
1. Shopify → Zapier → Google Sheets (opdaterer hvert 5. minut)
2. Cost: 0 kr. (Zapier free tier)
3. Resultat: Forsinkelse reduceret fra 2 timer til 5 minutter

**Med WMS:**
1. Shopify → SmartPack API (opdaterer realtid)
2. Cost: Inkluderet i SmartPack
3. Resultat: 0 forsinkelse

### Dag 3-5: Test
- Bestil testordre
- Tjek hvor hurtigt beholdning opdateres
- Juster hvis nødvendigt

**Resultat:** Oversalg elimineret. 267.000 kr./år spart.

## Hvornår er det et problem?

Manglende overblik er et problem når:
- Oversalg sker mere end 1 gang/måned
- Du ikke kan svare: "Hvor mange ordrer mangler vi?"
- Lagerbeholdning opdateres med 1+ time forsinkelse
- Du opdager problemer først når kunder klager
- Ingen dashboard med realtids-KPI'er

## Regnestykket: Hvad koster forsinket data?

**Scenarie: 200 ordrer/dag, 2 timers forsinkelse i lageropdatering**

**Oversalg:**
- 2% oversalg pga. forsinket data
- 4 oversalg/dag
- Cost per oversalg: 2.782 kr.
- **Daglig: 11.128 kr.**
- **Årlig: 2.782.000 kr.**

**Spildt tid:**
- Plukkere venter på opdateret liste
- Kundeservice håndterer oversalg
- 2 timer/dag × 250 kr./time = 500 kr./dag
- **Årlig: 125.000 kr.**

**Total cost: 2.907.000 kr./år**

**Med realtidsdata:**
- Oversalg: 0,1% = 50.000 kr./år
- Spildt tid: 10.000 kr./år
- **Total: 60.000 kr./år**

**Besparelse: 2.847.000 kr./år**

## Hvad sker der i praksis

Black Friday. 6x volumen. Shopify opdaterer lagerbeholdning med 5-15 minutters forsinkelse.

Resultat: 30 oversalg på én dag. 30 × 2.782 kr. = 83.460 kr. tabt.

Plus: Ingen ved hvor mange ordrer der venter. Plukkere spørger: "Er der flere?" Lagerchefen ved det ikke.

## Typiske fejl

**1. Stole på Shopify-lagerstyring alene**
Shopify opdaterer med forsinkelse ved høj trafik. WMS opdaterer realtid.

**2. Manuel opdatering**
Plukker opdaterer Excel efter pluk. 2 timers forsinkelse. Oversalg sker.

**3. Ingen dashboard**
Du spørger plukkere: "Hvordan går det?" I stedet for at se dashboard.

**4. Opdage problemer for sent**
Du ser først problemet når kunder klager. For sent.

## Sådan gør du det rigtigt

**1. Implementer realtids lageropdatering (dag 1)**
- WMS med API-integration til Shopify
- Eller: Zapier-webhook (midlertidig løsning)

**2. Lav dashboard med KPI'er (uge 1)**
- Ordrer i kø
- Ordrer plukket i dag
- Gennemsnitlig pluktid
- Fejlrate
- Lagerbeholdning (realtid)

**3. Tjek dashboard hver time (fra dag 1)**
- Er vi foran eller bagud?
- Hvilke ordrer mangler?
- Risiko for oversalg?

**4. Automatiser alarmer (uge 2)**
- Alarm hvis ordrer i kø > 50
- Alarm hvis lagerbeholdning < refill limit
- Alarm hvis fejlrate > 2%

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Tjek nuværende forsinkelse i lageropdatering
- [ ] Implementer realtids-integration (WMS eller Zapier)
- [ ] Lav dashboard med 5 kritiske KPI'er
- [ ] Sæt alarmer for kritiske grænser
- [ ] Tjek dashboard hver time

**Næste skridt:** Læs "Vores data er rod" og "Vi løber tør for varer" for fuld kontrol.

## SmartPack understøttelse

SmartPack opdaterer lagerbeholdning realtid. Dashboard viser:
- Ordrer i kø (opdateret hvert sekund)
- Picks/time per medarbejder (realtid)
- Fejlrate (realtid)
- Lagerbeholdning (realtid)
- Estimeret tid til alle ordrer plukket

Alarmer: SMS/email når kritiske grænser overskrides.

## FAQ

**Hvad er "realtidsdata"?**
Opdatering inden for 1 sekund. Ikke 5 minutter, ikke 1 time.

**Kan Shopify opdatere realtid?**
Ja, men kun med WMS-integration. Shopify alene har forsinkelse ved høj trafik.

**Hvilke KPI'er er vigtigst?**
Ordrer i kø, picks/time, fejlrate, lagerbeholdning, cutoff-overholdelse.

**Hvor ofte skal vi tjekke dashboard?**
Hver time under normal drift. Hvert 15. minut under peak.

**Hvad hvis vi ikke har WMS?**
Start med Zapier-webhook. Det reducerer forsinkelse fra timer til minutter. Implementer WMS bagefter.
