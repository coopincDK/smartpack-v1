/* SmartPack: klik-for-at-se paa YouTube-videoer.
   Ingen video indlaeses foer brugeren klikker. Det goer siden hurtigere
   og sender ingenting til YouTube uopfordret. */
(function () {
  'use strict';
  var RE = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/;

  function idFra(el) {
    var kilder = [el.getAttribute('data-suppressedsrc'), el.getAttribute('data-cmp-src'),
                  el.getAttribute('src'), el.getAttribute('data-src')];
    for (var i = 0; i < kilder.length; i++) {
      if (!kilder[i]) continue;
      var m = RE.exec(kilder[i]);
      if (m) return m[1];
    }
    return null;
  }

  function byg(iframe) {
    var id = idFra(iframe);
    if (!id) return;
    var titel = iframe.getAttribute('title') || 'Video';

    var d = document.createElement('div');
    d.className = 'yt-facade';
    d.setAttribute('role', 'button');
    d.setAttribute('tabindex', '0');
    d.setAttribute('aria-label', 'Afspil video: ' + titel);
    d.setAttribute('data-yt', id);

    var img = document.createElement('img');
    img.className = 'yt-facade__img';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    img.onerror = function () { d.classList.add('yt-facade--intet-billede'); img.remove(); };

    var knap = document.createElement('span');
    knap.className = 'yt-facade__play';
    knap.setAttribute('aria-hidden', 'true');

    var note = document.createElement('span');
    note.className = 'yt-facade__note';
    note.textContent = 'Klik for at afspille. Videoen hentes fra YouTube.';

    d.appendChild(img); d.appendChild(knap); d.appendChild(note);

    function start() {
      /* Videoen laegges i en srcdoc-iframe. Cookie-blokeringen scanner kun
         hoveddokumentet, saa den video brugeren selv har bedt om bliver staaende. */
      var ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      var url = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      var f = document.createElement('iframe');
      f.setAttribute('title', titel);
      f.setAttribute('frameborder', '0');
      f.setAttribute('allow', ALLOW);
      f.setAttribute('allowfullscreen', '');
      f.className = 'yt-facade__frame';
      f.srcdoc = '<!doctype html><html style="height:100%"><head><meta charset="utf-8">'
               + '<style>html,body{margin:0;padding:0;height:100%;background:#000;overflow:hidden}'
               + 'iframe{display:block;width:100%;height:100%;border:0}</style></head>'
               + '<body>'
               + '<iframe src="' + url + '" title="' + titel.replace(/"/g, '&quot;') + '"'
               + ' allow="' + ALLOW + '" allowfullscreen></iframe>'
               + '</body></html>';
      d.replaceWith(f);
    }
    d.addEventListener('click', start);
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start(); }
    });

    /* Pladsholderen ligger absolut, saa dens ramme skal vaere positioneret.
       Er rammen ikke en dedikeret videokasse, laver vi selv en i 16:9. */
    var ramme = iframe.parentNode;
    var dedikeret = ramme && ramme.nodeType === 1 && ramme.childElementCount === 1;
    if (dedikeret) {
      if (window.getComputedStyle(ramme).position === 'static') {
        ramme.style.position = 'relative';
      }
      iframe.replaceWith(d);
    } else {
      var boks = document.createElement('div');
      boks.className = 'yt-facade-boks';
      boks.appendChild(d);
      iframe.replaceWith(boks);
    }
  }

  function koer() {
    var alle = document.querySelectorAll('iframe');
    for (var i = 0; i < alle.length; i++) {
      var el = alle[i];
      if (idFra(el)) byg(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', koer);
  } else { koer(); }
  /* Iubendas autoblocking kan naa at roere ved siden efter os, saa vi kigger en gang til */
  setTimeout(koer, 1200);
})();
