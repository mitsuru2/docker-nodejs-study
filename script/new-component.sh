#!/bin/bash

# 引数チェック
if [ -z "$2" ]; then
    echo "Usage: ./new-feature.sh [component-type] [component-name]"
    echo "  component-type: ui, feature, page"
    echo "  component-name: kebab-case-name"
    exit 1
fi

# コンポーネントタイプのチェック
case "$1" in
    ui|feature|page) ;;
    *) echo "Error: component-type must be 'ui', 'feature', or 'page'"; exit 1 ;;
esac

# スクリプトディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 作成するコンポーネントの種類を取得
COMPO_TYPE=$1

# 作成するページコンポーネントの名前を取得。
COMPO_NAME=$2

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
case "$COMPO_TYPE" in
    ui)
        npx ng generate component "$COMPO_TYPE/$COMPO_NAME" --skip-tests=true
        npx ng generate interface "$COMPO_TYPE/$COMPO_NAME/$COMPO_NAME" --type=interface
        npx ng generate component "$COMPO_TYPE/$COMPO_NAME/$TEST_COMPO_NAME" --skip-tests=true
    ;;
    feature)
        npx ng generate component "$COMPO_TYPE/$COMPO_NAME" --skip-tests=true
        npx ng generate interface "$COMPO_TYPE/$COMPO_NAME/$COMPO_NAME" --type=interface
        npx ng generate component "$COMPO_TYPE/$COMPO_NAME/$TEST_COMPO_NAME" --skip-tests=true
    ;;
    page)
        npx ng generate component "$COMPO_TYPE/$COMPO_NAME" --skip-tests=false
    ;;
esac
echo ""

# コードスニペットの注入準備
COMPO_DIR="${SCRIPT_DIR}/../src/app/${COMPO_TYPE}/${COMPO_NAME}"
TEST_COMPO_DIR=${COMPO_DIR}/${TEST_COMPO_NAME}

# インターフェースファイル
if [ -f "${COMPO_DIR}/${COMPO_NAME}.interface.ts" ]; then
    CONFIG_DATA_TYPE=${CLASS_NAME}ConfigData
    "$SCRIPT_DIR/insert-text.sh" \
        "${COMPO_DIR}/${COMPO_NAME}.interface.ts" \
        "export interface" \
        "export interface ${CONFIG_DATA_TYPE} {}" \
        true
fi

# コンポーネントファイル
if [ -f "${COMPO_DIR}/${COMPO_NAME}.ts" ]; then
    # importコマンド修正
    TARGET_TEXT="import { Component } from '@angular/core';"
    REPLACE_TEXT=${TARGET_TEXT}
    if [ "$COMPO_TYPE" = "page" ]; then
        : # Do nothing
    else
        REPLACE_TEXT="import { Component, input } from '@angular/core';
import { ${CONFIG_DATA_TYPE} } from './${COMPO_NAME}.interface';"
    fi
    "$SCRIPT_DIR/insert-text.sh" "${COMPO_DIR}/${COMPO_NAME}.ts" "${TARGET_TEXT}" "${REPLACE_TEXT}" true

    # クラス定義修正
    TARGET_TEXT="export class ${CLASS_NAME} {}"
    REPLACE_TEXT=$TARGET_TEXT
    if [ "$COMPO_TYPE" = "page" ]; then
        REPLACE_TEXT="export class ${CLASS_NAME} {
  private readonly className = '${CLASS_NAME}';
}"
    else
        REPLACE_TEXT="export class ${CLASS_NAME} {
  private readonly className = '${CLASS_NAME}';

  // 入力パラメータ
  config = input.required<${CONFIG_DATA_TYPE}>();
}"
    fi
    "$SCRIPT_DIR/insert-text.sh" "${COMPO_DIR}/${COMPO_NAME}.ts" "${TARGET_TEXT}" "${REPLACE_TEXT}" true
fi

# UIカタログ用テストコンポーネント
if [ ${COMPO_TYPE} = "ui" ] || [ ${COMPO_TYPE} = "feature" ]; then

    # SCSSファイル
    "$SCRIPT_DIR/insert-text.sh" "${TEST_COMPO_DIR}/${TEST_COMPO_NAME}.scss" "" ".container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--p-custom-margin-m);
}"

    # TSファイル
    "$SCRIPT_DIR/insert-text.sh" "${TEST_COMPO_DIR}/${TEST_COMPO_NAME}.ts" \
        "import { Component } from '@angular/core';" \
        "import { ${CONFIG_DATA_TYPE} } from '../${COMPO_NAME}.interface';
import { ${CLASS_NAME} } from '../${COMPO_NAME}';" false
    "$SCRIPT_DIR/insert-text.sh" "${TEST_COMPO_DIR}/${TEST_COMPO_NAME}.ts" \
        "  imports: []," \
        "  imports: [${CLASS_NAME}]," true
    "$SCRIPT_DIR/insert-text.sh" "${TEST_COMPO_DIR}/${TEST_COMPO_NAME}.ts" \
        "export class ${TEST_CLASS_NAME} {}" \
        "export class ${TEST_CLASS_NAME} {
  private readonly className = '${TEST_CLASS_NAME}';

  protected readonly testCases: { title: string; config: ${CONFIG_DATA_TYPE} }[] = [
    { title: '基本形', config: {} }
  ];
}" true

    # HTMLファイル
    "$SCRIPT_DIR/insert-text.sh" "${TEST_COMPO_DIR}/${TEST_COMPO_NAME}.html" \
        "<p>" \
        "<div class=\"container\">
  @for (test of testCases; track \$index) {
    <div>
      <h3>{{ test.title }}</h3>
      <${SELECTOR_NAME} [config]=\"test.config\"></${SELECTOR_NAME}>
    </div>
  }
</div>" true
fi

# UIカタログ修正
if [ ${COMPO_TYPE} = "ui" ] || [ ${COMPO_TYPE} = "feature" ]; then
    CATALOG_DIR=${SCRIPT_DIR}/../src/app/sub-module/ui-catalog
    COMPO_TYPE_ID="UI"
    if [ ${COMPO_TYPE} = "feature" ]; then
        COMPO_TYPE_ID="Feature"
    fi

    # TSファイル
    "$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" \
        "import { PresentationalComponentType, UiCatalogItemData }" \
        "import { ${TEST_CLASS_NAME} } from '../../${COMPO_TYPE}/${COMPO_NAME}/${TEST_COMPO_NAME}/${TEST_COMPO_NAME}';" \
        false
    "$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" \
        "  imports: [" \
        "    ${TEST_CLASS_NAME}," \
        false
    "$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.ts" \
        "protected readonly items: UiCatalogItemData[]" \
        "    { type: PresentationalComponentType.${COMPO_TYPE_ID}, name: '${LABEL_NAME}', id: '${COMPO_NAME}' }," \
        false

    # HTMLファイル
    "$SCRIPT_DIR/insert-text.sh" "${CATALOG_DIR}/ui-catalog.html" \
        "<span>No component selected.</span>" \
        "      } @else if (selectedId === '${COMPO_NAME}') {
        <${TEST_SELECTOR_NAME}></${TEST_SELECTOR_NAME}>" \
        false
fi

# ページパスの登録
if [ ${COMPO_TYPE} = "page" ]; then
    MODEL_DIR=${SCRIPT_DIR}/../src/app/model
    "$SCRIPT_DIR/insert-text.sh" "${MODEL_DIR}/page-path.ts" \
        "export enum PagePath {" \
        "  ${CLASS_NAME} = '${COMPO_NAME}'," \
        false
fi

# ルーター設定修正
if [ ${COMPO_TYPE} = "page" ]; then
    APP_DIR=${SCRIPT_DIR}/../src/app
    "$SCRIPT_DIR/insert-text.sh" "${APP_DIR}/app.routes.ts" \
      "import { Routes } from '@angular/router';" \
      "import { ${CLASS_NAME} } from './page/${COMPO_NAME}/${COMPO_NAME}';" \
      false
    "$SCRIPT_DIR/insert-text.sh" "${APP_DIR}/app.routes.ts" \
      "export const routes: Routes = [" \
      "  {
    path: '${COMPO_NAME}',
    component: ${CLASS_NAME},
  }," \
      false
fi

echo ""
