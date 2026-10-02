'use strict';

// Præmiekonkurrencen (deltagervilkår /spil/vilkaar/, pkt. 2 og 5-7):
//  - kun firmaer på Dansk Erhvervs deltagerliste kan vinde
//  - kun godkendte spil gennemført i spilperioden tæller
//  - firmaet får 1 lod pr. PÅBEGYNDTE `point_pr_lod` point i firmaets BEDSTE
//    spil (fx 2.986 point = 6 lodder med 500 point pr. lod)
//  - vinderen trækkes tilfældigt blandt alle lodder (crypto.randomInt), og
//    hele grundlaget gemmes i konkurrence_traekning.

const crypto = require('crypto');
const { firmKey } = require('./rules/firmKey');

// Nøgle til at matche firmaer mod deltagerlisten. Som firmKey(), men "A/S"
// og "I/S" fjernes FØRST: firmKey() fjerner alt efter første "/" (for at
// klare webadresser), så "MinShop A/S" ellers blev til "minshopa".
function matchNoegle(s) {
  return firmKey(String(s || '').replace(/(^|\s)(a\/s|i\/s)(?=\s|$|[.,])/gi, ' '));
}

function lodderFor(bedste, pointPrLod) {
  const b = Number(bedste) || 0;
  if (b <= 0) return 0;
  return Math.ceil(b / pointPrLod);
}

function udelukkedeNoegler(k) {
  return new Set(
    String((k && k.udelukkede_firmaer) || '')
      .split(',')
      .map((s) => matchNoegle(s))
      .filter(Boolean)
  );
}

async function hentKonkurrence(db) {
  const { rows } = await db.query('SELECT * FROM konkurrence WHERE id = 1');
  return rows[0];
}

async function deltagerNoegler(db) {
  const { rows } = await db.query('SELECT firma, firma_noegle FROM deltagerliste_firma');
  return new Map(rows.map((r) => [r.firma_noegle, r.firma]));
}

// Grundlaget for lodtrækningen lige nu. Returnerer ALLE firmaer, der har
// spillet i perioden, med markering af om de kan vinde, så standen kan se,
// hvem der mangler på listen (fx et firma, der har stavet navnet anderledes).
async function beregnLodder(db) {
  const k = await hentKonkurrence(db);
  if (!k || !k.spil_start || !k.spil_slut) {
    return { konkurrence: k, firmaer: [], kan_vinde: [], lodder_i_alt: 0, deltagerliste_antal: 0 };
  }
  const pointPrLod = k.point_pr_lod || 500;
  const liste = await deltagerNoegler(db);
  const udelukket = udelukkedeNoegler(k);

  // Bedste godkendte spil pr. spiller i perioden. Samles til firma i JS.
  const { rows } = await db.query(
    `SELECT s.id AS spiller_id, s.navn, s.email, s.firma, s.firma_noegle, f.samlet, f.oprettet
     FROM forsoeg f JOIN spiller s ON s.id = f.spiller_id
     WHERE f.status = 'godkendt'
       AND f.samlet IS NOT NULL
       AND COALESCE(f.slut_server, f.oprettet) >= $1
       AND COALESCE(f.slut_server, f.oprettet) <= $2
       AND s.skjult = false`,
    [k.spil_start, k.spil_slut]
  );

  const pr = new Map();
  for (const r of rows) {
    const noegle = matchNoegle(r.firma);
    if (!noegle) continue; // spillere uden firma kan ikke vinde for et firma
    const cur = pr.get(noegle);
    if (!cur || r.samlet > cur.bedste) {
      pr.set(noegle, {
        firma_noegle: noegle,
        firma: r.firma,
        bedste: r.samlet,
        spiller_id: r.spiller_id,
        spiller_navn: r.navn,
        spiller_email: r.email,
      });
    }
  }

  const firmaer = [...pr.values()]
    .map((f) => {
      const paaListe = liste.has(f.firma_noegle);
      const udel = udelukket.has(f.firma_noegle);
      return {
        ...f,
        paa_deltagerliste: paaListe,
        deltagerliste_navn: paaListe ? liste.get(f.firma_noegle) : null,
        udelukket: udel,
        kan_vinde: paaListe && !udel,
        lodder: lodderFor(f.bedste, pointPrLod),
      };
    })
    .sort((a, b) => b.bedste - a.bedste || a.firma_noegle.localeCompare(b.firma_noegle));

  const kanVinde = firmaer.filter((f) => f.kan_vinde && f.lodder > 0);
  return {
    konkurrence: k,
    firmaer,
    kan_vinde: kanVinde,
    lodder_i_alt: kanVinde.reduce((a, f) => a + f.lodder, 0),
    deltagerliste_antal: liste.size,
  };
}

// Vælger vinderen ud fra et tal i [0, lodderIAlt). Ren funktion, så den kan
// testes og bruges til at genskabe en gemt trækning.
function vinderFraTal(kanVinde, tal) {
  let x = tal;
  for (const f of kanVinde) {
    if (x < f.lodder) return f;
    x -= f.lodder;
  }
  return null;
}

async function traekVinder(pool, adminSessionId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const g = await beregnLodder(client);
    if (!g.lodder_i_alt) {
      await client.query('ROLLBACK');
      return null;
    }
    const tal = crypto.randomInt(0, g.lodder_i_alt);
    const vinder = vinderFraTal(g.kan_vinde, tal);
    let fra = 0;
    const grundlag = g.kan_vinde.map((f) => {
      const linje = { firma: f.firma, firma_noegle: f.firma_noegle, bedste: f.bedste, lodder: f.lodder, fra, til: fra + f.lodder - 1 };
      fra += f.lodder;
      return linje;
    });
    const { rows } = await client.query(
      `INSERT INTO konkurrence_traekning (
         admin_session_id, spil_start, spil_slut, point_pr_lod, deltagerliste_antal, grundlag,
         lodder_i_alt, tilfaeldigt_tal, vinder_firma, vinder_firma_noegle,
         vinder_spiller_id, vinder_navn_snapshot, vinder_email_snapshot
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id, tidspunkt`,
      [
        adminSessionId || null,
        g.konkurrence.spil_start,
        g.konkurrence.spil_slut,
        g.konkurrence.point_pr_lod,
        g.deltagerliste_antal,
        JSON.stringify(grundlag),
        g.lodder_i_alt,
        tal,
        vinder.deltagerliste_navn || vinder.firma,
        vinder.firma_noegle,
        vinder.spiller_id,
        vinder.spiller_navn,
        vinder.spiller_email,
      ]
    );
    await client.query('COMMIT');
    return {
      id: rows[0].id,
      tidspunkt: rows[0].tidspunkt,
      lodder_i_alt: g.lodder_i_alt,
      tilfaeldigt_tal: tal,
      firmaer_med_lodder: grundlag.length,
      vinder: {
        firma: vinder.deltagerliste_navn || vinder.firma,
        bedste: vinder.bedste,
        lodder: vinder.lodder,
        spiller_navn: vinder.spiller_navn,
        spiller_email: vinder.spiller_email,
      },
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Parser en indsat deltagerliste: én linje pr. række. Er der tabulatorer
// (kopieret fra Google Sheets med flere kolonner), bruges kolonnen `kolonne`
// (0-baseret). En evt. overskrift "firma"/"company" springes over.
function parseDeltagerliste(tekst, kolonne) {
  const ud = new Map();
  for (const linje of String(tekst || '').split(/\r?\n/)) {
    const felter = linje.includes('\t') ? linje.split('\t') : [linje];
    const firma = String(felter[kolonne || 0] || felter[0] || '').trim().slice(0, 200);
    if (!firma) continue;
    if (/^(firma|virksomhed|company|organisation)$/i.test(firma)) continue;
    const noegle = matchNoegle(firma);
    if (!noegle) continue;
    if (!ud.has(noegle)) ud.set(noegle, firma);
  }
  return ud;
}

// Tjekliste før konkurrencen: alt der mangler, samlet ét sted, så standen
// kan se det i admin. niveau 'fejl' = konkurrencen virker ikke som lovet i
// vilkårene; 'advarsel' = bør ordnes.
const PARTNERFRIST = new Date('2026-10-06T12:00:00+02:00');

async function konkurrenceStatus(db, now) {
  const P = require('./partners');
  const nu = now || new Date();
  const ud = [];
  const k = await hentKonkurrence(db);
  if (!k || !k.spil_start || !k.spil_slut) ud.push({ niveau: 'fejl', tekst: 'Spilperioden er ikke sat.' });
  if (!k || !k.lodtraekning) ud.push({ niveau: 'fejl', tekst: 'Tidspunktet for lodtrækningen er ikke sat.' });

  const dl = await db.query('SELECT count(*)::int AS n FROM deltagerliste_firma');
  if (!dl.rows[0].n) ud.push({ niveau: 'fejl', tekst: 'Deltagerlisten er tom. Ingen kan vinde, før den er indlæst.' });

  const { rows: partnere } = await db.query(
    `SELECT p.*,
       (SELECT count(*)::int FROM partner_bruger b WHERE b.partner_id = p.id) AS antal_logins,
       (SELECT max(tidspunkt) FROM partner_accept a WHERE a.partner_id = p.id AND a.vilkaar_version = $1) AS accepteret
     FROM partner p WHERE p.status IN ('aktiv', 'ansoegt') ORDER BY p.navn`,
    [P.PARTNERVILKAAR_VERSION]
  );
  const aktive = partnere.filter((p) => p.status === 'aktiv');
  const synlige = aktive.filter((p) => P.erSynlig(p));
  if (!synlige.length) ud.push({ niveau: 'fejl', tekst: 'Ingen partnere vises i spillet endnu.' });
  const medGave = synlige.filter((p) => p.giver_praemie && !P.manglerPraemie(p).length);
  if (!medGave.length) ud.push({ niveau: 'fejl', tekst: 'Præmiepuljen er tom: ingen partner har en færdig gave.' });

  const efterFrist = nu.getTime() > PARTNERFRIST.getTime();
  for (const p of partnere) {
    const navn = p.navn;
    const slug = p.slug;
    if (p.status === 'ansoegt') {
      ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Har søgt om at blive partner og venter på dit svar.' });
      continue;
    }
    const mp = P.manglerProfil(p);
    if (mp.length) ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Mangler: ' + mp.join(', ') + '. Vises ikke i spillet.' });
    if (p.giver_praemie) {
      const mg = P.manglerPraemie(p);
      if (mg.length) ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Gaven mangler: ' + mg.join(', ') + '. Kommer ikke med i puljen.' });
    }
    if (!mp.length && !p.powerup) ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Ingen power-up valgt.' });
    if (!mp.length && !p.vist_i_spil) ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Alt er udfyldt, men "Vis i spillet" er ikke slået til.' });
    if (!p.antal_logins) ud.push({ niveau: 'advarsel', partner: navn, slug, tekst: 'Har intet login til partnerportalen endnu.' });
    if (!p.accepteret) {
      ud.push({
        niveau: efterFrist ? 'fejl' : 'advarsel',
        partner: navn, slug,
        tekst: 'Har ikke godkendt partnervilkårene' + (efterFrist ? ', og fristen 6/10 kl. 12 er overskredet.' : ' (frist 6/10 kl. 12).'),
      });
    }
  }
  return {
    advarsler: ud,
    antal_fejl: ud.filter((x) => x.niveau === 'fejl').length,
    synlige_partnere: synlige.length,
    gaver_i_puljen: medGave.length,
    deltagerliste_antal: dl.rows[0].n,
  };
}

module.exports = { konkurrenceStatus, matchNoegle, lodderFor, beregnLodder, traekVinder, vinderFraTal, parseDeltagerliste, hentKonkurrence };
