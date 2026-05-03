---
primary_keyword: serienummer tracking lager
secondary_keywords: [serienummer wms, serial number tracking, serienummer sporbarhed, seriel tracking lager]
cluster: 03-Operations
---

# Serienummer tracking: Sådan sporer du individuelle enheder fra modtagelse til kunde

Kunde ringer: "Min enhed er defekt. Garantikrav."
Medarbejderen spørger: "Hvad er serienummeret?"
Kunden læser det op.

Uden tracking: 45 min research.
Hvornår modtaget? Hvilken batch? Sendt til hvem?

Med tracking: 2 min look-up.
Serienummer → ordre → kunde → modtagelsesdato.

Ved 50 garantisager/måned:
Uden tracking: 37,5 timer/måned spildt.
Med tracking: 1,7 timer/måned.

Ved højværdi-fejl: 1.000-5.000 kr. per enhed.
Elektronik, medicinsk udstyr, sikkerhedsudstyr.

Tracking er ikke nice-to-have.
Det er forskellen mellem kontrol og kaos.

## Hvad er serienummer tracking?

Serienummer-tracking (serial number tracking) betyder, at hvert enkelt fysisk produkt identificeres med et unikt nummer og trackes individuelt gennem hele lagercyklussen: modtagelse, opbevaring, pluk, pakning og afsendelse.

I modsætning til LOT-tracking (der sporer grupper af ens produkter) sporer serienummer-tracking den individuelle enhed – specifikt nok til at identificere, at det er *denne* specifikke enhed der er sendt til *denne* specifikke kunde.

## Hvornår er det nødvendigt?

Serienummer-tracking er typisk krævet eller stærkt anbefalet ved:
- Elektronik og teknologiprodukter (garanti-validering)
- Medicinskt udstyr (CE-sporbarhed)
- Højværdi-produkter (forsikring, anti-tyveri)
- Produkter underlagt RMA/garantiprocesser
- Visse regulerede brancher (sikkerhedsudstyr, våben)

## Hvorfor er det vigtigt? (tal)

- Med serienummer-tracking kan du på under 2 minutter besvare: "Hvem modtog serienummer X?"
- Garanti-behandlingstid reduceres markant: ingen manuel research
- Forsikrings- og recall-eksponering reduceres til præcise enheder
- Pakkefejl for højværdi-varer (forkert serienummer sendt) koster langt over ~350 kr. direkte – typisk 1.000-5.000 kr. inklusive kundens frustration

## Trin-for-trin: Implementér serienummer tracking

### Trin 1: Kortlæg hvilke SKU'er kræver serienummer-tracking
Start med en liste: hvilke produkter i dit sortiment har unikke serienumre på pakken (eller kan mærkes med dem)? Prioritér:
1. Lovpligtige (medicin, CE-mærkede produkter)
2. Garantipligtige (elektronik, maskiner)
3. Højværdi-varer (øget beskyttelse)

### Trin 2: Konfigurér SKU'er med serienummer-krav i SmartPack
For hvert relevant SKU: aktiver serienummer-tracking i stamdata. Systemet kræver herefter serienummer-scanning ved modtagelse og pluk for disse SKU'er.

### Trin 3: Scan serienummer ved modtagelse
For hvert enkelt produkt:
- Scan produktets stregkode/SKU
- Scan det unikke serienummer (eller indtast manuelt)
- Systemet registrerer serienummer som tilhørende det modtagne parti

Hvis produktet ikke har et trykt serienummer: påsæt en intern serienummer-label ved modtagelse.

### Trin 4: Scan serienummer ved pluk
Plukkeren scanner:
1. Varen (SKU-bekræftelse)
2. Serienummeret (individuel enhed-bekræftelse)

Systemet bekræfter, at dette serienummer er på lager og assignerer det til aktuelle ordre.

### Trin 5: Registrér serienummer på ordren ved afsendelse
Systemet skaber en komplet sporings-post: ordrenummer → kundenavn → serienummer → afsendt dato. Dette er grundlaget for garanti og recall.

### Trin 6: Brug serienumre i returhåndtering
Når en vare returneres: scan serienummeret. Systemet finder øjeblikkeligt:
- Hvornår varen blev modtaget
- Hvornår og til hvem den blev sendt
- Evt. tidligere returneringer af samme enhed

## Typiske fejl

**Fejl 1: Serienummer-scanning kun ved afsendelse – ikke ved modtagelse**
Du mangler et vigtigt datapunkt: er serienummeret overhovedet modtaget? Og hvornår?

**Fejl 2: Manuelt serienummer-input frem for scanning**
Manuelt input øger fejlraten dramatisk. Scan altid – tast aldrig.

**Fejl 3: Alle SKU'er behandles med serienummer-krav**
Serienummer-tracking for almindelige dagligvarer er overdrevent og bremser flow unødigt. Brug kun på de SKU'er, der kræver det.

**Fejl 4: Ingen systematisk søgefunktion**
Serienummer-tracking er ubrugelig, hvis du ikke kan søge hurtigt på specifikt serienummer. Sørg for en effektiv søgefunktion.

## Sådan gør du det rigtigt

**1. Batch-scan ved modtagelse af store leverancer**
Modtagelse af 50 enheder med individuelle serienumre: brug en batch-scannerprocedure, ikke enkeltvis manuel scanning.

**2. Eksportér serienummer-lister til garantisystemer**
Mange producenter og garantiselskaber accepterer en CSV-eksport af alle modtagne serienumre som registreringsdokumentation.

**3. Test look-up-funktionen regelmæssigt**
"Find alle ordrer der inkluderer serienummer 12345" – det skal tage under 30 sekunder. Test det.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Kortlæg alle SKU'er der kræver serienummer-tracking
- [ ] Konfigurér serienummer-krav i SmartPack per SKU
- [ ] Etablér scanning af serienummer ved modtagelse og pluk
- [ ] Verificér at serienummer registreres på afsendte ordrer
- [ ] Test look-up-funktion (serienummer → kunde)

**Næste skridt**: Læs guiderne om LOT/batch-håndtering og returhåndtering for at udbygge sporbarhedssystemet.

## SmartPack understøttelse

SmartPack understøtter serienummer-tracking per SKU med obligatorisk scanning ved modtagelse og pluk. Systemet giver fuld sporings-post per serienummer og en hurtig look-up-funktion. Serienumre registreres automatisk på afsendte ordrer og er tilgængeligt i returmodulet.

## FAQ

**Hvad er serienummer tracking?**
Individuel tracking af hvert produkt via et unikt serienummer – fra modtagelse til kunde, og ved eventuel returnering.

**Hvornår er serienummer tracking lovpligtig?**
I regulerede brancher som medicinsk udstyr og visse sikkerhedsprodukter. Tjek din branchespecifikke regulering.

**Hvad er forskellen på serienummer og LOT-nummer?**
Serienummer er unikt per enhed. LOT-nummer er unikt per produktionsparti (mange enheder).

**Kan jeg bruge producentens serienummer?**
Ja – scan producentens serienummer direkte ved modtagelse. Alternativt kan du påsætte din egen interne label.

**Hvad gør jeg, hvis et produkt ikke har et serienummer?**
Påsæt en intern serienummer-label ved modtagelse. Brug en simpel sekventiel nummerering eller generer automatisk via SmartPack.

