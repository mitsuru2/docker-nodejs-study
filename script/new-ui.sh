#!/bin/bash

# 引数チェック
if [ -z "$1" ]; then
    echo "Usage: ./new-ui.sh [page-name]"
    exit 1
fi

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 作成するページコンポーネントの名前を取得。
COMPO_NAME=$1

# 必要になる各用途の名前を作成
# -- セレクタ名
SELECTOR_NAME="app-$COMPO_NAME"
# -- クラス名
SPACED_NAME="${COMPO_NAME//-/ }"
read -ra words <<< "$SPACED_NAME"
CLASS_NAME=""
for word in "${words[@]}"; do
    CLASS_NAME+="${word^}"
done
# -- カタログラベル
LABEL_NAME=""
for word in "${words[@]}"; do
    if [[ -n "$LABEL_NAME" ]]; then
        LABEL_NAME+=" "
    fi
    LABEL_NAME+="${word^}"
done
# -- テストコンポーネント名
TEST_COMPO_NAME="test-$COMPO_NAME"
# -- テストコンポーネントセレクター名
TEST_SELECTOR_NAME="app-$TEST_COMPO_NAME"
# -- テストコンポーネントクラス名
# -- クラス名
SPACED_NAME="${TEST_COMPO_NAME//-/ }"
read -ra words <<< "$SPACED_NAME"
TEST_CLASS_NAME=""
for word in "${words[@]}"; do
    TEST_CLASS_NAME+="${word^}"
done

echo "Script Dir:     $SCRIPT_DIR"
echo "Component:      $COMPO_NAME"
echo "Selector:       $SELECTOR_NAME"
echo "Class:          $CLASS_NAME"
echo "Label:          $LABEL_NAME"
echo "Test Component: $TEST_COMPO_NAME"
echo "Test Selector:  $TEST_SELECTOR_NAME"
echo "Test Class:     $TEST_CLASS_NAME"
echo ""

# Angularコマンド実行
npx ng generate component "ui/$COMPO_NAME" --skip-tests=true
npx ng generate interface "ui/$COMPO_NAME/$COMPO_NAME" --type=interface
npx ng generate component "ui/$COMPO_NAME/$TEST_COMPO_NAME" --skip-tests=true
echo ""

# コードスニペットの注入
COMPO_DIR="${SCRIPT_DIR}/../src/app/ui/${COMPO_NAME}"
TEST_COMPO_DIR=${COMPO_DIR}/${TEST_COMPO_NAME}
# -- インターフェースファイル
CONFIG_DATA_TYPE=${CLASS_NAME}ConfigData
"$SCRIPT_DIR/insert-text.sh" "${COMPO_DIR}/${COMPO_NAME}.interface.ts" "export interface" "export interface ${CONFIG_DATA_TYPE} {}" true
# -- コンポーネントファイル
"$SCRIPT_DIR/insert-text.sh" "${COMPO_DIR}/${COMPO_NAME}.ts" "import { Component } from '@angular/core';" "import { Component, input } from '@angular/core';
import { ${CONFIG_DATA_TYPE} } from './${COMPO_NAME}.interface';" true
"$SCRIPT_DIR/insert-text.sh" "${COMPO_DIR}/${COMPO_NAME}.ts" "export class ${CLASS_NAME} {}" "export class ${CLASS_NAME} {
  private readonly className = \"${CLASS_NAME}\";

  // 入力パラメータ
  config = input.required<${CONFIG_DATA_TYPE}>();
}" true
# -- カタログ (TS)
CATALOG_DIR=${SCRIPT_DIR}/../src/app/sub-module/ui-catalog
"$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" "import { PresentationalComponentType, UiCatalogItemData }" "import { ${TEST_CLASS_NAME} } from '../../ui/${COMPO_NAME}/${TEST_COMPO_NAME}/${TEST_COMPO_NAME}';" false
"$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" "  imports: [" "    ${TEST_CLASS_NAME}," false
"$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" "protected readonly items: UiCatalogItemData[]" "    { type: PresentationalComponentType.UI, name: '${LABEL_NAME}', id: '${COMPO_NAME}' }," false
# -- カタログ (HTML)
"$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.html" "<span>No component selected.</span>" "      } @else if (selectedId === '${COMPO_NAME}') {
        <${TEST_SELECTOR_NAME}></${TEST_SELECTOR_NAME}>" false

echo ""
