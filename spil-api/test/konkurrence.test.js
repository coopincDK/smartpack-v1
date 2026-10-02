'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');
const { lodderFor, vinderFraTal, parseDeltagerliste } = require('../src/konkurrence');

async function adminCookie(h) {
  const r = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  return (r.headers.get('set-cookie') || '').split(';')[0];
}

async function spiller(h, email, firma) {
  const { body } = registrerSpiller(h.baseUrl, { email, firma });
  const r = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(r.status, 201);
  return (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
}

async function spil(h, spillerId, samlet, slut) {
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet)
     VALUES ($1, gen_random_uuid(), $2::timestamptz - interval '2 minutes', $2, $3, 'godkendt', $2)`,
    [spillerId, slut, samlet]
  );
}

test('1 lod pr. påbegyndte 500 point', () => {
  assert.equal(lodderFor(0, 500), 0);
  assert.equal(lodderFor(1, 500), 1);
  assert.equal(lodderFor(500, 500), 1);
  assert.equal(lodderFor(501, 500), 2);
  assert.equal(lodderFor(2986, 500), 6);
});

test('vinderFraTal fordeler tallene efter lodder', () => {
  const f = [{ firma: 'A', lodder: 2 }, { firma: 'B', lodder: 3 }];
  assert.equal(vinderFraTal(f, 0).firma, 'A');
  assert.equal(vinderFraTal(f, 1).firma, 'A');
  assert.equal(vinderFraTal(f, 2).firma, 'B');
  assert.equal(vinderFraTal(f, 4).firma, 'B');
  assert.equal(vinderFraTal(f, 5), null);
});

test('deltagerliste fra Google Sheets: vælger kolonne, springer overskrift og dubletter over', () => {
  const m = parseDeltagerliste('Navn\tTitel\tFirma\nAnna\tCEO\tHello Retail ApS\nBo\tCTO\thelloretail.dk\nCia\tCMO\tMinShop', 2);
  assert.deepEqual([...m.keys()], ['navn', 'helloretail', 'minshop'].filter((k) => k !== 'navn'));
});

test('lodder: kun spil i perioden, firmaets bedste spil, kun firmaer på listen, SmartPack udelukket; trækningen dokumenteres', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);

  const imp = await api(h.baseUrl, 'POST', '/admin/deltagerliste', {
    adminCookie: ac,
    body: { tekst: 'Firma\nHello Retail ApS\nMinShop A/S\nSmartPack ApS' },
  });
  assert.equal(imp.status, 200);
  assert.equal(imp.body.antal, 3);

  const a1 = await spiller(h, 'a1@example.dk', 'helloretail.dk');
  const a2 = await spiller(h, 'a2@example.dk', 'Hello Retail');
  const b = await spiller(h, 'b@example.dk', 'MinShop');
  const c = await spiller(h, 'c@example.dk', 'Ikke Paa Listen');
  const sp = await spiller(h, 'sp@example.dk', 'SmartPack');

  const iPerioden = '2026-10-08 12:00:00+02';
  await spil(h, a1, 2986, iPerioden); // 6 lodder
  await spil(h, a2, 1200, iPerioden); // samme firma, lavere: tæller ikke
  await spil(h, a2, 9999, '2026-10-08 16:31:00+02'); // efter lukning: tæller ikke
  await spil(h, b, 400, iPerioden); // 1 lod
  await spil(h, c, 5000, iPerioden); // ikke på listen
  await spil(h, sp, 5000, iPerioden); // udelukket

  const l = await api(h.baseUrl, 'GET', '/admin/konkurrence/lodder', { adminCookie: ac });
  assert.equal(l.status, 200);
  assert.equal(l.body.lodder_i_alt, 7);
  const hr = l.body.firmaer.find((f) => f.firma_noegle === 'helloretail');
  assert.equal(hr.bedste, 2986);
  assert.equal(hr.lodder, 6);
  assert.equal(hr.kan_vinde, true);
  assert.equal(l.body.firmaer.find((f) => f.firma_noegle === 'ikkepaalisten').kan_vinde, false);
  const spf = l.body.firmaer.find((f) => f.firma_noegle === 'smartpack');
  assert.equal(spf.udelukket, true);
  assert.equal(spf.kan_vinde, false);

  const tr = await api(h.baseUrl, 'POST', '/admin/konkurrence/traek', { adminCookie: ac });
  assert.equal(tr.status, 200);
  assert.ok(['Hello Retail ApS', 'MinShop A/S'].includes(tr.body.vinder.firma));
  assert.equal(tr.body.lodder_i_alt, 7);

  const log = await api(h.baseUrl, 'GET', '/admin/konkurrence/traekninger', { adminCookie: ac });
  assert.equal(log.body.traekninger.length, 1);
  const g = log.body.traekninger[0];
  assert.equal(g.grundlag.length, 2);
  const genskabt = vinderFraTal(g.grundlag, g.tilfaeldigt_tal);
  assert.equal(genskabt.firma_noegle === 'helloretail' ? 'Hello Retail ApS' : 'MinShop A/S', g.vinder_firma);
});

test('ingen lodder -> ingen trækning', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);
  const tr = await api(h.baseUrl, 'POST', '/admin/konkurrence/traek', { adminCookie: ac });
  assert.equal(tr.status, 400);
  assert.equal(tr.body.kode, 'ingen_lodder');
});

test('tjekliste: tom konkurrence giver fejl, og de forsvinder, når alt er på plads', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());
  const ac = await adminCookie(h);
  let st = await api(h.baseUrl, 'GET', '/admin/konkurrence/status', { adminCookie: ac });
  assert.equal(st.status, 200);
  const tekster = st.body.advarsler.map((a) => a.tekst).join(' | ');
  assert.match(tekster, /Deltagerlisten er tom/);
  assert.match(tekster, /Ingen partnere vises/);
  assert.match(tekster, /Præmiepuljen er tom/);

  await api(h.baseUrl, 'POST', '/admin/deltagerliste', { adminCookie: ac, body: { tekst: 'Webshop ApS' } });
  const p = await api(h.baseUrl, 'POST', '/admin/partnere', {
    adminCookie: ac,
    body: {
      navn: 'Herodesk', firmanavn: 'Herodesk ApS', hjemmeside: 'herodesk.dk', kort_beskrivelse: 'AI', cvr: '12345678',
      produktkategori: 'kundeservice', privatlivspolitik: 'herodesk.dk/p', vist_i_spil: true,
      giver_praemie: true, praemie_titel: 'Gave', praemie_vaerdi: 1000, praemie_beskrivelse: 'x',
      praemie_indloesning: 'mail', praemie_sidste_frist: '2027-06-30',
    },
  });
  st = await api(h.baseUrl, 'GET', '/admin/konkurrence/status', { adminCookie: ac });
  assert.equal(st.body.antal_fejl, 0, JSON.stringify(st.body.advarsler));
  const herodesk = st.body.advarsler.filter((a) => a.partner === 'Herodesk').map((a) => a.tekst).join(' | ');
  assert.match(herodesk, /Ingen power-up/);
  assert.match(herodesk, /intet login/);
  assert.match(herodesk, /ikke godkendt partnervilkårene/);
  assert.ok(p.body.partner.id);
});
