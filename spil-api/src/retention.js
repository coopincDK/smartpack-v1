'use strict';

// Packrush, opgave C: natligt GDPR-oprydningsjob. Sletter RIGTIGT (cascade:
// forsøg, notifikationer, samtykke-hændelser + anonymisering af rest-
// referencer i andre spilleres data, se src/playerDeletion.js) enhver
// spiller hvor INGEN liste har varig aktiv status, OG der er gået mindst 12
// måneder siden det seneste af: spillerens seneste forsøg, ELLER spillerens
// egen oprettelse hvis vedkommende aldrig har spillet. Spillere med MINDST
// én aktiv, varig tilmelding beholdes UANSET alder. Se README.md for
// hvordan/hvornår jobbet køres, og API.md, "Packrush-ændringer", for
// baggrunden.
//
// Bemærk: forespørgslerne her er BEVIDST skrevet som to simple, ukorrelerede
// forespørgsler + et lille JS-flet (i stedet for én stor korreleret
// underforespørgsel/HAVING-aggregat) — dels for at være letlæselig, dels
// fordi det er sådan resten af kodebasen allerede gør det (se
// src/routes/admin.js#drawWinner, der løkker og slår ticket-antal op pr.
// spiller i JS i stedet for én kæmpe SQL-forespørgsel).
//
// TOCTOU (fundet under sikkerhedsgennemgangen): findRetentionCandidates()
// nedenfor er en RENT LÆSENDE snapshot-forespørgsel — der kan sagtens gå
// tid (eller andre samtidige transaktioner) mellem den og selve
// sletningen. deleteInactivePlayers() LÅSER derfor hver kandidat (SELECT
// ... FOR UPDATE) og GENKONTROLLERER begge betingelser (intet aktivt
// samtykke OG stadig ≥12 mdr. inaktiv) lige før selve sletningen —
// nøjagtig samme mønster som DELETE /admin/spillere/:pid allerede brugte
// (lås FØR skrivning), blot udvidet med en reel gen-kvalifikation, da denne
// sletning (i modsætning til admin-enkelt-sletningen) er BETINGET.

const { deletePlayerFully } = require('./playerDeletion');

const RETENTION_MONTHS = 12;

// cutoffDate(now): "nu minus 12 måneder", klemt til den sidste gyldige dag
// i målmåneden i stedet for at lade JS' Date rulle datoen videre ind i
// næste måned (skudårskanten: 29. februar minus 12 måneder findes ikke i et
// ikke-skudår, og `setUTCMonth` ville ellers stille og roligt give 1.
// marts). Klemningen er BEVIDST konservativ: den giver en cutoff der er
// mindst lige så gammel som "præcis 12 måneder" (aldrig yngre) — dvs. i
// værste fald sletter jobbet én dag SENERE end præcis 12 måneder, ALDRIG
// tidligere.
function cutoffDate(now) {
  const src = now || new Date();
  const year = src.getUTCFullYear();
  const month = src.getUTCMonth(); // 0-11
  const day = src.getUTCDate();

  let targetYear = year;
  let targetMonth = month - RETENTION_MONTHS;
  if (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  }
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, daysInTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      targetDay,
      src.getUTCHours(),
      src.getUTCMinutes(),
      src.getUTCSeconds(),
      src.getUTCMilliseconds()
    )
  );
}

// Ren, testbar forespørgsel: hvilke spiller-id'er kvalificerer til sletning
// LIGE NU (uden lås — se TOCTOU-noten ovenfor: deleteInactivePlayers()
// genkontrollerer hver kandidat lige før den rent faktisk slettes).
//
// Bemærk: vi henter samtykke_status-viewet HELT UFILTRERET og afgør "har
// denne spiller mindst én aktiv liste?" i JS, i stedet for at filtrere/joine
// på st.seneste_type i selve SQL'en. Det er bevidst — et par lokale
// pg-mem-eksperimenter viste at pg-mem's forespørgselsplanlægger kan skubbe
// et JOIN/WHERE-filter på en DISTINCT ON-baseret views IKKE-grupperende
// kolonne (som seneste_type) NED FØR selve DISTINCT ON'en, hvilket i praksis
// ophæver dedupliceringen og giver forkerte svar. Ægte Postgres rammes ikke
// af dette, men et helt ufiltreret SELECT af viewet er lige hurtigt og
// virker identisk begge steder, så vi vælger den robuste variant.
async function findRetentionCandidates(client, now) {
  const cutoff = cutoffDate(now || new Date());

  const alleSpillere = await client.query('SELECT id, oprettet FROM spiller');
  const harAktivSamtykke = await activeConsentSpillerIds(client);

  const sidsteForsoeg = await client.query(
    `SELECT spiller_id, MAX(oprettet) AS sidst FROM forsoeg GROUP BY spiller_id`
  );
  const sidstMap = new Map(sidsteForsoeg.rows.map((r) => [String(r.spiller_id), r.sidst]));

  const out = [];
  for (const row of alleSpillere.rows) {
    if (harAktivSamtykke.has(String(row.id))) continue;
    const sidsteAktivitet = sidstMap.get(String(row.id)) || row.oprettet;
    if (new Date(sidsteAktivitet).getTime() < cutoff.getTime()) {
      // Bemærk: row.id bevares i sin ORIGINALE form (typisk en streng, da
      // `spiller.id` er bigint og node-pg ikke konverterer bigint til
      // Number som standard) — IKKE tvunget til Number(), som ville skabe
      // en type-mismatch mod andre steder i kodebasen der sammenligner
      // spiller-id'er (fx som SQL-parameter herunder, hvor begge typer
      // virker ens).
      out.push(row.id);
    }
  }
  return out;
}

// Sættet af spiller-id'er med mindst én liste i aktiv ('bekraeftet') status
// LIGE NU. Delt hjælper, så både findRetentionCandidates() og TOCTOU-
// genkontrollen i deleteInactivePlayers() bruger nøjagtig samme, pg-mem-
// sikre hente-/filtrerings-metode (se begrundelsen ovenfor).
async function activeConsentSpillerIds(client) {
  const statusRows = await client.query('SELECT spiller_id, seneste_type FROM samtykke_status');
  return new Set(
    statusRows.rows.filter((r) => r.seneste_type === 'bekraeftet').map((r) => String(r.spiller_id))
  );
}

// Genkontrollerer BEGGE betingelser for ÉN spiller, lige før sletning (se
// TOCTOU-noten øverst i filen). `oprettetFallback` er spillerens egen
// `oprettet`, brugt hvis vedkommende aldrig har spillet — samme regel som
// findRetentionCandidates().
async function stillQualifiesForDeletion(client, id, oprettetFallback, now) {
  const cutoff = cutoffDate(now || new Date());
  const harAktivSamtykke = await activeConsentSpillerIds(client);
  if (harAktivSamtykke.has(String(id))) return false;

  const { rows } = await client.query(
    `SELECT MAX(oprettet) AS sidst FROM forsoeg WHERE spiller_id = $1`,
    [id]
  );
  const sidsteAktivitet = (rows[0] && rows[0].sidst) || oprettetFallback;
  return new Date(sidsteAktivitet).getTime() < cutoff.getTime();
}

// Selve sletningen: låser hver kandidat, genkontrollerer TOCTOU-sikkert, og
// sletter (via den fælles src/playerDeletion.js, samme som admin-enkelt-
// sletning/admin-nulstil). Returnerer KUN antallet af rent faktisk slettede
// spillere (ALDRIG navne/emails — se README.md om hvor antallet logges).
async function deleteInactivePlayers(pool, now) {
  const nowResolved = now || new Date();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const kandidater = await findRetentionCandidates(client, nowResolved);

    let antalSlettet = 0;
    for (const id of kandidater) {
      const { rows } = await client.query('SELECT id, navn, oprettet FROM spiller WHERE id = $1 FOR UPDATE', [id]);
      if (!rows.length) continue; // slettet af en anden proces i mellemtiden
      const stadigKvalificeret = await stillQualifiesForDeletion(client, id, rows[0].oprettet, nowResolved);
      if (!stadigKvalificeret) continue; // fx: bekræftede et samtykke eller spillede et forsøg siden findRetentionCandidates()
      await deletePlayerFully(client, id, rows[0].navn);
      antalSlettet++;
    }

    await client.query('COMMIT');
    return antalSlettet;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  RETENTION_MONTHS,
  cutoffDate,
  findRetentionCandidates,
  stillQualifiesForDeletion,
  deleteInactivePlayers,
};
