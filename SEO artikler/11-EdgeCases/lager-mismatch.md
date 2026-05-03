---
primary_keyword: lager mismatch WMS
secondary_keywords: [inventory mismatch, system vs fysisk lager, saldo diskrepans, WMS accuracy problem]
cluster: 11-EdgeCases
---

# Lager-mismatch: Når systemet og virkeligheden er ude af sync

Lager-mismatch er når der er en kløft mel lem hvad WMS viser og hvad der fysisk er på lageret. Det er et symptom på processuelle eller systemmæssige problemer – og det vækster hvis det ikke bekmæmpes. Her er en systematisk guide til at identificere, kvantificere og eliminere mismatch.

## Hvad er lager-mismatch?

Lager-mismatch er discrepancier mel lem:
- **Fysisk beh oldning**: hvad der faktisk er på hylden
- **WMS-saldo**: hvad systemet tror der er

Mismatch kan være:
- **Positiv (phantom inventory)**: system viser mere end faktisk eksisterer
- **Negativ (shadow inventory)**: system viser mindre end faktisk eksisterer
- **Placerings-mismatch**: korrekt total-saldo men forkert lokation registreret

## Konsekvens i kroner

**Konsekvens:** Phantom inventory (for høj saldo) = oversalg = 350 kr./fejl + LTV-tab. Shadow inventory (for lav saldo) = tabt salg = 350 kr./tabt ordre. Ved 3% mismatch og 200 SKU'er: 6 SKU'er påvirket × 3 fejl/md = 18 fejl/md × 400 kr. = **86.400 kr./år**.

## Hvorfra kommer mismatch?

**Typiske årsager (rangeret efter hyppighed):**
1. Pluk uden scan (vare taget uden registrering)
2. Indsætning pæ forkert lokation (registreret sted A, lagt i B)
3. Returer ikke scannet ind
4. Beskadiget/spildt vare ikke fratrukket saldo
5. Leverandørfejl ikke opdaget ved modtagelse
6. WMS integrationsfejl (webshop, fragtleverandør)
7. Manuelle saldo-justeringer med fejl
8. Vare overført mel lem lokationer uden scan

## Det opdager de fleste for sent

**Mismatch akkumulerer.** 1% i dag. 2% om 3 måneder. 5% om 12 måneder. Kun årlig optælling = fejl akkumulerer i 12 måneder inden korrektion. Cycle count ugentligt på A-varer stopper akkumuleringen.

## Kvantificér dit mismatch

**Inventory accuracy = (antal korrekte placeringer / total placeringer) × 100%**

| Accuracy | Status |
|---|---|
| > 99,5% | Best-in-class |
| 99–99,5% | God |
| 97–99% | Acceptabel, forbedring nødvendig |
| < 97% | Kritisk – oversalg og pluk-fejl er hverdagen |

Mål din inventory accuracy månedligt. Kendte du den ikke inden du læste dette: mål den i dag.

## Systematisk eliminering

### Fase 1: Find mismatch (diagnosis)
1. Vælg 50 tilfældige SKU'er
2. Tæl dem fysisk
3. Sammenlign med WMS
4. Dokumenter discrepancy per SKU

### Fase 2: Identificer årsag (root cause)
For hvert mismatch: kig på transaktion shistorik i WMS. Når ble v saldo sidst korrekt? Hvilken transaktion foranledigede fejl?

### Fase 3: Retsæt processes
Fix den process der forløste fejlen – ikke blot tallet.

### Fase 4: Korriger saldi
Ret saldi til faktisk physisk beh oldning. Dokumenter korrektion med årsag.

### Fase 5: Mål på ny
Når du har rettet processer: mål accuracy igen om 4 uger. Er den forbedret?

## Forebyggelse: Scan everything

Enkelt princip: **ingen lager-hændelse uden scan**.
- Modtagelse: scan
- Indsætning: scan
- Pluk: scan
- Retur: scan
- Spild: scan
- Overførsel: scan

Et scan-baseret WMS reducerer mismatch fra 3–5% til under 0,3%.

## Typiske fejl

- **Mismatch ignoreret** – årlig optmælning er for sent
- **Saldi rettet uden root-cause** – fejlen genopstår
- **Manuelle justeringer vildledende** – historik mister sin værdi
- **Ingen månedlig accuracy-måling** – du ved ikke hvor du står
- **Integration-fejl ikke overvåget** – automatiske fejl akkumulerer

## Best practice

- Månedlig inventory accuracy måling (50+ SKU'er)
- Cycle count A/B/C-frekvens
- Alle lager-hændelser scan-baserede
- Integrations-logs overvåget for fejl
- Saldo-justeringer med autorisering og dokumenteret root-cause

## Brug denne artikel: tjekliste

- [ ] Inventory accuracy målt inden for de seneste 30 dage
- [ ] Cycle count plan A/B/C defineret
- [ ] Scan implementeret på alle lager-hændelser
- [ ] Integrations-log overvåget
- [ ] Saldo-justeringsprocedure med autorisering

**Næste skridt:** Mål din inventory accuracy nu. Tag 20 SKU'er – tæl dem og sammenlign med WMS. Hvad er discrepancien?

## SmartPack understøttelse

SmartPack's inventory accuracy dashboard viser real-time måling baseret på cycle count data. Integrations-log overvåges automatisk med alarm ved fejl. Alle lager-hændelser er scan-baserede med transaktion-histori k.

## FAQ

**Hvad er inventory accuracy?**
Procentdelen af lager-placeringer der matcher mel lem fysisk beh oldning og WMS.

**Hvord an måler man inventory accuracy?**
Tæl et repræsentativt udvalg af SKU'er fysisk. Sammenlign med WMS-saldo. (korrekte / totale) × 100%.

**Hvad er phantom inventory?**
Nr WMS viser positive saldo men varen ikke er der fysisk. Fører til oversalg.

**Hvad er shadow inventory?**
Når WMS viser lavere saldo end faktisk eksisterer. Fører til mistet salg.

**Hvord an eliminerer man mismatch permanent?**
Scan-baserede processer for alle lager-hændelser + regelmæssig cycle counting + integrations-overvågning.
