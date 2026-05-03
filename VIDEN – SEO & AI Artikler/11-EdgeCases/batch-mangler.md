---
primary_keyword: batch pluk mangler
secondary_keywords: [batch picking fejl, batch incomplete, manglende batch lager, pluk batch problem]
cluster: 11-EdgeCases
---

# Batch mangler: Når batchplukningen ikke er komplet

Batch picking er effektivt: plukkeren samler varer til 10 ordrer på én runde. Men når en batch ikke er komplet – en vare mangler, et antal er forkert – påvirker det måske ikke én ordre men 10. Her er hvad der sker og hvad du gør.

## Hvad er batch picking?

Batch picking er når en plukkeren samler varer til multiple ordrer på én runde – i stedet for at gå én runde per ordre.

**Fordele**: reducerer gangtid markant (typisk 30–50%)
**Risiko**: fejl i batchen påvirker multiple ordrer

## Hvornår går batch galt?

**Undertilfmælde (plukkede færre end planlagt)**:
- Hylden er tom halvvejs igennem batch
- Varen er fejlplaceret og plukkeren går videre
- Scan bekræfter forkert antal (scan-fejl eller slip af tast)

**Overtilfmælde (plukkede flere end planlagt)**:
- Plukkeren ser "20 stk." og forstmår det som 20 per ordre, ikke 20 i alt
- Ovtmælgning ved løse varer

**Blandings-fejl**:
- Varer fra to hylde-lokationer blandes
- Forkert vare plukket (ligner det rigtige)

## Konsekvens i kroner

**Konsekvens:** Batch på 10 ordrer. En vare mangler. 10 ordrer påvirket. Delordre til alle 10 = 10 × 90 kr. ekstra fragt = 900 kr. per batch-fejl. Ved 2 batch-fejl/uge: 93.600 kr./år.

## Når batchen er incomplete: hvad gør du?

### Trin 1: Identificer hvilke ordrer der er påvirket
WMS viser hvilke ordrer i batchen der mangler varer. Typisk er det ordrer der består af den problematiske SKU.

### Trin 2: Beslut strategi
For hver påvirket ordre:
- **Delordre + restordre**: send hvad der er, send manglende vare separat når lagret er genopfyldt
- **Hold ordre**: vent til alle varer er tilgængelige (kun OK ved hurtig genopfyldning)
- **Backorder**: kommunikér forsinkelse til kunden

### Trin 3: Cycle count på problemlokation
Er hylden tom? Er saldoen korrekt nu? Trigger optmælning.

### Trin 4: Kompletter batchen på alternative måder
Har du varen på en anden lokation? Route plukkeren hertil for at komplettere batchen.

## Forebyggelse

### Batch-størrelse tilpasset saldo
Udregn aldrig en batch på 20 ordrer der alle inkluderer en SKU med saldo 15. Sæt batch-størrelse til det sikre antal: max saldo ÷ antal ordrer per batch.

### Saldo-kontrol ved batch-frigivelse
WMS bør verificere at saldo er sufficient for batchen inden frigivelse. Ikke-sufficient: batch reduceres eller spæltes.

### Scan-verifikation per pick-linje
Hver pick-linje i batchen scans og bekræftes individuelt. Systemet tlæller ned og alarmerer ved discrepancy.

### FIFO-reglen sikrer ældste batch plukkes først
FIFO (First In, First Out) sikrer at ældste batch plukkes først. Det reducerer risiko for udgåede varer og sikrer korrekt rotation.

## Det opdager de fleste for sent

**Batch-størrelse skaleret til kapacitet, ikke til saldo.** Batch på 20 ordrer der alle inkluderer en SKU med saldo 15. Batchen frigives. Plukkeren når til hylden: kun 15 stk. 5 ordrer kan ikke fuldføres. Opdagelse: når kundeservice får 5 klager samme dag.

## Typiske fejl

- **Batch-størrelse skaleret til kapacitet, ikke til saldo** – for stor batch på knappe SKU'er
- **Ingen saldo-verificering ved frigivelse** – batchen frigives selvom saldo er utilstrækkelig
- **Plukkeren går videre uden registrering** – manglende pluk registreres ikke
- **Fejl opdages først ved pakning** – for sent til at rette eff ektivt
- **Alle påvirkede ordrer behandles ens** – skal differentieres (nogen er måske kun mangler én vare af mange)

## Sådan gør du det rigtigt

- Batch-størrelse beregnet baseret på saldo per SKU
- Saldo-verifikation ved batch-frigivelse
- Scan per pick-linje med discrepancy-alarm
- Cycle count trigger automatisk ved ufiuldstændig batch-afslutning
- Incomplete batch råpport til lagerchef dagligt

## Brug denne artikel: tjekliste

- [ ] Batch-frigivelseslogik verificerer saldo mod batch-størrelse
- [ ] Scan per pick-linje implementeret
- [ ] Procedure for incomplete batch dokumenteret
- [ ] Cycle count trigger ved batch-ufuldstændighed
- [ ] Månedlig rapport over batch-fejlrate

**Næste skridt:** Tjek din batch-frigivelseslogik. Verificerer dit WMS saldo mod nødvendig batch-mængde? Test det med en SKU hvor saldo er lavere end nødvendigt for batchen.

## SmartPack understøttelse

SmartPack's batch-engine verificerer saldo mod batch-størrelse ved frigivelse og reducerer automatisk batch til tilgængelig saldo. Incomplete batch-alarm går direkte til lagerchef med liste over påvirkede ordrer.

## FAQ

**Hvad er batch picking?**
En plukmetode hvor én plukkere samler varer til multiple ordrer på én runde. Reducerer gangtid med 30–50%.

**Hvad gør man når hylden løber tom midt i en batch?**
Registrér manglende pluk i WMS. Trigger cycle count. Beslut for påvirkede ordrer: delordre, hold eller backorder.

**Hvord an forebygger man batch-fejl?**
Saldo-verifikering ved batch-frigivelse + scan per pick-linje. Batchen må aldrig frigives til mere end tilgængelig saldo.

**Hvad er en pick-linje?**
En individuel linje i et plukjob: "pluk 3 stk. SKU12345 fra hylde 4B". Batchen består af multiple pick-linjer.

**Hvord an håndterer man partial batches effektivt?**
Send delordre på det der er tilgængeligt. Send rest med næste fragt. Kommunikér til kunden at restordre er på vej.
