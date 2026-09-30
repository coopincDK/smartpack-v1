#!/usr/bin/env bash
# Fase 1-leverance — IKKE afprøvet mod en rigtig server endnu (det sker i
# fase 2). Rsync'er spil-api/ til en SSH-host og genstarter docker-compose.
#
# Brug:
#   SPIL_API_DEPLOY_HOST=root@1.2.3.4 ./deploy.sh
# eller:
#   ./deploy.sh root@1.2.3.4

set -euo pipefail

HOST="${1:-${SPIL_API_DEPLOY_HOST:-}}"
REMOTE_PATH="${SPIL_API_DEPLOY_PATH:-/var/www/spil-api/}"

if [ -z "$HOST" ]; then
  echo "Fejl: angiv SSH-host som argument eller via SPIL_API_DEPLOY_HOST." >&2
  echo "Eksempel: SPIL_API_DEPLOY_HOST=root@1.2.3.4 ./deploy.sh" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Rsync'er $SCRIPT_DIR til $HOST:$REMOTE_PATH"
rsync -azv --delete \
  --exclude='.env' \
  --exclude='node_modules/' \
  --exclude='.git/' \
  "$SCRIPT_DIR"/ "$HOST:$REMOTE_PATH"

echo "==> Genstarter docker-compose på $HOST"
ssh "$HOST" "cd $REMOTE_PATH && docker compose up -d --build"

echo "==> Færdig."
