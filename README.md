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
 gcloud builds submit --tag gcr.io/xavi-332016/game-new .
gcloud run deploy game-new --image gcr.io/xavi-332016/game-new --region europe-west1 --platform managed --allow-unauthenticated --quiet
```

**Troubleshoot deployment**

```
Deployment failed                                                                                                                          
ERROR: (gcloud.run.deploy) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable. Logs for this revision might contain more information.
```

Set the port on the UI.
