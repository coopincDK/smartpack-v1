'use strict';

// Packrush, opgave C: natligt GDPR-oprydningsjob. Sletter RIGTIGT (cascade:
// forsøg, notifikationer, samtykke-hændelser) enhver spiller hvor INGEN
// liste har varig aktiv status, OG der er gået mindst 12 måneder siden det
// seneste af: spillerens seneste forsøg, ELLER spillerens egen oprettelse
// hvis vedkommende aldrig har spillet. Spillere med MINDST én aktiv, varig
// tilmelding beholdes UANSET alder. Se README.md for hvordan/hvornår
// jobbet køres, og API.md, "Packrush-ændringer", for baggrunden.
//
// Bemærk: forespørgslerne her er BEVIDST skrevet som to simple, ukorrelerede
// forespørgsler + et lille JS-flet (i stedet for én stor korreleret
// underforespørgsel/HAVING-aggregat) — dels for at være letlæselig, dels
// fordi det er sådan resten af kodebasen allerede gør det (se
// src/routes/admin.js#drawWinner, der løkker og slår ticket-antal op pr.
// spiller i JS i stedet for én kæmpe SQL-forespørgsel).

const RETENTION_MONTHS = 12;

function cutoffDate(now) {
  const d = new Date(now.getTime());
  d.setUTCMonth(d.getUTCMonth() - RETENTION_MONTHS);
  return d;
}

// Ren, testbar forespørgsel: hvilke spiller-id'er kvalificerer til sletning
// LIGE NU. Rører ikke ved data.
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
  const statusRows = await client.query('SELECT spiller_id, seneste_type FROM samtykke_status');
  const harAktivSamtykke = new Set(
    statusRows.rows.filter((r) => r.seneste_type === 'bekraeftet').map((r) => String(r.spiller_id))
  );

  const sidsteForsoeg = await client.query(
    `SELECT spiller_id, MAX(oprettet) AS sidst FROM forsoeg GROUP BY spiller_id`
  );
  const sidstMap = new Map(sidsteForsoeg.rows.map((r) => [String(r.spiller_id), r.sidst]));

  const out = [];
  for (const row of alleSpillere.rows) {
    if (harAktivSamtykke.has(String(row.id))) continue;
    const sidsteAktivitet = sidstMap.get(String(row.id)) || row.oprettet;
    if (new Date(sidsteAktivitet).getTime() < cutoff.getTime()) {
      out.push(Number(row.id));
    }
  }
  return out;
}

// Selve sletningen (cascade: forsøg, notifikationer, samtykke — samme
// rækkefølge som DELETE /admin/spillere/:pid, se src/routes/admin.js).
// Returnerer KUN antallet af slettede spillere (ALDRIG navne/emails — se
// README.md om hvor antallet logges).
async function deleteInactivePlayers(pool, now) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ids = await findRetentionCandidates(client, now || new Date());
    for (const id of ids) {
      await client.query('UPDATE raffle_draws SET spiller_id = NULL WHERE spiller_id = $1', [id]);
      await client.query('UPDATE spiller SET ref_spiller_id = NULL WHERE ref_spiller_id = $1', [id]);
      await client.query('DELETE FROM notifikation WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM samtykke WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM forsoeg WHERE spiller_id = $1', [id]);
      await client.query('DELETE FROM spiller WHERE id = $1', [id]);
    }
    await client.query('COMMIT');
    return ids.length;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { RETENTION_MONTHS, cutoffDate, findRetentionCandidates, deleteInactivePlayers };
