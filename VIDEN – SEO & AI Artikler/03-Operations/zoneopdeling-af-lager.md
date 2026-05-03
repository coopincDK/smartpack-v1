---
primary_keyword: zoneopdeling lager
secondary_keywords: [lager zoner, zone picking, opdeling lager, lager zonestruktur]
cluster: 03-Operations
article_type: beslutning
---

# Zoneopdeling af lager: Sådan strukturerer du zoner der virker

Zoneopdeling er rygraden i et skalerbart lager. Når du opdeler dit lager i klart definerede zoner med tydelig logik, reducerer du gangtid, minimerer fejl og gør det muligt at skalere ordrevolumet uden at ansætte proportionalt. Denne guide viser dig, præcis hvad du skal gøre.

## Kort svar

Zoneopdeling inddeler lageret i klart definerede funktionelle områder med egne regler og logik. Formålet er at reducere gangtid, minimere fejl og gøre det muligt at øge ordrevolumet uden proportional personalevækst.

## Hvad er zoneopdeling?

Zoneopdeling betyder, at du inddeler dit lager i fysisk og/eller logisk afgrænsede områder, der hver har et specifikt formål og regel-sæt. Eksempler på zoner:

- Modtagelseszone
- A-varezone (Golden Zone)
- B-varezone
- C-varezone / Bulkzone
- Pakkezone
- Afsendelseszone
- Karantænezone / Returzone

Sorteringszoner i SmartPack-kontekst bruger **AND-logik**: en vare tilhører en zone, hvis ALLE definerede betingelser er opfyldt. Zoner evalueres i prioritetsrækkefølge.

## Hvornår er det et problem?

Zoneopdeling er fraværende eller uklar, når:
- Alle varer er i én stor blanding uden logisk gruppering
- Plukkere skal traversere hele lageret for simple ordrer
- Modtagelse forstyrrer aktiv plukaktivitet
- Returvarer blandes ind i aktive lagerhylder

## Hvorfor er det vigtigt? (tal)

- Zoneopdeling kombineret med ABC-placering kan reducere gennemsnitlig gangtid per picks med **30-50%**
- Zone picking over 200 ordrer/dag frigiver kapacitet svarende til 0,5-1 medarbejder
- Klare zoner er en forudsætning for effektiv batchpluk og plukkeprofiler
- Sorteringszoner med AND-logik eliminerer fejlsortering ved komplekse ordrer

## Trin-for-trin: Opbyg din zonestruktur

### Trin 1: Definér formål for hver zone
Start med at liste alle aktiviteter der foregår på lageret. Hver aktivitet bør have sin zone. Minimum:
- Varemotagelse og inspektion
- Aktiv plukning (med A/B/C-underzone)
- Pakning
- Afsendelse
- Returnering / karantæne

### Trin 2: Kortlæg den fysiske placering
Tegn dit lagers plantegning og alloker fysisk plads til hver zone. Principper:
- Modtagelse og afsendelse nær ports – helst modsatte ender for adskilt flow
- Pakkebordet nær afsendelsesport
- A-varezone central og tæt på pakkebordet
- Bulkzone bagest eller øverst

### Trin 3: Opsæt zone-logik i systemet (AND-logik)
I SmartPack defineres zoner med AND-logik: en SKU placeres i en zone, hvis ALLE betingelser i zonen er opfyldte. Eksempel:
- Zone "A-Golden": ABC-klasse = A OG hyldeposition = knæ-brysthøjde OG distance til pakbord < 20m
- Zone "Bulk": ABC-klasse = C OG kvantitet > 100 enheder

Prioritetsrækkefølge afgør, hvilken zone der vælges, hvis en SKU matcher flere.

### Trin 4: Markér zoner fysisk
- Farvekodede gulvmarkeringer
- Zoneetiketter på reoler og søjler
- Kort med zoneoversigt opsat ved indgangen

Alle medarbejdere – inkl. vikarer – skal uden forklaring kunne navigere zonestrukturen.

### Trin 5: Tildel plukkerprofiler per zone
Ved zone picking arbejder plukkere i én zone per runde. Systemet samler derefter plukket gods til komplette ordrer. Definer:
- Hvilke medarbejdere arbejder i hvilken zone
- Hvornår en zone er "done" og varer videregives til pakkebordet

### Trin 6: Validér og juster kvartalsvis
Zoner er ikke statiske. Sæsonudsving, nye produktkategorier og ændret sortimentssammensætning kræver justering. Sæt kvartalsvis zone-gennemgang i kalenderen.

## Typiske fejl

**Fejl 1: For mange zoner**
Et lager på 500 m² med 15 zoner er overadministreret. 5-7 klart definerede zoner er typisk optimalt.

**Fejl 2: Zoner der overlapper**
Overlappende zoner skaber tvivl: "tilhører denne vare zone A eller zone B?" – med fejl til følge. Sørg for tydelige, ikke-overlappende grænser.

**Fejl 3: Zone picking uden sorteringskapacitet**
Zonepluk kræver, at plukket gods fra flere zoner samles til én ordre. Uden sorteringsbånd, totes eller konsolideringsbord bliver det kaotisk.

## Sådan gør du det rigtigt

**1. Start enkelt – skaler til kompleksitet**
Begynd med 3-4 zoner. Tilføj zoner, når du har et specifikt problem at løse – ikke som en teoretisk øvelse.

**2. Brug AND-logik konsekvent til zonedefinitioner**
En vare skal opfylde ALLE betingelser for at tilhøre en zone. Det forhindrer dobbeltregistrering og prioritets-konflikter.

**3. Evaluér picks/time per zone separat**
Visse zoner er langsommere end andre. Kend dine tal per zone – det viser dig præcist, hvor optimeringspotentialet er størst.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] List alle lageraktiviteter og tildel dem zones
- [ ] Tegn zoner på plantegning
- [ ] Opsæt zone-logik (AND-betingelser) i SmartPack
- [ ] Markér zoner fysisk på gulv og reoler
- [ ] Tildel plukkerprofiler per zone
- [ ] Planlæg kvartalsvis zone-gennemgang

**Næste skridt**: Læs guiderne om ABC-analyse og plukkeprofiler for at forbinde zone-strukturen med vareplacement og ordrestyring.

## SmartPack understøttelse

SmartPack's zonemanager lader dig definere zoner med AND-logik-betingelser og prioritetsrækkefølge. Systemet tildeler automatisk SKU'er til korrekte zoner ved modtagelse og styrer zone picking-flows med dedikerede plukkerprofiler. Du kan monitorere aktivitet og picks/time per zone i realtid.

## FAQ

**Hvad er zoneopdeling på et lager?**
Inddeling af lageret i fysisk og logisk afgrænsede områder med hvert sit formål og regelsæt – fx modtagelse, pluk, pakning, afsendelse og returnering.

**Hvad er AND-logik i zoner?**
AND-logik betyder, at en vare placeres i en zone, kun hvis ALLE definerede betingelser for zonen er opfyldt – ikke bare én.

**Hvornår bør jeg indføre zone picking?**
Zone picking er relevant fra ca. 200 ordrer/dag, og effekten øges med lagerstørrelse og SKU-antal.

**Hvor mange zoner bør et lager have?**
Typisk 5-7 klart definerede zoner på de fleste lagre. Undgå mere end nødvendigt – kompleksitet koster mere end det giver.

**Kan zoner ændres, når de er opsat?**
Ja – og det bør de. Revurder zonenstruktur kvartalsvis og juster baseret på sortimentsændringer og salgsdata.

## Læs også

- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Cost per ordre: Hvad koster en ordre reelt?](/viden/okonomi/cost-per-ordre)
- [Hvornår skal du have WMS?](/viden/beslutning/hvornaar-skal-du-have-wms)
- [Problem: Lange plukruter og ustruktureret lager](/viden/problemer/lange-plukruter)


