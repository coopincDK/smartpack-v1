#!/usr/bin/env python3
"""Sync sitemap.xml <lastmod> values to each page's real last-commit date.

For every <url><loc>...</loc><lastmod>...</lastmod></url> entry, resolves the
loc's URL path to a local file (path.html, path/index.html, or path itself),
looks up that file's most recent git commit date, and rewrites lastmod to
match. Uses --date=short-local so a commit made just after midnight in a
+02:00 (or any non-UTC) timezone doesn't get misdated to the next day.

Run from the repo root. Exits non-zero (without writing) if any URL can't be
resolved to a file or has no git history, so a CI run fails loudly instead of
silently leaving a stale sitemap.
"""
import os
import re
import subprocess
import sys

SITEMAP = "sitemap.xml"


def resolve_path(url_path: str) -> str | None:
    p = url_path.strip("/")
    if p == "":
        return "index.html"
    for candidate in (p + ".html", p + "/index.html", p):
        if os.path.isfile(candidate):
            return candidate
    return None


def last_commit_date(fpath: str) -> str:
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cd", "--date=short-local", "--", fpath],
        capture_output=True,
        text=True,
        timeout=10,
        env={**os.environ, "TZ": "UTC"},
    )
    return out.stdout.strip()


def main() -> int:
    with open(SITEMAP, "rb") as f:
        raw = f.read()
    had_bom = raw.startswith(b"\xef\xbb\xbf")
    content = raw.decode("utf-8-sig")

    pattern = re.compile(
        r'(<url><loc>https://smartpack\.dk(/[^<]*)</loc><lastmod>)([^<]*)(</lastmod>)'
    )

    changed = 0
    failures: list[str] = []

    def repl(m: re.Match) -> str:
        nonlocal changed
        prefix, url_path, old_date, suffix = m.groups()
        fpath = resolve_path(url_path)
        if fpath is None:
            failures.append(f"{url_path} -> no matching file")
            return m.group(0)
        new_date = last_commit_date(fpath)
        if not new_date:
            failures.append(f"{url_path} -> ({fpath}) no git history")
            return m.group(0)
        if new_date != old_date:
            changed += 1
        return prefix + new_date + suffix

    new_content = pattern.sub(repl, content)

    if failures:
        print("Refusing to write sitemap.xml — could not resolve:", file=sys.stderr)
        for f in failures:
            print(f"  {f}", file=sys.stderr)
        return 1

    if changed:
        out_bytes = (b"\xef\xbb\xbf" if had_bom else b"") + new_content.encode("utf-8")
        with open(SITEMAP, "wb") as f:
            f.write(out_bytes)
        print(f"Updated {changed} lastmod date(s) in {SITEMAP}")
    else:
        print("sitemap.xml lastmod dates already up to date")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
