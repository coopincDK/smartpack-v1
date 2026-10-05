'use strict';

// Videresendelse af tilmeldinger til SmartPacks CRM ("Salg -> Hjemmeside ->
// Nyhedsbreve tilmeldte"). Nøglen ligger KUN på serveren i miljøvariablen
// SMARTPACK_CRM_KEY (en spk_-nøgle med rettigheden Hjemmeside-formularer).
// Uden nøgle sendes intet, og rækken markeres med crm_fejl = 'ingen nøgle',
// så den kan sendes igen fra admin, når nøglen er lagt ind.

const crmUrl = () => process.env.SMARTPACK_CRM_URL || 'https://crm.smartpack.dk/api/v1/newsletter';
// Kontaktformularen har sin egen adresse i CRM'et. Udledes af nyhedsbrevs-adressen,
// så en test-URL (SMARTPACK_CRM_URL) også dækker den.
const crmKontaktUrl = () => crmUrl().replace(/\/newsletter$/, '/contact-form');
const TIMEOUT_MS = 8000;

// Den præcise tekst ved fluebenet for nyhedsmails på smartpack.dk/messe.
const MESSE_NYHEDSBREV_TEKST =
  'Ja tak til SmartPacks mailliste. Du kan afmelde dig igen med det samme, og der er et afmeld-link i hver mail.';

function kampagneTilCrm(r, kampagneNavn) {
  const notes = { kampagne: kampagneNavn, lodder_tilmelding: 10 };
  if (r.klub) notes.klub = r.klub;
  if (r.ordrer) notes.ordrer_pr_md = r.ordrer;
  if (r.hvor) notes.hvor_knaekker_det = r.hvor;
  const body = {
    email: r.email,
    name: r.navn,
    company: r.firma,
    source: r.kilde === 'ehandelskonferencen' ? 'messe' : r.kilde,
    newsletter: !!r.nyhedsbrev,
    notes,
  };
  if (r.telefon) body.phone = r.telefon;
  if (r.nyhedsbrev) body.consentText = MESSE_NYHEDSBREV_TEKST;
  if (r.kilde === 'ehandelskonferencen') notes.messe = 'E-handelskonferencen 2026';
  return body;
}

async function sendTilCrm(body, url = crmUrl()) {
  const key = process.env.SMARTPACK_CRM_KEY;
  if (!key) return { ok: false, fejl: 'ingen nøgle' };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    if (res.status === 200 || res.status === 201) return { ok: true };
    let msg = 'HTTP ' + res.status;
    try {
      const j = await res.json();
      if (j && j.error) msg += ': ' + String(j.error).slice(0, 200);
    } catch (e) {
      /* ignore */
    }
    return { ok: false, fejl: msg };
  } catch (e) {
    return { ok: false, fejl: e.name === 'AbortError' ? 'timeout' : String(e.message || e).slice(0, 200) };
  } finally {
    clearTimeout(t);
  }
}

// Sender én kampagnerække og gemmer resultatet på rækken.
async function synkKampagneRaekke(pool, id, kampagneNavn) {
  const { rows } = await pool.query('SELECT * FROM kampagne_tilmelding WHERE id = $1', [id]);
  if (!rows.length) return { ok: false, fejl: 'ikke fundet' };
  const res = await sendTilCrm(kampagneTilCrm(rows[0], kampagneNavn));
  await pool.query('UPDATE kampagne_tilmelding SET crm_sendt = $2, crm_fejl = $3 WHERE id = $1', [
    id,
    res.ok ? new Date() : null,
    res.ok ? null : res.fejl,
  ]);
  return res;
}

module.exports = { sendTilCrm, crmKontaktUrl, kampagneTilCrm, synkKampagneRaekke, MESSE_NYHEDSBREV_TEKST };
