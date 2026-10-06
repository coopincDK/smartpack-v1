'use strict';

// Baggrundsjob for sms (hvert minut). Alle sms går gennem sms.send(), som håndhæver
// nødstop (cfg.smsOn/smsAfsendelse), tidsvindue, grænse pr. dag, døgnloft og dubletter.
// Uden INMOBILE_API_KEY logges de som 'ingen_noegle' og intet sendes. Afviser
// inMobile hele kaldet pga. nøgle/konfiguration, stopper kørslen, og rækkerne
// prøves igen næste minut. Hver besked slutter med en afmeldingslinje.
//
//  1. Timens boss: ved hver kåring på konferencedagen (kl. 9, 10, ..., 16 og ved
//     spillets slut) findes timens bedste spiller blandt dem, der ikke har vundet en
//     time tidligere samme dag. Gemmes i time_vinder; sms, hvis spilleren har sms-samtykke.
//  2. Åbning: når turneringen starter, én sms til dem, der har bekræftet sms-samtykke inden
//     for de sidste 7 dage, har en gemt samtykketekst og mindst ét godkendt spil (inden for første time).
//  3. Vinderen af lodtrækningen: sms til vinderfirmaets bedste spiller med sms-samtykke.
//  4. Efterårsferieudfordringen: sms til hver trukken vinder med sms-samtykke.

const { send, smsModtager, cphTime, smsSlaaetFra } = require('./sms');
const { matchNoegle } = require('./konkurrence');

const fmt = (d) => new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', minute: '2-digit' }).format(d).replace(':', '.');
const dagCph = (d) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(d);
const fornavn = (n) => String(n || '').trim().split(/\s+/)[0] || 'du';
// Markedsføringsloven: man skal nemt kunne frabede sig flere henvendelser. Afsenderen
// er alfanumerisk, så man kan ikke svare STOP; afmelding sker i spillet.
const AFMELD = ' Afmeld sms: smartpack.dk/spil, Mine tilmeldinger.';

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
    // Findes vinderen allerede, prøves sms'en igen (send() afviser dubletter), så en sms,
    // der blev stoppet af inMobile, kan sendes næste minut.
    const findes = await pool.query('SELECT spiller_id FROM time_vinder WHERE dag = $1 AND time = $2', [dag, time]);
    let v;
    if (findes.rows.length) {
      if (!findes.rows[0].spiller_id) continue;
      v = { id: findes.rows[0].spiller_id };
    } else {
      const { rows } = await pool.query(
        `SELECT s.id, s.navn, f.samlet FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
          WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND s.skjult = false
            AND COALESCE(f.slut_server, f.oprettet) >= $1 AND COALESCE(f.slut_server, f.oprettet) < $2
            AND s.id NOT IN (SELECT spiller_id FROM time_vinder WHERE dag = $3 AND spiller_id IS NOT NULL)
          ORDER BY f.samlet DESC, COALESCE(f.slut_server, f.oprettet) ASC LIMIT 1`,
        [fra, til, dag]
      );
      v = rows[0] || null;
      const ins = await pool.query(
        'INSERT INTO time_vinder (dag, time, spiller_id, navn, score) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING 1',
        [dag, time, v ? v.id : null, v ? v.navn : null, v ? v.samlet : null]
      );
      if (!ins.rows.length || !v) continue;
    }
    const m = await smsModtager(pool, v.id);
    if (!m) continue;
    const frist = fmt(new Date(til.getTime() + 3600e3));
    const r = await send(pool, {
      type: 'timens_boss', noegle: `${dag}-${time}`, spillerId: v.id, til: m.telefon,
      tekst: `Tillykke ${fornavn(m.navn)}! Du er timens boss i Packrush ${fmt(fra)}-${fmt(til)}. Hent din flaske vin og 6 mdr. gratis Sandhed på SmartPacks stand senest kl. ${frist}.${AFMELD}`,
    });
    if (r.stop) return true;
  }
  return false;
}

async function aabning(pool, k, nu) {
  if (!k || !k.spil_start) return false;
  const start = new Date(k.spil_start);
  if (nu < start || nu > new Date(start.getTime() + 60 * 60e3)) return false;
  const dag = dagCph(start);
  // Markedsføring: kun dem, hvis SENESTE sms-samtykke er bekræftet inden for de sidste
  // 7 dage og har en gemt samtykketekst, og som har mindst ét godkendt spil.
  const { rows } = await pool.query(
    `SELECT s.id, s.telefon FROM spiller s
       JOIN LATERAL (SELECT type, tidspunkt, tekst FROM samtykke
                      WHERE spiller_id = s.id AND liste = 'sms'
                      ORDER BY tidspunkt DESC, id DESC LIMIT 1) c
         ON c.type = 'bekraeftet' AND c.tidspunkt >= $1::timestamptz - interval '7 days'
        AND COALESCE(c.tekst, '') <> ''
      WHERE s.skjult = false AND s.telefon IS NOT NULL AND s.telefon <> ''
        AND EXISTS (SELECT 1 FROM forsoeg f WHERE f.spiller_id = s.id AND f.status = 'godkendt')
      ORDER BY s.id`,
    [nu]
  );
  for (const r of rows) {
    const x = await send(pool, {
      type: 'aabning', noegle: `${dag}-${r.id}`, spillerId: r.id, til: r.telefon,
      tekst: `Packrush-turneringen på E-handelskonferencen er åben nu. Timens boss vinder vin hver time. Spil på smartpack.dk/spil${AFMELD}`,
    });
    if (x.stop) return true;
  }
  return false;
}

async function vinder(pool) {
  const { rows } = await pool.query('SELECT id, vinder_firma, vinder_firma_noegle, spil_start, spil_slut FROM konkurrence_traekning ORDER BY id DESC LIMIT 1');
  const t = rows[0];
  if (!t) return false;
  const { rows: sp } = await pool.query(
    `SELECT s.id, s.navn, s.firma, s.telefon, max(f.samlet) bedste FROM spiller s JOIN forsoeg f ON f.spiller_id = s.id
      WHERE f.status = 'godkendt' AND f.samlet IS NOT NULL AND COALESCE(f.slut_server, f.oprettet) BETWEEN $1 AND $2
        AND s.skjult = false AND s.telefon IS NOT NULL AND s.telefon <> ''
        AND EXISTS (SELECT 1 FROM samtykke_status c WHERE c.spiller_id = s.id AND c.liste = 'sms' AND c.seneste_type = 'bekraeftet')
      GROUP BY s.id ORDER BY bedste DESC`,
    [t.spil_start, t.spil_slut]
  );
  const v = sp.find((r) => matchNoegle(r.firma) === t.vinder_firma_noegle);
  if (!v) return false;
  // Højst én vinder-sms pr. spiller: nøglen er trækningens id, og en spiller, der
  // allerede har fået (eller er forsøgt tilsendt) en vinder-sms, får ikke en ny ved
  // en ny trækning.
  const alleredeFaaet = await pool.query(
    "SELECT 1 FROM sms_log WHERE type = 'vinder' AND spiller_id = $1 AND noegle <> $2 AND status IN ('sendt', 'fejl')",
    [v.id, String(t.id)]
  );
  if (alleredeFaaet.rows.length) return false;
  const r = await send(pool, {
    type: 'vinder', noegle: String(t.id), spillerId: v.id, til: v.telefon,
    tekst: `Tillykke! ${t.vinder_firma} har vundet præmiepuljen i Packrush. Kom forbi SmartPacks stand, eller hold øje med din mail, så aftaler vi resten.${AFMELD}`,
  });
  return !!r.stop;
}

async function efteraar(pool) {
  const { rows } = await pool.query("SELECT id, type, vinder_spiller_id FROM efteraar_traekning WHERE type = 'lod' ORDER BY id");
  for (const [i, t] of rows.entries()) {
    if (!t.vinder_spiller_id || i > 1) continue;
    const m = await smsModtager(pool, t.vinder_spiller_id);
    if (!m) continue;
    const skjult = await pool.query('SELECT 1 FROM spiller WHERE id = $1 AND skjult = true', [m.id]);
    if (skjult.rows.length) continue;
    const r = await send(pool, {
      type: 'efteraar', noegle: String(t.id), spillerId: m.id, til: m.telefon,
      tekst: `Tillykke ${fornavn(m.navn)}! Du er trukket som vinder af ${i === 0 ? '2 flasker' : '1 flaske'} vin i Packrush Efterårsferieudfordring. Tjek din mail, så aftaler vi levering.${AFMELD}`,
    });
    if (r.stop) return true;
  }
  return false;
}

async function koer(pool, nu = new Date()) {
  // Nødstop: læses frisk ved hver kørsel, og send() tjekker det igen ved hver sms.
  if (await smsSlaaetFra(pool)) return;
  const k = await konkurrence(pool);
  if (await timensBoss(pool, k, nu)) return;
  if (await aabning(pool, k, nu)) return;
  if (await vinder(pool)) return;
  await efteraar(pool);
}

function startSmsJobs(pool) {
  const tick = () => koer(pool).catch((e) => console.error('[sms]', e.message));
  setTimeout(tick, 15e3);
  return setInterval(tick, 60e3);
}

module.exports = { startSmsJobs, koer, kaaringer };
