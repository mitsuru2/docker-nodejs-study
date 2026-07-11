#!/bin/bash
set -e # エラーが発生したらスクリプト終了。

# 所有権の変更
sudo chown node node_modules

# Claude Codeログイン
sudo mkdir -p /home/node/.claude
sudo chown -R node:node /home/node/.claude

# secrets.env の読み込み (npm ci より前に環境変数を反映させる)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_ENV="$SCRIPT_DIR/secrets.env"

if [ -f "$SECRETS_ENV" ]; then
  echo ""
  echo "=== secrets.env を読み込み中 ==="
  set -a
  source "$SECRETS_ENV"
  set +a

  # 新しいシェルでも環境変数が使えるように .bashrc に読み込み設定を追加
  MARKER="# .devcontainer/secrets.env"
  if ! grep -qF "$MARKER" /home/node/.bashrc 2>/dev/null; then
    {
      echo ""
      echo "$MARKER"
      echo "set -a"
      echo "source \"$SECRETS_ENV\""
      echo "set +a"
    } >> /home/node/.bashrc
  fi
else
  echo "secrets.env が見つかりません: $SECRETS_ENV"
fi

# 証明書の取得とインストール
# echo "Waiting for Cosmos DB Emulator..."
# until curl --fail --insecure ${COSMOS_ENDPOINT}/_explorer/emulator.pem > /tmp/emulator.crt 2>/dev/null; do
#   echo "CURL retrying..."
#   sleep 5
# done
# sudo cp /tmp/emulator.crt /usr/local/share/ca-certificates/emulator.crt
# sudo update-ca-certificates

# NPMパッケージインストール
echo "Installing npm packages..."
npm ci

# Cosmos DBエミュレーターに初期データを注入
# node ./.devcontainer/seed-cosmos.mjs
