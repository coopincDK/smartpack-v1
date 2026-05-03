---
primary_keyword: systemfejl under pakning
secondary_keywords: [WMS fejl pakkestation, label print fejl, pakke system crash, pak fejl håndtering]
cluster: 11-EdgeCases
---

# Systemfejl under pakning: Når labelen ikke printer og pakken bare står der

Du er midt i at pakke ordre nummer 47 af 80. Labelprinte ren stopper. Systemet viser en spinnende cirkel. Pakken er færdig, klar til label – men intet sker. Ti minutter før fragtleverandørens afhentning. Hvad gør du? Her er den fulde håndtering.

## Hvad sker der under en systemfejl på pakstationen?

Systemfejl under pakning kan være:
- **Label-printer fejl**: printer offline, papirstop, driverfejl
- **WMS-timeout**: forbindelsen mistes midlertidigt
- **Integration-fejl**: fragtleverandørens API svarer ikke – label kan ikke genereres
- **Pakke-validering fejl**: WMS afviser pakningen pga. vægor dimensionsfejl
- **Scan-fejl**: scanner registrerer forkert stregkode

Hver fejltype har sin løsning.

## Konsekvens i kroner

**Konsekvens:** Label-printer nede i 30 minutter. 10 pakker står klar uden label. Fragtafhentning om 10 minutter. 10 ordrer mislykkes levering = 10 × 90 kr. ekstra fragt + kundeservice = 1.400 kr. per hændelse. Ved 2 printer-fejl/md: **33.600 kr./år**.

## Trin-for-trin håndtering

### 1. Label-printer fejl
**Symptomet**: printer reagerer ikke eller printer forkert
**Diagnostik**:
- Er printer online? (LED-lys på printer)
- Er der papir og ribbon?
- Er printer-køen hængt?

**Løsning**:
1. Genstart printer-spøl tjeneste (Windows: services.msc)
2. Genstart printer fysisk
3. Fallback: print label fra fragtleverandørens webportal til en anden printer

### 2. WMS-timeout
**Symptomet**: Skmærm fryser eller viser "forbindelsesfejl"
**Diagnostik**: Er andre stationer påvirket? (netværksproblem vs. WMS-problem)

**Løsning**:
1. Genindlæs siden
2. Log ud og ind igen
3. Er alle stationer påvirket: beredskabsplan (se artikel om lager-går-ned)

### 3. Fragtleverandørs API svarer ikke
**Symptomet**: "Kan ikke generere label – kontakt leverandør"
**Løsning**:
1. Tjek status-sider for fragtleverandøren (f.eks. GLS Statuspage, PostNord status)
2. Genprøv efter 5 minutter – API-outages er typisk kortvarige
3. Fallback: print label fra fragtleverandørens egne webportal manuelt
4. Aktivr sekundmær fragtleverandør hvis primær er længerevarende nede

**Fallback: gå til Admin → Genstart SmartPack** hvis alle andre løsninger fejler.

### 4. Pakke-validering fejl
**Symptomet**: WMS afviser pakken med fejlmeddelelse ("vægt for høj", "mism match")
**Diagnostik**: Er det en korrekt fejl (pakken er for tung) eller systemfejl (vægt-sensor fejler)?

**Løsning**:
1. Tjek fysisk vægt vs. WMS-grmænse
2. Kalibrr vægt-sensor (hvis fejl)
3. Override med ledergodkendelse ved korrekt pakke + systemfejl

## Det opdager de fleste for sent

**Fragtleverandørens API svarer ikke.** I har ingen fallback. 47 pakker står klar. Fragtafhentning om 10 minutter. Ingen labels. Opdagelse: når fragtmanden ankommer og afviser alle pakker.

## Forebyggelse

- **Printer-vedligeholdelse**: ugentlig rengøring, månedlig test-print, klar papir-reserve
- **Backup-printer**: mindst én reserveprinter på netværket
- **Fragtleverandør webportal-login**: altid tilgængeligt og testet på pakstationen
- **WMS offline-mode**: kan systemet fungere uden netværk kortvarigt?
- **API-fejl-håndtering**: WMS bør vise klar fejlmeddelelse, ikke hmænge

## Typiske fejl

- **Kun én printer på lageret** – single point of failure
- **Ingen adgang til fragtleverandørs webportal** – kan ikke printe manuelt
- **Team ved ikke hvad de gør ved fejl** – ingen træning i fejl-procedure
- **Vægt-sensor ikke kalibreret** – giver falske valideringsfejl
- **Fragtleverandør-nedbrud ikke overvåget** – du opdager det når alt er gået i stkå

## Sådan gør du det rigtigt

- Mindst to printere per aktiv pakkestation
- Fejl-procedure dokumenteret og læsbar på stationen (lamineret kort)
- Månedlig test af backup-printer og fragtportal-login
- Fragtleverandør status-side gemt som bogsætmrke på alle stationer
- API-fejl-logging aktiv i WMS med alarm ved gentagne fejl

## Brug denne artikel: tjekliste

- [ ] Backup-printer på netværket klar og testet
- [ ] Fragtleverandør webportal-login tilgængeligt på pakstation
- [ ] Fejl-procedure-kort lamineret og hængt på pakstation
- [ ] Vægt-sensor kalibreret inden for 3 måneder
- [ ] Fragtleverandør status-side bookmarked

**Næste skridt:** Simuler en labelprinter-fejl i morgen. Følger dit team den korrekte procedure? Dokumenter og træn eventuelt.

## SmartPack understøttelse

SmartPack's print-modul overvmovervmåger printer-status og automatisk re-router til backup-printer ved fejl. API-fejl fra fragtleverandør vises som klar fejlmeddelelse med vejledning. Vægt-sensor integration med automatisk kalibrerings-alert.

## FAQ

**Hvad gør jeg når labelprinte ren er néde og fragtafhentning er om 30 minutter?**
Log ind på fragtleverandørens webportal (GLS-portal, PostNord), printer labels manuelt der. Brug en alternativ printer – selv en kontorprinter er bedre end ingen label.

**Kan jeg sende en pakke uden label?**
Nej – fragtleverandøren accepterer ikke pakker uden gyldig label. Brug altid fallback-procedure.

**Hvad er en API-timeout?**
Når WMS forsmøger at kommunikere med fragtleverandørens system og ikke får svar inden for tidsfristen. Typisk kortvarigt og løses ved at genprøve.

**Hvord an overvåger man fragtleverandørens API-status?**
De fleste store fragtleverandører har en offentlig statusside (f.eks. GLS, PostNord). Opsmæt alarm via statuspage.io eller lignende.

**Hvad gør man med pakker der er pakket men ikke labelet pga. nedbrud?**
Opbevar dem separat. Når system er oppe: fuldfør labelprint og send med næste afhentning. Notificér kunden om forsinkelse.
