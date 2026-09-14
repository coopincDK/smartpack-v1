#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Holder viden-listerne i sync med de filer der faktisk ligger i repoet.

Fire ting bliver opdateret, alle ud fra artiklerne paa disken:
  1. "Nyeste artikler" paa viden/index.html (12 nyeste efter datePublished)
  2. Vidensleksikon-sektionen i llms.txt (alle artikler, per kategori)
  3. Kategori-index-siderne: artikler der mangler et kort, faar et
  4. sitemap.xml: viden-artikler der mangler en <url>, faar en

Scriptet fjerner og omrokerer ALDRIG kort paa kategorisiderne. Det tilfoejer
kun dem der mangler, saa den haandlavede raekkefoelge bliver staaende.
"""
import os, re, html, sys, io

ROD = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VIDEN = os.path.join(ROD, 'viden')

# mappe -> (navn paa viden-forsiden, kort navn paa kategorisiden, overskrift i llms.txt)
KATEGORIER = [
    ('fundamentals',   'Fundamentals',        'Fundamentals',   'Fundamentals'),
    ('problemer',      'Problemer',           'Problemer',      'Problemer paa lageret'),
    ('tech',           'Tech &amp; Integration', 'Teknologi',   'Teknologi og systemer'),
    ('okonomi',        '&Oslash;konomi',      '&Oslash;konomi', 'Lagerokonomi'),
    ('hardware',       'Hardware &amp; Setup', 'Hardware',      'Hardware og udstyr'),
    ('baeredygtighed', 'B&aelig;redygtighed', 'B&aelig;redygtighed', 'Baeredygtighed og ESG'),
    ('drift',          'Drift &amp; Compliance', 'Drift',       'Lagerdrift og processer'),
    ('personale',      'Personale',           'Personale',      'Personale og HR'),
    ('vaekst',         'V&aelig;kst',         'V&aelig;kst',    'Vaekst og skalering'),
    ('beslutning',     'Beslutning',          'Beslutning',     'Beslutningsguides'),
    ('realworld',      'Real-world',          'Real-world',     'Real-world scenarier'),
    ('retur',          'Returlogistik',       'Retur',          'Returhaandtering'),
]

def laes(sti):
    with open(sti, 'rb') as f:
        raw = f.read()
    bom = raw[:3] == b'\xef\xbb\xbf'
    txt = raw.decode('utf-8-sig')
    nl = '\r\n' if '\r\n' in txt else '\n'
    return txt, bom, nl

def skriv(sti, txt, bom):
    with open(sti, 'wb') as f:
        if bom:
            f.write(b'\xef\xbb\xbf')
        f.write(txt.encode('utf-8'))

def titel_af(txt):
    m = re.search(r'<title>(.*?)</title>', txt, re.S)
    t = m.group(1) if m else ''
    t = re.sub(r'\s*\|\s*SmartPack\s*$', '', t).strip()
    if not t:
        m = re.search(r'<h1[^>]*>(.*?)</h1>', txt, re.S)
        t = re.sub('<[^>]+>', '', m.group(1)).strip() if m else ''
    t = html.unescape(t)
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def find_artikler():
    ud = {}
    for mappe, _, _, _ in KATEGORIER:
        sti = os.path.join(VIDEN, mappe)
        if not os.path.isdir(sti):
            ud[mappe] = []
            continue
        rk = []
        for f in sorted(os.listdir(sti)):
            if not f.endswith('.html') or f == 'index.html':
                continue
            txt, _, _ = laes(os.path.join(sti, f))
            if 'http-equiv="refresh"' in txt.lower():
                continue          # redirect-stub, ikke en artikel
            d = re.search(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', txt)
            rk.append({'slug': f[:-5], 'fil': f, 'titel': titel_af(txt),
                       'dato': d.group(1) if d else '0000-00-00'})
        ud[mappe] = rk
    return ud

# ---------- 1. Nyeste artikler paa viden/index.html ----------
def nyeste(art, antal=12):
    sti = os.path.join(VIDEN, 'index.html')
    txt, bom, nl = laes(sti)
    start = txt.find('<!-- Nyeste artikler -->')
    if start < 0:
        print('viden/index.html: fandt ikke blokken, springer over'); return False
    aabn = txt.find('<div class="viden-articles"', start)
    if aabn < 0:
        print('viden/index.html: kunne ikke afgraense blokken, springer over'); return False
    dybde, slut = 0, -1
    for m in re.finditer(r'<div\b|</div>', txt[aabn:]):
        dybde += 1 if m.group(0) != '</div>' else -1
        if dybde == 0:
            slut = aabn + m.start(); break
    if slut < 0:
        print('viden/index.html: fandt ikke enden paa blokken, springer over'); return False
    # behold et evt. fast kort oeverst (guide/leksikon uden for viden/<kategori>/)
    gl = txt[aabn:slut]
    faste = re.findall(r'<a href="\./(?!\w+/)[^"]+" class="viden-article-card".*?</a>', gl, re.S)

    alle = []
    for mappe, navn, _, _ in KATEGORIER:
        for a in art[mappe]:
            alle.append((a['dato'], mappe, navn, a))
    alle.sort(key=lambda r: (r[0], r[3]['titel']), reverse=True)

    kort = list(faste)
    for _, mappe, navn, a in alle[:max(0, antal - len(faste))]:
        kort.append(
            '<a href="./%s/%s" class="viden-article-card" style="border-left:3px solid var(--accent);">%s'
            '        <span class="viden-article-card__cat">%s</span>%s'
            '        <div class="viden-article-card__title">%s</div>%s'
            '      </a>' % (mappe, a['slug'], nl, navn, nl, a['titel'], nl))
    ny = '<div class="viden-articles" style="margin-bottom:2rem;">%s      %s%s    ' % (
        nl, (nl + '      ').join(kort), nl)
    nytxt = txt[:aabn] + ny + txt[slut:]
    if nytxt != txt:
        skriv(sti, nytxt, bom)
        print('viden/index.html: Nyeste artikler opdateret (%d kort)' % len(kort))
        return True
    print('viden/index.html: uaendret')
    return False

# ---------- 2. llms.txt ----------
def llms(art):
    sti = os.path.join(ROD, 'llms.txt')
    if not os.path.exists(sti):
        print('llms.txt findes ikke, springer over'); return False
    txt, bom, nl = laes(sti)
    aendret = False
    for mappe, _, _, over in KATEGORIER:
        m = re.search(r'^### %s \(\d+ artikler\)[ \t]*\r?$' % re.escape(over), txt, re.M)
        if not m:
            print('llms.txt: fandt ikke sektionen "%s", springer over' % over); continue
        # sektionen loeber til naeste ### eller ##
        rest = txt[m.end():]
        n = re.search(r'^#{2,3} ', rest, re.M)
        slut = m.end() + (n.start() if n else len(rest))
        linjer = [('- %s : https://smartpack.dk/viden/%s/%s' % (a['titel'], mappe, a['slug']))
                  for a in sorted(art[mappe], key=lambda x: x['titel'].lower())]
        ny = '### %s (%d artikler)%s%s%s%s' % (over, len(art[mappe]), nl, nl,
                                               nl.join(linjer), nl + nl)
        if txt[m.start():slut] != ny:
            txt = txt[:m.start()] + ny + txt[slut:]
            aendret = True
    if aendret:
        skriv(sti, txt, bom)
        print('llms.txt: vidensleksikon opdateret')
    else:
        print('llms.txt: uaendret')
    return aendret

# ---------- 3. Kategori-index ----------
def kategoriindex(art):
    aendret = False
    for mappe, _, kort, _ in KATEGORIER:
        sti = os.path.join(VIDEN, mappe, 'index.html')
        if not os.path.exists(sti):
            continue
        txt, bom, nl = laes(sti)
        mangler = [a for a in art[mappe] if ('"./%s"' % a['slug']) not in txt]
        if not mangler:
            continue
        m = re.search(r'<a href="\./[^"]+" class="cat-index__item">', txt)
        if not m:
            print('%s: fandt ikke noget kort at saette ind ved, springer over' % sti); continue
        nye = ''.join(
            '<a href="./%s" class="cat-index__item"><span class="cat-index__cat">%s</span>'
            '<span class="cat-index__title">%s</span></a>' % (a['slug'], kort, a['titel'])
            for a in mangler)
        txt = txt[:m.start()] + nye + txt[m.start():]
        skriv(sti, txt, bom)
        aendret = True
        print('viden/%s/index.html: tilfoejet %d kort (%s)' % (
            mappe, len(mangler), ', '.join(a['slug'] for a in mangler)))
    if not aendret:
        print('kategori-index: ingen manglende kort')
    return aendret

# ---------- 4. sitemap.xml ----------
def sitemap(art):
    sti = os.path.join(ROD, 'sitemap.xml')
    if not os.path.exists(sti):
        print('sitemap.xml findes ikke, springer over'); return False
    txt, bom, nl = laes(sti)
    slut = txt.rfind('</urlset>')
    if slut < 0:
        print('sitemap.xml: fandt ikke </urlset>, springer over'); return False
    idag = __import__('datetime').date.today().isoformat()
    nye = []
    for mappe, _, _, _ in KATEGORIER:
        for a in art[mappe]:
            url = 'https://smartpack.dk/viden/%s/%s' % (mappe, a['slug'])
            if ('<loc>%s</loc>' % url) in txt:
                continue
            nye.append('  <url><loc>%s</loc><lastmod>%s</lastmod><priority>0.7</priority></url>'
                       % (url, idag))
    if not nye:
        print('sitemap.xml: ingen manglende URL er')
        return False
    txt = txt[:slut] + nl.join(nye) + nl + txt[slut:]
    skriv(sti, txt, bom)
    print('sitemap.xml: tilfoejet %d URL er' % len(nye))
    return True

if __name__ == '__main__':
    a = find_artikler()
    print('fundet %d artikler i %d kategorier' % (sum(len(v) for v in a.values()), len(a)))
    r = [nyeste(a), llms(a), kategoriindex(a), sitemap(a)]
    print('aendringer:', any(r))
