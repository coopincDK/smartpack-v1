# AFVIST – 04-Growth Runde 2

## hvornår-flere-lokationer.md

**HVORFOR:**
Test 6 fejler: "det afhænger af din situation" findes i FAQ linje 119.

**KONKRET FIX:**

Erstat FAQ-svar (linje 118-119):
```markdown
**Hvornår er to lagre bedre end ét?**
Når fragtomkostningen du sparer overstiger de ekstra operationelle omkostninger. Beregn break-even på konkrete fragtbesparelser vs. ekstra husleje og personale.
```

Med:
```markdown
**Hvornår er to lagre bedre end ét?**
Når du sparer 10+ kr./ordre i fragt og har 300+ ordrer/dag. Ved 300 ordrer/dag × 10 kr. = 3.000 kr./dag = 750.000 kr./år. Hvis ekstra lager koster under 500.000 kr./år (husleje + 0,5 FTE + WMS) → to lagre vinder.
```
