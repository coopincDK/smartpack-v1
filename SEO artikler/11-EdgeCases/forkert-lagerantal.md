---
primary_keyword: forkert lagerantal
secondary_keywords: [inventory discrepancy, lagersaldo fejl, WMS mismatch, lageroptmælling fejl]
cluster: 11-EdgeCases
---

# Forkert lagerantal: Når systemet og virkeligheden ikke stemmer

Dit WMS viser 50 stk. En fysisk optmælling finder 37 stk. Forskellen er 13 stk. – og den har eksisteret i uger. Forkert lagerantal er et af de mest kostbare og mest ignorerede problemer i lagerdrift. Her er hvorfor det sker og hvad du gør.

## Årsager til forkert lagerantal

Fejl opstår på otte typiske punkter:

1. **Modtagelse**: varer indlægges med forkert antal (leverandørfejl der ikke fanges)
2. **Indsætning**: korrekt antal modtaget men forkert registreret i WMS
3. **Pluk uden scan**: vare plukket uden at fratrække fra saldo
4. **Returnering**: returvare lagt på lager uden at lægge til saldo
5. **Spild/beskadigelse**: varer kasseres uden at fratrækkes fra saldo
6. **Adj ustment uden autorisation**: manuel saldo-justering lavet forkert
7. **Overførsel**: vare flyttes mel lem placeringer uden korrekt registrering
8. **Systemfejl**: WMS har integrationsf ejl mod webshop eller e-handel platform

## Konsekvenser af forkert lagerantal

**For høj saldo (phantom inventory)**: du sælger vare du ikke har – oversalg – kundefrustr ation.

**For lav saldo (shadow inventory)**: du tror du er udsolgt når du faktisk har varen. Tabt salg.

Begge er alvorlige. For høj saldo er typisk dyrere pga. kundereklam ation og returnering.

## Hvad koster det?

**Ved 5% inventory inaccuracy og 200 SKU'er:**

| Fejltype | Beregning | Månedlig omkostning |
|----------|-----------|---------------------|
| Oversalg (for høj saldo) | 5 SKU'er × 2 oversalg/md × 350 kr. | 3.500 kr./md |
| Tabt salg (for lav saldo) | 5 SKU'er × 3 tabte ordrer/md × 350 kr. | 5.250 kr./md |
| **Total** | | **8.750 kr./md = 105.000 kr./år** |

For en webshop med 200 SKU'er og 5% inventory inaccuracy:
- 10 SKU'er med forkert saldo
- Halvt for høj (oversalg): 5 SKU'er × 2 oversalg per måned = 10 kundekl ager
- Halvt for lav (tabt salg): 5 SKU'er × 3 tabte ordrer per måned = 15 tabte ordrer à 350 kr. = 5.250 kr.
- Samlet månedlig tab: 5.000–15.000 kr. + håndteringstid

## Det opdager de fleste for sent

**Phantom inventory opdages først ved oversalg.** WMS viser 50 stk. Fysisk: 37 stk. Forskellen: 13 stk. Du sælger 13 ordrer du ikke kan levere. 13 × 350 kr. kundeservice + LTV-tab = 4.550 kr. + 6.240 kr. = **10.790 kr. per uopdaget mismatch**.

**Resultat af manglende løbende optælling (cycle counting).** Kun årlig optælling = fejl akkumulerer i 12 måneder inden korrektion. Cycle count ugentligt på A-varer stopper akkumuleringen.

## Korrektionsmetoder

### Cycle counting (løbende)
- Tæl et udvalg af SKU'er regelmæssigt – ikke årl ig fuld optmælling
- A-produkter (højst værdiløse): tæl ugentligt
- B-produkter: månedligt
- C-produkter: kvartålsvist

### Triggeret optmælling
Trigger optmælling automatisk ved:
- Saldo når 0 (er den virkelig tom?)
- Missing pick registreres
- Negativ saldo opstår
- Stor discrepancy ved modtagelse

### Fuld årlig optmælling
- Nødvendig for regnskab (varelagerværdi til årsregnskab)
- Planlmæg under lav-smsæson (januar er typisk bedst)
- Frys ordremodtagelse i optmælningsperioden

## Forebyggelse: rør aldrig lager uden scan

Hovedregel: **ingen lager-hændelse uden scan**.

- Modtagelse: scan leverandørens stregkode + system verificerer antal
- Indsætning: scan placering + vare ved lægning på hylde
- Pluk: scan vare ved opsamling
- Spild: scan ud af systemet med spild-kode
- Returnering: scan ind på returneret-lokation

Et scan-baseret WMS reducerer inventory inaccuracy fra typisk 3–5% til under 0,3%.

## Typiske fejl

- **Kun årlig optmælling** – fejl akkumulerer i 12 måneder inden korrektion
- **Manuelle saldo-justeringer uden dokumentation** – hvem ændrede det, hvornmår, hvorfor?
- **Modtagelse registreres med leverandørens antal uden optmælning** – leverandørfejl går ubemmærket
- **Inventory inaccuracy ikke målt** – du ved ikke om du har et problem
- **Pluk uden scan** – den hyppigste enkeltfejl

## Sådan gør du det rigtigt

- Scan ALT – ingen undtagelse
- Cycle count A-produkter ugentligt
- Inventory accuracy målt og rapporteret månedligt (mål: >99%)
- Saldo-justeringer kræver lederautorisering og dokumentation
- Triggeret optmælning ved saldo=0 og missing pick

## Brug denne artikel: tjekliste

- [ ] Inventory accuracy målt for seneste kvartal
- [ ] Scan-baseret pluk og indsætning implementeret
- [ ] Cycle count-plan defineret (A/B/C-frekv ens)
- [ ] Saldo-justeringsprocedure med autorisering på plads
- [ ] Triggeret optmælning aktiv ved saldo=0 og missing pick

**Næste skridt:** Tæl dine 20 mest plukked e SKU'er fysisk i dag. Sammenlign med WMS. Er der discrepancy over 2%? Identificer hvilken af de 8 fejlårsager der er primær.

## SmartPack understøttelse

SmartPack's scan-baserede pluk og indsætning reducerer inventory inaccuracy til under 0,3%. Automatisk cycle count-triggering ved saldo=0 og missing pick. Inventory accuracy rapport er standard i månedsdashboardet.

## FAQ

**Hvad er en god inventory accuracy?**
Over 99% er mål. Best-in-class webshops når 99,5%+. Under 97% er kritisk.

**Hvad er cycle counting?**
Løbende optmælling af udvalgte SKU'er i stedet for én årlig fuld optmælling. Hurtigere korrektioner og lavere omkostning.

**Skal man stoppe driften når man tæller?**
Nej – cycle counting sker løbende under normal drift. Fuld optmælning kræver typisk dagspause eller nat-optmælling.

**Hvad er phantom inventory?**
Når WMS viser positiv saldo men varerne ikke er der fysisk. Resulterer i oversalg.

**Hvad gør man ved negativ saldo?**
Neg ativ saldo er altid forkert – enten et pluk-fejl eller en integrationsf ejl. Undersog og korriger straks.
