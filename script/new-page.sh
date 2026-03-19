#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-page.sh [page-name]"
    exit 1
fi

# 作成するページコンポーネントの名前を取得。
PAGE_NAME=$1

# Angularコマンド実行
npx ng generate component "page/$PAGE_NAME" --skip-tests=false

