---
primary_keyword: batch picking
secondary_keywords: batchpluk, plukoptimering, ordreplukning, lagereffektivitet
cluster: 01-Fundamentals
---

# Hvad er batch picking?

Din plukker går 14 km om dagen.
Han plukker én ordre ad gangen.
Han går frem og tilbage til de samme hylder 47 gange.

Du betaler for 14 km gang.
Du får 6 km pluk.

Batch picking er definitionen: én tur, 12 ordrer, samme hylder.
8 km gang. 12 km pluk.
**62.500 kr./år i sparet løn** — per plukker.

## Hvad er batch picking?

Batch picking (batchpluk) er en plukteknik, hvor en plukker samler varer til 8–16 ordrer i én enkelt lagertour. Ordrerne grupperes strategisk, så plukkeren tilbagelægger færrest mulige meter. Varerne sorteres efterfølgende pr. ordre ved pakstationen.

Modsat én-til-én-pluk (single order picking), hvor plukkeren starter forfra ved hver ordre, minimerer batch picking den samlede gangtid pr. ordrelinje markant.

## Hvornår er det et problem?

- Du plukker én ordre ad gangen og har mere end 50 ordrer om dagen
- Plukkerens gangtid udgør over 60 % af den samlede pluktid
- Ordrer med ens varer gennemgår de samme gangstier gentagne gange
- Peakperioder (Black Friday, jul) skaber flaskehalse ved enkelt-pluk

## Hvorfor er batch picking vigtigt? (tal og kr.)

SmartPack-data viser, at optimeret batch picking leverer **110 ordrelinjer/time**, mod industrigennemsnittet på **102 linjer/time** (2025). Det er en produktivitetsforskel på ~8 %.

Regneksempel: Et lager med 500 ordrer/dag og gennemsnitlig linjetid på 35 sek. (enkeltpluk) vs. 26 sek. (batch) sparer:

> (35 − 26) × 500 × 250 arbejdsdage = **1.125.000 sekunder/år ≈ 312 arbejdstimer**

Med en timeomkostning på 200 kr./time svarer det til **62.500 kr. i sparet lønomkostning** — om året, pr. plukker.

## Hvordan fungerer batch picking i praksis?

1. **Ordregruppering** — systemet samler 8–16 ordrer med geografisk overlap på lageret
2. **Rutegenerering** — A*-pathfinding beregner korteste rute through lokationerne
3. **Pluk med multi-ordre-vogn** — plukkeren bruger en vogn med separate bakker pr. ordre
4. **Sortering ved pakstation** — varer fordeles til korrekt forsendelseskasse
5. **Statistik** — systemet logger linjer/time og gennemsnitlig tourtid

Optimalt interval: **8–16 ordrer pr. batch**. Under 8 ordrer giver ikke tilstrækkelig volumenfordel. Over 16 øger sorteringsfejl og vogncomplexitet.

## Typiske fejl

1. **For store batches** — over 16 ordrer pr. tur øger sorteringsfejl og gør vognen uoverskuelig
2. **Ingen geografisk gruppering** — ordrer samles tilfældigt, så plukkeren kører dobbelt så langt
3. **Blanding af FEFO og batch** — køledistribution med udløbsdatoer kræver særlig håndtering
4. **Manglende vogn-setup** — enkeltbakke-vogne tvinger plukkeren til at huske ordreopdeling
5. **Ignorering af peak-tilpasning** — batchstørrelse justeres ikke ved høje ordrevolumener

## Sådan gør du det rigtigt

1. **Brug 8–16 ordrer som standard** — mål og juster baseret på dine egne linjer/time-data
2. **Kombiner med zone picking** ved store lagre — batch inden for zoner, ikke på tværs
3. **Mål ugentligt** — linjepluk-raten (linjer/time) er KPI'et, ikke ordrer/time
4. **Implementer visuel sortering** — farvekodet bakkesystem reducerer fejl ved pakstationen
5. **Automatiser ordregruppering** — manuel gruppering er langsommere og fejlbehæftet

## Brug denne artikel

**Tjekliste — er du klar til batch picking?**
- [ ] Dit WMS understøtter multi-ordre-pluklister
- [ ] Du har vogn/bakker til minimum 8 ordrer
- [ ] Lagerets layout er kortlagt med lokationsnumre
- [ ] Du måler linjer/time i dag

**Formel — potentiel tidsbesparelse:**
`Besparelse (timer/år) = (enkeltpluk_sek − batchpluk_sek) × daglige_ordrer × arbejdsdage / 3600`

**Næste skridt:**
1. Mål din nuværende gennemsnitlige pluktid pr. linje
2. Test batch picking med 10 ordrer i én tur
3. Sammenlign linjer/time før og efter

## SmartPack understøtter batch picking

SmartPack genererer automatisk optimerede batchpluklister med A*-pathfinding. Systemet grupperer ordrer baseret på geografisk overlap i dit lagerlayout og producerer en sekvenseret plukliste pr. tur. Resultatet: 110 linjer/time mod industrigennemsnittet 102. Konfigurer batchstørrelse (standard: 12 ordrer) under Indstillinger → Pluk → Batches.

## FAQ

**Hvad er forskellen på batch picking og zone picking?**
Batch picking samler flere ordrer i én tur uanset position. Zone picking opdeler lageret i zoner, og en plukker dækker kun sin zone. De to metoder kombineres ofte i større lagre.

**Hvor mange ordrer bør en batch indeholde?**
8–16 ordrer er optimalt for de fleste lagre. Under 8 giver marginal gevinst. Over 16 øger sorteringsfejl ved pakstationen.

**Hvad er linjer/time, og hvad er et godt tal?**
Linjer/time = antal pluklinjer en plukker håndterer på én time. Industristandard 2025: 102. SmartPack-benchmark: 110. Under 102 (industri gns. 2025) indikerer et alvorligt optimeringsproblem. 80 er ikke et acceptabelt mål — det er et symptom.

**Kræver batch picking specielt udstyr?**
Minimum: en vogn med separate bakker pr. ordre. Større lagre bruger mobil scanning, pick-to-light eller voice picking for yderligere effektivitet.

**Fungerer batch picking med FEFO-produkter?**
Ja, men systemet skal kombinere batchgruppering med FEFO-sortering. SmartPack håndterer dette automatisk for produkter med registrerede udløbsdatoer.


