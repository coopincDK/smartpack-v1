#!/usr/bin/env bash
# Deployer spil-api/ til en SSH-host og genstarter docker-compose.
#
# Brug:
#   SPIL_API_DEPLOY_HOST=root@1.2.3.4 ./deploy.sh
# eller:
#   ./deploy.sh root@1.2.3.4
#
# To overførselsmetoder, valgt automatisk ud fra om `rsync` findes LOKALT:
#
#   1) Lokal `rsync` findes (Linux/macOS/WSL): rsync'er direkte til
#      $REMOTE_PATH med --delete, som hidtil.
#   2) Lokal `rsync` MANGLER (almindeligt på almindelig Windows/Git Bash,
#      uden WSL) — se README.md, "Udrulning fra Windows". Vi pakker
#      repoet i én tar.gz, scp'er DEN (kræver kun scp/ssh, ikke rsync,
#      lokalt), og lader SERVEREN selv køre rsync (som findes der) fra en
#      midlertidig staging-mappe ind i $REMOTE_PATH.
#
# VIGTIGT om --delete (se README.md/API.md, "Tredje opfølgende
# ændringsrunde" — en tidligere udrulning slettede docker-compose.override.yml
# ved et uheld, fordi den dengang KUN lå utracket direkte på serveren):
# --delete køres her KUN mellem selve repo-indholdet (lokalt, eller den
# midlertidige staging-mappe på serveren — begge er 1:1 det samme som denne
# git-arbejdstræ) og $REMOTE_PATH, ALDRIG mod hele $REMOTE_PATH ubetinget.
# Enhver fil der skal overleve en udrulning UDEN at være en del af dette
# repo (i praksis kun `.env` i dag) SKAL stå i EXCLUDES herunder — ellers
# forsvinder den ved næste `--delete`. Tilføjer du en ny server-lokal fil af
# den slags, commit den i stedet (som docker-compose.override.yml nu er)
# frem for at regne med at den overlever i evighed uden for git.

set -euo pipefail

HOST="${1:-${SPIL_API_DEPLOY_HOST:-}}"
REMOTE_PATH="${SPIL_API_DEPLOY_PATH:-/var/www/spil-api/}"
# Relative til $SCRIPT_DIR (selve spil-api/) — se advarslen ovenfor.
EXCLUDES=(--exclude='.env' --exclude='node_modules/' --exclude='.git/')

if [ -z "$HOST" ]; then
  echo "Fejl: angiv SSH-host som argument eller via SPIL_API_DEPLOY_HOST." >&2
  echo "Eksempel: SPIL_API_DEPLOY_HOST=root@1.2.3.4 ./deploy.sh" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v rsync >/dev/null 2>&1; then
  echo "==> Lokal rsync fundet — rsync'er $SCRIPT_DIR direkte til $HOST:$REMOTE_PATH"
  rsync -azv --delete "${EXCLUDES[@]}" "$SCRIPT_DIR"/ "$HOST:$REMOTE_PATH"
else
  echo "==> Ingen lokal rsync (typisk almindelig Windows uden WSL) — bruger tar+scp+server-side-rsync i stedet."
  TMP_TAR="$(mktemp -t spil-api-deploy-XXXXXX.tar.gz 2>/dev/null || echo "/tmp/spil-api-deploy-$$.tar.gz")"
  trap 'rm -f "$TMP_TAR"' EXIT

  echo "==> Pakker $SCRIPT_DIR (uden .git/node_modules/.env) til $TMP_TAR"
  tar -czf "$TMP_TAR" \
    --exclude='.git' --exclude='node_modules' --exclude='.env' \
    -C "$SCRIPT_DIR" .

  REMOTE_STAGING="/tmp/spil-api-deploy-staging-$$"
  echo "==> Overfører tarball til $HOST og udpakker i midlertidig staging-mappe ($REMOTE_STAGING)"
  scp "$TMP_TAR" "$HOST:/tmp/$(basename "$TMP_TAR")"
  ssh "$HOST" "
    set -euo pipefail
    mkdir -p '$REMOTE_STAGING'
    tar -xzf '/tmp/$(basename "$TMP_TAR")' -C '$REMOTE_STAGING'
    rm -f '/tmp/$(basename "$TMP_TAR")'
    mkdir -p '$REMOTE_PATH'
    rsync -a --delete --exclude='.env' '$REMOTE_STAGING'/ '$REMOTE_PATH'
    rm -rf '$REMOTE_STAGING'
  "
fi

echo "==> Genstarter docker-compose på $HOST"
ssh "$HOST" "cd $REMOTE_PATH && docker compose up -d --build"

echo "==> Færdig."
