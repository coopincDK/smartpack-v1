#!/usr/bin/env python3
"""Find dropped ae/oe/aa (ASCII stand-ins for ae/oe/aa) in visible page text.

Self-referential heuristic, no external dictionary needed:
  1. Collect every word used anywhere on the site that already contains
     ae/oe/aa correctly -- that's the site's own vocabulary.
  2. For each such word, compute its ASCII-flattened form (ae->ae, oe->oe,
     aa->aa).
  3. Anywhere that flattened form shows up as its own word is a candidate:
     someone likely dropped the real letter there.

Usage:
    python3 .github/scripts/scan-missing-danish-letters.py [path-prefix ...]

With no arguments, scans every tracked *.html file. Pass one or more path
prefixes (e.g. "viden/" "integrationer/") to scope the scan. This is a
report-only tool -- it does not modify any files. Review each hit before
fixing: real place names (e.g. "Grenaa") and some brand names are
legitimately spelled with plain ASCII letters and are not bugs.
"""
import html
import re
import subprocess
import sys

TAG_RE = re.compile(r"<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>", re.S | re.I)
ANYTAG_RE = re.compile(r"<[^>]+>")
WORD_RE = re.compile(r"[a-zA-ZæøåÆØÅ]+")
MAP = {"æ": "ae", "ø": "oe", "å": "aa", "Æ": "Ae", "Ø": "Oe", "Å": "Aa"}
MIN_LEN = 5


def flatten(word: str) -> str:
    return "".join(MAP.get(c, c) for c in word)


def visible_words(path: str):
    with open(path, encoding="utf-8", errors="replace") as fh:
        raw = fh.read()
    text = html.unescape(ANYTAG_RE.sub(" ", TAG_RE.sub(" ", raw)))
    for m in WORD_RE.finditer(text):
        yield m.group(0)


def line_context(path: str, word: str):
    pat = re.compile(r"(?<![a-zA-ZæøåÆØÅ])" + re.escape(word) + r"(?![a-zA-ZæøåÆØÅ])")
    with open(path, encoding="utf-8", errors="replace") as fh:
        for i, line in enumerate(fh, 1):
            unescaped = html.unescape(line)
            if pat.search(unescaped):
                snippet = unescaped.strip()
                idx = snippet.lower().find(word.lower())
                start, end = max(0, idx - 35), idx + len(word) + 35
                return i, snippet[start:end].strip()
    return None, ""


def main() -> int:
    prefixes = tuple(sys.argv[1:])
    files = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.splitlines()
    targets = [f for f in files if f.endswith(".html") and not f.startswith("pagefind/")]
    if prefixes:
        targets = [f for f in targets if f.startswith(prefixes)]

    all_files = [f for f in files if f.endswith(".html") and not f.startswith("pagefind/")]
    canonical = set()
    for f in all_files:
        for w in visible_words(f):
            lw = w.lower()
            if any(c in lw for c in "æøå"):
                canonical.add(lw)

    variant_map = {}
    for w in canonical:
        variant_map.setdefault(flatten(w), set()).add(w)

    hits = []
    for f in targets:
        seen = set()
        for w in visible_words(f):
            lw = w.lower()
            if len(lw) < MIN_LEN or any(c in lw for c in "æøå"):
                continue
            if lw in variant_map and (f, lw) not in seen:
                seen.add((f, lw))
                lineno, ctx = line_context(f, w)
                hits.append((f, w, sorted(variant_map[lw]), lineno, ctx))

    hits.sort(key=lambda h: (h[0], h[1]))
    print(f"Canonical vocabulary: {len(canonical)} words, {len(variant_map)} flattened forms")
    print(f"Hits: {len(hits)} across {len(set(h[0] for h in hits))} files\n")
    for f, w, sug, ln, ctx in hits:
        print(f"{f}:{ln}  '{w}' -> {'/'.join(sug)}  |  ...{ctx}...")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
