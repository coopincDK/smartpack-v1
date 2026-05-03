---
primary_keyword: transfer mellem lagre
secondary_keywords: [lager til lager flytning, inter-lager transfer, transfer ordre wms, flerlager logistik]
cluster: 03-Operations
---

# Transfer mellem lagre: Præcis håndtering af inter-lager flytninger

Når du driver flere lagerlokationer – eller flytte varer mellem en butik og et centrallager – er inter-lager transfers en daglig realitet. Uden et klart system ender du med varer der er "undervejs" men ikke i nogen af lokationernes systemer. Denne guide viser dig, hvordan du håndterer det korrekt.

## Hvad er transfer mellem lagre?

En inter-lager transfer er en planlagt flytning af varer fra ét lagersted til et andet inden for din virksomhed. Eksempler:
- Centrallager → butik/pick-up-point
- Lager A → Lager B (overløb, sæsonforskydning)
- Returlager → aktivt salgslager
- Karantænelager → godkendt salgslager

En transfer reducerer beholdningen på kildelageret og øger den på destinationslageret.

## Hvornår er det et problem?

Transfer er problematisk, når:
- Varer scannes ud af kildelageret men aldrig ind på destinationslageret
- Systemet viser negative tal på kildelageret pga. manglende registrering
- Varer er "undervejs" i dage uden nogen ved, hvad status er
- Transferts sker uden registrering fordi det "kun er intern flytning"

## Hvorfor er det vigtigt? (tal)

- Uregistrerede transferts er en af de hyppigste årsager til lageruoverensstemmelser
- En vare der er i transit men ikke registreret eksisterer i et "sort hul" – hverken kilden eller destinationen kan se den
- Korrekt transfert-håndtering er forudsætningen for præcis beholdningsoversigt på tværs af lokationer
- Forkerte beholdningstal på tværs af lagre fører til dobbelt-ordrer, overstock og stockout

## Trin-for-trin: Håndter inter-lager transfer korrekt

### Trin 1: Opret en transferordre i systemet inden fysisk flytning
En transferordre specificerer:
- Kildelager og destinationslager
- SKU'er og antal
- Planlagt afsendelsesdato og forventet modtagelse
- Transport-metode

Systemet reserverer varerne på kildelageret og opretter et "in-transit" status.

### Trin 2: Scan varer ud af kildelageret
Inden varerne lastes på transport: scan alle SKU'er og antal mod transferordren. Systemet registrerer:
- Afgang fra kildelager
- Status: "In Transit"

Varerne er nu hverken på kildelageret eller destinationslageret – de er sporet som "In Transit".

### Trin 3: Bekræft modtagelse på destinationslageret
Når varerne ankommer: scan dem ind mod den samme transferordre. Systemet registrerer:
- Ankomst til destinationslager
- Luk transferordren
- Opdatering af destinationslagerets beholdning

Hvis der er uoverensstemmelse (antal stemmer ikke): registrér afvigelse og undersøg.

### Trin 4: Håndtér partial transfers og forsinkelser
Hvis kun dele af transferordren ankommer:
- Registrér det modtagne antal
- Transferordren forbliver åben for restleverancen
- Systemet viser præcist, hvad der mangler

### Trin 5: Overvåg åbne transferordrer
Transferordrer der er åbne i mere end X dage (definér din grænse, fx 3 arbejdsdage) bør generere et alert. Varer i langvarig transit er et rødt flag.

### Trin 6: Dokumentér transport-metode
For compliance og forsikring: registrér transportmiddel, fragtfirma og evt. fragtbrev-nummer på transferordren.

## Typiske fejl

**Fejl 1: Scan ud – men aldrig scan ind**
Den hyppigste fejl. Varerne forlader kildelageret, men ingen scanner dem ind på destinationen. Resultat: negative tal på kilden, manglende beholdning på destinationen.

**Fejl 2: Transfer uden transferordre**
"Vi bare kørte det over" uden systemregistrering. Resultatet er mystisk lageruoverensstemmelse på begge lokationer.

**Fejl 3: Ingen opfølgning på åbne transferordrer**
Transferordrer der aldrig lukkes skaber forvirrende "in-transit" beholdning der aldrig afklares.

**Fejl 4: Afvigelser ved modtagelse ignoreres**
Hvis 48 ud af 50 enheder ankommer og ingen registrerer de manglende 2, forsvinder de.

## Sådan gør du det rigtigt

**1. Transferordre er obligatorisk – ingen undtagelser**
Uanset om det er 2 enheder eller 200: opret en transferordre og scan begge veje.

**2. Sæt en SLA for transferbeskyttelse**
Maksimal transit-tid (fx 2 arbejdsdage). Alle transfers der overskrider dette genererer automatisk et alert.

**3. Brug in-transit-beholdning i planlægning**
Varer i transit er ikke til rådighed på hverken kilde eller destination. Planlæg salg og refill derefter.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Definér alle typer transfert-scenarier
- [ ] Konfigurér transferordre-flow i SmartPack
- [ ] Etablér obligatorisk scanning ved afsendelse og modtagelse
- [ ] Sæt SLA for maksimal transit-tid
- [ ] Konfigurér alert for åbne transferordrer over tidsgrænsen

**Næste skridt**: Læs guiderne om intern ordre flow og datahygiejne for at sikre fuld sporbarhed på tværs af alle lokationer.

## SmartPack understøttelse

SmartPack understøtter multi-lager transferordrer med automatisk "in-transit" status ved afsendelse og opdatering ved modtagelse. Systemet generer alerts for åbne transferordrer og afvigelser ved modtagelse. Live beholdningsoversigt inkluderer in-transit-poster separat.

## FAQ

**Hvad er en transferordre?**
Et systemdokument der specificerer flytning af varer fra kildelager til destinationslager, og som sporer statusen fra afsendelse til bekræftet modtagelse.

**Hvad sker der med beholdning under transit?**
SmartPack registrerer varerne med status "In Transit" – hverken på kilden eller destinationen, men synlig som separat beholdningskategori.

**Skal jeg scanne ved afsendelse OG modtagelse?**
Ja begge gange. Scan ved afsendelse registrerer afgang fra kilde. Scan ved modtagelse bekræfter ankomst til destination og lukker ordren.

**Hvad gør jeg, hvis varer mangler ved modtagelse?**
Registrér det faktisk modtagne antal. Transferordren forbliver delvis åben. Undersøg, om varerne er mistet i transit eller endnu ikke afsendt.

**Kan jeg flytte varer uden at oprette en transferordre?**
I praksis: ja. I systemet: aldrig. Uregistrerede flytninger skaber lageruoverensstemmelser som er meget svære at spore.

