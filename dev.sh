#!/bin/bash
docker build -t parcel -f Dockerfile-dev .
docker run --name game- --rm -v $(pwd):/app -ti \
        --entrypoint=/bin/bash \
        -w /app \
        -u 1000:1000 \
        parcel