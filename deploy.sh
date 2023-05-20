#!/bin/bash
gcloud builds submit --tag gcr.io/xavi-332016/game-new . && \
gcloud run deploy game-new --image gcr.io/xavi-332016/game-new --port 5173 --region europe-west1 --platform managed --allow-unauthenticated --quiet
