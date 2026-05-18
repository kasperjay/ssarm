# Restore Robust Container Engine Detection

The current `launch.sh` script is failing because it only checks for the `docker` command, while the user's environment uses `podman`. I previously saw a more robust version of this script in the codebase that handled both, but it was likely overwritten during a `git restore` operation.

## User Review Required

> [!NOTE]
> I will be updating `scripts/launch.sh` to include logic that automatically detects if `docker` or `podman` is available. This ensures the application can launch regardless of which container engine is installed.

## Proposed Changes

### [Component] Launch Infrastructure

#### [MODIFY] [launch.sh](file:///c:/Users/kp/Documents/spectral-soundworks-app/scripts/launch.sh)
- Re-introduce the multi-engine detection logic.
- Update `CMD` and `COMP` variables based on detection.
- Ensure all container commands (inspect, up, run) use the detected engine.

## Verification Plan

### Automated Tests
- Run `bash scripts/launch.sh` and verify it passes the engine detection phase.
- Verify `npx prisma generate` runs successfully.

### Manual Verification
- User to run `npm run launch` and verify the output shows "🐘 Starting database container..." and then proceeds to start the dev server.
