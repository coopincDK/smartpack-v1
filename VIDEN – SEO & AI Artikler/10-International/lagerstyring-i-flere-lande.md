---
primary_keyword: lagerstyring i flere lande
secondary_keywords: [multi-country warehouse, lagerstyring internationalt, international lager webshop, EU-lager]
cluster: 10-International
---

# Lagerstyring i flere lande: Hvad kræver det og hvornår er det den rigtige beslutning?

At sende fra ét centralt lager til alle kunder i Europa virker enkelt. Og for mange webshops er det det rigtige svar i lang tid. Men når du rammer 300+ ordrer/måned til et specifikt marked, ændres regnestykket.

Konkret: en dansk webshop sender 400 ordrer/måned til Tyskland fra DK-lager. Fragtomkostning: 58 kr./ordre. Leveringstid: 2-3 dage. De åbner 3PL-lager i Tyskland. Fragtomkostning: 38 kr./ordre (lokal tysk fragt). Leveringstid: 1 dag. Besparelse: 20 kr. × 400 = 8.000 kr./måned = 96.000 kr./år. Plus: konverteringsrate stiger 8% pga. hurtigere levering.

## Hvad er multi-country lagerstyring?

Multi-country lagerstyring er når du aktivt opbevarer og sender varer fra lagre i mere end ét land. Det kan være:
- Dit eget lager i DK + 3PL-lager i DE
- FBA-lagre i flere EU-lande (Amazon)
- Lokale 3PL-partnere i hvert marked

Det er forskelligt fra at bare sende internationalt fra ét lager. Multi-country lagerstyring betyder at du har lokale lagerbeholdninger du skal styre.

## Hvornår er det relevant?

**Multi-warehouse triggers – overvej flyt når:**
- Kapacitet på primært lager overstiger **85%**
- OTD (On-Time Delivery) falder under **95%** på internationale forsendelser
- Fragtomkostning til et specifikt marked overstiger **8% af AOV**
- Leveringstid til kunder i mål-markedet er 4+ dage

## Hvorfor er det vigtigt? Tal og kr.

Levering fra DK til tyske kunder tager typisk 2-3 hverdage. Fra lokalt tysk lager: 1 dag. I DE er 1-dags levering en kundeforventning – ikke en premium-feature.

**Økonomi:**
- Fragtomkostning DK→DE: 55-75 kr. per pakke (GLS/DHL international)
- Fragtomkostning internt i DE: 35-45 kr. per pakke (lokal tysk fragtaftale)
- **Besparelse: 20-30 kr. per ordre**

**Break-even beregning:**
- 400 ordrer/måned til DE
- Fragtbesparelse: 25 kr./ordre × 400 = 10.000 kr./måned
- 3PL-omkostning (pick-and-pack + lager): 15 kr./ordre × 400 = 6.000 kr./måned
- **Netto besparelse: 4.000 kr./måned = 48.000 kr./år**
- Plus: konverteringsrate stiger estimeret 5-10% pga. 1-dags levering

## Det opdager de fleste for sent

1. **Momspligt i Tyskland når du har lager der**
   - Du åbner 3PL-lager i Tyskland
   - Du er nu momspligtig i Tyskland
   - Skal registrere tysk moms, indberette månedligt
   - Omkostning: 15.000-25.000 kr./år i revisorhjælp
   - Alternativ: EU OSS-ordning kan simplificere

2. **LUCID-pligt i Tyskland opdages først ved salgsstop**
   - Du sender varer til tysk lager
   - LUCID-registrering mangler (emballagepligt)
   - Amazon/marketplace stopper dit salg
   - Tab: 400 ordrer/måned × 450 kr. AOV = 180.000 kr./måned tabt omsætning
   - Løsning: LUCID-registrering tager 2-4 uger

3. **Oversalg pga. lagerspredning**
   - 100 stk. af en vare – 50 på DK-lager, 50 på DE-lager
   - To ordrer modtages samtidigt til tyske kunder
   - WMS'et router begge til DE-lager
   - Systemet synkroniserer ikke i realtid
   - Begge ordrer godkendes – oversalg
   - Én kunde får "udsolgt"-besked 2 dage senere
   - Tab: 450 kr. ordre + 200 kr. goodwill = 650 kr.
   - Ved 5 oversalg/måned: 39.000 kr./år

## Kompleksiteten: hvad du forpligter dig til

Multi-country lager er ikke gratis kompleksitet:

### Momspligt i nye lande
Har du lager i Tyskland, er du momspligtig i Tyskland. Du skal registrere dig til tysk moms, indberette månedligt og følge lokale regler.

Alternativt: EU OSS-ordningen dækker moms på B2C-salg hvis du er over threshold (10.000 EUR på tværs af EU).

### LUCID og lokale EPR-krav
Lager i DE = pligt til LUCID-emballageregistrering (se artikel om LUCID). Lager i FR = Citeo.

### Lagerstyring-kompleksitet
Du har nu to (eller flere) lagersaldi du skal styre synkront. Oversalg er en reel risiko når lager er fordelt.

### Toldprocedurer
For forsendelse fra DK-lager til EU-lager: det er en intern EU-flytning (ingen told), men det er en Intrastat-udførsel. For flytning til UK-lager: eksportdokumentation kræves.

## Praktisk opsætning

### Option A: Amazon FBA Multi-Country Inventory
Amazon placerer dine varer på lagre i DE, FR, IT, ES automatisk. Enkelt at starte. Høje gebyrer. God løsning til at teste markedet.

### Option B: 3PL i mållandet
Find en tredjepartslogistikudbyder (3PL) i mållandet. De modtager varer fra DK, opbevarer og sender lokalt. Du betaler lagergebyr + pick-and-pack + fragt.

**Vælg 3PL når**: du sender 300+ ordrer/måned til mållandet.

### Option C: Eget lager
Kun relevant ved meget høj volumen (2.000+ ordrer/måned i mållandet) eller værdikæderne kræver det.

## Typiske fejl

- **Skaler for tidligt** – 3PL-lager i DE med 50 ordrer/måned er urentabelt
- **Ingen WMS-integration** – manuelt lagerflow mellem to lande er en fejlkilde
- **Glemmer momsregistrering** – lager i et nyt EU-land udløser momspligt
- **Lager opdeles ikke korrekt i WMS** – oversalg fra det ene lager
- **LUCID/EPR glemmes** – lager i DE koster LUCID-pligt

## Sådan gør du det rigtigt

- Test med FBA eller 3PL før eget lager
- WMS der håndterer multi-location inventory i realtid
- Momsregistrering ordnet før første forsendelse fra nyt lager
- Lagerpolitik: hvad sendes fra hvilket lager (routing-regler)
- Mål fragtomkostning og OTD per lager-destination-kombination månedligt

## Brug denne artikel: tjekliste

- [ ] Multi-warehouse-triggers vurderet (kapacitet, OTD, fragt%, leveringstid)
- [ ] Momskonsekvenser afklaret for hvert målland
- [ ] LUCID/Citeo-krav vurderet
- [ ] WMS-løsning kan håndtere multi-location inventory
- [ ] 3PL-partner identificeret i primært målland

**Næste skridt:** Beregn fragtomkostning og leveringstid til dine top-3 udenlandske markeder i dag. Sammenlign med lokal 3PL-pris i disse markeder.

## SmartPack understøttelse

SmartPack håndterer multi-location inventory med realtids-synkronisering på tværs af lagre. Systemet understøtter routing-regler der sender ordren fra det optimale lager baseret på kundens adresse, lagerniveau og fragtomkostning.

## FAQ

**Hvornår skal man have lager i udlandet?**
Når fragtomkostning fra DK overstiger 8% af AOV til mållandet, eller når leveringstid påvirker konverteringen negativt.

**Er Amazon FBA en god start?**
Ja. Lave opstartsomkostninger og enkel drift. Højere pick-and-pack-gebyrer end dedikeret 3PL ved volumen.

**Hvad er momspligten når man har lager i et andet EU-land?**
Du er momsregistreringspligtig i det pågældende land. EU OSS kan simplificere B2C-momsafregning.

**Hvad er et godt antal ordrer/måned til at retfærdiggøre lokal 3PL?**
Typisk 300-500 ordrer/måned til det specifikke land er et rimeligt minimum.

**Hvad er risikoen ved at have lager i to lande?**
Kompleksitet i lagerstyring, oversalg-risiko og momsadministration. Klar WMS-integration er obligatorisk.
