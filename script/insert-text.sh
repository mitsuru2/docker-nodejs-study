#!/bin/bash

# 引数の数を確認（3つ未満はエラー）
if [[ $# -lt 3 ]]; then
    echo "Usage: $0 <file_path> <pattern> <insert_text> [delete_original_line]" >&2
    exit 1
fi

# 引数の割り当て
FILE_PATH="$1"
PATTERN="$2"
INSERT_TEXT="$3"
DELETE_ORIGINAL="${4:-false}" # 第四引数がない場合は false

# ファイルの存在確認
if [[ ! -f "$FILE_PATH" ]]; then
    echo "Error: File not found: $FILE_PATH" >&2
    exit 1
fi

# 挿入するテキストをエスケープ（sedで安全に扱うため）
# 改行やバックスラッシュを適切に処理
ESCAPED_TEXT=$(echo "$INSERT_TEXT" | sed ':a;N;$!ba;s/\n/\\n/g')

# パターン内の特殊文字（[, ], |, \）をエスケープ
ESCAPED_PATTERN=$(echo "$PATTERN" | sed 's/[]|[\\]/\\&/g')

if [[ "$DELETE_ORIGINAL" == "true" ]]; then
    # パターンに一致する最初の行を、新しいテキストで置換（元の行は消える）
    # 0,/pattern/ で「最初に見つけた1回目だけ」を対象にする
    sed -i "0,\|$ESCAPED_PATTERN| s|.*$ESCAPED_PATTERN.*|$ESCAPED_TEXT|" "$FILE_PATH"
else
    # パターンに一致する最初の行の「次」に、新しいテキストを挿入
    sed -i "0,\|$ESCAPED_PATTERN| s|.*$ESCAPED_PATTERN.*|&\n$ESCAPED_TEXT|" "$FILE_PATH"
fi

echo "Processed: $FILE_PATH"
