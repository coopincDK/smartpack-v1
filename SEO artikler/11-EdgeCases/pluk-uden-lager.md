---
primary_keyword: pluk uden lager
secondary_keywords: [negativ saldo WMS, pluk vare er udsolgt, backorder pluk, zero stock pick fejl]
cluster: 11-EdgeCases
---

# Pluk uden lager: Når systemet tillader pluk på en tom hylde

Dit WMS sender en plukordre på en vare. Saldo er 0. Eller plukkerens scan bekræfter at der ikke er noget – men systemet forlanger at plukkeren plukker alligevel. Det er et mismatch mel lem systemets forventning og virkelighed. Her er hvad der sker og hvad du gør.

## Hvad er pluk-uden-lager?

Pluk-uden-lager er når et plukjob frigivet til en plukkeren men:
1. Varen eksisterer ikke på den registrerede placering
2. Den registrerede saldo er 0 eller negativ
3. Systemet har allokeret varen til to ordrer (double allocation)

Det er symptom på et dybere problem: lager-data stemmer ikke med virkelighed.

## Årsager

**Negativ saldo opstår ved:**
- Pluk registreret to gange på samme ordre
- Integration mellem webshop og WMS afstemmer ikke korrekt
- Manuelt pluk der ikke er registreret (nogen tog varen uden scan)
- Systemfejl der subtraherer forkert

## Det opdager de fleste for sent

**Negativ saldo ignoreret.** WMS viser -3 stk. Det er ALTID en fejl. Men ingen reagerer. 3 ordrer allokeres til varer der ikke eksisterer. 3 kunder venter. Opdagelse: når kundeservice får 3 klager samme dag.

**Double allocation:**
- To ordrer allokeres til den samme saldo-enhed
- Race condition (simultane ordrer på sidst tilgængelige enhed)

## Konsekvens i kroner

**Konsekvens:** Pluk på tom hylde = ordre kan ikke fuldføres = backorder eller refund. Backorder: 90 kr. ekstra fragt + kundeservice. Refund: 350 kr. kundeservice + LTV-tab. Ved 5 pluk-uden-lager/uge: 260 × 400 kr. = **104.000 kr./år**.

## Hvad gør du når det sker?

### Trin 1: Afbryd plukjobbet
Sæt jobbet på hold. Plukkeren går videre til næste job.

### Trin 2: Registrér årsagen
Plukkerens håndholdte enhed skal have en "kan ikke plukke"-funktion med årsagskoder:
- Tom hylde
- Forkert vare på hylde
- Beskadiget vare (tælles som nul)
- Vare ej fundet

### Trin 3: Automatisk optmælning
WMS trigger cycle count på den lokation. Korrekt saldo öjeblikkeligt.

### Trin 4: Håndter ordren
Backorder, delordre eller refund – afhmængig af politik og kundetilfredsheds-afvæjning.

### Trin 5: Root-cause
Hvorfor var saldo forkert? En af de 8 årsager fra inventory-accuracy-artiklen. Fix roden.

## Forebyggelse

### Atomic reservation
WMS reserverer saldo ved ordremodtagelse – ikke ved pluk-frigivelse. Så når to ordrer modtages på saldoen 1, godkendes kun den første.

### Ingen negativ-saldo-pluk-frigivelse
WMS må aldrig frigive plukjob til en saldo der er 0 eller lavere. Konfigurer dette eksplicit.

### Soft allocation vs. hard allocation
- Soft allocation: varen er "booket" men ikke garanteret
- Hard allocation: varen er fysisk reserveret (mærket eller placeret på pick-cart)

Hard allocation er sikrere men kræver mere pladsressourcer.

## Typiske fejl

- **WMS tillader pluk på nul-saldo** – systemkonfiguration skal blokere dette
- **Ingen "kan ikke plukke"-funktion** – plukkeren ved ikke hvad der gøres
- **Ingen automatisk cycle count ved pluk-fejl** – root cause forbliver
- **Double allocation ikke håndteret** – race condition ikke løst med atomic reservation
- **Negativ saldo ignoreret** – det er altid en fejl der skal rettes straks

## Sådan gør du det rigtigt

- WMS blokerer plukjob-frigivelse ved saldo ≤ 0
- Atomisk reservation ved ordremodtagelse
- "Kan ikke plukke" funktion på alle håndholdte enheder
- Automatisk cycle count trigger ved pluk-undtagelse
- Negativ saldo: alarm til lagerchef straks

## Brug denne artikel: tjekliste

- [ ] WMS konfigureret til at blokere pluk på saldo ≤ 0
- [ ] Atomic reservation aktiveret ved ordremodtagelse
- [ ] "Kan ikke plukke" funktion på håndholdte enheder
- [ ] Automatisk optmælning trigger ved pluk-undtagelse
- [ ] Alarm ved negativ saldo konfigureret

**Næste skridt:** Tjek din WMS-konfiguration: kan systemet frigive plukjob på saldo 0? Test det i et test-miljø. Fix det hvis svaret er ja.

## SmartPack understøttelse

SmartPack blokerer automatisk plukjob-frigivelse på saldo ≤ 0. Atomic reservation er standard. "Kan ikke plukke" er en kernefeature på alle mobile enheder med automatisk cycle count-trigger.

## FAQ

**Hvad er atomic reservation?**
En mekanisme der reserverer lager-saldo på det eksakte tidspunkt en ordre modtages – så to samtidige ordrer ikke kan reservere det samme. Grundlæggende for at undgå oversalg.

**Hvad er double allocation?**
Når det samme lagerenheder er allokeret til to separate ordrer. Resulterer i at den anden ordre ikke kan fuldføres.

**Hvad er negativ saldo?**
Når WMS viser at der er færre end 0 enheder på lager. Altid en fejl. Årsag: pluk registreret to gange, integration-fejl, eller manuel fejl.

**Kan man plukke på negativ saldo?**
Nej – aldrig. Det må blokeres af WMS. Er det teknisk muligt i dit system, er det en kritisk konfigurationsfejl.

**Hvad er soft vs. hard allocation?**
Soft: varen er booket i systemet. Hard: varen er fysisk reserveret (mærket, sat til side). Hard er mere pålidelig ved høj pluk-volumen.
