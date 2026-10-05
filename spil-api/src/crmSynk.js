'use strict';

// Sender Packrush-spillernes ja/nej til SmartPacks nyhedsmails videre til CRM'et.
// Læser samtykke-loggen (liste 'smartpack') i id-rækkefølge fra crm_synk.sidste_id:
//   bekraeftet      -> POST /api/v1/newsletter  (source packrush, newsletter true,
//                      den præcise tekst spilleren så, og tidspunktet)
//   trukket_tilbage -> POST /api/v1/newsletter/unsubscribe
// Uden SMARTPACK_CRM_KEY sker intet, og der fortsættes fra samme sted, når nøglen
// er lagt ind. Netværksfejl/5xx: stop og prøv igen næste gang. 4xx (fx ugyldig
// e-mail): log og spring rækken over, så køen ikke sidder fast.

const { sendTilCrm } = require('./crm');

const NAVN = 'samtykke_smartpack';
const SP_TEKST = 'Ja tak, SmartPack må sende mig nyheder på mail. Jeg kan altid afmelde mig igen.';
const nlUrl = () => process.env.SMARTPACK_CRM_URL || 'https://crm.smartpack.dk/api/v1/newsletter';

async function synkOnce(pool, max = 50) {
  if (!process.env.SMARTPACK_CRM_KEY) return { sendt: 0, stop: 'ingen nøgle' };
  const { rows: st } = await pool.query('SELECT sidste_id FROM crm_synk WHERE navn = $1', [NAVN]);
  let sidste = st.length ? Number(st[0].sidste_id) : 0;
  const { rows } = await pool.query(
    `SELECT s.id, s.type, s.tidspunkt, s.tekst, p.navn, p.email, p.telefon, p.firma
       FROM samtykke s LEFT JOIN spiller p ON p.id = s.spiller_id
      WHERE s.liste = 'smartpack' AND s.id > $1
      ORDER BY s.id LIMIT $2`,
    [sidste, max]
  );
  let sendt = 0;
  let stop = null;
  for (const r of rows) {
    if (r.email) {
      const body =
        r.type === 'trukket_tilbage'
          ? { email: r.email, source: 'packrush' }
          : {
              email: r.email,
              name: r.navn || undefined,
              phone: r.telefon || undefined,
              company: r.firma || undefined,
              source: 'packrush',
              newsletter: true,
              consentText: r.tekst || SP_TEKST,
              date: new Date(r.tidspunkt).toISOString(),
              notes: { packrush: 'Ja til SmartPacks nyhedsmails i Packrush' },
            };
      const url = r.type === 'trukket_tilbage' ? nlUrl() + '/unsubscribe' : nlUrl();
      const res = await sendTilCrm(body, url);
      if (!res.ok) {
        const midlertidig = !/^HTTP 4\d\d/.test(res.fejl || '') || /^HTTP 429/.test(res.fejl || '');
        await pool.query('UPDATE crm_synk SET seneste_fejl = $2, opdateret = now() WHERE navn = $1', [NAVN, res.fejl]);
        if (midlertidig) { stop = res.fejl; break; }
        console.error('[crm-synk] springer samtykke', r.id, 'over:', res.fejl);
      } else {
        sendt++;
      }
    }
    sidste = Number(r.id);
    await pool.query('UPDATE crm_synk SET sidste_id = $2, opdateret = now() WHERE navn = $1', [NAVN, sidste]);
  }
  if (!stop && rows.length) await pool.query('UPDATE crm_synk SET seneste_fejl = NULL WHERE navn = $1', [NAVN]);
  return { sendt, behandlet: rows.length, stop };
}

function startCrmSynk(pool, intervalMs = 60 * 1000) {
  let koerer = false;
  const tik = async () => {
    if (koerer) return;
    koerer = true;
    try {
      let r;
      do { r = await synkOnce(pool); } while (r.behandlet === 50 && !r.stop);
    } catch (e) {
      console.error('[crm-synk]', e.message);
    } finally {
      koerer = false;
    }
  };
  setTimeout(tik, 5000);
  return setInterval(tik, intervalMs);
}

module.exports = { synkOnce, startCrmSynk };
