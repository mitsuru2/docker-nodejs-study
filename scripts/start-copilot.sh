#!/usr/bin/env bash
# start-copilot.sh: Dev Container 内で Copilot CLI を決まった設定で起動する
set -euo pipefail

# 全ツール自動許可は開発用イメージの中に限定する
if [ "${IN_DEV_IMAGE:-}" != "1" ]; then
  echo "start-copilot.sh can only be run inside a Dev Container" >&2
  exit 1
fi
if [ -z "${GH_TOKEN:-}" ]; then
  echo "GH_TOKEN is not set (check the env file and run Rebuild Container)" >&2
  exit 1
fi

export COPILOT_GITHUB_TOKEN="$GH_TOKEN"
exec copilot --allow-all-tools \
  --disable-builtin-mcps \
  --deny-tool='shell(git push --force)' \
  --deny-tool='shell(gh repo delete)' \
  --deny-tool='shell(gh secret)' \
  "$@"

