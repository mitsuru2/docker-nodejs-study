#!/bin/bash
# Manual build of the ACI self-hosted runner image via ACR Tasks (`az acr build`).
# Runs the build remotely on ACR, so no local Docker daemon is required and this image
# is never used to build itself (avoids the chicken-and-egg problem for the ACI runner).
#
# Usage:
#   AZURE_ACR_NAME=<acr-name> AZURE_RG_NAME=<resource-group> ./docker/runner/build.sh
set -euo pipefail

: "${AZURE_ACR_NAME:?AZURE_ACR_NAME is required (ACR name to build/push to)}"
: "${AZURE_RG_NAME:?AZURE_RG_NAME is required (resource group of the ACR)}"

IMAGE_NAME="${IMAGE_NAME:-gha-runner}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# 7文字の短縮SHA。現在チェックアウトしているHEADコミットから取得する
# (ワークフロー版の `SHORT_SHA=$(echo ${{ github.sha }} | cut -c1-7)` に相当)。
SHORT_SHA="$(git -C "$SCRIPT_DIR" rev-parse --short=7 HEAD)"

echo "Registry:       $AZURE_ACR_NAME"
echo "Resource group: $AZURE_RG_NAME"
echo "Image:          $IMAGE_NAME:sha-$SHORT_SHA, $IMAGE_NAME:latest"
echo ""

az acr build \
  --registry "$AZURE_ACR_NAME" \
  --resource-group "$AZURE_RG_NAME" \
  --image "$IMAGE_NAME:sha-$SHORT_SHA" \
  --image "$IMAGE_NAME:latest" \
  --file "$SCRIPT_DIR/Dockerfile" \
  "$SCRIPT_DIR"
