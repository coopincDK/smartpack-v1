---
primary_keyword: skifte wms midt i saeson
secondary_keywords: [wms skift risiko, systemskifte lager, wms migration, skifte wms webshop]
cluster: 12-RealWorld
article_type: case
---

# Case: Hvad sker der, når du skifter WMS midt i sæsonen?

Dit nuværende WMS virker ikke. Det er langsomt, integrationen fejler jævnligt, og dit support-billede har 12 uleste tickets. Du vil skifte nu. Men det er november. Hvad sker der hvis du gør det?

## Kort svar

At skifte WMS under peak er en af de dyreste beslutninger du kan træffe. Migrationsperioden medfører altid reduceret kapacitet, højere fejlrate og IT-risiko. Udsæt til januar hvis overhovedet muligt. Kan du ikke vente: her er hvordan du minimerer skaden.

---

## Hvad der faktisk sker når du skifter WMS

### De første 48 timer
Datamigration. Al historisk lager-data skal eksporteres fra det gamle system og importeres i det nye. I teorien: automatisk. I virkelighed: encoding-fejl, manglende EAN-koder, duplikater. Plan for 2-3 dages manuel datarensning.

### Dag 3-7: Integration
Shopify/WooCommerce-webhooks skal opsættes til det nye WMS. Fragtlabels skal konfigureres. Test end-to-end: send en testordre, bekræft at den når WMS, bekræft at fulfillment går retur til webshop.

### Dag 7-14: Oplearingsperiode
Dine medarbejdere lærer et nyt system. Forvent 30-40% lavere produktivitet i denne periode. Ved 200 ordrer/dag: du håndterer effektivt 120-140. Resten samler sig.

### Dag 14-30: Stabilisering
Fejl i systemet opdages i drift. Kanttilfaelde som ikke blev testet. Refill-alerts der ikke trigger. Returnerings-flow der ikke stemmer med det gamle. Plan for 2 ugers intensiv support.

---

## De tre risici du må acceptere

**Risiko 1: Ordrer der falder ud af systemet**
Ved integration-fejl når en ordre ikke fra webshop til WMS. Den eksisterer i Shopify men behandles aldrig. Kunden klager 3 dage efter køb. Mitigering: åben ordrerapport tjekkes manuelt 2 gange dagligt i de første 14 dage.

**Risiko 2: Lagerdata forkert efter migration**
Systemet siger 48 enheder. Der er 41. Migration-fejl har slået lagertal til. Kunder beståller. Du kan ikke levere. Mitigering: cycle count af dine top-50 SKU'er på dag 3 efter migration.

**Risiko 3: Medarbejderne går i panik**
Et nyt system under peak er stressende. Fejlraten stiger når folk er pressede og ukendte med systemet. Mitigering: ekstra personale i de 2 første uger, lav kravene til ekspeditionstid midlertidigt.

---

## Hvornår du absolut ikke skal skifte

- Oktober-december (Q4 / Black Friday / jul)
- Uge 44-52
- De 2 uger før og efter en stor kampagne

**Bedste tidspunkter:** Januar-februar (efter Q4 drop) eller juni-juli (sæsonlav for de fleste e-commerce).

---

## Hvis du ikke kan vente

1. **Parallelkørsel:** Brug begge systemer i overlap-periode (7-14 dage). Dobbeltregistrering er tidskrævende men sikker.
2. **Frys sortimentet:** Ingen nye SKU'er under migrationen.
3. **Ekstra manuelt tilsyn:** Åben ordrerapport tjekkes manuelt morgen og eftermiddag.
4. **Kommunikér til kunder:** Juster leveringstid-forventninger i webshop med 1-2 ekstra dage under migration.

---

## FAQ

**Hvad er den typiske downtime ved WMS-skift?**
Med god planlanning: 4-8 timers teknisk nedetid (typisk over en weekend). Med dårlig planlanning: 1-3 dage fuld nedetid + 1-2 uger reduceret kapacitet.

**Hvad koster et WMS-skift typisk?**
Direkte: IT-integration 10.000-50.000 kr., opsætning og konfiguration 5.000-20.000 kr. Indirekte: reduceret kapacitet i 2-4 uger = 50.000-150.000 kr. ved 200+ daglige ordrer.

## Læs også
- [Hvad er et WMS?](/viden/fundamentals/hvad-er-wms)
- [Fejl ved valg af system](/viden/beslutning/fejl-ved-valg-af-system)
- [WMS pris](/viden/beslutning/wms-pris)
