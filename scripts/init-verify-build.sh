#!/bin/bash
# scripts/init-verify-build.sh
#
# Verify tests and build through the shared development image. In the Dev
# Container, scripts/dev executes directly; on cloud runners it uses Docker.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "=== init-verify-build: npm test ==="
if ! "$REPO_ROOT/scripts/dev" npm test -- --watch=false; then
  echo "  FAIL: npm test did not succeed" >&2
  exit 1
fi
echo "  OK: npm test passed"

echo "=== init-verify-build: npm run build ==="
if ! "$REPO_ROOT/scripts/dev" npm run build; then
  echo "  FAIL: npm run build did not succeed" >&2
  exit 1
fi
echo "  OK: npm run build passed"
