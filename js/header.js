/* ============================================================
   SmartPack — Centraliseret header
   Rediger KUN denne fil for at opdatere nav på ALLE sider.
   ============================================================ */
(function () {
  var placeholder = document.getElementById('sp-header');
  if (!placeholder) return;

  placeholder.outerHTML = [
    '<header class="site-header" id="site-header">',
    '  <nav class="nav container">',
    '    <a href="/" class="nav__logo">',
    '      <img src="/assets/cropped-favicon-smartpack.png" alt="SmartPack logo" class="nav__logo-img">',
    '      <span class="nav__logo-text">SmartPack</span>',
    '    </a>',
    '    <ul class="nav__links" id="nav-links">',
    '      <li class="nav__item--has-dropdown">',
    '        <button class="nav__link nav__dropdown-btn" aria-expanded="false" aria-haspopup="true">Udforsk SmartPack <svg class="nav__chevron" viewBox="0 0 10 6" width="10" height="6" fill="currentColor" aria-hidden="true"><path d="M0 0l5 6 5-6z"/></svg></button>',
    '        <div class="nav__megamenu">',
    '          <a href="/funktioner.html" class="nav__mega-item"><strong>Funktioner</strong><span>Alt hvad dit lager har brug for</span></a>',
    '          <a href="/integrationer.html" class="nav__mega-item"><strong>Integrationer</strong><span>Forbindelser klar til brug</span></a>',
    '          <a href="/faq.html" class="nav__mega-item"><strong>FAQ</strong><span>Svar p&aring; de hyppigste sp&oslash;rgsm&aring;l</span></a>',
    '          <a href="/om-os.html" class="nav__mega-item"><strong>Om os</strong><span>Historien bag SmartPack</span></a>',
    '          <a href="/medarbejdere.html" class="nav__mega-item"><strong>Teamet</strong><span>M&oslash;d folkene bag systemet</span></a>',
    '          <a href="/3pl.html" class="nav__mega-item"><strong>3PL &amp; Lagerhotel</strong><span>WMS til lagerhoteller</span></a>',
    '        </div>',
    '      </li>',
    '      <li><a href="/priser.html" class="nav__link">Priser</a></li>',
    '      <li><a href="/cases.html" class="nav__link">Cases</a></li>',
    '      <li><a href="/viden/" class="nav__link">Viden</a></li>',
    '    </ul>',
    '    <div class="nav__actions">',
    '      <a href="https://support.smartpack.dk" target="_blank" rel="noopener" class="nav__support-link">Log ind &amp; support &rarr;</a>',
    '      <a href="/kontakt.html" class="btn btn--ghost nav__cta">Kontakt</a>',
    '      <a href="/kontakt.html" class="btn btn--primary nav__cta">Book demo</a>',
    '      <button class="theme-toggle" aria-label="Skift tema"><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button>',
    '      <button class="nav__hamburger" id="nav-hamburger" aria-label="&Aring;bn menu">',
    '        <span></span><span></span><span></span>',
    '      </button>',
    '    </div>',
    '  </nav>',
    '</header>'
  ].join('\n');

  // Markér aktiv side i nav
  var path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav__mega-item').forEach(function (a) {
    if (!a.href) return;
    var linkPath = new URL(a.href, window.location.origin).pathname;
    if (linkPath === path || (linkPath !== '/' && path.startsWith(linkPath))) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('is-active');
    }
  });
})();
