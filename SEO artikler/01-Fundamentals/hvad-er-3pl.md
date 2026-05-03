---
primary_keyword: 3pl
secondary_keywords: 3pl lager, tredjepartslogistik, outsource lager, 3pl vs eget lager
cluster: 01-Fundamentals
---

# Hvad er 3PL — og hvornår mister du kontrollen?

Du overvejer 3PL fordi det lyder lettere. Ingen lagerhusleje. Ingen medarbejdere at lede. Bare send varerne afsted og lad nogen andre pakke. Men uge 48, 2024, opdagede en dansk webshop at deres 3PL-partner havde scannet 847 pakker ud — men kun afsendt 291. Black Friday-ordrerne sad på en palle i Vojens. Kunden ringede. 3PL'en svarede ikke. Det kostede 340.000 kr. i refusioner og tabt goodwill.

3PL er ikke "nogen, der opbevarer dine varer". Det er en strategisk beslutning om, hvad din kerneforretning er. Outsourcer du for tidligt, mister du kontrol og margin. Gør du det for sent, kvæler logistik din vækst. Her er, hvornår det giver mening — og hvornår det ikke gør.

---

## Hvad er 3PL?

**3PL** (Third Party Logistics / tredjepartslogistik) betyder, at du outsourcer hele eller dele af din lager- og distributionsoperation til en ekstern leverandør. 3PL-leverandøren håndterer modtagelse, oplagring, pluk, pak og afsendelse på dine vegne.

Du ejer stadig varerne og styrer hvad der bestilles — men den fysiske håndtering sker i deres lager, med deres medarbejdere, på din regning.

### Forskellen på 1PL, 2PL og 3PL
- **1PL**: Du håndterer alt selv
- **2PL**: Du bruger en ekstern fragtleverandør (GLS, PostNord)
- **3PL**: Ekstern leverandør håndterer lagring + distribution
- **4PL**: Ekstern leverandør koordinerer hele supply chain inkl. andre leverandører

---

## Det opdager de fleste for sent

### 1. Du kan ikke skifte 3PL uden 4-6 måneders kaos
Din data sidder i deres system. Dine varer sidder i deres lager. Dine processer er bygget til deres API. At flytte kræver datamigration, fysisk flytning og re-integration. De fleste opdager først hvor låst de er, når de vil væk.

### 2. 3PL'ens fejl er dine fejl — over for kunden
Kunden ser dit brand på pakken (hvis du er heldig). Når 3PL'en sender forkert, forsinker eller glemmer en ordre, klager kunden til dig. Du har ingen direkte kontrol. Du kan eskalere, bede, true — men du kan ikke gå ned på lageret og fikse det.

### 3. "Realtidsintegration" betyder ofte "opdateres hver nat kl. 02"
Du får solgt en vare kl. 14. Kunden betaler. Kl. 15 får du besked fra 3PL: "udsolgt". Deres lagersync kører kun om natten. Du refunderer. Kunden er sur. Det sker ikke én gang — det sker strukturelt.

### 4. Skjulte gebyrer dukker op efter 6 måneder
"Håndteringsgebyr: 12 kr./ordre" lyder fint. Men der er også: modtagelsesgebyr, returgebyr, specialemballagegebyr, ekstra scanningsgebyr, pakkegebyr over 2 kg, gebyr for ordrer med +3 linjer. Den reelle pris er 40-60% højere end tilbuddet.

---

## Hvornår er det et problem?

**Eget lager er et problem, når:**
- Lagerplads er den primære begrænsning for vækst
- Sæsonudsving kræver dobbelt kapacitet i 2-3 måneder
- Logistik tager ledelsestid der burde gå til produkt og marketing
- Fixed costs på lager (husleje, medarbejdere) spiser margin

**3PL er et problem, når:**
- Du mister kontrol over kvalitet og fejlrate
- 3PL ikke kan integrere med dit system og du mister sporbarhed
- Kunderne oplever forsinkelser, du ikke kan forklare
- Prismodellen er uigennemsigtig og skjulte gebyrer spiser fortjenesten
- Du skalerer til +500 ordrer/dag og 3PL-prisen per ordre nu er dyrere end eget lager ville være

---

## Hvorfor det er vigtigt — i kroner og konsekvenser

### Eget lager — fixed cost eksempel (300 ordrer/dag):
| Post | Kr./md |
|------|--------|
| Leje 200 m² | 25.000 |
| 2 lagermedarbejdere | 50.000 |
| Systemer, forsikring, udstyr | 10.000 |
| **Total** | **85.000** |
| **Per ordre** | **~9,50 kr.** |

### 3PL — variable cost eksempel (300 ordrer/dag):
| Post | Kr./md |
|------|--------|
| Håndteringsgebyr: 18 kr. × 6.000 ordrer | 108.000 |
| Opbevaringsgebyr: 8 paller × 250 kr. | 2.000 |
| Modtagelsesgebyr: 4 leveringer × 150 kr. | 600 |
| **Total** | **110.600** |
| **Per ordre** | **~18,50 kr.** |

**Break-even ligger typisk ved 400-600 ordrer/dag**,afhængigt af ordrestørrelse og sortimentskompleksitet. Under det er 3PL billigere (hvis du tæller ALLE skjulte gebyrer med). Over det er eget lager billigere per ordre.

**Men:**
Ved 200 ordrer/dag med 3% 3PL-fejlrate = 6 fejl/dag × 350 kr. = **2.100 kr./dag** = **47.250 kr./md** i direkte tab du ikke kan forhindre.

**Regnestykke — total cost per måned (200 ordrer/dag, 3% fejlrate):**
- 3PL: 110.600 kr. + 47.250 kr. fejlomkostning = **157.850 kr./md**
- Eget lager: 85.000 kr. + 10.500 kr. fejlomkostning (1% fejl) = **95.500 kr./md**

**Forskel: 62.350 kr./md = 748.200 kr./år**

---

## Hvordan fungerer 3PL i praksis?

### Onboarding-fase (4-8 uger)
1. Aftale om priser, SLA og ansvarsfordeling
2. Systemintegration: 3PL WMS ↔ din webshop
3. Overflytning af lagerbeholdning
4. Oplæring i produktkrav (skrøbelige varer, temperatur, etc.)

### Løbende drift
1. Du lægger ordrer i din webshop
2. Ordrer synkroniseres automatisk til 3PL
3. 3PL plukker, pakker og afsender
4. Tracking-data sendes til kunde og til dig
5. Du modtager månedlig faktura baseret på volumen

### Krav til 3PL-integration (IKKE VALGFRIT)
- Realtids lagersynkronisering (du skal kunne se beholdning)
- Automatisk ordreoverførsel (ingen manuel batch-upload)
- Tracking-retur til din webshop
- Adgang til fejlrapport og KPI-data

---

## Typiske fejl

**1. Manglende SLA på fejlrate**
Aftalen siger ikke, hvilken plukkefejlrate der er acceptabel. 3PL-leverandøren har dermed intet incitament til at forbedre sig. Kræv under 0,5% fejl og definer konsekvenser.

**2. Ingen systemintegration**
Du sender en fil med ordrer én gang om dagen. Det er ikke 3PL — det er outsourced Excel. Kræv API-integration.

**3. For tidlig outsourcing**
Du outsourcer, fordi det føles lettere — men du har ikke styr på processerne selv. 3PL kopierer dine kaotiske processer og gør dem lidt dyrere.

**4. Vendor lock-in**
Du vælger 3PL uden en exitplan. 2 år inde er det en magtfuld leverandør, du ikke kan skifte fra uden 6 måneders opsigelse og datamigration.

**5. Ingen visibilitet i realtid**
Du kan ikke se, hvad der er på lager, hvad der er under pluk, eller hvad der er afsendt — før 3PL rapporterer. Det er uacceptabelt i e-commerce.

---

## Sådan gør du det rigtigt

**1. Definer KPI'er i kontrakten**
Fejlrate (< 0,5%), order-to-ship tid (< 4 timer på hverdage), lagerrøjagtighed (> 98%). Med SLA og kompensationsmodel.

**2. Kræv realtids systemadgang**
Du skal til enhver tid kunne se din beholdning, ordrestatus og fejllog. Ikke via email, men via API eller portal.

**3. Start med hybrid-model**
Behold kontrol over et lille lokalt lager til rush-ordrer, prøver og specials. Outsource standardvolumen til 3PL.

**4. Evaluer kvartalsvis**
Sammenlign KPI, pris og kvalitet med benchmark. 3PL-markedet er konkurrencepræget — du har forhandlingsstyrke.

**5. Byg en exitplan fra dag 1**
Hvad skal til for at flytte? Datamigration, lagerflytning, ny integration. Kend svaret — det giver forhandlingsstyrke og ro.

---

## Hvornår du skal handle

- Du overvejer at leje mere lagerplads, men ordrevolumet er ikke stabilt nok
- Logistik fylder mere end 20% af ledelsestiden
- Din peak-sæson kræver mere end 50% ekstra kapacitet
- Lageromkostninger udgør over 15% af omsætningen
- Du vil ekspandere til nye markeder uden at bygge lokale lagre

---

## SmartPack: JA eller NEJ?

**NEJ til 3PL — JA til SmartPack, hvis:**
- Du har 100-800 ordrer/dag
- Du vil beholde kontrol over kvalitet og processer
- Du kan drive eget lager (plads + bemanding)

**JA til 3PL — SmartPack kan stadig hjælpe, hvis:**
- Du har under 100 ordrer/dag og ingen lagerplads
- Du ekspanderer internationalt og har brug for lokal 3PL
- SmartPack kan integrere med 3PL'ens API og give dig ét dashboard

SmartPack understøtter multi-lager opsætning — du kan drive eget lager via SmartPack og have fuld synlighed, selvom dele af fulfillment håndteres eksternt. Systemet understøtter API-integration til 3PL-platforme og giver dig realtids lagerindsigt uanset, om varen sidder i dit lager eller hos en 3PL-partner.

---

## FAQ

**Hvad er 3PL på dansk?**
3PL er forkortelse for Third Party Logistics — på dansk tredjepartslogistik. Det betyder, at en ekstern leverandør håndterer lagring og distribution på dine vegne.

**Hvornår er 3PL billigere end eget lager?**
Typisk under 400-600 daglige ordrer, afhængigt af ordrestørrelse. Over det er fixed costs ved eget lager lavere per ordre. Men husk: 3PL-fejl koster dig det samme som egne fejl — forskellen er, du ikke kan fikse dem selv.

**Mister jeg kontrollen, hvis jeg bruger 3PL?**
Ja — medmindre du har realtids-API, klare KPI'er i kontrakten og en exitplan. Uden det er du afhængig af deres processer, deres hastighed og deres prioritering.

**Kan 3PL håndtere B2B og B2C ordrer?**
Ja, men krav er meget forskellige. B2B kræver typisk palleforsendelse, specifikke labels og EDI-integration. Tjek, at 3PL har erfaring med begge.

**Hvad er en god 3PL-fejlrate?**
Under 0,5% plukkefejl er branchestandard for velfungerende 3PL. Over 1% er uacceptabelt og bør udløse eskalering eller leverandørskift.
