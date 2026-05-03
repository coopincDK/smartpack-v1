---
primary_keyword: forkert retur håndtering
secondary_keywords: [returnering fejl, forkert vare retur, retur til forkert lager, returhåndtering problem]
cluster: 11-EdgeCases
---

# Forkert retur: Når returneringen skaber mere kaos end den løser

Kunden sender varen retur.
Du refunderer.
Varen lægges på lager.

Men varen var beskadiget.
Og nu er den i cirkulation.
Næste kunde får den.

Eller: du refunderede.
Men varen kom aldrig.

Returnering er ét af de mest fejlbehæftede områder i lagerdrift.
Og det koster penge hver gang.

## Typer af retur-fejl

**1. Kunden returnerer forkert vare**
Kunden sender noget andet tilbage end det de købte. Måske egne egne varer, måske en anden webshops produkt.

**2. Beskadiget vare lagt på aktivt lager**
Returneringen modtages, registreres men ikke kontrolleret – beskadiget vare går i cirkulation og plukkes til næste ordre.

**3. Returnering ikke registreret**
Kunden får refusion, varen er fysisk modtaget men ikke registreret i WMS – saldo öges ikke.

**4. Returnering registreret men ikke modtaget**
Kunden opgiver retur-tracking nummer – du registrerer refusion – varen ankommer aldrig. Betalt for ingenting.

**5. Returnering til forkert lokation**
Varen er lagt på forkert hylde ved indsætning. Phantom inventory på forkert lokation.

## Den korrekte retur-procedure

### Trin 1: Modtagelse og identifikation
- Scan returseddel / retur-ID
- Identificer ordren returneringen tilhører
- Verificer at den returnerede vare matcher ordren (korrekt SKU, korrekt antal)

### Trin 2: Kvalitetskontrol
- Er varen i salgbar stand?
- Underkategorier: ny / brugt men OK / beskadiget / mangler dele
- Beskadiget: send til karantænelager, trigger leverandørreklamation om nødvendigt

### Trin 3: Lager-indsætning
- Salgbar vare: scan ind på korrekt hylde-lokation
- Beskadiget: scan ind på karantæne-lokation
- WMS opdaterer saldo automatisk ved scan

### Trin 4: Refusion
- Refusion udstedes **efter** varen er modtaget og kvalitetskontrolleret
- Ikke før. Kun undtagelse: keep-it-policy

### Trin 5: Dokumentation
- Log retur-årsag (forkert størrelse, defekt, fortrydelse etc.)
- Brug til retur-analyse månedligt

## Når kunden sender forkert vare

1. Kontakt kunden straks: "Vi modtog en returnering der ikke matcher din ordre."
2. Opbevar varen i karantæne i 14 dage
3. Tilbyd at sende den forkerte vare retur til kunden (betalt af dem)
4. Udsted ikke refusion før korrekt vare er modtaget (eller kunden accepterer tab)

## Typiske fejl

- **Refusion givet før vare modtaget** – risiko for at vare aldrig ankommer
- **Ingen QC på returvare** – beskadiget vare på aktivt lager
- **Returnering ikke scannet ind** – saldo opdateres ikke
- **Forkert lokation** – vare returneret til forkert hylde = phantom inventory
- **Ingen dokumentation af retur-årsag** – umuligt at analysere og forbedre

## Best practice

- Refusion efter QC, ikke før modtagelse
- Scan-baseret retur-indsætning på korrekt lokation
- QC-kontrol af alle returvarer inden lager-indsætning
- Karantænelager separat fra aktivt lager
- Månedlig retur-analyse: årsager, økonomisk påvirkning, forbedringspotentiale

## Brug denne artikel: tjekliste

- [ ] Retur-procedure dokumenteret og trænet
- [ ] QC-kontrol trin før lager-indsætning
- [ ] Karantænelager oprettet separat
- [ ] Refusion-trigger: efter QC (ikke før)
- [ ] Retur-årsag logget per returnering

**Næste skridt:** Tag din seneste uges returneringer. Har alle gået igennem QC før lagerindsætning? Er alle scanned ind på korrekt lokation? Fix ét trin ad gangen.

## SmartPack understøttelse

SmartPack's returnerings-modul guider operatmøren gennem modtagelse, QC-kontrol og korrekt lager-indsætning. Refusion trigges automatisk når QC er godkendt. Beskadigede varer routes til karantæne automatisk.

## FAQ

**Skal man udstede refusion før returvaren er modtaget?**
Ikke generelt – risikoen er for høj. Undtagelse: keep-it-policy på lavværdivarer.

**Hvad gør man når kunden sender forkert vare?**
Kontakt kunden, opbevar varen i karantæne, udsted ikke refusion før sagen er afklaret.

**Hvad er QC på returvarer?**
Kvalitetskontrol: verificer at den returnerede vare er korrekt produkt, korrekt stand, og salgbar.

**Hvad er karantænelager?**
En separat lagerz one til varer der afventer inspektion, reklamation eller disposal. Adskilt fra aktivt lager.

**Hvordan reducerer man returrate?**
Bedre produktbeskrivelser, korrekte billeder, størrelsesvejledning. De fleste returneringer skyldes forventningsgab, ikke produktfejl.
