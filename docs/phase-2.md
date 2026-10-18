# Phase 2: manual steps after the 2026 cleanup

Phase 1 (branch `refactor/phase-1`) cleaned up, fixed and refactored the code, turned the landing page into
a memento and removed the analytics and the chatbot. The steps below need your accounts, devices or a
force-push, so they were left for you. They are roughly in the order to do them.

- [ ] 1. Playtest and merge
- [ ] 2. Deploy to Cloud Run
- [ ] 3. Decommission the chatbot
- [ ] 4. Clean up Google Analytics and Google Forms
- [ ] 5. Remove the IBANs from the git history
- [ ] 6. Optional improvements

---

## 1. Playtest and merge

The smoke test (`npm run smoke`) boots every level and plays a few scenarios in headless Chrome, but it
can't replace a real device. On a phone, play the whole story once:

- [ ] Walk with the joystick and press the green **A** (jump) at the same time: the player must keep walking
      after the jump (this used to stop the player).
- [ ] Dialogs advance with the red **B** button, and with **ENTER** on a desktop.
- [ ] Music and sounds play in every level (the music was re-encoded to 128 kb/s).
- [ ] The castle puzzle, the ending, and the redirect to `/landing` after the credits all work.

Then push the branch and merge it. Do the history rewrite (step 5) **first**: the branch is built on
top of the rewritten `main`, so it must not be pushed before the rewrite.

```bash
git push -u origin refactor/phase-1
gh pr create --base main --head refactor/phase-1 --title "Phase 1: cleanup and refactor"
```

## 2. Deploy to Cloud Run

The site is now a static build served by nginx on port **8080** (it was 8000). The Google Maps key is baked
in **at build time** by Cloud Build, which is why setting it as a runtime secret on the Cloud Run service never
worked.

1. **Restrict the Maps key.** Google Cloud console → APIs & Services → Credentials → the Maps key →
   *Application restrictions: Websites*, and add your domain (`https://your-domain/*`). The key is visible in
   the page source by design; the restriction is what protects it.
2. **Let Cloud Build read the secret:**

   ```bash
   PROJECT_NUMBER=$(gcloud projects describe "$GCLOUD_PROJECT" --format='value(projectNumber)')
   gcloud secrets add-iam-policy-binding VITE_MAPS_API_KEY --project "$GCLOUD_PROJECT" \
       --member "serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
       --role roles/secretmanager.secretAccessor
   ```

   Newer projects run builds as the Compute Engine default service account
   (`${PROJECT_NUMBER}-compute@developer.gserviceaccount.com`). If the build can't read the secret, grant
   the role to that account instead.
3. **Image registry.** `deploy.sh` defaults to `gcr.io/$GCLOUD_PROJECT/game-new`. If your project has no
   `gcr.io` repository in Artifact Registry, create one and point `IMAGE` at it:

   ```bash
   gcloud artifacts repositories create web --repository-format docker --location europe-west1
   export IMAGE=europe-west1-docker.pkg.dev/$GCLOUD_PROJECT/web/game-new
   ```
4. **Deploy:**

   ```bash
   export GCLOUD_PROJECT=<project-id>
   ./deploy.sh
   ```
5. **Remove the old runtime secret** from the service. It is unused and was the old attempt at loading the key:

   ```bash
   gcloud run services update game-new --region europe-west1 --remove-secrets VITE_MAPS_API_KEY
   ```
6. Check the domain mapping still serves `/`, `/landing` and `/killingGame`.

## 3. Decommission the chatbot

The chat UI is gone from the site, but the backend still exists and holds an OpenAI key. It used to accept
the model, the system prompt and the API key from the browser, so anyone could use it as a free OpenAI proxy.

- [ ] **Check the OpenAI usage dashboard** for unexpected traffic since 2023.
- [ ] **Revoke the OpenAI API key** in the OpenAI dashboard (API keys).
- [ ] **Delete the Cloud Function** (it was called `gpt-chatbot-api`, in `europe-west1`):

  ```bash
  gcloud functions list --project "$GCLOUD_PROJECT"
  gcloud functions delete gpt-chatbot-api --region europe-west1 --project "$GCLOUD_PROJECT"
  ```
- [ ] **Delete the OpenAI key secret** from Secret Manager (`gcloud secrets list`, then
  `gcloud secrets delete <name>`).
- [ ] Archive the private backend repository.

## 4. Clean up Google Analytics and Google Forms

- [ ] **Google Analytics** (`G-ZH68BVB2WF`): events included guests' names. Delete the property
  (Admin → Property settings → Move to trash), or use Admin → Data deletion requests if you want to keep it.
- [ ] **RSVP Google Form**: it's no longer linked from the site. Stop accepting responses (Responses tab) and
  export the answers first if you want to keep them.

## 5. Remove the IBANs from the git history

Two IBANs were committed to this public repository: one added in June 2023 and replaced by another in
September 2023. Both are still in the history. This procedure replaces them in **every commit** with
*"Contacta'ns per veure com ens pots ajudar"*.

What it preserves and what it changes:

- **Preserved:** authors, author dates, committers, committer dates and messages of all commits, and the
  current code at the tip of each branch (byte-identical).
- **Changed:** commit hashes, from the first commit with an IBAN (June 2023) onwards. Anyone with an old
  clone has to re-clone. Signed commits lose their signatures (this repo has none).

This was verified on a throwaway mirror clone: no IBAN was left in any commit, the dates were identical,
and the tree at `refactor/phase-1` was unchanged.

### Procedure

Run it in your working repository so the unpushed branch and the stash are rewritten too.

```bash
cd ~/Projects/phaser-wedding-game

# 0. Install git-filter-repo (a single Python script)
python3 -m venv /tmp/fr && /tmp/fr/bin/pip install git-filter-repo
FILTER_REPO=/tmp/fr/bin/git-filter-repo

# 1. Back up the whole repository, including .git, branches and the stash
cp -a ~/Projects/phaser-wedding-game ~/Projects/phaser-wedding-game.bak

# 2. Build the replacements file from the history itself (so this doc never contains the IBANs).
#    Review it: it must list exactly the two IBANs.
git rev-list --all | while read c; do git grep -h -o -E 'ES[0-9]{2}( [0-9]{4}){5}' "$c"; done \
    | sort -u | sed "s/\$/==>Contacta'ns per veure com ens pots ajudar/" > /tmp/iban-replacements.txt
cat /tmp/iban-replacements.txt

# 3. Rewrite. --force is needed because the repo has a stash (filter-repo refuses by default).
"$FILTER_REPO" --force --replace-text /tmp/iban-replacements.txt

# 4. Verify: no IBAN left, and the dates kept
git rev-list --all | while read c; do git grep -l -E 'ES[0-9]{2}( [0-9]{4}){5}' "$c"; done   # no output
git log --format='%h %ad %s' --date=iso | head

# 5. filter-repo removes 'origin' on purpose; add it back and force-push ONLY main.
#    --force-with-lease refuses the push if GitHub's main is no longer the 2023 commit 535da2d.
#    refactor/phase-1 (the 2026 work) stays local until it's ready (see step 1).
git remote add origin git@github.com:xmsanchez/phaser-wedding-game.git
git push --force-with-lease=main:535da2d1c8cf25db6c61dd61f86412f708e8763d origin main
git fetch origin && git branch -u origin/main main

# 6. Clean up
rm /tmp/iban-replacements.txt
```

Before pushing, check the 2024 stash (`git stash show -p`) and drop it if you no longer need it
(`git stash drop`). Stashes are never pushed.

If GitHub rejects the force-push, temporarily allow force pushes on `main` (Settings → Branches /
Rulesets).

### Caveats

- **Pull request refs.** GitHub keeps `refs/pull/<n>/head` for pull requests (e.g. #3) pointing at the old
  commits, and you can't force-push those refs. If an old commit with an IBAN stays reachable through a PR,
  or through GitHub's cached views, ask GitHub Support to remove cached views and dangling commits
  (support.github.com, "Remove data from a repository"), mentioning the rewritten history.
- **Forks and clones** made before the rewrite still have the old history; you can't change them.
- The IBANs were public for about three years, so treat them as already exposed. An IBAN alone doesn't allow
  money to be taken, but stay alert to phishing that uses it.

## 6. Optional improvements

- Phaser 4 is a major API change. Stay on 3.x unless there's a reason to move.
- ESLint 9 with the flat config (the project uses ESLint 8 with `.eslintrc.cjs`).
- JSDoc types with `// @ts-check`, or a gradual TypeScript migration of `src/game/`.
- Git LFS for binary assets in future projects.
- `npm audit` reports a moderate advisory in `i18next-http-backend`, a dependency of `phaser3-rex-plugins`.
  It is not part of the bundle (only the joystick and BBCode modules are imported); it goes away when the
  plugin package updates it.
