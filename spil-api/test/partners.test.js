'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  return raw ? raw.split(';')[0] : null;
}

async function adminCookie(h) {
  const r = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  assert.equal(r.status, 200);
  return cookieFra(r);
}

const GAVE_FELTER = { praemie_indloesning: 'Vinderen skriver til os', praemie_sidste_frist: '2027-06-30' };

const FULD_PROFIL = {
  firmanavn: 'Herodesk ApS',
  hjemmeside: 'herodesk.dk',
  kort_beskrivelse: 'AI-agent til kundeservice',
  cvr: '12345678',
  produktkategori: 'kundeservice-software',
  privatlivspolitik: 'herodesk.dk/privatliv',
};

test('admin opretter, retter og viser en partner; offentlig liste kræver vist_i_spil og udfyldt profil', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const uden = await api(h.baseUrl, 'GET', '/admin/partnere');
  assert.equal(uden.status, 401);

  const opret = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Herodesk' } });
  assert.equal(opret.status, 201);
  const p = opret.body.partner;
  assert.equal(p.slug, 'herodesk');
  assert.equal(p.status, 'aktiv');
  assert.equal(p.synlig, false);
  assert.deepEqual(p.mangler_profil, ['firmanavn', 'hjemmeside', 'kort_beskrivelse', 'cvr', 'produktkategori', 'privatlivspolitik']);

  // Ikke synlig endnu.
  let pub = await api(h.baseUrl, 'GET', '/partnere');
  assert.equal(pub.body.partnere.length, 0);

  const ret = await api(h.baseUrl, 'PUT', '/admin/partnere/' + p.id, {
    adminCookie: ac,
    body: { ...FULD_PROFIL, powerup: 'herodesk', vist_i_spil: true },
  });
  assert.equal(ret.status, 200);
  assert.equal(ret.body.partner.hjemmeside, 'https://herodesk.dk/');
  assert.equal(ret.body.partner.synlig, true);

  pub = await api(h.baseUrl, 'GET', '/partnere');
  assert.equal(pub.body.partnere.length, 1);
  assert.equal(pub.body.partnere[0].powerup, 'herodesk');
  assert.equal(pub.body.partnere[0].kontakt_email, undefined, 'kontaktdata må ikke være offentlige');

  // Ugyldig power-up og ugyldig hjemmeside afvises.
  const bad = await api(h.baseUrl, 'PUT', '/admin/partnere/' + p.id, { adminCookie: ac, body: { powerup: 'nope' } });
  assert.equal(bad.status, 400);
  const bad2 = await api(h.baseUrl, 'PUT', '/admin/partnere/' + p.id, { adminCookie: ac, body: { hjemmeside: 'javascript:alert(1)' } });
  assert.equal(bad2.status, 400);

  // Navn kan rettes, men slug ligger fast.
  const nyNavn = await api(h.baseUrl, 'PUT', '/admin/partnere/' + p.id, { adminCookie: ac, body: { navn: 'Herodesk AI' } });
  assert.equal(nyNavn.body.partner.slug, 'herodesk');
});

test('præmieoversigt: sorteret efter værdi, "op til" kræver betingelser, konkurrencetekst skifter efter datoen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  async function partnerMedPraemie(navn, praemie) {
    const r = await api(h.baseUrl, 'POST', '/admin/partnere', {
      adminCookie: ac,
      body: { navn, ...FULD_PROFIL, vist_i_spil: true, giver_praemie: true, ...praemie },
    });
    assert.equal(r.status, 201);
    return r.body.partner;
  }

  await partnerMedPraemie('Lille', { praemie_titel: 'Kaffe', praemie_vaerdi: 500, praemie_beskrivelse: 'En pose kaffe', ...GAVE_FELTER });
  const stor = await partnerMedPraemie('Stor', {
    praemie_titel: 'Onlinekursus',
    praemie_vaerdi: '24.000',
    praemie_vaerdi_type: 'op_til',
    praemie_beskrivelse: 'Et års kursus',
    ...GAVE_FELTER,
  });
  assert.equal(stor.praemie_vaerdi, 24000);
  assert.deepEqual(stor.mangler_praemie, ['praemie_betingelser']);

  let pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.praemier.length, 1, '"op til" uden betingelser vises ikke');

  await api(h.baseUrl, 'PUT', '/admin/partnere/' + stor.id, {
    adminCookie: ac,
    body: { praemie_betingelser: '2.000 kr. pr. måned i op til et år. Stopper forløbet før, betales resten ikke.' },
  });
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.deepEqual(pr.body.praemier.map((p) => p.navn), ['Stor', 'Lille']);
  assert.equal(pr.body.samlet_vaerdi, 24500);
  assert.equal(pr.body.samlet_indeholder_op_til, true);

  // 012_konkurrence_lodtraekning.sql sætter lodtrækningen til 8/10 2026 kl. 16.45.
  const { rows: kk } = await h.pool.query('SELECT lodtraekning FROM konkurrence WHERE id = 1');
  assert.equal(new Date(kk[0].lodtraekning).toISOString(), '2026-10-08T14:45:00.000Z');
  // Ingen dato = ingen aktiv konkurrence.
  await h.pool.query('UPDATE konkurrence SET lodtraekning = NULL WHERE id = 1');
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.aktiv, false);
  const fremtid = new Date(Date.now() + 86400000).toISOString();
  await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'Messen', lodtraekning: fremtid, tekst_aktiv: 'Vinderen trækkes fredag', tekst_slut: 'Næste gang ses vi til X' },
  });
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.aktiv, true);
  assert.equal(pr.body.konkurrence.tekst, 'Vinderen trækkes fredag');

  await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'Messen', lodtraekning: new Date(Date.now() - 1000).toISOString(), tekst_aktiv: 'a', tekst_slut: 'Næste gang ses vi til X' },
  });
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.equal(pr.body.konkurrence.aktiv, false);
  assert.equal(pr.body.konkurrence.tekst, 'Næste gang ses vi til X');
  assert.equal(pr.body.konkurrence.vinder, null);

  await api(h.baseUrl, 'PUT', '/admin/konkurrence', {
    adminCookie: ac,
    body: { navn: 'Messen', tekst_slut: 'Slut', vinder_navn: 'Mette Hansen', vinder_firma: 'Webshop ApS', vinder_dato: '2026-10-08', vinder_tekst: 'Tillykke!' },
  });
  pr = await api(h.baseUrl, 'GET', '/praemier');
  assert.deepEqual(pr.body.konkurrence.vinder, { navn: 'Mette Hansen', firma: 'Webshop ApS', dato: '2026-10-08', tekst: 'Tillykke!' });
  const forkertDato = await api(h.baseUrl, 'PUT', '/admin/konkurrence', { adminCookie: ac, body: { navn: 'x', vinder_dato: '8/10' } });
  assert.equal(forkertDato.status, 400);
});

test('partnerbruger: startkode skal skiftes, ser kun egen partner, kan ikke rette status eller power-up', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const a = (await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Alfa' } })).body.partner;
  const b = (await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Beta' } })).body.partner;

  const kort = await api(h.baseUrl, 'POST', `/admin/partnere/${a.id}/brugere`, {
    adminCookie: ac,
    body: { email: 'Anna@Alfa.dk', kode: 'kort' },
  });
  assert.equal(kort.status, 400);
  const bruger = await api(h.baseUrl, 'POST', `/admin/partnere/${a.id}/brugere`, {
    adminCookie: ac,
    body: { email: 'Anna@Alfa.dk', navn: 'Anna', kode: 'startkode-123' },
  });
  assert.equal(bruger.status, 201);
  const dublet = await api(h.baseUrl, 'POST', `/admin/partnere/${b.id}/brugere`, {
    adminCookie: ac,
    body: { email: 'anna@alfa.dk', kode: 'startkode-123' },
  });
  assert.equal(dublet.status, 400);

  const forkert = await api(h.baseUrl, 'POST', '/partner/login', { body: { email: 'anna@alfa.dk', kode: 'forkert-kode' } });
  assert.equal(forkert.status, 401);
  const login = await api(h.baseUrl, 'POST', '/partner/login', { body: { email: 'anna@alfa.dk', kode: 'startkode-123' } });
  assert.equal(login.status, 200);
  assert.equal(login.body.skal_skifte_kode, true);
  const pc = login.headers.get('set-cookie').split(';')[0];

  // Før kodeskift: kan ikke rette noget.
  const for1 = await api(h.baseUrl, 'PUT', '/partner/mig', { adminCookie: pc, body: { firmanavn: 'X' } });
  assert.equal(for1.status, 403);
  const mig0 = await api(h.baseUrl, 'GET', '/partner/mig', { adminCookie: pc });
  assert.equal(mig0.body.bruger.skal_skifte_kode, true);

  const samme = await api(h.baseUrl, 'POST', '/partner/skift-kode', { adminCookie: pc, body: { gammel: 'startkode-123', ny: 'startkode-123' } });
  assert.equal(samme.status, 400);
  const skift = await api(h.baseUrl, 'POST', '/partner/skift-kode', { adminCookie: pc, body: { gammel: 'startkode-123', ny: 'min-egen-kode-456' } });
  assert.equal(skift.status, 200);

  const ret = await api(h.baseUrl, 'PUT', '/partner/mig', {
    adminCookie: pc,
    body: { firmanavn: 'Alfa ApS', status: 'arkiveret', vist_i_spil: true, powerup: 'sprii', navn: 'Hacket' },
  });
  assert.equal(ret.status, 200);
  assert.equal(ret.body.partner.firmanavn, 'Alfa ApS');
  assert.equal(ret.body.partner.status, 'aktiv');
  assert.equal(ret.body.partner.vist_i_spil, false);
  assert.equal(ret.body.partner.powerup, null);
  assert.equal(ret.body.partner.navn, 'Alfa');
  assert.equal(ret.body.partner.id, a.id);

  // Partnerens cookie giver ikke admin-adgang.
  const adm = await api(h.baseUrl, 'GET', '/admin/partnere', { adminCookie: pc });
  assert.equal(adm.status, 401);

  // Admin nulstiller koden: brugeren logges ud og skal skifte igen.
  const nul = await api(h.baseUrl, 'POST', `/admin/partner-brugere/${bruger.body.bruger.id}/nulstil`, {
    adminCookie: ac,
    body: { kode: 'ny-startkode-789' },
  });
  assert.equal(nul.status, 200);
  const efter = await api(h.baseUrl, 'GET', '/partner/mig', { adminCookie: pc });
  assert.equal(efter.status, 401);
});

test('ansøgning, godkendelse og sletning/arkivering', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const tom = await api(h.baseUrl, 'POST', '/partnere/ansoeg', { body: { firmanavn: 'Gamma' } });
  assert.equal(tom.status, 400);
  const ans = await api(h.baseUrl, 'POST', '/partnere/ansoeg', {
    body: { firmanavn: 'Gamma ApS', kontakt_navn: 'Gitte', kontakt_email: 'gitte@gamma.dk', besked: 'Vi vil gerne være med' },
  });
  assert.equal(ans.status, 201);

  let liste = (await api(h.baseUrl, 'GET', '/admin/partnere', { adminCookie: ac })).body.partnere;
  assert.equal(liste.length, 1);
  assert.equal(liste[0].status, 'ansoegt');
  assert.equal(liste[0].ansoegning_besked, 'Vi vil gerne være med');

  // En ansøgning uden brugere slettes helt.
  const slet = await api(h.baseUrl, 'DELETE', '/admin/partnere/' + liste[0].id, { adminCookie: ac });
  assert.equal(slet.body.resultat, 'slettet');

  await api(h.baseUrl, 'POST', '/partnere/ansoeg', {
    body: { firmanavn: 'Delta', kontakt_navn: 'Dan', kontakt_email: 'dan@delta.dk' },
  });
  liste = (await api(h.baseUrl, 'GET', '/admin/partnere', { adminCookie: ac })).body.partnere;
  const godk = await api(h.baseUrl, 'POST', `/admin/partnere/${liste[0].id}/godkend`, { adminCookie: ac });
  assert.equal(godk.body.partner.status, 'aktiv');
  assert.equal(godk.body.partner.vist_i_spil, false);

  await api(h.baseUrl, 'POST', `/admin/partnere/${liste[0].id}/brugere`, {
    adminCookie: ac,
    body: { email: 'dan@delta.dk', kode: 'startkode-123' },
  });
  const login = await api(h.baseUrl, 'POST', '/partner/login', { body: { email: 'dan@delta.dk', kode: 'startkode-123' } });
  const pc = login.headers.get('set-cookie').split(';')[0];

  // En aktiv partner arkiveres i stedet for at blive slettet, og brugeren logges ud.
  const ark = await api(h.baseUrl, 'DELETE', '/admin/partnere/' + liste[0].id, { adminCookie: ac });
  assert.equal(ark.body.resultat, 'arkiveret');
  const mig = await api(h.baseUrl, 'GET', '/partner/mig', { adminCookie: pc });
  assert.equal(mig.status, 401);
  const igen = await api(h.baseUrl, 'POST', '/partner/login', { body: { email: 'dan@delta.dk', kode: 'startkode-123' } });
  assert.equal(igen.status, 403);
});

test('logo: upload, offentlig visning og afvisning af forkerte typer', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);
  const p = (await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Logo' } })).body.partner;

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const up = await fetch(h.baseUrl + `/admin/partnere/${p.id}/logo`, {
    method: 'PUT',
    headers: { 'content-type': 'image/png', cookie: ac },
    body: png,
  });
  assert.equal(up.status, 200);
  const body = await up.json();
  assert.equal(body.partner.har_logo, true);

  const hent = await fetch(h.baseUrl + '/partnere/logo/logo');
  assert.equal(hent.status, 200);
  assert.equal(hent.headers.get('content-type'), 'image/png');
  assert.equal(Buffer.from(await hent.arrayBuffer()).length, png.length);

  const forkert = await fetch(h.baseUrl + `/admin/partnere/${p.id}/logo`, {
    method: 'PUT',
    headers: { 'content-type': 'text/html', cookie: ac },
    body: '<script>alert(1)</script>',
  });
  assert.equal(forkert.status, 400);
});

test('synlig partner bliver en tilmeldingsliste på sit faste id, og samtykket gemmes med firma og CVR', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const r = await api(h.baseUrl, 'POST', '/admin/partnere', {
    adminCookie: ac,
    body: { navn: 'Herodesk', ...FULD_PROFIL, vist_i_spil: true },
  });
  assert.equal(r.status, 201);
  const slug = r.body.partner.slug;

  const st = await api(h.baseUrl, 'GET', '/state');
  const cfg = st.body.cfg || st.body.config || {};
  assert.ok(String(cfg.mailPartners).split(',').map((x) => x.trim()).includes(slug));
  const liste = (cfg.partnerLister || []).find((l) => l.slug === slug);
  assert.ok(liste, 'partneren skal stå i cfg.partnerLister');
  assert.match(liste.tekst, /Herodesk ApS, CVR 12345678 må sende mig mails om kundeservice-software/);

  const { body } = registrerSpiller(h.baseUrl, { email: 'samtykke@example.dk', tilmeldinger: ['m:' + slug] });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  const { rows } = await h.pool.query(
    `SELECT s.liste, s.tekst, s.tekst_version FROM samtykke s JOIN spiller p ON p.id = s.spiller_id
     WHERE p.email = 'samtykke@example.dk'`
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].liste, 'partner:' + slug);
  assert.match(rows[0].tekst, /CVR 12345678/);
  assert.equal(rows[0].tekst_version, 2);
});

test('partnerportal: leads kun fra egne samtykker, kræver accept af alle 7 erklæringer, og hver download logges', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const mk = async (navn, cvr) => {
    const r = await api(h.baseUrl, 'POST', '/admin/partnere', {
      adminCookie: ac,
      body: { navn, ...FULD_PROFIL, cvr, vist_i_spil: true },
    });
    assert.equal(r.status, 201);
    return r.body.partner;
  };
  const alfa = await mk('Alfa', '11111111');
  const beta = await mk('Beta', '22222222');

  // Tre spillere: én siger ja til Alfa, én til Beta, én til Alfa og trækker det tilbage.
  const reg = async (email, keys) => {
    const { body } = registrerSpiller(h.baseUrl, { email, tilmeldinger: keys });
    const r = await api(h.baseUrl, 'POST', '/players', { body });
    assert.equal(r.status, 201);
    return r.body.token;
  };
  await reg('ja-alfa@example.dk', ['m:' + alfa.slug]);
  await reg('ja-beta@example.dk', ['m:' + beta.slug]);
  const tok = await reg('fortryder@example.dk', ['m:' + alfa.slug]);
  const af = await api(h.baseUrl, 'DELETE', '/me/subs/' + encodeURIComponent('m:' + alfa.slug), { token: tok });
  assert.ok(af.status === 200 || af.status === 204, 'afmelding: ' + af.status);

  await api(h.baseUrl, 'POST', `/admin/partnere/${alfa.id}/brugere`, {
    adminCookie: ac,
    body: { email: 'kim@alfa.dk', navn: 'Kim', kode: 'startkode-123' },
  });
  const login = await api(h.baseUrl, 'POST', '/partner/login', { body: { email: 'kim@alfa.dk', kode: 'startkode-123' } });
  const pc = login.headers.get('set-cookie').split(';')[0];
  await api(h.baseUrl, 'POST', '/partner/skift-kode', { adminCookie: pc, body: { gammel: 'startkode-123', ny: 'min-egen-kode-456' } });

  const antal = await api(h.baseUrl, 'GET', '/partner/leads', { adminCookie: pc });
  assert.equal(antal.body.antal, 1);

  const hent = () => fetch(h.baseUrl + '/partner/leads.csv', { headers: { cookie: pc } });
  const foer = await hent();
  assert.equal(foer.status, 403, 'kræver accept først');
  const pl0 = await api(h.baseUrl, 'GET', '/partner/partnere', { adminCookie: pc });
  assert.equal(pl0.status, 403, 'partnerlisten kræver også accept');

  const halv = await api(h.baseUrl, 'POST', '/partner/vilkaar', { adminCookie: pc, body: { erklaeringer: { oplysninger: true } } });
  assert.equal(halv.status, 400);
  assert.equal(halv.body.mangler.length, 6);

  const v = await api(h.baseUrl, 'GET', '/partner/vilkaar', { adminCookie: pc });
  const alle = Object.fromEntries(v.body.erklaeringer.map((e) => [e.key, true]));
  const ok = await api(h.baseUrl, 'POST', '/partner/vilkaar', { adminCookie: pc, body: { erklaeringer: alle } });
  assert.equal(ok.status, 200);

  // Øvrige partnere: kun læsning, uden en selv, med kontaktoplysninger.
  const pl = await api(h.baseUrl, 'GET', '/partner/partnere', { adminCookie: pc });
  assert.equal(pl.status, 200);
  assert.deepEqual(pl.body.partnere.map((x) => x.navn), ['Beta']);
  assert.ok('kontakt_email' in pl.body.partnere[0] && 'kontakt_telefon' in pl.body.partnere[0] && 'kontakt_navn' in pl.body.partnere[0]);
  assert.equal(pl.body.partnere[0].cvr, undefined, 'kun kontakt- og firmaoplysninger');
  const ret = await api(h.baseUrl, 'PUT', '/partner/partnere', { adminCookie: pc, body: { navn: 'X' } });
  assert.equal(ret.status, 404, 'listen kan ikke rettes');

  const csvRes = await hent();
  assert.equal(csvRes.status, 200);
  const csv = await csvRes.text();
  assert.match(csv, /ja-alfa@example\.dk/);
  assert.doesNotMatch(csv, /ja-beta@example\.dk/, 'aldrig andre partneres leads');
  assert.doesNotMatch(csv, /fortryder@example\.dk/, 'tilbagetrukne samtykker er ikke med');
  assert.match(csv, /CVR 11111111/);

  // "Siden sidst": en ny spiller siger ja, og ja-alfa trækker sit samtykke tilbage.
  // Næste download med ?siden=sidst giver præcis de to: én ny og én afmeldt.
  await new Promise((r) => setTimeout(r, 20));
  const tokNy = await reg('ny-alfa@example.dk', ['m:' + alfa.slug]);
  const tokGl = await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl, { email: 'ja-alfa@example.dk', tilmeldinger: [] }).body });
  assert.ok(tokGl.body.token, 'login igen');
  const af2 = await api(h.baseUrl, 'DELETE', '/me/subs/' + encodeURIComponent('m:' + alfa.slug), { token: tokGl.body.token });
  assert.ok(af2.status === 200 || af2.status === 204);
  const st = await api(h.baseUrl, 'GET', '/partner/leads', { adminCookie: pc });
  assert.equal(st.body.nye_siden_sidst, 1);
  assert.equal(st.body.afmeldte_siden_sidst, 1);
  assert.ok(st.body.sidst_hentet);
  const d2 = await fetch(h.baseUrl + '/partner/leads.csv?siden=sidst', { headers: { cookie: pc } });
  const csv2 = await d2.text();
  const linjer = csv2.trim().split(/\r?\n/).slice(1);
  assert.equal(linjer.length, 2, csv2);
  assert.match(csv2, /ny,.*ny-alfa@example\.dk/);
  assert.match(csv2, /afmeldt,.*ja-alfa@example\.dk/);
  assert.doesNotMatch(csv2, /ja-beta@example\.dk/);
  // Tredje download siden sidst: ingen ændringer.
  const d3 = await fetch(h.baseUrl + '/partner/leads.csv?siden=sidst', { headers: { cookie: pc } });
  assert.equal((await d3.text()).trim().split(/\r?\n/).length, 1, 'kun overskrift');
  void tokNy;

  const log = await api(h.baseUrl, 'GET', `/admin/partnere/${alfa.id}/log`, { adminCookie: ac });
  assert.equal(log.body.downloads.length, 3);
  assert.equal(log.body.downloads[2].slags, 'alle');
  assert.equal(log.body.downloads[1].slags, 'aendringer');
  assert.equal(log.body.downloads[2].antal, 1);
  assert.equal(log.body.downloads[0].bruger_email, 'kim@alfa.dk');
  assert.equal(log.body.accept.length, 1);
});

test('advarsel når en aktiv partner har alt udfyldt men ingen power-up (kun admin kan vælge power-up)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);
  const r = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Gamma', ...FULD_PROFIL } });
  assert.equal(r.body.partner.advarsel_powerup, true);
  const m = await api(h.baseUrl, 'PUT', '/admin/partnere/' + r.body.partner.id, { adminCookie: ac, body: { powerup: 'promo' } });
  assert.equal(m.body.partner.advarsel_powerup, false);
  const uden = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Delta' } });
  assert.equal(uden.body.partner.advarsel_powerup, false, 'ingen advarsel før profilen er udfyldt');
});
