---
primary_keyword: beholdningsomkostninger lager
secondary_keywords: carrying cost lager, kapitalbinding varelager, lager holding cost, lager finansieringsomkostning
cluster: 05-Economics
article_type: okonomi
---

# Beholdningsomkostninger – hvad det reelt koster at have varer på hylden

2 mio. kr. på lagerhylden.
Du tror det er en aktiv.
Det er det ikke.

Det koster dig 500.000 kr./år bare at have det stående.
Kapital. Plads. Svind. Forældelse.

Carrying cost er typisk 20–30% af lagerværdien.
Og de fleste har aldrig regnet det ud.

## Kort svar

> Carrying cost er typisk 20–30% af din lagerværdi per år. 2 mio. kr. på lagerhylden koster dig 500.000 kr./år bare at holde stående. Er din omsætningshastighed under 4× per år, har du sandsynligvis overstock der koster mere end det er værd.

## Hvad er beholdningsomkostninger?

Beholdningsomkostninger er de samlede omkostninger ved at holde varer på lager over tid:

| Komponent | Typisk andel af lagerværdi/år |
|-----------|-------------------------------|
| Kapitalkostning (alternativomkostning) | 6-10% |
| Lagerplads (husleje, el, forsikring) | 3-6% |
| Svind og beskadigelse | 1-3% |
| Håndtering (ind/udflytning, optælling) | 2-4% |
| Forældelse og nedskrivning | 2-8% (afhænger af branche) |
| **Total carrying cost** | **~20-30%** |

**Eksempel:** 2 mio. kr. varelager × 25% carrying cost = **500.000 kr./år** blot for at holde lageret.

## Hvornår er det et problem?

Beholdningsomkostning er et strukturelt problem, hvis:
- Dit varelager er vokset hurtigere end din omsætning (lager/omsætning ratio stiger)
- Din omsætningshastighed er under 4× per år
- Du aldrig har beregnet din carrying cost-rate
- Du har over 10% af lageret med ingen rotation i 90 dage

## Regnestykket

**For hvert 100.000 kr. du reducerer varelager:**
- Frigivet kapital: 100.000 kr.
- Sparet carrying cost: 100.000 × 25% = 25.000 kr./år
- Frigivet lagerplads: ~5-10 m² (afhænger af varedensitet)

**Mål:** Optimér varelager-niveau til at matche salgsmønster, ikke til at undgå stockouts på alle SKU'er.

## Safety stock vs. overstock

Safety stock er den nødvendige buffer mod leveringsforsinkelser og efterspørgselsstigninger. Overstock er alt over det.

**Formel for safety stock:**
```
Safety Stock = Z × σ(demand) × √(Lead Time)
Z = service level faktor (1,65 for 95% service level)
σ(demand) = standardafvigelse i daglig efterspørgsel
Lead Time = leveringstid i dage
```

For de fleste mellemstore e-commerce-virksomheder: safety stock på 7-14 dages salg for A-varer, 14-30 dage for B/C-varer.

## Typiske fejl

1. **Bestiller på "mavefornemmelse"** – "Vi plejer at have 200 på lager" er ikke demand forecasting.

2. **Bruger samme safety stock for alle SKU'er** – A-varer med høj rotation behøver proportionalt lavere safety stock end C-varer med lav og uregelmæssig efterspørgsel.

3. **Aldrig ryddet op i slow movers** – Slow movers akkumulerer carrying cost per dag. Beslut cutoff og liquidér.

## Sådan gør du det rigtigt

1. **Beregn din carrying cost-rate én gang** – Summen af de 5 komponenter delt med lagerværdi. Typisk 20-25%.

2. **Mål lager/omsætning-ratio månedligt** – Det er den hurtigste proxy for om lageret vokser relativt til salg.

3. **Implementér automatisk genbestilling på A-varer** – Fastsæt reorder-punkt og order-quantity baseret på data. Fjern manuelle beslutninger fra rutinekøb.

## SmartPack understøttelse

SmartPack beregner carrying cost per SKU og kategori, viser omsætningshastighed og markerer varer med høj beholdningsomkostning og lav rotation. Systemet understøtter automatisk reorder-punkt og sender varsler ved kritisk lav beholdning – så du minimerer både overstock og stockout.

## FAQ

**Er 25% carrying cost-rate normalt?**
Ja for generel e-commerce. Virksomheder med meget høj svind/forældelse (mode, tech) kan have 30-40%.

**Hvad er forskellen på carrying cost og lagerkostnad?**
Lagerkostnad (CPO) er per behandlet ordre. Carrying cost er per år per kr. varelager holdt. De to er komplementære, ikke det samme.

**Kan jeg reducere carrying cost uden at reducere serviceniveau?**
Ja. Bedre demand forecasting reducerer overstock (og dermed carrying cost) uden at påvirke safety stock og service level.

**Hvad er lager/omsætning-ratio benchmark?**
For B2C e-commerce: 10-15% er godt. Over 20% er tegn på overstock.

**Hvad er ROI på bedre demand forecasting?**
Typisk 10-20% reduktion i varelager-niveau, mens service level fastholdes. Det er direkte frigivet kapital og reduceret carrying cost.

## Læs også

- [Lageromsætningshastighed](lageromsætningshastighed.md)
- [Skjulte lageromkostninger](skjulte-lageromkostninger.md)
- [Samlede lageromkostninger](lageromkostninger-beregning.md)
- [3PL vs. eget lager](../07-Decision/3pl-vs-eget-lager.md)

