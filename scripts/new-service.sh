#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-service.sh [service-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 必要な名前の作成
# -- サービス名
SERVICE_NAME=$1
# -- クラス名
SPACED_NAME="${SERVICE_NAME//-/ }"
read -ra words <<< "$SPACED_NAME"
CLASS_NAME=""
for word in "${words[@]}"; do
    CLASS_NAME+="${word^}"
done

echo "Script Dir:     $SCRIPT_DIR"
echo "Service:        $SERVICE_NAME"
echo "Class:          $CLASS_NAME"
echo ""

# Angularコマンド実行
npx ng generate service "service/$SERVICE_NAME/$SERVICE_NAME"

# クラス名とconstructorログ追加
SERVICE_DIR="${SCRIPT_DIR}/../src/app/service/$SERVICE_NAME"
"$SCRIPT_DIR/insert-text.sh" "$SERVICE_DIR/$SERVICE_NAME.ts" \
  "import { Injectable } from '@angular/core';" \
  "import { inject, Injectable } from '@angular/core';
import { Logger } from '../../utility/logger/logger';" \
  true
"$SCRIPT_DIR/insert-text.sh" "$SERVICE_DIR/$SERVICE_NAME.ts" \
  "export class ${CLASS_NAME} {}" \
  "export class ${CLASS_NAME} {
  private readonly className = '${CLASS_NAME}';

  // 依存サービス
  private logger = inject(Logger);

  constructor() {
    this.logger.debug(\`New \${this.className}()\`);
  }
}" \
  true