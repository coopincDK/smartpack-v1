'use strict';

// Express 4 fanger kun synkrone fejl i en handler. En async-handler, der
// kaster (eller afviser), giver en unhandledRejection — og Node 20 afslutter
// så hele processen. Her lægges Express' egen Layer#handle_request om, så et
// afvist løfte fra ENHVER route/middleware sendes til next(err) og dermed til
// fejl-handleren i app.js (500, ingen stack til klienten). Dækker også
// fremtidige handlere, så ingen skal huske en try/catch eller wrap().
const Layer = require('express/lib/router/layer');

let paalagt = false;

function paalaegAsyncFejlhaandtering() {
  if (paalagt) return;
  paalagt = true;
  Layer.prototype.handle_request = function handleRequest(req, res, next) {
    const fn = this.handle;
    if (fn.length > 3) return next(); // fejl-handler, springes over her
    try {
      const r = fn(req, res, next);
      if (r && typeof r.catch === 'function') r.catch(next);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { paalaegAsyncFejlhaandtering };
