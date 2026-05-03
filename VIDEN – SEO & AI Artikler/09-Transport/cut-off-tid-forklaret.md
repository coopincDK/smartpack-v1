---
primary_keyword: cut-off tid webshop
secondary_keywords: [cut-off fragt, afsendelse samme dag, fragtfrister, ordremodtagelse frist]
cluster: 09-Transport
---

# Cut-off tid forklaret: Hvad det er og hvorfor det styrer din drift

Du lover "afsendelse samme dag" på forsiden.
GLS henter kl. 16:30.
En ordre kommer ind kl. 15:45.

Den når ikke. Kunden får pakken en dag for sent.
5% af dine ordrer rammer dette vindue.

Ved 500 ordrer/måned er det 25 forsinkelser.
1% returnerer = 1.500 kr./måned i direkte tab.

Det opdages ikke i systemet. Det opdages i anmeldelserne.

## Hvad er cut-off tid?

Cut-off er **seneste frist for ordremodtagelse til afsendelse samme dag**. Ordrer modtaget efter cut-off afsendes næste arbejdsdag.

Cut-off har to dimensioner:
1. **Intern cut-off**: hvornår skal ordren være plukket, pakket og klar
2. **Ekstern cut-off**: hvornår henter fragtleverandøren

Din interne cut-off er typisk 60–90 minutter før fragtleverandørens afhentning.

## Hvornår er det et problem?

Cut-off-problemer opstår når:
- Du kommunikerer "afsendelse samme dag" men kan ikke holde løftet
- Din interne cut-off og fragtleverandørens afhentning er ikke synkroniserede
- Travle perioder (Black Friday) pusher pakker forbi cut-off
- Du ændrer fragtleverandør uden at opdatere kommunikerede cut-off-tider
- Weekender og helligdage giver forsinkelse du ikke kommunikerer

## Hvorfor er det vigtigt? Tal og kr.

Kunders forventning om leveringstid er en af de primære årsager til:
- **Kurv-abandon**: 23% af forbrugere forlader kurven hvis leveringstiden er ukendt
- **Negatives reviews**: forsinket levering er top-3 årsag til 1-stjerne anmeldelser
- **Returnering**: kunder der får pakken for sent afviser den oftere

For en webshop med 500 ordrer/måned og 1% returnering pga. forsinkelse er det 5 returneringer à 300 kr. = 1.500 kr./måned i direkte tab, plus tidskostning på håndtering.

## Hvordan i praksis

### Fastlæg din realistiske cut-off
1. Find ud af hvornår fragtleverandøren henter (f.eks. GLS henter kl. 16:30)
2. Træk pluk + pakketid fra: gennemsnitlig ordrebehandlingstid = 45 min
3. Træk buffer fra: 30 min til fejlhåndtering og toppe
4. Din interne cut-off = 16:30 - 45 min - 30 min = **15:15**

### Kommunikér cut-off tydeligt
- På forsiden: "Bestil inden kl. 15:00 – afsendelse i dag"
- I checkout: dynamisk besked der viser om ordren når cut-off
- I ordrebekræftelse: forventet afsendelsesdato og levering

### Håndtering af edge cases
- **Order rush før cut-off**: hav buffer i plansystæt – ikke alle ordre når igennem
- **Fragtleverandør henter for tidligt**: forhandl afhentingstidspunkt ved volumenvstigninger
- **Aften-ordrer**: kommunikér tydeligt at de afsendes næste hverdag

### Cut-off ved specielle situationer
| Situation | Handling |
|---|---|
| Fredag eftermiddag | Levering mandag (ikke lørdag) – kommunikér det |
| Helligdage | Justeret cut-off kommunikeret på forhånd |
| Black Friday | Reduceret cut-off (tidlig afhentning) eller ekstra afhæntning |
| Systemnedbrud | Fallback-procedure for manuel afsendelse |

## Typiske fejl

- **Cut-off sat for tidligt** – du misser konverteringer fra senkunder
- **Cut-off sat for sent** – du bryder løfter og får klager
- **Ikke kommunikeret på hjemmesiden** – kunderne ved ikke hvornår de skal bestille
- **Cut-off forskellig for produkttyper** men ikke differentieret i kommunikation
- **Mangler buffer** – en ekstra ordre kl. 15:14 når ikke pakkes før afhentning

## Sådan gør du det rigtigt

- Vis cut-off **dynamisk og tydeligt** i checkout – countdown-timer har dokumenteret konverteringseffekt
- Sæt cut-off konservativt og indfri den konsistent – bedre at love D+1 og levere D+0
- Forhandl med fragtleverandør om sen afhentning – 10.000+ forsendelser/måned giver forhandlingsstyrke
- Log cut-off-oversk ridholdelse og analyser månedligt
- Opdater cut-off-kommunikation ved ændringer i fragtafhæntning

## Brug denne artikel: tjekliste

- [ ] Fragtleverandørens faktiske afhentingstidspunkt dokumenteret
- [ ] Intern cut-off beregnet (afhentning minus pluk-tid minus buffer)
- [ ] Cut-off kommunikeret tydeligt på forsiden og i checkout
- [ ] Procedure for edge cases (helligdage, rush, nedbrud)
- [ ] Måling af cut-off-oversk ridelse oprettet

**Næste skridt:** Spørg din fragtreppræsentant om det eksakte afhentingstidspunkt på dit lager. Beregn realistisk intern cut-off. Opdater teksten på din webshop i dag.

## SmartPack understøttelse

SmartPack håndterer automatisk cut-off-logik: ordrer inden cut-off går i dagens batch, ordrer efter cut-off flyttes til næste dag. Systemet kan konfigurere cut-off per produkt, fragtleverandør og ugedag – og sender automatisk kundekommunikation med korrekt leveringsdate.

## FAQ

**Hvad er cut-off tid?**
Seneste frist for ordremodtagelse til afsendelse samme dag. Ordrer efter cut-off afsendes næste hverdag.

**Hvad er realistisk cut-off for en lille webshop?**
Typisk 13:00–15:00 afhængigt af plukkapacitet og fragtafhæntning. Start konservativt og juster op.

**Kan man have forskellig cut-off for forskellige produkter?**
Ja. Standardvarer kan have sen cut-off; specialordrer eller store varer kræver længere behandlingstid.

**Hvad gør man med ordrer modtaget efter cut-off fredag?**
De afsendes mandag. Kommunikér dette tydeligt – kunder accepterer det hvis de ved det på forhånd.

**Påvirker cut-off Google Shopping og sammenligningstjenester?**
Ja. Adskillige platforme viser leveringstid baseret på cut-off. Korrekt cut-off = korrekte leveringsestimates = bedre konvertering.

