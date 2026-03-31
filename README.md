# docker-nodejs-study

Angular (SSR) + Docker の学習用リポジトリです。

## 概要

- Angular 21 + TypeScript
- SSR (server output mode) / Express
- i18n（en-GB / ja）
- PrimeNG / PrimeIcons
- Dockerfile / Dev Container 対応
- Vitest（依存あり）

## 必要要件

- Node.js（リポジトリの `packageManager` に合わせて npm 11 系推奨）
- Docker（Dockerfile を利用する場合）

## セットアップ

```bash
npm ci
```

## 開発サーバー起動

```bash
npm run start
# http://localhost:4200/
```

### 日本語構成で起動

```bash
npm run start-ja
# http://localhost:4200/
```

## ビルド

SSR を含めてローカライズビルドします。

```bash
npm run build
```

ビルド成果物は `dist/` に出力され、SSR サーバーのエントリは以下です。

- `dist/docker-nodejs-study/server/server.mjs`

## SSR サーバー起動（ビルド後）

```bash
npm run serve:ssr:docker-nodejs-study
```

## UI カタログ

```bash
npm run catalog
```

## テスト / リント

```bash
npm run test
npm run lint
```

## i18n

メッセージ抽出（XLIFF）は以下です。

```bash
npm run i18n
```

## Docker

### 1) イメージビルド

```bash
docker build -t docker-nodejs-study .
```

### 2) 起動

SSR サーバーを起動します（`Dockerfile` の runtime ステージ）。

```bash
docker run --rm -p 4200:4200 docker-nodejs-study
```

> 注: 現在の `Dockerfile` は build ステージではソースをコピーせず、マウント前提のコメントが含まれています。
> 運用方法に合わせて `COPY . .` の扱いを調整してください。

## Dev Container

`.devcontainer/devcontainer.json` で Dockerfile（build ステージ）を利用する構成になっています。

## スクリプト

`script/` 配下に、新規ページ/機能/サービス等の雛形生成用スクリプトがあります。

- `npm run new-page`
- `npm run new-feature`
- `npm run new-service`
- `npm run new-ui`
- `npm run new-utility`

## ライセンス

[LICENSE](./LICENSE)
