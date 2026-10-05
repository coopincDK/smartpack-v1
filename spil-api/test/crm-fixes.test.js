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

// svar(body, url) -> [status, tekst]. Standard: 201.
function fakeCrm(svar = () => [201, '{}']) {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      const body = JSON.parse(b || '{}');
      kald.push({ url: req.url, body });
      const [status, txt] = svar(body, req.url);
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

async function opsaet(t, svar) {
  const crm = await fakeCrm(svar);
  process.env.SMARTPACK_CRM_URL = crm.url;
  process.env.SMARTPACK_CRM_KEY = 'spk_hemmelig_noegle';
  const h = await startHarness();
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

test('H1: admin-sletning og retention (deletePlayerFully) afmelder kun spillere med aktivt ja', async (t) => {
  const { h } = await opsaet(t);
  await nySpiller(h, 'Cille Ja', 'cille-h1@shop.dk');
  await nySpiller(h, 'Dan Nej', 'dan-h1@shop.dk', []);
  const eva = await nySpiller(h, 'Eva Tilbage', 'eva-h1@shop.dk');
  await api(h.baseUrl, 'DELETE', '/me/subs/sp', { token: eva.token });

  const client = await h.pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id, navn FROM spiller ORDER BY id FOR UPDATE');
    for (const r of rows) await deletePlayerFully(client, r.id, r.navn);
    await client.query('COMMIT');
  } finally {
    client.release();
  }
  const ud = (await h.pool.query('SELECT email FROM crm_udbakke')).rows.map((r) => r.email);
  assert.deepEqual(ud, ['cille-h1@shop.dk']);
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

test('H2: en reel valideringsfejl (422 med fejltekst) springer kun den række over og logger række-id, ikke e-mail', async (t) => {
  const { crm, h } = await opsaet(t, (body) =>
    body.email === 'daarlig-h2@shop.dk' ? [422, '{"error":"Ugyldig e-mail"}'] : [201, '{}']
  );
  await nySpiller(h, 'Daarlig', 'daarlig-h2@shop.dk');
  await nySpiller(h, 'God', 'god-h2@shop.dk');
  const log = fangLog();
  let r;
  try {
    r = await synkOnce(h.pool);
  } finally {
    log.stop();
  }
  assert.equal(r.stop, null);
  assert.equal(r.sendt, 1);
  assert.equal(crm.kald.length, 2);
  const stat = (await h.pool.query("SELECT crm_synk_status FROM samtykke WHERE liste = 'smartpack' ORDER BY id")).rows;
  assert.deepEqual(stat.map((x) => x.crm_synk_status), ['sprunget', 'sendt']);
  const tekst = log.linjer.join('\n');
  assert.match(tekst, /springer samtykke id=\d+/);
  assert.ok(!tekst.includes('daarlig-h2@shop.dk'));
});

test('H2: en 400 uden fejltekst, eller mange afviste rækker i træk, tolkes som opsætningsfejl og stopper', async (t) => {
  let svar = [400, '{}'];
  const { h } = await opsaet(t, () => svar);
  await nySpiller(h, 'A', 'a-h2b@shop.dk');
  const log = fangLog();
  try {
    assert.match((await synkOnce(h.pool)).stop, /HTTP 400/);
    svar = [422, '{"error":"Ugyldig"}'];
    for (let i = 0; i < 5; i++) await nySpiller(h, 'X' + i, `x${i}-h2b@shop.dk`);
    const r = await synkOnce(h.pool);
    assert.match(r.stop, /for mange afviste/);
  } finally {
    log.stop();
  }
  const markeret = (await h.pool.query('SELECT 1 FROM samtykke WHERE crm_synk_status IS NOT NULL')).rowCount;
  assert.equal(markeret, 0, 'intet er markeret, da kørslen stoppede');
});

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
