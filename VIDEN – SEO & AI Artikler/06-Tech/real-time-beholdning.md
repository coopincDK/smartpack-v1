---
primary_keyword: real-time beholdning lager
secondary_keywords: realtids lagerbeholdning, live beholdning system, lager beholdning opdatering, lagersaldo realtid
cluster: 06-Tech
---

# Real-time beholdning – hvad det er, og hvad det koster dig ikke at have det

Beholdningen der er registreret i dit system, og den beholdning der fysisk er på hylden, er to forskellige ting – med mindre du har real-time tracking. Her er forskellen i tal.

## Hvad er real-time beholdning?

Real-time beholdning er en digital registrering af din fysiske beholdning, der opdateres i det øjeblik en hændelse sker:

- En vare modtages → beholdning stiger øjeblikkeligt
- En vare plukkes → beholdning falder øjeblikkeligt
- En retur ankommer → beholdning opdateres øjeblikkeligt

**Modsætning: Batch-opdatering** (periodisk synkronisering, fx daglig eller ugentlig). Her er der altid forsinkelse – og risiko for at sælge varer du ikke har.

## Hvad sker der uden real-time beholdning?

**Problem 1: Oversolgte varer**
Webshop viser 5 på lager. Lageret har 0 (de blev solgt, men systemer er ikke synkroniseret). Kunden bestiller, du kan ikke levere.

Konsekvens: Kundeservice-kontakt, forsinkelse, annullering, refusion – og en skuffet kunde.

**Problem 2: Forsinket genbestilling**
Du tror du har 50 enheder. Du har 30 (systemet er forsinket). Du bestiller for sent og løber tør.

**Problem 3: Falsk tryghed**
"Vi har styr på lageret" – men reelt er der 2-4% afvigelse mellem system og virkelighed.

## Beholdningsnøjagtighed

| System | Typisk nøjagtighed |
|--------|-------------------|
| Manuel + papirlister | 90-95% |
| Excel med daglig opdatering | 93-97% |
| WMS med batch-scanning | 97-99% |
| WMS med real-time scanning | 99-99,9% |

**2% beholdningsafvigelse på 2 mio. kr. varelager = 40.000 kr. i "ghost inventory"** – varer systemet tror du har, men du ikke har.

## Hvad kræver real-time beholdning?

1. **WMS med real-time registrering** – Systemet skal opdatere ved hændelse, ikke batch
2. **Scanning ved alle bevægelser** – Modtagelse, pluk, pack, retur
3. **Integration med webshop** – Beholdning skal synkroniseres til salgskanal i real-time
4. **Cyklisk optælling** – Løbende stikprøvetælling for at validere systemets nøjagtighed

## Hvornår er real-time kritisk?

Real-time er kritisk, når:
- Du sælger på tværs af kanaler (webshop + marketplace)
- Du har hurtigomsættende varer med lav sikkerhedsstock
- Du driver kampagner der udløser spike i ordrervolumen
- Forsinket beholdningsopdatering historisk har skabt oversalg

## Typiske fejl

1. **Opdaterer kun beholdning dagligt** – Det er nok til at skabe oversalg ved kampagner.

2. **Stoler på system uden verifikation** – Real-time data er kun valid, hvis alle bevægelser registreres. En vare der plukkes uden scanning opdaterer ikke systemet.

3. **Glemmer returner** – Returnerede varer bør opdatere beholdning øjeblikkeligt, men lander ofte i karantæne og opdaterer systemet dage/uger efter.

## Sådan gør du det rigtigt

1. **Kræv real-time synkronisering i webshop-integrationen** – Ikke batch. Ikke "hvert 15. minut". Real-time.

2. **Indfør cyklisk optælling** – Tæl 10-20% af sortimentet ugentligt, roter over 6 uger. Giver løbende validering uden stor årsopgørelse.

3. **Mål beholdningsnøjagtighed månedligt** – KPI: system-beholdning vs. fysisk tælling. Mål: over 99%.

## SmartPack understøttelse

SmartPack opdaterer beholdning real-time ved alle hændelser: modtagelse, pluk, pack og retur. Webshop-integration synkroniserer øjeblikkeligt. Cyklisk optællings-modul giver løbende validering. Du kan altid stole på det tal, systemet viser.

## FAQ

**Hvad er cyklisk optælling?**
En metode, hvor en del af sortimentet tælles løbende (fx 5% per uge over 20 uger), frem for én stor årsopgørelse.

**Hvad koster det at sælge en vare du ikke har?**
Direkte: refusion + kundeservice-tid. Indirekte: kundetilfredshed og LTV. Estimat: 200-500 kr. per hændelse.

**Kan real-time beholdning integrere med multiple salgkanaler?**
Ja. Multi-channel real-time synkronisering er standard i moderne WMS.

**Hvad er "ghost inventory"?**
Beholdning der eksisterer i systemet men ikke fysisk. Skabt af registeringsfejl, tyveri eller svind uden registrering.

**Hvad er acceptable beholdningsafvigelse?**
Under 0,5% for A-varer. Under 1% total. Over 2% er et systemisk problem.

