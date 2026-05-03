---
primary_keyword: ordre annulleret under pluk
secondary_keywords: [aflyse ordre igangværende pluk, cancel order picking, ordre stop midt i flow, pluk annullering]
cluster: 11-EdgeCases
---

# Ordre annulleret midt i pluk: Hvad gør du med en pakke der er halvfmærdig?

Tre varer i kurven.
Halvvejs færdig.

Systemet blinker: ORDRE ANNULLERET.

Kunden trykkede annuller.
Betalingen er refunderet.
Men varerne er plukket.

Hvad gør du?
Lægger du dem bare tilbage?
Opdateres saldo?

De fleste ved det ikke.
Og det skaber kaos.

## Hvornår sker det?

Ordre annulleres midt i pluk typisk fordi:
- Kunden annullerer inden for annulleringsvinduet (før afsendelse)
- Betalingen falder igennem (creditcard-verif ikation mislykkes efterfølgende)
- Svindel-alarm trigger på betalingsgatewaysiden
- Duplikatordre: kunden har bestilt to gange
- B2B-ordre tilbagekaldt af indkøbsafdeling

## Problemet

Orderen er allerede i gængende pluk. Varerne er taget fra hylderne. Hvis ikke håndteret korrekt:
- Varerne lægges muligvis ikke korrekt tilbage
- Lagersaldi opdateres ikke korrekt
- Plukkeren er i tvivl om hvad der gøres

## Den korrekte procedure

### Trin 1: Systemalarm til plukkeren
Ved ordreannullering mens plukjob er aktivt: WMS skal sende øjeblikkelig alarm til plukkeren (vibration på scanner, rdd markering på skærm).

### Trin 2: Stop plukøjeblikkeligt
Pluk stoppes. Ingen varer lægges i pakken.

### Trin 3: Return-to-shelf procedure
Alle allerede plukked e varer lægges tilbage på KORREKTE hylde-placeringer med scan. – Ikke bare smides "et sted" på lageret.

### Trin 4: WMS opdaterer saldo
Nmr alle varer er returneret til hylderne og scannet, opdaterer WMS saldo automatisk. Ingen manuelle korrektioner.

### Trin 5: Luk plukjobbet i systemet
Markér jobbet som annulleret. Ordre-status opdateres.

## Hvad hvis ordren allerede er pakket?

Er pakken helt færdig med label:
1. Kontakt fragtleverandøren **straks** for at stoppe forsendelsen
2. Er pakken allerede afhentet: fælles recall-procedure med fragtleverandør (GLS/PostNord har tilbagekaldelses-service)
3. Er pakken leveret: kundens 14-dages fortrydelsesret gælder. Send retur-label.

## Håndtering når refusion allerede er givet

Er pakken sendt UG kunden refunderet: du har sendt en gratis pakke. Valg:
- Kontakt kunden og bed om returnering med prepaid label
- Keep-it policy hvis varens værdi er lav (<300 kr.)

## Typiske fejl

- **Ingen alarm til plukkeren** – plukker fuldfører ordren og pakker – for sent
- **Varer lagt tilbage forkert** – lageraccuracy påvirkes
- **Saldo opdateres ikke korrekt** – varer returneret til hylde men ikke scannet
- **Annulleret ordre fuldført og sendt** – du betaler fragt for en ordre der er refunderet
- **Packe-annulleringer ikke logget** – du kan ikke analysere mønster

## Sådan gør du det rigtigt

- Realtime annullerings-alarm til aktive plukjobs
- Return-to-shelf scan krævet – ingen "bare læg det"
- Plukjob må ikke fuldføres efter annullering (WMS blokering)
- Log alle annulleringer med tidspunkt og påvirket værdi
- Månedlig analyse: hvornmår sker annulleringer oftest? (dag/tid-pattern)

## Brug denne artikel: tjekliste

- [ ] WMS sender real-time alarm til plukkeren ved ordreannullering
- [ ] Return-to-shelf scan procedure dokumenteret og trænet
- [ ] WMS blokerer fuldførelse af annulleret plukjob
- [ ] Recall-procedure med fragtleverandør dokumenteret
- [ ] Månedlig analyse af annullerings-mønster

**Næste skridt:** Test i dit WMS: hvad sker der når du annullerer en ordre der er i aktivt pluk? Får plukkeren en alarm? Blokerer systemet? Ret det der ikke fungerer.

## SmartPack understøttelse

SmartPack sender øjeblikkelig alarm til plukkeres mobile enhed når en ordre annulleres under aktivt pluk. Systemet blokerer pakkeafslutning på annullerede ordrer og guider plukkeren igennem return-to-shelf med scan.

## FAQ

**Hvad gør man når ordren er annulleret men pakken allerede er sendt?**
Kontakt fragtleverandør for recall. Er pakken leveret: kunden refunderes via 14-dages fortrydelsesret. Send retur-label.

**Kan kunder annullere ordrer efter de er sendt?**
Efter afsendelse er der ingen annulleringsret – men der er 14-dages fortrydelsesret efter modtagelse.

**Hvad er en return-to-shelf scan?**
En scan der registrerer at en vare er lagt tilbage på sin korrekte hylde-placering. Sikrer at lagersaldo opdateres korrekt.

**Hvord an får man fragtleverandøren til at tilbagekalde en forsendelse?**
Kontakt fragtleverandørens kundeservice straks med tracking-nummer. GLS og PostNord har recall-service men den er ikke garanteret ved lokal leveringsforsøg.

**Hvad er best practice for annulleringsvinduet?**
Giv kunden mulighed for at annullere i 60–90 minutter efter ordre. Herefter er plukprocessen i gang. Tydelig kommunikation i checkout om annulleringsfristen reducerer sen-annulleringer.

