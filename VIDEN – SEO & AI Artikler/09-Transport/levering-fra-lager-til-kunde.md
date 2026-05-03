---
primary_keyword: levering fra lager til kunde
secondary_keywords: [order fulfillment flow, pakkeflow webshop, forsendelsesprocess, lager til dør]
cluster: 09-Transport
---

# Levering fra lager til kunde: Sådan virker hele kæden

Kundens oplevelse af din levering er summen af mange små led. Fra den øjeblik ordren placeres til pakken står på dørtrinnet sker der 12-15 hændelser. En fejl i ét led forsinker eller brækker kunden.

Konkret: en ordre modtaget kl. 14:30 skal plukkes (15 min), pakkes (10 min), etiketteres (2 min), sorteres (5 min) og afhentet af GLS kl. 16:30. Total tid: 32 minutter + buffer. Modtages ordren kl. 15:45, når den ikke med. Det er forskellen mellem afsendelse i dag og i morgen.

## Hvad er fulfillment-kæden?

Fulfillment-kæden er alle trin fra ordremodtagelse til pakken er i kundens hænder:

1. **Ordremodtagelse** – webshop/platform modtager og validerer ordren
2. **Ordreoverførsel** – ordren sendes til WMS (lagersystem)
3. **Ordretildeling** – WMS tildeler ordren til en plukker
4. **Pluk** – varerne hentes fra hylde/lokation
5. **Kvalitetskontrol** – korrekte varer?
6. **Pakning** – varer pakkes, beskrivelsesbrev/faktura lægges i
7. **Etikettering** – fragtetiket printes og klistres på
8. **Sortering** – pakker sorteres per fragtleverandør
9. **Afhentning** – fragtleverandør henter
10. **Depotsort** – fragtleverandørs hub sorterer til rute
11. **Last mile** – pakken køres til kundens adresse eller pakkeshop
12. **Levering** – kunde modtager pakken

## Hvornår går det galt?

De hyppigste fejlpunkter:
- **Ordreoverførsel**: forsinkelse eller fejl i API-integration
- **Pluk**: forkert vare, forkert antal, vare ikke på registreret lokation
- **Etikettering**: forkert adresse, manglende IOSS-nummer til udlandet
- **Fragtleverandørens hub**: forsinkelse ved spidsbelastning
- **Last mile**: ingen hjemme, forkert adresse, leverandør møder hund

## Hvorfor er det vigtigt? Tal og kr.

OTD (On-Time Delivery) er direkte korreleret med:
- **NPS (Net Promoter Score)**: lav OTD = lavere NPS = færre anbefalinger
- **Returnering**: forsinkede leverancer giver 2-3x højere returnering
- **Reklamationer**: hvert reklamationsopkald koster 50-150 kr. i håndteringstid

**Konkret scenarie:**
- 500 ordrer/måned, OTD 92% (8% forsinket) = 40 forsinkede ordrer
- 50% af forsinkede ordrer genererer reklamation = 20 opkald à 100 kr. = 2.000 kr./måned
- 10% af forsinkede ordrer returneres = 4 returneringer à 300 kr. = 1.200 kr./måned
- 25% af forsinkede kunder køber ikke igen = 10 tabte kunder à 1.200 kr. LTV = 12.000 kr./måned
- **Total omkostning ved 8% forsinkelse: 15.200 kr./måned = 182.400 kr./år**

Ved OTD 98% (2% forsinket):
- 10 forsinkede ordrer = 3.800 kr./måned = 45.600 kr./år
- **Besparelse: 136.800 kr./år**

## Cut-off tid i praksis

**Eksempel: GLS afhenter kl. 16:30**
- Gennemsnitlig pluk + pakketid: 25 minutter
- Buffer til fejlhåndtering: 30 minutter
- Sortering og klar til afhentning: 15 minutter
- **Intern cut-off: 16:30 - 70 min = 15:20**

Ordrer modtaget efter 15:20 afsendes næste hverdag.

**Kommunikér cut-off:**
- På forsiden: "Bestil inden kl. 15:00 – afsendelse i dag"
- I checkout: dynamisk besked "Bestil inden 2 timer 14 minutter for afsendelse i dag"
- I ordrebekræftelse: "Din ordre afsendes [dato]"

## Det opdager de fleste for sent

1. **API-fejl opdages først når kunder ringer**
   - Ordre modtaget i webshop kl. 10:00
   - API-fejl: ordre når aldrig WMS
   - Kunden forventer afsendelse samme dag
   - Kl. 16:00: kunde ringer og spørger til tracking
   - Konsekvens: ordre afsendes dagen efter, kunde utilfreds, 15% returnerer

2. **Cut-off ikke kommunikeret = forkerte forventninger**
   - Kunde bestiller kl. 15:50, forventer afsendelse samme dag
   - Ordre når ikke med i dagens afhentning
   - Tracking viser "afsendes næste hverdag"
   - Kunde føler sig vildledt, 8% returnerer

3. **Manuel etikettering = 3% fejlrate**
   - 500 ordrer/måned, 3% forkert etiket = 15 ordrer
   - 15 × 250 kr. (retur + ny forsendelse) = 3.750 kr./måned = 45.000 kr./år
   - Scan-baseret etikettering reducerer til 0,3% = 41.250 kr./år besparelse

## Hvordan du optimerer hvert led

### Ordreoverførsel
- Brug direkte API-integration, ikke manuel eksport/import
- Opsæt alarmer ved API-fejl
- Monitor latency: ordrer skal være i WMS inden for 5 minutter

### Pluk og pakning
- Brug pluk-router der minimerer gangtid (Zone Picking, Batch Picking)
- Scanner-baseret pluk reducerer fejlrate fra ~3% til under 0,3%
- Standardiserede pakkeprocedurer med fotodokumentation ved tvivl

### Etikettering
- Autoprint af label når ordren er pakket – aldrig printede labels der venter
- Dobbelt-tjek: scan label mod ordre før pakken lukkes
- Korrekte ADR-labels ved farligt gods

### Fragtoverlevering
- Afstemning: antal pakker overleveret = antal labels printet
- Hav scan-kvittering fra fragtleverandør ved afhentning
- Rapporter afvigelser øjeblikkeligt

### Kundekommunikation
- Automatisk afsendelsesbekræftelse med tracking-link
- Proaktiv SMS/e-mail når pakken er på vej til levering
- Klar info om pakkeshop-muligheder

## Typiske fejl

- **Ingen afstemning ved fragtoverlevering** – pakker "forsvinder" på lageret
- **Labels printet på forhånd** – risiko for label på forkert pakke
- **Kun e-mail, ikke SMS** – SMS tracking-notifikation giver højere åbningsrate
- **Ingen alarm på API-fejl** – ordrer sidder fast i webshop og sendes aldrig
- **OTD måles ikke** – du ved ikke om der er et problem før kunderne klager

## Sådan gør du det rigtigt

- Mål OTD månedligt per fragtleverandør og per postnummerzone
- Brug scan-baseret pluk
- Automatisk label-print ved pakkeafslutning (ingen manuelle trin)
- Proaktiv kundekommunikation ved forsinkelse – ikke reaktiv
- Mål tid fra ordremodtagelse til label-print: mål < 2 timer

## Brug denne artikel: tjekliste

- [ ] API-integration mellem webshop og WMS bekræftet (ingen manuel overførsel)
- [ ] Scan-baseret pluk implementeret
- [ ] Automatisk label-print ved pakkeafslutning
- [ ] Afstemning af pakker ved fragtoverlevering
- [ ] Automatisk tracking-notifikation til kunder
- [ ] OTD-rate målt og rapporteret månedligt

**Næste skridt:** Kortlæg dit faktiske flow trin for trin. Identificer det ene trin der oftest skaber forsinkelse eller fejl. Fiks det først.

## SmartPack understøttelse

SmartPack styrer hele fulfillment-flowet fra ordremodtagelse til fragtoverlevering. Automatisk label-print, scan-baseret pluk, afstemning og kundekommunikation er integrerede i systemet. OTD-måling er indbygget i standard-dashboardet.

## FAQ

**Hvad er OTD?**
On-Time Delivery – andelen af forsendelser der leveres inden for den lovede leveringstid. Mål: >95%.

**Hvad er den typiske tid fra ordremodtagelse til afsendelse?**
For velfungerende lager: under 4 timer. Best-in-class: under 2 timer.

**Hvad gør man når en pakke "forsvinder"?**
Tjek om label er scannet ved fragtoverlevering. Reklamation til fragtleverandør med booking-nummer inden 7 dage.

**Er API-integration nødvendigt?**
For mere end 20 ordrer/dag er manuel overførsel en fejlkilde og tidsspilde. API-integration anbefales.

**Hvad er last mile?**
Det sidste led i leveringskæden – fra fragtleverandørens lokale depot til kundens adresse. Det er det dyreste og mest fejlbehæftede led.
