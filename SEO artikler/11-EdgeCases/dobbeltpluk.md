---
primary_keyword: dobbeltpluk lager
secondary_keywords: [double pick fejl, to ordrer samme vare, pluk dobbelt WMS, duplicate pick order]
cluster: 11-EdgeCases
---

# Dobbeltpluk: Når den samme vare plukkes til to ordrer

Samme vare.
To ordrer.
To plukkere.

Begge scanner.
Begge plukker.
Men der var kun én.

Orde A får varen.
Ordre B står og venter ved en tom hylde.
Saldo går negativ.

Dobbeltpluk er ikke en medarbejderfejl.
Det er en systemfejl.

## Hvad er dobbeltpluk?

Dobbeltpluk sker typisk på tre måder:

1. **Samme plukjob frigivet to gange**: systemfejl der skaber to identiske plukjobs
2. **To plukkere på samme placering**: to plukkere uafhængigt plukker fra samme hylde til samme SKU
3. **Batch-allocation fejl**: batchen allokerer SKU'en dobbelt pga. saldo-mismatch

## Konsekvenser

- Ordre A får varen, ordre B mangler den
- Saldo går negativ (fratrmækkes to gange)
- Plukker B når til hylden og finder ingenting
- To ordrer påvirket – måske mere når det er en batch

## Når det sker: håndtering

### Trin 1: Stop plukkerne
ID en de to plukjobs. Smløk dem begge straks.

### Trin 2: Verificer saldo og fysisk lager
Cycle count på den påvirkede SKU og lokation. Hvad er den faktiske saldo?

### Trin 3: Prioriter ordre
Velg hvilken ordre får varen (FIFO). Den anden får backorder/delordre.

### Trin 4: Korriger WMS
Fjern det ene plukjob. Opdater saldo. Afmærk korrekt ordre som plukket.

### Trin 5: Root-cause
Hvorf or opstå dobbeltplukket? Systemfejl? Konfigurationsfejl? Plukkerfejl?

## Forebyggelse

### Job-locking
Når et plukjob frigives til en plukkere, må det låses i WMS (ingen andre kan tage det). Forhindrer to plukkere på samme job.

### Idempotent job-generering
WMS må ikke kunne generere to identiske plukjobs for samme ordre. Idempotency: samme input = samme output (ikke to outputs).

### Saldo-reservation ved job-frigivelse
Når plukjob frigives, reserveres saldoen med det samme. Plukjob 2 på samme SKU ser reserveret saldo – og frigives ikke.

### Scan-verify
Scan placeringen VED ankomst. WMS bekræfter at jobbet er aktivt og at plukkeren er den korrekte. En anden plukkere kan ikke scanne den allerede aktive lokation.

## Typiske fejl

- **Ingen job-locking** – to plukkere kan arbejde på samme job
- **Dupliceret job-generering** – systemet skaber to identiske jobs (typisk ved netværksfejl/retry)
- **Saldo ikke reserveret ved frigivelse** – to jobs allokeres til samme saldo
- **Ingen scan ved ankomst til placering** – plukkere ser ikke at en anden er allerede der
- **Root-cause ikke analyseret** – dobbeltpluk gentager sig

## Best practice

- Job-locking ved frigivelse til plukkere
- Idempotent job-generering (ingen duplikater)
- Saldo-reservation ved frigivelse (atomic)
- Scan-ved-ankomst som standard
- Dobbeltpluk logget og analyseret månedligt

## Brug denne artikel: tjekliste

- [ ] Job-locking konfigureret i WMS
- [ ] Idempotent job-generering verificeret
- [ ] Atomic saldo-reservation ved plukjob-frigivelse
- [ ] Scan-ved-ankomst implementeret
- [ ] Dobbeltpluk-log og månedlig analyse

**Næste skridt:** Tjek din WMS-konfiguration: kan to plukkere tage det samme plukjob? Test ved at simulere to parallelle plukjobs på samme SKU.

## SmartPack understøttelse

SmartPack implementerer job-locking, idempotent job-generering og atomic reservation som kernefeatures. Dobbeltpluk er teknisk forhindret. Scan-ved-ankomst er standard på alle håndholdte enheder.

## FAQ

**Hvad er job-locking?**
En WMS-funktion der låser et plukjob når det frigives til en plukkere. Andre plukkere kan ikke tage det samme job.

**Hvad er idempotency i WMS?**
En egenskab så det samme input ikke kan producere duplikerede outputs. Forhindrer at netværksfejl eller dobbeltklik skaber to identiske plukjobs.

**Kan dobbeltpluk ske i batch-picking?**
Ja – ved saldo-mismatch kan batchen allokere mængde ud over hvad der er tilgængeligt. Løses med saldo-verifikation ved batch-frigivelse.

**Hvad er atomic reservation?**
En reservation der gennemføres i en enkelt udelelig operation. Sikrer at to samtidige frigivelser ikke begge reserverer det samme.

**Hvad gør man med negativ saldo opstået ved dobbeltpluk?**
Umæddelbar cycle count, correction af saldo, root-cause-analyse. Negativ saldo er altid en fejl der må rettes straks.
