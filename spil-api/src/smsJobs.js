'use strict';

// Baggrundsjob for sms (hvert minut). Alle sms går gennem sms.send(), som håndhæver
// tidsvindue, grænse pr. dag og dubletter. Uden INMOBILE_API_KEY logges de som
// 'ingen_noegle' og intet sendes.
//
//  1. Timens boss: ved hver kåring på konferencedagen (kl. 9, 10, ..., 16 og ved
//     spillets slut) findes timens bedste spiller blandt dem, der ikke har vundet en
//     time tidligere samme dag. Gemmes i time_vinder; sms, hvis spilleren har sms-samtykke.
//  2. Åbning: når turneringen starter, én sms til alle med sms-samtykke (inden for første time).
//  3. Vinderen af lodtrækningen: sms til vinderfirmaets bedste spiller med sms-samtykke.
//  4. Efterårsferieudfordringen: sms til hver trukken vinder med sms-samtykke.

const { send, smsModtager, cphTime } = require('./sms');
const { matchNoegle } = require('./konkurrence');

const fmt = (d) => new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit' }).format(d).replace(':', '.');
const dagCph = (d) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(d);
const fornavn = (n) => String(n || '').trim().split(/\s+/)[0] || 'du';

async function konkurrence(pool) {
  const { rows } = await pool.query('SELECT * FROM konkurrence WHERE id = 1');
  return rows[0] || null;
}

// Kåringstidspunkter: hver hele time efter start, og til sidst spillets slut.
function kaaringer(start, slut) {
  const ud = [];
  const t = new Date(start);
  t.setUTCMinutes(0, 0, 0);
  for (let x = new Date(t.getTime() + 3600e3); x < slut; x = new Date(x.getTime() + 3600e3)) ud.push({ fra: new Date(Math.max(x.getTime() - 3600e3, start.getTime())), til: x });
  const sidste = ud.length ? ud[ud.length - 1].til : start;
  if (sidste < slut) ud.push({ fra: sidste, til: slut });
  return ud;
}

async function timensBoss(pool, k, nu) {
  if (!k || !k.spil_start || !k.spil_slut) return;
  const start = new Date(k.spil_start), slut = new Date(k.spil_slut);
  if (nu < start || nu > new Date(slut.getTime() + 15 * 60e3)) return;
  const dag = dagCph(start);
  for (const { fra, til } of kaaringer(start, slut)) {
    if (nu < til) continue;
    const time = cphTime(til) * 100 + Number(new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', minute: '2-digit' }).format(til));
    const findes = await pool.query('SELECT 1 FROM time_vinder WHERE dag = $1 AND time = $2', [dag, time]);
    if (findes.rows.length) continue;
    const { rows } = await pool.query(
      `SELECT s.id, s.navn, f.samlet FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
        WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND s.skjult = false
          AND COALESCE(f.slut_server, f.oprettet) >= $1 AND COALESCE(f.slut_server, f.oprettet) < $2
          AND s.id NOT IN (SELECT spiller_id FROM time_vinder WHERE dag = $3 AND spiller_id IS NOT NULL)
        ORDER BY f.samlet DESC, COALESCE(f.slut_server, f.oprettet) ASC LIMIT 1`,
      [fra, til, dag]
    );
    const v = rows[0] || null;
    const ins = await pool.query(
      'INSERT INTO time_vinder (dag, time, spiller_id, navn, score) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING 1',
      [dag, time, v ? v.id : null, v ? v.navn : null, v ? v.samlet : null]
    );
    if (!ins.rows.length || !v) continue;
    const m = await smsModtager(pool, v.id);
    if (!m) continue;
    const frist = fmt(new Date(til.getTime() + 3600e3));
    await send(pool, {
      type: 'timens_boss', noegle: `${dag}-${time}`, spillerId: v.id, til: m.telefon,
      tekst: `Tillykke ${fornavn(m.navn)}! Du er timens boss i Packrush ${fmt(fra)}-${fmt(til)}. Hent din flaske vin og 6 mdr. gratis Sandhed på SmartPacks stand senest kl. ${frist}.`,
    });
  }
}

async function aabning(pool, k, nu) {
  if (!k || !k.spil_start) return;
  const start = new Date(k.spil_start);
  if (nu < start || nu > new Date(start.getTime() + 60 * 60e3)) return;
  const dag = dagCph(start);
  const { rows } = await pool.query(
    `SELECT s.id, s.telefon FROM spiller s
      WHERE s.skjult = false AND s.telefon IS NOT NULL AND s.telefon <> ''
        AND EXISTS (SELECT 1 FROM samtykke_status c WHERE c.spiller_id = s.id AND c.liste = 'sms' AND c.seneste_type = 'bekraeftet')`
  );
  for (const r of rows) {
    await send(pool, {
      type: 'aabning', noegle: `${dag}-${r.id}`, spillerId: r.id, til: r.telefon,
      tekst: 'Packrush-turneringen på E-handelskonferencen er åben nu. Timens boss vinder vin hver time. Spil på smartpack.dk/spil',
    });
  }
}

async function vinder(pool) {
  const { rows } = await pool.query('SELECT id, vinder_firma, vinder_firma_noegle, spil_start, spil_slut FROM konkurrence_traekning ORDER BY id DESC LIMIT 1');
  const t = rows[0];
  if (!t) return;
  const { rows: sp } = await pool.query(
    `SELECT s.id, s.navn, s.firma, s.telefon, max(f.samlet) bedste FROM spiller s JOIN forsoeg f ON f.spiller_id = s.id
      WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND COALESCE(f.slut_server, f.oprettet) BETWEEN $1 AND $2
        AND s.telefon IS NOT NULL AND s.telefon <> ''
        AND EXISTS (SELECT 1 FROM samtykke_status c WHERE c.spiller_id = s.id AND c.liste = 'sms' AND c.seneste_type = 'bekraeftet')
      GROUP BY s.id ORDER BY bedste DESC`,
    [t.spil_start, t.spil_slut]
  );
  const v = sp.find((r) => matchNoegle(r.firma) === t.vinder_firma_noegle);
  if (!v) return;
  await send(pool, {
    type: 'vinder', noegle: String(t.id), spillerId: v.id, til: v.telefon,
    tekst: `Tillykke! ${t.vinder_firma} har vundet præmiepuljen i Packrush. Kom forbi SmartPacks stand, eller hold øje med din mail, så aftaler vi resten.`,
  });
}

async function efteraar(pool) {
  const { rows } = await pool.query('SELECT id, type, vinder_spiller_id FROM efteraar_traekning ORDER BY id');
  for (const t of rows) {
    if (!t.vinder_spiller_id) continue;
    const m = await smsModtager(pool, t.vinder_spiller_id);
    if (!m) continue;
    await send(pool, {
      type: 'efteraar', noegle: String(t.id), spillerId: m.id, til: m.telefon,
      tekst: `Tillykke ${fornavn(m.navn)}! Du har vundet ${t.type === 'top' ? '2 flasker' : '1 flaske'} vin i Packrush Efterårsferieudfordring. Tjek din mail, så aftaler vi levering.`,
    });
  }
}

async function koer(pool, nu = new Date()) {
  const k = await konkurrence(pool);
  await timensBoss(pool, k, nu);
  await aabning(pool, k, nu);
  await vinder(pool);
  await efteraar(pool);
}

function startSmsJobs(pool) {
  const tick = () => koer(pool).catch((e) => console.error('[sms]', e.message));
  setTimeout(tick, 15e3);
  return setInterval(tick, 60e3);
}

module.exports = { startSmsJobs, koer, kaaringer };
