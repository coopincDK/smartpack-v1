'use strict';

// Sms via inMobile REST API v4 (POST /sms/outgoing, Basic auth med brugernavn "x"
// og API-nøglen som adgangskode). Nøglen ligger kun i .env (INMOBILE_API_KEY).
// Regler: afsender "Packrush", kun kl. 8-21 dansk tid, højst 2 sms pr. spiller pr.
// dag (vinder-, efterårs- og test-sms undtaget), et samlet nødloft pr. døgn for alle
// modtagere (SMS_MAKS_PR_DOEGN, standard 1000, håndhævet atomisk i sms_taeller),
// aldrig samme (type, noegle) to gange, og alt logges i sms_log.
// Nødstop: cfg.smsOn === false eller cfg.smsAfsendelse === false (læst frisk fra DB
// ved hvert kald) stopper al afsendelse. Kun admins eksplicitte test-sms (adminTest)
// går uden om det.

const AFSENDER = 'Packrush';
const MAX_PR_DAG = 2;
// Beskeder, der ikke må blokeres af grænsen pr. modtager (præmiebeskeder).
const UNDTAGET_MODTAGERGRAENSE = new Set(['vinder', 'efteraar']);

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

// Heltal fra env med standardværdi (tom/ugyldig/negativ giver standarden).
function envTal(navn, standard) {
  const v = process.env[navn];
  if (v === undefined || v === '') return standard;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : standard;
}

// Er afsendelse slået fra i den offentlige config? Læses frisk ved hvert kald, så et
// klik i admin-panelet virker med det samme. `smsOn` er spillerens tilmeldingsvalg,
// `smsAfsendelse` er et rent nødstop for afsendelsen.
async function smsSlaaetFra(pool, { kunNodstop = false } = {}) {
  const { rows } = await pool.query('SELECT offentlig FROM config WHERE id = 1');
  const cfg = (rows[0] && rows[0].offentlig) || {};
  if (cfg.smsAfsendelse === false) return true;
  return !kunNodstop && cfg.smsOn === false;
}

// Auto-stop: efter AUTO_STOP_EFTER afviste kald i træk (401/403/404) på hele kaldet slås
// cfg.smsAfsendelse fra i DB, så en forkert nøgle ikke giver et kald hvert minut hele dagen.
// Tælleren ligger i hukommelsen og nulstilles af et vellykket kald eller en genstart.
const AUTO_STOP_EFTER = 5;
let afvisteITraek = 0;
async function autoStop(pool) {
  console.error('[sms] ALARM: ' + AUTO_STOP_EFTER + ' afviste kald i træk fra inMobile, sms-afsendelse slået fra (smsAfsendelse=false). Tjek INMOBILE_API_KEY.');
  await pool.query('UPDATE config SET offentlig = offentlig || $1::jsonb WHERE id = 1', ['{"smsAfsendelse": false}']);
  try { require('./publicState').invalidateStateCache(); } catch (e) { /* ikke kritisk */ }
}

const DAG_CPH = "(now() AT TIME ZONE 'Europe/Copenhagen')::date";

// Reserverer én plads under døgnloftet (og for aabning under underloftet). Én enkelt
// sætning på dagens række, så parallelle jobs serialiseres af rækkelåsen.
async function reserverPlads(pool, type) {
  const maks = envTal('SMS_MAKS_PR_DOEGN', 1000);
  const aabMaks = envTal('SMS_AABNING_MAKS', 500);
  const erAab = type === 'aabning' ? 1 : 0;
  if (maks < 1) return { ok: false, grund: 'over_doegnloft' };
  if (erAab && aabMaks < 1) return { ok: false, grund: 'over_aabningsloft' };
  const { rows } = await pool.query(
    `INSERT INTO sms_taeller AS t (dag, antal, aabning) VALUES (${DAG_CPH}, 1, $1::int)
     ON CONFLICT (dag) DO UPDATE SET antal = t.antal + 1, aabning = t.aabning + $1::int
       WHERE t.antal < $2::int AND ($1::int = 0 OR t.aabning < $3::int)
     RETURNING antal`,
    [erAab, maks, aabMaks]
  );
  if (rows.length) return { ok: true };
  const { rows: d } = await pool.query(`SELECT antal FROM sms_taeller WHERE dag = ${DAG_CPH}`);
  return { ok: false, grund: d[0] && d[0].antal >= maks ? 'over_doegnloft' : 'over_aabningsloft' };
}

async function frigivPlads(pool, type) {
  await pool.query(
    `UPDATE sms_taeller SET antal = GREATEST(antal - 1, 0), aabning = GREATEST(aabning - $1::int, 0) WHERE dag = ${DAG_CPH}`,
    [type === 'aabning' ? 1 : 0]
  );
}

// Svaret fra inMobile kan afvise den enkelte modtager, selv om kaldet er 2xx.
function afvistModtager(body) {
  try {
    const j = JSON.parse(body);
    const r = j && Array.isArray(j.results) ? j.results[0] : null;
    if (r && r.error) return String(typeof r.error === 'string' ? r.error : JSON.stringify(r.error)).slice(0, 200);
  } catch (e) { /* ikke JSON: regn kaldet som sendt */ }
  return null;
}

// Returnerer { ok, grund, stop }. stop = true betyder, at resten af kørslen skal
// springes over (nødstop eller inMobile afviste kaldet pga. nøgle/konfiguration).
// logTekst: det, der gemmes i sms_log, hvis det skal være andet end det sendte
// (fx med maskeret startkode). adminTest: admins eksplicitte test-sms. test: springer
// tidsvindue og grænse pr. modtager over (partnerlogin og admins test-sms).
// kunNodstop: respekterer kun smsAfsendelse, ikke smsOn (partnerlogin hører ikke
// under spillernes sms-tilmelding).
async function send(pool, { type, noegle, spillerId = null, til, tekst, logTekst = null, test = false, adminTest = false, kunNodstop = false }) {
  const to = msisdn(til);
  if (!to) return { ok: false, grund: 'ugyldigt_nummer' };
  if (!adminTest && (await smsSlaaetFra(pool, { kunNodstop }))) return { ok: false, grund: 'sms_slaaet_fra', stop: true };
  const ins = await pool.query(
    `INSERT INTO sms_log (type, noegle, spiller_id, til, tekst) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (type, noegle) DO NOTHING RETURNING id`,
    [type, noegle, spillerId, to, logTekst || tekst]
  );
  if (!ins.rows.length) return { ok: false, grund: 'dublet' };
  const id = ins.rows[0].id;
  const saet = (status, fejl = null) => pool.query('UPDATE sms_log SET status = $2, fejl = $3 WHERE id = $1', [id, status, fejl]);

  if (!test) {
    const h = cphTime();
    if (h < 8 || h >= 21) { await saet('uden_for_tid'); return { ok: false, grund: 'uden_for_tid' }; }
  }
  if (spillerId && !test && !UNDTAGET_MODTAGERGRAENSE.has(type)) {
    const { rows } = await pool.query(
      `SELECT count(*)::int n FROM sms_log WHERE spiller_id = $1 AND status = 'sendt'
         AND (tidspunkt AT TIME ZONE 'Europe/Copenhagen')::date = ${DAG_CPH}`,
      [spillerId]
    );
    if (rows[0].n >= MAX_PR_DAG) { await saet('over_graense'); return { ok: false, grund: 'over_graense' }; }
  }
  const key = process.env.INMOBILE_API_KEY;
  if (!key) { await saet('ingen_noegle'); return { ok: false, grund: 'ingen_noegle' }; }
  const plads = await reserverPlads(pool, type);
  if (!plads.ok) { await saet(plads.grund); return { ok: false, grund: plads.grund }; }
  try {
    const url = (process.env.INMOBILE_URL || 'https://api.inmobile.com/v4') + '/sms/outgoing';
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    let r;
    try {
      r = await fetch(url, {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', authorization: 'Basic ' + Buffer.from('x:' + key).toString('base64') },
        body: JSON.stringify({ messages: [{ to, text: tekst, from: AFSENDER, encoding: 'auto' }] }),
      });
    } finally { clearTimeout(t); }
    const b = (await r.text()).slice(0, 200);
    if (!r.ok) {
      if (r.status >= 400 && r.status < 500) {
        // inMobile afviste selve kaldet. 400/422 kan også være ét ugyldigt nummer, så den
        // modtager er endelig afvist. Alle andre 4xx (nøgle, rettigheder, grænse, forkert
        // adresse) er opsætning: rækken fjernes igen, så næste kørsel prøver på ny.
        // Begge dele stopper resten af kørslen. Test-sms beholder rækken som 'fejl'.
        console.error('[sms] inMobile afviste kaldet, HTTP', r.status);
        const modtagerfejl = r.status === 400 || r.status === 422;
        if (test || modtagerfejl) await saet(test ? 'fejl' : 'afvist', `HTTP ${r.status} ${b}`);
        else await pool.query('DELETE FROM sms_log WHERE id = $1', [id]);
        if (!modtagerfejl) await frigivPlads(pool, type);
        if (!test && [401, 403, 404].includes(r.status) && ++afvisteITraek >= AUTO_STOP_EFTER) {
          afvisteITraek = 0;
          await autoStop(pool);
        }
        return { ok: false, grund: 'konfig_afvist', status: r.status, stop: true };
      }
      await saet('fejl', `HTTP ${r.status} ${b}`);
      return { ok: false, grund: 'fejl', status: r.status };
    }
    afvisteITraek = 0;
    const afvist = afvistModtager(b);
    if (afvist) { await saet('afvist', afvist); return { ok: false, grund: 'afvist' }; }
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

function nulstilAutoStop() { afvisteITraek = 0; }

module.exports = { nulstilAutoStop, send, smsModtager, msisdn, cphTime, smsSlaaetFra, AFSENDER, MAX_PR_DAG };
