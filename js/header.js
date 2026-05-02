/* ============================================================
   SmartPack — Centraliseret header
   Virker på alle domæner og subdirectory-deployments.
   ============================================================ */
(function () {
  // Detect base URL fra scriptets egen placering
  // Virker på både smartpack.dk/ OG github.io/smartpack-v1/
  var _src  = window._headerBase || (document.currentScript || {}).src || '';
  var _base = _src ? _src.replace(/\/js\/header\.js.*$/, '') : '';
  function url(path) { return _base + path; }

  function injectHeader() {
    var placeholder = document.getElementById('sp-header');
    if (!placeholder) return;

    var html = [
      '<div class="site-announce" id="site-announce">',
      '  <span class="site-announce__inner">',
      '    <span>Brug for et Bundlinjeboost? Skriv til <a href="mailto:bundlinjeboost@smartpack.dk" class="site-announce__link">bundlinjeboost@smartpack.dk</a></span>',
      '  </span>',
      '  <button class="site-announce__close" id="site-announce-close" aria-label="Luk">&#x2715;</button>',
      '</div>',
      '<header class="site-header" id="site-header">',
      '  <nav class="nav container">',
      '    <a href="' + url('/') + '" class="nav__logo">',
      '      <img src="' + url('/assets/cropped-favicon-smartpack.png') + '" alt="SmartPack logo" class="nav__logo-img">',
      '      <span class="nav__logo-text">SmartPack</span>',
      '    </a>',
      '    <ul class="nav__links" id="nav-links">',
      '      <li class="nav__item--has-dropdown">',
      '        <button class="nav__link nav__dropdown-btn" aria-expanded="false" aria-haspopup="true">Udforsk SmartPack <svg class="nav__chevron" viewBox="0 0 10 6" width="10" height="6" fill="currentColor" aria-hidden="true"><path d="M0 0l5 6 5-6z"/></svg></button>',
      '        <div class="nav__megamenu">',
      '          <a href="' + url('/funktioner.html') + '" class="nav__mega-item"><strong>Funktioner</strong><span>Alt hvad dit lager har brug for</span></a>',
      '          <a href="' + url('/integrationer.html') + '" class="nav__mega-item"><strong>Integrationer</strong><span>Forbindelser klar til brug</span></a>',
      '          <a href="' + url('/faq.html') + '" class="nav__mega-item"><strong>FAQ</strong><span>Svar på de hyppigste spørgsmål</span></a>',
      '          <a href="' + url('/om-os.html') + '" class="nav__mega-item"><strong>Om os</strong><span>Historien bag SmartPack</span></a>',
      '          <a href="' + url('/medarbejdere.html') + '" class="nav__mega-item"><strong>Teamet</strong><span>Mød folkene bag systemet</span></a>',
      '          <a href="' + url('/3pl.html') + '" class="nav__mega-item"><strong>3PL &amp; Lagerhotel</strong><span>WMS til lagerhoteller</span></a>',
      '          <a href="' + url('/roi.html') + '" class="nav__mega-item"><strong>ROI Beregner</strong><span>Hvad sparer du med SmartPack?</span></a>',
      '        </div>',
      '      </li>',
      '      <li><a href="' + url('/priser.html') + '" class="nav__link">Priser</a></li>',
      '      <li><a href="' + url('/cases.html') + '" class="nav__link">Cases</a></li>',
      '      <li><a href="' + url('/roi.html') + '" class="nav__link">Beregn ROI</a></li>',
      '    </ul>',
      '    <div class="nav__actions">',
      '      <a href="https://support.smartpack.dk" target="_blank" rel="noopener" class="nav__support-link">Log ind &amp; support &rarr;</a>',
      '      <a href="' + url('/kontakt.html') + '" class="btn btn--ghost nav__cta">Kontakt</a>',
      '      <a href="' + url('/kontakt.html') + '" class="btn btn--primary nav__cta">Book demo</a>',
      '      <button class="theme-toggle" aria-label="Skift tema"><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button>',
      '      <button class="nav__hamburger" id="nav-hamburger" aria-label="&Aring;bn menu">',
      '        <span></span><span></span><span></span>',
      '      </button>',
      '    </div>',
      '  </nav>',
      '</header>'
    ].join('\n');

    placeholder.insertAdjacentHTML('beforebegin', html);
    placeholder.parentNode.removeChild(placeholder);
    initNav();
  }

  function initNav() {
    // Announcement banner dismiss
    var announce      = document.getElementById('site-announce');
    var announceClose = document.getElementById('site-announce-close');
    if (announce && sessionStorage.getItem('sp-announce-closed')) {
      announce.style.display = 'none';
      document.documentElement.style.setProperty('--announce-h', '0px');
    }
    if (announceClose) {
      announceClose.addEventListener('click', function() {
        announce.style.display = 'none';
        document.documentElement.style.setProperty('--announce-h', '0px');
        sessionStorage.setItem('sp-announce-closed', '1');
      });
    }

    var hamburger = document.getElementById('nav-hamburger');
    var navLinks  = document.getElementById('nav-links');
    var header    = document.getElementById('site-header');

    function closeNav() {
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    }
    function closeAllDropdowns() {
      document.querySelectorAll('.nav__item--has-dropdown').forEach(function (item) {
        var btn = item.querySelector('.nav__dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
      });
    }

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var open = hamburger.classList.toggle('open');
        navLinks.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', String(open));
        document.body.classList.toggle('nav-open', open);
        if (!open) closeAllDropdowns();
      });
    }

    document.querySelectorAll('.nav__item--has-dropdown').forEach(function (item) {
      var btn = item.querySelector('.nav__dropdown-btn');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        document.querySelectorAll('.nav__item--has-dropdown').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var ob = other.querySelector('.nav__dropdown-btn');
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest && (e.target.closest('.nav__item--has-dropdown') || e.target.closest('.nav__hamburger'))) return;
      closeAllDropdowns();
      if (header && !header.contains(e.target)) closeNav();
    });

    // Theme toggle håndteres af theme-toggle.js (DOMContentLoaded)
    // Ingen duplicate listener her — det får toggle til at skifte 2x og går i nul

    // Markér aktiv side
    var path = window.location.pathname;
    document.querySelectorAll('.nav__link, .nav__mega-item').forEach(function (a) {
      if (!a.href) return;
      try {
        var linkPath = new URL(a.href, window.location.origin).pathname;
        if (linkPath === path || (linkPath !== '/' && path.startsWith(linkPath))) {
          a.setAttribute('aria-current', 'page');
          a.classList.add('is-active');
        }
      } catch (err) {}
    });
  }

  // Kør synkront — placeholder er i DOM på dette tidspunkt.
  // Fallback til DOMContentLoaded (fx hvis scriptet flyttes til <head>).
  if (document.getElementById('sp-header')) {
    injectHeader();
  } else {
    document.addEventListener('DOMContentLoaded', injectHeader);
  }
})();
