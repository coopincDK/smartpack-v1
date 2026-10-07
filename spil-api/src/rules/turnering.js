'use strict';

// Fælles regel for "er vi i den lukkede turnering lige nu?" (Martin 7/10 2026):
// periodens dage (cfg.periodStart..periodEnd) kl. 8.00-16.30 dansk tid.
// I turneringen gælder ens regler for alle: én Black Friday-vagt pr. time og
// almindelig liv-gendannelse. Uden for turneringen giver SmartPacks nyhedsmail
// ubegrænset Black Friday-vagt, og 3 flueben giver 3 liv i timen.
function cphDele(d) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
  const g = (t) => p.find((x) => x.type === t).value;
  return { dag: `${g('year')}-${g('month')}-${g('day')}`, time: Number(g('hour')), minut: Number(g('minute')) };
}

function iTurnering(cfg, now) {
  if (!cfg || !cfg.periodStart) return false;
  const c = cphDele(now || new Date());
  const slut = cfg.periodEnd || cfg.periodStart;
  if (c.dag < cfg.periodStart || c.dag > slut) return false;
  const min = c.time * 60 + c.minut;
  return min >= 8 * 60 && min < 16 * 60 + 30;
}

module.exports = { iTurnering, cphDele };
