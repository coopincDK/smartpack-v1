---
primary_keyword: lager setup 50 ordrer dag
secondary_keywords: [webshop lager 50 ordrer, lille lager setup, lager 50 daglige ordrer, webshop lager eksempel]
cluster: 12-RealWorld
article_type: case
---

# Case: Webshop med 50 ordrer/dag — et typisk lager-setup

Du sender 50 ordrer om dagen. Det er ikke så lidt. Det er 18.000 ordrer om året, og det er nok til at fåle når noget går galt. Her er hvad et typisk lager-setup ser ud på det niveau — hvad der virker, hvad der begynder at knække, og hvad du begynd at investere i.

## Snapshot: Hvad virker på dette niveau

| Parameter | Typisk setup | Hvad virker |
|---|---|---|
| Lagerareal | 80-150 m² | Tilstrækkelig med korrekt indretning |
| Medarbejdere | 1-2 fuldtid | Kan håndtere 50 ordrer komfortabelt |
| WMS | Simple: Shopify inventory + scanning | Holder til ~75 ordrer/dag |
| Ekspeditionstid | 3-5 min/ordre | Acceptabelt, men optimeringspotentiale |
| Fejlrate | 1-2% (uden scanning) | For højt — under 0,5% er målet |

---

## Et typisk dagligt forløb

**Kl. 07:00:** Medarbejder møder ind. Tjekker nye ordrer (typisk 30-40 fra aften + nat).

**Kl. 07:15:** Print af picklædsler. Starter pluk. Uden WMS: går lageret igennem ordre for ordre.

**Kl. 10:00:** Første leverance fra fragtfirma afhentes (cut-off kl. 14 for de fleste).

**Kl. 10:30:** Yderligere ordrer når ind (europeans webshops + morgen-kunder). Anden plukrunde.

**Kl. 13:30:** Sidste plukrunde. Alt der når ind inden kl. 13 må med i dag.

**Kl. 14:00:** Fragtfirma henter. Alt klar.

**Kl. 14:30:** Modtager leverance fra leverandør. Registrerer og lægger på lager (30-45 min).

---

## Hvad der går galt på dette niveau

**Fejl 1: Den forkerte pakke**
50 ordrer/dag uden scanning = 1-2 fejl/dag. Kunde beståller str. M, får str. L. Retur koster 80 kr. fragt + 15 min = 142 kr. per fejl. 300 fejl/år = **42.600 kr.**

**Fejl 2: Udsolgt uden at vide det**
Shopify siger 12 på lager. Der er 8. Fire kunder beståller. Du kan ikke levere. Løsning: ugentlig cycle count af top-20 SKU'er (15 min/uge).

**Fejl 3: Returvarer der forsvinder**
En retur ankommer, lægges i bunken, aldrig registreret. Kunden ringer 3 dage efter. Løsning: fast returzone + daglig tømning.

---

## Hvad du bor investere i på dette niveau

**Investering 1: Faste pladser + lokationskoder (0 kr.)**
Tager en dag. Sparer dig for 30-45 min søgetid dagligt.

**Investering 2: Håndscanner (3.000-5.000 kr.)**
Reducerer fejlrate fra 1,5% til under 0,3%. Payback: under 10 dage.

**Investering 3: Skrevet SOP (0 kr.)**
Et A4-ark per kerneopgave:
- **Morgen:** Tjek ordrer → print labels → pluk A-varer først
- **Pluk:** Scan SKU → tjek antal → scan lokation → læg i kasse
- **Retur:** Scan ind → inspicier → godkendt? → genlæg + opdater lager

En vikar skal kunne læse det og være produktiv på 2 timer.

**Hvad du IKKE skal investere i endnu:**
Avanceret WMS med fuld automatisering. Det er overkill ved 50 ordrer/dag. Vent til du nærmer dig 100.

---

## FAQ

**Hvornår skal jeg skifte til et dedikeret WMS?**
Når du konsekvent er over 80-100 daglige ordrer, og når du mærker at fejlraten stiger eller ekspeditionstiden stiger med volumen. Det er de to signaler.

**Kan jeg håndtere 50 ordrer/dag alene?**
Ja, komfortabelt. En erfaren medarbejder håndterer 30-50 ordrer/time ved simple varer. 50 ordrer/dag er 1,5-2 timers aktivt pluk.

## Læs også
- [Guide til lager for webshops](/viden/fundamentals/lager-guide-webshop)
- [Fra kaos til kontrol](/viden/fundamentals/fra-kaos-til-kontrol-lager)
- [Hvornår vokser du fra dit setup?](/viden/vaekst/hvornaar-vokser-du-fra-dit-lager)
