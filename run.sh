#!/bin/bash
docker build -t parcel -f Dockerfile-dev .
docker run --name game --rm \
        --entrypoint=npm \
        -v $(pwd):/app \
        -w /app \
        -u 1000:1000 \
        -p 8000:8000 \
        -p 1235:1235 \
        parcel \
        run start