'use strict';

const express = require('express');
const { getPublicState } = require('../publicState');
const { attachViewerRole } = require('../middleware/adminAuth');

function stateRouter(pool) {
  const router = express.Router();
  const viewerRole = attachViewerRole(pool);

  router.get('/state', viewerRole, async (req, res, next) => {
    try {
      const state = await getPublicState(pool, req.viewerPrivileged);
      res.json(state);
    } catch (e) {
      next(e);
    }
  });
  return router;
}

module.exports = { stateRouter };
