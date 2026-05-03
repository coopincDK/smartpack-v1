---
primary_keyword: intern ordre flow lager
secondary_keywords: [intern ordre lager, interne ordrer wms, lager til lager flytning, intern rekvisition]
cluster: 03-Operations
---

# Intern ordre flow: Håndtér interne rekvisitioner og lageranmodninger korrekt

Intern ordreflow er al bevægelse af varer internt på dit lager eller virksomhed – fra lager til produktion, fra lager til showroom, fra ét lagersted til et andet. Uregistrerede interne ordrer er en af de hyppigste årsager til mystiske lageruoverensstemmelser. Denne guide viser dig, hvordan du håndterer det korrekt.

## Hvad er intern ordre flow?

Et internt ordreflow er en bevægelse af varer på tværs af interne afdelinger, funktioner eller lagerlokationer – ikke til en ekstern kunde. Eksempler:
- Lager → produktionsafdeling (komponenter til montering)
- Lager → salgskontor (demonstrationsprodukter)
- Lager A → Lager B (transfer)
- Lager → returnering til leverandør (RTV – Return to Vendor)

## Hvornår er det et problem?

Intern ordre flow er problematisk, når:
- Medarbejdere henter varer fra lageret uden at registrere det
- "Lån" fra lageret dokumenteres ikke
- Transferter mellem lagersteder foregår uden systemregistrering
- Produktionsafdelingen bruger komponenter, der ikke er afskrevet

## Hvorfor er det vigtigt? (tal)

- Uregistrerede interne udtag er en af top-årsagerne til lageruoverensstemmelser
- Lageruoverensstemmelse fører til pakkefejl til ~350 kr. per styk eller stockout
- Interne ordrer der er korrekt registreret giver fuld sporbarhed og audit trail
- Transfer uden systemregistrering giver negative lagerantal på kildelager

## Trin-for-trin: Implementér korrekt intern ordre flow

### Trin 1: Definer alle typer interne ordrer
List alle situationer, hvor varer bevæger sig internt:
- Produktion-rekvisition
- Demo/showroom-anmodning
- Transfer til andet lager
- Return to Vendor
- Bortskaffelse/destruktion

Hver type kræver sin egen registreringsproces.

### Trin 2: Kræv intern ordredokumentation for alle udtag
Ingen varer forlader lageret uden en intern ordre registreret i SmartPack. Reglen er absolut – ingen undtagelser.

Intern ordreregistrering inkluderer:
- Type (produktion, demo, transfer osv.)
- SKU og antal
- Ansvarlig person/afdeling
- Formål
- Dato

### Trin 3: Brug scanning ved interne udtag
Ligesom ved salgsordrer: scan alle varer ved internt udtag. Systemet registrerer afgang fra lageret automatisk ved scan.

### Trin 4: Håndtér interne returneringer
Varer der returneres fra produktion eller demo til lager:
- Inspicer varen (salgbar/beskadiget?)
- Scan tilbage til lager med korrekt lokation
- Systemet tilskriver lagerantallet

### Trin 5: Differentiér interne ordrer fra salgsordrer i rapportering
Interne udtag skal fremgå separat i rapporteringen – de skjuler sig ellers i "salg" og forvrider salgsdata.

### Trin 6: Definer autorisationsflow for interne ordrer
Hvem må anmode om interne udtag? Hvem godkender? Etablér en simpel godkendelsesproces for udtag over en vis mænge/værdi.

## Typiske fejl

**Fejl 1: Mundtlige aftaler om lagerudtag**
"Jeg har taget 5 styk til demoen" – uden registrering. Dette er en usynlig bevægelse der skaber fejl.

**Fejl 2: Ingen scanning ved intern returnering**
Varer returneres fysisk til hylden men uden systemregistrering. Lagerantal i systemet er fortsat lavere end fysisk.

**Fejl 3: Salgs- og interne ordrer blandes i rapporter**
Interne udtag blander sig med salgsdata og forvrider salgsanalyser, restordre-beregninger og refill limits.

**Fejl 4: Ingen godkendelsesflow**
Alle kan tage hvad de vil, når de vil. Det er ikke et lagersystem – det er et åbent lager.

## Sådan gør du det rigtigt

**1. Brug dedikerede interne ordre-typer i SmartPack**
Adskil produktion-rekvisition, demo, transfer og destruktion som separate typer. Det giver præcis rapportering.

**2. Automatiser godkendelse for rutine-ordrer**
Faste produktion-rekvisitioner kan automatiseres baseret på produktionsordrer. Det fjerner manuel overhead.

**3. Gennemgå interne ordreaktivitet månedligt**
Hvad er forbrugt internt? Stemmer det med forventningerne? Afvigelser indikerer uautoriserede udtag.

## Brug denne artikel: Tjekliste og næste skridt

- [ ] Definer alle typer interne ordrer
- [ ] Kræv intern ordredokumentation for alle udtag
- [ ] Implementér scanning ved alle interne udtag og returneringer
- [ ] Separér interne ordrer fra salgsordrer i rapportering
- [ ] Etablér godkendelsesflow for udtag over en tærskelværdi

**Næste skridt**: Læs guiderne om transfer mellem lagre og datahygiejne for at fuldende den interne sporbarhed.

## SmartPack understøttelse

SmartPack understøtter interne ordre-typer med dedikerede workflows per type (produktion, demo, transfer, destruktion). Systemet registrerer afgange ved scanning og giver fuld audit trail på alle interne bevægelser. Rapporteringen separerer interne ordrer fra salgsordrer automatisk.

## FAQ

**Hvad er et intern ordreflow?**
Al bevægelse af varer internt i virksomheden – fra lager til produktion, demo, transfer eller destruktion – der ikke er en salgsordre til ekstern kunde.

**Hvorfor skal interne udtag registreres?**
Uregistrerede udtag skaber lageruoverensstemmelser. Systemet tror, varen er på lager, men den er reelt udtaget internt.

**Kan medarbejdere tage varer uden registrering?**
Nej. Reglen er absolut: ingen varer forlader lageret uden intern ordre registreret i systemet.

**Hvad er Return to Vendor (RTV)?**
Returnering af varer til leverandøren. Kræver registrering som intern ordre med type RTV og scannet afgang fra lageret.

**Hvem godkender interne ordrer?**
Definer en godkendelsesstruktur: rutine-rekvisitioner godkender sig selv (automatisk). Udtag over en fastsat grænse kræver specifik godkendelse.

