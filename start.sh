#!/bin/bash
set -e

APP_DIR="/home/workspace/ss-app"
MAX_RETRIES=3
RETRY_COUNT=0

start_server() {
    cd "$APP_DIR"
    exec npm start
}

check_build() {
    if [ ! -f "$APP_DIR/.next/prerender-manifest.json" ]; then
        return 1
    fi
    return 0
}

rebuild() {
    echo "[startup] Build missing or corrupted, rebuilding..."
    cd "$APP_DIR"
    npm run build
}

retry_start() {
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        echo "[startup] Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES"
        if start_server; then
            exit 0
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "[startup] Server failed, rebuilding and retrying..."
            rebuild || true
        fi
    done
    echo "[startup] All retries exhausted, exiting."
    exit 1
}

if check_build; then
    start_server
else
    rebuild
    retry_start
fi