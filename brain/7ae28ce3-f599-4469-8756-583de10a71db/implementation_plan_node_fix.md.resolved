# Restore Broken Node.js Environment

The user is encountering `npm : The term 'npm' is not recognized` errors. Investigation shows that the portable Node.js directory (`.node/`) is missing the `npm` binary and other essential files, leaving only `node.exe`.

The goal is to restore a fully functional Node.js environment so the user can run `npm run launch`.

## User Review Required

> [!CAUTION]
> I will be downloading and re-extracting the portable Node.js v22.14.0 binaries into the `.node/` directory. This will overwrite any existing files in that folder.

## Proposed Changes

### [Component] Node.js Runtime

#### [MODIFY] [.node](file:///c:/Users/kp/Documents/spectral-soundworks-app/.node)
- Re-install/Extract Node.js v22.14.0-win-x64.
- I will attempt to download the official zip from nodejs.org using `Invoke-WebRequest` if no local backup is found.

## Verification Plan

### Automated Tests
- Run `. .\activate-node.ps1` followed by `node -v` and `npm -v`.
- Verify `npm run launch` can at least start the command sequence.

### Manual Verification
- User to try running `npm run launch` in their terminal.
