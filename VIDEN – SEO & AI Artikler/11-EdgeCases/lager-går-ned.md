---
primary_keyword: lagersystem går ned
secondary_keywords: [WMS nedbrud, lager systemfejl, backup løsning nedbrud, lager crisis håndtering]
cluster: 11-EdgeCases
---

# Når lagersystemet går ned: Hvad gør du?

Kl. 10:00: WMS går ned.
Ordrer strømmer ind.
Lageret ser ingenting.

Fragtafhentning kl. 14:00.
200 ordrer skal plukkes.
Ingen system.

Er du forberedt?
Har du en beredskabsplan?

De fleste har ikke.
Og det koster dem 130.000 kr. hver gang det sker.

## Hvad sker der når lagersystemet går ned?

Et WMS-nedbrud kan være:
- Serverfejl eller skyfejl hos leverandøren
- Netværksfejl der afskærer lagerets enheder fra systemet
- Databasekorruption
- Opdatering der løb af sporet
- API-timeout mod webshop eller fragtleverandør

I alle tilfælde: dit lager-team kan ikke tilgå data. Ordrer kan ikke plukkes planmæssigt. Labels kan ikke printes. Alt stopper.

## Hvornår er det kritisk?

Nedbrud er altid kritisk, men kritikaliteten eskalerer:
- Tager det over 30 minutter: du nærmer dig cut-off. Ordrer plukkes ikke i tide.
- Tager det over 2 timer: du mislykkes sandsynligvis at nå fragtafhentning
- Tager det over 4 timer: kunder modtager ikke pakker som lovet – klager begynder

## Hvad det koster

For en webshop med 100 ordrer/dag:
- 4 timers nedbrud = ~17 ordrer der mislykkes levering
- 17 ordrer à 150 kr. direkte fragtomkostning + håndtering = 2.500 kr.
- Plus tab af kundetillid og potentielle negative anmeldelser

## Disaster Recovery: Hvad du gør

### 1. Kommunikér straks internt
- Alarm til lager-team: STOP pluk-aktiviteter der afhænger af systemet
- Alarm til kundeservice: forvent forsinkede leverings-spørgsmål
- Alarm til IT/WMS-support: start fejlsøgning

### 2. Aktivér fallback-procedure
**Minimum fallback:**
- Eksportliste fra webshop (ordrer modtaget i dag) printes eller åbnes på tablet
- Plukning gøres manuelt baseret på ordrelisten
- Labels printes fra fragtleverandørens egne webportaler (GLS-portal, PostNord webservice)

**Krav for at det virker:**
- Adgang til webshoppens orderlængde (browser-baseret, fungerer uden WMS)
- Aktøre login til fragtleverandørens webportal
- Printet lagerkort / hyllemap (fysisk backup)

### 3. Dokumenter alt
- Tidsstempel på nedbrud
- Alle manuelle handlinger dokumenteret (hvad ble v plukket, hvad blev sendt)
- Lagerjusteringer nøteret til manuel korrektion når system er oppe

### 4. Kommunikér til kunder (proaktivt)
Er forsinkelse uundgåelig: send proaktiv e-mail til pågældende kunder INDEN de klager.

### 5. Genopsætning
- Når system er oppe: gennemgå alle manuelle handlinger
- Opdater lagersaldi korrekt
- Bekræft at alle ordrer er afsendt eller omdisponeret

## Forebyggelse: Beredskabsplan

- Dokumenteret fallback-procedure (printet, ikke kun på systemet der er nede)
- Løbende backup af ordredata (webshop kan altid eksportere uafhængigt af WMS)
- Test fallback-procedure kvartålsvist (simuler nedbrud i 30 minutter)
- WMS med SLA (Service Level Agreement): leverandøren garanterer oppetid og responstid
- Cloud-baseret WMS: bedre oppetid end on-premise

## Typiske fejl

- **Ingen beredskabsplan** – team fryser når systemet går ned
- **Fallback-procedure kun i systemet der er nede** – ingen kan tilgå den
- **Ingen adgang til fragtportal** – kan ikke printe labels manuelt
- **Ingen kommunikation til kunder** – klager opstår inden du når at reagere
- **Manglende dokumentation** – lagersaldi ude af sync når system er oppe igen

## Sådan gør du det rigtigt

- Beredskabsplan på papir (fysisk print, læsbar uden system)
- Kvartårlig test af fallback-procedure
- WMS-leverandør med minimum 99,5% oppetid SLA
- Direkte kontakt til WMS support – ikke kun ticketsystem
- Proaktiv kundekommunikation inden 2 timer ved uundgåelig forsinkelse

## Brug denne artikel: tjekliste

- [ ] Beredskabsplan dokumenteret og udskrevet (papirkopi på lageret)
- [ ] Adgang til fragtportal (GLS, PostNord) – login og guide på plads
- [ ] Webshop-ordreeksport-procedure dokumenteret
- [ ] Nivå 1/2/3 eskalationsplan (hvem ringer hvornår)
- [ ] Kvartårlig nedbrudtest planlagt

**Næste skridt:** Skriv en 1-sides beredskabsplan i dag. Test den ved at simulere 30 minutters nedbrud om 2 uger.

## SmartPack understøttelse

SmartPack kører som cloud-baseret SaaS med 99,9% SLA og geografisk redundans. Ved kortvarigt nedbrud bevares alle påbegyndte ordrer og genoptages automatisk. Mobile offline-mode tillader pluk uden netværksforbind else i begrænset periode.

## FAQ

**Hvad gør jeg når WMS er nede og fragtafhentning er om 1 time?**
Aktiver fallback: eksport ordreliste fra webshop, pluk manuelt, print labels fra fragtportal. Dokumenter alt til manuel lageropdatering når WMS er oppe.

**Skal man have backup-WMS?**
For de fleste små-mellemstore webshops er en dokumenteret manuel fallback tilstrækkelig. For store webshops med 500+ ordrer/dag kan et hot-standby system være relevant.

**Hvad er et SLA?**
Service Level Agreement – kontraktuel garanti for oppetid og reaktionstid fra WMS-leverandøren. Kræv minimum 99,5% månedlig oppetid.

**Hvad er det første du gør når WMS går ned?**
Kommunikér internt, aktiverér beredskabsplan, kontakt WMS-support. Parallelopgaverne køres sidefløbende.

**Hvad gør man med ordrer der måske er plukket delvist?**
Dokumenter alt manuelt under nedbruddet. Når systemet er oppe: afstem manuelt mod systemets forventede data og korriger.

