---
primary_keyword: labelprinter lager valg
secondary_keywords: [zebra labelprinter, thermal label printer, fragtlabel printer, stregkode printer lager]
cluster: 06-Tech
article_type: beslutning
---

# Labelprinter til lager – Zebra, Dymo eller noget tredje?

## Kort svar

Til fragtlabels og lokationsetiketter: thermal direct printer (Zebra ZD420 eller ZD620) er industristandarden. 4.000-8.000 kr./stk., 0 forbrugsmaterialer, 10+ års levetid. Dymo er for kontoret. En inkjet-printer er altid forkert til lager.

## Hvad er en labelprinter?

En labelprinter er en printer der skriver direkte på en varmefølsom labelrulle (thermal direct) eller bruger en farvefilmrulle (thermal transfer) til at skrive på ikke-varmefølsomme labels.

**Thermal direct (ZD420, Dymo 4XL):**
- Ingen blæk, ingen toner, ingen ribbon
- Labels blackens ved varme – skæmmes ved langvarig sollys/varme
- Bedst til: fragtlabels (kortvarig brug), pluklabels
- Pris/stk: 2.000-8.000 kr.

**Thermal transfer (Zebra ZT-serie, GK420t):**
- Bruger ribbon (farvefilm)
- Labels holder år+, modstår varme, UV, kemikalier
- Bedst til: permanente lokationsetiketter, produktlabels, holdbarhedsetiketter
- Pris/stk: 5.000-20.000 kr.

**Inkjet/laser (alm. printer):**
- Aldrig til lager. Langsomt, blæk smitter, kan ikke printe labels i rækker effektivt.

## Hvornår er det et problem?

- **Printer er for langsom**: En desktop inkjet bruger 30-60 sekunder per label. En thermal: 2-3 sekunder. Ved 200 forsendelser/dag taber du 60-90 minutter.
- **Labels sidder ikke**: Forkert label-materiale til overfladen (plæstik, metal, kolde overflader) – labels falder af under transport.
- **Fragtmænd afviser labels**: GLS, PostNord og Bring har DPI-krav (minimum 203 dpi, ofte 300 dpi). En laser-printerlabel på papir med lav opløsning skannes ikke.
- **Printer går i stykker på travle dage**: En fragtlabel-printer der dør på Black Friday stopper afsendelsen.

## Valg-guide

| Brug | Anbefalet model | Pris | Labels/time |
|------|----------------|------|-------------|
| Fragtlabels (< 100/dag) | Zebra ZD420 | 4.500 kr. | 360 labels/time |
| Fragtlabels (100-500/dag) | Zebra ZD620 | 7.500 kr. | 720 labels/time |
| Fragtlabels (500+/dag) | Zebra ZT411 | 14.000 kr. | 1.440 labels/time |
| Permanente lokationsetiketter | Zebra GK420t | 5.500 kr. | 300 labels/time |
| Lav volumen kontor | Dymo LabelWriter 4XL | 2.500 kr. | 120 labels/time |

**Zebra ZD420** er standardvalget for de fleste e-handelslagre under 300 daglige forsendelser. USB + netværk, 203 dpi, thermal direct, plug-and-play med de fleste WMS inkl. SmartPack.

## Forbrugsmaterialer: hvad det reelt koster

Thermal direct-printer har ingen forbrugsmaterialer udover labels. 

Label-ruller til fragtlabels (100mm × 150mm, thermal direct):
- Ca. 500-1.000 labels/rulle
- Pris: 80-150 kr./rulle
- 200 forsendelser/dag = 1 rulle/dag = **25.000-37.500 kr./år i labels**

Sammenlign: inkjet/laser til samme volumen = papir + blæk + cutting-tid = dyrere og langsommere.

## Typiske fejl

**1. Købe en enkelt printer til hele lageret**
En printer der printer 300 labels/time er flaskehalsen ved 400 afsendelser/dag. Køb kapacitet du kan vokse ind i, eller køb to billigere frem for en dyr.

**2. Glemme printserver/netværk**
Mange ZD420-printere sælges med kun USB. Til delt brug skal du have netværk (RJ45 eller WiFi). Tjek at printeren har det inden køb, eller tilkøb netværksmodul (~500-1.000 kr.)

**3. Ignorere DPI-kravet**
GLS og PostNord kræver minimum 300 dpi for sikær scanning. Zebra ZD620 (300 dpi) er bedre end ZD420 (203 dpi) til høj volumen og små stregkoder.

**4. Ikke have en reserveprinter**
En reserveprinter til 4.500 kr. er billig forsikring. Alternativet er håndskrevne labels eller standsning af afsendelse.

## Best practice

**1. Standardisér label-format**: Alle fragtlabels i ét format (100×150mm er standard for GLS, PostNord, Bring). Brug Zebra ZPL-format for hurtigste print-performance.

**2. Rengør printerhoved månedligt**: En snavset thermal print-head giver streger i labels og fejlscanning. Zebra cleaning kit: ~200 kr. Rengøring: 5 minutter.

**3. Test alle fragtlabels ved ny integration**: Når du tilføjer en ny fragtmand (GLS, PostNord, Bring), test at label skannes korrekt ved reelt scan – ikke bare visuelt.

## SmartPack understøttelse

SmartPack printer fragtlabels direkte til Zebra-printere via ZPL (Zebra Programming Language) eller PDF. Understøtter Zebra ZD420, ZD620 og ZT-serie. Printerkonfiguration sker i SmartPack admin. Labels kan printes direkte fra pakkestation ved afsendelse uden manuelt trin.

## FAQ

**Hvad er ZPL?**
Zebra Programming Language. Et printer-specifikt kommandosprog der sender print-instruktioner direkte til Zebra-printere. Hurtigere end PDF og giver bedre stregkode-kvalitet.

**Kan jeg bruge Dymo til fragtlabels?**
Dymo LabelWriter 4XL (104mm bredde) kan printe fragtlabels. Til under 50 forsendelser/dag: acceptabelt. Over 50: for langsomt og dårligere kvalitet end Zebra.

**Hvad er 203 dpi vs. 300 dpi?**
203 dpi er tilstrækkelig til store stregkoder (GS1-128, Code 128). 300 dpi er nødvendig til små QR-koder og datamatrix. Vælg 300 dpi hvis du printer små labels eller har kvalitetskrav fra fragtmand.

**Kan labelprinter forbindes trådløst?**
Ja. Zebra ZD420 og ZD620 fås med WiFi-modul (tilkøb) eller via netværk (RJ45). WiFi-løsning passer til labelprintere på mobile pakkestationer.

**Hvad koster labels per forsendelse?**
Thermal direct label (100×150mm): 0,08-0,15 kr./stk. + 0 kr. i blæk/toner = ca. 0,10 kr./label gennemsnit.

## Læs også

- [Håndterminal til lager – valg](/viden/tech/haandterminal-valg)
- [Fragtintegrationer forklaret](/viden/tech/fragtintegrationer-forklaret)
- [Fulfillment sync – fra pluk til tracking](/viden/tech/fulfillment-sync)
- [Sådan undgår du pakkefejl](/viden/operations/saadan-undgaar-du-pakkefejl)
