---
primary_keyword: lagerdata er forkert
secondary_keywords: [inventory accuracy, lagerbeholdning fejl, cycle counting, lager optælling]
cluster: 02-Problemer
article_type: problem
---

# Vores data er rod – når systemet ikke matcher virkeligheden

Dit system viser 47 enheder af SKU TS-BLÅ-M. Plukker går til hylden. Der er 31.

Du sælger 16 enheder du ikke har. 16 kunder får "beklager, udsolgt". 16 refunderinger. 16 × 680 kr. gennemsnitsordre = 10.880 kr. tabt omsætning.

Og 4 af dem skriver aldrig til jer igen. 4 × 2.400 kr. LTV = 9.600 kr. tabt.

**Total cost af ÉN forkert beholdning: 20.480 kr.**

Ved 200 SKU'er og 5% data-fejlrate sker det her 10 gange/måned = 204.800 kr./år.

Dette er prisen for rod i data.

## Kort svar

> Forkert lagerdata opstår når beholdning ikke opdateres ved alle lagerbevægelser og kan koste over 426.000 kr. om året i oversalg og spildt medarbejdertid. Cycle counting, scanning ved alle bevægelser og et mål om 98%+ inventory accuracy løser problemet.

## Hvad mener vi med "data er rod"?

Data er rod når:
- System viser 47, hylden har 31
- SKU-navne er inkonsistente ("TS-BLÅ-M" vs "T-shirt blå medium")
- Lokationer er forkerte ("Hylde A3" men varen står i B7)
- Duplikerede SKU'er i systemet
- Ingen ved hvad der er sandt

## Hvornår er det et problem?

Data-rod er et strukturelt problem når:
- Inventory accuracy under 95%
- Oversalg sker mere end 1 gang/måned
- Plukkere spørger: "Hvor står varen egentlig?"
- Fysisk optælling afviger 10%+ fra system
- Du ikke stoler på dine egne lagertal

## Dataoprydning: Uge 1-plan

### Dag 1 (4 timer)
**Fokus: A-varer (20% af SKU'er, 80% af salg)**

1. Identificer 50 mest solgte SKU'er
2. Fysisk optælling af hver
3. Sammenlign med system
4. Ret afvigelser

**Forventet:** 15-25% afvigelser på første optælling

### Dag 2-3
**Fokus: B-varer**
- Samme proces
- Forventet: 10-15% afvigelser

### Dag 4-5
**Fokus: C-varer**
- Samme proces
- Forventet: 5-10% afvigelser

**Resultat efter uge 1:**
- Inventory accuracy fra 85% til 98%+
- Oversalg elimineret
- 204.800 kr./år spart

**Kritisk:** Lav IKKE alt på én gang. Start med A-varer – det giver 80% af gevinsten.

## Regnestykket: Hvad koster forkerte data?

**Scenarie: 200 SKU'er, 90% inventory accuracy**

**Oversalg:**
- 10% af SKU'er har forkert beholdning = 20 SKU'er
- Gennemsnitlig afvigelse: 8 enheder
- Oversalg per måned: 20 × 0,5 (sandsynlighed) = 10 oversalg
- Cost: 10 × (680 kr. + 2.040 kr. LTV) = **27.200 kr./måned**
- **Årlig: 326.400 kr.**

**Spildt tid:**
- Plukkere leder efter varer der "burde være der"
- 2 timer/dag spildt × 200 kr./time = 400 kr./dag
- **Årlig: 100.000 kr.**

**Total cost: 426.400 kr./år**

**Med 98% inventory accuracy:**
- Oversalg: 2% × 200 = 4 SKU'er forkerte
- Cost: 13.600 kr./måned = 163.200 kr./år
- Spildt tid: 20.000 kr./år
- **Total: 183.200 kr./år**

**Besparelse: 243.200 kr./år**

## Hvad sker der i praksis

System viser 150 enheder. Fysisk optælling: 127. Afvigelse: 23 enheder.

Årsag: 3 måneder siden blev 20 enheder flyttet til outlet. Ikke registreret i system. 3 enheder blev kasseret (beskadiget). Ikke registreret.

Resultat: System er 15% forkert. Oversalg sker næste uge.

## Typiske fejl

**1. Aldrig lave fysisk optælling**
"Systemet burde være korrekt" er ikke en strategi. Lav cycle counting ugentligt.

**2. Rette data uden at finde årsag**
System viser 47, hylden har 31. Du retter til 31. Men HVORFOR var det forkert? Find årsag.

**3. Fuld optælling 1 gang/år**
Bedre: 10 SKU'er dagligt (cycle counting) end alt 1 gang/år.

**4. Ikke registrere kassering/svind**
Vare kasseres. Ikke registreret. System viser stadig "på lager".

## Sådan gør du det rigtigt

**1. Fuld optælling af A-varer (dag 1)**
- 50 mest solgte SKU'er
- Fysisk optælling
- Ret afvigelser
- Registrer årsag

**2. Implementer cycle counting (uge 1)**
- 10 SKU'er dagligt
- Rotation så alle SKU'er optælles kvartalsvis
- A-varer: Månedligt
- B-varer: Kvartalsvis
- C-varer: Halvårligt

**3. Registrer ALT (fra dag 1)**
- Kassering: Scan ud
- Flytning: Scan ud + scan ind
- Retur: Scan ind
- Svind: Registrer

**4. Mål inventory accuracy (ugentligt)**
- Mål: 98%+
- Under 95%: Find årsag

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Identificer top 50 SKU'er
- [ ] Lav fysisk optælling
- [ ] Beregn inventory accuracy
- [ ] Ret afvigelser
- [ ] Implementer daglig cycle counting (10 SKU'er/dag)
- [ ] Registrer ALT fremadrettet

**Formel:** Inventory accuracy = (Antal korrekte SKU'er / Total antal SKU'er) × 100%

**Næste skridt:** Læs "Vi løber tør for varer" og "Vi mangler overblik over lageret" for fuld kontrol.

## SmartPack understøttelse

SmartPack kræver scanning ved ALLE bevægelser. Pluk: Scan. Modtagelse: Scan. Flytning: Scan. Kassering: Scan. Resultat: Inventory accuracy 98%+ fra dag 1. Cycle counting-modul viser: Hvilke 10 SKU'er skal optælles i dag? Dashboard viser inventory accuracy realtid.

## FAQ

**Hvor ofte skal vi lave optælling?**
Cycle counting dagligt (10 SKU'er). Fuld optælling 1 gang/år.

**Hvad er god inventory accuracy?**
98%+ er målet. 95-98% acceptabelt. Under 95%: Problem.

**Hvad hvis vi finder stor afvigelse?**
Ret tallet. Men vigtigere: Find årsag. Hvorfor var det forkert?

**Skal vi optælle ALT?**
Nej. Start med A-varer. De giver 80% af gevinsten.

**Hvordan undgår vi fremtidige afvigelser?**
Scan ALT. Pluk, modtagelse, flytning, kassering. Ingen manuelle opdateringer.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Hvornår er Excel ikke nok?](/viden/beslutning/hvornaar-excel-fejler)
- [ROI på WMS](/viden/okonomi/roi-paa-wms)
- [Tjekliste før WMS](/viden/beslutning/tjekliste-foer-wms)
