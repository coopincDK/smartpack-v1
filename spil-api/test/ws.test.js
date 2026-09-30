'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const { startHarness, api, registrerSpiller } = require('./helpers/appHarness');

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
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
