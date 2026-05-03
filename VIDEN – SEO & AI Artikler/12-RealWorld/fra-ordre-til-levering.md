---
primary_keyword: fra ordre til levering
secondary_keywords: [ordre fulfillment flow, e-handel levering process, ordre til pakke, webshop fulfillment steps]
cluster: 12-RealWorld
---

# Fra ordre til levering: De 12 trin en pakke gennemløber

Kunden har trykket køb. De forventer pakken om 2 dage.

Mellem klik og levering: 12 trin. Hvert trin kan fejle.

API'en timeout'er. Varen er ikke på hylden. Printeren stopper. Chaufføren scanner ikke pakken.

Det ser enkelt ud fra kundens side. Fra din er det 12 potentielle fejlpunkter – og hvert koster penge eller tilfredshed.

Her er det fulde flow. Ærligt. Med de faktiske risici.

## Trin 1: Ordremodtagelse og validering (0–1 min)

Kunden bekræfter købet. Webshopen:
- Modtager ordren
- Verificerer betaling
- Validerer adresse
- Sender ordrebekræftelse til kunden

**Risici**: Betaling falder igennem. Adresse er ugyldig. Svindel-alert trigges.

## Trin 2: Ordreoverførsel til WMS (1– 5 min)

Ordren sendes fra webshop til lagersystemet via API.

**Risici**: API-integration fejler. Ordren sidder i webshop men når ikke WMS.

## Trin 3: Ordrevalidering i WMS (5–10 min)

WMS verificerer at varen er på lager, at ordren er komplet og korrekt mappet.

**Risici**: Varen er udsolgt (phantom inventory). Mapping-fejl – forkert SKU.

## Trin 4: Plukjob-generering og -prioritering (10–20 min)

WMS opretter plukjob og tildeler det til en plukkere. Prioritet: backordre først, så FIFO.

**Risici**: Plukjob frigivet til optaget plukkere. Suboptimal rute = langsom pluk.

## Trin 5: Pluk (20–60 min)

Plukkeren går til hylde og henter varen. Scanner vare og bekræfter.

**Risici**: Vare ikke på registreret placering. Forkert vare plukket. Saldofejl opdages.

## Trin 6: Kvalitetskontrol (60–80 min)

Varen tjekkes: korrekt? Intakt? Komplet antal?

**Risici**: Beskadiget vare plukket og pakket. Forkert antal.

## Trin 7: Pakning (80–100 min)

Varen pakkes i korrekt kasse med beskyttelse. Faktura/packing slip inkluderes.

**Risici**: For stor/lille kasse = volumevægt-konsekvens eller skaderisiko. Manglende dokumenter.

## Trin 8: Etikettering (100–110 min)

Label printes og klistres på. Scan-verify bekræfter match.

**Risici**: Forkert label. Printer fejler. Scan-verify ikke gennemført.

## Trin 9: Fragtoverlevering (110–120 min)

Pakken flyttes til fragtzone. Afstemning: antal labels = antal pakker.

**Risici**: Pakke glømmes på lageret. Forkert fragtzone.

## Trin 10: Fragtleverandørens afhentning (cut-off)

Chauføren henter og scanner alle pakker ind i systemet.

**Risici**: Pakke scannes ikke af chaufør. For sen afsendelse (forbi cut-off).

## Trin 11: Fragtleverandørens hubs og ruter

Pakken kører til lokalt depot og sorteres til lastmileleveringen.

**Risici**: Sorteret forkert. Forsinkelse i hub. Pakkeskade ved håndtering.

## Trin 12: Levering til kunden (last mile)

Chauføren leverer til adresse eller pakkeshop.

**Risici**: Ingen hjemme. Forkert adresse. Pakkeshop fuldt.

## De kritiske milepmeæle

| Milepmeæl | Tidsmrmæl | Alarm når |
|---|---|---|
| Ordre i WMS | < 5 min | > 15 min |
| Pluk startet | < 30 min | > 60 min |
| Label printet | < 2 timer | > 4 timer |
| Overleveret til fragt | Inden cut-off | After cut-off |
| Leveret | D+1 (pakkeshop) D+2 (hjem) | D+3+ |

## Hvad adskiller de bedste

Top-performende webshops adskiller sig på fire parametre:
1. **API-overvågning**: de opdager integration-stop inden kunden klager
2. **Scan-baseret flow**: fejlrate under 0,3% vs. 3%+ manuelt
3. **Proaktiv kommunikation**: kunden får tracking før de spørger
4. **Cut-off-disciplin**: de når cut-off 99% af dage uanset volumen

## SmartPack understøttelse

SmartPack styrer alle 12 trin med automatiske overgangsregler, alarmer ved forsinkelse og proaktiv kund ekommunikation. Hvert trin er logget – du kan til enhver tid se statusen for en konkret ordre.

## FAQ

**Hvord an lang tid tager det fra ordre til afsendelse?**
For velfungerende lager: under 4 timer. Best-in-class: under 2 timer.

**Hvad er det hyppigste fejltrin?**
Trin 5 (pluk) og trin 8 (etikettering) har de højeste fejlrater. Begge løses med scan-baseret flow.

**Hvord an måler man sin OTD?**
Fra ordrebekræftelse til faktisk levering. Ikke fra afsendelse – det er bare halvvejen.

**Kan en kunde se hvad der sker med sin ordre?**
Med moderne WMS og fragtleverandør-integration: ja – fra pluk-start til levering. Tracking-link er standard.
