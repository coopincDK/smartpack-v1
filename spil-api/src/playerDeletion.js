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
  // src/routes/runs.js) — matches nu FØRST på et id-felt sat ved siden af
  // navnet (by_spiller_id/fra_spiller_id, se migrations/005_opfoelgning2.sql)
  // for rækker der har det. Navnematch er kun et FALDBACK for ældre rækker
  // skrevet FØR denne migration (kendt, accepteret begrænsning for DEM: to
  // spillere med samme navn kunne i teorien krydse hinanden — se README.md).
  await client.query(
    `UPDATE notifikation
     SET data = jsonb_set(jsonb_set(data, '{by}', to_jsonb($3::text)), '{by_spiller_id}', 'null'::jsonb)
     WHERE spiller_id != $1 AND data ? 'by' AND (
       (data ? 'by_spiller_id' AND (data->>'by_spiller_id')::bigint = $1)
       OR (NOT (data ? 'by_spiller_id') AND data->>'by' = $2)
     )`,
    [id, navn, SLETTET_SPILLER]
  );
  await client.query(
    `UPDATE notifikation
     SET data = jsonb_set(jsonb_set(data, '{fra}', to_jsonb($3::text)), '{fra_spiller_id}', 'null'::jsonb)
     WHERE spiller_id != $1 AND data ? 'fra' AND (
       (data ? 'fra_spiller_id' AND (data->>'fra_spiller_id')::bigint = $1)
       OR (NOT (data ? 'fra_spiller_id') AND data->>'fra' = $2)
     )`,
    [id, navn, SLETTET_SPILLER]
  );

  // Andre spilleres forsoeg.duel.vs (det sanitiserede duel-navn i GET
  // /state, se src/publicState.js#sanitizeDuel) — samme id-først/navne-
  // faldback-mønster (duel.vs_spiller_id, sat i finish-flowet ud fra
  // klientens valgfri duel.vsId, se src/routes/runs.js).
  await client.query(
    `UPDATE forsoeg
     SET duel = jsonb_set(jsonb_set(duel, '{vs}', to_jsonb($3::text)), '{vs_spiller_id}', 'null'::jsonb)
     WHERE spiller_id != $1 AND duel ? 'vs' AND (
       (duel ? 'vs_spiller_id' AND (duel->>'vs_spiller_id')::bigint = $1)
       OR (NOT (duel ? 'vs_spiller_id') AND duel->>'vs' = $2)
     )`,
    [id, navn, SLETTET_SPILLER]
  );

  await client.query(`UPDATE spiller SET ref_spiller_id = NULL WHERE ref_spiller_id = $1`, [id]);

  // sms_log og time_vinder har kun en FK med SET NULL; telefonnummer, fornavn (i
  // teksten) og fuldt navn er kopier, der ellers overlever sletningen.
  await client.query(`UPDATE sms_log SET til = '', tekst = '[slettet]', fejl = NULL WHERE spiller_id = $1`, [id]);
  await client.query('UPDATE time_vinder SET navn = $2 WHERE spiller_id = $1', [id, SLETTET_SPILLER]);
}

// Selve cascade-sletningen af spillerens EGNE rækker + spilleren selv.
// Kaldes EFTER anonymizeReferencesToPlayer() — ellers ville vi selv have
// slettet de forsøg/notifikations-rækker vi lige har opdateret andre
// spilleres referencer ud fra (irrelevant rækkefølge for selve dataene, men
// holder de to trin tydeligt adskilte).
async function cascadeDeletePlayer(client, id, { afmeldCrm = true } = {}) {
  await client.query('DELETE FROM notifikation WHERE spiller_id = $1', [id]);
  // Havde spilleren aktivt ja til SmartPack, lægges en afmelding i CRM-udbakken
  // (kun e-mail + tidspunkt) i SAMME transaktion som sletningen, så den hverken kan
  // gå tabt eller ske uden at sletningen sker. src/crmSynk.js sender den og sletter
  // rækken, når CRM'et har bekræftet. Skal ske FØR samtykke-rækkerne slettes.
  // Afmeld, når det seneste SENDTE smartpack-samtykke er et ja, uanset hvad den seneste
  // hændelse er: et nej, der ikke er sendt endnu, er ikke nået frem til CRM'et, og rækken
  // forsvinder med sletningen. Kun hvis ja'et faktisk ER sendt (crm_synk_status = 'sendt'); ellers
  // kender CRM'et ikke kontakten, og et ja, der aldrig blev sendt, forsvinder med
  // sletningen. afmeldCrm = false bruges af admin/nulstil (rydning af testdata er
  // ikke en tilbagetrækning af samtykket).
  if (afmeldCrm) {
    // Lås de smartpack-samtykker først: crmSynk markerer et ja 'sendt' med en UPDATE på
    // samme række. Så ser vi enten status 'sendt' (og afmelder her), eller crmSynk
    // opdager bagefter, at rækken er væk, og afmelder selv (src/crmSynk.js).
    await client.query("SELECT id FROM samtykke WHERE spiller_id = $1 AND liste = 'smartpack' FOR UPDATE", [id]);
    await client.query(
      `INSERT INTO crm_udbakke (email, type)
       SELECT p.email, 'afmeld' FROM spiller p
        WHERE p.id = $1 AND p.email IS NOT NULL
          AND (SELECT s.type FROM samtykke s
                WHERE s.spiller_id = p.id AND s.liste = 'smartpack' AND s.crm_synk_status = 'sendt'
                ORDER BY s.tidspunkt DESC, s.id DESC LIMIT 1) = 'bekraeftet'`,
      [id]
    );
  }
  await client.query('DELETE FROM samtykke WHERE spiller_id = $1', [id]);
  await client.query('DELETE FROM forsoeg WHERE spiller_id = $1', [id]);
  // Opgave C: spiller_token (flere samtidige tokens, se migrations/
  // 005_opfoelgning2.sql) har en FK til spiller — skal ryddes FØR selve
  // spiller-rækken slettes, ellers fejler DELETE'et nedenfor med en
  // fremmednøgle-overtrædelse.
  await client.query('DELETE FROM spiller_token WHERE spiller_id = $1', [id]);
  await client.query('DELETE FROM spiller WHERE id = $1', [id]);
}

// Fuld, rigtig GDPR-sletning af ÉN spiller: anonymiserer rest-referencer i
// andre spilleres data, sletter derefter spillerens egne rækker (cascade) +
// selve spiller-rækken. `navn` skal være spillerens navn PÅ SLETNINGS-
// TIDSPUNKTET (hentet af kalderen via den FOR UPDATE-låste række).
async function deletePlayerFully(client, id, navn, opts) {
  await anonymizeReferencesToPlayer(client, id, navn);
  await cascadeDeletePlayer(client, id, opts);
}

module.exports = { SLETTET_SPILLER, anonymizeReferencesToPlayer, cascadeDeletePlayer, deletePlayerFully };
