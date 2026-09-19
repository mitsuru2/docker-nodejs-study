#!/bin/bash
set -e # エラーが発生したらスクリプト終了。

# 所有権の変更
sudo chown node node_modules

# Claude Codeログイン
sudo mkdir -p /home/node/.claude
sudo chown -R node:node /home/node/.claude

## git のコミット用ユーザー名・メールアドレス設定
## VS Code の Dev Containers 拡張を使う場合はホストの ~/.gitconfig が自動転送されるが、
## それ以外の方法でコンテナを起動したセッション (例: VS Code を介さない Claude Code
## セッション) では転送が効かず未設定になる。secrets.env 経由で明示的に設定することで、
## どちらの起動経路でも git commit がユーザー名・メール未設定エラーにならないようにする。
echo ""
echo "=== git config user.name / user.email ==="
if [ -z "${GIT_USER_NAME:-}" ] || [ -z "${GIT_USER_EMAIL:-}" ]; then
  echo "GIT_USER_NAME / GIT_USER_EMAIL が設定されていません。スキップします。"
  echo "secrets.env に GIT_USER_NAME=... / GIT_USER_EMAIL=... を追加してください。"
else
  git config --global user.name "$GIT_USER_NAME"
  git config --global user.email "$GIT_USER_EMAIL"
  echo "git commit のユーザーを設定しました: $GIT_USER_NAME <$GIT_USER_EMAIL>"
fi

## GitHub CLI (gh) の認証設定
## GH_TOKEN (または GITHUB_TOKEN) が secrets.env 経由で環境変数にあれば、
## gh コマンドはログイン不要でそれを使う。ここでは git 自体 (git push/pull 等) も
## 同じトークンで認証できるよう、git の credential.helper を gh に向ける。
echo ""
echo "=== gh auth setup-git ==="
if ! command -v gh >/dev/null 2>&1; then
  echo "gh コマンドが見つかりません。スキップします。"
elif [ -z "${GH_TOKEN:-}" ] && [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GH_TOKEN / GITHUB_TOKEN が設定されていません。スキップします。"
else
  gh auth setup-git
  echo "git の credential.helper を gh に設定しました。"

  echo ""
  echo "=== gh auth status ==="
  gh auth status
fi

## node_modules フォルダをリンク
## Dev Containers 拡張でワークスペースが強制的にずらされるため
echo ""
echo "=== make link to node_modules ==="
if [ -e "${PWD}/node_modules" ]; then
  echo "node_modules は既に存在するため、リンク作成をスキップしました: ${PWD}/node_modules"
else
  ln -sfn /app/node_modules "${PWD}"
  echo "/app/node_modules をワークスペースにリンクしました。"
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
# echo "Installing npm packages..."
# npm ci

# Cosmos DBエミュレーターに初期データを注入
# node ./.devcontainer/seed-cosmos.mjs

## gitのステータスを表示
echo ""
echo "=== git fetch --prune ==="
git fetch --prune

echo ""
echo "=== git status ==="
git status
