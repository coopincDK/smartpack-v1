---
primary_keyword: zone picking
secondary_keywords: zonepluk, lageroptimeringsmetode, pick and pass, parallel picking
cluster: 01-Fundamentals
---

# Hvad er zone picking?

Plukkeren går gennem hele lageret.
Han krydser 3 andre plukkere.
Han går 8 km om dagen.

Zone picking: han får zone A.
Han kender hver hylde.
Han går 5 km om dagen.

**30-50% mindre gang** = 7.500 km/år sparet — per 10 plukkere.

## Hvad er zone picking?

Zone picking (zonepluk) er en plukstrategi, hvor lageret opdeles i definerede geografiske zoner, og hver plukker arbejder eksklusivt inden for sin tildelte zone. En ordre fuldendes enten ved at passere fra zone til zone (pick and pass) eller ved at alle zoner plukker parallelt og varerne konsolideres ved pakstationen (parallel/wave picking).

**To varianter:**
- **Pick and pass** — ordrekassen sendes fysisk fra zone til zone, én plukker per zone tilføjer varer
- **Parallel zone picking** — alle zoner plukker til samme ordre samtidigt, konsolidering sker efterfølgende

## Hvornår er det et problem?

- Plukkerens gangtid overstiger 55 % af total pluktid i store lagre
- Plukkere krydser hinandens ruter konstant og skaber flaskehalse
- Nye plukkere har svært ved at lære hele lageret
- Visse zoner (f.eks. bestseller-varer) er konstant overbelastede

## Hvorfor er zone picking vigtigt? (tal og kr.)

Zone picking reducerer gennemsnitlig gangdistance pr. ordrelinje med **30–50 %** i lagre over 1.000 kvm sammenlignet med fri pluk. Specialisering i én zone øger plukkerens kendskab til lokationer og reducerer fejlplukning.

Et lager med 10 plukkere, der hver går 8 km/dag, kan med zone picking reducere til 5 km/dag:
> 10 plukkere × 3 km × 250 dage = **7.500 km sparet gangdistance/år**

Reduceret gangtid svarer direkte til øget kapacitet eller reduceret personalebehov.

## Hvordan fungerer zone picking i praksis?

1. **Zonedesign** — lageret opdeles baseret på varevolumen, størrelse og plukfrekvens
2. **ABC-zonering** — A-varer (højfrekvens) placeres i den første zone tættest på pakstationen
3. **Zonetildeling** — plukkere tildeles faste zoner eller roterer efter tidsplan
4. **Ordredirigering** — WMS-systemet fordeler ordrelinjer til korrekt zone automatisk
5. **Konsolidering** — ved parallel picking samles delpluklister ved pakstationen

**Anbefalet antal zoner:** 3–6 for de fleste mellemstore lagre. Over 8 zoner øger koordineringskompleksitet.

## Typiske fejl

1. **Forkert zonedesign** — zoner med ujævn belastning skaber flaskehalse i én zone og tomgang i andre
2. **Ingen A/B/C-zonering** — bestseller-varer ligger langt fra pakstationen
3. **Pick and pass uden bufferstyring** — kasser hobes op foran langsomme zoner
4. **Statiske zoner ved sæsonsvingninger** — zoneinddelingen tilpasses ikke til ændret efterspørgsel
5. **Manglende konsolideringsplan** — parallel picking kræver en klar samlestation, ellers fejler ordrer

## Sådan gør du det rigtigt

1. **Placer A-varer i zone 1** tættest på pakstationen — de udgør typisk 80 % af plukvolumen
2. **Revurder zoner kvartalsvis** — sortimentsændringer ændrer plukfrekvenser
3. **Kombiner med batch picking inden for zoner** for maksimal effekt
4. **Mål zone-utilization** — procentdel af ordrelinjer pr. zone over tid
5. **Brug bufferzone ved pick and pass** — forhindrer ophobning ved langsomme zoner

## Brug denne artikel

**Tjekliste — er zone picking relevant for dig?**
- [ ] Dit lager er over 500 kvm
- [ ] Du har mere end 3 aktive plukkere samtidigt
- [ ] Din ganganalyse viser over 50 % gangtid
- [ ] Du har identificeret dine A-, B- og C-varer

**Formel — gangdistancereduktion:**
`Besparelse (%) = (fri_pluk_gangdistance − zone_gangdistance) / fri_pluk_gangdistance × 100`

**Næste skridt:**
1. Kortlæg nuværende gangmønstre i én uge
2. Identificer ABC-fordeling af dine produkter
3. Design 3–4 zoner baseret på plukfrekvens

## SmartPack understøttelse

SmartPack understøtter zone picking med automatisk zonebaseret ordrefordeling. WMS-modulet dirigerer ordrelinjer til korrekt zone og genererer sekvenserede pluklister pr. zone. Ved parallel zone picking konsoliderer systemet delpluklister automatisk ved pakstationen. Konfigurer zoner under Lageropsætning → Zoner.

## FAQ

**Hvad er forskellen på zone picking og batch picking?**
Zone picking opdeler lageret geografisk og tildeler plukkere til faste zoner. Batch picking samler flere ordrer i én tur uanset zoneinddeling. De to metoder bruges ofte sammen.

**Hvornår bør jeg skifte fra fri pluk til zone picking?**
Typisk når lageret overstiger 500 kvm, har 3+ samtidige plukkere, eller ganganalyse viser at over 50 % af pluktiden er gangtid.

**Hvad er pick and pass?**
En zone-picking-variant, hvor ordrekassen transporteres fysisk fra zone til zone. Hver plukker tilføjer sine varer, inden kassen sendes videre. Kræver god flowbalancering.

**Hvor mange zoner er optimalt?**
3–6 zoner for de fleste mellemstore lagre (500–5.000 kvm). Flere zoner øger koordineringskompleksitet uden proportional gevinst.

**Kan zone picking kombineres med automatisering?**
Ja. Zoner med lavfrekvens-varer egner sig til automatiserede systemer (f.eks. autostore), mens A-vare-zoner typisk forbliver manuelle for fleksibilitetens skyld.

