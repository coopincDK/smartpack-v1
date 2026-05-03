---
primary_keyword: vare kan ikke findes på lager
secondary_keywords: [manglende vare lager, phantom inventory, vare ikke fundet pluk, lagerplacering fejl]
cluster: 11-EdgeCases
---

# Vare kan ikke findes: Når plukkerens skærm siger "hylde 4B" men der ikke er noget der

En plukker går til hylde 4B. Systemet siger der er 12 stk. på lager. Hyldepladsen er tom. Ordren kan ikke fuldføres. Kunden venter. Hvad er problemet og hvad gør du? Dette er et af de hyppigste og mest frustrerende edge cases på ethvert lager.

## Hvad er årsagen?

Når en vare ikke kan findes på sin registrerede placering, er der typisk én af fem årsager:

1. **Forkert placering ved indsætning**: varen er lagt på forkert hylde og ikke scannet korrekt
2. **Pluk uden scan**: nogen har taget varen uden at registrere det i systemet
3. **Phantom inventory**: system viser positiv saldo men varen er ikke fysisk der (fejl fra forrige optmælling eller indsætningsfejl)
4. **Flytning uden opdatering**: varen er rykket til anden placering men WMS er ikke opdateret
5. **Tyveri eller svind**: varen er fysisk forsvundet

## Det opdager de fleste for sent

**Phantom inventory akkumulerer.** WMS viser 50 stk. Fysisk: 37 stk. Forskellen: 13 stk. Du opdager det først når du oversælger. 13 kunder har betalt. 13 kunder skal refunderes. 13 × 830 kr. = **10.790 kr. per uopdaget phantom inventory**.

**Fejlkode 301: ItemNotFound** – tjek om varen er på en anden location. Ofte er varen flyttet men ikke opdateret i WMS.

## Konsekvens i kroner

**Konsekvens:** Vare ikke fundet = ordre kan ikke fuldføres = backorder eller refund. Backorder: 90 kr. ekstra fragt + 15 min kundeservice = 152 kr. Refund: 350 kr. kundeservice + LTV-tab (480 kr.) = 830 kr. Ved 10 "ikke fundet"/uge: 520 × 400 kr. = **208.000 kr./år**.

## Hvad gør du når det sker?

### Trin 1: Søg på naboplaceringer
Varer bliver tit sat på nabohylden. Tjek øverste/nederste hylde og de nærmeste lokaliteter.

### Trin 2: Søg på alternative lokaliteter i WMS
Har varen måske andre registrerede placeringer? WMS bør vise alle lokaliteter med saldo > 0.

### Trin 3: Tjek karantmænelager
Er varen måske sat til side som beskadiget? Tjek karantænelager og retur-zone.

### Trin 4: Registrér "ikke fundet"
Er varen ikke fundet: registrér det i WMS som missing pick. Sæt saldo til 0 på den placering. Start cycle count.

### Trin 5: Håndter ordren
Ordren kan ikke fuldføres som planlagt. Mulige håndteringer:
- Udskær varen og send delordre + notificer kunden
- Omsæt til backorder og bestil hurtigt hjem
- Tilbyd alternativt produkt
- Fuldt refunder

## Forebyggelse

### Scan-baseret pluk
Scanner-baseret pluk reducerer fejlfrekvensen markant. Når plukkeren scanner HER/lokal + vare: systemet verificerer de matcher. Placeret-forkert-fejl opdages ved indsætning, ikke ved pluk.

### Scan-baseret indsætning
Ved modtagelse: scan hver vare + scan placeringen. Systemet bekræfter match. Ingen manuel registrering.

### Regelmæssig cycle counting
Cycle count = løbende optmælling af et udvalg af hylde-placeringer (ikke fuld årlig optmælling):
- Tæl de 20 højest-værdiløse SKU'er hver uge
- Tæl alle placeringer med tilbudsordrer inden første pluk
- Tæl placeringer med mismatches historisk

### Lagernmøjagtighed (inventory accuracy)
Mål din inventory accuracy månedligt:
**Formel**: (antal korrekte placeringer / totale placeringer) × 100%

Mål: >99%. Under 97% er kritisk.

## Typiske fejl

- **Ingen scan-baseret indsætning** – fejl sker ved modtagelse og opdages ikke før pluk
- **Phantom inventory ignoreret** – negative saldi eller åbnende gaps åldt aldrig rettet
- **Ingen cycle count** – fejl akkumulerer indtil årsoptmælling
- **Pluk uden scan** – varer tages fra hylden uden registrering
- **Mangler procedure for "ikke fundet"** – plukker ved ikke hvad der gøres

## Sådan gør du det rigtigt

- Scan-baseret pluk og indsætning uden undtagelser
- Ugentlig cycle count på høj-rotation SKU'er
- Inventory accuracy målt og rapporteret månedligt
- Dokumenteret procedure for "vare ikke fundet" (plukker ved hvad der gøres)
- Missing pick → automatisk optmælling af den placering triggeret

## Brug denne artikel: tjekliste

- [ ] Scan-baseret pluk implementeret (ingen manuelle registreringer)
- [ ] Scan-baseret indsætning ved modtagelse implementeret
- [ ] Procedure for "vare ikke fundet" dokumenteret og trænet
- [ ] Cycle count-plan oprettet
- [ ] Inventory accuracy målt de seneste 3 måneder

**Næste skridt:** Find dine 10 mest plukked e SKU'er i den seneste måned. Tlæl dem fysisk og sammenlign med system. Er der mismatch?

## SmartPack understøttelse

SmartPack triggerer automatisk cycle count når en "vare ikke fundet"-registrering sker. Scan-baseret pluk og indsætning er standard. Missing pick logges og eskaleres til lagerchef.

## FAQ

**Hvad er phantom inventory?**
Når WMS viser positiv saldo men varen ikke eksisterer fysisk på den registrerede placering. Typisk årsag: fejl ved indsætning, pluk uden scan, eller lagerflytning uden opdatering.

**Hvad er cycle counting?**
Løbende optmælling af et udvalg af lager-placeringer – i stedet for en fuld årlig optmælling. Mere effektivt og giver hurtigere korrektioner.

**Hvad er inventory accuracy?**
Procentdelen af lagerplaceringer der stemmer mel lem fysisk beh oldning og WMS. Mål: >99%.

**Hvad gør man med en ordre når varen ikke kan findes?**
Registrér missing pick, håndter ordre (delordre/backorder/refund) og start cycle count på den placering.

**Hvord an forebygger man phantom inventory?**
Scan-baseret indsætning og pluk + regelmæssig cycle counting. Aldrig manuelle registreringer uden scan-bekræftelse.
