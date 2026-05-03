# SmartPack Terminal — Komplet Leksikon

> **Format:** Hvert emne er en selvstændig artikel med fuldt format. Brug Ctrl+F til at søge.
> **Kilde:** Live system · support.smartpack.dk · Word-kvikguider · Domæneviden
> **Version:** SmartPack v1.34.0.0

---

## Indholdsfortegnelse

**DEL 1 — HARDWARE OG OPSÆTNING**
- Newland MT9084 — Opsætning
- Newland — Lås til SmartPack (Admin Tool)
- Newland — Special stregkode (GS1/AI)
- Zebra Håndterminal — Opsætning
- Printservice — Opsætning (Windows)
- Printservice — Tilføj ekstra printer
- Anbefalet hardware
- Browser-kompatibilitet
- Datasimkort

**DEL 2 — LOGIN OG NAVIGATION**
- Login
- Skift bruger
- Log ud
- Navigation og hjemknap
- Terminal lader eller fryser
- Plukliste låst/optaget

**DEL 3 — FORSIDEN**
- App-oversigt og badge-tællere
- Realtidsopdateringer (SignalR)

**DEL 4 — ANKOMST**
- Ankomst — oversigt og ankomstliste
- Ankomst — Opret ny (tilknyt indkøbsordre)
- Ankomst — Opret ny (manuel)
- Ankomst — Behandl (trin-for-trin)
- Ankomst — Ekstrafelter (batch, udløbsdato, produktionsdato)
- Ankomst — GS1 stregkoder
- Ankomst — Blandet leverance
- Ankomst — Bundles (VIGTIG REGEL)
- Ankomst — Batch/LOT-sporing

**DEL 5 — RETUR**
- Retur — Modtagelse af returpakke
- Retur — Returtyper
- Retur — Bundlevarer ved retur

**DEL 6 — MODTAG TRANSFER**
- Modtag Transfer

**DEL 7 — PLUK ORDRER**
- Pluk Ordrer — Generer plukliste
- Pluk Ordrer — Indstillinger og filtre
- Plukstrategi — Multipluks Ordre (med totes)
- Plukstrategi — Runner / Singlelines (uden totes)
- Plukstrategi — Masseprint
- Plukstrategi — Priority
- Plukstrategi — Pickup / Afhentning
- Plukstrategi — Eksklusive profiler
- Aktiv plukning — Plukskærmen
- Aktiv plukning — Trin-for-trin
- Aktiv plukning — Interaktive elementer
- Aktiv plukning — Vogn og tote
- Fejlhåndtering — Vare mangler på hyldeplads
- Fejlhåndtering — Delvist plukket ordre
- Fejlhåndtering — 0/1 lister (ingen tote)
- Fejlhåndtering — For mange varer plukket
- Fejlhåndtering — Ordre annulleret i shop

**DEL 8 — PAK ORDRER**
- Pak Ordrer — Toteliste oversigt
- Pak Ordrer — Naviger til en ordre
- Pak Ordrer — OID-assistent
- Pakningsprocessen — Trin-for-trin
- Pakningsprocessen — Manuel ordre (Runner/Singlelines)
- Pakningsprocessen — Fast Pack
- Pakningsprocessen — Alle tilgængelige handlinger
- Labelprint — Fejl og løsninger
- Labelprint — Genudskriv (pakket ordre)
- Labelprint — Glemt produkt i pakket ordre

**DEL 9 — FLYT LAGER OG GENOPFYLDNING**
- Flyt Lager — Genopfyldningsliste fra totes
- Flyt Lager — Direkte flytning (placering til placering)
- Flyt Lager — Sektionsoversigt
- Nedlæg plukliste

**DEL 10 — REVISION**
- Lagerrevision (Stock Audit)
- Lagerrevision — LOT/Batch håndtering
- Lagerrevision — Karantæne
- Placeringsrevision
- Løbende optælling (automatisk revision)

**DEL 11 — ANDRE APPS**
- Ordreinfo
- Produktinfo / Vareinfo
- Produktion
- Scan til Palle
- Klienttilstand (Client Mode)

**DEL 12 — INDSTILLINGER**
- Printerindstillinger og printervælger
- Brugerindstillinger
- Automatiseringsindstillinger
- Plukindstillinger
- Stemmeassistent
- Stregkodeindstillinger
- Andre indstillinger
- Genvejsknapper

**DEL 13 — REFERENCE**
- Stregkodepræfikser og systemkoder
- Fejlkoder — Quick Reference
- Hurtige fejlløsninger

---

# DEL 1 — HARDWARE OG OPSÆTNING

---

## Newland MT9084 — Opsætning

### Hvad er det
Newland MT9084 Orca Pro er den primære anbefalede håndterminal til SmartPack. Det er en Android-baseret scanner med integreret stregkodelæser. Enheden installeres som en web-app og konfigureres til at simulere tastetryk.

### Hvornår bruges det
Første gangs opsætning af en ny Newland-enhed, eller ved genfabriksindstilling.

### Sådan fungerer det — trin-for-trin

1. Oplad enheden fuldt og tænd den
2. Log ind på eller opret en Google-konto på enheden
3. Sæt **ikke** skærmlås (anbefales ikke til terminalbrug — forsinkelse ved aktivering)
4. Swipe op fra bunden for at åbne menuen
5. Find **Quicksettings**
6. Scroll ned til **Scan**
7. Sæt **Prefix** til `7B`
8. Sæt **Suffix** til `7D`
9. Sæt **Output Mode** til `Simulate keystroke`
10. Sæt interval til `0 ms`
11. Åbn Play Butik → søg efter **Chrome** → opdatér hvis tilgængeligt
12. Åbn Chrome → navigér til `ditlager.smartpack.dk`
13. Tryk de tre prikker øverst til højre → **Installer app**
14. SmartPack er nu installeret som app på terminalen

### Indstillinger / felter

| Indstilling | Værdi | Forklaring |
|-------------|-------|-----------|
| **Prefix** | `7B` | Tegn sendt før stregkodeindhold — kræves af SmartPack |
| **Suffix** | `7D` | Tegn sendt efter stregkodeindhold — kræves af SmartPack |
| **Output Mode** | `Simulate keystroke` | Simulerer tastaturtryk — nødvendigt for webbrowser-input |
| **Character interval** | `0 ms` | Ingen forsinkelse mellem tegn — hurtigst mulig scanning |

### Systemlogik
Prefix `7B` svarer til ASCII `{` og suffix `7D` svarer til `}`. SmartPack bruger disse tegn til at identificere og afgrænse stregkodeindhold fra anden tastaturinput.

### Typiske fejl

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Scanning registreres ikke | Forkert Output Mode | Sæt Output Mode til Simulate keystroke |
| Scanning registreres som to input | Interval ikke 0 | Sæt interval til 0 ms |
| App opdaterer ikke | Chrome er forældet | Opdatér Chrome via Play Butik |

### Edge cases
- Hvis enheden har skærmlås aktiveret, skal du låse op før scanning — dette giver forsinkelse i travle perioder
- Ved brug af pistolgreb: kontrollér at grebets scan-knap er konfigureret til samme output som den fysiske scanknap

### Best practice
- Opdatér Chrome ved opsætning — ældre versioner kan give uforudsigelig adfærd
- Brug Google-konto der er dedikeret til terminalen (fx `lager1.terminal@gmail.com`) — ikke en personlig konto
- Test scanning med en placeringsQR inden ibrugtagning

### Relaterede emner
→ Se: Newland — Lås til SmartPack (Admin Tool)
→ Se: Newland — Special stregkode (GS1/AI)
→ Se: Stregkodeindstillinger (Terminal-indstillinger)
→ Se: Anbefalet hardware

---

## Newland — Lås til SmartPack (Admin Tool)

### Hvad er det
En valgfri men anbefalet konfiguration der låser Newland-terminalen til udelukkende at køre SmartPack. Forhindrer medarbejdere i at bruge terminalen til andet og sikrer at appen altid starter automatisk.

### Hvornår bruges det
Når terminalen udelukkende skal bruges som SmartPack-terminal og ikke til private formål.

### Sådan fungerer det — trin-for-trin

1. Åbn **Newland Installer** på terminalen
2. Installer **Admin Tool** via Newland Installer
3. Forlad Admin Tool med **tilbageknappen** (ikke hjemknappen)
4. Indtast admin-password når der spørges (standard: `112233`)
5. Gå til **App Manager**
6. Vælg de apps der må bruges (som minimum: SmartPack + Chrome)
7. Gå til **Launch Application**
8. Vælg SmartPack som standard-app der starter ved opstart

### Indstillinger / felter

| Indstilling | Beskrivelse |
|-------------|-------------|
| **App Manager** | Liste over tilladte apps på enheden |
| **Launch Application** | App der starter automatisk ved opstart/opvågning |
| **Admin password** | Standard: `112233` — bør ændres ved ibrugtagning |

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Kan ikke finde Admin Tool | Installér via Newland Installer først |
| Glemt admin-password | Kontakt Newland support eller fabriksindstil enheden |

### Best practice
- Ændr standard admin-password (`112233`) ved første opsætning
- Tillad kun de apps der er nødvendige — minimum SmartPack og Chrome

### Relaterede emner
→ Se: Newland MT9084 — Opsætning

---

## Newland — Special stregkode (GS1/AI)

### Hvad er det
En Newland-konfiguration der aktiverer læsning af GS1-stregkoder med Application Identifiers (AI) i kantede parenteser. Nødvendigt for at SmartPack kan læse og tolke udvidede GS1-data som batch-numre, udløbsdatoer og produktionsdatoer direkte fra stregkoden.

### Hvornår bruges det
Når du modtager varer med GS1-128 eller GS1 DataMatrix stregkoder der indeholder batch-nummer, udløbsdato eller produktionsdato.

### Sådan fungerer det — trin-for-trin

1. Swipe hovedmenuen op — fra bund mod top
2. Find **Quick Settings**
3. Scroll ned til **Symbologies**
4. Gå til fanen **Advanced**
5. Sæt flueben i **"Output AI in brackets"**
6. SmartPack kan nu læse og tolke GS1 Application Identifiers

### Systemlogik
GS1 Application Identifiers er koder der identificerer typen af data i en stregkode (fx AI 10 = batchnummer, AI 17 = udløbsdato, AI 11 = produktionsdato). Når "Output AI in brackets" er aktiveret, sendes disse som `(10)BATCHNR(17)YYYYMMDD` — et format SmartPack kan tolke og automatisk fordele til de korrekte felter.

### Best practice
Aktivér altid denne indstilling hvis du arbejder med datostyrede eller batchstyrede varer.

### Relaterede emner
→ Se: Ankomst — GS1 stregkoder
→ Se: Ankomst — Ekstrafelter (batch, udløbsdato, produktionsdato)

---

## Zebra Håndterminal — Opsætning

### Hvad er det
Opsætning af en Zebra Android-håndterminal til brug med SmartPack via DataWedge-profil.

### Hvornår bruges det
Første gangs opsætning af en Zebra-enhed.

### Sådan fungerer det — trin-for-trin

1. Opsæt Google-konto på enheden (anbefales: dedikeret konto fx `kundenavn.terminal@gmail.com`)
2. SmartPack sender **DataWedge-profil** (`dwprofile_smartpack.db`) til kunden via e-mail
3. Hent filen fra Gmail på terminalen
4. Åbn DataWedge-appen
5. Tryk menu → **Import Configuration**
6. Vælg den downloadede `.db`-fil
7. Profilen importeres og aktiveres automatisk
8. Åbn Chrome → navigér til `kundenavn.smartpack.dk/terminal`
9. Tryk de tre prikker → **Installer app**

### Indstillinger / felter

| Indstilling | Kilde | Beskrivelse |
|-------------|-------|-------------|
| **DataWedge-profil** | SmartPack-support sender filen | Konfigurerer scanner-output til SmartPack-format |
| **Terminal URL** | `kundenavn.smartpack.dk/terminal` | Kundespecifik URL |

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Scanning registreres ikke | DataWedge-profilen er ikke aktiv — tjek DataWedge |
| Profil-import fejler | Kontrollér at filen er `.db`-format og ikke zippet |

### Best practice
Opret en dedikeret Google-konto per terminal — ikke medarbejderens personlige konto.

### Relaterede emner
→ Se: Newland MT9084 — Opsætning
→ Se: Anbefalet hardware

---

## Printservice — Opsætning (Windows)

### Hvad er det
SmartPack Printservice er et Windows-program der fungerer som bro mellem SmartPack-systemet og fysiske printere. Det kører i baggrunden på en Windows-PC og gør printere tilgængelige for alle terminaler og admin-brugere på netværket.

### Hvornår bruges det
- Første gangs opsætning af en printercomputer
- Når en ny printer skal tilgøres tilgængelig for SmartPack

### Krav
- Windows 10 minimum
- Computeren skal altid være tændt og online
- Printservice skal altid køre (konfigureres til auto-start)

### Download
Admin → Settings → Printere → **Download Print Service**
Alternativt: `cdn.smartpack.dk/downloads/printservice.zip`

### Sådan fungerer det — trin-for-trin

1. Download zip-filen
2. Pak zip ud → flyt mappen til et fast sted (fx `C:\smartpack\printservice`)
3. Kør `SmartPack.PrintService.Installer`
4. Windows viser sikkerhedsadvarsel → klik **"Flere oplysninger"** → **"Kør alligevel"**
5. Fastgør Printservice til proceslinjen for nem adgang
6. Åbn programmet fra systembakken (printerikon nederst til højre i Windows)
7. Udfyld **SmartPack URL**: `https://ditlager.smartpack.dk`
8. Klik **Connect**
9. Vælg printer i dropdown
10. Sæt flueben i **Share**
11. Giv printeren et beskrivende navn (fx `Labels Pakkestation 1`)
12. Klik **Save**
13. Klik **Test** — en testlabel sendes til printeren
14. Sæt flueben i **Run on startup**
15. Klik **Save** igen

### Indstillinger / felter

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| **SmartPack URL** | URL til jeres SmartPack-installation | `https://ditlager.smartpack.dk` |
| **Printer** (dropdown) | Vælg hvilken Windows-printer der deles | `Zebra ZD421` |
| **Share** (checkbox) | Gør printeren synlig for SmartPack | ✅ skal være markeret |
| **Navn** | Visningsnavn i SmartPack | `Fragtlabel Pakkestation 1` |
| **Run on startup** | Printservice starter automatisk ved Windows-opstart | ✅ anbefales |

### Systemlogik
Kun printere med **Share** aktiveret er synlige for SmartPack-enheder og admin. Printere uden Share er usynlige uanset om de er online.

### Typiske fejl

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Printer ikke synlig i SmartPack | Share ikke aktiveret | Aktivér Share på printeren |
| Kan ikke printe | Printservice lukket | Åbn Printservice fra systembakke |
| DNS-fejl | DNS-cache forældet | Kør `ipconfig /flushdns` i CMD på **alle** computere med Printservice |
| Printer offline | Printer slukket eller netværksfejl | Tjek printerens strøm og netværksforbindelse |

### Edge cases
- Hvis Printservice lukkes med X og genåbnes, skal du vælge printer og gemme igen — indstillingerne bevares ikke altid
- Flere printere på én computer: se artikel "Printservice — Tilføj ekstra printer"

### Best practice
- Installér Printservice på en computer der aldrig slukkes (fx en server-PC eller en dedikeret pakke-PC)
- Minimér altid Printservice — klik ALDRIG på X under normal drift
- Test printeren efter opsætning med Test-knappen inden brug i produktion

### ⚠️ KRITISK REGEL
**Klik ALDRIG på X (luk) i Printservice-vinduet under normal drift.** Det lukker hele servicen og ingen terminaler kan printe. Brug **minimér** (\_) i stedet.

### Relaterede emner
→ Se: Printservice — Tilføj ekstra printer
→ Se: Printerindstillinger (Terminal)
→ Se: Labelprint — Fejl og løsninger
→ Se: Flush DNS

---

## Printservice — Tilføj ekstra printer

### Hvad er det
Procedure for at tilføje en ny printer til en computer der allerede kører Printservice.

### Hvornår bruges det
Når en ny fysisk printer kobles til en eksisterende Printservice-computer.

### Sådan fungerer det — trin-for-trin

1. Find Printservice i systembakken (printerikon, nederst til højre)
2. **Klik X for at lukke Printservice** — dette er det ENESTE tidspunkt du må klikke X
3. Navigér til Printservice-mappen (fx `C:\smartpack\printservice`)
4. Kør `SmartPack.PrintService` igen
5. Vælg den **nye printer** i dropdown
6. Sæt flueben i **Share**
7. Giv printeren et navn
8. Klik **Save**
9. Klik **Test** for at verificere

### Edge cases
- Eksisterende printere skal gen-konfigureres hvis de forsvinder efter genstart — kontrollér at Share stadig er aktivt
- Hvis den nye printer ikke vises i dropdown: kontrollér at Windows-printeren er installeret korrekt

### Best practice
Luk ikke Printservice unødigt. Planlæg tilføjelse af printere til tidspunkter med lav aktivitet.

### Relaterede emner
→ Se: Printservice — Opsætning (Windows)

---

## Anbefalet Hardware

### Hvad er det
SmartPacks officielle anbefalinger for hardware til optimal drift.

### Håndterminaler

| Enhed | Anbefaling | Note |
|-------|-----------|------|
| **Newland MT9084 Orca Pro** | ✅ Primært anbefalet | Nævn SmartPack hos Skancode for **10% rabat** |
| **Zebra håndterminal** | ✅ Understøttet | Kræver DataWedge-profil |
| **Smartphone (Android/iOS)** | ⚠️ Alternativ | Fungerer men ikke optimalt til intensiv brug |

### Tilbehør til Newland

| Tilbehør | Leverandør |
|----------|-----------|
| **Pistolgreb** | Skancode.dk |
| **Ladestander (3-slot)** | Skancode.dk |

### Printere

| Type | Anbefalet model | Note |
|------|----------------|------|
| **Fragtlabel-printer** | Zebra ZD421D | USB-version standard; WiFi-modul tilkøbes separat |
| **Etiket-/vareprinter** | Dymo LabelWriter Wireless | Til hyldeforkanter, stregkoder |
| **Etiket-/vareprinter** | Brother QL-810Wc | Alternativ til Dymo |
| **Labels til Dymo** | Dymo S0722370 | Standardlabels |

### Computer til Printservice

| Krav | Specifikation |
|------|--------------|
| **Operativsystem** | Windows 10 minimum |
| **Tilgængelighed** | Altid tændt og online |
| **Formål** | Kører Printservice — bro til fysiske printere |

### Plukkasser (Totes)

| Produkt | Beskrivelse |
|---------|-------------|
| **Plast Team Seoul Kurv, størrelse M** | Stablable plastikkurv — anbefalet til plukning |

### Køb hardware

| Kanal | Link |
|-------|------|
| Skancode (Newland + tilbehør) | https://skancode.dk/smartpack |
| Dymo labels | Søg: `Dymo S0722370` |

### Best practice
- Køb Newland-terminaler via Skancode og nævn SmartPack for at opnå 10% rabat
- Brug pistolgreb ved intensiv plukning — reducerer træthed
- 3-slot ladestander sikrer alle terminaler er klar ved skiftets start

### Relaterede emner
→ Se: Newland MT9084 — Opsætning
→ Se: Zebra Håndterminal — Opsætning
→ Se: Printservice — Opsætning (Windows)

---

## Browser-kompatibilitet

### Hvad er det
Oversigt over hvilke browsere der understøttes til SmartPack (terminal og admin).

### Desktop

| Browser | Platform | Kompatibilitet |
|---------|----------|---------------|
| **Google Chrome** | PC + Mac | ✅ Anbefalet |
| **Microsoft Edge** | PC | ✅ Anbefalet |
| **Apple Safari** | Mac | ✅ Understøttet |
| Andre browsere | Alle | ✅ Fungerer generelt |

> Brug altid **nyeste browserversion** for bedste kompatibilitet.

### ⚠️ Vigtig undtagelse — Lagerdesigner
**Lagerdesigneren virker IKKE i Chrome på Windows 8 eller ældre.**
Løsning: Brug Microsoft Edge, eller opgrader til Windows 10+.

### Mobil
SmartPack virker på både **Android** og **iOS**.

### Best practice
Hold browseren opdateret. Aktivér automatisk opdatering i Chrome/Edge.

### Relaterede emner
→ Se: Newland MT9084 — Opsætning (Chrome-installation)
→ Se: Lagerdesigner (Admin)

---

## Datasimkort

### Hvad er det
Information om forventet dataforbrug ved brug af datasimkort i håndterminaler.

### Forventet forbrug

| Brug | Forbrug |
|------|---------|
| Udelukkende SmartPack | **Under 10 GB/måned** per terminal |

### Best practice
- Vælg et simkortsabonnement med minimum 10 GB/måned per terminal
- WiFi foretrækkes over simkort for stabilitet og hastighed
- Brug simkort som fallback ved WiFi-udfald, ikke som primær forbindelse

### Relaterede emner
→ Se: Terminal lader eller fryser (WiFi-fejlfinding)

---

# DEL 2 — LOGIN OG NAVIGATION

---

## Login

### Hvad er det
Processen for at logge ind på SmartPack Terminal. Understøtter to metoder: QR-kode-scanning og manuelt brugernavn/adgangskode.

### Hvornår bruges det
Hver gang en medarbejder starter arbejde på en terminal.

### Sådan fungerer det

**Metode 1 — QR-kode (anbefalet):**
1. Åbn SmartPack-appen på terminalen
2. Scan din personlige QR-kode
3. Du er logget ind øjeblikkeligt

**Metode 2 — Brugernavn + adgangskode:**
1. Åbn SmartPack-appen
2. Skriv brugernavn i det øverste felt
3. Skriv adgangskode i det nederste felt
4. Tryk **Log ind**

### Systemlogik
Alle aktiviteter logges til den individuelle bruger. Sporbarhed er altid sikret uanset loginmetode. Systemet registrerer hvem der plukker, pakker, modtager og reviderer.

### Typiske fejl

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Forkert adgangskode | Tastefejl eller ændret kode | Kontakt admin → nulstil kodeord |
| QR-kode scanner ikke | Snavset kode eller svag belysning | Rengør koden; prøv manuelt login |
| "Ikke aktiv bruger" | Konto deaktiveret | Kontakt admin |

### Edge cases
- Hvis en brugers QR-kode beskadiges: brug midlertidigt manuelt login mens ny QR-kode printes
- Tilladt IP-liste: en admin kan begrænse login til specifikke IP-adresser per bruger

### Best practice
Brug QR-kode-login — hurtigere og fejlfri. Laminér QR-koderne til holdbarhed.

### Relaterede emner
→ Se: Skift bruger
→ Se: Opret / Rediger Medarbejder (Admin)
→ Se: Glemt kodeord (Admin)

---

## Skift bruger

### Hvad er det
Mulighed for at skifte til en anden bruger på terminalen uden at logge ud først.

### Hvornår bruges det
Når en anden medarbejder overtager terminalen mid-shift.

### Sådan fungerer det
1. Scan en anden medarbejders QR-kode direkte
2. Systemet logger automatisk den nuværende bruger ud og logger den nye ind
3. Ingen manuel log-ud nødvendig

### Systemlogik
Alle efterfølgende aktiviteter logges til den nye bruger. Der er ingen overlapning i loggen.

### Best practice
Sørg for altid at scanne din egen QR-kode når du overtager en terminal — aldrig arbejde under en andens konto.

### Relaterede emner
→ Se: Login
→ Se: Log ud

---

## Log ud

### Hvad er det
Manuel udlogning fra SmartPack Terminal.

### Sådan fungerer det
1. Tryk **Log ud** — knappen sidder **nederst til højre** på skærmen
2. Du returneres til loginskærmen

### Best practice
Log altid ud ved endt arbejdsdag eller ved overlevering af terminal til anden medarbejder.

### Relaterede emner
→ Se: Login
→ Se: Skift bruger

---

## Navigation og hjemknap

### Hvad er det
Oversigt over de universelle navigationselementer der altid er tilgængelige i terminalen.

### Altid-gældende navigationsregler

| Situation | Handling |
|-----------|----------|
| Tilbage til hovedmenuen | Tryk **SmartPack-logoet** øverst på skærmen — virker overalt i systemet |
| Faret vild i terminalen | Tryk SmartPack-logoet — nulstiller til forsiden |
| App fryser | Træk ned fra toppen (= F5 genindlæsning) |

### Systemlogik
SmartPack-logoet fungerer som global hjemknap uanset hvilken app eller skærm du er på. Det er designet til at man altid kan finde tilbage uden at miste data (igangværende pluk gemmes automatisk).

### Relaterede emner
→ Se: Terminal lader eller fryser

---

## Terminal lader eller fryser

### Hvad er det
Fejlsituation hvor terminalen holder op med at reagere, viser kun en loading-skærm, eller er låst ude af en plukliste.

### Symptomer og løsninger

| Symptom | Handling |
|---------|---------|
| Terminal lader/spinner | Træk ned fra toppen af skærmen (genindlæsning = F5) |
| Terminal reagerer slet ikke | Genstart appen |
| Låst ude af plukliste (mistet WiFi) | Genstart SmartPack-appen |

### Systemlogik
Terminalen kommunikerer i realtid med serveren via SignalR. Mister den forbindelsen, kan serveren tro at en plukliste stadig er aktiv. Ved genstart genoprettes forbindelsen.

### Version 100.0195 og nyere
Fra denne version vil SmartPack automatisk spørge om du vil **overtage den aktive plukliste** direkte — ingen manuel intervention nødvendig.

### Anbefalet ugentlig vedligehold
Genstart terminalen **én gang ugentlig** for optimal ydeevne.

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Vedvarende freezing | Tjek WiFi-signal; flyt tættere på access point |
| Systemet reagerer slet ikke | Kontakt ansvarlig → system-reset fra Admin |

### Relaterede emner
→ Se: Plukliste låst/optaget
→ Se: Genstart SmartPack (Admin)

---

## Plukliste låst/optaget

### Hvad er det
Situationen hvor en plukliste vises som "optaget af anden bruger" — oftest fordi en WiFi-forbindelse blev afbrudt og serveren ikke ved at brugeren er offline.

### Hvornår opstår det
Primært ved midlertidigt WiFi-tab under aktiv plukning.

### Løsning

**Standard (alle versioner):**
1. Træk ned fra toppen af skærmen
2. Genstart SmartPack-appen
3. Prøv at åbne pluklisten igen

**Version 100.0195+:**
Systemet spørger automatisk: *"Vil du overtage den aktive plukliste?"*
→ Tryk **Ja** — pluklisten overtages og du fortsætter

### Edge cases
- Hvis en anden medarbejder faktisk har pluklisten aktiv: koordinér hvem der fortsætter
- Hvis problemet gentager sig hyppigt: tjek WiFi-dækning i lagerets alle zoner

### Best practice
Sørg for stabilt WiFi i hele lagerrummet. Dead spots giver gentagne låsningsproblemer.

### Relaterede emner
→ Se: Terminal lader eller fryser
→ Se: Fejlhåndtering — Delvist plukket ordre

---

# DEL 3 — FORSIDEN

---

## App-oversigt og badge-tællere

### Hvad er det
Forsiden i SmartPack Terminal viser alle tilgængelige apps som ikoner med badge-tællere. Badge-tallene opdateres i realtid og giver øjeblikkeligt overblik over afventende opgaver.

### Apps og hvad badge-tallene viser

| App | Badge viser | Funktion |
|-----|------------|---------|
| **Ankomster** | Aktive ankomster | Modtag varer, returpakker, transfers |
| **Pluk Ordrer** | Ordrer klar til pluk | Generer og udfør pluklister |
| **Pak Ordrer** | Totes klar til pakning | Pak ordrer, udskriv fragtlabels |
| **Flyt Lager** | Genopfyldningsbehov | Flyt varer, genopfyld plukpladser |
| **Lagerrevision** | — | Tæl og ret antal for én vare |
| **Placeringsrevision** | — | Kontroller alle varer på én placering |
| **Ordreinfo** | — | Slå ordre op, rediger adresse |
| **Produktinfo** | — | Slå varer op, udskriv stregkoder |
| **Produktion** | Afventende batches | Kitting og produktionsbatches |
| **Scan til Palle** | — | Sorter pakker til paller |
| **Indstillinger** | — | Printer, sprog, stemme, dobbelt-scan m.m. |

### Skærmlayout

| Element | Placering | Funktion |
|---------|-----------|---------|
| SmartPack-logo | Øverst | Hjemknap — tryk for at gå til forsiden |
| Statuslinje | Øverst | Antal ordrer i de forskellige faser |
| Reol-ikon | Øverst til højre | Find tomme placeringer i nærheden |
| Brugernavn | Nederst | Viser aktuelt indlogget bruger |
| Terminalnavn | Nederst | Viser terminalens navn |

### Systemlogik
Badge-tæller opdateres automatisk via **SignalR** i realtid. Du behøver aldrig genindlæse siden for at se aktuelle tal.

### Relaterede emner
→ Se: Realtidsopdateringer (SignalR)
→ Se: Navigation og hjemknap

---

## Realtidsopdateringer (SignalR)

### Hvad er det
SmartPack bruger SignalR-teknologi til at sende opdateringer øjeblikkeligt til alle terminaler og admin-brugere — uden at nogen behøver at genindlæse siden.

### Hvornår opdateres hvad automatisk

| Hændelse | Effekt på terminal |
|---------|-------------------|
| Ny ankomst oprettet | Vises øjeblikkeligt i ankomstlisten |
| Orden ændret status | Badge-tæller opdateres |
| Ny plukliste genereret | Vises i pluk-oversigten |
| Badge-tællere | Forsideikoner opdateres løbende |
| Fjernprint fra admin | Admin kan sende printjob direkte til din terminal |
| Tvungen navigation | Admin kan sende din terminal til forsiden |
| Løbende optælling udløst | Popup vises automatisk under pluk |

### Systemlogik
SignalR holder en vedvarende WebSocket-forbindelse åben. Mistes forbindelsen kortvarigt, vil terminalen automatisk genoprette den og modtage eventuelle mistede opdateringer.

### Relaterede emner
→ Se: Terminal lader eller fryser


---

# DEL 4 — ANKOMST

---

## Ankomst — Oversigt og ankomstliste

### Hvad er det
Ankomst-appen håndterer modtagelse af alle indkommende varer på lageret. Det dækker nye leverancer, kundereturer og interne overførsler.

### Hvornår bruges det
Hver gang varer fysisk ankommer til lageret og skal registreres i systemet.

### Ankomstlistens indhold
Vælg **Ankomster** i menuen. Listen viser:
- **Aktive ankomster** — ikke afsluttede modtagelser
- **Færdige ankomster** — afsluttede modtagelser (historik)

Hvert element i listen viser:
- Lager/kunde
- Placering
- Afsender
- Referencenummer
- Badge: modtaget antal / forventet antal

### Relaterede emner
→ Se: Ankomst — Opret ny (tilknyt indkøbsordre)
→ Se: Ankomst — Opret ny (manuel)
→ Se: Ankomst — Behandl (trin-for-trin)

---

## Ankomst — Opret ny (tilknyt indkøbsordre)

### Hvad er det
Oprettelse af en ny ankomst der er tilknyttet en eksisterende indkøbsordre i systemet. Anbefalet metode — giver fuld sporbarhed og lagerværdistyring.

### Hvornår bruges det
Når der er oprettet en indkøbsordre i forvejen og varer modtages mod denne.

### Sådan fungerer det — trin-for-trin

1. Tryk **Opret ny ankomst**
2. Vælg **Ankomster**
3. Søg efter indkøbsordren via én af følgende metoder:
   - Leverandørnavn
   - Varenavn
   - Scan varens stregkode
   - Trackingnummer (scan fragtlabelen)
   - Referencenummer
4. Vælg den **korrekte ordre** fra resultatlisten
5. Bekræft valget

### ⚠️ KRITISK REGEL
Tilknytning til indkøbsordre **kan ikke ændres** efter ankomsten er afsluttet. Vælg den rigtige ordre inden du begynder modtagelse.

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Kan ikke finde indkøbsordren | Søg på trackingnummer fra fragtlabelen |
| Valgte forkert ordre | Afslut IKKE ankomsten — kontakt admin |

### Relaterede emner
→ Se: Ankomst — Behandl (trin-for-trin)
→ Se: Indkøbsordrer (Admin)

---

## Ankomst — Opret ny (manuel)

### Hvad er det
Oprettelse af en ny ankomst uden tilknytning til en indkøbsordre. Bruges når varer ankommer uden forudgående indkøbsordre i systemet.

### Hvornår bruges det
- Spontane leverancer uden indkøbsordre
- Returvarer
- Interne returneringer

### Sådan fungerer det — trin-for-trin

1. Tryk **Opret ny ankomst**
2. Tryk **Tilføj manuelt**
3. Vælg ankomsttype:

| Ankomsttype | Hvornår |
|-------------|---------|
| **Standard ankomst** | Ny leverance uden indkøbsordre |
| **Retur** | Kunderetur |
| **Intern retur** | Intern tilbageføring mellem afdelinger |
| **Revision** | Reguleringsankomst |

4. Udfyld felterne:
   - **Afsender** — leverandørens navn
   - **Referencenr.** — internt referencenummer
   - **Indkøbsordre** (valgfrit) — kan tilknyttes efterfølgende

### Relaterede emner
→ Se: Ankomst — Behandl (trin-for-trin)

---

## Ankomst — Behandl (trin-for-trin)

### Hvad er det
Det fulde flow for at modtage og registrere varer i en åben ankomst.

### Hvornår bruges det
Når en ankomst er oprettet og varerne fysisk er klar til registrering.

### Sådan fungerer det — trin-for-trin

| Trin | Handling | Detalje |
|------|---------|---------|
| 1 | Åbn ankomsten | Tryk på den fra ankomstlisten |
| 2 | Find vare | Søg i søgefelt ELLER scan varens stregkode direkte |
| 3 | Angiv antal | Brug +/− knapper eller skriv direkte i feltet |
| 4 | Udfyld ekstrafelter | Kun synlige ved relevante varer (batch, udløbsdato) |
| 5 | Scan lagerplacering | Scan stregkoden på hyldekanten |
| 6 | Gentag | Trin 2–5 for alle varer |
| 7 | Afslut | Tryk **Afslut ankomst** |

### Alternativ ved blandet leverance
Scan alle varer i vilkårlig rækkefølge → scan derefter en tote. Systemet sorterer automatisk.

### Systemlogik
Når du scanner en lagerplacering, registreres varen på den præcise placering med tidsstempel, bruger og antal. Lagerværdien opdateres øjeblikkeligt.

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Stregkode ikke genkendt | Varen mangler i systemet — opret via Produktinfo |
| Kan ikke scanne placering | Kontrollér at placeringen eksisterer i lagerdesigneren |

### Relaterede emner
→ Se: Ankomst — Ekstrafelter
→ Se: Ankomst — Blandet leverance
→ Se: Ankomst — Bundles (VIGTIG REGEL)

---

## Ankomst — Ekstrafelter (batch, udløbsdato, produktionsdato)

### Hvad er det
Ekstra datafelter der vises under modtagelse for varer der kræver batch-sporing, datostyring eller produktionssporing. Felterne vises kun når de er relevante for den specifikke vare.

### Felter og hvornår de vises

| Felt | Vises når | Datatype | Eksempel |
|------|-----------|---------|---------|
| **Batchnummer / Lotnummer** | `UseBatchNumber = true` på varen | Tekst | `LOT-2024-001` |
| **Udløbsdato** | `Expirable = true` på varen | Dato | `31-12-2025` |
| **Produktionsdato** | Produktionssporing aktiveret | Dato | `01-03-2024` |

### Systemlogik
Felterne aktiveres per vare i Admin → Produkter. Når aktiveret, er de **obligatoriske** — du kan ikke afslutte modtagelsen uden at udfylde dem.

### GS1 stregkoder udfylder automatisk
Hvis varen har en GS1-stregkode med de relevante Application Identifiers, udfyldes batch, produktionsdato og udløbsdato **automatisk** ved scanning.

→ Se: Ankomst — GS1 stregkoder
→ Se: Newland — Special stregkode (GS1/AI)

### Typiske fejl

| Fejl | Årsag | Løsning |
|------|-------|---------|
| Fejlkode 1206 StockingLotMissingBatchNumber | Batchnummer ikke angivet ved modtagelse | Angiv batchnummer |
| Kan ikke afslutte ankomst | Obligatoriske ekstrafelter ikke udfyldt | Udfyld alle markerede felter |

### Relaterede emner
→ Se: Ankomst — Batch/LOT-sporing
→ Se: Batchsporing (Admin)

---

## Ankomst — GS1 stregkoder

### Hvad er det
GS1-stregkoder (GS1-128, GS1 DataMatrix m.fl.) indeholder strukturerede data med Application Identifiers der automatisk udfylder ekstrafelter under ankomst.

### Automatisk udfyldte felter

| GS1 Application Identifier | Data |
|----------------------------|------|
| AI 10 | Batchnummer / Lotnummer |
| AI 11 | Produktionsdato |
| AI 17 | Bedst-før-dato / Udløbsdato |
| AI 01 | GTIN / Varenummer |

### Forudsætning
Newland-scanneren skal være konfigureret med **"Output AI in brackets"** aktiveret.

→ Se: Newland — Special stregkode (GS1/AI)

### Systemlogik
Når stregkoden scannes, læser SmartPack de indlejrede Application Identifiers og fordeler data til de korrekte felter automatisk. Ingen manuel indtastning nødvendig.

### Best practice
Test GS1-scanning på en prøveleverance inden produktionsbrug for at verificere at alle felter udfyldes korrekt.

### Relaterede emner
→ Se: Ankomst — Ekstrafelter
→ Se: Ankomst — Batch/LOT-sporing

---

## Ankomst — Blandet leverance

### Hvad er det
Mulighed for at scanne varer fra en leverance i vilkårlig rækkefølge og derefter scanne en tote — systemet sorterer automatisk og registrerer alle varer.

### Hvornår bruges det
Ved små leverancer med mange forskellige SKU'er i én kasse, hvor det er upraktisk at håndtere én vare ad gangen.

### Sådan fungerer det — trin-for-trin

1. Åbn ankomsten
2. Scan **alle varer** i vilkårlig rækkefølge direkte fra kassen
3. Scan en **tote** som samlet midlertidig placering
4. Systemet registrerer alle varer på toten
5. Flyt til lagerplacering via **Flyt Lager**

### Systemlogik
Systemet tillader flere SKU'er på samme tote ved ankomst. Endelig placering på hyldepladser sker efterfølgende via Flyt Lager.

### ⚠️ OBS
Kontrollér lagerbegrænsningerne for placeringerne — hvis en placering har `MaxItemsPrLocation` sat, kan ikke alle SKU'er placeres der.

### Relaterede emner
→ Se: Ankomst — Behandl (trin-for-trin)
→ Se: Flyt Lager — Genopfyldningsliste fra totes

---

## Ankomst — Bundles (VIGTIG REGEL)

### Hvad er det
En kritisk regel for varemodtagelse: Bundle-SKU'er må **aldrig** modtages direkte. Kun komponentvarerne modtages individuelt.

### Reglen

**MODTAG ALDRIG EN BUNDLE-SKU DIREKTE.**

Modtag altid de individuelle komponentvarer.

### Eksempler

| Situation | Forkert | Korrekt |
|-----------|---------|---------|
| 6-pak vinkasse (SKU: WINE-6) bestående af enkeltflasker (SKU: WINE-1) | Modtag WINE-6 | Modtag WINE-1 × antal flasker |
| Månedskasse kaffe (BOX-COFFEE) bestående af KAF001–KAF005 | Modtag BOX-COFFEE | Modtag hvert KAF-SKU individuelt |

### Systemlogik
SmartPack beregner automatisk lagerantal for en bundle som den **laveste fællesnævner** af komponenternes lagerantal. Systemet sammensætter og nedbryder bundles automatisk.

Eksempel: Har du 10 flasker vin og 1 kasse kan der bestilles 1 6-pak + 4 enkeltflasker.

### Hvad sker hvis du forsøger at modtage en bundle
Du vil opleve en fejl. Bundle-SKU'er kan desuden ikke oprettes på en indkøbsordre.

### Relaterede emner
→ Se: Bundles (Admin → Produkter)
→ Se: Ankomst — Behandl (trin-for-trin)

---

## Ankomst — Batch/LOT-sporing

### Hvad er det
Systemet opretter et lagerparti (StockingLot) for hvert batch der modtages. Dette parti følger varen fra modtagelse til forsendelse og muliggør fuld sporbarhed.

### Hvad registreres i et lagerparti

| Data | Beskrivelse |
|------|-------------|
| **Batch-nummer** | Leverandørens lotnummer |
| **Mængde** | Antal enheder modtaget |
| **Placering** | Hyldeplads varen er placeret på |
| **Ankomstdato** | Dato og tid for modtagelse |
| **Udløbsdato** | Hvis aktiveret på varen |
| **Produktionsdato** | Hvis aktiveret på varen |
| **Bruger** | Hvem der modtog varen |

### FIFO og FEFO
Systemet prioriterer automatisk:
- **FIFO** (First In First Out): Ældste parti plukkes først
- **FEFO** (First Expired First Out): Parti med tidligst udløbsdato plukkes først

Juster prioritet via tandhjulet i Lagerrevision.

### Sporbarhed
Batch-nummer følger varen: modtagelse → lagerparti → plukordre → forsendelseslinje → modtager.

Søg på batch-nummer: Admin → Kunder → Batchsporing.

### Typiske fejl

| Fejlkode | Årsag | Løsning |
|----------|-------|---------|
| **1206 StockingLotMissingBatchNumber** | Batch-nummer ikke angivet ved ankomst | Angiv batch-nummer |
| **352 ItemBatchNumberRequired** | Batch-nummer mangler ved plukbekræftelse | Angiv batch-nummer |

### Relaterede emner
→ Se: Lagerrevision — LOT/Batch håndtering
→ Se: Batchsporing (Admin)
→ Se: Ankomst — Ekstrafelter

---

# DEL 5 — RETUR

---

## Retur — Modtagelse af returpakke

### Hvad er det
Workflow til behandling af alle typer kundereturer direkte på terminalen. Med Shopify-integration kan en returvare modtages, lagerføres og kunden krediteres med blot 4 klik.

### Hvornår bruges det
Når en kunde returnerer en pakke til lageret.

### Åbn returmodulet
Fra **Ankomster** → tryk **Modtag returpakke**

### Trin 1 — Identificér forsendelsen

Scan **track & trace nummeret** på pakken, eller søg på:
- Ordrenummer
- Reference

Systemet identificerer automatisk returtypen.

→ Se: Retur — Returtyper

### Trin 2 — Behandl returvarerne

For **hver returneret vare**:

| Felt | Beskrivelse | Muligheder |
|------|-------------|-----------|
| **Varebillede, SKU, navn** | Vises automatisk | (information) |
| **Antal** | Angiv returneret antal | Max = originalt bestilt antal |
| **Returhåndtering** | Hvad kunden kompenseres med | Refusion / Butikkredit / Gavekort / Ombytning |
| **Returårsag** | Årsag til returnering | Konfigureres i Admin → Returårsager |
| **Forsendelsesinfo** | Evt. rettelser | Adresse, leveringsmetode, pakkeshop |

### Trin 3 — Lagerplacering

1. Tag varerne ud af kassen fysisk
2. Scan varerne én ad gangen
3. Scan **lagerplacering** — varen registreres direkte på lageret, ELLER
4. Scan en **tote** som midlertidig placering (flyttes til lager efterfølgende)

**Alternativ:** Tryk **"Afslut uden placering"** — kræver bekræftelse. Bruges kun undtagelsesvist.

### Afslut
Tryk **Afslut retur** → returnotat kan printes.

### Relaterede emner
→ Se: Retur — Returtyper
→ Se: Retur — Bundlevarer ved retur
→ Se: Returportal (Admin)

---

## Retur — Returtyper

### Hvad er det
De tre typer af returer systemet skelner imellem ved modtagelse.

| Type | Beskrivelse | Håndtering |
|------|-------------|-----------|
| **Reklamation** | Defekt eller fejlbehæftet vare | Sættes til side til separat behandling — vurderes manuelt |
| **Uafhentet** | Kunden hentede ikke pakken fra pakkeshop | Returneres til lager og genindlægges |
| **Kundeinitieret retur** | Kunden ønsker at returnere (fortrydelsesret, forkert størrelse etc.) | Behandles med valgt returhåndtering |

### Systemlogik
Returtypen identificeres automatisk baseret på track & trace nummeret og ordrehistorikken. Du behøver ikke vælge den manuelt.

### Relaterede emner
→ Se: Retur — Modtagelse af returpakke
→ Se: Returårsager (Admin)
→ Se: Returhandlinger (Admin)

---

## Retur — Bundlevarer ved retur

### Hvad er det
Særlig håndtering der kræves når en returneret ordre indeholder bundle-varer.

### Systemlogik
Bundlevarer i returflows vises med en **advarsel** på skærmen. De kan ikke behandles automatisk som almindelige varer.

### Hvad gør du
1. Systemet viser advarslen
2. Godkend/behandl bundlevaren manuelt
3. Returner de individuelle komponenter til lager

### Relaterede emner
→ Se: Ankomst — Bundles (VIGTIG REGEL)
→ Se: Retur — Modtagelse af returpakke

---

# DEL 6 — MODTAG TRANSFER

---

## Modtag Transfer

### Hvad er det
Modtagelse af varer der er overført fra et andet lager eller afdeling via en transfer-ordre.

### Hvornår bruges det
Når din lokation modtager varer fra en anden SmartPack-lokation.

### Sådan fungerer det — trin-for-trin

1. Fra **Ankomster** → tryk **Modtag transferpakke**
2. Scan **pakkelabelen** (QR-koden på transferpakken)
3. Terminalen viser de forventede varer fra transfer-ordren
4. Scan og bekræft varerne én ad gangen
5. Systemet opdaterer transfer-recorden automatisk og registrerer varerne på din lokation

### Systemlogik
Transfer-modtagelse trækker varerne fra afsenderlokaliteten og tilføjer dem til modtagerlokaliteten. Begge bevægelser registreres i flytningshistorikken.

### Relaterede emner
→ Se: Transfer ordre — komplet guide (Admin)
→ Se: Ankomst — Oversigt


---

# DEL 7 — PLUK ORDRER

---

## Pluk Ordrer — Generer plukliste

### Hvad er det
Funktionen der opretter en ny plukliste. SmartPack udvælger ordrer baseret på plukprofil og beregner den korteste mulige plukkerute via A* pathfinding og TSP-algoritmer.

### Hvornår bruges det
Når en medarbejder skal starte en ny plukerunde.

### Sådan fungerer det — trin-for-trin

1. Vælg **Pluk Ordrer** i menuen
2. Vælg **plukprofil** (knapper vises for alle konfigurerede profiler)
3. Juster indstillinger efter behov (se tabel)
4. Scan din **startplacering** — bruges til ruteberegning
5. Tryk **Generer**
6. SmartPack udvælger ordrer og beregner optimal rute
7. Pluklisten starter

### Indstillinger ved generering

| Indstilling | Beskrivelse | Eksempel |
|-------------|-------------|---------|
| **Plukprofil** | Vælg profil der matcher opgaven | Multipluks, Runner, Priority |
| **Zone** | Filtrer til specifik lager-/ekspeditionszone | Zone A, Zone B |
| **Kunde / Shop** | Filtrer til specifik shop (relevant ved 3PL) | Shop 1, Shop 2 |
| **Startplacering** | Scan startplacering — bruges til ruteberegning | A-01-01 |
| **Maks. forsendelser** | Max antal ordrer/totes — tilpas til kasser på vognen | 8, 12, 16 |
| **Prime plukliste** | Markér som høj prioritet | ✅ / ☐ |
| **Tillad genopfyldningspluk** | Inkludér genopfyldningsvarer i listen | ✅ / ☐ |
| **Manuel filter** | Vælg specifikke ordrer fra en liste | Valgfrit |

### Live-tæller
En tæller viser antal ordrer der vil indgå i listen med de aktuelle indstillinger. Opdateres i realtid når du justerer filtre.

### Genveje (uden at generere via menu)

| Stregkode | Effekt |
|-----------|--------|
| `t_`-stregkode | Hop direkte til pluklisten for denne tote |
| `tr_`-stregkode | Tilknyt rullevogn til igangværende plukliste |

### Systemlogik
SmartPack bruger **A* pathfinding** til at finde korteste vej mellem plukpunkter og **TSP (Travelling Salesman Problem)**-algoritmer til at optimere den samlede rute. Startplaceringen er udgangspunkt for beregningen — jo tættere du starter på de første plukpunkter, jo kortere er den beregnede rute.

### Best practice
- Hold vognen tæt på dig — systemet sorterer pluk så du aldrig går unødigt frem og tilbage
- Scan startplacering præcist — den placering du faktisk står ved, ikke en placering tæt på

### Relaterede emner
→ Se: Plukstrategi — Multipluks Ordre
→ Se: Plukstrategi — Runner / Singlelines
→ Se: Aktiv plukning — Trin-for-trin
→ Se: Plukkeprofiler — komplet guide (Admin)

---

## Plukstrategi — Multipluks Ordre (med totes)

### Hvad er det
Plukning af flere ordrer simultaneously, hvor hver ordre sorteres til sin egen tote/plukkasse under plukningen. Den mest almindelige strategi til ordrer med flere varelinjer.

### Hvornår bruges det
- Ordrer med flere forskellige SKU'er
- Når du vil sortere ordrer direkte under pluk (ikke i pakkeriet)

### Sådan fungerer det — trin-for-trin

1. Juster **Maks. forsendelser** til antal kasser på din vogn
2. Scan **startplacering**
3. Tryk **Generer**
4. Gå til den første angivne hyldeplacering
5. **Scan varens stregkode**
6. **Scan toten** (`t_`-stregkode) — varen registreres i korrekt tote
7. Gentag for hvert plukpunkt
8. Tryk **Afslut** når listen er færdig

### Tote-tildeling
- Systemet tildeler automatisk hvilken tote der hører til hvilken ordre
- Allerede påbegyndte ordrer: SmartPack husker den tildelte tote
- Ny ordre der skal have tote: Systemet viser `?` — vælg en ledig tote

### Systemlogik — fejlsikring
Systemet **afviser** forkerte scans øjeblikkeligt:
- Scanner du en forkert vare → fejlmelding
- Scanner du en forkert tote → fejlmelding
- Du kan ikke begå fejl hvis du følger systemets anvisninger

### Best practice
- Hav vognen tæt på dig hele ruten
- Store ordrer: scan en fri vogn-lokation direkte som tote (hvis vognen er oprettet som placering)

### Relaterede emner
→ Se: Aktiv plukning — Vogn og tote
→ Se: Pluk Ordrer — Generer plukliste

---

## Plukstrategi — Runner / Singlelines (uden totes)

### Hvad er det
Plukning af enkeltlinje-ordrer eller 100% identiske ordrer uden brug af totes. Alle varer blandes i én kasse og adskillelse sker i pakkeriet.

### Hvornår bruges det
- Ordrer med kun én varelinje (singlelines)
- 100% identiske ordrer der kan plukkes samlet

### Sådan fungerer det — trin-for-trin

1. Scan **startplacering**
2. SmartPack beregner ruten
3. Gå til lokation
4. Scan **produktets stregkode**
5. SmartPack bekræfter antal der skal plukkes
6. Gentag for alle plukpunkter
7. Tryk **Afslut** når listen er plukket

### Forskel fra Multipluks
Runner-ordrer **scannes ikke til en tote** — alle varer blandes i én kasse eller på vognen. Adskillelse sker i pakkeriet ved pakning.

### Relaterede emner
→ Se: Plukstrategi — Multipluks Ordre
→ Se: Pakningsprocessen — Manuel ordre

---

## Plukstrategi — Masseprint

### Hvad er det
Strategi til 100% identiske ordrer der plukkes samlet og afsendes med labelprint for alle ordrer på én gang.

### Hvornår bruges det
Når mange ordrer er 100% identiske — samme varer og antal.

### Sådan fungerer det — trin-for-trin

1. Scan **startplacering**
2. Scan **produktet**
3. Tryk **Afslut**
4. Alle labels printes på én gang

### Systemlogik
Ved masseprint genereres én label per ordre selvom de er identiske. Labels printes i batch til fragtlabelprinter.

### Relaterede emner
→ Se: Plukstrategi — Runner / Singlelines

---

## Plukstrategi — Priority

### Hvad er det
Identisk workflow som Multipluks Ordre, men ordrer er markeret som **VIGTIGE** og bør have første prioritet.

### Hvornår bruges det
Hasteordrer, VIP-kunder eller ordrer med tæt deadline.

### Systemlogik
Priority-lister vises fremhævet i terminalen. Brug dem inden du starter en normal Multipluks-liste.

### Relaterede emner
→ Se: Plukstrategi — Multipluks Ordre
→ Se: Plukkeprofiler — Generelle indstillinger (Admin)

---

## Plukstrategi — Pickup / Afhentning

### Hvad er det
Identisk workflow som Multipluks Ordre, men ordrer er afhentningsordrer. Bør prioriteres så kunder hurtigt kan afhente.

### Hvornår bruges det
Ordrer der skal afhentes fysisk af kunden i butikken/på lageret.

### Best practice
Prioritér Pickup-lister højt — en ventende kunde er der fysisk.

### Relaterede emner
→ Se: Plukstrategi — Multipluks Ordre

---

## Plukstrategi — Eksklusive profiler

### Hvad er det
Et system hvor plukkeprofiler evalueres i prioritetsrækkefølge, og en eksklusiv profil "fanger" ordrer der matcher — disse ordrer vises ikke på lavere profiler.

### Systemlogik

1. Alle eksklusive profiler sorteres fra **højeste til laveste prioritet**
2. Ordren evalueres mod profil med højeste prioritet
3. Matcher den: ordren **fanges** og vises kun på denne profil
4. Matcher den ikke: ordren evalueres mod næste profil
5. Profiler uden eksklusivitet viser ordren uanset

### Praktisk eksempel

| Profil | Prioritet | Eksklusiv | Fanger |
|--------|-----------|-----------|--------|
| "Alle ordrer" | 100 | Nej | Viser alle 100 ordrer |
| "Singleline" (max 1 varelinje) | 90 | Ja | Fanger 70 enkeltlinje-ordrer |
| "Resten" | 0 | Nej | Viser 30 tilbageværende |

### Best practice
Brug eksklusive profiler frem for "Ekskluder profiler"-indstillingen — det er den anbefalede og vedligeholdelsesvenlige metode.

### Relaterede emner
→ Se: Eksklusive plukkeprofiler (Admin)

---

## Aktiv plukning — Plukskærmen

### Hvad er det
Oversigt over informationerne der vises per plukpunkt under aktiv plukning.

### Hvad plukskærmen viser

| Element | Beskrivelse |
|---------|-------------|
| **Hyldeplacering** | Zone + reolnavn (fx A-03-02) |
| **Aktuel beholdning** | Lille grå boks med nuværende lagerantal på placeringen |
| **Varebillede** | Foto af varen |
| **Varenavn** | Produktets fulde navn |
| **SKU** | Varenummer |
| **Antal** | Antal der skal plukkes |
| **Tote** | Hvilken tote varen skal i |
| **Progress-tæller** | Plukket / Total (fx 5/23) |

### Relaterede emner
→ Se: Aktiv plukning — Interaktive elementer
→ Se: Aktiv plukning — Trin-for-trin

---

## Aktiv plukning — Trin-for-trin

### Hvad er det
Det fulde trin-for-trin flow for at gennemføre et enkelt plukpunkt under aktiv plukning.

### Fremgangsmåde

1. Gå til den angivne **hyldeplacering** (vist på skærmen)
2. Find varen (verificér med varebillede og navn)
3. **Scan varens stregkode** → plukket bekræftes
4. **Scan toten** (`t_`-stregkode) → varen registreres i korrekt tote
5. Gentag for næste plukpunkt
6. Tryk **Afslut** når alle plukpunkter er gennemført

### Systemlogik
Hvert scan valideres øjeblikkeligt. Forkert vare eller forkert tote → fejlmelding med det samme. Du kan ikke "gemme" en fejl til senere.

### Typiske fejl

| Situation | Handling |
|-----------|---------|
| Vare mangler på plads | → Se: Fejlhåndtering — Vare mangler |
| Plukket for mange | → Se: Fejlhåndtering — For mange varer |
| Plukliste fryser | Genstart terminalen |

### Relaterede emner
→ Se: Aktiv plukning — Plukskærmen
→ Se: Aktiv plukning — Interaktive elementer
→ Se: Fejlhåndtering — Vare mangler på hyldeplads

---

## Aktiv plukning — Interaktive elementer

### Hvad er det
Trykbare elementer på plukskærmen der giver adgang til ekstra funktioner uden at forlade pluklisten.

### Elementer og funktioner

| Element | Placering | Funktion |
|---------|-----------|---------|
| **Reol-ikon** | Venstre side | Åbner lagerinfo for aktuel placering — kontrollér/ret beholdning, start Placeringsrevision |
| **Produktbillede** | Højre side | Åbner produktinfo — detaljer, alle EAN-koder, alle placeringer, lagerstatus |
| **Reol-ikon** | Øverste højre hjørne | Finder tomme placeringer / genopfyldningsplaceringer nærmest dig |

### Relaterede emner
→ Se: Aktiv plukning — Plukskærmen
→ Se: Produktinfo / Vareinfo
→ Se: Placeringsrevision

---

## Aktiv plukning — Vogn og tote

### Hvad er det
Scanning af totes og vogne under aktiv plukning.

### Scankoder og effekt

| Scanning | Stregkode | Effekt |
|----------|-----------|--------|
| Tote | `t_`-stregkode | Tildel/skift tote til den aktuelle ordrelinje |
| Vogn | `tr_`-stregkode | Tilknyt rullevogn til pluklisten |

### Store ordrer
Hvis en ordre er meget stor og fylder en hel vogn: scan en fri vogn-lokation direkte som tote — forudsætter at vognen er oprettet som en placering i systemet.

### Systemlogik
Tote-tildelingen huskes per ordrelinje. Hvis en ordre allerede har en tote tildelt, bekræftes dette med et `!`-symbol. Ny tote kan altid tildeles.

### Relaterede emner
→ Se: Totes (Admin)
→ Se: Vogne (Admin)

---

## Fejlhåndtering — Vare mangler på hyldeplads

### Hvad er det
Procedure for hvad man gør når en vare ikke kan findes på den angivne hyldeplacering under plukning.

### Trin-for-trin

1. **Swipe til højre** på produktlinjen → rød **Problem**-knap vises
2. Tryk **Problem** → vælg handling:

| Handling | Hvornår brugt |
|----------|--------------|
| **Fjern produkt** | Varen kan slet ikke findes — angiv præcist antal der mangler |
| **Optæl produkt** | Mistanke om lageruoverensstemmelse — nulstil/opdater antal |
| **Skift plukplacering** | Varen er fundet andet sted end forventet |
| **Overstyr manuelt** | Manuel indgriben nødvendig |

3. Vælg hvad der sker med ordrens vare:

| Valg | Beskrivelse |
|------|-------------|
| **Send senere** | Produktet afsendes til kunden på et andet tidspunkt — opretter delordre automatisk |
| **Send ikke senere** | Produktet fjernes helt fra ordren |

### Edge cases
- Varen mangler pga. lageruoverensstemmelse: Brug "Optæl produkt" → nulstil → scan alle varer fysisk på placeringen
- Varen er på en anden placering: Brug "Skift plukplacering" → scan korrekt placering

### Best practice
Vælg altid "Send senere" fremfor "Send ikke senere" med mindre kunden aktivt ikke ønsker varen.

### Relaterede emner
→ Se: Fejlhåndtering — Delvist plukket ordre
→ Se: Lagerrevision (Stock Audit)

---

## Fejlhåndtering — Delvist plukket ordre

### Hvad er det
Procedure for ordrer der er delvist plukket og sat til side på grund af en fejl eller mangel.

### Trin-for-trin

1. Scan **toten** under **Pluk Ordrer** → ordren åbner ved den fejlede linje
2. Dobbelttjek lokationen
3. Mangler varen fysisk:
   - Tryk **reol-ikonet** (venstre side)
   - Vælg **Placeringsrevision**
   - Tryk **Nulstil antal**
   - Tag alle produkter fysisk fra placeringen
   - Scan dem én ad gangen
   - Scan placeringen igen for at bekræfte
4. Sæt den ufærdige tote til side til kundeservice

### 0/1 lister (uden tildelt tote)
Klik direkte på pluklisten i stedet for at scanne tote — derefter samme procedure som ovenfor.

### Relaterede emner
→ Se: Fejlhåndtering — Vare mangler
→ Se: Placeringsrevision
→ Se: Plukliste låst/optaget

---

## Fejlhåndtering — For mange varer plukket

### Hvad er det
Procedure når der er plukket et større antal end forventet.

### Trin-for-trin

1. Dobbelttjek at varen ikke mangler i en anden ordre
2. Scan produktet i **Produktinfo**
3. Se den korrekte lokation
4. Læg de ekstra varer tilbage på korrekt placering

### Relaterede emner
→ Se: Produktinfo / Vareinfo
→ Se: Aktiv plukning — Trin-for-trin

---

## Fejlhåndtering — Ordre annulleret i shop

### Hvad er det
Situation hvor en ordre er annulleret i webshopen (Shopify etc.) men stadig er aktiv i SmartPack fordi pakning er påbegyndt.

### Hvornår opstår det
Pakning er startet → SmartPack pauser ordren i stedet for at annullere den.

### Løsning — kør pakkeprocessen baglæns

1. Pak Ordrer → find toten → tryk **rødt kryds** → ordren flyttes til plukliste med `!`
2. Åbn pluklisten → sæt alle varelinjer til **0 stk.** → tryk **Pluk** (læg varerne fysisk tilbage)
3. Alle = 0 → gå til aktive pluklister → swipe listen til venstre → **Annullér**
4. Ordren kan nu annulleres/synkes korrekt med shoppen

### Relaterede emner
→ Se: Pak Ordrer — Toteliste oversigt


---

# DEL 8 — PAK ORDRER

---

## Pak Ordrer — Toteliste oversigt

### Hvad er det
Oversigten der viser alle totes der er klar til pakning, organiseret i sektioner.

### Sektioner i oversigten

| Sektion | Beskrivelse |
|---------|-------------|
| **Aktive totes** | Sorteret efter totenavn eller plukliste/alder |
| **Vogngruppering** | Totes på en specifik vogn vises samlet |
| **Afventende** | Kræver manuel handling |
| **Historik** (ur-ikon) | Alle pakkede ordrer for dagens arbejdsdag |

### Sortering
Totes sorteres efter konfiguration:
- **Totenavn** — alfabetisk
- **Plukliste + Alder** — ældste plukliste øverst

→ Indstilles under Indstillinger → Totesortering

### Relaterede emner
→ Se: Pak Ordrer — Naviger til en ordre
→ Se: Indstillinger (Terminal)

---

## Pak Ordrer — Naviger til en ordre

### Hvad er det
De metoder der kan bruges til at åbne og starte pakningsprocessen for en specifik ordre.

### Navigationsmetoder

| Metode | Beskrivelse | Hastighed |
|--------|-------------|----------|
| **Scan tote-QR** | Scan QR-koden på den fysiske tote | ⚡ Hurtigst |
| **Dobbeltklik på tote** | Klik to gange på toten i listen | Hurtig |
| **Søg** | Filtrer efter navn eller ordrenummer | Manuel |
| **Scan vogn** (`tr_`) | Sæt aktiv vogn-kontekst | Kontekst |

### Best practice
Brug altid scanning af tote-QR — det er den hurtigste og fejlfrie metode.

### Relaterede emner
→ Se: Pak Ordrer — Toteliste oversigt
→ Se: Pakningsprocessen — Trin-for-trin

---

## Pak Ordrer — OID-assistent

### Hvad er det
En slide-out panel der viser fuld ordredata for en specifik tote/ordre.

### Hvornår bruges det
Når du har brug for at se eller redigere ordredetaljer inden pakning.

### Åbn OID-assistenten
Tryk på **ordrenummeret** i listen eller i pakskærmen.

### Indhold

| Information | Detalje |
|-------------|---------|
| **Ordredata** | Ordrenummer, dato, status |
| **Leveringsadresse** | Fuld adresse med mulighed for redigering |
| **Vareliste** | Alle varelinjer med antal |
| **Udskriv følgeseddel** | Send til A4-printer |
| **Udskriv label** | Genudskriv fragtlabel |

### Relaterede emner
→ Se: Pakningsprocessen — Trin-for-trin
→ Se: Ordreinfo

---

## Pakningsprocessen — Trin-for-trin

### Hvad er det
Det fulde flow for pakning af en ordre fra en tote inkl. labelprint og afslutning.

### Trin-for-trin

| Trin | Handling | Detalje |
|------|---------|---------|
| 1 | Scan QR-koden på toten | Eller åbn fra listen |
| 2 | Verificér varer | Alle forventede varer i ordren vises |
| 3 | Håndter store ordrer | Kan ikke alt være i én pakke: sæt antal til **0** for varer der bliver i toten |
| 4 | Vælg printer | Scan QR-koden på printeren |
| 5 | Angiv mål (hvis påkrævet) | Bredde × Længde × Højde, vægt |
| 6 | Label printes | Fragtlabelen udskrives automatisk |
| 7 | Afslut ordre | Tryk **Afslut ordre** → nedtælling 0–5 sek. |

### Print-alternativer

| Metode | Betingelse |
|--------|-----------|
| Scan produkt-EAN | Auto-print slået til → label printes automatisk |
| Dobbeltklik på tote | Vælg **Udskriv manuelt** |
| Scan printer-QR | Vælg hvilken printer der bruges |

### Relaterede emner
→ Se: Pakningsprocessen — Alle tilgængelige handlinger
→ Se: Labelprint — Fejl og løsninger

---

## Pakningsprocessen — Manuel ordre (Runner/Singlelines)

### Hvad er det
Forenklet pakningsflow for Runner og Singlelines-ordrer der ikke bruger totes.

### Trin-for-trin

1. Scan **QR-koden på printeren** → terminalen bruger denne printer til alle efterfølgende prints
2. Scan **produktets EAN-kode** → label udskrives automatisk (auto-print)
3. Er auto-print slået **fra**: scan QR-koden på printeren igen, eller vælg Udskriv på skærmen

### Systemlogik
Manuel ordre går direkte fra pluk til pakning uden tote-scanning.

### Relaterede emner
→ Se: Pakningsprocessen — Trin-for-trin
→ Se: Printerindstillinger

---

## Pakningsprocessen — Fast Pack

### Hvad er det
En forenklet pakningsskærm optimeret til høj-volumen pakning der prioriterer hastighed over manuel vareverifikation.

### Hvornår bruges det
Pakstationer med højt volumen og veldefinerede ordrer.

### Serienummersporing i Fast Pack
Fast Pack er det sted i flowet hvor **serienumre** registreres og knyttes til forsendelseslinjen. Operatøren scanner/indtaster serienummeret under pakning.

→ Se: Serienummersporing (Admin)

### Relaterede emner
→ Se: Pakningsprocessen — Trin-for-trin

---

## Pakningsprocessen — Alle tilgængelige handlinger

### Hvad er det
Komplet oversigt over alle handlinger der er tilgængelige på pakskærmen.

### Handlingsoversigt

| Handling | Beskrivelse |
|----------|-------------|
| **Scan produkt-EAN** | Bekræfter varen som pakket |
| **Auto vægt** | Henter vægt fra varedata i systemet |
| **Manuel vægt** | Integrer med tilkoblet vægtenhed |
| **Tilføj pakke (+)** | Én ordre kan fordeles på flere pakker |
| **Slet pakke** | Fjern overflødig/fejloprettet pakke |
| **Udskriv label** | Send fragtlabel til labelprinter |
| **Udskriv følgeseddel** | Send følgeseddel til A4-printer |
| **Rødt kryds** | Afbryd pakning → ordren flyttes til plukliste med `!` |

### Oversize-advarsel
Systemet advarer automatisk hvis pakken overskrider transportørens maksimale mål (dimensioner og/eller vægt).

### Fejlkode 1404 PackageTooManyItems
Opstår hvis pakken indeholder for mange varer ift. konfigurationen.
Løsning: Opret ekstra pakke (+) og fordel varerne.

### Relaterede emner
→ Se: Labelprint — Fejl og løsninger
→ Se: Fejlkoder — Quick Reference

---

## Labelprint — Fejl og løsninger

### Hvad er det
Oversigt over alle fejl der kan opstå ved udskrivning af fragtlabels og hvordan de løses.

### Fejlguide

| Problem | Årsag | Løsning |
|---------|-------|---------|
| Fejl i modtageradresse | Adressedata forkert | Tryk ordrenummer → ret → prøv igen |
| Adresse for lang | For mange tegn i adressefeltet | Forkort adressen |
| Mangler husnummer | Adresse ufuldstændig | Tilføj husnummer |
| Forkert postnummer | Postnummer matcher ikke by/land | Ret postnummer |
| Mangler telefonnummer | Transportøren kræver telefon | Tilføj telefonnummer på ordren |
| Transportøren melder fejl | Fragtintegration afviser data | Se fejlmelding → ret → prøv igen |
| Printer offline (fejl 1002: PrinterNotOnline) | Printeren er slukket eller offline | Tjek printer er tændt og forbundet |
| "Select Printer" vises | Ingen printer valgt | Gå til Indstillinger → vælg printer |
| Printservice kører ikke | Windows-program lukket | Åbn Printservice fra systembakke på Windows-PC |
| DNS-problem | DNS-cache forældet | Kør `ipconfig /flushdns` i CMD på **alle** computere med Printservice |
| Landet er lukket | Transportøren leverer ikke til landet | Kontakt transportøren eller vælg anden leveringsmetode |
| Ingen løsning mulig | Kompleks fejl | Tryk **rødt X** → sæt tote til problemordrer til kundeservice |

### Relaterede emner
→ Se: Printservice — Opsætning (Windows)
→ Se: Labelprint — Genudskriv
→ Se: Flush DNS

---

## Labelprint — Genudskriv (pakket ordre)

### Hvad er det
Procedure for at genudskrive en fragtlabel for en ordre der allerede er pakket og afsluttet.

### ⚠️ VIGTIG FORSKEL — To print-knapper med forskellig effekt

| Knap | Effekt |
|------|--------|
| **"Udskriv igen"** | Genbruger den originale label — samme stregkodenummer |
| **Grøn Print-knap** | Genererer en **ny** label med nyt stregkodenummer |

**Brug normalt "Udskriv igen"** — transportøren forventer det originale labelnummer.

### Trin-for-trin

1. Pak Ordrer → tryk **ur-ikonet** (historik, øverst til højre)
2. Find ordren i historiklisten
3. Tryk ind på ordren
4. Rul ned
5. Tryk **"Udskriv igen"** — systemet bekræfter

### Relaterede emner
→ Se: Labelprint — Fejl og løsninger
→ Se: Pakningsprocessen — Alle tilgængelige handlinger

---

## Labelprint — Glemt produkt i pakket ordre

### Hvad er det
Procedure for at finde hvilken ordre et glemt produkt tilhører, efter ordren er pakket og afsluttet.

### Trin-for-trin

1. Pak Ordrer → tryk **ur-ikonet** (historik)
2. **Scan produktets EAN-stregkode** direkte på historikskærmen
3. De relevante ordrer der indeholdt dette produkt **blinker** på skærmen
4. Identificér den rigtige ordre
5. Håndter: genåbn ordren eller tilføj produktet manuelt

### Relaterede emner
→ Se: Labelprint — Genudskriv
→ Se: Pak Ordrer — Toteliste oversigt

---

# DEL 9 — FLYT LAGER OG GENOPFYLDNING

---

## Flyt Lager — Genopfyldningsliste fra totes

### Hvad er det
Den anbefalede metode til at lagerføre varer fra totes (modtagne leverancer eller plukket materiale) til endelige hyldeplaceringer.

### Hvornår bruges det
Når varer er modtaget til totes og skal flyttes til hylderne, eller når genopfyldning af plukpladser skal ske fra baglageret.

### Trin-for-trin

1. Vælg **Flyt Lager**
2. Vælg én eller flere totes fra listen
3. Tryk **Opret genopfyldningsliste**
4. Scan din **aktuelle position** → SmartPack beregner korteste rute
5. Vælg toten øverst på listen
6. Vælg de produkter der skal flyttes til lager
7. SmartPack foreslår placering (foretrukken eller eksisterende)
8. Du kan vælge en anden placering end den foreslåede
9. Gentag for alle produkter

### Systemlogik
Ruteberegningen bruger A*-algoritmen ud fra din startplacering. Produkter med foretrukne placeringer (`PreferredStockPlacementId`) prioriteres til disse.

### Relaterede emner
→ Se: Flyt Lager — Direkte flytning
→ Se: Foretrukken Placering (Admin)

---

## Flyt Lager — Direkte flytning (placering til placering)

### Hvad er det
Manuel flytning af varer direkte fra én placering til en anden uden brug af totes.

### Hvornår bruges det
- Omorganisering af lageret
- Korrekt placering af fejlplacerede varer
- Intern flytning uden forudgående tote-modtagelse

### Trin-for-trin

1. Scan **kildeplacering** (fra-placeringen)
2. Varerne på kildeplacering vises
3. Scan **varens stregkode** → angiv antal der skal flyttes
4. Scan **destinationsplacering** (til-placeringen)
5. Tryk **Bekræft**

### Relaterede emner
→ Se: Flyt Lager — Genopfyldningsliste fra totes

---

## Flyt Lager — Sektionsoversigt

### Hvad er det
Oversigt over alle sektioner der er tilgængelige i Flyt Lager-appen.

### Sektioner

| Sektion | Beskrivelse |
|---------|-------------|
| **Parkerede varer** | Varer på pause til genopfyldning |
| **Genopfyldningszone** | Afventende genopfyldningsopgaver |
| **Totezone** | Varer i totes der afventer lagerføring |
| **Restocking-lister** | Opret og administrer restocking-lister |

### Relaterede emner
→ Se: Flyt Lager — Genopfyldningsliste fra totes

---

## Nedlæg plukliste

### Hvad er det
Funktion der overfører varer fra en aktiv plukliste direkte til en anden lokation (fx butikslager) i stedet for at pakke dem som en forsendelse.

### Hvornår bruges det
Interne overførsler til fysiske butikker eller afdelinger der deler lager.

### Trin-for-trin

1. Åbn aktiv plukliste
2. Vælg **Nedlæg plukliste**
3. Varerne registreres som overført til butikslokationen

### Relaterede emner
→ Se: Transfer ordre (Admin)


---

# DEL 10 — REVISION

---

## Lagerrevision (Stock Audit)

### Hvad er det
Funktion til at tælle og regulere lagerantallet for én specifik vare på en given placering. Giver mulighed for præcis korrektion med årsagskode og sporbarhed.

### Hvornår bruges det
- Mistanke om lageruoverensstemmelse for en enkelt vare
- Bekræftelse af lager ved pluk (OBS-liste)
- Rutinemæssig stikprøvekontrol

### Åbn Lagerrevision
Tryk **Lagerrevision** i menuen.

### Trin-for-trin

1. Find varen via én af disse metoder:
   - Søg på produktnavn
   - Søg på EAN-kode
   - Scan placeringsstregkode
   - Scan varens stregkode

2. Systemet viser varen med alle placeringer og lagerantal

3. **Notationen `5/5/10` forklaret:**

| Tal | Betydning |
|-----|-----------|
| Første tal (5) | Antal LOT'er registreret på placeringen |
| Andet tal (5) | Aktuelt registreret lagerantal |
| Tredje tal (10) | Originalt ankomst-antal (hvad der burde være der) |

4. Ret antallet med **+ / −** knapperne
5. Vælg en **årsagskode:**

| Årsagskode | Forklaring |
|------------|-----------|
| **StockAudit** | Generel lagerrevision — uoverensstemmelse fundet |
| **ItemMissing** | Vare fysisk mangler — tyverisikring, spild |
| **DamagedGoods** | Beskadiget vare fjernes fra salgsbart lager |
| **ProductionUsed** | Varen er brugt til produktion/assembly |
| **Other** | Andet — noter årsag i kommentarfeltet |

6. Tryk **Gem** → regulering registreres med tidsstempel og bruger

### Systemlogik
- Reguleringer kræver evt. godkendelse fra admin (afhænger af systemindstillinger)
- Reguleringen logges: hvem, hvornår, hvad, placering, før-antal, efter-antal
- LOT-baserede varer: regulering kan udføres per LOT/batch — du vælger det specifikke lagerparti

### Typiske fejl

| Fejl | Løsning |
|------|---------|
| Kan ikke finde placering | Kontrollér at placeringen eksisterer i lagerdesigneren |
| Regulering afvises | Kræver adminbekræftelse — kontakt ansvarlig |

### Edge cases
- Løbende optælling (automatisk revision): kan trigges automatisk ved pluk som popup
- `ItemNotFound (301)`: varen er ikke registreret i systemet → opret produktet

### Best practice
Brug altid specifik årsagskode — generel "Other" bør undgås. Sporbarhed er vigtigst.

### Relaterede emner
→ Se: Lagerrevision — LOT/Batch håndtering
→ Se: Lagerrevision — Karantæne
→ Se: Løbende optælling
→ Se: Lagerreguleringer — Godkend (Admin)

---

## Lagerrevision — LOT/Batch håndtering

### Hvad er det
Specifik håndtering af lagerpartier (LOT/batch) under revision, herunder ændring af plukrækkefølge.

### Prioritering — tandhjulet

Tryk **tandhjulet** ved siden af et LOT for at justere plukrækkefølge:

| Valg | Beskrivelse |
|------|-------------|
| **Sæt til Top** | Dette LOT plukkes som det første |
| **Sæt til Bund** | Dette LOT plukkes sidst |
| **FIFO** | Sorter alle LOT'er efter ankomstdato (ældst plukkes først) |
| **FEFO** | Sorter alle LOT'er efter udløbsdato (tidligst udløbsdato plukkes først) |

### Systemlogik
FIFO og FEFO er globale indstillinger der kan overstyres per vare under revision. Ændring af prioritet slår igennem ved næste plukning.

### Relaterede emner
→ Se: Lagerrevision — Karantæne
→ Se: Ankomst — Batch/LOT-sporing

---

## Lagerrevision — Karantæne

### Hvad er det
Markering af et specifikt lagerparti som karantæne — forhindrer plukning fra partiet uden at fjerne det fra lageret fysisk.

### Hvornår bruges det
- Mistanke om defekt batch
- Afventende kvalitetskontrol
- Tilbagekald af specifikt batch

### Sæt i karantæne

1. Lagerrevision → find varen → find LOT-nummeret
2. Tryk **tandhjulet** ud for LOT-nummeret
3. Vælg **"Sæt i karantæne"**
4. LOT markeres som karantæne

### Effekt af karantæne

| Effekt | Beskrivelse |
|--------|-------------|
| **Tæller ikke med i salgsbart antal** | Vises ikke som tilgængeligt lager |
| **Kan ikke plukkes** | Systemet springer karantæne-LOT'er over |
| **Vises i detaljeret lagerliste** | Synlig for admin via Admin → Produkter → Detaljeret lagerliste |

### Frigiv fra karantæne
Samme sted: Lagerrevision → tandhjul → **"Frigiv fra karantæne"**

### Relaterede emner
→ Se: Lagerrevision — LOT/Batch håndtering
→ Se: Ankomst — Batch/LOT-sporing

---

## Placeringsrevision

### Hvad er det
Fuld revision af **alle varer** på én given placering. Modsat Lagerrevision (som gælder én vare) dækker Placeringsrevision alle SKU'er på den valgte placering.

### Hvornår bruges det
- Fuld kontrol af en hylde eller zone
- Rutinemæssig zoneoptælling
- Fejlfinding ved lageruoverensstemmelse på en placering

### Trin-for-trin

1. Tryk **Placeringsrevision** i menuen
2. Scan **placeringsstregkoden**
3. Alle varer på placeringen vises med antal
4. For hver vare:
   - Bekræft antallet (er det korrekt → tryk bekræft)
   - Korrigér med + / − (er det forkert → justér)
   - Angiv årsagskode
5. Tryk **Gem** for alle tilpassede værdier

### Nulstil og scan på ny
Tryk **Nulstil antal** → alle antal nulstilles → scan alle varer fysisk én ad gangen → system verificerer.

### Systemlogik
Nulstilling bruges til at lave en "tom kasse og tæl op" revision — al tvivl om hvad der er hvad fjernes. Scan derefter hvert fysisk produkt for at opbygge et bekræftet antal.

### Relaterede emner
→ Se: Lagerrevision (Stock Audit)
→ Se: Løbende optælling

---

## Løbende optælling (automatisk revision)

### Hvad er det
Et regelbaseret system der automatisk beder medarbejdere om at tælle en vares antal under aktive plukoperationer, typisk når lagerniveauet nærmer sig en grænse.

### Hvornår bruges det
Systemet aktiveres automatisk — medarbejderen behøver ikke at starte noget manuelt.

### Trigger-regler (konfigureres i Admin)

| Felt | Beskrivelse | Eksempel |
|------|-------------|---------|
| **Navn** | Navn på reglen | "Lav beholdning < 5 stk." |
| **Udløsningsregel** | Antal der udløser revision | `5` → popup vises under pluk når lager ≤ 5 |
| **Udløser i alt lagermængde** | Aktivér kun ved udløsning på **hele** lagerets total | ☐ = per placering, ✅ = totalt på alle placeringer |
| **Max revisionsalder** | Minimum antal dage mellem to revisioner af samme placering | `30` dage → ingen popup igen i 30 dage |
| **Medarbejder cooldown** | Minutter en medarbejder ikke spammes | `60` minutter |
| **Aktiv** | Er reglen aktiveret | ✅ / ☐ |

### Best practice for opsætning (Admin-anbefaling)

| Typisk ordrestørrelse | Anbefalet udløsningsregel |
|----------------------|--------------------------|
| 1 stk. per ordre | 5 stk. |
| 5–6 stk. per ordre | 25–30 stk. |

### Hvad sker der under pluk
En popup vises: "Bekræft antal på placeringen"
Medarbejderen tæller og bekræfter eller retter antallet.
Revisionen logges automatisk.

### Systemlogik
Løbende optælling eliminerer behovet for periodiske lukkede lageroptællinger. Lageret kontrolleres kontinuerligt i hverdagen.

### Relaterede emner
→ Se: Lagerrevision (Stock Audit)
→ Se: Placeringsrevision
→ Se: Revisionszoner (Admin)


---

# DEL 11 — ANDRE APPS

---

## Ordreinfo

### Hvad er det
En opslagsapp til at finde og se detaljer om en specifik ordre — og til at redigere modtageradresse direkte fra terminalen.

### Hvornår bruges det
- Tote-identification: hvad er der i den kasse?
- Kundeservice: hurtigt slå op en ordres status
- Adresserettelser: ændr adresse inden pakning

### Trin-for-trin

**Slå ordre op via tote:**
1. Vælg **Ordreinfo**
2. Scan **tote-labelen**
3. Ordredetaljer vises øjeblikkeligt

**Slå ordre op manuelt:**
1. Vælg **Ordreinfo**
2. Søg på ordrenummer eller reference
3. Ordredetaljer vises

### Hvad vises

| Data | Beskrivelse |
|------|-------------|
| Ordrenummer | Unikt identifikator |
| Status | Aktuelt stadie i ordreflow |
| Modtager | Navn, adresse, telefon, email |
| Varelinjer | Alle produkter og antal |
| Forsendelsesmetode | Transportør og service |
| Tidslinje | Alle hændelser på ordren med tidsstempel og bruger |

### Redigering
Tryk **rediger** (blyant-ikon) → adressefelter kan ændres → gem.

### Relaterede emner
→ Se: Pak Ordrer — OID-assistent
→ Se: Ordredetaljer (Admin)

---

## Produktinfo / Vareinfo

### Hvad er det
En opslagsapp til at finde alle oplysninger om et specifikt produkt — og til at administrere stregkoder og udskrive labels.

### Hvornår bruges det
- Slå en vares lagerplacering op
- Se alle EAN-koder for en vare
- Tilføj ny stregkode til varen
- Opret ny vare direkte fra terminalen
- Print stregkodelabels til hylden

### Sådan finder du en vare

| Metode | Handling |
|--------|---------|
| **Scan EAN** | Scan varens stregkode direkte |
| **Søg** | Skriv SKU, navn, stregkode |
| **Manuel søgning** | Scroll gennem produktliste |

### Hvad vises

| Data | Beskrivelse |
|------|-------------|
| SKU | Varenummer |
| Navn | Produktnavn |
| EAN-koder | Alle tilknyttede stregkoder |
| Placering(er) | Alle lagerpladser med antal |
| Lagerantal | Totalt, reserveret, tilgængeligt |
| Mål og vægt | Dimensioner og vægt |
| Billede | Produktfoto |

### Handlinger

| Handling | Beskrivelse |
|----------|-------------|
| **Tilføj stregkode** | Scan ny stregkode → tilknyttes varen |
| **Kolli-stregkode** | Tilføj stregkode der repræsenterer X antal ved scan |
| **Udskriv stregkode** | Print EAN-label til etiketprinter |
| **Opret kladde** | Opret ny vare som kladde — udfyldes færdig i Admin |
| **Juster vægt og mål** | Opdatér dimensioner direkte fra terminalen |

### Systemlogik — Kolli-stregkoder
En kolli-stregkode registrerer automatisk et foruddefineret antal ved scanning. Eksempel: stregkode på en 12-pak registrerer 12 stk. ved scanning — ingen manuel talindtastning nødvendig.

### Relaterede emner
→ Se: Produktadministration (Admin)
→ Se: Stregkodepræfikser og systemkoder

---

## Produktion

### Hvad er det
App til håndtering af kitting og produktionsbatches — samling af komponenter til færdige produkter (kollektions-produkter/bundles der produceres fysisk).

### Hvornår bruges det
Når SmartPack bruges til at styre produktionsordrer, kitting eller samling af komponentvarer til salgsfærdige enheder.

### Trin-for-trin

1. Vælg **Produktion** i menuen
2. Vælg et afventende produktionsbatch
3. **Scan komponentvarerne** én ad gangen
4. Systemet bekræfter at alle komponenter er scannet
5. Tryk **Afslut batch** → det færdige produkt tilføjes til lageret

### Indstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Tillad samling** | Komponentvarer kan samles til produkt | 
| **Tillad adskillelse** | Færdigt produkt kan adskilles til komponenter |
| **Inkluder indhold i lager** | Komponenterne tæller med i lagerantallet |

### Systemlogik
Produktionsbatches oprettes i Admin → Produkter (kollektions-typen). Terminalen udfører den fysiske samling og bekræfter via scanning.

### Relaterede emner
→ Se: Produkttyper — Kollektions (Admin)
→ Se: Produktadministration (Admin)

---

## Scan til Palle

### Hvad er det
App til at sortere og gruppere pakker til paller, typisk til store forsendelser eller B2B-leverancer.

### Hvornår bruges det
Når pakker skal organiseres på specifikke paller inden afsendelse.

### Trin-for-trin

1. Vælg **Scan til Palle** i menuen
2. Scan **fragtlabelen** på en pakke
3. SmartPack viser hvilken palle pakken tilhører
4. Placer pakken på den korrekte palle
5. Gentag for alle pakker

### Systemlogik
Palletildelingen beregnes på baggrund af forsendelseszone, transportør og destination. Systemet optimerer palleudnyttelsen.

### Relaterede emner
→ Se: Sorteringszoner (Admin)
→ Se: End-of-day / Waybill-liste (Admin)

---

## Klienttilstand (Client Mode)

### Hvad er det
En special-mode der tillader en admin-bruger at se terminalen fra en anden terminal — eller styre og overvåge terminaler centralt.

### Funktioner i Klienttilstand

| Funktion | Beskrivelse |
|----------|-------------|
| **Fjernprint** | Admin kan sende printjob til en bestemt terminal/printer |
| **Tvungen navigation** | Admin kan tvinge en terminal til at vise en specifik skærm |
| **Se terminal-status** | Admin kan se hvad terminalen gør i realtid |

### Systemlogik
Klienttilstand styres fra Admin-panelet og kommunikerer via SignalR i realtid.

### Relaterede emner
→ Se: Realtidsopdateringer (SignalR)
→ Se: Medarbejder settings (Admin)

---

# DEL 12 — INDSTILLINGER

---

## Printerindstillinger og printervælger

### Hvad er det
Konfiguration af hvilke printere terminalen bruger til de tre printertyper.

### Åbn printerindstillinger
Vælg **Indstillinger** i menuen → øverste sektion viser printerindstillinger.

### De tre printertyper

| Type | Bruges til | Eksempel |
|------|-----------|---------|
| **Etiketteprinter (Stregkodeprinter)** | Vareetiketter, hyldeforkanter, stregkode-labels | Dymo LabelWriter, Brother QL |
| **Labelprinter (Fragtlabelprinter)** | Fragtlabels fra transportører | Zebra GK420D, Zebra ZD421 |
| **A4-printer** | Følgesedler, dokumenter | Ethvert netværkstilsluttet A4-apparat |

### Vælg printer — 2 metoder

**Metode 1 — Scan printer-QR:**
Scan QR-koden på printeren → terminalen skifter til denne printer for den pågældende type.
QR-mærket kan være konfigureret til en bestemt printertype (fx altid A4) — en scanning skifter automatisk til korrekt type.

**Metode 2 — Manuelt i Indstillinger:**
1. Tryk på dropdown ud for den ønskede type
2. Vælg printer fra listen
3. **VIGTIGT:** Tryk ét sted på skærmen **uden for dropdown-menuen** — først da gemmes valget (det tykke sorte/gule rammemærke forsvinder)

### ⚠️ Gotcha — Printervælger
Den tykke markering rundt om dropdown-menuen viser at feltet stadig er aktivt. Valget er **ikke gemt** endnu. Tryk et neutralt sted på skærmen for at bekræfte.

### Relaterede emner
→ Se: Printservice — Opsætning (Windows)
→ Se: Anbefalet hardware

---

## Brugerindstillinger

### Hvad er det
Personlige præferencer der tilpasses individuelt per terminal-bruger.

### Indstillinger

| Indstilling | Beskrivelse | Muligheder |
|-------------|-------------|-----------|
| **Sprog** | Terminalens visningssprog | Dansk / Engelsk / Norsk / Polsk / Tysk m.fl. |
| **Skærm-zoom** | Tilpas tekststørrelse | Standard / Stor / Meget stor |
| **Totesortering** | Sorter totelisten i Pak Ordrer | Totenavn / Plukliste + Alder |
| **Auto-print labels** | Fragtlabels printes automatisk | ✅ / ☐ |
| **Auto-print følgesedler** | Følgesedler printes automatisk | ✅ / ☐ |

### Relaterede emner
→ Se: Automatiseringsindstillinger
→ Se: Printerindstillinger

---

## Automatiseringsindstillinger

### Hvad er det
Indstillinger der styrer automatiske handlinger uden manuel bekræftelse.

### Indstillinger

| Indstilling | Beskrivelse | Effekt |
|-------------|-------------|-------|
| **Auto-print label** | Print fragtlabel automatisk ved pakning | Ingen manuel scan af printer nødvendig |
| **Auto-print følgeseddel** | Print følgeseddel automatisk ved pakning | Ingen manuel bekræftelse nødvendig |
| **Afslut pakke (forsinkelse)** | Sekunder der afventes inden auto-afslutning | 0–5 sekunder nedtælling |

### Relaterede emner
→ Se: Brugerindstillinger
→ Se: Pakningsprocessen — Trin-for-trin

---

## Plukindstillinger

### Hvad er det
Terminal-specifikke indstillinger der påvirker plukprocessen.

### Indstillinger

| Indstilling | Beskrivelse | Effekt |
|-------------|-------------|-------|
| **Dobbelt-scan** | Kræv scan af vare + bekræftelsesscan | Øget sikkerhed mod fejlpluk |
| **Vis lagerbeholdning** | Vis antal på hylde under pluk | Synlighed for medarbejder |
| **Kræv plukbekræftelse** | Eksplicit bekræftelse efter hvert pluk | Ekstra kontroltrin |

### Relaterede emner
→ Se: Aktiv plukning — Trin-for-trin
→ Se: Plukkeprofiler (Admin)

---

## Stemmeassistent

### Hvad er det
Funktion der læser placeringer, varenavn og antal højt under plukning. Giver håndfri assistance.

### Indstillinger

| Indstilling | Beskrivelse | Muligheder |
|-------------|-------------|-----------|
| **Aktiver stemmeassistent** | Slår stemmehjælp til/fra | ✅ / ☐ |
| **Sprog** | Stemme-sprog | Dansk / Engelsk / Tysk m.fl. |
| **Hastighed** | Talehastighed | Langsom / Normal / Hurtig |
| **Bekræftelser** | Læs bekræftelsestekster op | ✅ / ☐ |

### Hvad der læses op
- Placeringsnavn ved navigation
- Varenavn
- Antal der skal plukkes
- Bekræftelse ved korrekt scan

### Best practice
Brug stemmeassistenten ved støjende miljøer eller ved brug af scannerhandske.

---

## Stregkodeindstillinger

### Hvad er det
Konfiguration af specielle stregkoder og præfikser på terminalniveau.

### Indstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **GS1-parsing** | Aktivér/deaktivér automatisk parsing af GS1-stregkoder |
| **Prefix/Suffix** | Konfigureres på scannerhardwaren (se Newland-opsætning) |

### Relaterede emner
→ Se: Newland MT9084 — Opsætning
→ Se: Newland — Special stregkode (GS1/AI)
→ Se: Stregkodepræfikser og systemkoder

---

## Andre indstillinger

### Terminal-specifikke indstillinger

| Indstilling | Beskrivelse |
|-------------|-------------|
| **Terminalens navn** | Visningsnavn for denne terminal |
| **Standardlager** | Fortrukt lager hvis flere er tilgængelige |
| **Default plukprofil** | Forslagsprofil ved start af plukliste |
| **Reol-scanner** | Konfigurér om placements-scan er obligatorisk |

### Relaterede emner
→ Se: Systemindstillinger (Admin)

---

## Genvejsknapper

### Hvad er det
Skjulte eller hurtige inputs der aktiverer funktioner uden at navigere gennem menuer.

### Genveje

| Stregkode | Effekt |
|-----------|--------|
| `t_`-stregkode | Åbn/tilknyt specifik tote |
| `tr_`-stregkode | Tilknyt rullevogn til plukliste |
| Scan printer-QR | Skift aktiv printer |
| Scan placeringsQR på forside | Find tomme placeringer i nærheden |

### Navigation

| Tryk | Effekt |
|------|--------|
| SmartPack-logo | Gå til forsiden fra enhver skærm |
| Reol-ikon (plukskærm) | Åbn lagerinfo for placering |
| Produktbillede (plukskærm) | Åbn produktinfo for varen |
| Ur-ikon (Pak Ordrer) | Åbn historik over pakkede ordrer |

---

# DEL 13 — REFERENCE

---

## Stregkodepræfikser og systemkoder

### Hvad er det
Oversigt over alle specielle stregkodepræfikser SmartPack anvender til at identificere objekttyper.

### Præfiksoversigt

| Præfiks | Objekt | Eksempel |
|---------|--------|---------|
| `t_` | Tote / Plukkasse | `t_A01` |
| `tr_` | Rullevogn / Vogn | `tr_VOGN1` |
| `p_` | Placering / Hylde | `p_A-01-01` |
| `u_` | Bruger / Medarbejder | `u_MARTIN` |
| `pr_` | Printer | `pr_ZEBRA1` |
| Ingen præfiks | Vare (EAN/GTIN) | `5701234567890` |

### Systemlogik
SmartPack bruger præfikserne til at identificere objekttype øjeblikkeligt ved scanning — uden at søge i databasen for hvert scan. Det giver maksimal scanningshastighed.

### Relaterede emner
→ Se: Totes (Admin)
→ Se: Vogne (Admin)
→ Se: Placeringsnavngivning (Admin)

---

## Fejlkoder — Quick Reference

### Hvad er det
Hurtig referencetabel for de hyppigste fejlkoder i terminal-kontekst.

| Kode | Navn | Typisk kontekst | Løsning |
|------|------|----------------|---------|
| **301** | ItemNotFound | Scan af vare der ikke er i systemet | Opret produktet i Admin eller Produktinfo |
| **326** | — | Skift til bundle-type med eksisterende lager | Nulstil lageret på varen først |
| **341** | ItemBundleCantContainSelfOrParent | Cirkulær bundle-reference | Slet indhold → skift til Normal → ret |
| **352** | ItemBatchNumberRequired | Batchnummer mangler ved plukbekræftelse | Angiv batchnummer |
| **1206** | StockingLotMissingBatchNumber | Batchnummer mangler ved ankomst | Angiv batchnummer |
| **1300** | PickingNoPicksFound | Ingen tilgængelige pluk | Kontrollér lager + åbne ankomster |
| **1404** | PackageTooManyItems | For mange varer i pakken | Opret ekstra pakke (+) |
| **1002** | PrinterNotOnline | Printer offline | Tjek printer og Printservice |

→ Se: Fejlkoder (fejlkoder.md) for komplet oversigt

---

## Hurtige fejlløsninger

### Hvad er det
Tabel til øjeblikkeligt overblik over de hyppigste problemer og deres løsning.

| Problem | Løsning |
|---------|---------|
| Kan ikke komme til menuen | Tryk SmartPack-logo øverst |
| Terminal lader/spinner | Træk ned fra toppen (genindlæsning) |
| System reagerer slet ikke | Kontakt ansvarlig — bed om system-reset |
| Plukliste låst | Genstart app; version 100.0195+: acceptér overtagelse |
| Printer printer ikke | Tjek Printservice kører på PC |
| Label printes forkert | Genudskriv via historik → "Udskriv igen" |
| Vare ikke fundet ved scan | Opret/kontrollér produktet i Produktinfo |
| Kan ikke logge ind | Kontakt admin → kontrollér konto |
| WiFi-forbindelsestab | Genstart appen; flyt tættere på access point |
| DNS-fejl ved print | `ipconfig /flushdns` i CMD på alle Printservice-computere |

### Support

| Kanal | Detalje |
|-------|---------|
| **Support (dokumentation)** | https://support.smartpack.dk/da/ |
| **Telefon** | +45 88 20 20 19 · Tast 2 (support) · Tast 9 (akut) |
| **Email** | support@smartpack.dk |
| **In-app chat** | Tilgængelig i Admin for superbrugere — Sofia AI svarer øjeblikkeligt |
| **Quicksupport — Windows** | https://coopincdk.github.io/smartpack-v1/#quicksupport-windows |
| **Quicksupport — Mac** | https://coopincdk.github.io/smartpack-v1/#quicksupport-mac |

---

*SmartPack Terminal Leksikon · Komplet · Alle detaljer bevaret · v1.34.0.0*
