#!/bin/bash
# init.sh
#
# Preflight for Copilot Chat in the Dev Container or the Copilot cloud agent:
#
#   1. Verify the test runner and build command.
#   2. Verify git/gh authentication and access to this repo's Issues.
#
# The Dev Container's postStartCommand already starts the firewall and runs
# npm ci. Copilot cloud-agent setup is managed by GitHub; run this preflight
# only after its development image and dependencies are ready.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

steps=(
  "scripts/init-verify-build.sh"
  "scripts/init-verify-git-auth.sh"
  "scripts/init-verify-github-issues.sh"
)

for step in "${steps[@]}"; do
  echo ""
  echo "########################################"
  echo "# $step"
  echo "########################################"
  bash "$step"
done

echo ""
echo "=== init.sh: all checks passed, environment is ready ==="