#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-page.sh [page-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 新しいコンポーネントを作成
"$SCRIPT_DIR/new-component.sh" "page" "$1"
