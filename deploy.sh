#!/usr/bin/env bash
# Builds the image on Cloud Build and deploys it to Cloud Run.
#   GCLOUD_PROJECT           (required) Google Cloud project id
#   SERVICE, REGION, IMAGE   (optional) override the defaults below
#
# Optional service accounts (email addresses); each one is used only when set:
#   DEPLOY_SERVICE_ACCOUNT   impersonated for every gcloud command (your user needs
#                            roles/iam.serviceAccountTokenCreator on it)
#   BUILD_SERVICE_ACCOUNT    identity Cloud Build runs the build as (instead of the default one)
#   RUNTIME_SERVICE_ACCOUNT  identity the Cloud Run service runs as (instead of the Compute default)
set -euo pipefail

: "${GCLOUD_PROJECT:?Set GCLOUD_PROJECT to your Google Cloud project id}"
SERVICE="${SERVICE:-game-new}"
REGION="${REGION:-europe-west1}"
IMAGE="${IMAGE:-gcr.io/${GCLOUD_PROJECT}/${SERVICE}}"

common_args=(--project "$GCLOUD_PROJECT")
if [ -n "${DEPLOY_SERVICE_ACCOUNT:-}" ]; then
    common_args+=(--impersonate-service-account "$DEPLOY_SERVICE_ACCOUNT")
fi

build_args=()
if [ -n "${BUILD_SERVICE_ACCOUNT:-}" ]; then
    build_args+=(--service-account "projects/${GCLOUD_PROJECT}/serviceAccounts/${BUILD_SERVICE_ACCOUNT}")
fi

run_args=()
if [ -n "${RUNTIME_SERVICE_ACCOUNT:-}" ]; then
    run_args+=(--service-account "$RUNTIME_SERVICE_ACCOUNT")
fi

gcloud builds submit . \
    "${common_args[@]}" \
    "${build_args[@]}" \
    --config cloudbuild.yaml \
    --substitutions "_IMAGE=${IMAGE}"

gcloud run deploy "$SERVICE" \
    "${common_args[@]}" \
    "${run_args[@]}" \
    --image "$IMAGE" \
    --region "$REGION" \
    --platform managed \
    --port 8080 \
    --allow-unauthenticated \
    --quiet
