'use strict';

// Sms via inMobile REST API v4 (POST /sms/outgoing, Basic auth med brugernavn "x"
// og API-nøglen som adgangskode). Nøglen ligger kun i .env (INMOBILE_API_KEY).
// Regler: afsender "Packrush", kun kl. 8-21 dansk tid, højst 2 sms pr. spiller pr.
// dag, aldrig samme (type, noegle) to gange, og alt logges i sms_log.

const AFSENDER = 'Packrush';
const MAX_PR_DAG = 2;

function msisdn(raw) {
  const d = String(raw || '').replace(/[^0-9]/g, '');
  if (d.length === 8) return '45' + d;
  if (d.length === 10 && d.startsWith('45')) return d;
  if (d.length === 12 && d.startsWith('0045')) return d.slice(2);
  return null;
}

function cphTime(d = new Date()) {
  return Number(new Intl.DateTimeFormat('da-DK', { timeZone: 'Europe/Copenhagen', hour: '2-digit', hour12: false }).format(d));
}

async function send(pool, { type, noegle, spillerId = null, til, tekst, test = false }) {
  const to = msisdn(til);
  if (!to) return { ok: false, grund: 'ugyldigt_nummer' };
  const ins = await pool.query(
    `INSERT INTO sms_log (type, noegle, spiller_id, til, tekst) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (type, noegle) DO NOTHING RETURNING id`,
    [type, noegle, spillerId, to, tekst]
  );
  if (!ins.rows.length) return { ok: false, grund: 'dublet' };
  const id = ins.rows[0].id;
  const saet = (status, fejl = null) => pool.query('UPDATE sms_log SET status = $2, fejl = $3 WHERE id = $1', [id, status, fejl]);

  if (!test) {
    const h = cphTime();
    if (h < 8 || h >= 21) { await saet('uden_for_tid'); return { ok: false, grund: 'uden_for_tid' }; }
    if (spillerId) {
      const { rows } = await pool.query(
        `SELECT count(*)::int n FROM sms_log WHERE spiller_id = $1 AND status = 'sendt'
           AND (tidspunkt AT TIME ZONE 'Europe/Copenhagen')::date = (now() AT TIME ZONE 'Europe/Copenhagen')::date`,
        [spillerId]
      );
      if (rows[0].n >= MAX_PR_DAG) { await saet('over_graense'); return { ok: false, grund: 'over_graense' }; }
    }
  }
  const key = process.env.INMOBILE_API_KEY;
  if (!key) { await saet('ingen_noegle'); return { ok: false, grund: 'ingen_noegle' }; }
  try {
    const url = (process.env.INMOBILE_URL || 'https://api.inmobile.com/v4') + '/sms/outgoing';
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(url, {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', authorization: 'Basic ' + Buffer.from('x:' + key).toString('base64') },
      body: JSON.stringify({ messages: [{ to, text: tekst, from: AFSENDER, encoding: 'auto' }] }),
    });
    clearTimeout(t);
    if (!r.ok) { const b = (await r.text()).slice(0, 200); await saet('fejl', `HTTP ${r.status} ${b}`); return { ok: false, grund: 'fejl', status: r.status }; }
    await saet('sendt');
    return { ok: true };
  } catch (e) {
    await saet('fejl', String(e.message || e).slice(0, 200));
    return { ok: false, grund: 'fejl' };
  }
}

// Spillere med telefon og aktivt sms-samtykke.
async function smsModtager(pool, spillerId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.navn, s.telefon FROM spiller s
      WHERE s.id = $1 AND s.telefon IS NOT NULL AND s.telefon <> ''
        AND EXISTS (SELECT 1 FROM samtykke_status c WHERE c.spiller_id = s.id AND c.liste = 'sms' AND c.seneste_type = 'bekraeftet')`,
    [spillerId]
  );
  return rows[0] || null;
}

module.exports = { send, smsModtager, msisdn, cphTime, AFSENDER, MAX_PR_DAG };
