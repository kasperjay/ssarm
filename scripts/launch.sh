#!/bin/bash

# Configuration
PORT=3000
DB_CONTAINER="spectral-postgres"

echo "🚀 Starting Spectral Soundworks Launch Sequence..."

# 1. Detect container engine
if command -v docker > /dev/null 2>&1 && docker info > /dev/null 2>&1; then
    CMD="docker"
    COMP="docker-compose"
elif command -v podman > /dev/null 2>&1 && podman info > /dev/null 2>&1; then
    CMD="podman"
    COMP="podman-compose"
else
    echo "❌ Error: Neither Docker nor Podman is running or installed. Please start your container engine."
    exit 1
fi

echo "✅ Using $CMD with $COMP"

# 2. Start PostgreSQL
echo "🐘 Starting database container..."
if ! command -v $COMP > /dev/null 2>&1; then
    echo "⚠️ $COMP not found, running database directly via $CMD..."
    $CMD volume create postgres_data || true
    $CMD run -d --name $DB_CONTAINER \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=spectral \
      -p 5432:5432 \
      -v postgres_data:/var/lib/postgresql/data \
      postgres:16-alpine || true
else
    $COMP up -d postgres
fi

# 3. Wait for database to be actually responding
echo "⏳ Waiting for database to be ready..."
RETRIES=10
while [ $RETRIES -gt 0 ]; do
    if $CMD exec $DB_CONTAINER pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "   ...waiting ($RETRIES retries left)"
    sleep 2
    RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "⚠️ Warning: Database check timed out, but proceeding anyway..."
fi

# 4. Generate Prisma Client & Apply Migrations
echo "💎 Syncing database schema..."
npx prisma generate

# Attempt automatic migration, but catch drift errors
if ! npx prisma migrate dev --name auto_migration_on_launch; then
    echo "⚠️ Prisma detect drift or schema conflict. A manual reset might be required."
    echo "   Run: npx prisma migrate reset"
    echo "   This will clear existing development data"
    # We don't exit here so the dev server can still try to start, 
    # but the logs will clearly show the failure.
fi

# 5. Start Next.js Development Server and Background Enrichment
echo "🌐 Starting Next.js dev server on port $PORT..."
npm run dev &
DEV_SERVER_PID=$!

# Start the background enrichment runner
bash scripts/launch-enrichment.sh &

# Wait for the dev server to exit (e.g. when user hits Ctrl+C)
wait $DEV_SERVER_PID
