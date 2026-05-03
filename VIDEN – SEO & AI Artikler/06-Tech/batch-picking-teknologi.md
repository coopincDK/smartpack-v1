---
primary_keyword: batch picking teknologi
secondary_keywords: batch picking system, pluksystem effektivitet, wave picking, multi-ordre pluk
cluster: 06-Tech
---

# Batch picking teknologi – fra én ordre ad gangen til 8-16 per tur

Batch picking er den teknologiske og procesmæssige løsning, der har størst enkelt-effekt på picks/time. Fra 1 ordre per plukrunde til 8-16 ordrer per tur. Her er hvordan det virker og hvad det kræver.

## Hvad er batch picking?

Batch picking (også kaldet multi-order picking) er en metode, hvor plukker samler varer til flere ordrer på én plukrunde. I stedet for at gå en komplet rute for én ordre, kombineres 8-16 ordrer til ét samlet pluk.

**Processen:**
1. WMS-systemet grupperer ordrer i en batch (typisk 8-16)
2. Systemet beregner optimal plukrute for hele batchen
3. Plukker følger én rute og plukker til alle ordrer
4. Varer sorteres til korrekte ordrer ved pakkestationen

**Alternativ: Zone picking**
Lager opdeles i zoner. Plukker er ansvarlig for én zone og plukker kun varer fra sin zone til alle ordrer.

## Hvad kræver det teknisk?

**Minimum:**
- WMS med batch-picking funktion
- Picking-trolley eller picking-vogn med separate rum
- Klart lokationssystem (A/B/C-numre)

**Optimalt:**
- Scanning for verifikation per pluk
- Digital pluk-liste på scanner/tablet (ikke papir)
- Sorteringstation ved pakning

## Effekt af batch picking

| Metode | Picks/time | Vandredistance |
|--------|-----------|----------------|
| Enkeltordre-pluk | 55-70 | 100% |
| Batch picking (8 ordrer) | 85-100 | 40-50% |
| Batch picking (16 ordrer) | 95-110 | 25-35% |

Kilde: Industri-benchmarks 2025. SmartPack-optimerede lager med batch picking: 110+ picks/time.

**Forklaring:** Rejsetid udgør 40-60% af pluk-tid. Batch picking reducerer rejsetid per pluk markant fordi du plukker mere per runde.

## Hvornår er batch picking det rigtige valg?

Batch picking er optimalt, når:
- Over 100 ordrer/dag med mere end 2 linjer per ordre i gennemsnit
- Sortiment giver overlap (mange ordrer deler SKU'er)
- Lager har struktureret lokationssystem
- WMS understøtter batch-planlægning

Batch picking er **ikke** optimalt for:
- Store ordrer med mange linjer (bedre med zone picking)
- Meget store og tunge varer der svært kan sorteres
- Under 50 ordrer/dag (gevinsten er begrænset ved lav volumen)

## Typiske fejl

1. **Implementerer batch picking uden scanning** – Uden scanning stiger fejlraten markant ved batch picking, da det er nemmere at plukke til forkert ordre.

2. **For stor batch-størrelse** – Over 20 ordrer per batch bliver sortering ved pakkestationen en flaskehals.

3. **Ignorerer zoneinddeling** – Batch picking kombineret med zone-layout giver størst gevinst. De to er synergistiske.

## Sådan gør du det rigtigt

1. **Start med 8-ordrer-batches** – Det er den størrelse med bedst balance mellem pluk-effektivitet og sorteringskompleksitet.

2. **Brug picking-vogn med separat rum per ordre** – Det gør sortering triviel og eliminerer fejl.

3. **Kombinér med ABC-layout** – A-varer i A-zone nær pakkestation. Batch picking i A-zone er ekstremt effektivt.

## SmartPack understøttelse

SmartPack beregner automatisk optimale batches baseret på orden-overlap, lokation og rækkefølge. Du behøver ikke at planlægge batches manuelt – systemet genererer plukruter og batch-grupper i realtid. Direkte integration med scanning-hardware sikrer fejlfri batch-pluk.

## FAQ

**Kan jeg gøre batch picking uden WMS?**
I meget simpel form med papir-batches og god disciplin. Men fejlrate er høj. For systematisk batch picking er WMS nødvendigt.

**Hvad er wave picking?**
Wave picking er en variant, hvor ordrer frigives i planlagte "bølger" (fx alle ordrer til PostNord-cutoff samles i én wave). Det optimerer workflow mod forsendelsesdeadlines.

**Hvad er zone picking kombineret med batch?**
Zone-batch picking: plukker i sin zone behandler alle ordrer i en batch, der har varer i zonen. Ordren "zig-zagger" ikke gennem hele lageret.

**Hvad er gennemsnitlig ordrelinjer per ordre for dansk e-commerce?**
Typisk 1,5-2,5 linjer per ordre for B2C. Det er tilstrækkeligt til at batch picking giver markant gevinst.

**Hvad er picks/time industri-benchmark 2025?**
102 picks/time er industri-gennemsnit. Med SmartPack og optimeret batch picking: 110+.

