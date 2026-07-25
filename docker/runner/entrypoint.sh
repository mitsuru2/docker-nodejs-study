#!/bin/bash
# Ephemeral GitHub Actions runner entrypoint for Azure Container Instances.
# Registers as a one-job (--ephemeral) runner, executes exactly one job, then run.sh exits
# on its own (the runner unregisters itself). The container group then transitions to
# "Terminated", which the Cleanup function detects and deletes.
set -euo pipefail

: "${REPO_URL:?REPO_URL is required}"
: "${RUNNER_TOKEN:?RUNNER_TOKEN is required}"
: "${RUNNER_NAME:?RUNNER_NAME is required}"
: "${RUNNER_LABELS:?RUNNER_LABELS is required}"

RUNNER_WORKDIR="${RUNNER_WORKDIR:-_work}"

# Best-effort deregistration if the container is killed before the job completes
# (e.g. by the Cleanup function's hang-timeout force delete).
cleanup() {
  echo "Received termination signal. Attempting to deregister the runner..."
  ./config.sh remove --token "$RUNNER_TOKEN" || true
}
trap cleanup SIGTERM SIGINT

./config.sh \
  --url "$REPO_URL" \
  --token "$RUNNER_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$RUNNER_LABELS" \
  --work "$RUNNER_WORKDIR" \
  --ephemeral \
  --unattended \
  --replace

./run.sh
