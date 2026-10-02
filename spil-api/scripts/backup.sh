#!/usr/bin/env bash
# Natlig backup af spil-api's Postgres-database.
#
# Tager en KOMPRIMERET, PLAIN SQL-dump (pg_dump | gzip — simplest, og
# matcher den eksisterende manuelle backup-fils navngivning
# "spilapi-<tidsstempel>.sql.gz"). Kører via `docker compose exec db
# pg_dump` (dette script kører PÅ SERVEREN, hvor docker-CLI'en er
# tilgængelig) — IKKE samme mekanisme som POST /admin/nulstils
# in-process pg_dump (se src/backup.js, som kører inde FRA api-
# containeren, der ikke har docker-socketen).
#
# Output: /var/backups/spil-api/spilapi-<UTC-tidsstempel>.sql.gz, chmod 600
# (indeholder PII). Rotation: sletter egne filer (præfiks "spilapi-")
# ældre end 14 dage — rører ALDRIG "nulstil-*.sql" (src/backup.js's
# sikkerhedsnet ved POST /admin/nulstil), som bevidst har et andet
# præfiks for at undgå netop det.
#
# Fejlhåndtering: set -euo pipefail, så enhver fejl (pg_dump fejler,
# disk fuld, tom dump, osv.) giver ikke-nul exit-kode. Scriptet logger
# selv en tydelig OK/FEJL-linje med tidsstempel til stdout/stderr (IKKE
# direkte til loggen — det overlader vi til crontab-linjen, der
# omdirigerer begge til /var/log/spil-backup.log, for at undgå
# dobbelt-logning. Se README.md, "Drift: natlig backup".

set -euo pipefail

BACKUP_DIR="${SPIL_API_BACKUP_DIR:-/var/backups/spil-api}"
RETENTION_DAYS=14
# Mappen der indeholder docker-compose.yml — dette scripts egen
# forælder-mappe (scripts/ ligger lige under spil-api/, samme som
# deploy.sh forventer at blive kørt fra).
COMPOSE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  echo "[backup] $(date -u +%Y-%m-%dT%H:%M:%SZ) $*"
}

on_exit() {
  local status=$?
  if [ "$status" -eq 0 ]; then
    log "OK — backup gennemført."
  else
    log "FEJL — backup fejlede (exit $status)." >&2
  fi
  exit "$status"
}
trap on_exit EXIT

timestamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
outfile="$BACKUP_DIR/spilapi-${timestamp}.sql.gz"
tmpfile="${outfile}.tmp"

mkdir -p "$BACKUP_DIR"

log "Starter pg_dump -> $outfile"
cd "$COMPOSE_DIR"

# POSTGRES_USER/POSTGRES_DB kommer fra db-containerens eget miljø
# (env_file: .env, samme som docker-compose.yml allerede bruger) — vi
# parser derfor ALDRIG .env selv her, og scriptet har ingen hardkodede
# credentials.
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$tmpfile"

if [ ! -s "$tmpfile" ]; then
  rm -f "$tmpfile"
  echo "pg_dump gav en tom fil." >&2
  exit 1
fi

# S4 (merge-review): en fejlet/afbrudt pg_dump kan stadig producere en lille,
# GYLDIG gzip-fil (fx en tom stream komprimeret til ~20 byte) — den består
# [ -s ... ]-tjekket ovenfor uden at indeholde en brugbar dump. En succesfuld
# pg_dump afslutter ALTID med en fast standardlinje,
# "-- PostgreSQL database dump complete", som sidste linje i output — vi
# tjekker derfor EKSPLICIT at den linje rent faktisk er til stede, og
# fejler (samme måde som enhver anden fejl her: ikke-nul exit, tydelig
# FEJL-logget af on_exit-trappen) hvis den ikke er.
if ! zcat "$tmpfile" | tail -1 | grep -q "PostgreSQL database dump complete"; then
  rm -f "$tmpfile"
  echo "Dumpen er ufuldstændig/korrupt (mangler 'PostgreSQL database dump complete')." >&2
  exit 1
fi

mv "$tmpfile" "$outfile"
chmod 600 "$outfile"
log "Dump gemt: $outfile ($(stat -c%s "$outfile") bytes)"

log "Rydder op i filer aeldre end $RETENTION_DAYS dage i $BACKUP_DIR"
find "$BACKUP_DIR" -maxdepth 1 -name 'spilapi-*.sql.gz' -mtime "+$RETENTION_DAYS" -print -delete |
  while IFS= read -r f; do
    log "Slettet (rotation): $f"
  done
