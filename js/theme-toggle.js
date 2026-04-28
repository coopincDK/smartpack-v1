/* SmartPack Theme Toggle
   Priority: 1) localStorage  2) prefers-color-scheme  3) light (default)
   ------------------------------------------------------------------ */
(function() {
  var STORAGE_KEY = 'sp-theme';

  // Resolve theme: stored > system > light
  function getPreferred() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  // Apply theme to <html>
  function apply(theme) {
    var html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  // Apply immediately (before paint) to avoid flash
  apply(getPreferred());

  // After DOM ready, wire up toggle buttons
  document.addEventListener('DOMContentLoaded', function() {
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var html = document.documentElement;
        // Add transition class for smooth switch
        html.classList.add('theme-transition');
        var current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        apply(next);
        localStorage.setItem(STORAGE_KEY, next);
        // Remove transition class after animation
        setTimeout(function() { html.classList.remove('theme-transition'); }, 350);
      });
    });

    // Listen for system theme changes (when no manual override)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          apply(e.matches ? 'dark' : 'light');
        }
      });
    }
  });
})();
