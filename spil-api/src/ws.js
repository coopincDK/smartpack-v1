'use strict';

const { WebSocketServer } = require('ws');
const { tryLoadPlayer } = require('./middleware/playerAuth');
const { resolveSessionRole, resolveRoleForToken, parseCookies, COOKIE_NAME } = require('./middleware/adminAuth');
const { shortName } = require('./rules/nameDisplay');

const MAX_MSG_BYTES = 4096;
const MAX_MSGS_PER_SEC = 10;
const DUEL_EVENTS = new Set(['duel.go', 'duel.s']);
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

  async function presenceListFor(room, privileged) {
    const out = [];
    for (const conn of roomSet(room)) {
      if (conn.presenceName) out.push({ id: conn.connId, name: displayName(conn.presenceName, privileged) });
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
        if (msg.token) {
          try {
            ws.player = await tryLoadPlayer(pool, msg.token);
          } catch (e) {
            ws.player = null;
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
        ws.presenceName = String(msg.name || ws.player.navn || '').slice(0, 22);
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
        const fuldtNavn = ws.presenceName || ws.player.navn;
        for (const conn of roomSet(room)) {
          if (conn === ws) continue;
          const privileged = await isPrivilegedNow(conn);
          const payload = JSON.stringify({
            type: 'event',
            room,
            event,
            data: msg.data,
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
