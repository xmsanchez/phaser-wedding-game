# phaser-wedding-game

## Description

This game is created to be used as a wedding invitation :-)

## Development

Build and spin up a docker container:

```bash
./run.sh
```

Access the UI: http://localhost:8000

## Deploy on Cloud Run

```bash
gcloud builds submit --tag gcr.io/xavi-332016/game-new . && \
gcloud run deploy game-new \
    --image gcr.io/xavi-332016/game-new \
    --port 8000 \
    --region europe-west1 \
    --platform managed \
    --allow-unauthenticated \
    --set-secrets VITE_MAPS_API_KEY=VITE_MAPS_API_KEY:1 \
    --quiet
```

## Architecture

Everything is deployed to Google Cloud using a serverless architecture.

The total cost as of today is around $1 at month. I expect this to grow a little bit bigger when the invitees start using it, but I do not expect it to even reach $10.

### Cloud Run

This React app (both the game and the landing) is running in a container deployed to Cloud Run.

Domain Mapping is used for the custom domain which automatically fetches and enforces an HTTPS letsencrypt certificate.

### Cloud Functions

The OpenAI chatbox API scripts (written in python) is running as a cloud function.

I have it stored into a separate repository (not public).

CORS policy is enforced for security, also a JWT token is used for authentication.

### Google Secrets Manager

The Secrets Manager service is used to store both the Google Maps API KEY used in the landing and the OpenAI API KEY used in the python chatbox.

**Troubleshoot deployment**

```
ERROR: (gcloud.run.deploy) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable. Logs for this revision might contain more information.
```

Set the port on the UI or specify it when running `gcloud run deploy` using the flag `--port`.