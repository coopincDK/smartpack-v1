'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const { hashPassword } = require('../src/crypto');

const ADMIN_PW = 'test-admin-adgangskode-ws';
process.env.ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PW);
process.env.COOKIE_SECURE = 'false';

const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function cookieFra(res) {
  const raw = res.headers.get('set-cookie');
  if (!raw) return null;
  return raw.split(';')[0];
}

function connect(wsUrl, cookie) {
  return new Promise((resolve, reject) => {
    const ws = cookie ? new WebSocket(wsUrl, { headers: { cookie } }) : new WebSocket(wsUrl);
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

function nextMessage(ws) {
  return new Promise((resolve) => {
    ws.once('message', (raw) => resolve(JSON.parse(raw.toString('utf8'))));
  });
}

test('WS: anonym forbindelse kan IKKE sende duel-events (kun lytte)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const anon = await connect(h.wsUrl);
  t.after(() => anon.close());

  anon.send(JSON.stringify({ type: 'join', room: 'duel-test' }));
  await nextMessage(anon); // joined

  anon.send(JSON.stringify({ type: 'emit', room: 'duel-test', event: 'duel.go', data: {} }));
  const svar = await nextMessage(anon);
  assert.equal(svar.type, 'error');
});

test('WS: spiller-token kræves for presence/emit, og events relayes til andre i rummet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl);
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const spiller = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    spiller.close();
    lytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  const helloSvar = await nextMessage(spiller);
  assert.equal(helloSvar.authenticated, true);

  lytter.send(JSON.stringify({ type: 'join', room: 'duel-1' }));
  await nextMessage(lytter); // joined

  // Registrér begge lyttere FØR vi sender — begge modtager broadcasten
  // stort set samtidigt, og en 'message'-event uden lytter går tabt.
  const spillerFikPresence = nextMessage(spiller);
  const lytterFikPresence = nextMessage(lytter);
  spiller.send(JSON.stringify({ type: 'presence', room: 'duel-1', name: 'Spiller Et' }));
  await spillerFikPresence; // presence-broadcast til afsender selv
  await lytterFikPresence; // presence-broadcast til lytteren

  const modtaget = nextMessage(lytter);
  spiller.send(JSON.stringify({ type: 'emit', room: 'duel-1', event: 'duel.s', data: { score: 42 } }));
  const relay = await modtaget;
  assert.equal(relay.type, 'event');
  assert.equal(relay.event, 'duel.s');
  assert.equal(relay.data.score, 42);
});

test('WS: emit uden token afvises selv med gyldigt rum-medlemskab', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const anon = await connect(h.wsUrl);
  t.after(() => anon.close());
  anon.send(JSON.stringify({ type: 'join', room: 'r' }));
  await nextMessage(anon);
  anon.send(JSON.stringify({ type: 'presence', room: 'r', name: 'Snyder' }));
  const svar = await nextMessage(anon);
  assert.equal(svar.type, 'error');
});

test('WS: broadcasts personaliseres pr. forbindelse — stand-session ser fulde navne, anonym ser forkortede', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { navn: 'Martin Rasmussen' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const spiller = await connect(h.wsUrl);
  const anonymLytter = await connect(h.wsUrl);
  const standLytter = await connect(h.wsUrl, standCookie);
  t.after(() => {
    spiller.close();
    anonymLytter.close();
    standLytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(spiller);

  anonymLytter.send(JSON.stringify({ type: 'join', room: 'duel-navn' }));
  await nextMessage(anonymLytter);
  standLytter.send(JSON.stringify({ type: 'join', room: 'duel-navn' }));
  await nextMessage(standLytter);

  const anonFikPresence = nextMessage(anonymLytter);
  const standFikPresence = nextMessage(standLytter);
  const spillerFikPresence = nextMessage(spiller);
  spiller.send(JSON.stringify({ type: 'presence', room: 'duel-navn' })); // uden eget name -> bruger ws.player.navn
  const [anonPresence, standPresence] = await Promise.all([anonFikPresence, standFikPresence]);
  await spillerFikPresence;

  assert.equal(anonPresence.users[0].name, 'Martin R.');
  assert.equal(standPresence.users[0].name, 'Martin Rasmussen');

  const anonFikEvent = nextMessage(anonymLytter);
  const standFikEvent = nextMessage(standLytter);
  spiller.send(JSON.stringify({ type: 'emit', room: 'duel-navn', event: 'duel.s', data: { score: 1 } }));
  const [anonEvent, standEvent] = await Promise.all([anonFikEvent, standFikEvent]);

  assert.equal(anonEvent.from.name, 'Martin R.');
  assert.equal(standEvent.from.name, 'Martin Rasmussen');
});
