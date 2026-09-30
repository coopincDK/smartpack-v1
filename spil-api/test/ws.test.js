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

// Samler de næste `n` beskeder til `ws`, i den rækkefølge de RENT FAKTISK
// ankommer. Bruges når to beskeder sendes til SAMME forbindelse i hurtig
// rækkefølge (fx en presence-broadcast til afsenderen selv, umiddelbart
// efterfulgt af et separat svar) — 'ws'-biblioteket kan (afhængig af
// permessage-deflate-komprimering) levere sådan et par i en anden
// rækkefølge end de blev sendt server-side, så vi matcher på `.type`
// bagefter i stedet for at antage en bestemt ankomstrækkefølge.
function collectMessages(ws, n) {
  return new Promise((resolve) => {
    const msgs = [];
    function onMsg(raw) {
      msgs.push(JSON.parse(raw.toString('utf8')));
      if (msgs.length >= n) {
        ws.off('message', onMsg);
        resolve(msgs);
      }
    }
    ws.on('message', onMsg);
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

test('WS: periodisk revalidering lukker en stand-forbindelse hvis sessionen forsvinder mens socket\'en er åben', async (t) => {
  const h = await startHarness({ wsOpts: { revalidateMs: 50 } });
  t.after(() => h.teardown());

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);
  const kodeRes = await api(h.baseUrl, 'POST', '/admin/stand-login-kode', { adminCookie });
  const standLogin = await api(h.baseUrl, 'POST', '/stand-login', { body: { kode: kodeRes.body.kode } });
  const standCookie = cookieFra(standLogin);

  const standConn = await connect(h.wsUrl, standCookie);
  t.after(() => {
    try {
      standConn.close();
    } catch (e) {
      /* ignore */
    }
  });

  const closed = new Promise((resolve) => standConn.once('close', resolve));
  // Simulerer at sessionen forsvinder (udløber/logges ud af en admin) MENS
  // forbindelsen er åben.
  await h.pool.query("DELETE FROM admin_session WHERE rolle = 'stand'");
  await closed; // det periodiske sweep (50 ms i denne test) skal lukke forbindelsen
});

test('WS: navnevisning genvalideres FRISKT lige før hver besked — mister fulde navne uden at vente på det periodiske sweep', async (t) => {
  // Meget langt sweep-interval: kun den friske pr.-besked-revalidering
  // (isPrivilegedNow) kan redde denne test.
  const h = await startHarness({ wsOpts: { revalidateMs: 10 * 60 * 1000 } });
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
  const standLytter = await connect(h.wsUrl, standCookie);
  t.after(() => {
    spiller.close();
    standLytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(spiller);
  standLytter.send(JSON.stringify({ type: 'join', room: 'reval-fresh' }));
  await nextMessage(standLytter);

  const foerPresence = nextMessage(standLytter);
  spiller.send(JSON.stringify({ type: 'presence', room: 'reval-fresh', name: 'Martin Rasmussen' }));
  const foer = await foerPresence;
  assert.equal(foer.users[0].name, 'Martin Rasmussen', 'stand-sessionen er gyldig -> fulde navne');

  // Sessionen forsvinder (fx logget ud af en admin, eller naturligt
  // udløbet) — ingen ventetid på det (her meget lange) periodiske sweep.
  await h.pool.query("DELETE FROM admin_session WHERE rolle = 'stand'");

  const efterPresence = nextMessage(standLytter);
  spiller.send(JSON.stringify({ type: 'presence', room: 'reval-fresh', name: 'Martin Rasmussen' }));
  const efter = await efterPresence;
  assert.equal(
    efter.users[0].name,
    'Martin R.',
    'skal falde tilbage til forkortet navn STRAKS, uden at vente på det periodiske sweep'
  );
});

// --- Opgave E ---

test('opgave E: duel.waiting og duel.idle er nu tilladte duel-events (relayes til andre i rummet)', async (t) => {
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
  await nextMessage(spiller);
  lytter.send(JSON.stringify({ type: 'join', room: 'venteliste' }));
  await nextMessage(lytter);

  for (const event of ['duel.waiting', 'duel.idle']) {
    const modtaget = nextMessage(lytter);
    spiller.send(JSON.stringify({ type: 'emit', room: 'venteliste', event, data: {} }));
    const relay = await modtaget;
    assert.equal(relay.type, 'event');
    assert.equal(relay.event, event);
  }
});

test('opgave E: WS-relay overskriver ALTID data.name/data.an med serverens egen maskerede visning af afsenderens navn', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { navn: 'Ægte Navnesen' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const spiller = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    spiller.close();
    lytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(spiller);
  lytter.send(JSON.stringify({ type: 'join', room: 'navne-spoof' }));
  await nextMessage(lytter);

  const modtaget = nextMessage(lytter);
  // Spilleren forsøger at udgive sig for en anden i selve duel-payloaden.
  spiller.send(
    JSON.stringify({
      type: 'emit',
      room: 'navne-spoof',
      event: 'duel.go',
      data: { name: 'Falsk Navn', an: 'Falsk Navn', b: 'uberoert-felt' },
    })
  );
  const relay = await modtaget;
  assert.equal(relay.event, 'duel.go');
  assert.equal(relay.data.name, 'Ægte N.', 'data.name skal overskrives med den maskerede visning af det RIGTIGE navn');
  assert.equal(relay.data.an, 'Ægte N.', 'data.an skal ligeledes overskrives');
  assert.equal(relay.data.b, 'uberoert-felt', 'øvrige data-felter berøres ikke');
  assert.equal(relay.from.name, 'Ægte N.');
});

// --- Tredje opfølgende ændringsrunde, punkt 3 ---

test('punkt 3: duel.go\'s bn overskrives med den REELLE modstanders maskerede navn (matchet via connId fra presence)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body: bodyB } = registrerSpiller(h.baseUrl, { navn: 'Ægte Modstander' });
  const regB = await api(h.baseUrl, 'POST', '/players', { body: bodyB });
  const tokenB = regB.body.token;

  const { body: bodyA } = registrerSpiller(h.baseUrl, { navn: 'Angriber Andersen' });
  const regA = await api(h.baseUrl, 'POST', '/players', { body: bodyA });
  const tokenA = regA.body.token;

  const connB = await connect(h.wsUrl);
  const connA = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    connB.close();
    connA.close();
    lytter.close();
  });

  connB.send(JSON.stringify({ type: 'hello', token: tokenB }));
  await nextMessage(connB);
  connA.send(JSON.stringify({ type: 'hello', token: tokenA }));
  await nextMessage(connA);

  lytter.send(JSON.stringify({ type: 'join', room: 'bn-forfalskning' }));
  await nextMessage(lytter);

  // B sætter presence FØRST, så serveren kender B's connId (svarer til
  // presence-listens users[].id) og rigtige navn.
  const bFikPresence = nextMessage(connB);
  const lytterFikPresence = nextMessage(lytter);
  connB.send(JSON.stringify({ type: 'presence', room: 'bn-forfalskning' }));
  const bPresence = await bFikPresence;
  await lytterFikPresence;
  const bConnId = bPresence.users[0].id;

  const modtaget = nextMessage(lytter);
  // A (som IKKE er B) forsøger at udgive et VILKÅRLIGT navn som modstander
  // i selve duel.go-payloaden, men peger `b` på B's rigtige connId.
  connA.send(
    JSON.stringify({
      type: 'emit',
      room: 'bn-forfalskning',
      event: 'duel.go',
      data: { a: 'a-tab', an: 'ignoreres', b: String(bConnId), bn: 'Falsk Modstander' },
    })
  );
  const relay = await modtaget;
  assert.equal(relay.event, 'duel.go');
  assert.equal(relay.data.bn, 'Ægte M.', 'bn skal overskrives med den REELLE modstanders maskerede navn');
  assert.notEqual(relay.data.bn, 'Falsk Modstander');
});

test('punkt 3: duel.go\'s bn ryddes til tom streng når modstander-referencen er ukendt (aldrig klientens ubekræftede tekst)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = registrerSpiller(h.baseUrl, { navn: 'Angriber Andersen' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const spiller = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    spiller.close();
    lytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(spiller);
  lytter.send(JSON.stringify({ type: 'join', room: 'bn-ukendt' }));
  await nextMessage(lytter);

  const modtaget = nextMessage(lytter);
  spiller.send(
    JSON.stringify({
      type: 'emit',
      room: 'bn-ukendt',
      event: 'duel.go',
      data: { a: 'x', an: 'ignoreres', b: 'findes-ikke', bn: 'Snydenavn' },
    })
  );
  const relay = await modtaget;
  assert.equal(relay.data.bn, '', 'ukendt modstander-reference skal give tom bn, aldrig klientens tekst');
});

// --- Fjerde opfølgende ændringsrunde (afsluttende review) ---

test('N5: hello uden gyldigt token nulstiller ws.player/presenceName og broadcaster opdateret presence med det samme', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { navn: 'Skiftende Spiller' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const standtablet = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    standtablet.close();
    lytter.close();
  });

  standtablet.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(standtablet);

  lytter.send(JSON.stringify({ type: 'join', room: 'naeste-spiller' }));
  await nextMessage(lytter);

  const standFikPresence1 = nextMessage(standtablet);
  const lytterFikPresence1 = nextMessage(lytter);
  standtablet.send(JSON.stringify({ type: 'presence', room: 'naeste-spiller' }));
  const presenceFoer = await lytterFikPresence1;
  await standFikPresence1;
  assert.equal(presenceFoer.users.length, 1, 'spilleren skal være synlig i presence-listen');

  // "Næste spiller"/logout på standtabletten: klienten sender hello UDEN
  // token. Serveren sender BÅDE en presence-broadcast (til afsenderen selv
  // OGSÅ) og selve hello.ok-svaret til standtabletten — brug collectMessages
  // i stedet for at antage en bestemt ARRIVAL-rækkefølge mellem dem (se
  // collectMessages()-kommentaren ovenfor).
  const standFikToBeskeder = collectMessages(standtablet, 2);
  const lytterFikPresence2 = nextMessage(lytter);
  standtablet.send(JSON.stringify({ type: 'hello' }));

  const standBeskeder = await standFikToBeskeder;
  const presenceEfterLytter = await lytterFikPresence2;

  const helloSvar = standBeskeder.find((m) => m.type === 'hello.ok');
  const presenceEfterStand = standBeskeder.find((m) => m.type === 'presence');
  assert.ok(helloSvar, 'standtabletten skal modtage et hello.ok-svar');
  assert.ok(presenceEfterStand, 'standtabletten skal også modtage presence-broadcasten til sig selv');
  assert.equal(helloSvar.authenticated, false, 'ingen token -> ikke længere autentificeret');
  assert.equal(presenceEfterStand.users.length, 0, 'forrige spiller skal STRAKS forsvinde fra presence-listen');
  assert.equal(presenceEfterLytter.users.length, 0, 'andre forbindelser skal ALDRIG se den forrige spillers navn efter reset');

  // Forbindelsen er reelt logget ud: emit/presence kræver login igen.
  const fejlSvar = nextMessage(standtablet);
  standtablet.send(JSON.stringify({ type: 'emit', room: 'naeste-spiller', event: 'duel.s', data: {} }));
  assert.equal((await fejlSvar).type, 'error');
});

test('N6: presence-beskedens name-felt kan IKKE forfalske hverken presence-listens navn eller duel-afsendernavnet', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body } = await registrerSpiller(h.baseUrl, { navn: 'Ægte Navnesen' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  const token = reg.body.token;

  const spiller = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    spiller.close();
    lytter.close();
  });

  spiller.send(JSON.stringify({ type: 'hello', token }));
  await nextMessage(spiller);
  lytter.send(JSON.stringify({ type: 'join', room: 'presence-spoof' }));
  await nextMessage(lytter);

  const spillerFikPresence = nextMessage(spiller);
  const lytterFikPresence = nextMessage(lytter);
  // Forsøger at sætte en vilkårlig presence-tekst — skal IGNORERES HELT.
  spiller.send(JSON.stringify({ type: 'presence', room: 'presence-spoof', name: 'Vildledende Navn' }));
  const lytterPresence = await lytterFikPresence;
  await spillerFikPresence;
  assert.equal(
    lytterPresence.users[0].name,
    'Ægte N.',
    'presence-listen skal vise det RIGTIGE (maskerede) navn, aldrig klientens fritekst'
  );
  assert.notEqual(lytterPresence.users[0].name, 'Vildledende Navn');

  const modtaget = nextMessage(lytter);
  // Endnu et forsøg på at udgive sig for en anden, denne gang direkte i
  // selve duel-eventet.
  spiller.send(
    JSON.stringify({
      type: 'emit',
      room: 'presence-spoof',
      event: 'duel.s',
      data: { score: 1, name: 'Endnu et falsk navn' },
    })
  );
  const relay = await modtaget;
  assert.equal(
    relay.from.name,
    'Ægte N.',
    'duel-afsendernavnet skal også være det RIGTIGE (maskerede) navn, aldrig presence-teksten eller data.name'
  );
});

test('N4-bonus: duel.go\'s bn matcher OGSÅ når selv-referencen blev sendt som data.tab (ikke data.a — jeres faktiske klients felt)', async (t) => {
  const h = await startHarness();
  t.after(() => h.teardown());

  const { body: bodyB } = registrerSpiller(h.baseUrl, { navn: 'Tab Modstander' });
  const regB = await api(h.baseUrl, 'POST', '/players', { body: bodyB });
  const tokenB = regB.body.token;

  const { body: bodyA } = registrerSpiller(h.baseUrl, { navn: 'Angriber Andersen' });
  const regA = await api(h.baseUrl, 'POST', '/players', { body: bodyA });
  const tokenA = regA.body.token;

  const connB = await connect(h.wsUrl);
  const connA = await connect(h.wsUrl);
  const lytter = await connect(h.wsUrl);
  t.after(() => {
    connB.close();
    connA.close();
    lytter.close();
  });

  connB.send(JSON.stringify({ type: 'hello', token: tokenB }));
  await nextMessage(connB);
  connA.send(JSON.stringify({ type: 'hello', token: tokenA }));
  await nextMessage(connA);

  lytter.send(JSON.stringify({ type: 'join', room: 'tab-reference' }));
  await nextMessage(lytter);

  // B sender FØRST et duel-event der (som jeres faktiske klient) kun bærer
  // `tab`, ikke `a`, som selv-reference.
  const lytterFikVenteBesked = nextMessage(lytter);
  connB.send(
    JSON.stringify({ type: 'emit', room: 'tab-reference', event: 'duel.waiting', data: { tab: 'b-tab-123' } })
  );
  await lytterFikVenteBesked;

  const modtaget = nextMessage(lytter);
  // A forsøger et vilkårligt modstandernavn, men peger `b` på B's `tab`.
  connA.send(
    JSON.stringify({
      type: 'emit',
      room: 'tab-reference',
      event: 'duel.go',
      data: { a: 'a-tab', an: 'ignoreres', b: 'b-tab-123', bn: 'Falsk Modstander' },
    })
  );
  const relay = await modtaget;
  assert.equal(
    relay.data.bn,
    'Tab M.',
    'bn skal matche via data.tab-registreringen og vise den REELLE modstanders maskerede navn'
  );
  assert.notEqual(relay.data.bn, 'Falsk Modstander');
});

test('opgave E: state.changed broadcastes ved ny registrering, firma-ændring, admin-config-ændring, sletning af én spiller, og admin/nulstil', async (t) => {
  const h = await startHarness({ adminRouterOpts: { runBackup: async () => '/tmp/nulstil-test.sql' } });
  t.after(() => h.teardown());

  const lytter = await connect(h.wsUrl);
  t.after(() => lytter.close());

  // 1) Ny registrering.
  let besked = nextMessage(lytter);
  const { body } = await registrerSpiller(h.baseUrl, { navn: 'State Changed Spiller' });
  const reg = await api(h.baseUrl, 'POST', '/players', { body });
  assert.equal(reg.status, 201);
  assert.equal((await besked).type, 'state.changed');

  // 2) Firma-ændring.
  besked = nextMessage(lytter);
  const patch = await api(h.baseUrl, 'PATCH', '/me', { token: reg.body.token, body: { firma: 'Nyt Firma ApS' } });
  assert.equal(patch.status, 200);
  assert.equal((await besked).type, 'state.changed');

  const login = await api(h.baseUrl, 'POST', '/admin/login', { body: { password: ADMIN_PW } });
  const adminCookie = cookieFra(login);

  // 3) Admin-config-ændring.
  besked = nextMessage(lytter);
  const cfgRes = await api(h.baseUrl, 'PUT', '/admin/config', {
    adminCookie,
    body: { offentlig: { eventName: 'Testevent' } },
  });
  assert.equal(cfgRes.status, 200);
  assert.equal((await besked).type, 'state.changed');

  // 4) Sletning af én spiller.
  besked = nextMessage(lytter);
  const slet = await api(h.baseUrl, 'DELETE', `/admin/spillere/${reg.body.spiller.pid}`, { adminCookie });
  assert.equal(slet.status, 200);
  assert.equal((await besked).type, 'state.changed');

  // 5) admin/nulstil.
  besked = nextMessage(lytter);
  const nulstil = await api(h.baseUrl, 'POST', '/admin/nulstil', { adminCookie, body: { bekraeft: 'NULSTIL' } });
  assert.equal(nulstil.status, 200);
  assert.equal((await besked).type, 'state.changed');
});
