'use strict';

const express = require('express');
const { getPublicState } = require('../publicState');

function stateRouter(pool) {
  const router = express.Router();
  router.get('/state', async (req, res, next) => {
    try {
      const state = await getPublicState(pool);
      res.json(state);
    } catch (e) {
      next(e);
    }
  });
  return router;
}

module.exports = { stateRouter };
