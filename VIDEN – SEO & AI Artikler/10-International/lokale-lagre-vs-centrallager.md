---
primary_keyword: lokale lagre vs centrallager
secondary_keywords: [centraliseret vs distribueret lager, hub-and-spoke lager, lagerstrategi international, centrallager fordele]
cluster: 10-International
---

# Lokale lagre vs. centrallager: Hvornår skal du splitte?

Ét stort lager der serverer alle markeder, eller lokale lagre tæt på kunderne. Begge har store fordele og klare ulemper.

Konkret: en dansk webshop med 800 ordrer/måned (500 DK, 300 DE) sender alt fra DK-lager. Tysk fragtomkostning: 62 kr./ordre. Leveringstid: 2-3 dage. Tysk konverteringsrate: 2,1%. De åbner tysk 3PL. Fragtomkostning: 39 kr./ordre. Leveringstid: 1 dag. Tysk konverteringsrate stiger til 2,8% (+33%). Ekstra omsætning: 150.000 kr./år. Fragtbesparelse: 82.800 kr./år. 3PL-omkostning: 54.000 kr./år. **Netto gevinst: 178.800 kr./år.**

## Centrallageret: fordele og ulemper

**Fordele:**
- Enkelt at styre – ét lager, ét system, ét team
- Ingen lagerspredning – alle varer til alle kunder, ingen split af beholder
- Lavere lagerbindingskapital (ingen sikkerhedslagre per lokation)
- Én compliance-jurisdiction (moms, LUCID, osv.)
- Enklere genopfyldning fra leverandør

**Ulemper:**
- Højere fragtomkostning til fjerne markeder
- Længere leveringstid til internationale kunder
- Alt-i-ét risiko: lager ned = alt ned
- Fragtomkostning som % af AOV stiger med distance

## Lokale lagre: fordele og ulemper

**Fordele:**
- Hurtigere leveringstid til lokale kunder
- Lavere fragtomkostning per forsendelse
- Lokale pakkeshop-netværk tilgængelige
- Redundans: ét lager néde = de andre kører videre

**Ulemper:**
- Lagerspredning: mere sikkerhedslager nødvendigt
- Højere bindingskapital
- Momsregistrering i hvert land med lager
- LUCID (DE), Citeo (FR) og andre EPR-krav
- WMS-kompleksitet: multi-location inventory
- Dyrere at opsætte og drifte

## Når skal du gå fra centralt til lokalt?

**Multi-warehouse triggers:**
- Kapacitet på centrallager overstiger 85%
- OTD til et specifikt marked falder under 95%
- Fragtomkostning til et marked overstiger 8% af AOV
- Leveringstid til marked er 4+ dage (vs. konkurrenternes 1-2)

**Tommelfingerregel:** når du når 300-500 ordrer/måned til et specifikt land, er lokal 3PL værd at beregne.

## Beregningsmodellen: hvornår er lokalt lønnsomt?

**Break-even beregning:**

Ekstra omkostning ved lokalt lager:
- 3PL-gebyr: pick-and-pack + lager = 50-80 kr./ordre
- Lagerbindingskapital: 15-20% ekstra sikkerhedslager
- Compliance (moms, LUCID): 5.000-20.000 kr./år

Besparelse ved lokalt lager:
- Fragtbesparelse: 20-40 kr./forsendelse
- Øget konvertering pga. højere OTD og kortere leveringstid

**Eksempel:**
- 500 ordrer/måned til DE
- Fragtbesparelse: 25 kr./ordre = 12.500 kr./måned
- 3PL ekstraomkostning: 15 kr./ordre = 7.500 kr./måned
- Netto: 5.000 kr./måned = 60.000 kr./år positiv effekt PLUS konverteringsgevinst

## Hvad det koster IKKE at splitte (når threshold er nået)

**Scenarie: 400 ordrer/måned til DE, sender fra DK-lager**

**Direkte tab:**
- Ekstra fragtomkostning: 25 kr./ordre × 400 = 10.000 kr./måned = 120.000 kr./år

**Indirekte tab:**
- Leveringstid 2-3 dage vs. konkurrenternes 1 dag
- Konverteringsrate 5-10% lavere (estimat baseret på leveringstidsforventning)
- 10.000 besøgende/måned, konvertering 2,5% vs. 2,8% = 30 tabte ordrer/måned
- 30 × 450 kr. AOV = 13.500 kr./måned = 162.000 kr./år tabt omsætning

**Total omkostning ved IKKE at splitte: 282.000 kr./år**

## Det opdager de fleste for sent

1. **Tysk konverteringsrate 30% lavere pga. 2-3 dages levering**
   - Danske kunder: 1-dags levering, konverteringsrate 3,2%
   - Tyske kunder: 2-3 dages levering, konverteringsrate 2,1%
   - Forskel: 1,1 procentpoint = 34% lavere
   - Tab: 110 ordrer/måned × 450 kr. = 594.000 kr./år tabt omsætning

2. **Fragtomkostning 12% af AOV = urentabelt**
   - AOV til Tyskland: 380 kr.
   - Fragtomkostning DK→DE: 62 kr.
   - Fragtomkostning som % af AOV: 16,3%
   - Grænse for rentabilitet: 8%
   - Du taber penge på hver ordre

3. **Centrallager når kapacitet = alt stopper**
   - Centrallager 85% kapacitet
   - Black Friday: 3x normal volumen
   - Lager kan ikke håndtere volumen
   - Ordrer forsinkes 3-5 dage
   - 25% af kunder annullerer
   - Tab: 200 ordrer × 450 kr. = 90.000 kr. i én uge

## Hub-and-spoke: mellemvejen

Mange virksomheder bruger en hub-and-spoke-model:
- **Hub (centrallager)**: opbevarer fuld sortiment, genopfylder spokes
- **Spokes (lokale lagre)**: fast-moving SKU's til hvert marked

Du sender kun de 20% bedst sælgende SKU'er til lokale lagre og håndterer langt salg fra hub. Det minimerer lagerbindingskapitalen i spokes.

## Typiske fejl

- **Splitter for tidligt** – lav volumen + høj 3PL-pris = negativt regnestykke
- **Splitter for sent** – taber kunder pga. for lang leveringstid
- **Splitter alle SKU'er** – kun fast-moving SKU'er er relevante for lokalt lager
- **Glemmer compliance** – lager i DE = LUCID + tysk moms
- **WMS klar ikke til multi-lager** – oversalg og synkroniseringsfejl

## Sådan gør du det rigtigt

- Analyser volumen per mål-marked før beslutning
- Start med hub-and-spoke (kun fast-movers i lokalt lager)
- Brug 3PL frem for eget lager i udlandet (lavere risk)
- WMS med native multi-location support før du splitter
- Momsregistrering og compliance-overblik før første vare lagres lokalt

## Brug denne artikel: tjekliste

- [ ] Volumen per målmarked beregnet (ordrer/måned)
- [ ] Break-even beregning lavet for potentielle lokale lagre
- [ ] Multi-warehouse triggers evalueret
- [ ] Hub-and-spoke mulighed overvejet
- [ ] WMS kan håndtere multi-location før split

**Næste skridt:** Identificer dit største internationale marked. Beregn fragtomkostning og OTD i dag. Sammenlign med estimeret 3PL-pris i det marked.

## SmartPack understøttelse

SmartPack understøtter hub-and-spoke konfiguration og kan konfigureres til at route fast-movers fra lokale lagre og langt salg fra hub. Real-time saldo-synkronisering sikrer at lagerspredning ikke giver oversalg.

## FAQ

**Hvornår skal man have lokalt lager i et marked?**
Når fragtomkostning overstiger 8% af AOV eller OTD er under 95%, OG du sender 300+ ordrer/måned til markedet.

**Er Amazon FBA et lokalt lager?**
Funktionelt ja. FBA opbevarer dine varer i det relevante land og sender lokalt. Administrativt er det enklere end din egen 3PL.

**Hvad er en 3PL?**
Tredjepartslogistik. En ekstern partner der opbevarer og sender dine varer. Du betaler lagerplads + pick-and-pack + fragt.

**Medfører lager i et EU-land altid momspligt der?**
Ja – opbevaring af varer i et EU-land udløser som udgangspunkt momspligt i det land. OSS kan simplificere B2C-momsafregning.

**Hvad er hub-and-spoke?**
En lagerstrategi med ét centralt lager (hub) og lokale lagre (spokes). Spokes har kun fast-moving SKU'er. Resten sendes fra hub.
