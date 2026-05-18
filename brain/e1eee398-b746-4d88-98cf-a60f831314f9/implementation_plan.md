# Troubleshooting Database and Actor Issues

The user is unable to load data from the database and the lead discovery actors are non-functional. Research indicates that the Next.js server may be stuck or failed with permissions errors (`EPERM`), likely due to locked files in `node_modules` from multiple hanging Node.js processes.

## User Review Required

> [!IMPORTANT]
> I will need to terminate all running Node.js processes on your machine to release file locks. This will stop the currently running `npm run launch` and any other Node scripts you might have running in this project.

## Proposed Changes

### Environment Cleanup
- Terminate all hanging `node` processes using PowerShell.
- Ensure Docker container `spectral-postgres` is fresh and healthy.

### Database & Client Verification
- Regenerate the Prisma client to ensure it matches the environment.
- Run a verified database connection script that follows the application's pattern (using the adapter if necessary).

### Application Restart
- Restart the Next.js development server.
- Monitor logs for any recurring `EPERM` or connection errors.

## Implementation Steps

### 1. Cleanup
- `Stop-Process -Name node -Force` (PowerShell)
- `docker-compose restart postgres`

### 2. Synchronization
- `npx prisma generate`
- Run a custom test script to verify `PrismaClient` can query the database.

### 3. Launch
- `npm run dev` (in background)
- Verify server is listening on port 3000.

### 4. Verification
- Open `http://localhost:3000/leads` and check for artist records.
- Open `http://localhost:3000/leads/discover` and run a sample search.
