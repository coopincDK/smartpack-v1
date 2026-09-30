'use strict';

const http = require('http');
const config = require('./config');
const { createPool, migrate } = require('./db');
const { createApp } = require('./app');
const { attachWs } = require('./ws');

// Serveren kender IKKE selv til hvilken port den ender med at blive
// eksponeret på udadtil — den lytter blot på PORT (default 3000). I
// produktion bindes den til 127.0.0.1:8004 af docker-compose (fase 2).
async function main() {
  const pool = createPool(config.databaseUrl);
  await migrate(pool);

  const server = http.createServer();
  const ws = attachWs(server, pool);
  const app = createApp(pool, ws);
  server.on('request', app);

  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[spil-api] lytter på port ${config.port}`);
  });

  return { server, pool };
}

if (require.main === module) {
  main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
