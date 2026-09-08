#!/bin/sh
set -eu

URL="${SCAN_REPLIES_URL:?SCAN_REPLIES_URL est requis}"
INTERVAL="${SCAN_REPLIES_INTERVAL_SECONDS:-900}"

while true; do
    echo "$(date) POST $URL"
    if ! curl -sf -X POST "$URL" -o /dev/null; then
        echo "$(date) echec de l'appel scan-replies"
    fi
    sleep "$INTERVAL"
done
