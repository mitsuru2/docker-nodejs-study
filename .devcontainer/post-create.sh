#!/bin/bash
set -e # エラーが発生したらスクリプト終了。

# 所有権の変更
sudo chown node node_modules

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
