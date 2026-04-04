#!/bin/bash
set -e # エラーが発生したらスクリプト終了。

# 所有権の変更
sudo chown node node_modules

# 証明書の取得とインストール
echo "Waiting for Cosmos DB Emulator..."
until curl --insecure https://cosmosdb-emulator:8081/_explorer/emulator.pem > /tmp/emulator.crt 2>/dev/null; do
  sleep 5
done
sudo cp /tmp/emulator.crt /usr/local/share/ca-certificates/emulator.crt
sudo update-ca-certificates

# パッケージインストール
echo "Installing npm packages..."
npm ci
