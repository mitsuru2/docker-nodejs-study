#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-pipe.sh [pipe-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 必要な名前の作成
# -- サービス名
PIPE_NAME=$1
# -- クラス名
SPACED_NAME="${PIPE_NAME//-/ }"
read -ra words <<< "$SPACED_NAME"
CLASS_NAME=""
for word in "${words[@]}"; do
    CLASS_NAME+="${word^}"
done
CLASS_NAME+="Pipe"

echo "Script Dir:     $SCRIPT_DIR"
echo "Service:        $PIPE_NAME"
echo "Class:          $CLASS_NAME"
echo ""

# Angularコマンド実行
npx ng generate pipe "pipe/$PIPE_NAME" --flat=false

