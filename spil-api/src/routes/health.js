'use strict';

const express = require('express');

function healthRouter() {
  const router = express.Router();
  router.get('/health', (req, res) => res.json({ ok: true }));
  return router;
}

module.exports = { healthRouter };
