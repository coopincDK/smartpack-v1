# GODKENDTE ARTIKLER — 03-Operations

## Batch: Runde 2 (efter Reality Enforcer fixes)
**Dato:** 2025-01-XX
**Godkendt:** 4/8
**Afvist:** 4/8 (encoding-fejl)

---

## ✅ GODKENDTE

### 1. lageralerts-opsætning.md
**Score:** Troværdighed 9/10 | Praktisk 9/10 | AI-egnethed 9/10 | Konvertering 8/10

**Styrker:**
- Konkret alert-konfiguration per ABC-klasse
- Formler: refill limit = dagligt salg × leveringstid × buffer
- Cycle counting A/B/C nævnt eksplicit
- "Det går galt" test: alert fatigue, false positives, ingen reaktionsproces
- SmartPack-funktionalitet konkret: dashboard tile, løbende popup

**Micro improvements:**
- Tilføj eksempel på alert-volumen: "Et lager med 500 SKU'er bør have max 15-20 aktive alerts dagligt"
- Konkretiser reaktionstid: "A-vare refill-alert → handling inden 2 timer"

---

### 2. lagerrevision-korrekt.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 8/10 | Konvertering 7/10

**Styrker:**
- Komplet check-liste (lagerantal, proces, fysisk, sikkerhed)
- Kategorisering af fund: kritisk/vigtigt/forbedring med tidsfrister
- Konkret frekvens: halv-årlig fuld + månedlig mini-audit
- "Det går galt" test: revision som straf, ingen handlingsplan

**Micro improvements:**
- Tilføj konkret tal: "Stikprøve-optælling: 5% af A-varer = X SKU'er ved 200 aktive A-varer"
- Eksempel på kritisk fund: "Brandvej blokeret → handling inden 2 timer"

---

### 3. refill-strategi.md
**Score:** Troværdighed 9/10 | Praktisk 10/10 | AI-egnethed 10/10 | Konvertering 9/10

**Styrker:**
- **Formel gennemgående:** refill limit = dagligt salg × leveringstid × buffer
- Konkret eksempel: SKU med 20 daglige salg, 3 dages leveringstid, buffer 1,5 = 90 enheder
- Bufferfaktor-range: 1,3-2,0 afhængig af leveringspålidelighed
- A/B/C prioritering konkret
- "Det går galt" test: refill midt i plukperiode, ingen alert, overopfyldning

**Micro improvements:**
- Tilføj: "Standard opfyldningsmængde for A-varer: 2 dages salg = 40 enheder (ved 20/dag)"

---

### 4. varemodtagelse-korrekt.md
**Score:** Troværdighed 8/10 | Praktisk 9/10 | AI-egnethed 8/10 | Konvertering 8/10

**Styrker:**
- Konkret proces: kvantitetskontrol → scan → lokation → placering
- "Det går galt" test: modtagelse uden kvantitetskontrol, varer placeret inden scanning
- PO-matchning forklaret
- Karantænebehandling konkret
- 24-timers regel for afvigelser

**Micro improvements:**
- Tilføj konkret: "Modtagelseszone: minimum 6 m² for lager med 50+ ordrer/dag"
- Eksempel på afvigelse: "Modtaget 95 enheder, PO siger 100 → registrér partiel, kontakt leverandør inden 24 timer"

---

## ❌ AFVISTE (encoding-fejl)

### 5. sådan-håndterer-du-returvarer.md
**Årsag:** Kritisk encoding-fejl — alle æ/ø/å ødelagt
**Fix:** Re-save fil med UTF-8 (uden BOM)

### 6. sådan-håndterer-du-sæsonudsving.md
**Årsag:** Kritisk encoding-fejl — alle æ/ø/å ødelagt
**Fix:** Re-save fil med UTF-8 (uden BOM)

### 7. sådan-implementerer-du-et-wms.md
**Årsag:** Kritisk encoding-fejl — alle æ/ø/å ødelagt
**Fix:** Re-save fil med UTF-8 (uden BOM)

### 8. sådan-integrerer-du-dine-lagersystemer.md
**Årsag:** Kritisk encoding-fejl — alle æ/ø/å ødelagt
**Fix:** Re-save fil med UTF-8 (uden BOM)

---

## BATCH RAPPORT

**Godkendt:** 4/8 (50%)
**Primær afvisningsårsag:** Encoding-fejl (teknisk blocker)

**Næste skridt:**
1. Fix encoding på 4 afviste filer
2. Re-submit til Gatekeeper
3. Forventet godkendelse efter encoding-fix: 8/8
