---
primary_keyword: GDPR lager og logistik
secondary_keywords: GDPR ordredata, persondata lager, databehandleraftale WMS, GDPR e-commerce
cluster: 08-Compliance
---

# GDPR på lageret: Hvad e-commerce virksomheder skal vide

Ordredata er persondata. Navn. Adresse. Telefonnummer. Email. Ordreindhold.

GDPR-bøde: op til 4% af global omsætning. For en webshop på 5 mio. kr./år = 200.000 kr. i maksimal bøde. For en webshop på 50 mio. kr./år = 2.000.000 kr.

Manglende databehandleraftale med dit WMS: 50.000–200.000 kr. i bøde. Databrud uden anmeldelse inden 72 timer: 100.000–500.000 kr.

**Konsekvensen ved manglende GDPR-compliance:**
- Databrud uden anmeldelse: 100.000–500.000 kr. i bøde
- Manglende databehandleraftale: 50.000–200.000 kr.
- Maksimal bøde: 4% af global omsætning eller 20 mio. EUR

## Hvad er persondata i lager-kontekst?

Enhver information der kan identificere en person er persondata under GDPR:

- Kundens navn og adresse (leverings- og faktureringsadresse)
- Telefonnummer (brugt til leveringsnotifikationer)
- E-mailadresse
- Ordreindhold (hvad kunden har købt)
- IP-adresse og tracking-informationer
- Returnerings-notater (kan indeholde personlige oplysninger)

Alt dette data flyder igennem dit WMS/lagersystem ved hver ordre.

## Hvad koster manglende GDPR-compliance?

| Scenario | Konsekvens | Kr./hændelse (estimat) |
|----------|-----------|------------------------|
| Databrud (5.000 kundedata eksponeret) uden anmeldelse | Bøde + erstatningskrav | 100.000–500.000 kr. |
| Manglende databehandleraftale med WMS-leverandør | Bøde ved Datatilsynets kontrolbesøg | 50.000–200.000 kr. |
| Ordredata gemmes i 15 år uden sletning | Bøde + krav om sletning | 25.000–100.000 kr. |

**Real cost:** For en webshop med 10.000 ordrer/år = 75.000–300.000 kr./år i risiko ved manglende GDPR-compliance.

## Databehandleraftale – et krav du ikke kan undgå

Bruger du et cloud-baseret WMS, er leverandøren din **databehandler**. Du er den **dataansvarlige**. GDPR kræver, at du indgår en skriftlig **databehandleraftale** (DPA) med alle systemer der behandler persondata på dine vegne.

Dette inkluderer:
- Dit WMS (fx SmartPack)
- Fragtleverandørerne (GLS, PostNord, Bring – de modtager adresser)
- 3PL-leverandøren (hvis du bruger 3PL)
- Lagerstyring- og ERP-systemer

**Krav til databehandleraftalen:**
- Formål og omfang af databehandling
- Sikkerhedsforanstaltninger
- Ret til audit
- Procedure ved databrud
- Sletningsrutiner

## Hvad skal slettes – og hvornår?

Persondata i ordrer bør slettes eller anonymiseres når det ikke længere er nødvendigt. Typiske krav:

- Ordredata: Opbevar i 5 år af bogføringshensyn (regnskabsloven) – men log-data og tracking kan slettes tidligere
- Returdata: Slet personlige noter så snart returprocessen er afsluttet
- Medarbejderdata: Egne regler for HR-data

## Adgangsstyring på lageret

GDPR kræver at adgangen til persondata er begrænset til dem der har behov:

- Lagermedarbejdere bør kun se den information de behøver (adresse, ordreindhold)
- Administratorer bør have separat adgang med logging
- Systemlog: hvem tilgik hvilke data hvornår?

Mange WMS-systemer understøtter role-based access control (RBAC) – aktivér det.

## Databrud: Hvad gør du?

Hvis persondata kompromitteres (fx systemindbrudd, utilsigtet eksponering):

1. Vurder omfanget inden for 24 timer
2. Anmeld til Datatilsynet inden for 72 timer (hvis risiko for individers rettigheder)
3. Informér berørte kunder hvis risikoen er høj
4. Dokumentér hændelsen og din respons

**Har du en databrudsprocedure?** De fleste SMV-webshops har ikke.

## Det opdager de fleste for sent

1. **Datatilsynet checker din webshop i uge 22** — de beder om databehandleraftale med dit WMS. Du har ingen. Bøde: 75.000 kr. + krav om aftale inden 30 dage.

2. **Systemindbrudd i uge 38** — 5.000 kundedata eksponeres. Du opdager det efter 5 dage. Du anmelder ikke til Datatilsynet. 3 måneder senere: bøde 250.000 kr. + erstatningskrav fra kunder.

3. **Tidligere medarbejder i uge 15** — han har stadig adgang til WMS 6 måneder efter opsigelse. Han downloader 10.000 kundedata og sælger dem. Du opdager det for sent. Bøde: 150.000 kr. + erstatningskrav.

## Tredjelandsoverførsler

Bruger du systemer der opbevarer data uden for EU/EØS (fx hosting i USA), kræves der særlige garantier:
- Standard Contractual Clauses (SCC'er)
- Tjek om leverandøren er EU-AI Act og GDPR-compliant

## Typiske GDPR-fejl i lager-drift

- Ingen databehandleraftale med WMS-leverandøren
- Ordredata gemmes i usikret Excel på delt drev
- Ingen adgangsstyring – alle medarbejdere ser alt
- Ingen databrudsprocedure
- Data slettes aldrig – ordredata fra 10+ år gemmes stadig

## Gør det rigtigt nu

1. **Kortlæg alle systemer der behandler persondata** — lav data-mapping inden uge 16
2. **Kræv og underskriv databehandleraftaler med alle leverandører** — send email i dag
3. **Implementér RBAC i dit WMS** — begræns adgang per rolle
4. **Lav en sletningspolitik og automatisér slettning** — slet ordredata efter 5 år
5. **Lav en databrudsprocedure og test den** — hvem gør hvad inden for 24/72 timer?

## Det går konkret galt her

**1. Sender ordrebekræftelse med kundedata til forkert modtager**

Din lagermedarbejder eksporterer ordreliste i uge 12 for at sende til fragtfirmaet. Han sender ved en fejl til forkert email-adresse. 200 kunders navne, adresser og ordreindhold eksponeres. GDPR kræver anmeldelse til Datatilsynet inden 72 timer. Du opdager det efter 5 dage. Resultat: Bøde 100.000 kr. + anmeldelsespligt + informationspligt til berørte kunder + omdømmeskade.

**2. Eksporterer lagerdata med kundeinfo til 3PL uden DPA**

Du skifter til 3PL-leverandør i uge 18. Du eksporterer 10.000 ordrer med kundedata til deres system. Du har ingen databehandleraftale (DPA) med 3PL. Datatilsynet checker i uge 35. Resultat: Bøde 150.000 kr. + krav om DPA inden 14 dage + risiko for SALGSSTOP indtil compliance er på plads.

**3. Medarbejder ser alle kunders ordrehistorik – intern adgangsstyring mangler**

Din nye lagermedarbejder starter i uge 8. Han får fuld admin-adgang til WMS fordi "det er nemmest". Han kan se alle kunders ordrehistorik, inkl. personlige noter og returdata. I uge 22 downloader han 5.000 kundedata og sælger dem. Datatilsynet opdager det. Resultat: Bøde 200.000 kr. + erstatningskrav fra kunder + politianmeldelse af medarbejder.

## SmartPack og GDPR: Hvornår giver det mening?

**JA, hvis:**
- Du behandler 1.000+ ordrer/måned
- Du har flere medarbejdere med adgang til ordredata
- Du vil have automatisk RBAC og databehandleraftale inkluderet

**NEJ, hvis:**
- Du behandler under 200 ordrer/måned → simpelt WMS med manuel adgangsstyring er billigere

**Alternativet koster:**
- Manuel GDPR-compliance: 20–40 timer/år = 15.000–30.000 kr./år i lønomkostning
- Databrud uden procedure: 1 hændelse = 100.000–500.000 kr.

**SmartPack-fordel:** Leveres med databehandleraftale inkluderet. Data lagres i EU. Systemet understøtter RBAC og automatisk datahåndtering.

## FAQ

**Skal mine lagermedarbejdere kende GDPR?**
Grundlæggende awareness: ja. De behandler persondata ved hver ordre.

**Hvad er maksimumstraffen?**
4% af global omsætning eller 20 millioner EUR – det største af de to.

**Hvad er forskellen på dataansvarlig og databehandler?**
Du (webshopen) bestemmer formålet = dataansvarlig. WMS-leverandøren behandler data på dine vegne = databehandler.

**Skal jeg have DPO (Data Protection Officer)?**
For de fleste SMV-webshops: nej. Undtagelse: hvis du systematisk behandler store mængder følsomme persondata.

**Er anonymisering det samme som sletning?**
Nej – men korrekt anonymisering betyder at data ikke længere er persondata og dermed falder ud af GDPR's scope.
