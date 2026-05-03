# SmartPack QA Pipeline

## Korrekt rækkefølge (peak kvalitet)
1. WRITE      — artikel skrives
2. FAKTATJEK  — tal, koder og SmartPack-fakta verificeres
3. FEEDBACK   — SEO, AI, struktur scores (1-10)
4. CHALLENGER — 80% → 100% (skærp det gode)
5. ENFORCER   — anti-generisk final pass (brutal reality check)

## Mappe-status
| Mappe | Write | Faktatjek | Feedback | Challenger | Enforcer |
|-------|-------|-----------|----------|------------|---------|
| 01-Fundamentals | 10/20 | KØRER | - | - | KØRER (forkert rækkefølge) |
| 02-Problemer | 9/25 | Delvis | - | KØRER | - |
| 03-Operations | 6/30 | - | - | KØRER | - |
| 04-Growth | 17/20 | ✅ | ✅ | ✅ | - |
| 05-Economics | 5/15 | - | - | - | KØRER (forkert rækkefølge) |
| 06-Tech | 0/15 | - | - | - | - |
| 07-Decision | ✅ | ✅ | ✅ | ✅ | - |
| 08-Compliance | ✅ | ✅ | ✅ | ✅ | - |
| 09-Transport | 8/10 | - | - | - | - |
| 10-International | 0/10 | - | - | - | - |
| 11-EdgeCases | 0/15 | - | - | - | - |
| 12-RealWorld | 0/10 | - | - | - | - |

## REGEL: Enforcer køres SIDST — efter Challenger
## REGEL: Challenger køres kun på artikler der har bestået Faktatjek
## REGEL: QA-agenter må ikke skippe trin
