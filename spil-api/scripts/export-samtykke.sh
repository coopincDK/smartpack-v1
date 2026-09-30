#!/usr/bin/env bash
# CLI til brug over SSH på produktionsserveren (fase 2) — eksporterer
# samtykke-CSV for en given liste direkte fra databasen, via
# `docker compose exec db psql \copy`. Kører IKKE mod API'et.
#
# Brug (på serveren, i /var/www/spil-api/):
#   ./scripts/export-samtykke.sh smartpack > smartpack.csv
#   ./scripts/export-samtykke.sh partner:Herodesk > herodesk.csv
#
# Bemærk: dette er en supplerende genvej til admin-panelets
# GET /admin/eksport/samtykke/:liste.csv — brug den, hvis adminpanelet af en
# eller anden grund ikke er tilgængeligt.

set -euo pipefail

LISTE="${1:-}"

if [ -z "$LISTE" ]; then
  echo "Brug: $0 <liste>" >&2
  echo "Eksempel: $0 smartpack" >&2
  exit 1
fi

if ! [[ "$LISTE" =~ ^[a-z0-9:_.-]+$ ]]; then
  echo "Fejl: ugyldigt listenavn '$LISTE' (skal matche ^[a-z0-9:_.-]+\$)." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$COMPOSE_DIR"

# Packrush: samtykke er nu en hændelseslog (spiller_id, liste, tidspunkt,
# type — se migrations/003_packrush.sql). Denne genvej eksporterer derfor
# den RÅ hændelseslog (én linje pr. bekræftelse/tilbagetrækning), i modsætning
# til adminpanelets CSV (GET /admin/eksport/samtykke/:liste.csv), som
# opsummerer til første/seneste bekræftelse + aktiv-status pr. spiller.
docker compose exec -T db psql -U spil -d spil -v liste="'$LISTE'" <<'SQL'
\copy (
  SELECT s.navn, s.email, s.telefon, s.firma, k.liste, k.type, k.tidspunkt, k.tekst_version
  FROM samtykke k
  JOIN spiller s ON s.id = k.spiller_id
  WHERE k.liste = :liste
  ORDER BY k.tidspunkt ASC
) TO STDOUT WITH CSV HEADER
SQL
