'use strict';

// Klient-IP: vi stoler UDELUKKENDE på X-Client-IP (sat af host-nginx ud fra
// Cloudflares CF-Connecting-IP i fase 2 — se README.md/API.md). Vi stoler
// ALDRIG på X-Forwarded-For fra klienten, og `trust proxy` sættes ikke.
function clientIp(req) {
  const header = req.headers['x-client-ip'];
  if (typeof header === 'string' && header.trim()) return header.trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : null;
}

module.exports = { clientIp };
