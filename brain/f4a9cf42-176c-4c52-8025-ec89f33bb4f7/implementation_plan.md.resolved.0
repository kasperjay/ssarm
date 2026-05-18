# Implementation Plan - Podman Support

The goal is to update the Spectral Soundworks launch scripts to be container-engine agnostic, allowing the app to run using either Docker or Podman.

## User Review Required

> [!IMPORTANT]
> Since Podman on Windows typically requires a virtual machine (via WSL), we need to ensure the `podman machine` is started before running any containers.

## Proposed Changes

### 1. Launch Script Update

#### [MODIFY] [scripts/launch.sh](file:///c:/Users/kp/Documents/spectral-soundworks-app/scripts/launch.sh)
Update the script to detect the available container engine (`docker` or `podman`) and handle engine-specific initialization.

- Replace the hardcoded `docker` checks with an `ENGINE` variable detection.
- Add a check for `podman machine status` if Podman is used.
- Use `$ENGINE-compose` or `$ENGINE compose` for database startup.

### 2. Environment Validation

#### [NEW] [scripts/check-engine.sh](file:///c:/Users/kp/Documents/spectral-soundworks-app/scripts/check-engine.sh)
Create a helper script that can be used by both `launch.sh` and other scripts to reliably find and validate the container environment.

### 3. Documentation

#### [MODIFY] [README.md](file:///c:/Users/kp/Documents/spectral-soundworks-app/README.md)
Add a section on using Podman, including how to enable Docker compatibility mode if the user prefers the standard `docker` commands.

## Verification Plan

### Automated Tests
- Run `bash scripts/launch.sh` in an environment where only Podman is available.
- Verify that the database container starts and becomes healthy.

### Manual Verification
- Ask the user to run `npm run launch` and confirm the "🚀 Starting Spectral Soundworks..." sequence completes successfully using their Podman setup.
