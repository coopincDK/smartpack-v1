'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false'; // tests kører over http, ikke https

const { startHarness, api, registrerSpiller, slaaSmsTil } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(';')[0];
}

test('admin-endpoints kræver session', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const uden = await api(h.baseUrl, 'GET', '/admin/spillere');
  assert.equal(uden.status, 401);

  const forkertLogin = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'forkert' } });
  assert.equal(forkertLogin.status, 401);
});

test('admin-login med korrekt adgangskode giver adgang til beskyttede endpoints', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  assert.equal(login.status, 200);
  const cookie = cookieFra(login);
  assert.ok(cookie);

  const spillere = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: cookie });
  assert.equal(spillere.status, 200);
  assert.ok(Array.isArray(spillere.body.spillere));

  const cfg = await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: cookie });
  assert.equal(cfg.status, 200);
  assert.ok('pin' in cfg.body.hemmelig);

  const boost = await api(h.baseUrl, 'GET', '/admin/boostkode', { adminCookie: cookie });
  assert.equal(boost.status, 200);
  assert.equal(boost.body.kode.length, 4);
});

test('stand-login-flow: admin udsteder ét-gangs-kode, standtablet bytter den til en stand-session', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  assert.equal(kodeRes.status, 200);
  assert.ok(kodeRes.body.kode);

  // Uden admin-cookie kræves der (bevidst) ingen — koden selv er beviset.
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  assert.equal(standLogin.status, 200);
  const standCookie = cookieFra(standLogin);
  assert.ok(standCookie);

  // Koden er ét-gangs — samme kode igen fejler.
  const igen = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  assert.equal(igen.status, 400);
  assert.equal(igen.body.kode, 'ugyldig_kode');

  // En stand-session giver IKKE adgang til rigtige admin-only endpoints
  // (fx spillerliste/CSV/sletning) — kun ret til at se fulde navne.
  const spillereSomStand = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: standCookie });
  assert.equal(spillereSomStand.status, 403);
  assert.equal(spillereSomStand.body.kode, 'kraever_admin');

  const csvSomStand = await api(h.baseUrl, 'GET', '/admin/eksport/spillere.csv', { adminCookie: standCookie });
  assert.equal(csvSomStand.status, 403);

  // ...men en RIGTIG admin-session virker stadig upåvirket.
  const spillereSomAdmin = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereSomAdmin.status, 200);
});

test('ugyldig/udløbet stand-login-kode afvises', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const res = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: 'XXXXXX' } });
  assert.equal(res.status, 400);
  assert.equal(res.body.kode, 'ugyldig_kode');
});

test('admin-logout ugyldiggør sessionen', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const cookie = cookieFra(login);

  const logud = await api(h.baseUrl, 'POST', '/admin/logout', { adminCookie: cookie });
  assert.equal(logud.status, 200);

  const efter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie: cookie });
  assert.equal(efter.status, 401);
});

test('DELETE /admin/spillere/:pid sletter spilleren og anonymiserer rest-referencer i andre spilleres data', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body: sletBody } = registrerSpiller(h.baseUrl, { navn: 'Slettes Snart' });
  const sletReg = await api(h.baseUrl, 'POST', '/players', { body: sletBody });
  const sletPid = sletReg.body.spiller.pid;

  const { body: overleverBody } = registrerSpiller(h.baseUrl, { navn: 'Overlever Olsen' });
  const overleverReg = await api(h.baseUrl, 'POST', '/players', { body: overleverBody });
  const overleverId = (
    await h.pool.query('SELECT id FROM spiller WHERE public_id = $1', [overleverReg.body.spiller.pid])
  ).rows[0].id;

  await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2::jsonb)`, [
    overleverId,
    JSON.stringify({ by: 'Slettes Snart', score: 500 }),
  ]);

  const slet = await api(h.baseUrl, 'DELETE', `/admin/spillere/${sletPid}`, { adminCookie });
  assert.equal(slet.status, 200);

  const spillereEfter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.ok(!spillereEfter.body.spillere.some((s) => s.pid === sletPid));

  const notif = await h.pool.query('SELECT data FROM notifikation WHERE spiller_id = $1', [overleverId]);
  assert.equal(notif.rows[0].data.by, 'Slettet spiller');

  const igen = await api(h.baseUrl, 'DELETE', `/admin/spillere/${sletPid}`, { adminCookie });
  assert.equal(igen.status, 404);
});

test('opgave G: GET /admin/spillere returnerer komplet organisatordata (tilmeldinger, beaten_i_dag, forsoeg, liv)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  // Telefon-opfølgning: sms kræver et registreret telefonnummer.
  const { body: b1 } = registrerSpiller(h.baseUrl, {
    navn: 'Organisator Testesen',
    email: 'organisator@example.dk',
    telefon: '20304050',
    tilmeldinger: ['sms'],
  });
  const reg1 = await api(h.baseUrl, 'POST', '/players', { body: b1 });
  const token1 = reg1.body.token;

  const { body: b2 } = registrerSpiller(h.baseUrl, { navn: 'Anden Spiller' });
  await api(h.baseUrl, 'POST', '/players', { body: b2 });

  // Giv spiller 1 et godkendt forsøg, så vi kan tjekke `forsoeg`-feltet.
  const start = await api(h.baseUrl, 'POST', '/runs', { token: token1 });
  await h.pool.query(`UPDATE forsoeg SET start_server = start_server - interval '80 seconds' WHERE runde_id = $1`, [
    start.body.runde_id,
  ]);
  const finish = await api(h.baseUrl, 'POST', `/runs/${start.body.runde_id}/finish`, {
    token: token1,
    body: {
      rounds: [50, 60, 40],
      s: { orders: 5, errors: 0 },
      bf: false,
      duel: null,
      spilletid_klient_ms: 81000,
    },
  });
  assert.equal(finish.status, 200);

  // Manuelt indsat beaten-notifikation for i dag, så vi kan tjekke
  // `beaten_i_dag`.
  const { todayStr } = require('../src/rules/life');
  await h.pool.query(
    `INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2::jsonb)`,
    [
      (await h.pool.query('SELECT id FROM spiller WHERE email = $1', ['organisator@example.dk'])).rows[0].id,
      JSON.stringify({ by: 'Anden Spiller', score: 999, day: todayStr(new Date()) }),
    ]
  );

  const res = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(res.status, 200);
  const spiller = res.body.spillere.find((s) => s.email === 'organisator@example.dk');
  assert.ok(spiller, 'skal finde spilleren');

  assert.equal(spiller.navn, 'Organisator Testesen'); // FULDT, umaskeret navn
  // Telefon-opfølgning: valgfrit generelt, men PÅKRÆVET her fordi spilleren
  // er sms-tilmeldt (se registrerSpiller-overrides ovenfor).
  assert.equal(spiller.telefon, '20304050');
  assert.ok(Array.isArray(spiller.tilmeldinger));
  const smsTilmelding = spiller.tilmeldinger.find((x) => x.liste === 'sms');
  assert.ok(smsTilmelding, 'tilmeldinger skal indeholde sms-listens afledte samtykke-status');
  assert.equal(smsTilmelding.aktiv, true);

  assert.ok(Array.isArray(spiller.beaten_i_dag));
  assert.equal(spiller.beaten_i_dag.length, 1);
  assert.equal(spiller.beaten_i_dag[0].by, 'Anden Spiller');

  assert.ok(Array.isArray(spiller.forsoeg));
  assert.equal(spiller.forsoeg.length, 1);
  assert.equal(spiller.forsoeg[0].score, 150);
  assert.ok(spiller.forsoeg[0].dag);
  assert.ok(spiller.forsoeg[0].slut_server);

  assert.ok(spiller.liv);
  assert.equal(typeof spiller.liv.n, 'number');
});

test('POST /admin/afmeld logger trukket_tilbage for fundne emails og rapporterer fundet/ikke_fundet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body } = registrerSpiller(h.baseUrl, {
    email: 'afmeld@example.dk',
    telefon: '20304050',
    tilmeldinger: ['sms'],
  });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  const token = reg.body.token;

  const foer = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(foer.body.mine_noegler.includes('sms'));

  const res = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    body: { liste: 'sms', emails: ['afmeld@example.dk', 'ukendt@example.dk'] },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.fundet, 1);
  assert.deepEqual(res.body.ikke_fundet, ['ukendt@example.dk']);

  const efter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(!efter.body.mine_noegler.includes('sms'));
  const smsStatus = efter.body.samtykker.find((s) => s.liste === 'sms');
  assert.equal(smsStatus.aktiv, false);
  assert.equal(smsStatus.seneste_haendelse.type, 'trukket_tilbage');
});

test('POST /admin/afmeld kræver admin-session (ikke stand), og en ukendt liste afvises', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const ukendt = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    body: { liste: 'ikke-en-liste', emails: ['x@example.dk'] },
  });
  assert.equal(ukendt.status, 400);
  assert.equal(ukendt.body.kode, 'ukendt_liste');

  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const somStand = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie: standCookie,
    body: { liste: 'sms', emails: ['x@example.dk'] },
  });
  assert.equal(somStand.status, 403);
});

test('opgave H: POST /admin/afmeld understøtter liste:"alle" (afmelder KUN de lister spilleren var aktivt tilmeldt)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body } = registrerSpiller(h.baseUrl, {
    email: 'alle-lister@example.dk',
    telefon: '20304050',
    tilmeldinger: ['sp', 'sms'],
  });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const foer = await api(h.baseUrl, 'GET', '/me', { token });
  assert.deepEqual(new Set(foer.body.mine_noegler), new Set(['sp', 'sms']));

  const res = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    body: { liste: 'alle', emails: ['alle-lister@example.dk'] },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.fundet, 1);

  const efter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.deepEqual(efter.body.mine_noegler, []);

  // Der er logget PRÆCIS to trukket_tilbage-hændelser (én pr. liste
  // spilleren rent faktisk var tilmeldt) — ikke én for enhver mulig liste.
  const spillerId = (await h.pool.query('SELECT id FROM spiller WHERE email = $1', ['alle-lister@example.dk']))
    .rows[0].id;
  const haendelser = await h.pool.query(
    `SELECT liste FROM samtykke WHERE spiller_id = $1 AND type = 'trukket_tilbage' AND kilde = 'admin'`,
    [spillerId]
  );
  assert.equal(haendelser.rows.length, 2);
  assert.deepEqual(new Set(haendelser.rows.map((r) => r.liste)), new Set(['smartpack', 'sms']));
});

test('opgave H: POST /admin/afmeld matcher også på telefonnummer (sidste 8 cifre), ikke kun email', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  const { body } = registrerSpiller(h.baseUrl, {
    email: 'telefon-match@example.dk',
    telefon: '20304099',
    tilmeldinger: ['sms'],
  });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;
  // Nye spillere gemmer ikke telefon (010_pinkode.sql); afmelding på telefon
  // virker stadig for spillere oprettet før — simulér sådan én.
  await h.pool.query(`UPDATE spiller SET telefon = '20304099' WHERE email = 'telefon-match@example.dk'`);

  const res = await api(h.baseUrl, 'POST', '/admin/afmeld', {
    adminCookie,
    // Landekode-præfiks foran — kun de sidste 8 cifre skal matche.
    body: { liste: 'sms', emails: ['+45 20304099'] },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.fundet, 1);
  assert.deepEqual(res.body.ikke_fundet, []);

  const efter = await api(h.baseUrl, 'GET', '/me', { token });
  assert.ok(!efter.body.mine_noegler.includes('sms'));
});

test('POST /admin/nulstil kræver PRÆCIS bekræftelsesstrengen, tager en backup FØR sletning, sletter alt og logger en audit-række', async (t) => {
  const kald = [];
  const stubBackup = async () => {
    kald.push(Date.now());
    return '/var/backups/spil-api/nulstil-test.sql';
  };
  const h = await startHarness({ adminRouterOpts: { runBackup: stubBackup } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });

  const forkert = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'ja tak' } });
  assert.equal(forkert.status, 400);
  assert.equal(forkert.body.kode, 'mangler_bekraeftelse');
  assert.equal(kald.length, 0, 'backuppen må IKKE tages hvis bekræftelsen er forkert');

  const spillereFoer = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereFoer.body.spillere.length, 2);

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } });
  assert.equal(res.status, 200);
  assert.equal(res.body.antal_slettet, 2);
  assert.equal(kald.length, 1, 'backuppen skal tages nøjagtig én gang, FØR sletningen');

  const spillereEfter = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillereEfter.body.spillere.length, 0);

  const audit = await h.pool.query('SELECT handling, antal, admin_session_id FROM admin_audit_log');
  assert.equal(audit.rows.length, 1);
  assert.equal(audit.rows[0].handling, 'nulstil');
  assert.equal(Number(audit.rows[0].antal), 2);
  assert.ok(audit.rows[0].admin_session_id, 'skal logge HVILKEN admin-session der udførte nulstillingen');
});

test('POST /admin/nulstil afbrydes helt hvis backuppen fejler — ingen spillere slettes', async (t) => {
  const failingBackup = async () => {
    throw new Error('pg_dump utilgængelig i test');
  };
  const h = await startHarness({ adminRouterOpts: { runBackup: failingBackup } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  await api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl).body });

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } });
  assert.equal(res.status, 500);

  const spillere = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.equal(spillere.body.spillere.length, 1, 'ingen spillere må slettes hvis sikkerhedskopien fejlede');
});

test('POST /admin/nulstil kræver admin-session (ikke stand)', async (t) => {
  const h = await startHarness({ adminRouterOpts: { runBackup: async () => '/tmp/x.sql' } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const res = await api(h.baseUrl, 'POST', '/admin/nulstil', {
    adminCookie: standCookie,
    body: { bekraeft: 'NULSTIL' },
  });
  assert.equal(res.status, 403);
});

test('spiller oprettet før pinkoderne kan logge ind med telefon; standen kan nulstille til en ny pinkode', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { email: 'gammel@example.dk' });
  await api(h.baseUrl, 'POST', '/players', { body });
  await h.pool.query(`UPDATE spiller SET pin_hash = NULL, telefon = '20304050' WHERE email = 'gammel@example.dk'`);

  const medTelefon = await api(h.baseUrl, 'POST', '/players', {
    body: { email: 'gammel@example.dk', telefon: '+45 20 30 40 50' },
  });
  assert.equal(medTelefon.status, 200);

  const medPin = await api(h.baseUrl, 'POST', '/players', { body: { email: 'gammel@example.dk', pin: '1234' } });
  assert.equal(medPin.status, 400);
  assert.equal(medPin.body.kode, 'mangler_pin');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const pid = (await h.pool.query(`SELECT public_id FROM spiller WHERE email = 'gammel@example.dk'`)).rows[0].public_id;
  const nul = await api(h.baseUrl, 'POST', `/admin/spillere/${pid}/nulstil-pin`, { adminCookie });
  assert.equal(nul.status, 200);
  assert.match(nul.body.pin, /^[0-9]{4}$/);

  const nyPin = await api(h.baseUrl, 'POST', '/players', { body: { email: 'gammel@example.dk', pin: nul.body.pin } });
  assert.equal(nyPin.status, 200);
});

test('admin kan selv skifte koden: kræver den nuværende, mindst 12 tegn, gammel kode virker ikke bagefter', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const l1 = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const c1 = cookieFra(l1);
  const l2 = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const c2 = cookieFra(l2);

  const forkert = await api(h.baseUrl, 'POST', '/admin/skift-kode', { adminCookie: c1, body: { gammel: 'nej', ny: 'en-helt-ny-kode-123' } });
  assert.equal(forkert.status, 401);
  const kort = await api(h.baseUrl, 'POST', '/admin/skift-kode', { adminCookie: c1, body: { gammel: ADMIN_PW, ny: 'kort' } });
  assert.equal(kort.status, 400);
  const ok = await api(h.baseUrl, 'POST', '/admin/skift-kode', { adminCookie: c1, body: { gammel: ADMIN_PW, ny: 'en-helt-ny-kode-123' } });
  assert.equal(ok.status, 200);

  const gammelLogin = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  assert.equal(gammelLogin.status, 401);
  const nyLogin = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'en-helt-ny-kode-123' } });
  assert.equal(nyLogin.status, 200);

  // Egen session virker stadig, den anden er logget ud.
  assert.equal((await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: c1 })).status, 200);
  assert.equal((await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: c2 })).status, 401);
});

test('personlige admin-logins: kun @smartpack.dk, startkode skal skiftes, kan lukkes', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const fael = cookieFra(await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } }));

  const ude = await api(h.baseUrl, 'POST', '/admin/brugere', { adminCookie: fael, body: { email: 'x@gmail.com', kode: 'startkode-123' } });
  assert.equal(ude.status, 400);
  const ny = await api(h.baseUrl, 'POST', '/admin/brugere', { adminCookie: fael, body: { email: 'Mikkel@SmartPack.dk', navn: 'Mikkel', kode: 'startkode-123' } });
  assert.equal(ny.status, 201);

  const forkert = await api(h.baseUrl, 'POST', '/admin/login', { body: { email: 'mikkel@smartpack.dk', password: 'forkert' } });
  assert.equal(forkert.status, 401);
  const l = await api(h.baseUrl, 'POST', '/admin/login', { body: { email: 'mikkel@smartpack.dk', password: 'startkode-123' } });
  assert.equal(l.status, 200);
  assert.equal(l.body.skal_skifte_kode, true);
  const mc = cookieFra(l);

  assert.equal((await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: mc })).status, 403, 'skal skifte kode først');
  const mig = await api(h.baseUrl, 'GET', '/admin/mig', { adminCookie: mc });
  assert.equal(mig.body.email, 'mikkel@smartpack.dk');
  const sk = await api(h.baseUrl, 'POST', '/admin/skift-kode', { adminCookie: mc, body: { gammel: 'startkode-123', ny: 'mikkels-egen-kode-1' } });
  assert.equal(sk.status, 200);
  assert.equal((await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: mc })).status, 200);

  // Den fælles kode er uændret.
  assert.equal((await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } })).status, 200);

  const liste = await api(h.baseUrl, 'GET', '/admin/brugere', { adminCookie: fael });
  const id = liste.body.brugere[0].id;
  assert.equal((await api(h.baseUrl, 'DELETE', '/admin/brugere/' + id, { adminCookie: mc })).status, 400, 'ikke sig selv');
  assert.equal((await api(h.baseUrl, 'DELETE', '/admin/brugere/' + id, { adminCookie: fael })).status, 200);
  assert.equal((await api(h.baseUrl, 'GET', '/admin/config', { adminCookie: mc })).status, 401, 'lukket login er logget ud');
  const igen = await api(h.baseUrl, 'POST', '/admin/login', { body: { email: 'mikkel@smartpack.dk', password: 'mikkels-egen-kode-1' } });
  assert.equal(igen.status, 401);
});

// --- Telefon-opfølgning: admin-lister/eksporter skal springe spillere uden telefon over ---

test('telefon-opfølgning: GET /admin/eksport/sms.csv og revanche.csv springer sms-tilmeldte spillere UDEN telefon over', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  await slaaSmsTil(h.pool);

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  // Med telefon: skal med i begge lister.
  const medTlf = registrerSpiller(h.baseUrl, {
    navn: 'Med Telefon',
    email: 'med-telefon@example.dk',
    telefon: '20304050',
    tilmeldinger: ['sms'],
  });
  const regMedTlf = await api(h.baseUrl, 'POST', '/players', { body: medTlf.body });
  assert.equal(regMedTlf.status, 201);

  // Uden telefon, men ALLIGEVEL sms-aktiv: simulerer en tilbagestående
  // datatilstand (fx ryddet via PATCH /me efter tilmelding) — skal IKKE med
  // i nogen af listerne (kan jo ikke modtage en sms).
  const udenTlf = registrerSpiller(h.baseUrl, {
    navn: 'Uden Telefon',
    email: 'uden-telefon@example.dk',
    telefon: '30405060',
    tilmeldinger: ['sms'],
  });
  const regUdenTlf = await api(h.baseUrl, 'POST', '/players', { body: udenTlf.body });
  assert.equal(regUdenTlf.status, 201);
  const tokenUdenTlf = regUdenTlf.body.token;
  // Ryd telefonen igen (PATCH /me tillader det, se API.md) — notify er
  // stadig true, telefonen er nu NULL: netop den tilstand eksporterne skal
  // filtrere væk.
  await api(h.baseUrl, 'PATCH', '/me', { token: tokenUdenTlf, body: { telefon: '' } });

  const { todayStr } = require('../src/rules/life');
  const today = todayStr(new Date());
  const beatenData = { by: 'Nogen', score: 999, day: today };
  for (const email of ['med-telefon@example.dk', 'uden-telefon@example.dk']) {
    // eslint-disable-next-line no-await-in-loop
    const { rows } = await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email]);
    // eslint-disable-next-line no-await-in-loop
    await h.pool.query(`INSERT INTO notifikation (spiller_id, type, data) VALUES ($1, 'beaten', $2::jsonb)`, [
      rows[0].id,
      JSON.stringify(beatenData),
    ]);
  }

  const smsRes = await fetch(h.baseUrl + '/admin/eksport/sms.csv', { headers: { cookie: adminCookie } });
  const smsCsv = await smsRes.text();
  assert.equal(smsRes.status, 200);
  assert.ok(smsCsv.includes('med-telefon@example.dk'), 'sms.csv skal INDEHOLDE spilleren MED telefon');
  assert.ok(!smsCsv.includes('uden-telefon@example.dk'), 'sms.csv skal SPRINGE spilleren UDEN telefon over');

  const revRes = await fetch(h.baseUrl + '/admin/eksport/revanche.csv', { headers: { cookie: adminCookie } });
  const revCsv = await revRes.text();
  assert.equal(revRes.status, 200);
  assert.ok(revCsv.includes('med-telefon@example.dk'), 'revanche.csv skal INDEHOLDE spilleren MED telefon');
  assert.ok(!revCsv.includes('uden-telefon@example.dk'), 'revanche.csv skal SPRINGE spilleren UDEN telefon over');

  // Den generelle admin-spillerliste og -eksport er UÆNDREDE: begge spillere
  // vises fortsat (bruges til almindelig administration, ikke kun sms).
  const alleRes = await api(h.baseUrl, 'GET', '/admin/spillere', { adminCookie });
  assert.ok(alleRes.body.spillere.some((s) => s.email === 'uden-telefon@example.dk'));
});
