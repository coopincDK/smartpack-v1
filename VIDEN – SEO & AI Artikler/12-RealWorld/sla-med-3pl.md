---
primary_keyword: SLA 3PL kontrakt
secondary_keywords: [3pl sla krav, service level agreement lager, 3pl kontrakt krav, sla logistik]
cluster: 12-RealWorld
article_type: guide
---

# SLA'er med 3PL: Hvad du skal kræve sort på hvidt i kontrakten

Du har valgt din 3PL. Partneren lover hurtig ekspedition, lav fejlrate og skalerbarhed. Ingen af det er bindende uden en SLA. En mundtlig aftale er værd intet når lageret ikke følger med Black Friday, eller når din fejlrate pludselig stiger til 3%.

## Kort svar

En SLA (Service Level Agreement) med din 3PL skal indeholde målbare krav til mindst fem områder: ekspeditionstid, fejlrate, lageraccuracy, systemoppetid og eskalationsprocedure. Uden tal er det ikke en SLA — det er et ønske.

---

## De 5 SLA-områder der er ikke-forhandlbare

### 1. Ekspeditionstid (Order-to-ship)
**Hvad det er:** Tid fra ordre er bekræftet til pakke scanner ud af 3PL-lageret.

**Hvad du skal kræve:**
- Ordrer modtaget inden kl. 14: samme-dag afsendelse (98% af dage)
- Ordrer modtaget efter kl. 14: næste arbejdsdag
- Peak-periode (uge 46-48): reduceret SLA til kl. 12 cut-off er acceptabelt, men skal aftales på forhånd

**Hvad du får hvis den brydes:** Dagbøde per ordre forsinket ud over SLA. Typisk 5-15 kr. per ordre.

### 2. Plukfejlrate
**Hvad det er:** Andel af ordrer afsendt med forkert vare, forkert antal eller forkert adresse.

**Hvad du skal kræve:** Under 0,3% målt over rullende 30 dage. Ikke 0,5%. Ikke „under 1%”.

**Målemetode i kontrakten:** 3PL rapporterer månedsvis. Du har ret til at anmode om redigerbare rådata. Kundeservice-klager tages ikke alene som evidens — brug scan-log.

### 3. Lageraccuracy
**Hvad det er:** Overensstemmelse mellem system-lagertal og fysisk lager.

**Hvad du skal kræve:** Minimum 99% accuracy målt ved månedlig cycle count. Fuld fysisk tælling mindst én gang årligt.

**Konsekvens ved brud:** Alle oversalg pga. forkert lagerstatus bæres af 3PL (kompensation for tabt ordre + kundeservice-tid).

### 4. Systemoppetid og dataudveksling
**Hvad det er:** WMS og integrationsplatformens tilgængelighed.

**Hvad du skal kræve:** Minimum 99,5% oppetid i arbejdstimer. Planlagt nedetid med mindst 5 arbejdsdages varsel. Fulfillment-events (shipment confirmations) sendt inden for 15 minutter efter afsendelse.

### 5. Eskalation og brudprocedure
**Hvad det er:** Hvad sker der når SLA brydes?

**Hvad kontrakten skal indeholde:**
- Navngivet kontaktperson (ikke bare „kundeservice”)
- Responstid på fejlrapporter: inden for 2 arbejdstimer
- Genoprettelsestid: plan for når systemet er næde, varer er mistet eller forsinkelse er systematisk
- Ophavsræt til data: dine ordredata, lagerdata og transaktionslog tilhører DIG, ikke 3PL

---

## Det du glemmer at forhandle

**Prisregulering:** Sæt et loft på årlige prisstigninger (typisk: KPI + 1-2%). Uden det kan 3PL øge med 15% årligt og du er bundet af exit-klausulen.

**Minimum volumen:** Mange 3PL'er har minimumsvolumen. Hvis du får under X ordrer, betaler du alligevel. Sørg for at det er tydeligt hvad minimumsgebyret er.

**Exit-klausul:** Minimum 30 dages opsigelsesvarsel. Helst 14 dage ved væsentlig SLA-brøde. Klart sprog om datadump og lagerflytning når kontrakt slutter.

---

## Samlet SLA-tjekliste inden underskrift

- [ ] Order-to-ship SLA med cut-off-tid og peak-undtagelser
- [ ] Plukfejlrate under 0,3% med målemetode defineret
- [ ] Lageraccuracy-krav med målefrekvens
- [ ] Systemoppetid og fulfillment-event SLA
- [ ] Navngivet eskalationskontakt
- [ ] Kompensationsmodel ved brud
- [ ] Prisloft for årlige stigninger
- [ ] Exit-procedure og data-ejendomsret

---

## FAQ

**Kan jeg forhandle SLA med en lille 3PL?**
Ja. Selv små 3PL-partnere accepterer skriftlige krav. Afvis ethvert tilbud der ikke inkluderer målbare KPI'er.

**Hvad hvis 3PL nægter at underskrive en SLA?**
Det er et advarselstegn. En professionel 3PL der er tryg ved deres processer underskriver gerne. Nægter de, ved de at de ikke kan levere.

**Hvem er ansvarlig for forkert ordre hvis kunden opgiver forkert adresse?**
Dette skal specificeres i SLA. Anbefalingen: 3PL er ansvarlig for plukkefejl og forsendelseslabel. Kunden er ansvarlig for forkert leveringsadresse.

## Læs også
- [Skjulte gebyrer hos 3PL](/viden/realworld/skjulte-gebyrer-3pl)
- [Hvornår skal du fyre din 3PL?](/viden/realworld/hvornaar-fyre-3pl)
- [Onboarding hos en 3PL](/viden/realworld/onboarding-3pl)
