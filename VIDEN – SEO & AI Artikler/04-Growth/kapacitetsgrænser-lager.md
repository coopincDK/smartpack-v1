---
primary_keyword: kapacitetsgrænser lager
secondary_keywords: lager kapacitet beregning, lager max kapacitet, kapacitet lager analyse, lagerkapacitet optimering
cluster: 04-Growth
article_type: vaekst
---

# Kapacitetsgrænser på lageret – kend dem før du rammer dem

De fleste opdager deres kapacitetsgrænse ved at ramme den.
Typisk en tirsdag i uge 46.
Black Friday-ordrerne tikker ind.
Systemet knækker.

Dag 1: 680 ordrer sendt, 760 i backlog.
Dag 2: 1.680 ordrer i kø.
Dag 3: Fejlrate 4,8%.

1.413.600 kr. tabt på 5 dage.

Det er ikke Black Friday der kostede dig pengene.
Det er det tal du aldrig beregnede:
Max ordrer/dag med nuværende bemanding.

En virksomhed der kender sine grænser kan planlægge.
En der ikke kender dem, reagerer.

## Kort svar

> Kapacitetsgrænsen på lageret er punktet, hvor personale-, system- eller fysisk kapacitet ikke kan følge med ordrervolumen – beregn dit max-antal ordrer/dag, inden du rammer det.

## Hvad er kapacitetsgrænser?

Kapacitetsgrænsen er det punkt, hvor lageret ikke kan behandle flere ordrer uden at kvaliteten eller hastigheden falder. Det er ikke kun et fysisk spørgsmål om areal – det er et system af tre flaskehalse:

1. **Fysisk kapacitet** – Kvadratmeter, reoler, plukkegange
2. **Personalekapacitet** – Antal medarbejdere × picks/time
3. **Systemkapacitet** – WMS-kapacitet, integrationshastighed, scanningsudstyr

Alle tre kan udgøre flaskehalsen. Typisk er personalekapaciteten det første begrænsende led.

## De tre kritiske breakpoints

| Grænse | Tegn | Løsning |
|--------|------|---------|
| 50 ordrer/dag | Manuelt system fejler | Implementér WMS |
| 200 ordrer/dag | Enkelt plukrute utilstrækkelig | Batch picking, zoneinddeling |
| 500 ordrer/dag | Enkelt WMS utilstrækkeligt | Automatisering, fuld tech-stack |

**Bemærk:** Du rammer typisk symptomerne 2-3 måneder, inden du erkender at grænsen er nået.

## Beregn din personalekapacitet

**Formel:**
```
Max ordrer/dag = Antal plukmedarbejdere × 102 picks/time × 7 arbejdstimer ÷ Gennemsnitlig linjer per ordre
```

**Eksempel:**
- 3 plukmedarbejdere × 102 picks/time × 7 timer = 2.142 picks/dag
- Gennemsnit 2 linjer per ordre → 2.142 ÷ 2 = **1.071 ordrer/dag kapacitet**

Det er den teoretiske grænse. I praksis: tilføj 20% buffer for pauser, fejl og variationer.

**Realistisk kapacitet: 857 ordrer/dag.**

## Hvornår nærmer du dig grænsen?

Signaler at du er på 80%+ af kapaciteten:
- Regelmæssig overtid for at nå ordrer
- Plukkefejlrate stiger (over 1%)
- Picks/time falder fra 102 mod 80
- Ordrer ryger til næste dag regelmæssigt

Regn med at ramme grænsen fuldt ud om 6-8 uger, når du ser to af disse signaler.

## Konsekvenser af overskridelse

**Regnestykke: Lager ved 420 ordrer/dag, kapacitet 400 ordrer/dag**

**Uge 1 (105% kapacitet):**
- Overtid: 3 timer/dag × 5 dage × 300 kr. = 4.500 kr.
- Fejlrate stiger fra 0,8% til 1,6%
- Ekstra fejlomkostning: 0,8% × 420 ordrer × 5 dage × 450 kr. = 7.560 kr.
- **Total: 12.060 kr.**

**Uge 4 (105% kapacitet vedvarende):**
- Medarbejdere udbrugne. 1 sygemelding.
- Kapacitet falder til 350 ordrer/dag (mangler 1 person).
- Backlog: 70 ordrer/dag × 5 dage = 350 ordrer forsinket
- Forsinkelsesklager: 28% af forsinkede = 98 klager
- Kundeservice-cost: 98 × 180 kr. = 17.640 kr.
- Tabte kunder: 12% af forsinkede = 42 kunder × 2.400 kr. LTV = **100.800 kr.**
- **Total uge 4: 118.440 kr.**

**Måned 3 (vedvarende overkapacitet):**
- 2 medarbejdere siger op (udbrugne)
- Rekruttering: 2 × 40.000 kr. = 80.000 kr.
- Onboarding 2 uger per person = 4 uger reduceret kapacitet
- **Tabt: 340.000 kr. i fejl, forsinkelser, rekruttering**

**Hvis du havde handlet i uge 1:**
- Ansæt 1 ekstra plukker: Cost 35.000 kr./md
- Kapacitet øges til 530 ordrer/dag
- Ingen overtid, ingen udbrugne medarbejdere, ingen backlog
- **Spart: 305.000 kr. over 3 måneder**

## Det opdager de fleste for sent

1. **At I kører på 100% kapacitet som "normal" – uden buffer** – Webshop ved 380 ordrer/dag. Kapacitet: 385 ordrer/dag. "Det går jo fint." Uge 42: Marketingkampagne. Ordrer stiger til 480/dag. Resultat: Totalt sammenbrud. Backlog 95 ordrer dag 1. 190 ordrer dag 2. Fejlrate 3,8%. Dag 4: Stopper kampagnen. Tabt omsætning: 280.000 kr. + fejlomkostninger 87.000 kr. = **367.000 kr. tabt på 4 dage**. Problemet: Ingen buffer. Normal kapacitetsudnyttelse skal være 75% – ikke 100%.

2. **At I ikke kender jeres kapacitet – så I kan ikke planlægge** – Webshop ved 220 ordrer/dag. Aldrig beregnet kapacitet. Black Friday: 1.320 ordrer (6×). Antager de kan håndtere det. Reel kapacitet: 280 ordrer/dag max. Resultat: 5 dages backlog. Fejlrate 4,2%. 87 kundeklager. Cost: 420.000 kr. Hvis de havde kendt kapaciteten: Kunne have aktiveret 3PL-overløb for 800 ordrer. Cost: 22 kr./ordre × 800 = 17.600 kr. **Forskel: 402.400 kr.** Det er prisen for ikke at kende ét tal.

3. **At systemet er flaskehalsen – ikke personalet** – Webshop ved 340 ordrer/dag. 5 plukkere. Kapacitet burde være 500+ ordrer/dag. Men: WMS kan kun håndtere 350 ordrer/dag (gammel server, langsom integration). Plukkere venter 2-3 minutter mellem hver batch på at systemet loader. 2,5 min × 40 batches/dag × 5 plukkere = 500 minutter spildt = 8,3 timer/dag = **415.000 kr./år**. Server-upgrade: 45.000 kr. ROI: 39 dage. Men I troede det var et personaleproblem.

## Typiske fejl

1. **Aldrig beregnet kapacitetsgrænsen** – Mange virksomheder kender ikke det tal. Brug formlen ovenfor.

2. **Fokuserer kun på areal** – Lager der ikke er tæt på arealmaksimum kan sagtens have nået personale- eller systemkapaciteten.

3. **Ingen buffer** – Planlæg til 80% kapacitetsudnyttelse som normal. De sidste 20% er buffer til peak og variation.

## Best practice

1. **Kend dit tal** – Beregn din teoretiske max-kapacitet for alle tre led (fysisk, personale, system) én gang om kvartalet.

2. **Sæt alarm ved 75%** – Når du konsistent er over 75% af kapaciteten i en uge, er det tid til at planlægge udvidelse.

3. **Plan B klar** – Hvad aktiverer du, når du rammer 90%? 3PL-overløb, hasteansættelse, midlertidig pausering af kampagner?

## Tjekliste: Kend din kapacitet

- [ ] Kender du max ordrer/dag med nuværende bemanding?
- [ ] Er du under 80% af kapaciteten i normalperiode?
- [ ] Har du plan for hvad du gør ved 90%?
- [ ] Er dit WMS skaleret til næste kapacitetsniveau?

## Hvornår skal du handle?

**Nu** hvis du konsistent er over 85% kapacitet.

**Inden 4 uger** hvis du nærmer dig peak season uden at kende din kapacitet.

**Planlæg nu** hvis marketing planlægger kampagner uden at kende lagerkapacitet.

## Sådan understøtter SmartPack det

**JA til SmartPack hvis:**
- I kender ikke jeres kapacitet → Dashboard viser realtid picks/time vs. kapacitet = undgå 402.400 kr. tab (scenarie 2)
- Kører over 85% kapacitet → Systemet advarer når I nærmer jer grænsen = undgå 367.000 kr. tab (scenarie 1)
- Systemet er flaskehalsen → SmartPack skaleret til 10.000+ ordrer/dag = 415.000 kr./år spart (scenarie 3)

**NEJ til SmartPack hvis:**
- Under 50 ordrer/dag + stabil volumen → Manuel tracking billigere
- Allerede under 75% kapacitet + ingen vækst → Ikke akut

**Konkret kr.-konsekvens:**

| Scenarie | Uden SmartPack | Med SmartPack | Forskel |
|----------|----------------|---------------|----------|
| Kører 100% kapacitet (kampagne) | 367.000 kr. tabt på 4 dage | 0 kr. (advarer ved 85%) | **367.000 kr. spart** |
| Kender ikke kapacitet (Black Friday) | 420.000 kr. tabt | 17.600 kr. (3PL-overløb) | **402.400 kr. spart** |
| System-flaskehals (langsom WMS) | 415.000 kr./år tabt | 0 kr. (skaleret system) | **415.000 kr. spart** |

SmartPack viser hvilken af de tre kapacitetsled (fysisk, personale, system) der er flaskehalsen – så I ved hvor I skal handle.

## FAQ

**Hvad er normal kapacitetsudnyttelse?**
60-75% i normalperiode, op til 90% under peak (med forberedelse). Over 90% er et krisetegn.

**Kan jeg øge kapaciteten uden at ansætte?**
Ja. Batch picking alene kan øge picks/time med 20-30%. Layout-optimering og WMS-forbedringer giver yderligere 10-15%.

**Hvad er industri-benchmark for picks/time?**
102 picks/time (2025). SmartPack-optimerede lager rammer 110+.

**Hvornår er det tid til at flytte til større lager?**
Når du konsistent er over 85% af det fysiske areals kapacitet, og alle andre optimeringsmuligheder er udtømt.

**Hvad koster det at overskride kapaciteten i en uge?**
Estimeret: 15-30% stigning i cost per order, plus LTV-tab fra kunder der oplever forringet service.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Hvornår skal du outsource dit lager?](/viden/vaekst/hvornaar-skal-du-outsource-lager)
- [Cost per ordre](/viden/okonomi/cost-per-ordre)
- [3PL vs. eget lager](/viden/beslutning/3pl-vs-eget-lager)
