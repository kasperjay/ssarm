#!/bin/bash

# check-engine.sh - Detects and validates the container engine (Docker or Podman)

if command -v docker > /dev/null 2>&1 && docker info > /dev/null 2>&1; then
    echo "docker"
    exit 0
fi

if command -v podman > /dev/null 2>&1; then
    # If podman info works, the engine is ready (common on Linux/WSL)
    if podman info > /dev/null 2>&1; then
        echo "podman"
        exit 0
    fi

    # Only if info fails, check for podman machine (Windows/macOS)
    if command -v podman > /dev/null 2>&1 && podman machine --help > /dev/null 2>&1; then
        # Check if any machine is running
        if podman machine list --format "{{.LastUp}}" | grep -q "[0-9]"; then
             echo "podman"
             exit 0
        else
            echo "podman-stopped"
            exit 1
        fi
    fi
fi

echo "none"
exit 1
