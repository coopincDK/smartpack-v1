'use strict';

const { WebSocketServer } = require('ws');
const { tryLoadPlayer } = require('./middleware/playerAuth');
const { resolveSessionRole, resolveRoleForToken, parseCookies, COOKIE_NAME } = require('./middleware/adminAuth');
const { shortName } = require('./rules/nameDisplay');

const MAX_MSG_BYTES = 4096;
const MAX_MSGS_PER_SEC = 10;
// Opfølgning: duel.waiting/duel.idle tilføjet til ventelisten (hvem venter
// på en duel) — se API.md.
const DUEL_EVENTS = new Set(['duel.go', 'duel.s', 'duel.waiting', 'duel.idle']);
// Kendte fritekstfelter i et duel-events `data`, der (ifølge klientens
// duel-protokol) bærer AFSENDERENS eget navn — 'name' (duel.s/duel.waiting/
// duel.idle) og 'an' ("a"'s navn, duel.go, hvor 'a' altid er afsenderen selv,
// se spil/index.html#goDuel). Serveren overskriver dem ALTID med sin egen,
// korrekt maskerede visning af afsenderens navn, uanset hvad klienten
// indsendte — klienten må ALDRIG kunne sætte vilkårlig tekst som sit eget
// navn i et duel-event der relayes videre til andre (fx standvæggen). Håndhæves
// for HVER besked (se emit-håndteringen nedenfor), ikke kun ved forbindelse.
const AFSENDER_NAVN_FELTER = ['name', 'an'];
// Tredje opfølgende ændringsrunde, punkt 3: `duel.go`s `bn` (modstanderens
// navn, sat af AFSENDEREN SELV når de vælger hvem de vil duellere mod fra
// ventelisten, se spil/index.html#goDuel: `{ a: TAB, an, b: w.tab, bn: w.name }`)
// var IKKE dækket af overskrivningen ovenfor og var derfor lige så
// forfalskeligt som `an`/`name` var FØR forrige runde — en spiller kunne
// sætte et VILKÅRLIGT modstander-navn. Valgt løsning (a) fra opgavebeskrivelsen:
// overskriv `bn` server-side ud fra serverens EGEN viden om hvem der reelt
// har den angivne modstander-reference (`data.b`), i stedet for (b) at
// fjerne feltet (ville bryde feltnavne/responsstruktur for en klient der
// allerede forventer `bn`). Vi kender ikke den nye frontends præcise
// feltkonvention for "modstanderens reference" endnu (se
// "Fortolkninger/antagelser" i API.md) — vi understøtter derfor BEGGE
// sandsynlige varianter og forsøger dem i rækkefølge:
//   1) `data.b` er et forbindelses-id fra presence-listen (tal, matcher
//      `users[].id` / `conn.connId`, se presenceListFor() nedenfor).
//   2) `data.b` er et selv-erklæret, tab-lignende strengfelt (jf. det ÆLDRE
//      klientmønster i spil/index.html: `a`=egen tab, `b`=modstanderens tab)
//      — registreret nedenfor (`registrerSelvReference`) fra AFSENDERENS
//      eget `data.a`-ELLER `data.tab`-felt (se EGEN_REF_FELT_ALT — den
//      FAKTISKE klient viste sig kun at sende `tab`, se N4-bonus) i et
//      TIDLIGERE duel-event i samme rum.
// Matcher INGEN af delene en kendt forbindelse i SAMME rum, stoler vi ALDRIG
// på klientens `bn` — den ryddes til en tom streng i stedet for at relaye
// ubekræftet fritekst.
const MODSTANDER_NAVN_FELT = 'bn';
const MODSTANDER_REF_FELT = 'b';
const EGEN_REF_FELT = 'a';
// Fjerde opfølgende ændringsrunde (afsluttende review), N4-bonus: den
// FAKTISKE klient sender kun `tab` (ikke `a`) som selv-reference i
// duel.waiting/duel.s (se spil/index.html#goDuel) — uden dette registreres
// afsenderens selv-reference ALDRIG, og `bn`-opslaget ovenfor matcher derfor
// aldrig noget i praksis (ender altid tom). Registreres nu SOM ET EKSTRA
// felt ved siden af `a` (ikke i stedet for) — begge skal virke, uanset
// hvilken klient/version der forbinder, se emit-håndteringen nedenfor.
const EGEN_REF_FELT_ALT = 'tab';
// Fundet under sikkerhedsgennemgangen: adminRole blev kun læst ÉN GANG, ved
// selve håndtrykket — en admin/stand-session der udløber eller logges ud
// mens socket'en forbliver åben, beholdt privilegiet for evigt. Rettet med
// TO mekanismer (se attachWs nedenfor): en periodisk baggrunds-revalidering
// pr. forbindelse (DEFAULT_REVALIDATE_MS), OG en frisk revalidering lige før
// HVER besked der ville afsløre et fuldt navn (isPrivilegedNow).
const DEFAULT_REVALIDATE_MS = 60 * 1000;

// Rum-baseret realtids-relay ("standvæg + to tablets i duel"). Semantikken
// er bevidst simpel — svarer til klientens tidligere claude.use('room'):
// presence (hvem er i rummet, med navn hvis spiller) + emit/on af navngivne
// events. Anonyme forbindelser (standvæggen) må KUN lytte: de kan joine et
// rum og modtage broadcasts, men aldrig sætte presence-navn eller emit'e.
//
// Packrush, opgave B: hver forbindelse får sin egen admin/stand-ROLLE ved
// selve WS-håndtrykket (læst fra samme session-cookie som HTTP-adminpanelet
// bruger — browseren sender den automatisk med opgraderings-requesten, uden
// at klienten selv skal håndtere den). Presence- og duel-event-payloads er
// derfor IKKE længere én delt besked til alle i rummet: de beregnes pr.
// MODTAGER, så kun admin/stand-forbindelser ser fulde navne, se
// isPrivilegedNow()/displayName() nedenfor.
function attachWs(server, pool, opts) {
  opts = opts || {};
  const wss = new WebSocketServer({ noServer: true });
  const rooms = new Map(); // room -> Set<conn>
  const selvReferencer = new Map(); // room -> Map(reference-streng -> conn), se MODSTANDER_REF_FELT ovenfor

  server.on('upgrade', async (req, socket, head) => {
    let pathname;
    try {
      pathname = new URL(req.url, 'http://localhost').pathname;
    } catch (e) {
      socket.destroy();
      return;
    }
    if (pathname !== '/ws') {
      socket.destroy();
      return;
    }
    let adminRole = null;
    try {
      adminRole = await resolveSessionRole(pool, req);
    } catch (e) {
      adminRole = null;
    }
    // Gemmer det RÅ session-token (ikke kun rollen udledt af det ved selve
    // håndtrykket) — det er det eneste vi har til senere at GENvalidere
    // sessionen mod admin_session-tabellen, se isPrivilegedNow() og
    // revalideringsintervallet nedenfor.
    const sessionToken = parseCookies(req)[COOKIE_NAME] || null;
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.adminRole = adminRole; // 'admin' | 'stand' | null — kun et CACHET udgangspunkt, se ovenfor
      ws.sessionToken = sessionToken;
      wss.emit('connection', ws, req);
    });
  });

  function roomSet(room) {
    let s = rooms.get(room);
    if (!s) {
      s = new Set();
      rooms.set(room, s);
    }
    return s;
  }

  function roomReferenceMap(room) {
    let m = selvReferencer.get(room);
    if (!m) {
      m = new Map();
      selvReferencer.set(room, m);
    }
    return m;
  }

  // Registrerer AFSENDERENS eget selv-erklærede reference-felt (`data.a`
  // eller `data.tab`, se EGEN_REF_FELT/EGEN_REF_FELT_ALT/MODSTANDER_REF_FELT
  // ovenfor) — en selv-erklæring om "dette ER mig" er ufarlig at stole på
  // som opslagsnøgle (i modsætning til en PÅSTAND om nogen ANDEN, som `bn`
  // er). Selve NAVNET der til sidst vises slås dog altid op via
  // `conn.player.navn`, ALDRIG via noget klienten selv har sendt (se N6).
  function registrerSelvReference(room, ref, conn) {
    if (ref == null) return;
    if (typeof ref !== 'string' && typeof ref !== 'number') return;
    roomReferenceMap(room).set(String(ref), conn);
  }

  // Finder frem til den forbindelse en modstander-reference (`data.b`)
  // PÅSTÅS at pege på — se filens toptekst for de to understøttede
  // konventioner. Returnerer null hvis ingen kendt forbindelse matcher.
  function findConnByReference(room, ref) {
    if (ref == null) return null;
    const somTal = Number(ref);
    if (Number.isFinite(somTal)) {
      for (const conn of roomSet(room)) {
        if (conn.connId === somTal) return conn;
      }
    }
    return roomReferenceMap(room).get(String(ref)) || null;
  }

  // FRISK genvalidering af conn's session, lige før den bruges til at
  // afgøre om et fuldt navn må afsløres — slår ALTID admin_session-tabellen
  // op igen (i stedet for at stole på det cachede ws.adminRole fra
  // håndtrykket), og opdaterer cachen undervejs (bruges også af den
  // periodiske revalidering, se startRevalidation() nedenfor). Ingen
  // session-cookie ved håndtrykket ⇒ aldrig privilegeret, ingen DB-slag
  // nødvendigt.
  async function isPrivilegedNow(conn) {
    if (!conn.sessionToken) return false;
    let rolle = null;
    try {
      rolle = await resolveRoleForToken(pool, conn.sessionToken);
    } catch (e) {
      rolle = null;
    }
    conn.adminRole = rolle;
    return rolle === 'admin' || rolle === 'stand';
  }

  function displayName(navn, privileged) {
    return privileged ? navn : shortName(navn);
  }

  // Overskriver ALTID AFSENDER_NAVN_FELTER i et duel-events `data` med
  // serverens egen, korrekt maskerede visning af AFSENDERENS navn (aldrig
  // hvad klienten selv indsatte) — se filens toptekst. Beregnes pr.
  // MODTAGER (samme personalisering som `from.name`), da masking afhænger af
  // modtagerens privilegie, ikke afsenderens.
  function sanitizedEmitData(data, fuldtAfsenderNavn, privileged, room) {
    if (!data || typeof data !== 'object') return data;
    const ud = { ...data };
    const visNavn = displayName(fuldtAfsenderNavn, privileged);
    for (const felt of AFSENDER_NAVN_FELTER) {
      if (felt in ud) ud[felt] = visNavn;
    }
    // Punkt 3 (tredje runde): se MODSTANDER_NAVN_FELT-kommentaren i filens
    // toptekst. `bn` overskrives ALTID hvis feltet er til stede — enten med
    // serverens egen maskerede visning af den FAKTISK matchede forbindelses
    // navn, eller (matcher intet) en tom streng. Klientens indsendte `bn`
    // bruges ALDRIG direkte.
    //
    // N6 (fjerde runde): navnet hentes UDELUKKENDE fra modstanderens
    // `player.navn` (den autoritative kilde) — ALDRIG fra
    // `modstander.presenceName`, som hidtil blev foretrukket her. Se N6-
    // kommentaren ved selve presence-håndteringen nedenfor for hvorfor
    // presenceName ikke længere kan bære nogen navneværdi overhovedet.
    if (MODSTANDER_NAVN_FELT in ud) {
      const modstander = findConnByReference(room, ud[MODSTANDER_REF_FELT]);
      const modstanderNavn = modstander && modstander.player ? modstander.player.navn : null;
      ud[MODSTANDER_NAVN_FELT] = modstanderNavn ? displayName(modstanderNavn, privileged) : '';
    }
    return ud;
  }

  // N6 (fjerde opfølgende runde, afsluttende review): navnet i presence-
  // listen kommer nu UDELUKKENDE fra `conn.player.navn` (den autoritative
  // kilde, maskeret efter MODTAGERENS privilegie som hidtil) — aldrig fra
  // klientens selv-indsendte `presence`-tekst. `conn.presenceName` er
  // stadig en FLAG-værdi ("er denne forbindelse sat synlig i rummet"), men
  // bærer ikke længere selve navneteksten, se presence-håndteringen
  // nedenfor.
  async function presenceListFor(room, privileged) {
    const out = [];
    for (const conn of roomSet(room)) {
      if (conn.presenceName && conn.player) {
        out.push({ id: conn.connId, name: displayName(conn.player.navn, privileged) });
      }
    }
    return out;
  }

  // Beregner payloaden PR. MODTAGER (ikke én delt besked) — se filens
  // toptekst. Anonyme lyttere og almindelige spillere får forkortede navne,
  // admin/stand-forbindelser får fulde — men KUN hvis deres session stadig
  // er gyldig LIGE NU (isPrivilegedNow), ikke bare ved selve håndtrykket.
  async function broadcastPresence(room) {
    for (const conn of roomSet(room)) {
      const privileged = await isPrivilegedNow(conn);
      const payload = JSON.stringify({ type: 'presence', room, users: await presenceListFor(room, privileged) });
      safeSend(conn, payload);
    }
  }

  function safeSend(conn, payload) {
    try {
      if (conn.readyState === conn.OPEN) conn.send(payload);
    } catch (e) {
      /* ignore */
    }
  }

  // Broadcastes til ALLE forbindelser (ikke kun ét rum) når spillerdata/config
  // ændres, så klienter ved de skal genhente GET /state. Ingen navne i denne
  // besked — ingen personalisering nødvendig (GET /state maskerer selv, ud
  // fra samme sessionscookie, se src/routes/state.js).
  function broadcastStateChanged() {
    const payload = JSON.stringify({ type: 'state.changed' });
    for (const client of wss.clients) safeSend(client, payload);
  }

  let connSeq = 0;

  wss.on('connection', (ws) => {
    ws.connId = ++connSeq;
    ws.player = null;
    ws.rooms = new Set();
    ws.presenceName = null;
    ws.msgTimes = [];

    ws.on('message', async (raw) => {
      if (Buffer.byteLength(raw) > MAX_MSG_BYTES) {
        return safeSend(ws, JSON.stringify({ type: 'error', message: 'Besked for stor.' }));
      }

      const now = Date.now();
      ws.msgTimes = ws.msgTimes.filter((t) => now - t < 1000);
      if (ws.msgTimes.length >= MAX_MSGS_PER_SEC) {
        return safeSend(ws, JSON.stringify({ type: 'error', message: 'For mange beskeder for hurtigt.' }));
      }
      ws.msgTimes.push(now);

      let msg;
      try {
        msg = JSON.parse(raw.toString('utf8'));
      } catch (e) {
        return safeSend(ws, JSON.stringify({ type: 'error', message: 'Ugyldig JSON.' }));
      }
      if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') return;

      if (msg.type === 'hello') {
        let nySpiller = null;
        if (msg.token) {
          try {
            nySpiller = await tryLoadPlayer(pool, msg.token);
          } catch (e) {
            nySpiller = null;
          }
        }
        if (nySpiller) {
          ws.player = nySpiller;
        } else {
          // N5 (fjerde opfølgende runde, afsluttende review): `hello` UDEN
          // et gyldigt token (fx "Næste spiller"/logout på en standtablet)
          // nulstillede hidtil IKKE ws.player/presenceName på selve
          // forbindelsen — den forblev logget ind som den FORRIGE spiller,
          // og presence-listen viste stadig forrige spillers navn til
          // andre. Nulstil eksplicit her, og broadcast den opdaterede
          // presence-liste til resten af rummet/rummene med det samme, i
          // stedet for at vente på at forbindelsen til sidst lukkes.
          const varSynlig = !!ws.presenceName;
          ws.player = null;
          ws.presenceName = null;
          if (varSynlig) {
            for (const room of ws.rooms) await broadcastPresence(room);
          }
        }
        return safeSend(ws, JSON.stringify({ type: 'hello.ok', authenticated: !!ws.player }));
      }

      if (msg.type === 'join') {
        const room = String(msg.room || '').slice(0, 60);
        if (!room) return;
        roomSet(room).add(ws);
        ws.rooms.add(room);
        const privileged = await isPrivilegedNow(ws);
        return safeSend(
          ws,
          JSON.stringify({ type: 'joined', room, users: await presenceListFor(room, privileged) })
        );
      }

      if (msg.type === 'presence') {
        if (!ws.player) {
          return safeSend(ws, JSON.stringify({ type: 'error', message: 'Kræver spiller-login for at sætte presence.' }));
        }
        const room = String(msg.room || '').slice(0, 60);
        if (!room) return;
        roomSet(room).add(ws);
        ws.rooms.add(room);
        // N6 (fjerde opfølgende runde, afsluttende review): `msg.name` var
        // hidtil FRIT klient-fritekst (op til 22 tegn) der blev gemt som
        // `ws.presenceName` og siden vist UFILTRERET og PRIVILIGERET (kun
        // maskeret, aldrig erstattet) til andre forbindelser — både i selve
        // presence-broadcastet og som duel-afsendernavn (se emit
        // nedenfor). En spiller kunne dermed udgive sig for hvem som helst.
        // `msg.name` IGNORERES nu HELT — vi bruger `ws.presenceName`
        // udelukkende som en boolsk markør ("denne forbindelse er synlig i
        // rummet"), aldrig som en navneværdi. Selve navnet slås op FRISKT
        // fra `ws.player.navn` hver gang det skal vises, se
        // presenceListFor()/emit-håndteringen.
        ws.presenceName = true;
        await broadcastPresence(room);
        return;
      }

      if (msg.type === 'emit') {
        if (!ws.player) {
          return safeSend(ws, JSON.stringify({ type: 'error', message: 'Kræver spiller-login for at sende events.' }));
        }
        const room = String(msg.room || '').slice(0, 60);
        const event = String(msg.event || '');
        if (!room || !DUEL_EVENTS.has(event)) {
          return safeSend(ws, JSON.stringify({ type: 'error', message: 'Ukendt eller manglende event/rum.' }));
        }
        // N6: se presence-håndteringen ovenfor — afsenderens navn er ALTID
        // den autoritative `ws.player.navn` (maskeret pr. modtager
        // nedenfor), aldrig noget klienten selv har indsendt.
        const fuldtNavn = ws.player.navn;
        // Registrér afsenderens selv-erklærede reference (`data.a`/`data.tab`,
        // se EGEN_REF_FELT/EGEN_REF_FELT_ALT ovenfor) FØR broadcast — se
        // registrerSelvReference()/MODSTANDER_NAVN_FELT-kommentaren i
        // filens toptekst. Skader ikke selv om DENNE besked ikke selv
        // indeholder `bn` (fx duel.s/duel.waiting/duel.idle); registreringen
        // bruges kun af en SENERE afsenders `bn`-opslag.
        if (msg.data && typeof msg.data === 'object') {
          registrerSelvReference(room, msg.data[EGEN_REF_FELT], ws);
          registrerSelvReference(room, msg.data[EGEN_REF_FELT_ALT], ws);
        }
        for (const conn of roomSet(room)) {
          if (conn === ws) continue;
          const privileged = await isPrivilegedNow(conn);
          const payload = JSON.stringify({
            type: 'event',
            room,
            event,
            data: sanitizedEmitData(msg.data, fuldtNavn, privileged, room),
            from: { id: ws.connId, name: displayName(fuldtNavn, privileged) },
          });
          safeSend(conn, payload);
        }
        return;
      }
    });

    ws.on('close', async () => {
      for (const room of ws.rooms) {
        const s = rooms.get(room);
        if (s) {
          s.delete(ws);
          if (ws.presenceName) await broadcastPresence(room);
          if (s.size === 0) rooms.delete(room);
        }
        const refMap = selvReferencer.get(room);
        if (refMap) {
          for (const [ref, conn] of refMap) {
            if (conn === ws) refMap.delete(ref);
          }
          if (refMap.size === 0) selvReferencer.delete(room);
        }
      }
    });
  });

  // Periodisk baggrunds-revalidering (se filens toptekst): fanger en
  // admin/stand-session der udløber/logges ud MENS forbindelsen er åben,
  // selv hvis den forbindelse ikke aktivt sender/modtager beskeder lige nu
  // (isPrivilegedNow() alene dækker kun forbindelser der RENT FAKTISK er
  // med i en besked-udveksling). Lukker forbindelsen når privilegiet
  // forsvinder, i stedet for at lade den hænge i en tavs, forældet tilstand.
  const revalidateMs = (opts.revalidateMs != null ? opts.revalidateMs : DEFAULT_REVALIDATE_MS);
  const revalidateTimer = setInterval(async () => {
    for (const conn of wss.clients) {
      if (!conn.sessionToken) continue;
      const varPrivilegeret = conn.adminRole === 'admin' || conn.adminRole === 'stand';
      const erStadigPrivilegeret = await isPrivilegedNow(conn);
      if (varPrivilegeret && !erStadigPrivilegeret) {
        try {
          conn.close(1008, 'Session udløbet eller logget ud.');
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, revalidateMs);
  if (typeof revalidateTimer.unref === 'function') revalidateTimer.unref();

  function stopRevalidation() {
    clearInterval(revalidateTimer);
  }

  return { wss, broadcastStateChanged, stopRevalidation };
}

module.exports = { attachWs };
