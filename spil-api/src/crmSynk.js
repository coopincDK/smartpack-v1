'use strict';

// Sender Packrush-spillernes ja/nej til SmartPacks nyhedsmails videre til CRM'et.
// To kilder, i denne rækkefølge:
//   1. crm_udbakke: afmeldinger for slettede spillere (lagt der af
//      src/playerDeletion.js i samme transaktion som sletningen) ->
//      POST /api/v1/newsletter/unsubscribe. Rækken slettes, når CRM'et har svaret ok.
//   2. samtykke-loggen (liste 'smartpack'): hver række har sin egen status
//      (samtykke.crm_synk_status), så en række, der først bliver synlig efter en
//      senere én, ikke kan blive sprunget over for altid.
//        bekraeftet      -> POST /api/v1/newsletter (source packrush, newsletter true,
//                           den præcise tekst spilleren så, og tidspunktet)
//        trukket_tilbage -> POST /api/v1/newsletter/unsubscribe
//      Der sendes kun ved en reel statusændring (tilmeldt <-> afmeldt); dagens
//      flueben, der gentager et ja, giver intet nyt kald.
// Uden SMARTPACK_CRM_KEY sker intet, og der fortsættes derfra, når nøglen er lagt ind.
//
// Fejl: kun en reel valideringsfejl for den enkelte række (400/422 med en
// fejltekst) springer rækken over. Alt andet (401/403/404, 5xx, netværk) stopper
// synkroniseringen, rykker intet og prøves igen næste gang. Springes
// MAKS_SPRUNGET rækker over i samme kørsel, stopper den også, for så er det
// sandsynligvis opsætningen, ikke rækkerne. De afviste rækker markeres først, når
// kørslen slutter uden stop, så et stop aldrig lader dem forsvinde.

const { sendTilCrm } = require('./crm');

const NAVN = 'samtykke_smartpack';
const SP_TEKST = 'Ja tak, SmartPack må sende mig nyheder på mail. Jeg kan altid afmelde mig igen.';
const MAKS_SPRUNGET = 5;
const nlUrl = () => process.env.SMARTPACK_CRM_URL || 'https://crm.smartpack.dk/api/v1/newsletter';

// Tydelig fejl i loggen: aldrig persondata og aldrig nøglen.
function loegStop(res) {
  if (res.status === 401 || res.status === 403) {
    console.error(
      `[crm-synk] STOP: CRM'et afviste nøglen (HTTP ${res.status}). Tjek SMARTPACK_CRM_KEY og at nøglen har rettigheden Hjemmeside-formularer. Intet er sprunget over.`
    );
  } else if (res.status === 404) {
    console.error("[crm-synk] STOP: CRM'et svarede HTTP 404. Tjek SMARTPACK_CRM_URL. Intet er sprunget over.");
  } else {
    console.error('[crm-synk] STOP: ' + (res.status ? 'HTTP ' + res.status : res.fejl) + '. Prøver igen næste gang.');
  }
}

async function synkOnce(pool, max = 50) {
  if (!process.env.SMARTPACK_CRM_KEY) return { sendt: 0, behandlet: 0, stop: 'ingen nøgle' };
  let sendt = 0;
  let behandlet = 0;
  let sprunget = 0;
  let stop = null;
  const afvistUd = [];
  const afvistSamtykke = [];

  const stopMed = async (res) => {
    stop = res.fejl;
    await pool.query('UPDATE crm_synk SET seneste_fejl = $2, opdateret = now() WHERE navn = $1', [NAVN, res.fejl]);
    loegStop(res);
  };

  const { rows: udbakke } = await pool.query('SELECT id, email FROM crm_udbakke ORDER BY id LIMIT $1', [max]);
  for (const r of udbakke) {
    const res = await sendTilCrm({ email: r.email, source: 'packrush' }, nlUrl() + '/unsubscribe');
    if (!res.ok && !res.raekkefejl) {
      await stopMed(res);
      break;
    }
    if (!res.ok) {
      console.error('[crm-synk] springer afmelding i udbakken over, id=' + r.id + ' (HTTP ' + res.status + ')');
      sprunget++;
      afvistUd.push(r.id);
    } else {
      sendt++;
      await pool.query('DELETE FROM crm_udbakke WHERE id = $1', [r.id]);
    }
    behandlet++;
    if (sprunget >= MAKS_SPRUNGET) {
      await stopMed({ fejl: 'for mange afviste rækker i samme kørsel', status: null });
      break;
    }
  }

  if (!stop) {
    const { rows } = await pool.query(
      `SELECT s.id, s.type, s.tidspunkt, s.tekst, p.navn, p.email, p.firma,
              (SELECT q.type FROM samtykke q
                WHERE q.spiller_id = s.spiller_id AND q.liste = s.liste
                  AND (q.tidspunkt, q.id) < (s.tidspunkt, s.id)
                ORDER BY q.tidspunkt DESC, q.id DESC LIMIT 1) AS forrige_type
         FROM samtykke s LEFT JOIN spiller p ON p.id = s.spiller_id
        WHERE s.liste = 'smartpack' AND s.crm_synk_status IS NULL
        ORDER BY s.id LIMIT $1`,
      [max]
    );
    const marker = (id, status) =>
      pool.query('UPDATE samtykke SET crm_synk_status = $2 WHERE id = $1', [id, status]);
    for (const r of rows) {
      // Ingen statusændring (ja efter ja, eller afmelding uden et forudgående ja),
      // eller spilleren er væk: intet at sende.
      const uaendret = r.type === 'bekraeftet' ? r.forrige_type === 'bekraeftet' : r.forrige_type !== 'bekraeftet';
      if (!r.email || uaendret) {
        await marker(r.id, 'sprunget');
        behandlet++;
        continue;
      }
      const body =
        r.type === 'trukket_tilbage'
          ? { email: r.email, source: 'packrush' }
          : {
              email: r.email,
              name: r.navn || undefined,
              company: r.firma || undefined,
              source: 'packrush',
              newsletter: true,
              consentText: r.tekst || SP_TEKST,
              date: new Date(r.tidspunkt).toISOString(),
              notes: { packrush: 'Ja til SmartPacks nyhedsmails i Packrush' },
            };
      const url = r.type === 'trukket_tilbage' ? nlUrl() + '/unsubscribe' : nlUrl();
      const res = await sendTilCrm(body, url);
      if (!res.ok && !res.raekkefejl) {
        await stopMed(res);
        break;
      }
      if (!res.ok) {
        console.error('[crm-synk] springer samtykke id=' + r.id + ' over (HTTP ' + res.status + ')');
        sprunget++;
        afvistSamtykke.push(r.id);
      } else {
        sendt++;
        await marker(r.id, 'sendt');
      }
      behandlet++;
      if (sprunget >= MAKS_SPRUNGET) {
        await stopMed({ fejl: 'for mange afviste rækker i samme kørsel', status: null });
        break;
      }
    }
  }
  if (!stop) {
    for (const id of afvistUd) await pool.query('DELETE FROM crm_udbakke WHERE id = $1', [id]);
    for (const id of afvistSamtykke) {
      await pool.query("UPDATE samtykke SET crm_synk_status = 'sprunget' WHERE id = $1", [id]);
    }
  }
  if (!stop && behandlet) await pool.query('UPDATE crm_synk SET seneste_fejl = NULL WHERE navn = $1', [NAVN]);
  return { sendt, behandlet, stop };
}

function startCrmSynk(pool, intervalMs = 60 * 1000) {
  let koerer = false;
  const tik = async () => {
    if (koerer) return;
    koerer = true;
    try {
      let r;
      do { r = await synkOnce(pool); } while (r.behandlet > 0 && !r.stop);
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
