---
primary_keyword: oversolgte varer webshop
secondary_keywords: [oversalg håndtering, out of stock situation, solgt mere end lageret, oversold product]
cluster: 11-EdgeCases
---

# Oversolgte varer: Hvad gør du når du har solgt mere end du har?

50 ordrer.
12 varer på lager.

Kampagnen performede.
Synkroniseringen haltede.
Webshop'en solgte videre.

Kunderne har betalt.
Du kan ikke levere.

Hvad gør du?
Hvem får varen?
Hvem får refusion?

Oversalg er ikke et "hvis" — det er et "hvornår".

## Hvad forløser oversalg?

**Tekniske årsager:**
- Lagersaldo ikke synkroniseret i realtid mel lem WMS og webshop
- Webshop-cache viser foreltædet saldo (opdateres ikke hurtigt nok)
- Systemfejl i API-integration mel lem WMS og webshop
- Ordre modtaget imens ordrebekræftelse processeres (race condition)

**Operationelle årsager:**
- Vare registreret på to placeringer, begge tælles – faktisk kun én
- Returnering registreret fært på lager men varen er faktisk defekt
- Phantom inventory (varer er ældre saldo der aldrig er fjernet)

## Hvad gør du straks når det opstår?

### Trin 1: Stop yderligere salg
- Sæt produktet ud af lager (saldo = 0) PÅ ALLE salgskanaler: webshop, Amazon, eBay
- Gmær dette inden for 10 minutter efter opdagelse

### Trin 2: Kortlæg omfanget
- Hvd er den reelle saldo?
- Hvor mange ordrer er modtaget over saldo?

### Trin 3: Prioritering
Hvorvidt prioriterer du?
- **FIFO (først-ind-først-ud)**: de første ordrer får varen
- **Ordreværdi**: største ordrer fuldføres
- **Kundehistorik**: loyale kunder prioriteres

FIFO er den etisk og juridisk sikreste tilgang.

### Trin 4: Kommunikér straks til påvirkede kunder
**Skabelon-kommunikation:**
> "Vi beklager – pga. [teknisk fejl / ekstraordinær efterspørgsel] kan vi desværre ikke levere [produkt] inden for den forventede tid. Vi tilbyder dig: (1) Fuld refusion straks, (2) Levering når vi modtager ny forsyning [dato], (3) Alternativt produkt."

Vær konkret om hvornår de får varen eller pengene tilbage. Vage løfter gør det værre.

### Trin 5: Hasteorden af ny forsyning
Kontakt leverandør straks. Er der mulighed for express-levering? Lokal alternativ leverandør?

### Trin 6: Refunder ikke-effektuerede ordrer
Inden for 24 timer – ikke længere. Jo hurtigere refusion, jo lavere chargeback-risiko.

## Forebyggelse: Teknisk og operationel

### Realtids-synkronisering
Webshop og WMS skal synkronisere saldo i realtid (ikke batch-opdatering hver 15. minut). En ordre der modtages i mellemtiden kan give oversalg.

### Buffer-saldo
Sæt en saldo-buffer: webshop viser "få tilbage" når saldo når 3, og lukker salg ved saldo = 1 (i stedet for 0).

### Multi-kanal aggregering
Er du på multiple kanaler: Amazon, webshop, Zalando – alle trækker fra samme saldo. WMS skal aggregere realt ids og sænke salgskanal-saldo ved ordremodtagelse på en hvilken som helst kanal.

## Typiske fejl

- **Langsom kanallukning** – 10 minutters ventetid mens andre ordrer strømmer ind
- **Batch-saldo-synkronisering** – realtid er obligatorisk
- **Kommunikation forsinkes** – kunder opdager selv at varen er udsolgt når de spørger
- **Refusion tages ikke straks** – øger chargeback-risiko
- **Ingen root-cause-analyse** – det sker igen og igen

## Sådan gør du det rigtigt

- Realtids WMS-webshop saldo-synkronisering (< 30 sekunder)
- Saldo-buffer (saldo vises -2 fra faktisk saldo på salgskanal)
- Kommunikation til påvirkede kunder inden for 2 timer
- Refusion inden for 24 timer
- Root-cause-analyse efter hvert oversalg-incident

## Brug denne artikel: tjekliste

- [ ] Saldo-synkroniseringshastighed mel lem WMS og webshop verificeret (<30 sek.)
- [ ] Saldo-buffer konfigureret på salgskanaler
- [ ] Kommunikations-skabelon for oversalg klar
- [ ] Refusionsprocedure dokumenteret og tidsfrist sat (maks 24 timer)
- [ ] Root-cause-analyse procedure på plads

**Næste skridt:** Test synkroniseringshastighed: reducer en vare til saldo 0 i WMS. Hvad sker der på webshopen? Hvor lang tid tager det før den vises som udsolgt?

## SmartPack understøttelse

SmartPack synkroniserer lagersaldo i realtid på tværs af alle salgskanaler. Konfigurbar buffer-saldo og automatisk kanal-lukning ved konfigureret minimumsaldo.

## FAQ

**Er jeg juridisk forpligtet til at levere ved oversalg?**
En ordre er typisk en bindende aftale når den er bekræftet. Kan du ikke levere, må du refundere og evt. tilbyde kompensation. Forbrugerklagenmævnet vurderer ud fra konkrete omstændigheder.

**Hvad er en saldo-buffer?**
En margin mel lem WMS-saldo og hvad salgskanalen viser. F.eks. WMS har 5 stk, kanal viser 3 stk. Reducerer risiko for oversalg ved spidsbelastning.

**Hvad er en race condition?**
Når to ordrer modtages simultant på den sidst tilgmængelige vare. Begge bekræftes før systemet når at opdatere saldo. Løses med atomic inventory reservation i WMS.

**Hvad er chargeback-risiko?**
Kunden beder banken om at annullere betalingen. Højere risiko når refusion forsinkes. Chargebacks koster 100–200 kr. i gebyr plus tab af indtægten.

**Skal man informere om oversalg på produktsiden?**
Ja – når du opdager oversalg, luk salget øjeblikkeligt på alle kanaler og vis "udsolgt".

