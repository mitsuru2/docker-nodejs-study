#!/bin/bash
# scripts/init-verify-github-issues.sh
#
# Confirm local gh can reach this repository's Issues API. Cloud agents use
# Copilot MCP for GitHub access instead of the gh CLI.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "=== init-verify-github-issues: checking GitHub access ==="
  echo "  OK: cloud-agent GitHub Issues access is provided through Copilot MCP"
  exit 0
fi

echo "=== init-verify-github-issues: listing issues via gh ==="
if ! gh issue list --limit 1 >/dev/null 2>&1; then
  echo "  FAIL: could not list GitHub Issues for this repo (check token scope/repo access)" >&2
  exit 1
fi
echo "  OK: GitHub Issues API access confirmed"
