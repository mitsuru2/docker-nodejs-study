#!/bin/bash
# scripts/init-verify-git-auth.sh
#
# Confirm git is available and verify local gh authentication. Cloud agents use
# Copilot MCP for GitHub access and only need the GitHub-managed git identity.

set -euo pipefail

echo "=== init-verify-git-auth: checking git is available ==="
if ! command -v git >/dev/null 2>&1; then
  echo "  FAIL: git is not installed" >&2
  exit 1
fi
echo "  OK: $(git --version)"

echo "=== init-verify-git-auth: checking git user identity ==="
if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "  OK: using GitHub-managed agent identity"
else
  git_user_name="$(git config --get user.name || true)"
  git_user_email="$(git config --get user.email || true)"
  if [ -z "$git_user_name" ] || [ -z "$git_user_email" ]; then
    echo "  FAIL: git user.name / user.email is not configured" >&2
    exit 1
  fi
  echo "  OK: committing as $git_user_name <$git_user_email>"
fi

if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "=== init-verify-git-auth: checking GitHub access ==="
  echo "  OK: cloud-agent GitHub access is provided through Copilot MCP"
else
  echo "=== init-verify-git-auth: checking gh is available ==="
  if ! command -v gh >/dev/null 2>&1; then
    echo "  FAIL: gh (GitHub CLI) is not installed" >&2
    exit 1
  fi
  echo "  OK: $(gh --version | head -n1)"

  echo "=== init-verify-git-auth: checking gh auth status ==="
  if ! gh auth status >/dev/null 2>&1; then
    echo "  FAIL: gh is not authenticated (configure GH_TOKEN/GITHUB_TOKEN or run 'gh auth login' locally)" >&2
    exit 1
  fi
  echo "  OK: gh is authenticated"
fi

echo "=== init-verify-git-auth: checking git credentials against the remote ==="
if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "  OK: GitHub manages cloud-agent Git credentials"
else
  if ! git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "  FAIL: could not reach/authenticate to 'origin' remote" >&2
    exit 1
  fi
  echo "  OK: origin remote is reachable with current credentials"
fi
