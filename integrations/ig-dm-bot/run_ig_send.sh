#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/webhook-$(date +%Y%m%d-%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== run_ig_send.sh starting ==="
echo "PWD: $(pwd)"
echo "HOOK_ env: ${HOOK_:-<empty>}"

BODY_FILE="${HOOK_:-}"
if [[ -z "$BODY_FILE" || ! -f "$BODY_FILE" ]]; then
  echo "ERROR: Missing payload file (env HOOK_). Got HOOK_='$BODY_FILE'"
  exit 2
fi

BODY="$(cat "$BODY_FILE")"
echo "Payload bytes: ${#BODY}"

IG_USERNAME="$(node -e 'let d={}; try{d=JSON.parse(process.argv[1])}catch(e){process.stderr.write("JSON parse failed\\n")} const h=d?.artist?.instagramHandle||""; const u=d?.artist?.instagramProfileUrl||""; const last=u.split("/").filter(Boolean).pop()||""; process.stdout.write(String(h||last||d?.igUsername||"").trim());' "$BODY")"
IG_MESSAGE="$(node -e 'let d={}; try{d=JSON.parse(process.argv[1])}catch(e){process.stderr.write("JSON parse failed\\n")} const m=d?.message?.body??d?.message??""; process.stdout.write(String(m||"").trim());' "$BODY")"

echo "Parsed IG username: '$IG_USERNAME'"
echo "Message length: ${#IG_MESSAGE}"

if [[ -z "$IG_USERNAME" || -z "$IG_MESSAGE" ]]; then
  echo "ERROR: Missing IG payload (instagramHandle + message.body)"
  exit 2
fi

cd "$SCRIPT_DIR"
echo "CWD switched to: $(pwd)"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  echo "Loading .env..."
  set -a
  source "$SCRIPT_DIR/.env"
  set +a
else
  echo "WARNING: .env not found"
fi

echo "Running node src/main.js..."
RETRY_ATTEMPTS=${RETRY_ATTEMPTS:-3}
RETRY_BASE_SECONDS=${RETRY_BASE_SECONDS:-5}

attempt=1
while [[ $attempt -le $RETRY_ATTEMPTS ]]; do
  echo "Attempt $attempt/$RETRY_ATTEMPTS"
  if IG_USERNAME="$IG_USERNAME" IG_MESSAGE="$IG_MESSAGE" LOGIN_MODE=false HEADLESS=true node src/main.js; then
    echo "Send succeeded"
    break
  fi

  if [[ $attempt -ge $RETRY_ATTEMPTS ]]; then
    echo "Send failed after $RETRY_ATTEMPTS attempts"
    exit 1
  fi

  sleep_seconds=$((RETRY_BASE_SECONDS * attempt))
  echo "Retrying in ${sleep_seconds}s..."
  sleep "$sleep_seconds"
  attempt=$((attempt + 1))
done

echo "=== run_ig_send.sh finished ==="
