'use strict';

// Sender Packrush-spillernes ja/nej til SmartPacks nyhedsmails videre til CRM'et.
// To kilder, i denne rækkefølge:
//   1. crm_udbakke: afmeldinger for slettede spillere (lagt der af
//      src/playerDeletion.js i samme transaktion som sletningen) ->
//      POST /api/v1/newsletter/unsubscribe. Rækken slettes, når CRM'et har svaret.
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
// Fejl, pr. kald:
//   - 200/201: færdig.
//   - 404/409 på en afmelding: kontakten findes ikke, eller er allerede afmeldt.
//     Færdig (logges med række-id).
//   - 400/409/413/422: CRM'et afviser netop den række. Tæl et forsøg og vent
//     (FORSOEG_VENT_MIN); efter MAKS_FORSOEG forsøg springes rækken over. Rækker
//     bagved sendes imens videre, så ingen række kan holde jobbet fast.
//   - alt andet (401/403/404, 429, 5xx, netværk): opsætning eller nedetid. Stop,
//     ryk intet, prøv igen næste gang.
// Afvises MAKS_AFVIST rækker i samme kørsel, er det nok opsætningen: jobbet holder
// pause i PAUSE_MIN minutter og logger en alarm.

const { sendTilCrm } = require('./crm');

const NAVN = 'samtykke_smartpack';
const SP_TEKST = 'Ja tak, SmartPack må sende mig nyheder på mail. Jeg kan altid afmelde mig igen.';
const MAKS_FORSOEG = 3;
const FORSOEG_VENT_MIN = [15, 60]; // ventetid efter 1. og 2. afvisning
const MAKS_AFVIST = 5;
const PAUSE_MIN = 10;
const MAKS_UDEN_KONTAKT = 3;
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

function afgoer(res, erAfmelding) {
  if (res.ok) return 'ok';
  if (erAfmelding && (res.status === 404 || res.status === 409)) return 'uden_kontakt';
  if ([400, 409, 413, 422].includes(res.status)) return 'afvist';
  return 'stop';
}

async function synkOnce(pool, max = 50) {
  if (!process.env.SMARTPACK_CRM_KEY) return { sendt: 0, behandlet: 0, stop: 'ingen nøgle' };
  const { rows: st } = await pool.query('SELECT pause_til > now() AS pause FROM crm_synk WHERE navn = $1', [NAVN]);
  if (st.length && st[0].pause) return { sendt: 0, behandlet: 0, stop: 'pause' };

  let sendt = 0;
  let behandlet = 0;
  let afvist = 0;
  let stop = null;

  const stopMed = async (res) => {
    stop = res.fejl;
    await pool.query('UPDATE crm_synk SET seneste_fejl = $2, opdateret = now() WHERE navn = $1', [NAVN, res.fejl]);
    loegStop(res);
  };

  // Tæller en afvisning og sætter ventetid. Returnerer true, når rækken skal opgives.
  const registrerAfvisning = async (tabel, id, res) => {
    const { rows } = await pool.query(
      `UPDATE ${tabel} SET crm_forsoeg = COALESCE(crm_forsoeg, 0) + 1 WHERE id = $1 RETURNING crm_forsoeg`,
      [id]
    );
    const n = rows[0].crm_forsoeg;
    afvist++;
    await pool.query('UPDATE crm_synk SET seneste_fejl = $2, opdateret = now() WHERE navn = $1', [NAVN, 'HTTP ' + res.status]);
    if (n >= MAKS_FORSOEG) {
      console.error(`[crm-synk] giver op på ${tabel} id=${id} efter ${n} afvisninger (HTTP ${res.status})`);
      return true;
    }
    await pool.query(`UPDATE ${tabel} SET crm_naeste_forsoeg = now() + make_interval(mins => $2) WHERE id = $1`, [
      id,
      FORSOEG_VENT_MIN[Math.min(n, FORSOEG_VENT_MIN.length) - 1],
    ]);
    console.error(`[crm-synk] ${tabel} id=${id} afvist af CRM'et (HTTP ${res.status}), forsøg ${n} af ${MAKS_FORSOEG}`);
    return false;
  };

  const tjekAfvist = async () => {
    if (afvist < MAKS_AFVIST) return false;
    stop = 'for mange afviste rækker i samme kørsel';
    await pool.query(
      'UPDATE crm_synk SET pause_til = now() + make_interval(mins => $2), seneste_fejl = $3, opdateret = now() WHERE navn = $1',
      [NAVN, PAUSE_MIN, stop]
    );
    console.error(
      `[crm-synk] ALARM: ${afvist} rækker afvist af CRM'et i samme kørsel. Holder pause i ${PAUSE_MIN} min. Tjek SMARTPACK_CRM_URL og CRM'ets valideringsregler.`
    );
    return true;
  };

  const { rows: udbakke } = await pool.query(
    `SELECT id, email FROM crm_udbakke
      WHERE crm_naeste_forsoeg IS NULL OR crm_naeste_forsoeg <= now()
      ORDER BY id LIMIT $1`,
    [max]
  );
  const udenKontakt = []; // positive id'er = udbakke, negative = samtykke
  for (const r of udbakke) {
    const res = await sendTilCrm({ email: r.email, source: 'packrush' }, nlUrl() + '/unsubscribe');
    const udfald = afgoer(res, true);
    if (udfald === 'stop') {
      await stopMed(res);
      break;
    }
    if (udfald === 'afvist') {
      if (await registrerAfvisning('crm_udbakke', r.id, res)) {
        await pool.query('DELETE FROM crm_udbakke WHERE id = $1', [r.id]);
        behandlet++;
      }
      if (await tjekAfvist()) break;
      continue;
    }
    if (udfald === 'uden_kontakt') {
      console.error(`[crm-synk] afmelding i udbakken id=${r.id}: kontakten findes ikke eller er allerede afmeldt (HTTP ${res.status})`);
      udenKontakt.push(r.id);
    } else {
      sendt++;
      await pool.query('DELETE FROM crm_udbakke WHERE id = $1', [r.id]);
    }
    behandlet++;
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
          AND (s.crm_naeste_forsoeg IS NULL OR s.crm_naeste_forsoeg <= now())
        ORDER BY s.id LIMIT $1`,
      [max]
    );
    const marker = (id, status) => pool.query('UPDATE samtykke SET crm_synk_status = $2 WHERE id = $1', [id, status]);
    for (const r of rows) {
      // Ingen statusændring (ja efter ja, eller afmelding uden et forudgående ja),
      // eller spilleren er væk: intet at sende.
      const uaendret = r.type === 'bekraeftet' ? r.forrige_type === 'bekraeftet' : r.forrige_type !== 'bekraeftet';
      if (!r.email || uaendret) {
        await marker(r.id, 'sprunget');
        behandlet++;
        continue;
      }
      const erAfmelding = r.type === 'trukket_tilbage';
      const body = erAfmelding
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
      const res = await sendTilCrm(body, erAfmelding ? nlUrl() + '/unsubscribe' : nlUrl());
      const udfald = afgoer(res, erAfmelding);
      if (udfald === 'stop') {
        await stopMed(res);
        break;
      }
      if (udfald === 'afvist') {
        if (await registrerAfvisning('samtykke', r.id, res)) {
          await marker(r.id, 'sprunget');
          behandlet++;
        }
        if (await tjekAfvist()) break;
        continue;
      }
      if (udfald === 'uden_kontakt') {
        console.error(`[crm-synk] afmelding samtykke id=${r.id}: kontakten findes ikke eller er allerede afmeldt (HTTP ${res.status})`);
        udenKontakt.push(-r.id);
      } else {
        sendt++;
        // Blev spilleren slettet, mens ja'et var på vej (rækken er væk, så opdateringen
        // rammer intet), kender CRM'et nu en kontakt, ingen længere afmelder: læg en
        // afmelding i udbakken med det samme. Opdateringen venter på en slettende
        // transaktions rækkelås, så de to kan ikke krydse hinanden (se playerDeletion.js).
        const { rowCount } = await marker(r.id, 'sendt');
        if (rowCount === 0 && !erAfmelding) {
          await pool.query("INSERT INTO crm_udbakke (email, type) VALUES ($1, 'afmeld')", [r.email]);
        }
      }
      behandlet++;
    }
  }

  // Afmeldinger, CRM'et ikke kender, afsluttes først her, og kun hvis det ikke er
  // ALLE afmeldinger i kørslen (så en forkert URL, der giver 404 på alt, ikke lader
  // afmeldinger forsvinde).
  if (!stop && udenKontakt.length >= MAKS_UDEN_KONTAKT && sendt === 0) {
    await stopMed({ fejl: 'HTTP 404/409 på alle afmeldinger', status: 404 });
  }
  if (!stop) {
    for (const id of udenKontakt) {
      if (id > 0) await pool.query('DELETE FROM crm_udbakke WHERE id = $1', [id]);
      else await pool.query("UPDATE samtykke SET crm_synk_status = 'sendt' WHERE id = $1", [-id]);
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
