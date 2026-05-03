---
primary_keyword: datahygiejne lager
secondary_keywords: [data hygiejne wms, lager data kvalitet, ren data lager, lagernøjagtighed data]
cluster: 03-Operations
article_type: beslutning
---

# Datahygiejne i praksis: Sådan holder du dine lagerdata præcise og pålidelige

Dårlige data er dyrere end ingen data. Et lager der tror, det har 50 enheder af en SKU men kun har 32, vil sætte varer i produktion der ikke kan leveres. Denne guide viser dig, hvad datahygiejne på et lager indebærer, og hvordan du implementerer det i daglig praksis.

## Kort svar

Datahygiejne er systematisk vedligeholdelse af lagerantal, stamdata og lokationskoder i systemet. Formålet er at eliminere de ~30% af pakkefejl, der skyldes forkerte data frem for menneskelige fejl ved pluk.

## Hvad er datahygiejne på lager?

Datahygiejne er systematisk vedligeholdelse af dataenes nøjagtighed, konsistens og fuldstændighed i dit lagerstyringssystem. Det dækker:
- Korrekte lagerantal (fysisk vs. system)
- Opdaterede lokationskoder
- Præcise SKU-stamdata (navn, vægt, dimensioner, stregkode)
- Korrekte leverandørdata
- Registrering af alle bevægelser (ind, ud, flytning, justering)

## Hvornår er det et problem?

Dårlig datahygiejne viser sig som:
- Systemlager afviger fra fysisk lager (hyppige afvigelser ved cycle counting)
- SKU'er med manglende stamdata (ingen stregkode, ingen vægt, ingen dimensioner)
- Negative lagerantal i systemet
- Ordrer sendes til forkert lokation fordi lokationskoder er forældede

## Hvorfor er det vigtigt? (tal)

- Datauoverensstemmelser er årsag til ~**30% af alle pakkefejl** der ikke skyldes menneskelig fejl ved pluk
- Forkerte lagerantal fører til over- og undersalg – begge dele koster
- Negative lagerantal i systemet er et direkte tegn på uregistrerede bevægelser
- Et system med dårlig datahygiejne mister medarbejdernes tillid – og de begynder at omgå systemet, hvilket forværrer situationen

## Trin-for-trin: Implementér datahygiejne

### Trin 1: Gennemfør et data-audit
Start med at kortlægge omfanget af dataproblemet:
- Kør en rapport over alle SKU'er med negativt lagerantal
- Find alle SKU'er der mangler stregkode, dimensioner eller leverandørinfo
- Identificér lokationskoder i systemet der ikke matcher fysiske lokationer

### Trin 2: Rens stamdata
For hver SKU, verificér og opdatér:
- Navn og beskrivelse (unikt og præcist)
- EAN/stregkode
- Enhedsvægt og dimensioner (vigtigt for fragt-optimering)
- Leverandørkode og minimum-ordremængde
- ABC-klasse

### Trin 3: Ret lagerantalsafvigelser
For afvigelser fundet i step 1:
- Undersøg årsag (uregistreret bevægelse, fejlmodtagelse osv.)
- Korriger efter forståelse – ikke blindt
- Dokumentér korrektionen med årsag

### Trin 4: Etablér dataregistrerings-standarder
Opsæt regler for, hvornår og hvordan data registreres:
- Alle varemodtagelser registreres inden placering
- Alle pluk registreres ved scanning (ikke manuelt)
- Alle fejl og justeringer registreres med årsag
- Ingen varer flyttes uden systemregistrering

### Trin 5: Integrér cycle counting som løbende datakontrol
Cycle counting er ikke bare optælling – det er datahygiejne i praksis. Regelmæssig optælling opdager afvigelser, inden de eskalerer.

### Trin 6: Kørfaste KPI'er for datakvalitet
Mål månedligt:
- % af SKU'er med komplet stamdata
- Antal afvigelser fundet ved cycle counting
- Antal negative lagerantal

Publicér og følg op på disse tal.

## Typiske fejl

**Fejl 1: Korrigere data uden at forstå årsag**
At rette et lagertal uden at forstå, hvorfor det er forkert, løser ikke problemet. Det gentager sig.

**Fejl 2: Oprette SKU'er med ufuldstændige stamdata**
Et SKU oprettet uden stregkode kan ikke scannes. Opstil minimumskrav for oprettelse.

**Fejl 3: Manuelle justeringer uden dokumentation**
En lageradjustering uden årsagsbeskrivelse er et audit-problem – og en tabt læringsmulighed.

**Fejl 4: Ignorere negative lagerantal**
Negative tal er symptom på et problem – ikke bare et tal der skal rettes. Undersøg altid.

## Sådan gør du det rigtigt

**1. Opstil krav til SKU-oprettelse**
Ingen SKU oprettes uden: stregkode, beskrivelse, vægt, dimensioner og leverandørkode. Håndhæv dette som systemkrav.

**2. Brug cycle counting som datatjek, ikke bare optælling**
Behandl afvigelser som datasporingsopgave, ikke som fejl der bare rettes.

**3. Log alle manuelle justeringer med årsag og bruger**
Fuldt audit trail på alle justeringer er både god praksis og nødvendig ved revisioner.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Kør data-audit: negative lagerantal, manglende stamdata, forkerte lokationer
- [ ] Rens og kompletér stamdata for alle aktive SKU'er
- [ ] Ret afvigelser efter årsagsforståelse
- [ ] Etablér dataregistrerings-standarder og håndhæv dem
- [ ] Implementér cycle counting som løbende datakontrol
- [ ] Opsæt månedlige KPI'er for datakvalitet

**Næste skridt**: Læs guiderne om cycle counting og lageralerts for at forbinde datahygiejne med løbende overvågning.

## SmartPack understøttelse

SmartPack kræver obligatoriske stamdata-felter ved SKU-oprettelse. Systemet logger alle bevægelser med tidspunkt og bruger og giver dig et komplet audit trail. "Lager alerts"-dashboardet advarer ved negative lagerantal og markante afvigelser fra forventet beholdning.

## FAQ

**Hvad er datahygiejne på lager?**
Systematisk vedligeholdelse af nøjagtighed og fuldstændighed i alle lagerdata – lagerantal, stamdata, lokationskoder og bevægelsesregistrering.

**Hvad forårsager dårlig datahygiejne?**
Uregistrerede bevægelser, ufuldstændige stamdata, manglende scanning og manuelle korrektioner uden årsagsdokumentation.

**Hvad er negative lagerantal et tegn på?**
Et symptom på uregistrerede bevægelser (pluk uden scan, forsendelse uden registrering) eller fejlmodtagelse. Undersøg altid årsagen.

**Kan jeg automatisere datahygiejne?**
Delvist. Automatiske alerts ved afvigelser, tvungen scanning og systemkrav ved oprettelse reducerer problemerne. Men regelmæssig menneskelig kontrol (cycle counting, audit) er uundgåelig.

**Hvor ofte bør jeg lave data-audit?**
Minimum kvartalsvis en grundig audit. Månedlig kontrol af KPI'er (negative tal, afvigelsesprocent). Daglig overvågning via alerts-dashboard.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Forkerte lagerdata og negative antal](/viden/problemer/forkerte-lagerdata)
