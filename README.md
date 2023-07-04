# phaser-wedding-game

## Description

This game is created to be used as a wedding invitation 😊

## Development

Build and spin up a docker container:

```bash
./run.sh
```

Access the UI: http://localhost:8000

## Deploy on Cloud Run

> Remember to export GCLOUD_PROJECT with your own project value

```bash
gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/game-new . && \
gcloud run deploy game-new \
    --image gcr.io/$GCLOUD_PROJECT/game-new \
    --port 8000 \
    --region europe-west1 \
    --platform managed \
    --allow-unauthenticated \
    --set-secrets VITE_MAPS_API_KEY=VITE_MAPS_API_KEY:1 \
    --quiet
```

## Architecture

Everything is deployed to **Google Cloud** using a **serverless architecture**.

The total cost as of today is around $1 at month. I expect this to grow a little bit bigger when the invitees start using it, but I do not expect it to even reach $10 (and most probably half of it).

### Cloud Run

This **React app** (both the **game** and the **landing**) is running in a container deployed to **Cloud Run**.

**Domain Mapping** is used for the custom domain which automatically fetches and enforces an HTTPS letsencrypt certificate.

### Cloud Functions

The **OpenAI chatbox API** scripts (written in python) are running as a **Cloud Function** which is spinned up on-demmand. It is stored into a separate repository, not public (yet).

**CORS policy** is enforced for security in the backend API, also a JWT token is used for authentication.

### Google Secrets Manager

The **Secrets Manager** service is used to store both the **Google Maps API KEY** used in the landing and the **OpenAI API KEY** used in the python chatbox.

### Google Maps

Implemented with a javascript library and slightly customized to be used as reference for the wedding location as well as the parking options.

Although this is fully implemented, the Google Maps API KEY is not getting loaded properly through Secrets Manager. Still haven't figured it out.

### Google Forms

This service used to get invitees confirmation was embedded in the Landing using a simple iframe. Not top-notch technology :-P

**Troubleshoot deployment**

```
ERROR: (gcloud.run.deploy) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable. Logs for this revision might contain more information.
```

Set the port on the UI or specify it when running `gcloud run deploy` using the flag `--port`.

## Caveats

### Chatbot API

At least at the moment, the chatbot api written in python IS NOT made public. If you want to use the chatbot you'll need to implement your own API.

The current implementation is not the more secure (embedded flask development server is used u_u) and I might need to obfuscate few things before making it public.

Time is limited.

### Chatbot Streaming Messages

Although streaming is implemented, it is not used in the final release. There were issues managing the conversation history context and once again, time is limited. But you can still use the code for reference.