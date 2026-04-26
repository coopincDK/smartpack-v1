/* ===========================================
   SMARTPACK.DK — JAVASCRIPT
=========================================== */

'use strict';

// --- NAV: Scroll-to-scrolled state ---
const header = document.getElementById('site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- NAV: Mobile hamburger toggle ---
const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');

function closeNav() {
  if (hamburger && navLinks) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.nav__item--has-dropdown.open').forEach(function(item) {
    item.classList.remove('open');
    var btn = item.querySelector('.nav__dropdown-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    if (!open) closeAllDropdowns();
  });

  // Close nav on regular link click (not dropdown button)
  navLinks.querySelectorAll('.nav__link:not(.nav__dropdown-btn), .nav__mega-item').forEach(function(link) {
    link.addEventListener('click', function() {
      closeNav();
      closeAllDropdowns();
    });
  });
}

// --- NAV: Mega-menu dropdown (works on both desktop and mobile) ---
document.querySelectorAll('.nav__item--has-dropdown').forEach(function(item) {
  var btn = item.querySelector('.nav__dropdown-btn');
  if (!btn) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    // Close other dropdowns
    document.querySelectorAll('.nav__item--has-dropdown.open').forEach(function(other) {
      if (other !== item) {
        other.classList.remove('open');
        var otherBtn = other.querySelector('.nav__dropdown-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
    var isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});

// Close dropdowns on outside click (use event.target.closest to avoid touch issues)
document.addEventListener('click', function(e) {
  // Don't close if clicking inside the dropdown or the button
  if (e.target.closest('.nav__item--has-dropdown') || e.target.closest('.nav__hamburger')) return;
  closeAllDropdowns();
  // Close mobile nav if clicking outside header
  if (header && !header.contains(e.target)) closeNav();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAllDropdowns();
    closeNav();
  }
});

// --- REVEAL: Scroll-triggered animations ---
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));
}

// --- STATS: Animated number counters ---
const statNumbers = document.querySelectorAll('.stats__number[data-count]');
if (statNumbers.length) {
  const animateCounter = (el) => {
    const target  = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const current = Math.round(eased * target);
      el.textContent = current;
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statNumbers.forEach(animateCounter);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }
}

// --- SMOOTH SCROLL: anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- SELF-ONBOARD: Email signup ---
window.handleSignup = function(e) {
  e.preventDefault();
  const form  = e.target;
  const email = form.querySelector('input[type="email"]').value;
  const btn   = form.querySelector('button');

  // Visual feedback
  btn.textContent = 'Du er skrevet op ✓';
  btn.style.background = 'var(--accent)';
  btn.style.color = '#060f09';
  btn.disabled = true;
  form.querySelector('input').disabled = true;

  // TODO: Replace with actual API call / Mailchimp / ConvertKit etc.
  // fetch('/api/signup', { method: 'POST', body: JSON.stringify({ email }) })
  console.log('Signup:', email);
};

// --- HERO LOGOS: auto-scroll on mobile ---
// (CSS marquee-style if needed, handled via CSS)

// --- INTEGRATION LOGOS: hover filter toggle ---
document.querySelectorAll('.integration-logo').forEach(logo => {
  const img = logo.querySelector('img');
  if (img) {
    logo.addEventListener('mouseenter', () => { img.style.opacity = '1'; img.style.filter = 'none'; });
    logo.addEventListener('mouseleave', () => { img.style.opacity = '0.7'; img.style.filter = 'brightness(0) invert(1)'; });
  }
});

// --- ACTIVE NAV LINK: highlight on scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link');
if (sections.length && navLinkEls.length) {
  const onScrollSpy = () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinkEls.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };
  window.addEventListener('scroll', onScrollSpy, { passive: true });
}

// --- PHONE CTA: Show/hide based on Danish office hours (9-16 weekdays) ---
(function() {
  function checkHours() {
    var now = new Date();
    var dk = now.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen', hour: 'numeric', hour12: false });
    var hour = parseInt(dk, 10);
    var dayStr = now.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen', weekday: 'short' });
    var isWeekday = ['Mon','Tue','Wed','Thu','Fri'].indexOf(dayStr) !== -1;
    var isOpen = isWeekday && hour >= 9 && hour < 16;

    // Phone buttons (ring-knap)
    document.querySelectorAll('.js-phone-cta').forEach(function(el) {
      el.style.display = isOpen ? '' : 'none';
    });
    // Mail CTA (primary when closed)
    document.querySelectorAll('.js-mail-cta').forEach(function(el) {
      el.style.display = isOpen ? 'none' : '';
    });
    // Hero text swap
    document.querySelectorAll('.js-hero-open').forEach(function(el) {
      el.style.display = isOpen ? '' : 'none';
    });
    document.querySelectorAll('.js-hero-closed').forEach(function(el) {
      el.style.display = isOpen ? 'none' : '';
    });
    // Phone status badges
    document.querySelectorAll('.js-phone-status-open').forEach(function(el) {
      el.style.display = isOpen ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('.js-phone-status-closed').forEach(function(el) {
      el.style.display = isOpen ? 'none' : 'inline-flex';
    });
    // CTA closed message
    document.querySelectorAll('.js-cta-closed').forEach(function(el) {
      el.style.display = isOpen ? 'none' : '';
    });
  }
  checkHours();
  setInterval(checkHours, 60000);
})();

// --- STAGGERED card reveal (extra polish) ---
const staggerGroups = [
  '.problem__grid',
  '.cases__grid',
  '.features__grid',
];
staggerGroups.forEach(selector => {
  const parent = document.querySelector(selector);
  if (!parent) return;
  const children = parent.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});
