'use strict';

const http = require('http');
const config = require('./config');
const { createPool, migrate } = require('./db');
const { createApp } = require('./app');
const { attachWs } = require('./ws');
const { startCrmSynk } = require('./crmSynk');
const { startSmsJobs } = require('./smsJobs');

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
  startCrmSynk(pool);
  startSmsJobs(pool);

  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[spil-api] lytter på port ${config.port}`);
  });

  return { server, pool };
}

// En afvist løfte-kæde uden handler (fx en glemt await i baggrundsarbejde) må
// ikke tage hele serveren ned: log fejlen — kun navn og besked, aldrig
// request-body eller persondata — og kør videre. Route-fejl går i øvrigt til
// Express' fejl-handler (middleware/asyncFejl.js) og når aldrig hertil.
// uncaughtException er derimod ægte ukendt tilstand: log og afslut, så
// Docker genstarter containeren.
function installerProcesHandlere() {
  process.on('unhandledRejection', (aarsag) => {
    const navn = aarsag && aarsag.name ? aarsag.name : typeof aarsag;
    const besked = aarsag && aarsag.message ? aarsag.message : '';
    // eslint-disable-next-line no-console
    console.error(`[spil-api] unhandledRejection: ${navn}: ${besked}`);
  });
  process.on('uncaughtException', (e) => {
    // eslint-disable-next-line no-console
    console.error('[spil-api] uncaughtException:', e);
    process.exit(1);
  });
}

if (require.main === module) {
  installerProcesHandlere();
  main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
