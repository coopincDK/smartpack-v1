---
primary_keyword: skal du bygge dit eget WMS
secondary_keywords: custom WMS, bygge lager software selv, udvikle WMS, eget lagersystem
cluster: 07-Decision
article_type: beslutning
---

# Skal du bygge dit eget WMS? Her er sandheden

Du beslutter at bygge jeres eget WMS. "Vi har et stærkt udviklerteam. Vi kender vores processer bedst."

18 måneder senere: 4.500.000 kr. brugt. Systemet virker – men fragtintegration til GLS fejler 40% af tiden. Serienummer-tracking mangler. Medarbejderne hader UI'et.

Et færdigt WMS: 8.000 kr./md = 144.000 kr. over samme periode.

Forskel: **4.356.000 kr. tabt** på et valg der føltes "rigtigt".

Plus: dit udviklerteam bruger 25% af deres tid på vedligeholdelse i stedet for produktudvikling.

Her er hvad det RENT FAKTISK koster at bygge selv.

## Kort svar

> Byg ikke dit eget WMS medmindre du har 5+ dedikerede udviklere, 5+ mio. kr. budget og 2+ års tidshorisont. For alle andre er et eksisterende WMS enormt meget billigere – et færdigt system koster 8.000 kr./md vs. 3–6 mio. kr. at bygge selv.

## Hvornår opstår tanken?

Tanken om at bygge selv opstår typisk når:
- Ingen eksisterende systemer matcher præcis det I behøver
- I har et stærkt in-house development team
- I har oplevet dårlige oplevelser med eksisterende WMS-leverandører
- I tror at jeres processer er unikke nok til at kræve custom-løsning

## Hvad koster det at bygge et WMS?

Lad os være konkrete. Et funktionelt WMS med scanning, plukoptimering, fragtintegration og webshop-integration kræver:

- **Minimum 3.000–6.000 udviklingstimer** for et basisprodukt
- **Løbende vedligeholdelse**: 15–25% af initial udviklingsomkostning per år
- **Fragtleverandør-integratioener**: GLS, PostNord, Bring, DAO – hver integration kræver 40–100 timers arbejde
- **Hardware-support**: Scanner-interfaces, label-printers, Wi-Fi-protokoller
- **Compliance-opdateringer**: ADR, GDPR, Intrastat – regulering ændrer sig og systemet skal opdateres

Ved 1.000 kr./time udviklertid: **3–6 millioner kr. bare at komme i gang**.

## Hvad du typisk undervurderer

**Integration-vedligeholdelse**: GLS ændrer deres API. PostNord opdaterer krav. Når din leverandør ændrer noget, skal din kode opdateres. Det er ikke en engangsinvestering.

**Fejlhåndtering**: Et WMS håndterer edge cases: annullerede ordrer under pluk, systemfejl under pakning, forkerte labels, lager-mismatch. Hvert edge case kræver udvikling og test.

**Skalering**: At bygge et system der fungerer ved 100 ordrer/dag er én ting. At det stadig fungerer ved 1.000 ordrer/dag kræver arkitektur-beslutninger fra dag ét.

**Kompetenceafhængighed**: Når din CTO siger op, hvem vedligeholder så systemet?

## Hvornår giver det mening at bygge selv?

Der er faktisk scenarier, hvor custom-udvikling giver mening:

- Du er en virksomhed med 100.000+ ordrer/dag (enterprise-skala)
- Dit produkt/proces er fundamentalt anderledes end alle eksisterende systemer
- Du har et dedikeret development team på 5+ udviklere til lager-domænet
- Din konkurrencefordel ER specifikt lagerteknologi

For de fleste webshops med under 5.000 ordrer/dag er ingen af disse betingelser opfyldt.

## Konkret regnestykke: Byg vs. køb

| Post | Byg selv | Køb eksisterende WMS |
|------|----------|---------------------|
| Initialt (basis WMS) | 3–6 mio. kr. | 5.000–25.000 kr. onboarding |
| Per fragtintegration (GLS, PostNord osv.) | 40.000–100.000 kr./stk. | Inkluderet |
| Årlig vedligeholdelse | 20–30% af initial = 600k–1,8 mio. | 1.500₀10.000 kr./måned |
| Time-to-market | 18–36 måneder | 1 uge |
| Fejl ved 500 ordrer/dag i mellemtiden | 700.000 kr./år | 0 |
| Risiko: key developer forlader | Høj — uforstået codebase | Ingen |

**Konklusion**: For alle under 100.000 ordrer/dag er ROI på et eksisterende WMS enormt meget bedre end custom-byg.

## Alternativet: Tilpas et eksisterende system

De bedste WMS-systemer er API-drevne. Du kan bygge custom integrationer, tilpasse workflows og udvide funktionaliteten – uden at starte fra nul.

Det giver dig:
- Et velfungerende fundament du ikke skal vedligeholde
- Custom tilpasning der matcher dine behov
- Lave totalomkostninger sammenlignet med full custom

## Typiske fejl

- Undervurderer vedligeholdelsesomkostningen (typisk 5–10× af hvad man regner med)
- Bygger MVP og tror det er done – lager-software er aldrig done
- Mister key-developer og sidder med uforstået kodebase
- Bruger 2–3 år på at bygge hvad en eksisterende løsning tilbyder dag ét

## Sådan gør du det rigtigt

1. Lav en ærlig cost-benefit analyse over 5 år
2. Undersøg alle eksisterende systemer grundigt inden du beslutter at bygge
3. Hvis du bygger: API-first arkitektur fra dag ét
4. Estimér vedligeholdelse til 20–30% af initialomkostning per år
5. Byg kun det der er unikt for din virksomhed – brug eksisterende for alt andet

## Hvornår skal du handle?

Handle ved at undlade at bygge – medmindre du møder kriterierne ovenfor. Vælg et eksisterende WMS og brug ressourcerne på din kerneforretning.

## Det opdager de fleste for sent

1. **Vedligeholdelsesomkostningen underestimeres med faktor 5–10** — man regner med ”20 timers vedligeholdelse om måneden”; realiteten er at GLS’s API-ændering, PostNords nye krav og ny GDPR-fortolkning tilsammen kræver en fuldtidsudvikler på sigt
2. **Key developer forlader** — ved 43% turnover er risikoen reel; når den person der kender kodebasen stopper, står man med et system ingen forstår, og som koster 300.000–500.000 kr. at dokumentere og overdrage
3. **MVP er aldrig done** — man bygger v1 på 8 måneder, men v1 dækker ikke edge cases; v2 tager 6 måneder; før man er fuldt funktionel er der gået 2 år og 4+ mio. kr.

## SmartPack frem for custom

SmartPack er API-drevet og kan tilpasses via integrationer. Du får et gennemtestet system på 1 uge frem for 18 måneders udviklingsforløb.

**Hvornår SmartPack IKKE giver mening**: Er jeres konkurrencefordel specifikt lagerteknologi (fx du sælger logistics-as-a-service til andre), eller er jeres processer fundamentalt anderledes end standard e-commerce (specialiseret pharma-automatisering, robotlager med custom hardware), kan det give mening at bygge selv. Men det kræver: 5+ dedikerede udviklere, 2+ års tidshorisont, og 5+ mio. kr. budget. De færreste webshops møder disse kriterier.

## Brug denne artikel
- [ ] Gennemgå kriterierne for ”hvornår giver det mening at bygge” — opfylder I dem alle?
- [ ] Beregn den reelle 5-års TCO: byg (inkl. vedligeholdelse) vs. eksisterende WMS
- [ ] Lav en ærlig vurdering: er lager-software jeres kernekompetence?
- [ ] Undersøg om custom API-integration på eksisterende WMS dækker jeres unikke behov
- [ ] Næste skridt: book demo og evaluer SmartPack’s API-muligheder før du beslutter at bygge

## FAQ

**Hvad hvis vi kun har brug for én specifik funktion?**
Undersøg om WMS-leverandøren kan tilbyde custom API-endpoint eller om en tredjepartsapp dækker behovet.

**Vi er et tech-firma – giver det ikke mening for os?**
Måske. Men er lager-software jeres kernekompetence? Er det det I vil bruge jeres developere på?

**Hvad med open source WMS?**
Odoo WMS er open source og kan tilpasses. Det er et fornuftigt kompromis – men kræver stadig IT-ressourcer.

**Kan vi bygge gradvist?**
Ja – men risikoen er at grundarkitekturen træffer forkerte beslutninger tidligt der er svære at ændre.

**Hvad er minimum for at bygge selv?**
3 dedikerede back-end udviklere, 1 lager-domæneekspert, 500.000+ kr. budget, og vilje til 2+ års udviklingstid.

## Læs også

- [Cloud vs. on-premise WMS](cloud-vs-on-premise-wms.md)
- [Break-even på lagerinvestering](../05-Economics/break-even-lager.md)
- [Bedste WMS til webshop](bedste-wms-til-webshop.md)
- [Book en gratis SmartPack-demo](https://smartpack.dk/demo)

