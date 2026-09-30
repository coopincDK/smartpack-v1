'use strict';

const { WebSocketServer } = require('ws');
const { tryLoadPlayer } = require('./middleware/playerAuth');
const { resolveSessionRole } = require('./middleware/adminAuth');
const { shortName } = require('./rules/nameDisplay');

const MAX_MSG_BYTES = 4096;
const MAX_MSGS_PER_SEC = 10;
const DUEL_EVENTS = new Set(['duel.go', 'duel.s']);

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
// isPrivileged()/displayName() nedenfor.
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
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.adminRole = adminRole; // 'admin' | 'stand' | null
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

  function isPrivileged(conn) {
    return conn.adminRole === 'admin' || conn.adminRole === 'stand';
  }

  function displayName(navn, privileged) {
    return privileged ? navn : shortName(navn);
  }

  function presenceListFor(room, privileged) {
    const out = [];
    for (const conn of roomSet(room)) {
      if (conn.presenceName) out.push({ id: conn.connId, name: displayName(conn.presenceName, privileged) });
    }
    return out;
  }

  // Beregner payloaden PR. MODTAGER (ikke én delt besked) — se filens
  // toptekst. Anonyme lyttere og almindelige spillere får forkortede navne,
  // admin/stand-forbindelser får fulde.
  function broadcastPresence(room) {
    for (const conn of roomSet(room)) {
      const payload = JSON.stringify({ type: 'presence', room, users: presenceListFor(room, isPrivileged(conn)) });
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
        return safeSend(
          ws,
          JSON.stringify({ type: 'joined', room, users: presenceListFor(room, isPrivileged(ws)) })
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
        broadcastPresence(room);
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
          const payload = JSON.stringify({
            type: 'event',
            room,
            event,
            data: msg.data,
            from: { id: ws.connId, name: displayName(fuldtNavn, isPrivileged(conn)) },
          });
          safeSend(conn, payload);
        }
        return;
      }
    });

    ws.on('close', () => {
      for (const room of ws.rooms) {
        const s = rooms.get(room);
        if (s) {
          s.delete(ws);
          if (ws.presenceName) broadcastPresence(room);
          if (s.size === 0) rooms.delete(room);
        }
      }
    });
  });

  return { wss, broadcastStateChanged };
}

module.exports = { attachWs };
