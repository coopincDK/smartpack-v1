/* Viser vilkårssiderne (/spil/vilkaar/ og /spil/partnervilkaar/) som et lag
   oven på siden med et X i hjørnet, i stedet for at åbne en ny fane. Det er
   nemmere at lukke igen på en mobil. Uden JavaScript virker linket som normalt. */
(function () {
  'use strict';
  var STI = /^\/spil\/((partner)?vilkaar|partnerprivatliv)\/?$/;
  var lag = null, ramme = null, titel = null, sidstFokus = null;

  function byg() {
    var css = document.createElement('style');
    css.textContent =
      '.vo-lag{position:fixed;inset:0;z-index:10000;background:rgba(1,14,34,.72);display:flex;align-items:stretch;justify-content:center;padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom))}' +
      '.vo-lag[hidden]{display:none}' +
      '.vo-boks{position:relative;width:100%;max-width:760px;background:#010E22;border:1px solid #243041;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
      '.vo-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 10px 10px 16px;border-bottom:1px solid #243041;color:#F1F5F9;font:600 15px Inter,system-ui,sans-serif}' +
      '.vo-x{flex:none;width:44px;height:44px;border-radius:10px;border:1px solid #243041;background:#0D1520;color:#F1F5F9;font-size:26px;line-height:1;cursor:pointer}' +
      '.vo-x:focus-visible{outline:2px solid #C8955A;outline-offset:2px}' +
      '.vo-ramme{flex:1;width:100%;border:0;background:#010E22}' +
      'body.vo-aaben{overflow:hidden}';
    document.head.appendChild(css);
    lag = document.createElement('div');
    lag.className = 'vo-lag'; lag.hidden = true;
    lag.setAttribute('role', 'dialog'); lag.setAttribute('aria-modal', 'true');
    var boks = document.createElement('div'); boks.className = 'vo-boks';
    var top = document.createElement('div'); top.className = 'vo-top';
    titel = document.createElement('span'); titel.id = 'vo-titel';
    lag.setAttribute('aria-labelledby', 'vo-titel');
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'vo-x'; x.textContent = '×'; x.setAttribute('aria-label', 'Luk vilkårene');
    x.addEventListener('click', luk);
    top.append(titel, x);
    ramme = document.createElement('iframe'); ramme.className = 'vo-ramme'; ramme.title = 'Vilkår';
    boks.append(top, ramme);
    lag.append(boks);
    lag.addEventListener('click', function (e) { if (e.target === lag) luk(); });
    document.body.appendChild(lag);
  }

  function aabn(url, tekst) {
    if (!lag) byg();
    sidstFokus = document.activeElement;
    titel.textContent = tekst;
    ramme.src = url;
    lag.hidden = false;
    document.body.classList.add('vo-aaben');
    lag.querySelector('.vo-x').focus();
  }

  function luk() {
    if (!lag || lag.hidden) return;
    lag.hidden = true;
    ramme.src = 'about:blank';
    document.body.classList.remove('vo-aaben');
    if (sidstFokus && sidstFokus.focus) sidstFokus.focus();
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') luk(); });
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
    if (u.origin !== location.origin || !STI.test(u.pathname)) return;
    e.preventDefault();
    e.stopPropagation();
    aabn(u.pathname + u.search, /privatliv/.test(u.pathname) ? 'Privatlivspolitik' : /partner/.test(u.pathname) ? 'Vilkår for partnere' : 'Vilkår for konkurrencen');
  }, true);
})();
