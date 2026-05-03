---
primary_keyword: hvornår ERP ikke er nok til lagerstyring
secondary_keywords: ERP lager begrænsninger, ERP vs WMS, ERP lagermodul mangler, supplement til ERP
cluster: 07-Decision
article_type: beslutning
---

# Hvornår er dit ERP's lagermodul ikke nok?

Du har investeret 450.000 kr. i et ERP-system.

Lagermodulet er inkluderet. "Vi har styr på det."

6 måneder senere: medarbejderne printer pluklister og går tilfældigt rundt på lageret. Fragtlabels genereres manuelt i GLS-portalen. Fejlrate: 4,5%.

Regnestykket: 150 ordrer × 250 dage × 4,5% × 350 kr. = **590.625 kr./år** i fejl.

ERP registrerer lagerbevægelser. Det optimerer dem ikke.

Her er hvad ERP's lagermodul IKKE kan – og hvornår det begynder at koste dig penge.

## Kort svar

> ERP registrerer lagerbevægelser – det optimerer dem ikke. Mangler du scanning, plukoptimering og fragtlabelintegration? Så er ERP’s lagermodul ikke nok. Tilkobl et WMS ved 50+ ordrer/dag med varianter eller scanning-krav.

## ERP versus WMS: Grundlæggende forskel

ERP (Enterprise Resource Planning) handler om at styre forretningen: økonomi, indkøb, produktion, salg og HR i ét system. Lagermodulet er en del af dette system – men det er designet til at registrere lagerbevægelser, ikke til at optimere dem.

WMS (Warehouse Management System) er bygget specifikt til lageroperationer: scanning, plukoptimering, batch-picking, medarbejder-tracking og fragtintegration.

## Hvad ERP typisk mangler

**Real-time scanning**: De fleste ERP-lagermoduler mangler en mobil scan-og-bekræft workflow. Data tastes ind manuelt eller batchvis.

**Plukoptimering**: ERP sender ikke medarbejderen til den korteste rute. Den genererer en plukordre – men ikke en optimeret plukrute.

**Fragtintegration**: ERP taler sjældent direkte med GLS, PostNord, Bring. Du skal manuelt overføre data til fragtleverandørens system.

**Medarbejder-tracking**: ERP registrerer hvad der er sket – ikke hvem der plukkede hvad og hvornår.

**Mobilitet**: ERP-interfaces er designet til desktop. Et lager-workflow på en scanner kræver en mobilvenlig løsning.

**Opdateringsfrekvens**: ERP-opdateringer sker typisk med forsinkelse. Real-time lagerstatus er ikke altid tilgængeligt.

## Konkrete eksempler

**Microsoft Dynamics NAV/BC**: Har et lagermodul – men kræver betydelig konfiguration og tilpasning for at understøtte scanning. Mange virksomheder supplerer med dedikeret WMS.

**SAP Business One**: God til økonomi, svag til lageroperationer. SAP's WM-modul er dyrt at implementere og komplekst at drifte.

**Uniconta/e-conomic**: Populære i Danmark til økonomi – men ingen reel lagerfunktionalitet ud over basale lagerbeholdninger.

**Dynamics 365 F&O**: Avanceret WMS inkluderet – men til enterprise-størrelse og enterprise-priser.

## Hvornår er ERP's lagermodul utilstrækkeligt?

- Over 50 ordrer/dag med varianter eller bundter
- Krav til scanning og bekræftelse
- Fragtlabels skal genereres automatisk
- Medarbejder-performance skal trackes
- Plukoptimering er nødvendig for effektivitet
- Multi-warehouse med kompleks lagerstyring

## Konkret regnestykke: Hvad koster ERP-lagermodulets begrænsninger?

| Manglende funktion | Typisk konsekvens | Årlig omkostning |
|-------------------|------------------|------------------|
| Ingen scanning → 2% fejlrate | 200 ordrer/dag × 350 kr. | ~510.000 kr./år |
| Ingen plukoptimering (TSP) | 30–40% længere plukruter | ~1–2 timer ekstra/dag |
| Manuel fragtlabel-generering | 2 min/ordre ekstra ved 200/dag | ~100.000 kr./år |
| Højt turnover pga. frustrerende ERP-UX | 43% turnover × 30–50k/ansættelse | 30.000–50.000 kr./fratrædelse |

## Løsningen: ERP + WMS

De fleste mellemstore virksomheder bruger ERP til økonomi og WMS til lageroperationer – og integrerer de to systemer. Dette er den anbefalede model:

1. WMS modtager ordrer og styrer lageroperationen
2. WMS sender forsendelsesdata til ERP
3. ERP håndterer fakturering, finans og rapportering
4. Lagerbeholdning synkroniseres begge veje

## Typiske fejl

- Investerer massivt i ERP-tilpasning frem for at tilkøbe WMS
- Bruger ERP's lagermodul og accepterer suboptimal drift
- Undlader at integrere WMS og ERP – dobbeltregistrering og fejl
- Vælger WMS der ikke kan integrere med eksisterende ERP

## Sådan gør du det rigtigt

1. Kortlæg nøjagtigt hvad dit ERP-lagermodul kan og ikke kan
2. Definer de operationelle krav der mangler
3. Find WMS der integrerer med dit ERP
4. Kør integrationsstest med reelle scenarier
5. Start med én integration ad gangen

## Det opdager de fleste for sent

1. **ERP-tilpasningsprojektet eksploderer i scope** — man beslutter at ”fikse” ERP-lagermodulet i stedet for at tilkoble WMS; projektet udvider sig og koster 3–5× mere end alternativet
2. **Fragtintegrationen mangler helt** — de fleste ERP-lagermoduler taler ikke direkte med GLS, PostNord og Bring; det opdages først når man skal sende sin første pakke og ingen kan forklare hvordan labels genereres
3. **Real-time synkronisering mod Shopify/WooCommerce er ikke til stede** — ERP opdaterer lagerstatus batch-vis; oversalg under kampagner er resultatet, og det opdages når kunder klager

## SmartPack og ERP-integration

SmartPack kan integreres med de fleste ERP-systemer via API. Ordrer flyder fra ERP til SmartPack, forsendelsesdata sendes retur. Du beholder dit ERP – og får WMS-funktionalitet oveni.

**Hvornår SmartPack IKKE giver mening**: Har du Dynamics 365 F&O eller SAP EWM med et allerede fuldt konfigureret og velfungerende WMS-modul, er der ingen grund til at tilkoble SmartPack — disse enterprise-systemer dækker WMS-funktionaliteten. SmartPack er mest værdifuldt som WMS-supplement til ERP-systemer der har svage eller ikkeeksisterende lagermoduler (Uniconta, e-conomic, Business Central med grundkonfiguration).

## Brug denne artikel
- [ ] Kortlæg hvad dit ERP-lagermodul konkret kan og ikke kan
- [ ] Test: kan dit ERP generere fragtlabels direkte til GLS/PostNord/Bring?
- [ ] Test: kan dit ERP scanne og bekræfte pluk på mobil enhed?
- [ ] Beregn din nuværende fejlomkostning: fejl/måned × 350 kr.
- [ ] Vurdér: ERP-tilpasning vs. WMS-tilkobling — regn TCO over 36 måneder

## FAQ

**Skal jeg skifte ERP hvis det ikke har godt lagermodul?**
Nej – tilkobl et WMS. At skifte ERP for lagerets skyld er uforholdsmæssigt dyrt.

**Hvad koster ERP-WMS integration?**
Afhænger af ERP. Standardintegrationer via API koster 10.000–50.000 kr. i implementering.

**Er der ERP der har et godt WMS-modul?**
SAP EWM og Dynamics 365 F&O har avancerede WMS-moduler – men til enterprise-priser og kompleksitet.

**Hvad med Odoo?**
Odoo har et relativt godt lagermodul til mellemstore virksomheder – særligt om du er på Odoo i forvejen.

**Hvornår er ERP-lagermodulet godt nok?**
Under 30–40 ordrer/dag med simpel struktur og ingen krav til scanning/optimering.

## Læs også

- [Hvornår fejler Excel som lagerstyring?](hvornår-excel-fejler.md)
- [Skjulte lageromkostninger](../05-Economics/skjulte-lageromkostninger.md)
- [Bedste WMS til webshop](bedste-wms-til-webshop.md)
- [Book en gratis SmartPack-demo](https://smartpack.dk/demo)

