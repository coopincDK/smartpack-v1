---
primary_keyword: scanner typer lager
secondary_keywords: [1D vs 2D scanner, barcode scanner typer, QR scanner lager, stregkode laesehoved]
cluster: 06-Tech
article_type: fundamentals
---

# Scanner-typer til lager – 1D, 2D og hvad der gælder for dig

## Kort svar

De fleste e-handelslager bruger 2D-scannere (læser både stregkoder og QR). 1D-scannere er billigere men læser kun standard stregkoder. Vælg 2D hvis du scanner producent-emballage, fragtlabels med datamatrix eller QR-koder på lokationer.

## 1D vs. 2D: den reelle forskel

**1D-scanner (lineær stregkode)**
Læser: EAN-13, Code 128, Code 39, ITF
Bruges til: standard varenumre, fragtlabels (GS1-128)
Fordel: billigere (500-2.000 kr.)
Begrænsning: kan ikke læse QR-koder eller datamatrix

**2D-scanner (matrix-koder)**
Læser: alt 1D + QR Code, DataMatrix, PDF417, Aztec
Bruges til: alt på et moderne lager
Fordel: fremtidssikret, læser også beskadigede koder bedre
Pris: 1.000-4.000 kr.

**Anbefaling 2025:** Køb altid 2D. Prisdifferencen er minimal (200-500 kr. per scanner). En 1D-scanner der ikke kan læse leverandørens QR-koder er værdilos.

## Scanner-teknologier

**Laser-scanner:**
- Rammer laserlinje mod stregkoden
- Fordele: hurtig, lang læseafstand (5cm-5m+), virker i dårligt lys
- Ulemper: kan ikke læse 2D-koder
- Bedst til: høje reoler, truckscanning

**CCD-scanner (charge-coupled device):**
- Kække af LED-sensorer
- Læseafstand: 1-15 cm
- Pris: 500-1.500 kr.
- Bedst til: kassepunkter, reception, lav volumen

**Image-scanner (kamera-baseret):**
- Tager billede af koden og dekoder det
- Læser 1D + 2D
- Læseafstand: afhængig af opløsning (10cm-100cm typisk)
- Bedst til: håndterminaler, pakkestationer, alle normale lager-anvendelser

## Hvornår er scanner-valg et problem?

- **Fejlscanning stiger**: koden læses kun ved præcis vinkel. Byg til image-scanner.
- **Scanner kan ikke læse leverandørkoder**: leverandør bruger QR eller datamatrix, din scanner er 1D.
- **Scanner virker ikke i kølerum**: CCD-scannere kan have kondens-problemer. Vælg IP-rated.
- **Scanner for langsom til volumen**: CCD under 100ms, image-scanner 50-100ms, laser 10-30ms.

## Typiske scanner-modeller

| Model | Type | Pris | Bedst til |
|-------|------|------|----------|
| Zebra DS2208 | 2D image, USB | 900 kr. | Pakkebord, lav volumen |
| Zebra DS9308 | 2D image, håndfri | 2.500 kr. | Pakkestation, produktionslinje |
| Honeywell Voyager 1450g | 2D image, USB | 1.200 kr. | Standard pakkebord |
| Zebra LI4278 | 1D laser, trådløs | 1.800 kr. | Store lagerhal (ikke 2D) |
| Zebra DS6878 | 2D laser, trådløs | 3.500 kr. | Stor læseafstand + 2D |

## Typiske fejl

**1. Købe 1D fordi det er billigere**
200 kr. i besparelse pr. scanner. Til prisen: manglende QR-læsning, manglende datamatrix (brugt på medicinsk udstyr, fødevarer, elektronik-komponenter).

**2. Ignorere IP-rating i køle/frys-lager**
Kondens kan dræbe en normal USB-scanner. Kølelagre kræver IP54 minimum.

**3. Vælge trådløs fordi det virker smartere**
Trådløse scannere kræver opladning og Bluetooth-parring. For pakkebordet er USB enklere og aldrig i stykker pga. batteri.

## SmartPack understøttelse

SmartPack virker med alle USB- og Bluetooth HID-scannere (standard keyboard-emulation). Ingen driver nødvendig. Understøtter 1D og 2D koder. Pakkestation og plukflow er optimeret til hurtig scan-og-bekræft – typisk 1-2 sekunder per scan inkl. system-respons.

## FAQ

**Kan jeg bruge telefonens kamera som scanner?**
Til meget lav volumen (under 10 pluk/dag): ja. Til rigtig lageroperation: nej. Telefonkamera er for langsom (3-5 sekunder), og telefonen er ikke IP-rated eller optimeret til gentagen scanning.

**Hvad er datamatrix?**
En 2D-kode (som QR, men højere informationstæthed på mindre plads). Bruges på medicin-emballage, elektronik og fødevarer. Kræver 2D-scanner.

**Er Bluetooth-scanner god til lager?**
Bra til mobilitet (op til 10 meters rækkevidde). Problemer: batteri dør, Bluetooth disconnects, parringsbesvigelser. Til pakkebordet: brug USB. Til mobilscanning i lager: brug håndterminal (fuldt system).

**Hvad koster det at bruge forkert scanner?**
Hvis 1D-scanner ikke kan læse leverandørkoder: manuel indtastning. 10 sekunder ekstra per scan × 100 modtagelser/dag = 17 minutter/dag = 70 timer/år = ~17.500 kr./år i arbejdstid.

## Læs også

- [Håndterminal til lager – valg](/viden/tech/haandterminal-valg)
- [Stregkode-scanning på lager](/viden/tech/stregkode-scanning-lager)
- [Sådan undgår du pakkefejl](/viden/operations/saadan-undgaar-du-pakkefejl)
- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
