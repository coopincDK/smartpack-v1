---
primary_keyword: onboarding 3pl
secondary_keywords: [skifte til 3pl, starte hos 3pl, 3pl opsætning, outsource lager opsætning]
cluster: 12-RealWorld
article_type: guide
---

# Onboarding hos en 3PL: Den 30-dages køreplan uden at miste salgsdage

Skiftet fra eget lager til 3PL er ikke bare en flytning. Det er et fuldt IT-projekt, en fysisk flytning og en driftsovergang — alt på samme tid. De fleste webshops undervurderer det og ender med 3-7 dages nedetid, forsinkede ordrer og frustrerede kunder. Her er køreplanen der undgår det.

## Kort svar

En velplanlagt 3PL-onboarding tager 30-45 dage. De første 14 dage er forberedelse og IT. Dag 15-22 er parallelkørsel. Dag 23-30 er overgang og evaluering. Gør du det i den rækkefølge, beholder du dine salgsdage.

---

## Uge 1-2: Forberedelse og IT

**Dag 1-3: Dataforberedelse**
- Exportér komplet SKU-liste med EAN-koder, vægt, dimensioner og billeder
- Ryd op i inaktive SKU'er (send dem ikke med til 3PL)
- Enig med 3PL om datafiled format (typisk CSV eller Excel template)

**Dag 4-7: Integration**
- Opsæt Shopify/WooCommerce-integration til 3PL's WMS
- Test: send en testordre, bekræft at fulfillment-event kommer tilbage
- Test: send en test-modtagelse, bekræft at lager opdateres korrekt
- Test: send en test-retur, bekræft at kreditering sker

**Dag 8-14: Physical lager-setup**
- Lokationskoder aftalt og oprettet i WMS
- ABC-analyse kørt: A-varer placeret tæt på pakkebordet
- Emballage-specifikationer godkendt (hvilke kasser, bæreredder, tape)

---

## Uge 3: Fysisk flytning

**Dag 15-17: Parallelkørsel (begge lager aktive)**
Kortægør dit lager i to lag: hvad går først (A-varer + hurtige salgsvarer), hvad går sidst (slow movers, kasse-overstock).

Send A-varer til 3PL først. Start afsendelse af nye ordrer fra 3PL for disse varer. Beholder eget lager som backup for resten.

**Dag 18-21: Fuld overgang**
- Resterende varer overført til 3PL
- Eget lager tømt og afleveret
- Alle ordrer processeres nu fra 3PL

---

## Uge 4: Evaluering og stabilisering

**Dag 22-30: Første évaluering**

Mål disse tre KPI'er i de første 7 driftsdag:
- Order-to-ship tid: lever 3PL inden cut-off?
- Plukfejlrate: hvad siger kundeservice om fejlordrer?
- Lageraccuracy: stemmer systemets tal med hvad 3PL rapporterer?

Hvis en KPI er problematisk i uge 4, er det bedre at fikse det nu end når volumen stiger.

---

## De fejl der koster salgsdage

| Fejl | Konsekvens | Undgåelse |
|---|---|---|
| Integration ikke testet før go-live | Ordrer når ikke 3PL | Altid teste end-to-end før go-live |
| A-varer modtaget uden EAN | Kan ikke plukkes | Korrekte EAN-koder på ALT |
| For hurtig overgang (alt på én dag) | Kaos + nedetid | Parallelkørsel i min. 3 dage |
| Ingen aftalt cut-off tid | Kunden forventer same-day, 3PL kører næste dag | Aftal cut-off i kontrakten |

---

## FAQ

**Kan jeg skifte 3PL mens jeg har mange ordrer?**
Ideel timing: efter Q4 (januar-februar). Næstbedste: sommer (juli). Undgå Q3/Q4. Planlæg 6 uger frem.

**Hvad sker der med ordrer der er modtaget men ikke pakket på overførselsdagen?**
Har en klar protokol: afslut alle åbne ordrer fra eget lager før overførsel, eller flyt dem manuelt til 3PL med eksplicit koordinering.

## Læs også
- [SLA med 3PL](/viden/realworld/sla-med-3pl)
- [Skjulte gebyrer hos 3PL](/viden/realworld/skjulte-gebyrer-3pl)
- [Hvornår skal du fyre din 3PL?](/viden/realworld/hvornaar-fyre-3pl)
