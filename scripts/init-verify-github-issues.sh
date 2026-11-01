#!/bin/bash
# scripts/init-verify-github-issues.sh
#
# Confirm gh can reach this repository's Issues API. This uses the local
# repository-scoped token or the GitHub-managed cloud-agent token, as available.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "=== init-verify-github-issues: listing issues via gh ==="
if ! gh issue list --limit 1 >/dev/null 2>&1; then
  echo "  FAIL: could not list GitHub Issues for this repo (check token scope/repo access)" >&2
  exit 1
fi
echo "  OK: GitHub Issues API access confirmed"
