#!/usr/bin/env bash
# Runs the Vite dev server in a container with the source mounted: http://localhost:8000
set -euo pipefail

docker build -t phaser3-vite-game -f Dockerfile-dev .
docker run --name phaser3-vite-game --rm \
    -v "$(pwd)":/app \
    -u "$(id -u):$(id -g)" \
    -p 8000:8000 \
    -e VITE_MAPS_API_KEY="${VITE_MAPS_API_KEY:-${MAPS_API_KEY:-}}" \
    phaser3-vite-game
