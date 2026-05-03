---
primary_keyword: tjekliste før WMS implementering
secondary_keywords: WMS forberedelse, lager software checkliste, klar til WMS, WMS implementering guide
cluster: 07-Decision
article_type: beslutning
---

# Tjekliste: Er du klar til WMS-implementering?

Du køber et WMS. Go-live er planlagt om 6 uger.

Uge 4: I opdager at 40% af jeres produkter mangler stregkoder. Lagerlokaliteter er ikke defineret. Medarbejderne ved ikke hvad scanning betyder.

Resultat: go-live udsættes 3 måneder. I betaler licens uden at bruge systemet. Frustrationen stiger.

Regnestykket: 3 måneders forsinkelse = 24.000 kr. i spildt licens + 150.000 kr. i tabt effektivitet.

De fleste implementeringsfejl sker IKKE på grund af systemet. De sker fordi virksomheden ikke var klar.

Her er tjeklisten der sikrer at I er klar dag 1.

## Kort svar

> Du er klar til WMS-implementering når du har valideret produktdata, afklaret integrationer og uddannet en superbruger. Gå ikke live inden produktdata er ryddet op – datamangel er den hyppigste årsag til forsinkede implementeringer og koster typisk 30.000–60.000 kr.

## Hvad handler forberedelsen om?

WMS-implementering kræver at du har styr på: data, processer, hardware, mennesker og integration. Mangler ét element, kan det sætte hele implementeringen i stå.

## Del 1: Data-tjekliste

- [ ] Komplet og valideret produktkatalog (varenummer, navn, stregkode, dimensioner, vægt)
- [ ] Opdateret lagerbeholdning per lokation
- [ ] Leverandørliste med kontaktoplysninger og leveringstider
- [ ] Kundeliste (hvis relevant for B2B)
- [ ] Historiske ordredata fra de seneste 12 måneder (til prognose)
- [ ] Lagerlokalitetsliste (hylde-ID'er, gangbetegnelser, zoner)

**Tip**: Mangelfuld data er den hyppigste årsag til forsinkede implementeringer. Brug 1–2 uger på at rydde op i data inden go-live.

## Del 2: Processer-tjekliste

- [ ] Dokumenteret flow fra ordremodtagelse til afsendelse
- [ ] Dokumenterede modtagelses-processer (hvem modtager, hvordan registers, hvad gøres ved afvigelser)
- [ ] Returhåndteringsproces defineret
- [ ] Undtagelseshåndtering defineret (beskadiget vare, fejlleverance fra leverandør)
- [ ] Roller og ansvar defineret per medarbejder

## Del 3: Hardware-tjekliste

- [ ] Håndscannere (antal: 1 per aktiv lagermedarbejder + 1 reserve)
- [ ] Label-printer til fragtlabels (Zebra eller tilsvarende termisk printer)
- [ ] Stabile Wi-Fi-dækning i hele lagerområdet
- [ ] Computere/tablets til pakkestationer
- [ ] Backup-printer (kritisk under peak)

**Budgetestimat hardware**: 10.000–30.000 kr. afhængigt af størrelse.

## Del 4: Integration-tjekliste

- [ ] Webshop API-adgang konfigureret (Shopify, WooCommerce, osv.)
- [ ] Fragtleverandør API-nøgler klar (GLS, PostNord, Bring, DAO)
- [ ] ERP-integration afklaret (hvis relevant)
- [ ] Testmiljø for integrationerne tilgængeligt
- [ ] Fallback-plan ved integrationssvigt

## Del 5: Mennesker-tjekliste

- [ ] Projektleder udpeget (intern)
- [ ] Nøglemedarbejdere oplært inden go-live
- [ ] Alle medarbejdere informeret om ændringer og tidsplan
- [ ] Superbruger identificeret (den person der kender systemet bedst og kan hjælpe kolleger)
- [ ] Supportkanal til WMS-leverandøren klar og testet

## Del 6: Timing-tjekliste

- [ ] Go-live dato valgt i rolig periode (IKKE 6 uger før Black Friday)
- [ ] Parallelkørsels-periode planlagt (2 uger: gammelt og nyt system parallelt)
- [ ] Kommunikationsplan til kunder (eventuelle forsinkelser under overgang)
- [ ] Rollback-plan ved kritiske fejl

## Konkret regnestykke: Hvad koster uforberedelighed?

| Forberedelse der spring over | Typisk konsekvens | Estimeret omkostning |
|-----------------------------|------------------|---------------------|
| Mangelfulde produktdata | 2–3 ugers forsinkelse af go-live | 30.000–60.000 kr. i tabt produktivitet |
| Ingen backup-printer | Produktionstop ved printerfejl | 500–3.000 kr./time i tabt kapacitet |
| Spring over parallelkørsel | Big-bang fejl der rammer kunder | 5.000–50.000 kr. i fejl-håndtering |
| Ingen medarbejder-oplæring | 43% turnover × 30–50k kr./ansættelse | Op til 50.000 kr./ny medarbejder |
| Dårlig Wi-Fi-dækning | Scanner-frafald og manuel backup | 15.000–30.000 kr. i infrastruktur-udbedring |

## Hvornår er du klar?

Du er klar til implementering, når du kan sætte kryds ved mindst:
- Alt i Del 1 (data)
- Alt i Del 3 (hardware)
- Kerneprocesser i Del 2
- Primær integration (webshop + fragtleverandør)

De øvrige punkter kan finjusteres efterfølgende.

## Typiske fejl

- Starter implementeringen uden validetr produktdata
- Undlader paralleldrift (big bang go-live er risikabelt)
- Mangler backup-printer – label-printer nedbrud er kritisk
- Informerer ikke medarbejderne tidligt nok
- Sætter for aggressiv go-live dato

## Sådan gør du det rigtigt

1. Data-validering er dit første projekt – start her
2. Udpeg én superbruger per skift på lageret
3. Test integrationer grundigt inden go-live med simulerede ordrer
4. Hold en go-live buffer på 2 uger før din næste peak
5. Definér succes-KPI'er: fejlrate, pakketid, systemtid

## Det opdager de fleste for sent

1. **Produktdata er langt mere rodet end forventet** — det virker som en lille opgave at rydde op, men i praksis bruger de fleste virksomheder 1–3 ekstra uger på data-validering; det forsinker go-live og koster i tabt momentum
2. **Wi-Fi-døde zoner findes først på go-live dagen** — scannerne fungerer fint ved pakkebordet men dør i bageste del af lageret; det er en nem fix men en dyr overraskelse på en travl dag
3. **Én superbruger er ikke nok** — ved sygdom eller opsigelse (43% turnover) står man uden intern ekspertise; krav: minimum to medarbejdere der kan hjælpe kolleger med systemet

## SmartPack onboarding

SmartPack implementeres på 1 uge. Vores team guider dig gennem data-import, integration-setup og medarbejder-onboarding. Du er ikke alene i processen.

**Hvornår SmartPack IKKE giver mening**: Er du i tvivl om du overhovedet skal have WMS endnu (under 30 ordrer/dag, ingen kompleksitet), så gå ikke videre med implementeringen — brug et halvt år mere på at vokse til breakpointet først. En dyr, delvist brugt implementation er værre end at vente. Ligeledes: er din go-live dato inden for 3 uger og du ikke har styr på produktdata, skal du udskyde — ikke forcere.


## Brug denne artikel
- [ ] Gennemgå listen og sæt kryds ved det der passer på din situation
- [ ] Beregn din fejlomkostning: antal fejl/md × 350 kr. = din månedlige tab
- [ ] Book 30 min med dit team til at gennemgå "Hvornår du skal handle"
- [ ] Næste skridt: kontakt SmartPack for en gratis gennemgang af dit setup
## FAQ

**Hvad sker der, hvis vi ikke er klar til go-live dato?**
Udskyd frem for at gå live med mangelfuld opsætning. En forhastet go-live koster mere end en forsinkelse.

**Skal vi stoppe med at tage ordrer under implementeringen?**
Nej – paralleldriften sikrer kontinuitet. Du kører begge systemer, til det nye er verificeret.

**Hvad hvis vi opdager fejl i vores produktdata?**
Forvent det. Sæt 2–3 dage af til data-oprydning – det er normalt.

**Kan vi gå live manuelt og aktivere automatik gradvist?**
Ja – det er faktisk den anbefalede tilgang. Start simpelt, automatisér gradvist.

**Hvad er den mest undersete forberedelse?**
Wi-Fi-dækning. Mange lagre har døde zoner. Test scanner-forbindelsen i alle hjørner inden go-live.

## Læs også

- [9 typiske fejl ved valg af WMS](fejl-ved-valg-af-system.md)
- [Budget til lager](../05-Economics/budget-til-lager.md)
- [Lagerstyring system i Danmark](lagerstyring-system-danmark.md)
- [Book en gratis SmartPack-demo](https://smartpack.dk/demo)


