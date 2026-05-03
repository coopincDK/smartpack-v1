# SmartPack Fejlkoder — Komplet Leksikon

> Alle kendte fejlkoder med årsag, kontekst og løsning.

---

## Fejlkode 301 — ItemNotFound

### Hvad er det
En vare kunne ikke slås op i SmartPack — SKU'en eksisterer ikke eller matcher ikke.

### Kontekst
Import, ankomst, scanning.

### Årsager

| Årsag | Detalje |
|-------|---------|
| SKU-mismatch | SKU i webshop/ERP matcher ikke SmartPack |
| Produkt mangler | Varen er slet ikke oprettet i SmartPack |
| Whitespace i SKU | Usynlige mellemrum i starten/slutningen af SKU |
| Specialtegn | Tegn der ikke håndteres korrekt |

### Løsning

1. Tjek `item_not_found.log` (Admin → Rapporter)
2. Ret SKU i webshop ELLER importer produktet med korrekt SKU
3. Hvis whitespace: rens SKU'en i kilde-systemet

---

## Fejlkode 326

### Hvad er det
Forsøg på at skifte produkttype til Bundle på en vare der allerede har lager registreret.

### Kontekst
Produktredigering i Admin.

### Årsag
Systemet tillader ikke typeskift til Bundle når der er eksisterende lagerpostering.

### Løsning
1. Nulstil lagerbeholdningen på varen til 0
2. Ret produkttypen til Bundle
3. Tilføj komponenterne
4. Lagerregulér til korrekt antal bagefter

---

## Fejlkode 341 — ItemBundleCantContainSelfOrParent

### Hvad er det
En bundle-vare er sat op med cirkulær reference — bundlen indeholder sig selv eller sin overordnede bundle.

### Kontekst
Produktopsætning — Bundle-konfiguration.

### Årsag
En bundle-komponent peger tilbage til bundlen den er del af.

### Løsning

1. Åbn bundlen i Admin → Produkter
2. Slet alt indhold i bundlen
3. Skift produkttypen til **Normal** midlertidigt
4. Rediger de cirkulære referencer i de underliggende produkter
5. Skift typen tilbage til Bundle
6. Tilføj korrekte komponenter

---

## Fejlkode 352 — ItemBatchNumberRequired

### Hvad er det
Batchnummer mangler ved plukbekræftelse for en vare der kræver det.

### Kontekst
Terminal → Pluk Ordrer → bekræftelse af pluk.

### Årsag
Varen har `UseBatchNumber = true` men intet batchnummer er registreret.

### Løsning
Angiv batchnummer på varen enten under ankomst (foretrukket) eller via lagerrevision.

---

## Fejlkode 1206 — StockingLotMissingBatchNumber

### Hvad er det
Batchnummer mangler ved modtagelse/ankomst af en batch-konfigureret vare.

### Kontekst
Terminal → Ankomst.

### Årsag
Varen kræver batchnummer men det blev ikke angivet.

### Løsning
Angiv batchnummer i ekstrafeltet under ankomst.

→ Se: Ankomst — Ekstrafelter (terminal.md)

---

## Fejlkode 1300 — PickingNoPicksFound

### Hvad er det
Systemet kan ikke finde nogen tilgængelige pluk at generere en plukliste fra.

### Kontekst
Terminal → Pluk Ordrer → Generer.

### Årsager og løsninger

| Årsag | Løsning |
|-------|---------|
| Samme SKU på flere ordrelinjer | Konsolidér ordrelinjer i webshop |
| Varen er oversolgt | Genopfyld lageret |
| Åben ankomst blokerer | Afslut den åbne ankomst |
| Profil-filter er for restriktivt | Justér plukkeprofil-filtre |
| Ingen ordrer passer til profilen | Kontrollér filtre i plukkeprofilen |

---

## Fejlkode 1404 — PackageTooManyItems

### Hvad er det
For mange varer er tilknyttet pakken — overskrider konfigureret maksimum.

### Kontekst
Terminal → Pak Ordrer.

### Løsning

1. Åbn pakken i Pak Ordrer
2. Tryk **+** for at tilføje en ekstra pakke
3. Fordel varerne på de to pakker
4. Afslut forsendelsen

---

## Fejl: OrderFromLocationAddressIsEmpty

### Hvad er det
Afsenderlokation mangler en udfyldt adresse — kræves af fragtintegrationerne.

### Kontekst
Transfer-ordrer og forsendelser.

### Løsning
Admin → Indstillinger → Lokationer → vælg afsenderlokationen → udfyld alle adressefelter → gem.

---

## Fejl: The JSON value could not be converted

### Hvad er det
En formateringsfejl opstår typisk ved redigering af produkter med udløbsdato.

### Kontekst
Admin → Produkter → redigering.

### Årsag
Datofeltet for udløbsdato indeholder et ugyldigt format.

### Løsning
Vælg udløbsdatoen på ny i datovælgerfeltet — skriv den ikke manuelt som tekst.

---

## Fejl: Unable to find pickup location

### Hvad er det
Systemet kan ikke finde en pakkeshop/drop point til det angivne postnummer.

### Kontekst
Labelgenerering for pakkeshop-leveringsmetoder.

### Årsag
Postnummeret matcher ikke transportørens database for denne service.

### Løsning
Kontrollér postnummeret på ordren. Ret om nødvendigt — eventuelt til nærmeste gyldige postnummer.

---

## Fejl: Printer Not Online (1002)

### Hvad er det
Systemet kan ikke kommunikere med den valgte printer.

### Kontekst
Terminal → Pak Ordrer → labelprint.

### Årsager og løsninger

| Årsag | Løsning |
|-------|---------|
| Printer slukket | Tænd printeren |
| Printservice lukket | Åbn Printservice fra systembakken |
| Netværksfejl | Tjek printerens netværksforbindelse |
| DNS-problem | Kør `ipconfig /flushdns` på alle Printservice-computere |
| Printer ikke Share-markeret | Åbn Printservice → aktivér Share |

---

## Fejl: Systemet reagerer ikke (Baglås)

### Hvad er det
SmartPack er gået i baglås og reagerer ikke på input.

### Løsning

1. Kontakt **den ansvarlige**
2. Admin → Indstillinger → Systemindstillinger → **Restart Application**
3. Alle sessioner afbrydes kortvarigt
4. Systemet genstarter og er normalt tilgængeligt inden for 30–60 sekunder
5. Vedvarende baglås: kontakt support@smartpack.dk og anmod om et reset

---

## Fejl: Terminal lader (loader)

### Hvad er det
Terminalen viser kun en loading-animation og reagerer ikke.

### Løsning
Træk ned fra toppen af skærmen (genindlæsning).
Hjælper det ikke: genstart SmartPack-appen.

→ Se: Terminal lader eller fryser (terminal.md)

---

## Fejl: Label vil ikke udskrives

### Hvad er det
Systemet forsøger at printe men ingenting udskrives på labelprinter.

### Tjekliste

| Tjek | Handling |
|------|---------|
| Er "Select Printer" vist? | Gå til Indstillinger og vælg printer |
| Er Printservice kørende? | Åbn fra systembakken på Windows-PC |
| Er Share aktiveret? | Åbn Printservice → aktivér Share på printeren |
| Er DNS-cache forældet? | Kør `ipconfig /flushdns` på alle Printservice-computere |
| Er printeren tændt? | Tjek fysisk printer |

---

## Fejl: GLS Flexdelivery not possible

### Kontekst
GLS labelgenerering.

### Årsag
FlexDelivery er ikke tilgængeligt til det pågældende land.

### Løsning
Vælg en anden GLS-leveringsmetode der understøttes til landet.

---

## Fejl: Bring — Telefonnummer format

### Kontekst
Bring labelgenerering.

### Årsag
Telefonnummeret starter ikke med et gyldigt norsk mobil-præfiks (+47 fulgt af 9 eller 4).

### Løsning
Kontrollér at telefonnummeret er i format `+479xxxxxxx` eller `+474xxxxxxx`.

→ Se: Bring (integrationer.md)

---

## Fejl: DanDomain — Fakturamail kun én gang

### Kontekst
DanDomain-integration, pakning.

### Regel
Fakturamailen til kunden kan kun sendes **én gang**.

### Forebyggelse
Verificér kundens email-adresse på ordren inden pakning.

---

## Fejl: BC — OrderLineAlreadyExists

### Kontekst
Business Central integration.

### Årsag
Bundle-underlinjer er allerede markeret som fuldført i BC ved ankomst til SmartPack.

### Løsning
Undersøg bundle-opsætning i BC. Ikke en simpel bug — kræver gennemgang af workflow.

---

## Fejl: CSV/Excel ser forkert ud

### Kontekst
Export af CSV-filer fra SmartPack, åbnet i Excel.

### Årsag
CultureInfo-indstillingen er sat til `en-US` men Excel forventer `da-DK` format (semikolon som separator).

### Symptomer
- Alle data i én kolonne
- Tal vises forkert
- Kolonner forskydes

### Løsning
Admin → Indstillinger → Systemindstillinger → CultureInfo CSV → skift til `da-DK` → Restart Application → eksportér igen.

→ Se: CSV-separator (admin.md)

---

*SmartPack Fejlkoder Leksikon · v1.34.0.0*
