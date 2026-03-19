#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-ui.sh [page-name]"
    exit 1
fi

# 作成するページコンポーネントの名前を取得。
UI_NAME=$1

# Angularコマンド実行
npx ng generate component "ui/$UI_NAME" --skip-tests=true

