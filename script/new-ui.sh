#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-ui.sh [ui-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 新しいコンポーネントを作成
"$SCRIPT_DIR/new-component.sh" "ui" "$1"
