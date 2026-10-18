# phaser-wedding-game

An interactive wedding invitation 😊 Guests received a personal link, played a short pixel-art
adventure to recover "the lost wedding information" and ended up on a landing page with all the details.

The wedding took place on 30/09/2023. The project is kept as a memento: the game is fully playable
and the landing page remains as a keepsake.

- Game: **Phaser 3**
- App shell and landing pages: **React** + **Vite**

## UPDATE - 2026-10-18

It's been a while (three years!!) since I issued the very commit in the very same day of the wedding. A lot has happened since.

Even though I'm **really happy** with what I achieved three years ago with no prior game development experience nor knowledge, this new update **brings the capabilities of Opus 5.5** to do a refactor and extensive bug-fixing.

I made Opus 5.5 analyze the original project and offer feedback and in fact it has been surprisingly good. It looks like I followed lots of good practices and a well design architecture despite the time constraints. 

Anyway, there were a few things which were somehow working with workarounds as well as some class designing issues that Opus 5.5 fixed easily.

I have a private copy of this repo to keep it just as it was three years ago but I'm uploading the fixed deployed version here (yeah, although I'm not providing a link, the game is publicly available since three years ago... for those who can find it! :-D)

## Personal links

Each guest got a link like `/?parameters=<base64 JSON>`:

```bash
echo -n '{"playerName":"Xavi","sex":"man"}' | base64     # sex: "man" | "woman" (player sprite)
# http://localhost:8000/?parameters=eyJwbGF5ZXJOYW1lIjoiWGF2aSIsInNleCI6Im1hbiJ9
```

Without parameters the game still works with an anonymous player. Routes:

| Route          | Content                                                         |
|----------------|-----------------------------------------------------------------|
| `/`            | The game                                                        |
| `/landing`     | The invitation page (location, date, dress code)                 |
| `/killingGame` | Instructions for a game played during the wedding party         |

## Development

Requires Node.js 20+.

```bash
npm ci
npm run dev          # http://localhost:8000
npm run lint
npm test             # unit tests (Vitest)
npm run smoke        # boots every level and plays a few scenarios in headless Chrome
```

`npm run smoke` drives the system Chrome (`/usr/bin/google-chrome`, override with `CHROME_PATH`)
and writes screenshots to `.smoke-output/` (override with `SMOKE_OUT`). Add `?debug=1` to the URL
to see physics bodies while playing.

Alternatively, run the dev server in Docker with the source mounted: `./run.sh`.

### Configuration

Vite bakes `VITE_*` variables into the JavaScript bundle **at build time**, so they must be present
when running `npm run build` (or `docker build`). Setting them on the running container has no effect.

| Variable               | Purpose                                                                  |
|------------------------|--------------------------------------------------------------------------|
| `VITE_MAPS_API_KEY`    | Google Maps browser key for the map on the landing. Without it only a link is shown. |

A Maps browser key is public by nature: protect it with HTTP referrer restrictions in the Google Cloud console.

## Project structure

```
src/
  App.jsx, main.jsx         React routes
  utils/params.js           invitation link decoding
  components/
    game/Game.jsx           mounts the Phaser game
    landing/                invitation page
    killingGame/            party game instructions
    common/                 shared landing components and styles
  game/
    config.js               Phaser configuration and scene list
    core/                   BaseLevel (shared level pipeline), dialogs, input, inventory, HUD
    entities/               Player, Bunny
    systems/                spawning from Tiled objects, interactions, audio, animations
    data/                   assets manifest, dialog texts (Catalan), items, NPC animation frames
    scenes/                 MainMenu, PreLevel, UIScene and one file per level
public/assets/              sprites, tilesets, Tiled maps (JSON) and audio served as-is
tiled/                      Tiled project and automapping rules (authoring only)
tools/spritesheets/         Python helpers used to slice and merge spritesheets
scripts/smoke.mjs           smoke test
```

Each level is a `BaseLevel` subclass: a static `config` describes the map, layers, spawned objects,
music, doors and exits, and the class only implements what is unique to that level. Levels are designed
in [Tiled](https://www.mapeditor.org/); custom properties on the objects (`contains`, `spritesheet`,
`order`, `text`...) feed the game.

## Deployment (Google Cloud)

The site is a static build served by nginx (non-root, port 8080) on **Cloud Run**, with domain mapping
for the custom domain.

```bash
export GCLOUD_PROJECT=<your-project-id>
./deploy.sh
```

`deploy.sh` builds the image with Cloud Build (`cloudbuild.yaml`), which reads the Maps key from Secret
Manager (secret `VITE_MAPS_API_KEY`) and passes it as a build argument, then deploys it to Cloud Run.
The Cloud Build service account needs `roles/secretmanager.secretAccessor` on that secret.
Override `IMAGE` to use an Artifact Registry repository, and `SERVICE` / `REGION` if needed.

To use specific service accounts, set any of these (email addresses):

| Variable                  | Used as                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `DEPLOY_SERVICE_ACCOUNT`  | impersonated by every `gcloud` command (you need `roles/iam.serviceAccountTokenCreator` on it) |
| `BUILD_SERVICE_ACCOUNT`   | the identity Cloud Build runs as (needs the secret access above, `roles/artifactregistry.writer` and `roles/logging.logWriter`) |
| `RUNTIME_SERVICE_ACCOUNT` | the identity the Cloud Run service runs as (needs no roles: the site is static) |

```bash
DEPLOY_SERVICE_ACCOUNT=deployer@$GCLOUD_PROJECT.iam.gserviceaccount.com ./deploy.sh
```

Pending manual steps after the 2026 cleanup (deployment, Google Cloud, history rewrite) are listed
in [docs/phase-2.md](docs/phase-2.md).
