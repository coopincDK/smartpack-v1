'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller, slaaSmsTil } = require('./helpers/appHarness');
const { koer } = require('../src/smsJobs');

test('sms: timens boss, åbning og dubletter; kun til spillere med sms-samtykke', async (t) => {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c));
    req.on('end', () => { kald.push({ auth: req.headers.authorization, body: JSON.parse(b) }); res.writeHead(200, { 'content-type': 'application/json' }); res.end('{}'); });
  });
  await new Promise((r) => srv.listen(0, r));
  process.env.INMOBILE_URL = `http://127.0.0.1:${srv.address().port}/v4`;
  process.env.INMOBILE_API_KEY = 'testnoegle';
  const h = await startHarness();
  t.after(async () => { await h.teardown(); srv.close(); delete process.env.INMOBILE_URL; delete process.env.INMOBILE_API_KEY; });

  await slaaSmsTil(h.pool);
  async function spiller(email, sms) {
    const { body } = registrerSpiller(h.baseUrl, { email, telefon: sms ? '2' + String(Math.floor(Math.random() * 1e7)).padStart(7, '0') : undefined, tilmeldinger: sms ? ['sms'] : [] });
    const r = await api(h.baseUrl, 'POST', '/players', { body });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
  }
  const a = await spiller('a@x.dk', true);
  const b = await spiller('b@x.dk', false);
  // Turnering i dag kl. 10.00-12.00 dansk tid; "nu" = 12.05
  const dag = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(new Date());
  const off = new Date().toLocaleString('en', { timeZone: 'Europe/Copenhagen', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/)[1];
  const tz = (hh) => new Date(`${dag}T${hh}:00${off.length === 2 ? off[0] + '0' + off[1] : off}:00`);
  await h.pool.query('UPDATE konkurrence SET spil_start = $1, spil_slut = $2 WHERE id = 1', [tz('10:00'), tz('12:00')]);
  const spil = (id, samlet, hhmm) => h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2::timestamptz - interval '2 minutes', $2, $3, 'godkendt', $2)`,
    [id, tz(hhmm), samlet]
  );
  await spil(a, 5000, '10:20'); await spil(b, 3000, '10:30');
  await spil(a, 9000, '11:10'); await spil(b, 4000, '11:20');

  await koer(h.pool, tz('12:05'));
  const tv = (await h.pool.query('SELECT time, spiller_id FROM time_vinder ORDER BY time')).rows;
  assert.deepEqual(tv.map((r) => [r.time, String(r.spiller_id)]), [[1100, String(a)], [1200, String(b)]], 'a vinder første time, b anden (én time pr. dag)');

  // Uden for 8-21 sendes intet; i testmiljøet afgør klokken, så vi tjekker kun log/dubletter
  const log1 = (await h.pool.query("SELECT type, status FROM sms_log WHERE type = 'timens_boss'")).rows;
  assert.equal(log1.length, 1, 'kun a har sms-samtykke');
  await koer(h.pool, tz('12:06'));
  const log2 = (await h.pool.query("SELECT count(*)::int n FROM sms_log WHERE type = 'timens_boss'")).rows[0].n;
  assert.equal(log2, 1, 'ingen dublet');
  if (log1[0].status === 'sendt') {
    assert.equal(kald[0].body.messages[0].from, 'Packrush');
    assert.equal(kald[0].auth, 'Basic ' + Buffer.from('x:testnoegle').toString('base64'));
  }

  // Admin: log og test-sms
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const lg = await api(h.baseUrl, 'GET', '/admin/sms', { adminCookie: ac });
  assert.equal(lg.status, 200); assert.equal(lg.body.har_noegle, true); assert.equal(lg.body.timens_boss.length, 2);
  const tst = await api(h.baseUrl, 'POST', '/admin/sms/test', { adminCookie: ac, body: { telefon: '23247508' } });
  assert.equal(tst.status, 200, JSON.stringify(tst.body));
  assert.equal(kald[kald.length - 1].body.messages[0].to, '4523247508');
});

test('sms: login og startkode til ny partnerbruger, kun når admin beder om det', async (t) => {
  const kald = [];
  const srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c));
    req.on('end', () => { kald.push(JSON.parse(b)); res.writeHead(200, { 'content-type': 'application/json' }); res.end('{}'); });
  });
  await new Promise((r) => srv.listen(0, r));
  process.env.INMOBILE_URL = `http://127.0.0.1:${srv.address().port}/v4`;
  process.env.INMOBILE_API_KEY = 'testnoegle';
  const h = await startHarness();
  t.after(async () => { await h.teardown(); srv.close(); delete process.env.INMOBILE_URL; delete process.env.INMOBILE_API_KEY; });
  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const ac = (login.headers.get('set-cookie') || '').split(';')[0];
  const p = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Testpartner', firmanavn: 'Testpartner ApS' } });
  assert.equal(p.status, 201, JSON.stringify(p.body));
  const pid = p.body.partner.id;
  const uden = await api(h.baseUrl, 'POST', `/admin/partnere/${pid}/brugere`, { adminCookie: ac, body: { email: 'a@p.dk', kode: 'startkode123' } });
  assert.equal(uden.status, 201); assert.equal(uden.body.sms, null); assert.equal(kald.length, 0);
  const med = await api(h.baseUrl, 'POST', `/admin/partnere/${pid}/brugere`, { adminCookie: ac, body: { email: 'b@p.dk', kode: 'startkode456', sms_telefon: '22792914' } });
  assert.equal(med.status, 201); assert.equal(med.body.sms.ok, true);
  assert.equal(kald.length, 1);
  assert.equal(kald[0].messages[0].to, '4522792914');
  assert.equal(kald[0].messages[0].from, 'Packrush');
  assert.match(kald[0].messages[0].text, /b@p\.dk.*startkode456/);
  const nul = await api(h.baseUrl, 'POST', `/admin/partner-brugere/${med.body.bruger.id}/nulstil`, { adminCookie: ac, body: { kode: 'nykode789xx', sms_telefon: '22792914' } });
  assert.equal(nul.body.sms.ok, true);
  assert.match(kald[1].messages[0].text, /Ny startkode.*nykode789xx/);
});
