'use strict';

// Fælles sletnings-/anonymiseringslogik — DEN ENESTE implementering af
// "slet en spiller rigtigt", genbrugt af:
//   - src/retention.js (natligt GDPR-oprydningsjob)
//   - POST /admin/spillere/:pid (admin-panelets enkelt-sletning)
//   - POST /admin/nulstil (fuld nulstilling, se API.md)
// Fundet under sikkerhedsgennemgangen: tre uafhængige kopier af cascade-
// sletningen ville let afvige (fx anonymisering glemt ét sted). Ved at
// samle det ét sted er lås/genkontrol (se src/retention.js) og
// anonymisering altid i sync.
//
// Rest-referencer der overlever en cascade-DELETE (fordi de er
// friteksts-KOPIER, ikke fremmednøgler): raffle_draws' snapshot-kolonner,
// andre spilleres notifikation.data.by/.fra, og andre spilleres
// forsoeg.duel.vs. Disse anonymiseres til SLETTET_SPILLER (navn) /
// NULL (email) FØR selve cascade-sletningen.
//
// KALDEREN skal selv have låst spiller-rækken (SELECT ... FOR UPDATE) og
// stadig være inde i samme transaktion — denne funktion foretager INGEN
// egen lås/genkontrol af om sletningen "bør" ske (det er retention.js'
// og admin-routernes ansvar).

const SLETTET_SPILLER = 'Slettet spiller';

async function anonymizeReferencesToPlayer(client, id, navn) {
  // Spillerens EGNE raffle_draws-rækker: snapshot-felterne er en fritekst-
  // kopi taget ved selve lodtrækningen (ikke en FK) — de overlever en
  // sletning af spiller-rækken medmindre vi rydder dem eksplicit her.
  await client.query(
    `UPDATE raffle_draws SET spiller_id = NULL, spiller_navn_snapshot = $2, email_snapshot = NULL
     WHERE spiller_id = $1`,
    [id, SLETTET_SPILLER]
  );

  // Andre spilleres notifikation.data.by (beaten-notifikation) / .data.fra
  // (gift-notifikation) er en navne-KOPI skrevet ved selve hændelsen (se
  // src/routes/runs.js) — ingen spiller_id at nulstille, så vi matcher på
  // navnet. Kendt, accepteret begrænsning: to spillere med samme navn kunne
  // i teorien krydse hinanden her — ikke fikset, se README.md.
  await client.query(
    `UPDATE notifikation SET data = jsonb_set(data, '{by}', to_jsonb($3::text))
     WHERE spiller_id != $1 AND data ? 'by' AND data->>'by' = $2`,
    [id, navn, SLETTET_SPILLER]
  );
  await client.query(
    `UPDATE notifikation SET data = jsonb_set(data, '{fra}', to_jsonb($3::text))
     WHERE spiller_id != $1 AND data ? 'fra' AND data->>'fra' = $2`,
    [id, navn, SLETTET_SPILLER]
  );

  // Andre spilleres forsoeg.duel.vs (det sanitiserede duel-navn i GET
  // /state, se src/publicState.js#sanitizeDuel) — samme slags navne-kopi.
  await client.query(
    `UPDATE forsoeg SET duel = jsonb_set(duel, '{vs}', to_jsonb($3::text))
     WHERE spiller_id != $1 AND duel ? 'vs' AND duel->>'vs' = $2`,
    [id, navn, SLETTET_SPILLER]
  );

  await client.query(`UPDATE spiller SET ref_spiller_id = NULL WHERE ref_spiller_id = $1`, [id]);
}

// Selve cascade-sletningen af spillerens EGNE rækker + spilleren selv.
// Kaldes EFTER anonymizeReferencesToPlayer() — ellers ville vi selv have
// slettet de forsøg/notifikations-rækker vi lige har opdateret andre
// spilleres referencer ud fra (irrelevant rækkefølge for selve dataene, men
// holder de to trin tydeligt adskilte).
async function cascadeDeletePlayer(client, id) {
  await client.query('DELETE FROM notifikation WHERE spiller_id = $1', [id]);
  await client.query('DELETE FROM samtykke WHERE spiller_id = $1', [id]);
  await client.query('DELETE FROM forsoeg WHERE spiller_id = $1', [id]);
  await client.query('DELETE FROM spiller WHERE id = $1', [id]);
}

// Fuld, rigtig GDPR-sletning af ÉN spiller: anonymiserer rest-referencer i
// andre spilleres data, sletter derefter spillerens egne rækker (cascade) +
// selve spiller-rækken. `navn` skal være spillerens navn PÅ SLETNINGS-
// TIDSPUNKTET (hentet af kalderen via den FOR UPDATE-låste række).
async function deletePlayerFully(client, id, navn) {
  await anonymizeReferencesToPlayer(client, id, navn);
  await cascadeDeletePlayer(client, id);
}

module.exports = { SLETTET_SPILLER, anonymizeReferencesToPlayer, cascadeDeletePlayer, deletePlayerFully };
