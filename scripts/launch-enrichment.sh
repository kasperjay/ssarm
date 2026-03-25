#!/bin/bash

# Configuration
PORT=3000
BASE_URL="http://localhost:$PORT"
BATCH_SIZE=10
BATCH_INTERVAL=120 # 2 minutes
MAX_BATCHES=3

echo "🔄 [Enrichment Runner] Waiting for dev server at $BASE_URL..."

# 1. Wait for server to be responsive
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    if curl -s $BASE_URL > /dev/null; then
        echo "✅ [Enrichment Runner] Dev server is UP. Starting enrichment batches."
        break
    fi
    sleep 5
    RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "❌ [Enrichment Runner] Dev server did not start in time. Aborting enrichment."
    exit 1
fi

# 2. Run batches
for (( i=1; i<=$MAX_BATCHES; i++ )); do
    echo "🚀 [Enrichment Runner] Processing batch $i/$MAX_BATCHES (limit: $BATCH_SIZE)..."
    
    # Run the enrichment script
    npm run enrich:stale -- --limit $BATCH_SIZE
    
    if [ $i -lt $MAX_BATCHES ]; then
        echo "⏳ [Enrichment Runner] Batch $i complete. Waiting ${BATCH_INTERVAL}s for next batch..."
        sleep $BATCH_INTERVAL
    else
        echo "✅ [Enrichment Runner] All enrichment batches complete!"
    fi
done
