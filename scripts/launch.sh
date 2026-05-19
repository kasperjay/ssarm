#!/bin/bash

# Configuration
PORT=3000
DB_CONTAINER="spectral-postgres"

echo "ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ Starting Spectral Soundworks Launch Sequence..."

# 1. Detect Container Engine
ENGINE=$(bash scripts/check-engine.sh)

if [ "$ENGINE" == "none" ]; then
    echo "ÃƒÂ¢Ã‚ÂÃ…â€™ Error: No container engine (Docker or Podman) detected."
    echo "   Please start Docker Desktop or 'podman machine start'."
    exit 1
elif [ "$ENGINE" == "podman-stopped" ]; then
    echo "ÃƒÂ¢Ã‚ÂÃ…â€™ Error: Podman is installed but the machine is stopped."
    echo "   Run: podman machine start"
    exit 1
fi

echo "ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Using $ENGINE as container engine"

# 2. Start PostgreSQL via compose
echo "ÃƒÂ°Ã…Â¸Ã‚ÂÃ‹Å“ Starting database container..."
if [ "$ENGINE" == "podman" ]; then
    if command -v podman-compose > /dev/null 2>&1; then
        podman-compose up -d postgres
    else
        podman compose up -d postgres
    fi
else
    docker-compose up -d postgres
fi

# 3. Wait for database to be healthy
echo "ÃƒÂ¢Ã‚ÂÃ‚Â³ Waiting for database to be ready..."
RETRIES=10
while [ $RETRIES -gt 0 ]; do
    if $ENGINE inspect -f {{.State.Health.Status}} $DB_CONTAINER | grep -q "healthy"; then
        echo "ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Database is healthy!"
        break
    fi
    echo "   ...waiting ($RETRIES retries left)"
    sleep 2
    RETRIES=$((RETRIES-1))
done

if [ $RETRIES -eq 0 ]; then
    echo "ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â Warning: Database healthcheck timed out, but proceeding anyway..."
fi

# 4. Generate Prisma Client & Apply Migrations
echo "ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã…Â½ Syncing database schema..."
npx prisma generate

# Attempt automatic migration, but catch drift errors
if ! npx prisma migrate dev --name auto_migration_on_launch; then
    echo "ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â Prisma detect drift or schema conflict. A manual reset might be required."
    echo "   Run: npx prisma migrate reset"
    echo "   This will clear existing development data"
    # We don't exit here so the dev server can still try to start, 
    # but the logs will clearly show the failure.
fi

# 5. Start Next.js Development Server and Background Enrichment
echo "ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â Starting Next.js dev server on port $PORT..."
npm run dev &
DEV_SERVER_PID=$!

# Start the background enrichment runner
bash scripts/launch-enrichment.sh &

# Wait for the dev server to exit (e.g. when user hits Ctrl+C)
wait $DEV_SERVER_PID
