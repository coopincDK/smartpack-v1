# AFVISTE ARTIKLER — 08-Compliance (Runde 2)

## AFVIST: 3/10

---

### ce-mærkning-forklaret.md

**HVORFOR:**  
Test 4 fejler: "DET GÅR GALT" TEST  
Artiklen mangler konkrete edge cases, fejl der bryder, eller "hvad der går galt"-scenarier.

**KONKRETE FIXES:**

#### 1. Tilføj edge case-sektion efter "Det opdager de fleste for sent" (linje 67)

```markdown
## Hvad der går galt i praksis

**Edge case 1: CE-mærket er korrekt, men direktivet er forkert**  
Du importerer en Bluetooth-højttaler. Leverandøren har CE-mærke under EMC-direktivet. Men produktet er også radio-udstyr og skal have CE under RED-direktivet. Sikkerhedsstyrelsen opdager det. Produktstop + bøde: 25.000 kr.

**Edge case 2: Du ændrer produktet efter CE-certificering**  
Du skifter batteri-leverandør i uge 15. Produktet er teknisk "ændret" og kræver fornyet CE-vurdering. Du opdager det ikke. 6 måneder senere: produktstop + krav om ny certificering. Du taber: 50.000 kr. i lagerværdi.

**Edge case 3: DoC er på kinesisk**  
Du har DoC fra leverandør, men den er på kinesisk. Sikkerhedsstyrelsen kræver den på EU-sprog. Du har 14 dage til at fremskaffe den. Du kan ikke. Produktstop.
```

#### 2. Tilføj konkret fejl-scenarie i "Typiske fejl" (linje 83)

Erstat linje 89 med:

```markdown
- Ændre produktet efter CE-certificering (fx skifte batteri-leverandør) uden fornyet vurdering — kræver ny CE-proces
- Produktet kræver CE under flere direktiver (fx EMC + RED), men kun ét er dækket
```

---

### gdpr-på-lager.md

**HVORFOR:**  
Test 4 fejler: "DET GÅR GALT" TEST  
Artiklen mangler konkrete edge cases, fejl der bryder, eller "hvad der går galt"-scenarier.

**KONKRETE FIXES:**

#### 1. Tilføj edge case-sektion efter "Det opdager de fleste for sent" (linje 89)

```markdown
## Hvad der går galt i praksis

**Edge case 1: Du sletter ordredata efter 5 år, men kunden klager i år 6**  
Kunden klager over en ordre fra 2019. Du har slettet data efter 5 år (regnskabsloven). Men kunden kræver dokumentation. Du har ingen. Kunde sagsøger dig. Du taber: 15.000 kr. i sagsomkostninger.

**Edge case 2: Databehandleraftale er underskrevet, men leverandør bruger underleverandør**  
Dit WMS bruger AWS som hosting. AWS bruger underleverandør i USA. Din databehandleraftale dækker ikke underleverandøren. Datatilsynet opdager det. Bøde: 50.000 kr.

**Edge case 3: Medarbejder downloader ordredata til privat USB**  
Lagermedarbejder downloader 500 ordrer til USB for at "arbejde hjemmefra". USB mistes. Databrud. Du opdager det ikke inden 72 timer. Bøde: 100.000 kr.
```

#### 2. Tilføj konkret fejl-scenarie i "Typiske GDPR-fejl" (linje 103)

Tilføj efter linje 109:

```markdown
- Databehandleraftale dækker ikke underleverandører (fx cloud-hosting)
- Medarbejdere downloader ordredata til private enheder uden kryptering
```

---

### weee-regler.md

**HVORFOR:**  
Test 4 fejler: "DET GÅR GALT" TEST  
Artiklen mangler konkrete edge cases, fejl der bryder, eller "hvad der går galt"-scenarier.

**KONKRETE FIXES:**

#### 1. Tilføj edge case-sektion efter "Det opdager de fleste for sent" (linje 72)

```markdown
## Hvad der går galt i praksis

**Edge case 1: Produkt er "elektronik-tilbehør" — men falder stadig under WEEE**  
Du sælger USB-kabler. Du tror det er "bare et kabel". Men det er elektrisk tilbehør under WEEE. DPA-System opdager det. SALGSSTOP + bøde: 25.000 kr.

**Edge case 2: Du sælger til Tyskland via Amazon — men Amazon håndterer IKKE WEEE for dig**  
Du tror Amazon håndterer WEEE. Det gør de ikke (kun moms via IOSS). Du har solgt 1.000 produkter ulovligt. SALGSSTOP i Tyskland + bøde: 75.000 kr.

**Edge case 3: WEEE-symbol er for lille**  
Du har WEEE-symbol på produktet, men det er 3 mm højt (krav: min. 7 mm). Told tilbageholder forsendelse. Du taber: 15.000 kr. i fragt + told.
```

#### 2. Tilføj konkret fejl-scenarie i "Typiske fejl" (linje 80)

Tilføj efter linje 85:

```markdown
- Tror at Amazon/eBay håndterer WEEE for dig (de gør ikke)
- WEEE-symbol er for lille (krav: min. 7 mm højde)
```

---

**SEND TIL:** Reality Enforcer  
**NÆSTE SKRIDT:** Implementer fixes, kør Gatekeeper Runde 3
