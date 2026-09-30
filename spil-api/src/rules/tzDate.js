'use strict';

// Konsolideret "hvad er dags dato"-hjælper — ÉT sted for hele tidszone-
// reglen efter Packrush-opfølgningen. ALLE "dag"-begreber (liv-reset,
// dagens flueben, dagens rangliste/rekord, beaten-notifikationer) regnes nu
// i Europe/Copenhagen, IKKE UTC — messen er dansk, og deltagere forventer at
// "i dag" skifter ved midnat dansk tid, ikke kl. 01/02 dansk tid (UTC-
// midnat, afhængig af sommer-/vintertid). Se API.md, "Dage og tidszoner".
//
// JS-siden (todayStr): Intl.DateTimeFormat med en EKSPLICIT `timeZone` er
// uafhængig af processens egen TZ-miljøvariabel/lokale indstilling — samme
// resultat på serveren, en udviklers lokale maskine og i CI, uanset hvad de
// hver især har sat som lokal tidszone.
//
// DB-siden (cphDateExpr): et rå SQL-cast af en `timestamptz`-kolonne til
// `date` (`kolonne::date`) bruger IMPLICIT forbindelsens session-tidszone
// (GUC `timezone`), som vi ikke kan stole på er sat rigtigt/konsistent på
// tværs af miljøer. Brug ALTID `cphDateExpr('kolonne')` i stedet for
// `kolonne::date` når en SQL-forespørgsel skal filtrere/gruppere på "dag" —
// se src/gameQueries.js og src/lifeBag.js for eksempler. Udtrykket er selv-
// stændigt (ingen afhængighed af sessionens tidszone-indstilling).

const TZ = 'Europe/Copenhagen';

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// todayStr(d): 'YYYY-MM-DD' i Europe/Copenhagen for et givet tidspunkt
// (default: nu). 'en-CA'-locale'en giver ISO-rækkefølgen (år-måned-dag)
// direkte, uden selv at skulle samle strengen af Intl's formatToParts.
function todayStr(d) {
  const date = d instanceof Date ? d : new Date(d);
  return dayFormatter.format(date);
}

// cphDateExpr(col): SQL-fragment der caster en timestamptz-kolonne/udtryk
// til dags-dato i Europe/Copenhagen. `col` er ALTID et fast kolonne-/
// tabelnavn fra vores egen kildekode (aldrig brugerinput) — ingen SQL-
// injektionsrisiko ved streng-interpolationen her.
function cphDateExpr(col) {
  return `(${col} AT TIME ZONE '${TZ}')::date`;
}

module.exports = { TZ, todayStr, cphDateExpr };
