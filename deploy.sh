#!/bin/bash
gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/game-new . && \
gcloud run deploy game-new --image gcr.io/$GCLOUD_PROJECT/game-new --port 8000 --region europe-west1 --platform managed --allow-unauthenticated --quiet
