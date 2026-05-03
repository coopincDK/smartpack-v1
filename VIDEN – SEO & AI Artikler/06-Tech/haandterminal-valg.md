---
primary_keyword: håndterminal lager valg
secondary_keywords: [barcode scanner lager, android scanner warehouse, zebra håndterminal, mobile computer lager]
cluster: 06-Tech
article_type: beslutning
---

# Håndterminal til lager – valg, fejl og hvad du egentlig betaler for

## Kort svar

De fleste lager-operationer under 500 ordrer/dag klarar sig med en Android-baseret enterprise-scanner til 3.000-8.000 kr./stk. Dedikerede Zebra-terminaler er hurtigere og mere robuste, men 2-3x dyrere. Vælg ud fra: daglig scanningsvolumen, faldrisiko og om du kører SmartPack (Android-compatibel).

## Hvad er en håndterminal?

En håndterminal (mobile computer, handheld scanner) er en bærbar enhed der scanner stregkoder og QR-koder på lageret. Den forbinder til WMS via WiFi og viser plukopgaver, bekræfter pluk og registrerer varebevægelser i realtid.

Der er to grundlæggende kategorier:

**Dedikerede enterprise-scannere (Zebra, Honeywell):**
- Bygget specielt til lager: hærdede, IP65-rated, 10+ timers batteri
- Laser-scanner: læser hurtigere og på længere afstand end kamera
- Pris: 6.000-15.000 kr./stk.
- Levetid: 5-8 år

**Android enterprise-enheder (Zebra TC-serie, Honeywell ScanPal, gener. Android):**
- Android-OS: apps installeres direkte, ingen speciel software
- Kamera-baseret scanning: marginalt langsommere på lavt lys
- Pris: 3.000-8.000 kr./stk.
- Levetid: 3-5 år

**Consumer-grade (iPad, Samsung tablet):**
- Ikke egnet til intensiv lagerbrug: glas-skjerm, dårligt batteri under belastning, ingen IP-rating
- Kun acceptabelt til under 20 pluk/dag eller kontor-opgaver

## Hvornår er det et problem?

Din håndterminal-opsætning er problematisk når:

- **Scanningsfejl stiger**: kamera-scanner fejlkænder i dårlig belysning (typisk køle-/fryserlager)
- **Batteri holder ikke en hel vagt**: en scanner der dør kl. 14 koster 2 timers produktivitet
- **WiFi-connection drops**: scanner der mister forbindelsen seriøst sinker plukprocessen
- **Medarbejdere undgår at bruge den**: tæt display, langsom respons eller dårlig ergonomi giver compliance-problemer
- **Enheden falder og går i stykker**: billigste option er dyr, hvis du udskifter to om året

## Hvad koster det?

**Direkte omkostninger:**

| Type | Pris/stk | Levetid | Pris/år |
|------|---------|---------|----------|
| Consumer-grade (iPad) | 4.000 kr. | 1-2 år | 2.000-4.000 kr. |
| Android enterprise | 5.000 kr. | 3-5 år | 1.000-1.700 kr. |
| Zebra/Honeywell | 10.000 kr. | 6-8 år | 1.250-1.700 kr. |

**Indirekte omkostninger (der overses):**
- Tid tabt på langsom scanning: 5 sek/pluk ekstra × 200 pluk/dag = 17 min/dag = **70 timer/år per plukker**
- Fejlscanning ved dårlig scanner: 0,5% ekstra fejlrate = 1 fejl/dag ved 200 ordrer = **127.750 kr./år** (350 kr./fejl)
- Genoplæring ved ny enhed: 2-4 timer per medarbejder

## Valg-kriterier

| Kriterie | Under 100 ordrer/dag | 100-500 ordrer/dag | Over 500 ordrer/dag |
|---------|---------------------|-------------------|---------------------|
| Type | Android enterprise | Android enterprise | Zebra/Honeywell |
| Scanner | Kamera OK | Kamera OK | Laser foretrukket |
| IP-rating | IP54 minimum | IP54-65 | IP65 minimum |
| Batteri | 8 timer | 10 timer | 10-12 timer |
| Budget | 3.000-5.000 kr. | 5.000-8.000 kr. | 8.000-15.000 kr. |

**Zebra TC-serien** (TC21, TC26, TC57) er den mest brugte i danske e-handelslagre. Zebra TC21 (Android, kamera) er standard-valget under 300 ordrer/dag: ~5.500 kr./stk., IP52-rated, fuld Android-kompatibilitet.

## Typiske fejl ved køb

**1. Købe på den laveste pris**
En consumer-grade tablet til 2.000 kr. der går i stykker efter 8 måneder koster 3.000 kr./år. En enterprise-scanner til 6.000 kr. der holder 6 år koster 1.000 kr./år.

**2. Vælge laser fordi "det lyder bedre"**
Laser-scannere er hurtigere ved stor afstand (> 1 meter). I normal pick-pak-drift er kamera-scannere tilstrækkelige og billigere. Køb laser når du scanner fra truck eller høje reoler.

**3. Ignorere WiFi-dækning før køb**
En dyr scanner i dårligt WiFi-område er værdilos. Test forbindelsen i alle lager-zoner inden køb. Overvej Zebra WiFi-analyse-værktøj.

**4. Ikke teste ergonomi med de faktiske brugere**
En scanner som folk holder i hånden 6 timer om dagen skal testes af plukkerne inden køb. Vægt, greb og knap-placering varierer markant.

## Best practice

**1. Start med én enhed, test en uge**: Inden du køber 8 scannere, test én i en uge med den faktiske plukker.

**2. Køb med servicekontakt**: Enterprise-scannere sælges med 1-, 3- og 5-årige service-/erstatningsaftaler. En kapot scanner på Black Friday koster 5.000 kr. i tabt kapacitet. En servicekontakt koster 500-800 kr./år.

**3. Standardisér på én model**: Blanding af modeller klæber sig til onboarding og fejlfinding. Vælg én model og hold den.

## SmartPack understøttelse

SmartPack kører på alle Android-enheder med Chrome-browser. Anbefalet: Zebra TC-serie (TC21, TC26, TC57) og Honeywell ScanPal. SmartPack bruger kamera-scanner via enhedens hardware – ingen separate scanner-driver nødvendig. Zebra-terminaler med dedicated scan-knap giver direkte scanner-aktivering via SmartPack.

## FAQ

**Kan jeg bruge en iPad til lagerstyring?**
Til meget let brug (under 20 pluk/dag, kontor): ja. Til rigtigt lagerarbej de: nej. iPads er ikke IP-rated, batteriet holder ikke en hel vagt under belastning, og glas-skærmen tåler ikke fald på beton.

**Hvad er Zebra TC21?**
Zebra TC21 er den mest brugte Android enterprise-scanner i danske e-handelslagre. Android 10, IP52-rated, 8 timers batteri, kamera-scanner. Pris: ca. 4.500-6.000 kr. fra danske IT-leverandører.

**Laser- eller kamera-scanner?**
Laser er hurtigere på afstand over 1 meter og i dårligt lys. Til standard pick-pak under 1 meters afstand er kamera-scanner (billigere) tilstrækkelig.

**Hvor mange scannere har jeg brug for?**
Hovedregel: 1 scanner per aktiv plukker + 1 reserve. Vær opmærksom på om du har to-skift: batterierne skal holde eller opladesstation skal til.

**Hvad koster det at sende scannere til reparation?**
Med enterprise-servicekontakt: typisk gratis udskiftning og returnering inden 24-48 timer. Uden kontrakt: 800-2.000 kr. per reparation + ventetid.

## Læs også

- [Stregkode-scanning på lager](/viden/tech/stregkode-scanning-lager)
- [Sådan undgår du pakkefejl](/viden/operations/saadan-undgaar-du-pakkefejl)
- [Real-time inventory](/viden/tech/real-time-inventory)
- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
