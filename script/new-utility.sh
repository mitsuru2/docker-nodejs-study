#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-utility.sh [utility-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ユーティリティモジュールの名前を取得 (フォルダ名)
UTILITY_NAME=$1

# フォルダ作成
FOLDER_PATH="${SCRIPT_DIR}/../src/app/utility/$UTILITY_NAME"
mkdir -p "$FOLDER_PATH"
echo "New: ${FOLDER_PATH}/"

# 本体ファイル作成
FILE_PATH="${FOLDER_PATH}/${UTILITY_NAME}.ts"
touch "$FILE_PATH"
echo "New: ${FILE_PATH}"

# テストファイル作成
TEST_FILE_PATH="${FOLDER_PATH}/${UTILITY_NAME}.spec.ts"
touch "$TEST_FILE_PATH"
echo "New: ${TEST_FILE_PATH}"

# テストファイルにvitestひな型を挿入
SPACED_NAME="${UTILITY_NAME//-/ }"
read -ra words <<< "$SPACED_NAME"
CLASS_NAME=""
for word in "${words[@]}"; do
    CLASS_NAME+="${word^}"
done
"$SCRIPT_DIR/insert-text.sh" "$TEST_FILE_PATH" "" "describe('${CLASS_NAME}', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});" false

echo ""


