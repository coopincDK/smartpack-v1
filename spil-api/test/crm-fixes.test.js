'use strict';

// Tests for rettelserne efter CRM-reviewet (H1-H4, M1, M3-M7).

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { hashPassword } = require('../src/crypto');
process.env.ADMIN_PASSWORD_HASH = hashPassword('x-test-adgangskode');
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { synkOnce } = require('../src/crmSynk');
const { kampagneTilCrm } = require('../src/crm');
const { deletePlayerFully } = require('../src/playerDeletion');
const { deleteInactivePlayers } = require('../src/retention');

// svar(body, url) -> [status, tekst]. Standard: 201.
function fakeCrm(svar = () => [201, '{}']) {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', async () => {
      const body = JSON.parse(b || '{}');
      kald.push({ url: req.url, body });
      const [status, txt] = await svar(body, req.url);
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(txt);
    });
  });
  return new Promise((r) =>
    srv.listen(0, () => r({ srv, kald, url: `http://127.0.0.1:${srv.address().port}/api/v1/newsletter` }))
  );
}
const vent = (ms) => new Promise((r) => setTimeout(r, ms));
const ryd = () => {
  delete process.env.SMARTPACK_CRM_KEY;
  delete process.env.SMARTPACK_CRM_URL;
};

async function opsaet(t, svar, harnessOpts) {
  const crm = await fakeCrm(svar);
  process.env.SMARTPACK_CRM_URL = crm.url;
  process.env.SMARTPACK_CRM_KEY = 'spk_hemmelig_noegle';
  const h = await startHarness(harnessOpts);
  t.after(async () => {
    await h.teardown();
    crm.srv.close();
    ryd();
  });
  return { crm, h };
}

async function nySpiller(h, navn, email, tilmeldinger = ['sp'], extra = {}) {
  const s = registrerSpiller(h.baseUrl, { navn, email, tilmeldinger, ...extra });
  const r = await api(h.baseUrl, 'POST', '/players', { body: s.body });
  assert.ok([200, 201].includes(r.status), JSON.stringify(r.body));
  return { token: r.body.token, pin: s.body.pin, email };
}

// Fanger console.error, så vi kan kontrollere, hvad der logges.
function fangLog() {
  const linjer = [];
  const orig = console.error;
  console.error = (...a) => linjer.push(a.map(String).join(' '));
  return { linjer, stop: () => (console.error = orig) };
}

test('H1: DELETE /me lægger en afmelding i udbakken, som sendes og slettes, når CRM bekræfter', async (t) => {
  let status = 201;
  const { crm, h } = await opsaet(t, () => [status, '{}']);
  const anna = await nySpiller(h, 'Anna Andersen', 'anna-h1@shop.dk');
  await synkOnce(h.pool);
  assert.equal(crm.kald.length, 1);

  const del = await api(h.baseUrl, 'DELETE', '/me', { token: anna.token, body: { pinkode: anna.pin } });
  assert.equal(del.status, 200, JSON.stringify(del.body));
  assert.equal((await h.pool.query("SELECT 1 FROM spiller WHERE email = 'anna-h1@shop.dk'")).rowCount, 0);
  const ud = (await h.pool.query('SELECT email, type FROM crm_udbakke')).rows;
  assert.deepEqual(ud, [{ email: 'anna-h1@shop.dk', type: 'afmeld' }]);

  // CRM nede: rækken bliver liggende
  status = 503;
  assert.match((await synkOnce(h.pool)).stop, /HTTP 503/);
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 1);

  // CRM oppe: afmeldingen sendes, og rækken slettes
  status = 201;
  await synkOnce(h.pool);
  const sidste = crm.kald[crm.kald.length - 1];
  assert.equal(sidste.url, '/api/v1/newsletter/unsubscribe');
  assert.equal(sidste.body.email, 'anna-h1@shop.dk');
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 0);
});

test('H1: rulles sletningen tilbage, rulles udbakken også tilbage', async (t) => {
  const { h } = await opsaet(t);
  await nySpiller(h, 'Fie Ja', 'fie-h1@shop.dk');
  const client = await h.pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query("SELECT id, navn FROM spiller WHERE email = 'fie-h1@shop.dk' FOR UPDATE");
    await deletePlayerFully(client, rows[0].id, rows[0].navn);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 0);
  assert.equal((await h.pool.query("SELECT 1 FROM spiller WHERE email = 'fie-h1@shop.dk'")).rowCount, 1);
});

for (const kode of [401, 403, 404]) {
  test(`H2: HTTP ${kode} stopper synkroniseringen, intet springes over, og loggen har hverken e-mail eller nøgle`, async (t) => {
    let status = kode;
    const { crm, h } = await opsaet(t, () => [status, '{"error":"Ugyldig nøgle for anna-h2@shop.dk"}']);
    await nySpiller(h, 'Anna H2', 'anna-h2@shop.dk');
    await nySpiller(h, 'Bo H2', 'bo-h2@shop.dk');
    const log = fangLog();
    let r;
    try {
      r = await synkOnce(h.pool);
    } finally {
      log.stop();
    }
    assert.match(r.stop, new RegExp('HTTP ' + kode));
    assert.equal(crm.kald.length, 1, 'stopper ved første række');
    const stat = (await h.pool.query("SELECT crm_synk_status FROM samtykke WHERE liste = 'smartpack'")).rows;
    assert.ok(stat.every((x) => x.crm_synk_status === null), 'ingen rækker markeret');
    const tekst = log.linjer.join('\n');
    assert.match(tekst, /STOP/);
    assert.ok(!tekst.includes('anna-h2@shop.dk') && !tekst.includes('spk_hemmelig_noegle'));
    const fejl = (await h.pool.query('SELECT seneste_fejl FROM crm_synk')).rows[0].seneste_fejl;
    assert.ok(!fejl.includes('anna-h2'));

    // Nøglen rettes: begge rækker sendes
    status = 201;
    const ok = await synkOnce(h.pool);
    assert.equal(ok.sendt, 2);
  });
}

test('H3 + H4: en indsendelse uden flueben sender intet, og kan aldrig gentilmelde', async (t) => {
  const { crm, h } = await opsaet(t);
  const tilmeld = (b) =>
    api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'Anna', firma: 'MinShop', email: 'anna-h3@minshop.dk', ...b } });

  // Uden flueben: intet til CRM
  assert.equal((await tilmeld({ telefon: '12345678', ordrer: '500', hvor: 'Pluk' })).status, 201);
  await vent(300);
  assert.equal(crm.kald.length, 0);

  // Med flueben: sendes, men uden telefon og frivillige felter (ingen ring-op)
  await tilmeld({ nyhedsbrev: true, kilde: 'digiday' });
  await vent(300);
  assert.equal(crm.kald.length, 1);
  const b = crm.kald[0].body;
  assert.equal(b.newsletter, true);
  assert.match(b.consentText, /Ja tak til SmartPacks mailliste/);
  assert.equal(b.phone, undefined);
  assert.equal(b.notes.ordrer_pr_md, undefined);
  assert.equal(b.notes.hvor_knaekker_det, undefined);
  assert.equal(b.notes.klub, undefined);

  // Anonym gen-indsendelse uden flueben: intet nyt kald, CRM-status rører vi ikke
  const foer = (await h.pool.query('SELECT crm_sendt, nyhedsbrev_tid FROM kampagne_tilmelding')).rows[0];
  assert.ok(foer.crm_sendt);
  await tilmeld({});
  await vent(300);
  assert.equal(crm.kald.length, 1);
  const efter = (await h.pool.query('SELECT crm_sendt, nyhedsbrev_tid FROM kampagne_tilmelding')).rows[0];
  assert.equal(String(efter.crm_sendt), String(foer.crm_sendt));
  assert.equal(String(efter.nyhedsbrev_tid), String(foer.nyhedsbrev_tid));

  // Admin crm-send og crm_mangler ignorerer rækker uden flueben
  await tilmeld({ email: 'uden@minshop.dk' });
  await vent(200);
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'x-test-adgangskode' } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const l = await api(h.baseUrl, 'GET', '/admin/kampagne/ehandelsdagen-2027', { adminCookie: ac });
  assert.equal(l.body.crm_mangler, 0);
  const s = await api(h.baseUrl, 'POST', '/admin/kampagne/ehandelsdagen-2027/crm-send', { adminCookie: ac });
  assert.equal(s.body.forsoegt, 0);
  assert.equal(crm.kald.length, 1);
});

test('H4: de frivillige felter og telefon medsendes kun, når personen har bedt om opkald', () => {
  const r = { email: 'a@b.dk', navn: 'A', firma: 'F', kilde: 'messe', nyhedsbrev: true, klub: 'AGF', telefon: '1', ordrer: '5', hvor: 'x' };
  const uden = kampagneTilCrm(r, 'K');
  assert.equal(uden.phone, undefined);
  assert.equal(uden.notes.ordrer_pr_md, undefined);
  const med = kampagneTilCrm(r, 'K', { ringOp: true });
  assert.equal(med.phone, '1');
  assert.equal(med.notes.ordrer_pr_md, '5');
  assert.equal(med.notes.hvor_knaekker_det, 'x');
  assert.equal(kampagneTilCrm({ ...r, nyhedsbrev: false }, 'K', { ringOp: true }), null);
});

test('M1: Packrush-spillernes telefonnummer sendes ikke til CRM', async (t) => {
  const { crm, h } = await opsaet(t);
  await nySpiller(h, 'Tlf Tester', 'tlf-m1@shop.dk', ['sp'], { telefon: '12345678' });
  const tlf = (await h.pool.query("SELECT telefon FROM spiller WHERE email = 'tlf-m1@shop.dk'")).rows[0].telefon;
  assert.ok(tlf, 'forudsætning: telefonen er gemt');
  await synkOnce(h.pool);
  assert.equal(crm.kald.length, 1);
  assert.ok(!('phone' in crm.kald[0].body));
  assert.ok(!JSON.stringify(crm.kald[0].body).includes('12345678'));
});

test('M3: udfyldt honeypot svarer ok men sender intet; forkert eller manglende Origin afvises', async (t) => {
  const { crm, h } = await opsaet(t);
  const gyldig = { name: 'Bot', email: 'bot-m3@x.dk', type: 'general', message: 'hej' };

  const hp = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { ...gyldig, _hp: 'http://spam' } });
  assert.equal(hp.status, 200);
  assert.equal(hp.body.ok, true);

  const hp2 = await api(h.baseUrl, 'POST', '/kampagne/tilmeld', {
    body: { navn: 'B', firma: 'F', email: 'bot2-m3@x.dk', nyhedsbrev: true, _hp: 'x' },
  });
  assert.equal(hp2.status, 201);
  assert.equal((await h.pool.query('SELECT 1 FROM kampagne_tilmelding')).rowCount, 0);

  const forkert = await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: gyldig, headers: { origin: 'https://ond.example' } });
  assert.equal(forkert.status, 403);
  const mangler = await fetch(h.baseUrl + '/kampagne/tilmeld', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ navn: 'B', firma: 'F', email: 'curl-m3@x.dk' }),
  });
  assert.equal(mangler.status, 403);
  assert.equal((await h.pool.query('SELECT 1 FROM kampagne_tilmelding')).rowCount, 0);

  // Referer uden Origin accepteres, hvis den er fra smartpack.dk
  const ref = await fetch(h.baseUrl + '/hjemmeside/kontakt', {
    method: 'POST',
    headers: { 'content-type': 'application/json', referer: 'https://smartpack.dk/messe?kilde=digiday' },
    body: JSON.stringify(gyldig),
  });
  assert.equal(ref.status, 200);
  const refForkert = await fetch(h.baseUrl + '/hjemmeside/kontakt', {
    method: 'POST',
    headers: { 'content-type': 'application/json', referer: 'https://smartpack.dk.ond.example/' },
    body: JSON.stringify(gyldig),
  });
  assert.equal(refForkert.status, 403);

  // kun Referer-kaldet kom frem til CRM'et (kontaktformularen)
  assert.equal(crm.kald.length, 1);
  assert.equal(crm.kald[0].body.email, 'bot-m3@x.dk');
  assert.equal(crm.kald[0].body._hp, undefined);
});

test('M4: en fremmed kan ikke overskrive en andens kampagnetilmelding, kun udfylde tomme felter', async (t) => {
  const { h } = await opsaet(t);
  const post = (b) => api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { email: 'offer-m4@x.dk', ...b } });
  await post({ navn: 'Offer', firma: 'Rigtig Shop', klub: 'AGF', kilde: 'digiday' });
  await post({ navn: 'Fremmed', firma: 'Falsk A/S', klub: 'FCK', telefon: '99999999', kilde: 'messe' });
  const r = (await h.pool.query('SELECT navn, firma, klub, telefon, kilde, kilder FROM kampagne_tilmelding')).rows;
  assert.equal(r.length, 1);
  assert.equal(r[0].navn, 'Offer');
  assert.equal(r[0].firma, 'Rigtig Shop');
  assert.equal(r[0].klub, 'AGF');
  assert.equal(r[0].kilde, 'digiday');
  assert.equal(r[0].telefon, '99999999', 'tomt felt udfyldes');
  assert.deepEqual(r[0].kilder.slice().sort(), ['digiday', 'messe']);
});

test('M5: en samtykke-række, der først bliver synlig efter en senere én, sendes stadig', async (t) => {
  const { crm, h } = await opsaet(t);
  await nySpiller(h, 'Tidlig', 'tidlig-m5@shop.dk');
  await nySpiller(h, 'Sen', 'sen-m5@shop.dk');
  // Simuler, at Tidligs række (lavt id) først committer efter Sens (højt id)
  await h.pool.query(
    "UPDATE samtykke SET liste = 'ikke-synlig-endnu' WHERE spiller_id = (SELECT id FROM spiller WHERE email = 'tidlig-m5@shop.dk') AND liste = 'smartpack'"
  );
  await synkOnce(h.pool);
  assert.deepEqual(crm.kald.map((k) => k.body.email), ['sen-m5@shop.dk']);
  await h.pool.query("UPDATE samtykke SET liste = 'smartpack' WHERE liste = 'ikke-synlig-endnu'");
  await synkOnce(h.pool);
  assert.deepEqual(crm.kald.map((k) => k.body.email), ['sen-m5@shop.dk', 'tidlig-m5@shop.dk']);
});

test('M6: et gentaget ja (dagens flueben) giver intet nyt CRM-kald, kun en reel statusændring gør', async (t) => {
  const { crm, h } = await opsaet(t);
  await nySpiller(h, 'Dag', 'dag-m6@shop.dk');
  await synkOnce(h.pool);
  assert.equal(crm.kald.length, 1);

  const log = (type, kilde) =>
    h.pool.query(
      `INSERT INTO samtykke (spiller_id, liste, type, kilde)
       SELECT id, 'smartpack', $1, $2 FROM spiller WHERE email = 'dag-m6@shop.dk'`,
      [type, kilde]
    );
  await log('bekraeftet', 'ticks');
  await log('bekraeftet', 'ticks');
  const r = await synkOnce(h.pool);
  assert.equal(r.sendt, 0);
  assert.equal(crm.kald.length, 1);

  // Afmeld -> ét unsubscribe; endnu en afmelding -> intet; ja igen -> ét nyt ja
  await log('trukket_tilbage', 'subs');
  await log('trukket_tilbage', 'subs');
  await synkOnce(h.pool);
  assert.deepEqual(crm.kald.map((k) => k.url), ['/api/v1/newsletter', '/api/v1/newsletter/unsubscribe']);
  await log('bekraeftet', 'ticks');
  await synkOnce(h.pool);
  assert.equal(crm.kald.length, 3);
  assert.equal(crm.kald[2].url, '/api/v1/newsletter');
});

test('M7: kontaktformularen logger aldrig indsenderens e-mail, hverken ved CRM-fejl eller uden nøgle', async (t) => {
  const { h } = await opsaet(t, (body) => [500, JSON.stringify({ error: 'Fejl for ' + body.email })]);
  const log = fangLog();
  try {
    await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { name: 'L', email: 'log-m7@x.dk', message: 'hej' } });
    delete process.env.SMARTPACK_CRM_KEY;
    await api(h.baseUrl, 'POST', '/hjemmeside/kontakt', { body: { name: 'L', email: 'log-m7@x.dk', message: 'hej' } });
  } finally {
    log.stop();
  }
  assert.ok(log.linjer.length >= 2);
  assert.ok(!log.linjer.join('\n').includes('log-m7@x.dk'));
});

test('M7: CRM-fejltekster med indsenderens e-mail gemmes uden e-mailen', async (t) => {
  const { h } = await opsaet(t, (body) => [500, JSON.stringify({ error: 'Kan ikke sende til ' + body.email })]);
  await api(h.baseUrl, 'POST', '/kampagne/tilmeld', { body: { navn: 'E', firma: 'F', email: 'ekko-m7@x.dk', nyhedsbrev: true } });
  await vent(400);
  const fejl = (await h.pool.query('SELECT crm_fejl FROM kampagne_tilmelding')).rows[0].crm_fejl;
  assert.match(fejl, /HTTP 500/);
  assert.ok(!fejl.includes('ekko-m7@x.dk'));
});

test('migration 020: markerer kun rækker op til den gamle markør som behandlet, og kan køres igen', async (t) => {
  const { h } = await opsaet(t);
  await nySpiller(h, 'Gammel', 'gammel-mig@shop.dk');
  await nySpiller(h, 'Ny', 'ny-mig@shop.dk');
  const ids = (await h.pool.query("SELECT id FROM samtykke WHERE liste = 'smartpack' ORDER BY id")).rows.map((r) => Number(r.id));
  // Gendan tilstanden før 020: ingen kolonne/tabel, og markøren står ved den første række
  await h.pool.query('DROP TABLE crm_udbakke');
  await h.pool.query('DROP INDEX samtykke_crm_ubehandlet_idx');
  await h.pool.query('ALTER TABLE samtykke DROP COLUMN crm_synk_status');
  await h.pool.query("UPDATE crm_synk SET sidste_id = $1 WHERE navn = 'samtykke_smartpack'", [ids[0]]);
  const sql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '020_crm_udbakke_og_synkstatus.sql'), 'utf8');
  await h.pool.query(sql);
  await h.pool.query(sql); // idempotent
  const st = (await h.pool.query("SELECT id, crm_synk_status FROM samtykke WHERE liste = 'smartpack' ORDER BY id")).rows;
  assert.equal(st[0].crm_synk_status, 'sendt');
  assert.equal(st[1].crm_synk_status, null);
});

test('H1/N2/N4: sletning afmelder kun, når ja er SENDT; admin-slet og DELETE /me afmelder, nulstil og retention gør ikke', async (t) => {
  const { h } = await opsaet(t, undefined, { adminRouterOpts: { runBackup: async () => '/tmp/x.sql' } });
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: 'x-test-adgangskode' } });
  const adminCookie = (login.headers.get('set-cookie') || '').split(';')[0];

  await nySpiller(h, 'Cille Ja', 'cille-n4@shop.dk');
  await nySpiller(h, 'Gus Usendt', 'gus-n4@shop.dk');
  await nySpiller(h, 'Dan Nej', 'dan-n4@shop.dk', []);
  // Gus' ja sendes IKKE (rækken gøres usynlig under synk), så CRM'et ikke kender ham
  await h.pool.query("UPDATE samtykke SET liste = 'senere' WHERE spiller_id = (SELECT id FROM spiller WHERE email = 'gus-n4@shop.dk')");
  await synkOnce(h.pool);
  await h.pool.query("UPDATE samtykke SET liste = 'smartpack' WHERE liste = 'senere'");
  const udbakke = async () => (await h.pool.query('SELECT email FROM crm_udbakke ORDER BY id')).rows.map((r) => r.email);
  const pid = async (email) => (await h.pool.query('SELECT public_id FROM spiller WHERE email = $1', [email])).rows[0].public_id;

  // 1) admin-slet af Gus (ja ikke sendt): ingen afmelding
  assert.equal((await api(h.baseUrl, 'DELETE', '/admin/spillere/' + (await pid('gus-n4@shop.dk')), { adminCookie })).status, 200);
  assert.deepEqual(await udbakke(), []);
  // 2) admin-slet af Cille (ja sendt): afmelding
  assert.equal((await api(h.baseUrl, 'DELETE', '/admin/spillere/' + (await pid('cille-n4@shop.dk')), { adminCookie })).status, 200);
  assert.deepEqual(await udbakke(), ['cille-n4@shop.dk']);

  // 3) retention rammer kun spillere uden aktivt ja: Dan slettes, ingen ny afmelding
  const slettet = await deleteInactivePlayers(h.pool, new Date(Date.now() + 5 * 365 * 86400000));
  assert.ok(slettet >= 1);
  assert.equal((await h.pool.query("SELECT 1 FROM spiller WHERE email = 'dan-n4@shop.dk'")).rowCount, 0);
  assert.deepEqual(await udbakke(), ['cille-n4@shop.dk']);

  // 4) nulstil: en sendt abonnent slettes uden afmelding
  await h.pool.query('DELETE FROM crm_udbakke');
  await nySpiller(h, 'Eva Nulstil', 'eva-n4@shop.dk');
  await synkOnce(h.pool);
  assert.equal((await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } })).status, 200);
  assert.equal((await h.pool.query('SELECT 1 FROM spiller')).rowCount, 0);
  assert.deepEqual(await udbakke(), []);

  // 5) DELETE /me af en sendt abonnent afmelder
  const fie = await nySpiller(h, 'Fie Selv', 'fie-n4@shop.dk');
  await synkOnce(h.pool);
  assert.equal((await api(h.baseUrl, 'DELETE', '/me', { token: fie.token, body: { pinkode: fie.pin } })).status, 200);
  assert.deepEqual(await udbakke(), ['fie-n4@shop.dk']);
});

test('N2: et gentaget ja (markeret sprunget) hindrer ikke afmeldingen, når det første ja blev sendt', async (t) => {
  const { h } = await opsaet(t);
  const a = await nySpiller(h, 'Gentag', 'gentag-n2@shop.dk');
  await synkOnce(h.pool);
  // dagens flueben: ja efter ja bliver 'sprunget', men kontakten findes i CRM'et
  await h.pool.query(
    "INSERT INTO samtykke (spiller_id, liste, type, kilde) SELECT id, 'smartpack', 'bekraeftet', 'ticks' FROM spiller WHERE email = 'gentag-n2@shop.dk'"
  );
  await synkOnce(h.pool);
  assert.equal((await api(h.baseUrl, 'DELETE', '/me', { token: a.token, body: { pinkode: a.pin } })).status, 200);
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 1);
});

for (const kode of [404, 409]) {
  test(`N2: ${kode} på en afmelding i udbakken er færdig, logges med id, og blokerer ikke almindelige tilmeldinger`, async (t) => {
    const { crm, h } = await opsaet(t, (body, url) => (url.endsWith('/unsubscribe') ? [kode, '{}'] : [201, '{}']));
    await h.pool.query("INSERT INTO crm_udbakke (email) VALUES ('ukendt-n2@shop.dk')");
    await nySpiller(h, 'Bo Ny', 'bo-n2@shop.dk');
    const log = fangLog();
    let r;
    try {
      r = await synkOnce(h.pool);
    } finally {
      log.stop();
    }
    assert.equal(r.stop, null);
    assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 0);
    assert.equal(crm.kald.filter((k) => k.body.email === 'bo-n2@shop.dk').length, 1);
    const tekst = log.linjer.join('\n');
    assert.match(tekst, /udbakken id=\d+/);
    assert.ok(!tekst.includes('ukendt-n2@shop.dk'));
  });
}

test('N2: 404 på ALLE afmeldinger (forkert URL) afslutter dem ikke', async (t) => {
  const { h } = await opsaet(t, (body, url) => (url.endsWith('/unsubscribe') ? [404, '{}'] : [201, '{}']));
  for (let i = 0; i < 3; i++) await h.pool.query('INSERT INTO crm_udbakke (email) VALUES ($1)', [`u${i}-n2@shop.dk`]);
  const log = fangLog();
  let r;
  try {
    r = await synkOnce(h.pool);
  } finally {
    log.stop();
  }
  assert.match(r.stop, /404/);
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 3);
});

test('N1: en række, CRM afviser, opgives efter 3 forsøg, og gyldige rækker bagved sendes straks', async (t) => {
  const { crm, h } = await opsaet(t, (body) => (body.email === 'daarlig-n1@shop.dk' ? [400, '{}'] : [201, '{}']));
  await nySpiller(h, 'Daarlig', 'daarlig-n1@shop.dk');
  await nySpiller(h, 'God', 'god-n1@shop.dk');
  const log = fangLog();
  try {
    const r1 = await synkOnce(h.pool);
    assert.equal(r1.stop, null, 'afvisningen stopper ikke jobbet');
    assert.equal(r1.sendt, 1, 'den gyldige række bagved sendes i samme kørsel');
    const status = async () =>
      (await h.pool.query("SELECT crm_synk_status AS s, crm_forsoeg AS f FROM samtykke WHERE spiller_id = (SELECT id FROM spiller WHERE email = 'daarlig-n1@shop.dk')")).rows[0];
    assert.deepEqual(await status(), { s: null, f: 1 });

    // Inden ventetiden er gået, forsøges rækken ikke igen
    const n = crm.kald.length;
    await synkOnce(h.pool);
    assert.equal(crm.kald.length, n);

    const frem = () => h.pool.query("UPDATE samtykke SET crm_naeste_forsoeg = now() - interval '1 minute'");
    await frem();
    await synkOnce(h.pool);
    assert.deepEqual(await status(), { s: null, f: 2 });
    await frem();
    await synkOnce(h.pool);
    assert.deepEqual(await status(), { s: 'sprunget', f: 3 });
  } finally {
    log.stop();
  }
  assert.ok(!log.linjer.join('\n').includes('daarlig-n1@shop.dk'));
});

test('N1: 5 afviste rækker i samme kørsel giver pause og alarm, ikke et evigt stop; gyldige rækker sendes bagefter', async (t) => {
  const { crm, h } = await opsaet(t, (body) => (/^x\d-n1/.test(body.email) ? [422, '{"error":"Ugyldig"}'] : [201, '{}']));
  for (let i = 0; i < 5; i++) await nySpiller(h, 'X' + i, `x${i}-n1@shop.dk`);
  await nySpiller(h, 'God', 'god2-n1@shop.dk');
  const log = fangLog();
  try {
    const r1 = await synkOnce(h.pool);
    assert.match(r1.stop, /for mange afviste/);
    assert.match(log.linjer.join('\n'), /ALARM/);
    // Under pausen sker intet
    const n = crm.kald.length;
    assert.equal((await synkOnce(h.pool)).stop, 'pause');
    assert.equal(crm.kald.length, n);
    // Pausen udløber: de afviste rækker venter, den gyldige sendes
    await h.pool.query("UPDATE crm_synk SET pause_til = now() - interval '1 minute'");
    const r2 = await synkOnce(h.pool);
    assert.equal(r2.stop, null);
    assert.equal(r2.sendt, 1);
    assert.equal(crm.kald[crm.kald.length - 1].body.email, 'god2-n1@shop.dk');
  } finally {
    log.stop();
  }
});

test('N1: en afmelding i udbakken, som CRM afviser, opgives også efter 3 forsøg', async (t) => {
  const { h } = await opsaet(t, () => [422, '{"error":"Ugyldig"}']);
  await h.pool.query("INSERT INTO crm_udbakke (email) VALUES ('ugyldig-n1@shop.dk')");
  const log = fangLog();
  try {
    for (let i = 0; i < 3; i++) {
      await synkOnce(h.pool);
      await h.pool.query("UPDATE crm_udbakke SET crm_naeste_forsoeg = now() - interval '1 minute'");
    }
  } finally {
    log.stop();
  }
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 0);
});

test('N3: /hjemmeside/nyhedsbrev og /afmeld har Origin-tjek, honeypot, rate-limit og logger aldrig e-mail', async (t) => {
  const { crm, h } = await opsaet(t, () => [500, '{"error":"fejl"}']);
  const ond = { origin: 'https://ond.example' };
  assert.equal((await api(h.baseUrl, 'POST', '/hjemmeside/nyhedsbrev', { body: { email: 'a@b.dk', consent: true }, headers: ond })).status, 403);
  assert.equal((await api(h.baseUrl, 'POST', '/hjemmeside/afmeld', { body: { email: 'a@b.dk' }, headers: ond })).status, 403);
  assert.equal(crm.kald.length, 0);

  // Honeypot: ok, men intet sendes
  const hp = await api(h.baseUrl, 'POST', '/hjemmeside/nyhedsbrev', { body: { email: 'bot-n3@b.dk', consent: true, _hp: 'x' } });
  assert.equal(hp.status, 200);
  assert.equal(crm.kald.length, 0);

  // CRM-fejl logges uden e-mail
  const log = fangLog();
  try {
    await api(h.baseUrl, 'POST', '/hjemmeside/nyhedsbrev', { body: { email: 'log-n3@b.dk', consent: true } });
    await api(h.baseUrl, 'POST', '/hjemmeside/afmeld', { body: { email: 'log-n3@b.dk' } });
  } finally {
    log.stop();
  }
  assert.equal(log.linjer.length, 2);
  assert.ok(!log.linjer.join('\n').includes('log-n3@b.dk'));

  // Pr. e-mail: 3 pr. 10 min (afmeldingen ovenfor tæller med)
  const afm = (email) => api(h.baseUrl, 'POST', '/hjemmeside/afmeld', { body: { email } });
  assert.equal((await afm('log-n3@b.dk')).status, 200);
  assert.equal((await afm('log-n3@b.dk')).status, 200);
  assert.equal((await afm('LOG-n3@b.dk')).status, 429);
  // Pr. IP: 10 pr. minut
  let sidste;
  for (let i = 0; i < 10; i++) sidste = await afm(`ip${i}-n3@b.dk`);
  assert.equal(sidste.status, 429);
});

test('N2-race: sletning midt i afsendelsen af et ja giver en afmelding i udbakken, som derefter sendes', async (t) => {
  let h2;
  let slettet = false;
  const { crm, h } = await opsaet(t, async (body, url) => {
    // Midt i afsendelsen af ja'et sletter spilleren sig (committet, før CRM'et svarer)
    if (!url.endsWith('/unsubscribe') && body.email === 'race@shop.dk' && !slettet) {
      slettet = true;
      const client = await h2.pool.connect();
      try {
        await client.query('BEGIN');
        const { rows } = await client.query("SELECT id, navn FROM spiller WHERE email = 'race@shop.dk' FOR UPDATE");
        await deletePlayerFully(client, rows[0].id, rows[0].navn);
        await client.query('COMMIT');
      } finally {
        client.release();
      }
    }
    return [201, '{}'];
  });
  h2 = h;
  await nySpiller(h, 'Race', 'race@shop.dk');
  const r1 = await synkOnce(h.pool);
  assert.equal(r1.stop, null);
  assert.ok(slettet);
  assert.equal((await h.pool.query("SELECT 1 FROM spiller WHERE email = 'race@shop.dk'")).rowCount, 0);
  assert.deepEqual((await h.pool.query('SELECT email FROM crm_udbakke')).rows.map((x) => x.email), ['race@shop.dk']);

  await synkOnce(h.pool);
  const sidste = crm.kald[crm.kald.length - 1];
  assert.equal(sidste.url, '/api/v1/newsletter/unsubscribe');
  assert.equal(sidste.body.email, 'race@shop.dk');
  assert.equal((await h.pool.query('SELECT 1 FROM crm_udbakke')).rowCount, 0);
});

test('N2-race: sletning, der venter på samtykke-rækkens lås, ser status sendt og afmelder selv', async (t) => {
  const { h } = await opsaet(t);
  await nySpiller(h, 'Laas', 'laas@shop.dk');
  // crmSynk "holder" rækken: en åben transaktion har den låst og markerer den sendt, mens sletningen starter
  const sync = await h.pool.connect();
  const del = await h.pool.connect();
  try {
    await sync.query('BEGIN');
    await sync.query("UPDATE samtykke SET crm_synk_status = 'sendt' WHERE liste = 'smartpack'");
    await del.query('BEGIN');
    const { rows } = await del.query("SELECT id, navn FROM spiller WHERE email = 'laas@shop.dk' FOR UPDATE");
    const sletning = deletePlayerFully(del, rows[0].id, rows[0].navn).then(() => del.query('COMMIT'));
    await vent(300); // sletningen står og venter på rækkelåsen
    await sync.query('COMMIT');
    await sletning;
  } finally {
    sync.release();
    del.release();
  }
  assert.deepEqual((await h.pool.query('SELECT email FROM crm_udbakke')).rows.map((x) => x.email), ['laas@shop.dk']);
});
