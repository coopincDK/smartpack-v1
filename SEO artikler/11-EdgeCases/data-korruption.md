---
primary_keyword: data korruption WMS
secondary_keywords: [WMS data fejl, korrupt lagerdata, data integrity WMS, databasefejl lager]
cluster: 11-EdgeCases
---

# Data-korruption: Når dine lagerdata ikke længere er pålidelige

Systemet viser saldo: 12 stk.
Hylden er tom.

Ordren plukkes.
Fejl.
Kunden venter.

Det er ikke en systemfejl.
Det er data-korruption.
Gradvis. Usynlig. Dødelig.

Når dine lagerdata ikke længere er pålidelige, falder hele driften fra hinanden.

## Hvad er data-korruption i WMS?

Data-korruption dækker over:
- **Forkerte saldi** (phantom/shadow inventory – behandlet separat)
- **Inkonsis tent data**: samme vare vises med forskellig vægt i to dele af systemet
- **Manglende data**: ordrer uden køberoplysninger, modtagelser uden leverandør-ID
- **Korrupte relationer**: ordre linket til forkert kunde-ID
- **Foraltede data**: produktinfo opdateret i webshop men ikke i WMS

## Årsager

**Tekniske årsager:**
- Databasefejl (harddisk-fejl, memory-fejl, race conditions)
- Fejl i migrations (upgrade fra én WMS-version til en anden)
- Integration-fejl (delvis data-øversel fra webshop)
- Utilststrækkelig backup ved opdatering

**Operationelle årsager:**
- Manuelle redigeringer direkte i database (omgår validering)
- Import af ekstern data med forkert format
- Duplikerede produktrecords (samme vare, to ID'er)

## Konsekvenser

- Pluk baseret på forkerte lokationsdata
- Labels med forkert kundedata
- Oversalg pga. inkonsis tente saldi
- Regnskabsfejl pga. forkerte ordreværdier
- GDPR-risiko: korrupt kunde-data kan betyde data hos forkert kunde

## Sådan opdager du data-korruption

### Datavalideringsrapporter
Sæt automatiske valideringsregler:
- Negativ saldo: altid en fejl
- Ordrelinjer uden produkt-ID: altid en fejl
- Kunder uden e-mail: mgl. data
- Lokationer uden hylde-ID: konfigurationsfejl

### Reconciliation mel lem systemer
Sammenl ign månedligt:
- WMS-saldo vs. fysisk optmælning
- WMS-ordreværdi vs. regnskabsystem-ordreværdi
- WMS-kundedata vs. webshop-kundedata

### Log-analyse
Gennemgå fejl-log månedligt. Gentag ende fejlmønstre peger på systematisk korruption.

## Når data-korruption er konstateret

### Trin 1: Isöler problemet
Identificér rækkevidde: er det en enkelt post, en batch, et helt datamønster?

### Trin 2: Backup før korrektion
Lav backup af det korrupte datasmæt inden du retter. Du skal kunne genskabe tilstanden for at forstå hvad der skete.

### Trin 3: Korriger
Ret data baseret på autoritativ kilde (fysisk optmælning, original ordre, leverandørfaktura).

### Trin 4: Verificer
Efter korrektion: kør valideringsreglerne igen. Er der stadig fejl?

### Trin 5: Root-cause og forebyggelse
Fix den årsag der skabte korruptionen – ikke blot sympt omet.

## Forebyggelse

- **Ingen direkte database-redigering** – alle ændringer via WMS-interface
- **Automatiske valideringsregler** i WMS
- **Daglig backup** af WMS-database
- **Test af backup** kvartålsvist (backup er værdiløs hvis den ikke kan gendannes)
- **Staging-miljø** til test af opdateringer
- **Integrations-monitoring** – delvise imports skaber inkonsistente data

## Typiske fejl

- **Direkte database-ændringer** – omgår validering, skaber inkonsistens
- **Ingen daglig backup** – data-tab ved fejl
- **Backup aldrig testet** – backup er korrupt eller ufuldstændig
- **Migration uden staging** – opgradering bryder data-struktur
- **Duplikerede produktrecords** – skaber split-saldo og fejlpluk

## Best practice

- Daglig automatisk backup + ugentlig test af gendannelse
- Ingen direkte database-adgang for operatmører
- Automatiske data-valideringsregler med daglig rapport
- Staging-miljø til WMS-opdateringer
- Månedlig reconciliation mel lem WMS og regnskab

## Brug denne artikel: tjekliste

- [ ] Automatisk daglig backup konfigureret
- [ ] Backup-gendannelse testet inden for de seneste 90 dage
- [ ] Direkte database-adgang begrænset til DBA/IT
- [ ] Automatiske valideringsregler aktive (negativ saldo, mgl. data)
- [ ] Månedlig reconciliation WMS vs. regnskab

**Næste skridt:** Tjek hvornår din backup sidst er testet. Er det mere end 90 dage siden? Test gendannelse denne uge. Det er den højest-værdiløse enkeltaktivitet i data-sikkerhed.

## SmartPack understøttelse

SmartPack kører daglig automatisk backup med geografisk redundans. Data-valideringsregler kører automatisk og alarmerer ved anomalier. Ingen direkte database-adgang for operatmører – alle ændringer via verificeret interface.

## FAQ

**Hvad er data-korruption?**
Når WMS-data er fejlagtige, inkonsistente eller manglende på en måde der påvirker systemets pålidelighed.

**Hvord an opdager man data-korruption?**
Automatiske valideringsregler, månedlig reconciliation mel lem systemer og regelmæssig log-analyse.

**Hvad er en daglig backup værd hvis den ikke er testet?**
Intet. En backup er kun værdiful når det er verificeret at den kan gend annes. Test kvartålsvist.

**Er direkte database-ændringer farlige?**
Ja. De omgår valideringslogikken og kan skabe inkonsistente data. Alle ændringer skal gå via WMS-interfacet.

**Hvord an undgår man duplikerede produktrecords?**
Brug ét autoritative system til produkt-oprettelse. Integrer med webshop via synkronisering, ikke manuel dobbelt-oprettelse.
