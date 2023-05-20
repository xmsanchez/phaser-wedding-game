#!/bin/bash
docker build -t phaser3-vite-game -f Dockerfile-dev .
docker run --name phaser3-vite-game --rm \
        -v $(pwd):/app \
        -w /app \
        -u 1000:1000 \
        -p 8000:8000 \
        -p 3000:3000 \
        phaser3-vite-game