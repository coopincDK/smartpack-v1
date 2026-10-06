'use strict';

// Rettelser efter sms-gennemgangen: døgnloft, samtykkefilter i åbning, nødstop,
// afvisning fra inMobile, vinder-sms, samtykketekst, nummerskifte og sletning.
// Klokken fryses til kl. 12 dansk tid i dag (send() tillader kun kl. 8-21).

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { hashPassword } = require('../src/crypto');
const ADMIN_PW = 'test-admin-adgangskode';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';
const { startHarness, api, registrerSpiller, slaaSmsTil } = require('./helpers/appHarness');
const { koer } = require('../src/smsJobs');
const { send, nulstilAutoStop } = require('../src/sms');
const { SMS_SAMTYKKE_TEKST } = require('../src/rules/life');
const { deletePlayerFully } = require('../src/playerDeletion');
const { matchNoegle } = require('../src/konkurrence');

const dag = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(new Date());
const off = new Date().toLocaleString('en', { timeZone: 'Europe/Copenhagen', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/)[1];
const tz = (hh) => new Date(`${dag}T${hh}:00${off.length === 2 ? off[0] + '0' + off[1] : off}:00`);
const KL12 = tz('12:00');

let nr = 20000000;
const nytNummer = () => String(++nr);

// Falsk inMobile. mode: 200 | 401 | 400 | 'modtager' (200 med fejl i svaret).
async function startInMobile() {
  const s = { kald: [], mode: 200 };
  s.srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c));
    req.on('end', () => {
      s.kald.push(JSON.parse(b));
      if (s.mode === 'modtager') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"results":[{"error":"invalid number"}]}'); }
      res.writeHead(s.mode, { 'content-type': 'application/json' }); res.end('{}');
    });
  });
  await new Promise((r) => s.srv.listen(0, r));
  process.env.INMOBILE_URL = `http://127.0.0.1:${s.srv.address().port}/v4`;
  process.env.INMOBILE_API_KEY = 'testnoegle';
  return s;
}

async function opsaet(t, { sms = true, poolMax } = {}) {
  nulstilAutoStop();
  const im = await startInMobile();
  const h = await startHarness({ poolMax });
  t.mock.timers.enable({ apis: ['Date'], now: KL12 });
  t.after(async () => {
    t.mock.timers.reset();
    await h.teardown(); im.srv.close();
    for (const k of ['INMOBILE_URL', 'INMOBILE_API_KEY', 'SMS_MAKS_PR_DOEGN', 'SMS_AABNING_MAKS', 'SMS_IP_MAKS_PR_TIME']) delete process.env[k];
  });
  if (sms) await slaaSmsTil(h.pool);
  // Turnering i dag kl. 12.00-18.00, så "nu" kl. 12.00 ligger i åbningstimen
  await h.pool.query('UPDATE konkurrence SET spil_start = $1, spil_slut = $2 WHERE id = 1', [tz('12:00'), tz('18:00')]);
  const admin = async () => {
    const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
    return (login.headers.get('set-cookie') || '').split(';')[0];
  };
  // Spiller med sms-samtykke via den rigtige registrering.
  async function spiller(email, { sms: medSms = true, telefon = nytNummer(), headers, spil = true } = {}) {
    const { body } = registrerSpiller(h.baseUrl, { email, telefon, tilmeldinger: medSms ? ['sms'] : [] });
    const r = await api(h.baseUrl, 'POST', '/players', { body, headers });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const id = (await h.pool.query('SELECT id FROM spiller WHERE email = $1', [email])).rows[0].id;
    // Et godkendt spil før turneringen (åbningen kræver mindst ét), uden for timens boss' vindue
    if (spil) {
      await h.pool.query(
        `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2, $3, 1, 'godkendt', $3)`,
        [id, tz('11:00'), tz('11:02')]
      );
    }
    return { id, token: r.body.token, telefon, body: r.body };
  }
  const log = async (type) => (await h.pool.query('SELECT status, spiller_id, tekst FROM sms_log WHERE type = $1 ORDER BY id', [type])).rows;
  return { im, h, admin, spiller, log };
}

test('døgnloft: samlet loft og underloft for åbning, også med parallelle kørsler', async (t) => {
  const { im, h, spiller, log, admin } = await opsaet(t);
  process.env.SMS_MAKS_PR_DOEGN = '3';
  for (let i = 0; i < 5; i++) await spiller(`l${i}@x.dk`);
  // To kørsler på samme tid må tilsammen højst sende 3
  await Promise.all([koer(h.pool, KL12), koer(h.pool, KL12)]);
  const rows = await log('aabning');
  assert.equal(rows.filter((r) => r.status === 'sendt').length, 3, JSON.stringify(rows));
  assert.equal(rows.filter((r) => r.status === 'over_doegnloft').length, 2);
  assert.equal(im.kald.length, 3, 'kun tre kald til inMobile');

  // Atomisk: ti samtidige send() med to pladser tilbage under loft 5 giver præcis to kald
  process.env.SMS_MAKS_PR_DOEGN = '5';
  im.kald.length = 0;
  const res = await Promise.all(Array.from({ length: 10 }, (_, i) => send(h.pool, { type: 'vinder', noegle: 'p' + i, til: nytNummer(), tekst: 'x' })));
  assert.equal(res.filter((r) => r.ok).length, 2);
  assert.equal(im.kald.length, 2);

  // Admins test-sms er også under loftet
  const ac = await admin();
  const tst = await api(h.baseUrl, 'POST', '/admin/sms/test', { adminCookie: ac, body: { telefon: nytNummer() } });
  assert.equal(tst.status, 502);
  assert.equal(tst.body.grund, 'over_doegnloft');
});

test('underloft for åbning stopper ikke de andre sms-typer', async (t) => {
  const { im, h, spiller, log } = await opsaet(t);
  process.env.SMS_AABNING_MAKS = '2';
  for (let i = 0; i < 4; i++) await spiller(`u${i}@x.dk`);
  await koer(h.pool, KL12);
  const rows = await log('aabning');
  assert.equal(rows.filter((r) => r.status === 'sendt').length, 2);
  assert.equal(rows.filter((r) => r.status === 'over_aabningsloft').length, 2);
  const r = await send(h.pool, { type: 'vinder', noegle: 'v1', til: nytNummer(), tekst: 'x' });
  assert.equal(r.ok, true, 'vinder-sms er ikke åbningens underloft');
  assert.equal(im.kald.length, 3);
});

test('åbning: kun seneste bekræftede samtykke inden for 7 dage med gemt tekst', async (t) => {
  const { im, h, spiller, log } = await opsaet(t);
  const ny = await spiller('ny@x.dk');
  const gammel = await spiller('gammel@x.dk');
  const utekst = await spiller('utekst@x.dk');
  const traekt = await spiller('traekt@x.dk');
  const skjult = await spiller('skjult@x.dk');
  const udenSpil = await spiller('udenspil@x.dk', { spil: false });
  const enkelt = (id, tid, tekst, type = 'bekraeftet') => h.pool.query(
    `INSERT INTO samtykke (spiller_id, liste, tidspunkt, tekst, tekst_version, kilde, type) VALUES ($1,'sms',$2,$3,1,'test',$4)`,
    [id, tid, tekst, type]
  );
  // Gør de tre samtykker "ufuldkomne" ved at erstatte rækkerne
  await h.pool.query("DELETE FROM samtykke WHERE spiller_id = ANY($1) AND liste = 'sms'", [[gammel.id, utekst.id, traekt.id, skjult.id]]);
  assert.ok(udenSpil.id);
  await enkelt(gammel.id, new Date(KL12.getTime() - 8 * 86400e3), 'tekst');
  await enkelt(utekst.id, KL12, null);
  await enkelt(traekt.id, new Date(KL12.getTime() - 3600e3), 'tekst');
  await enkelt(traekt.id, KL12, 'tekst', 'trukket_tilbage');
  await enkelt(skjult.id, KL12, 'tekst');
  await h.pool.query('UPDATE spiller SET skjult = true WHERE id = $1', [skjult.id]);

  await koer(h.pool, KL12);
  const rows = await log('aabning');
  assert.deepEqual(rows.map((r) => String(r.spiller_id)), [String(ny.id)], 'kun den nye spiller med tekst og et godkendt spil får åbningen');
  assert.equal(im.kald.length, 1);
  assert.equal(im.kald[0].messages[0].to, '45' + ny.telefon);
});

test('alle markedsføringssms slutter med en afmeldingslinje', async (t) => {
  const { im, h, spiller } = await opsaet(t);
  const a = await spiller('a@x.dk');
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2, $3, 5000, 'godkendt', $3)`,
    [a.id, tz('12:10'), tz('12:12')]
  );
  // Åbning kl. 12.01, timens boss efter kl. 13; vinder- og efterårs-sms tæller med i grænsen
  // pr. modtager, så de trækkes først bagefter
  await koer(h.pool, tz('12:01'));
  await koer(h.pool, tz('13:05'));
  await h.pool.query(
    `INSERT INTO konkurrence_traekning (spil_start, spil_slut, point_pr_lod, deltagerliste_antal, grundlag, lodder_i_alt, tilfaeldigt_tal, vinder_firma, vinder_firma_noegle)
     VALUES ($1,$2,100,1,'[]',1,0,'Testfirma ApS',$3)`,
    [tz('12:00'), tz('18:00'), matchNoegle('Testfirma ApS')]
  );
  await h.pool.query(`INSERT INTO efteraar_traekning (type, grundlag, lodder_i_alt, vinder_spiller_id) VALUES ('lod','[]',1,$1)`, [a.id]);
  await koer(h.pool, tz('13:06'));
  const typer = await h.pool.query("SELECT type FROM sms_log WHERE status = 'sendt'");
  assert.deepEqual(typer.rows.map((r) => r.type).sort(), ['aabning', 'efteraar', 'timens_boss', 'vinder']);
  assert.equal(im.kald.length, 4);
  for (const k of im.kald) assert.match(k.messages[0].text, /Afmeld sms: smartpack\.dk\/spil, Mine tilmeldinger\.$/);
});

test('nødstop: smsOn og smsAfsendelse stopper alt, admins test-sms og afmelding virker stadig', async (t) => {
  const { im, h, spiller, log, admin } = await opsaet(t);
  const a = await spiller('n@x.dk');
  await h.pool.query(`UPDATE config SET offentlig = offentlig || '{"smsOn": false}'::jsonb WHERE id = 1`);
  await koer(h.pool, KL12);
  assert.equal((await log('aabning')).length, 0, 'smsOn=false: ingen rækker, intet sendt');
  assert.equal(im.kald.length, 0);
  const direkte = await send(h.pool, { type: 'vinder', noegle: 'z', til: nytNummer(), tekst: 'x' });
  assert.equal(direkte.grund, 'sms_slaaet_fra');

  await h.pool.query(`UPDATE config SET offentlig = offentlig || '{"smsOn": true, "smsAfsendelse": false}'::jsonb WHERE id = 1`);
  await koer(h.pool, KL12);
  assert.equal(im.kald.length, 0, 'smsAfsendelse=false stopper også');

  // Admins eksplicitte test-sms går igennem trods nødstop
  const ac = await admin();
  const tst = await api(h.baseUrl, 'POST', '/admin/sms/test', { adminCookie: ac, body: { telefon: nytNummer() } });
  assert.equal(tst.status, 200, JSON.stringify(tst.body));

  // Afmelding fra sms skal virke, også når smsOn er slået fra
  await h.pool.query(`UPDATE config SET offentlig = offentlig || '{"smsOn": false, "smsAfsendelse": true}'::jsonb WHERE id = 1`);
  const af = await api(h.baseUrl, 'POST', '/admin/afmeld', { adminCookie: ac, body: { liste: 'sms', emails: ['n@x.dk'] } });
  assert.equal(af.status, 200, JSON.stringify(af.body));
  const st = await h.pool.query("SELECT seneste_type FROM samtykke_status WHERE spiller_id = $1 AND liste = 'sms'", [a.id]);
  assert.equal(st.rows[0].seneste_type, 'trukket_tilbage');

  // Genoptaget: nødstoppet løftet
  await h.pool.query(`UPDATE config SET offentlig = offentlig || '{"smsOn": true}'::jsonb WHERE id = 1`);
  await koer(h.pool, KL12);
  assert.equal(im.kald.length, 1, 'kun testen er sendt; spilleren er afmeldt');
});

test('inMobile afviser kaldet: opsætningsfejl stopper kørslen og bevarer rækkerne, afvist modtager er endelig', async (t) => {
  const { im, h, spiller, log } = await opsaet(t);
  for (let i = 0; i < 3; i++) await spiller(`m${i}@x.dk`);
  im.mode = 401;
  await koer(h.pool, KL12);
  assert.equal(im.kald.length, 1, 'stopper efter første afvisning');
  assert.equal((await log('aabning')).length, 0, 'rækkerne er fjernet igen, så næste kørsel prøver på ny');
  const taeller = await h.pool.query('SELECT antal FROM sms_taeller');
  assert.equal(taeller.rows[0].antal, 0, 'pladsen under døgnloftet er frigivet');

  im.mode = 200; im.kald.length = 0;
  await koer(h.pool, KL12);
  assert.equal((await log('aabning')).filter((r) => r.status === 'sendt').length, 3, 'næste kørsel sender alle');

  // En afvist modtager i et 2xx-svar er endelig for den ene og stopper ikke de andre
  await h.pool.query('DELETE FROM sms_log');
  im.mode = 'modtager'; im.kald.length = 0;
  await koer(h.pool, KL12);
  const r = await log('aabning');
  assert.equal(r.length, 3); assert.ok(r.every((x) => x.status === 'afvist'));
  im.mode = 200; await koer(h.pool, KL12);
  assert.equal(im.kald.length, 3, 'afviste sendes ikke igen');
});

test('timens boss: en sms stoppet af inMobile sendes næste kørsel', async (t) => {
  const { im, h, spiller, log } = await opsaet(t);
  const a = await spiller('tb@x.dk');
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2, $3, 5000, 'godkendt', $3)`,
    [a.id, tz('12:10'), tz('12:12')]
  );
  const kl = tz('13:05');
  im.mode = 403;
  await koer(h.pool, kl);
  assert.equal((await log('timens_boss')).length, 0);
  assert.equal((await h.pool.query('SELECT 1 FROM time_vinder')).rows.length, 1, 'vinderen er gemt');
  im.mode = 200;
  await koer(h.pool, kl);
  assert.equal((await log('timens_boss'))[0].status, 'sendt');
});

test('grænsen pr. modtager rammer ikke vinder-sms, men døgnloftet gør', async (t) => {
  const { im, h, spiller } = await opsaet(t);
  const a = await spiller('g@x.dk');
  for (const n of ['1', '2']) await h.pool.query("INSERT INTO sms_log (type, noegle, spiller_id, til, tekst, status) VALUES ('aabning', $1, $2, '4500000000', 'x', 'sendt')", [n, a.id]);
  const tb = await send(h.pool, { type: 'timens_boss', noegle: 'tb', spillerId: a.id, til: a.telefon, tekst: 'x' });
  assert.equal(tb.grund, 'over_graense');
  const v = await send(h.pool, { type: 'vinder', noegle: 'v', spillerId: a.id, til: a.telefon, tekst: 'x' });
  assert.equal(v.ok, true);
  const te = await send(h.pool, { type: 'test', noegle: 'te', spillerId: a.id, til: a.telefon, tekst: 'x', test: true });
  assert.equal(te.ok, true);
  assert.equal(im.kald.length, 2);
  process.env.SMS_MAKS_PR_DOEGN = '2';
  const v2 = await send(h.pool, { type: 'vinder', noegle: 'v2', spillerId: a.id, til: a.telefon, tekst: 'x' });
  assert.equal(v2.grund, 'over_doegnloft', 'døgnloftet gælder også vinder-sms');
});

test('vinder-sms: højst én pr. vinder, også efter en ny trækning', async (t) => {
  const { im, h, spiller, log } = await opsaet(t);
  const a = await spiller('vi@x.dk');
  await h.pool.query(
    `INSERT INTO forsoeg (spiller_id, runde_id, start_server, slut_server, samlet, status, oprettet) VALUES ($1, gen_random_uuid(), $2, $3, 5000, 'godkendt', $3)`,
    [a.id, tz('12:10'), tz('12:12')]
  );
  const traek = () => h.pool.query(
    `INSERT INTO konkurrence_traekning (spil_start, spil_slut, point_pr_lod, deltagerliste_antal, grundlag, lodder_i_alt, tilfaeldigt_tal, vinder_firma, vinder_firma_noegle)
     VALUES ($1,$2,100,1,'[]',1,0,'Testfirma ApS',$3)`,
    [tz('12:00'), tz('18:00'), matchNoegle('Testfirma ApS')]
  );
  await traek();
  await koer(h.pool, tz('19:00')); await koer(h.pool, tz('19:01'));
  assert.equal((await log('vinder')).length, 1);
  await traek();
  await koer(h.pool, tz('19:02'));
  const rows = await log('vinder');
  assert.equal(rows.length, 1, 'ny trækning af samme vinder giver ikke en ny sms');
  assert.equal(im.kald.filter((k) => /præmiepuljen/.test(k.messages[0].text)).length, 1);
});

test('samtykketekst gemmes ved registrering, flueben og varig tilmelding; serveren ejer teksten', async (t) => {
  const { h, spiller } = await opsaet(t);
  const a = await spiller('t1@x.dk');
  const rows = async (id) => (await h.pool.query("SELECT tekst, tekst_version, kilde FROM samtykke WHERE spiller_id = $1 AND liste = 'sms' ORDER BY id", [id])).rows;
  let r = await rows(a.id);
  assert.equal(r.length, 1);
  assert.equal(r[0].tekst, SMS_SAMTYKKE_TEKST);
  assert.equal(r[0].tekst_version, 3);
  assert.match(r[0].tekst, /SmartPack/); assert.match(r[0].tekst, /Packrush/); assert.match(r[0].tekst, /inMobile/); assert.match(r[0].tekst, /afmelde/);

  // Dagens flueben (PUT /me/ticks) og varig tilmelding (PUT /me/subs) gemmer også teksten,
  // og en tekst sendt fra klienten ignoreres
  const b = await spiller('t2@x.dk', { sms: false });
  const t1 = await api(h.baseUrl, 'PUT', '/me/ticks', { token: b.token, body: { keys: ['sms'], tekst: 'falsk' } });
  assert.equal(t1.status, 200, JSON.stringify(t1.body));
  const c = await spiller('t3@x.dk', { sms: false });
  const s1 = await api(h.baseUrl, 'PUT', '/me/subs', { token: c.token, body: { keys: ['sms'], tekst: 'falsk' } });
  assert.equal(s1.status, 200, JSON.stringify(s1.body));
  for (const id of [b.id, c.id]) {
    r = await rows(id);
    assert.equal(r.length, 1);
    assert.equal(r[0].tekst, SMS_SAMTYKKE_TEKST);
    assert.equal(r[0].tekst_version, 3);
  }
  const st = await api(h.baseUrl, 'GET', '/state');
  assert.equal(st.body.cfg.smsTekst, SMS_SAMTYKKE_TEKST, 'klienten viser serverens tekst');
});

test('nyt telefonnummer trækker sms-samtykket tilbage', async (t) => {
  const { im, h, spiller } = await opsaet(t);
  const a = await spiller('p@x.dk');
  const same = await api(h.baseUrl, 'PATCH', '/me', { token: a.token, body: { telefon: a.telefon } });
  assert.equal(same.status, 200); assert.equal(same.body.sms_samtykke_traekt, undefined, 'samme nummer ændrer intet');
  const skift = await api(h.baseUrl, 'PATCH', '/me', { token: a.token, body: { telefon: nytNummer() } });
  assert.equal(skift.status, 200, JSON.stringify(skift.body));
  assert.equal(skift.body.sms_samtykke_traekt, true);
  const hv = await h.pool.query("SELECT type, kilde FROM samtykke WHERE spiller_id = $1 AND liste = 'sms' ORDER BY id DESC LIMIT 1", [a.id]);
  assert.deepEqual(hv.rows[0], { type: 'trukket_tilbage', kilde: 'telefon_skiftet' });
  const me = await api(h.baseUrl, 'GET', '/me', { token: a.token });
  assert.ok(!me.body.mine_noegler.includes('sms'), 'ingen sms-tilmelding tilbage');
  await koer(h.pool, KL12);
  assert.equal(im.kald.length, 0, 'intet sendt til det nye nummer');
  const igen = await api(h.baseUrl, 'PATCH', '/me', { token: a.token, body: { telefon: nytNummer() } });
  assert.equal(igen.body.sms_samtykke_traekt, undefined, 'intet at trække tilbage næste gang');
});

test('sms-tilmeldinger pr. IP: kun sms-fluebenet afvises, atomisk, admin og andre IP-adresser undtaget', async (t) => {
  process.env.SMS_IP_MAKS_PR_TIME = '3';
  const { h, spiller, admin } = await opsaet(t);
  const ip = { 'x-client-ip': '10.1.1.1' };
  const smsRaekker = async (id) => (await h.pool.query("SELECT 1 FROM samtykke WHERE spiller_id = $1 AND liste = 'sms'", [id])).rows.length;
  for (let i = 0; i < 3; i++) await spiller(`ip${i}@x.dk`, { headers: ip });
  // Fjerde registrering med sms: spilleren oprettes, men uden sms, med en tydelig besked
  const blok = await spiller('ip3@x.dk', { headers: ip });
  assert.equal(blok.body.sms_afvist.kode, 'sms_ip_graense');
  assert.match(blok.body.sms_afvist.fejl, /sms/);
  assert.equal(await smsRaekker(blok.id), 0, 'intet sms-samtykke gemt');
  assert.equal((await h.pool.query('SELECT notify FROM spiller WHERE id = $1', [blok.id])).rows[0].notify, false);
  const uden = await spiller('ip4@x.dk', { sms: false, headers: ip });
  assert.equal(uden.body.sms_afvist, undefined);
  const andenIp = await spiller('ip5@x.dk', { headers: { 'x-client-ip': '10.1.1.2' } });
  assert.equal(andenIp.body.sms_afvist, undefined);
  const ac = await admin();
  const adm = registrerSpiller(h.baseUrl, { email: 'ip6@x.dk', telefon: nytNummer(), tilmeldinger: ['sms'] });
  const rA = await api(h.baseUrl, 'POST', '/players', { body: adm.body, headers: ip, adminCookie: ac });
  assert.equal(rA.status, 201); assert.equal(rA.body.sms_afvist, undefined, 'admin-session er undtaget');
  // Flueben: samme grænse, men kun sms afvises
  const ip3 = { 'x-client-ip': '10.1.1.3' };
  const spillere = [];
  for (let i = 0; i < 4; i++) spillere.push(await spiller(`ipq${i}@x.dk`, { sms: false, headers: ip3 }));
  for (let i = 0; i < 3; i++) {
    const r = await api(h.baseUrl, 'PUT', '/me/ticks', { token: spillere[i].token, body: { keys: ['sms'] }, headers: ip3 });
    assert.equal(r.status, 200); assert.equal(r.body.sms_afvist, undefined);
  }
  const sidste = await api(h.baseUrl, 'PUT', '/me/ticks', { token: spillere[3].token, body: { keys: ['sms'] }, headers: ip3 });
  assert.equal(sidste.status, 200);
  assert.equal(sidste.body.sms_afvist.kode, 'sms_ip_graense');
  assert.ok(!sidste.body.mine_noegler.includes('sms'));
  const subs = await api(h.baseUrl, 'PUT', '/me/subs', { token: spillere[3].token, body: { keys: ['sp', 'sms'] }, headers: ip3 });
  assert.equal(subs.status, 200); assert.equal(subs.body.sms_afvist.kode, 'sms_ip_graense');
  assert.deepEqual(subs.body.mine_noegler, ['sp'], 'resten af tilmeldingen går igennem');
});

test('sms-grænsen pr. IP er atomisk: samtidige registreringer slipper ikke forbi', async (t) => {
  process.env.SMS_IP_MAKS_PR_TIME = '5';
  const { h } = await opsaet(t);
  const ip = { 'x-client-ip': '10.2.2.2' };
  const rs = await Promise.all(Array.from({ length: 20 }, (_, i) => {
    const { body } = registrerSpiller(h.baseUrl, { email: `at${i}@x.dk`, telefon: nytNummer(), tilmeldinger: ['sms'] });
    return api(h.baseUrl, 'POST', '/players', { body, headers: ip });
  }));
  assert.ok(rs.every((r) => r.status === 201), JSON.stringify(rs.map((r) => r.status)));
  assert.equal(rs.filter((r) => !r.body.sms_afvist).length, 5, 'præcis fem får sms');
  const n = (await h.pool.query("SELECT count(*)::int n FROM samtykke WHERE liste = 'sms'")).rows[0].n;
  assert.equal(n, 5);
});

test('standardgrænsen for sms pr. IP er 120 i timen', async (t) => {
  const { h } = await opsaet(t);
  await h.pool.query("INSERT INTO sms_ip_taeller (ip, vindue, antal) VALUES ('10.3.3.3', date_trunc('hour', now()), 119)");
  const ip = { 'x-client-ip': '10.3.3.3' };
  const reg = (email) => api(h.baseUrl, 'POST', '/players', { body: registrerSpiller(h.baseUrl, { email, telefon: nytNummer(), tilmeldinger: ['sms'] }).body, headers: ip });
  assert.equal((await reg('d1@x.dk')).body.sms_afvist, undefined);
  assert.equal((await reg('d2@x.dk')).body.sms_afvist.kode, 'sms_ip_graense');
});

test('ingen hængning: samtidige kald mod en lille pool færdiggøres (transaktioner bruger deres egen client)', { timeout: 60000 }, async (t) => {
  const { h, spiller } = await opsaet(t, { poolMax: 5 });
  const ip = (i) => ({ 'x-client-ip': '10.4.4.' + (i % 7) });
  const rs = await Promise.all(Array.from({ length: 25 }, (_, i) => {
    const { body } = registrerSpiller(h.baseUrl, { email: `pool${i}@x.dk`, telefon: nytNummer(), tilmeldinger: ['sms'] });
    return api(h.baseUrl, 'POST', '/players', { body, headers: ip(i) });
  }));
  assert.deepEqual(rs.map((r) => r.status), Array(25).fill(201), JSON.stringify(rs.filter((r) => r.status !== 201).map((r) => r.body)));
  // Flueben, varig tilmelding og nummerskifte samtidigt
  const sp = [];
  for (let i = 0; i < 10; i++) sp.push(await spiller(`pq${i}@x.dk`, { sms: false }));
  const kald = sp.flatMap((s) => [
    api(h.baseUrl, 'PUT', '/me/ticks', { token: s.token, body: { keys: ['sms'] } }),
    api(h.baseUrl, 'PUT', '/me/subs', { token: s.token, body: { keys: ['sp'] } }),
    api(h.baseUrl, 'PATCH', '/me', { token: s.token, body: { telefon: nytNummer() } }),
    api(h.baseUrl, 'GET', '/me', { token: s.token }),
  ]);
  const ud = await Promise.all(kald);
  assert.ok(ud.every((r) => r.status === 200), JSON.stringify(ud.filter((r) => r.status !== 200).map((r) => [r.status, r.body])));
});

test('auto-stop: fem afviste kald i træk (401) slår smsAfsendelse fra; et vellykket kald nulstiller tælleren', async (t) => {
  const { im, h, spiller } = await opsaet(t);
  for (let i = 0; i < 2; i++) await spiller(`as${i}@x.dk`);
  const kaldet = async (n) => { for (let i = 0; i < n; i++) await koer(h.pool, KL12); };
  const cfg = async () => (await h.pool.query('SELECT offentlig FROM config WHERE id = 1')).rows[0].offentlig;
  im.mode = 401;
  await kaldet(4);
  assert.equal(im.kald.length, 4); assert.notEqual((await cfg()).smsAfsendelse, false);
  im.mode = 200; await koer(h.pool, KL12); // sender begge, nulstiller tælleren
  await h.pool.query('DELETE FROM sms_log');
  im.mode = 401; im.kald.length = 0;
  await kaldet(4);
  assert.notEqual((await cfg()).smsAfsendelse, false, 'tælleren blev nulstillet af det vellykkede kald');
  await kaldet(1);
  assert.equal((await cfg()).smsAfsendelse, false, 'stoppet efter 5 i træk');
  const antal = im.kald.length;
  await kaldet(3);
  assert.equal(im.kald.length, antal, 'ingen flere kald, efter at afsendelsen er slået fra');
  assert.equal((await h.pool.query("SELECT count(*)::int n FROM sms_log WHERE type = 'aabning'")).rows[0].n, 0, 'rækkerne er bevaret til genoptagelse');
});

test('sletning af spiller rydder telefon og navn i sms_log og time_vinder', async (t) => {
  const { h, spiller } = await opsaet(t);
  const a = await spiller('s@x.dk');
  await h.pool.query("INSERT INTO sms_log (type, noegle, spiller_id, til, tekst, status) VALUES ('aabning', 'k', $1, '4512345678', 'Tillykke Anna', 'sendt')", [a.id]);
  await h.pool.query("INSERT INTO time_vinder (dag, time, spiller_id, navn, score) VALUES ($1, 1300, $2, 'Anna Andersen', 100)", [dag, a.id]);
  const c = await h.pool.connect();
  try {
    await c.query('BEGIN');
    await deletePlayerFully(c, a.id, 'Test Testesen');
    await c.query('COMMIT');
  } finally { c.release(); }
  const l = await h.pool.query("SELECT til, tekst, spiller_id FROM sms_log WHERE noegle = 'k'");
  assert.deepEqual(l.rows[0], { til: '', tekst: '[slettet]', spiller_id: null });
  const tv = await h.pool.query('SELECT navn, spiller_id FROM time_vinder');
  assert.deepEqual(tv.rows[0], { navn: 'Slettet spiller', spiller_id: null });
});

test('partnerens startkode maskeres i sms_log, men sendes i klartekst', async (t) => {
  const { im, h, admin } = await opsaet(t);
  const ac = await admin();
  const p = await api(h.baseUrl, 'POST', '/admin/partnere', { adminCookie: ac, body: { navn: 'Testpartner', firmanavn: 'Testpartner ApS' } });
  const med = await api(h.baseUrl, 'POST', `/admin/partnere/${p.body.partner.id}/brugere`, { adminCookie: ac, body: { email: 'b@p.dk', kode: 'startkode456', sms_telefon: nytNummer() } });
  assert.equal(med.status, 201, JSON.stringify(med.body));
  assert.match(im.kald[0].messages[0].text, /startkode456/);
  const l = (await h.pool.query("SELECT tekst FROM sms_log WHERE type = 'partner_login'")).rows[0].tekst;
  assert.doesNotMatch(l, /startkode456/);
  assert.match(l, /Startkode: \*\*\*\*/);
});
