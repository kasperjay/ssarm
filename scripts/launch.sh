#!/bin/bash

# Configuration
PORT=3000
DB_CONTAINER="spectral-postgres"

echo "🚀 Starting Spectral Soundworks Launch Sequence..."

# 1. Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# 2. Start PostgreSQL via docker-compose
echo "🐘 Starting database container..."
docker-compose up -d postgres

# 3. Wait for database to be healthy
echo "⏳ Waiting for database to be ready..."
RETRIES=10
while [ $RETRIES -gt 0 ]; do
    if docker inspect -f {{.State.Health.Status}} $DB_CONTAINER | grep -q "healthy"; then
        echo "✅ Database is healthy!"
        break
    fi
    echo "   ...waiting ($RETRIES retries left)"
    sleep 2
    RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "⚠️ Warning: Database healthcheck timed out, but proceeding anyway..."
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

# 5. Start Next.js Development Server
echo "🌐 Starting Next.js dev server on port $PORT..."
npm run dev
