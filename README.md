# docker-nodejs-study

Angular (SSR) + Docker + その他もろもろの学習用リポジトリ。

## 技術要素

- Angular SSR
- PrimeNG / PrimeIcons
- i18n / XLIFF / Babel Edit
- Dockerfile / Dev Container 対応
- GitHub Actions

## 開発環境セットアップ

### 構成

- **WSL2 + Docker Engine (Native)**
  - Windows上でDocker Desktopを経由せず、WSL2 (Ubuntu) 内に直接Docker Engineを構築します。
    - Windows/Linux間のファイルシステムをまたぐアクセスが発生しないため、インストールやビルド時のパフォーマンスが向上します。
    - Docker Desktop不要のため、ライセンス数を気にせずに必要なだけ環境を構築できます。
    - 本番のLinuxサーバー環境に近い環境で開発・検証を行うことができます。
- **IDE: VSCode (Dev Containers)**
  - VS Codeの`Dev Containers`拡張機能を使用することで、Dockerを意識することなくシームレスな開発環境の起動が可能です。
  - 開発環境のアップデートが更新された`Dockerfile`をpullしてVS Codeを再起動するだけで完了します。

### 事前条件

- Windows PCの場合、WSL2が有効になっていること。Ubuntu想定。
  (https://learn.microsoft.com/ja-jp/windows/wsl/)
- Ubuntu環境でDocker Engineがインストールされていること。
  (https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
  - `setup-docker.sh`にまとめているので、よくわからない場合はこちらを使う。

### セットアップ

#### 1. リポジトリのクローン

Ubuntuホームフォルダ内の任意のフォルダに本プロジェクト用のフォルダを作成する。

以下のコマンドで本プロジェクトのGitリポジトリをクローンする。

```bash
git clone https://github.com/mitsuru2/docker-nodejs-study
```

#### 2. VS Codeへの拡張機能のインストール

クローンしてできたフォルダに移動してVS Codeを起動する。

```bash
cd docker-nodejs-study
code .
# 初回はVS Codeのインストール処理のため時間がかかります。
```

VS Codeに以下の拡張機能を追加する。

- Remote Development: Microsoftから提供されるの拡張機能のパッケージ。Docker環境での開発に必要な拡張機能が複数まとめられている。

#### 3. Dockerコンテナの起動

VS Code上で`F1`キーを押下し、コマンドパレットを開きます。 (画面中央上部)

コマンド候補の一覧から`Dev Containers: Open Folder in Container...`を選択。
(表示されない場合はコマンドパレットに`Dev Containers`と入力。)
<img src="public/images/readme/Pasted image 20260113225211.png">

デフォルトでルートフォルダが選択されるので、そのままOKボタンをクリック。
<img src="public/images/readme/Pasted image 20260113230003.png">

VS Codeが再起動してDockerコンテナ上での操作が可能となります。Node.jsやAngular等のライブラリはDockerコンテナにインストール済なので、個別にインストールする必要はありません。

#### 4. ビルド確認

以下のコマンドでプロジェクトのビルドができることを確認してください。

```bash
npm run build
```

## フォルダ構成

```text
.
├── .devcontainer/      # Dev Container 設定
├── public/             # 公開アセット (画像ファイルなど)
├── script/             # 開発補助用スクリプト
├── src/                # Angular ソースコード
│   ├── app/            # アプリケーションロジック
│   |   ├── feature/    # 特定機能用にまとめられたUIブロックコンポーネント
│   |   ├── guard/      # Angularガード。
│   |   ├── model/      # 汎用型定義。
│   |   ├── page/       # ルーター登録されるURLに対応するページコンポーネント
│   |   ├── service/    # Angularサービス。
│   |   ├── sub-module/ # UIカタログなどのサブモジュール
│   |   ├── ui/         # 汎用的なUIブロックコンポーネント
│   |   └── utility/    # 汎用関数。状態を持つようなものはサービスへ。
│   ├── locale/         # i18n 翻訳定義ファイル (XLIFF)
│   └── environments/   # 環境別設定ファイル
├── Dockerfile          # マルチステージビルド用 Dockerfile
├── angular.json        # Angular CLI コンフィグ
└── package.json        # 依存関係および実行スクリプト定義
```

## 開発サーバー起動

```bash
npm run start
# http://localhost:4200/en-GB
```

### 日本語構成で起動

```bash
npm run start-ja
# http://localhost:4200/ja
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

## i18n (Internationalization)

[README.md](./src/locale/README.md)

## Docker

`Dockerfile`を`main`ブランチにコミットすると自動的にイメージのビルドとGHCRへの登録が行われます。

ローカルでの動作確認時は以下のいずれかの方法でビルドしてください。

- WSL2環境で手動ビルド。

```bash
docker build -t docker-nodejs-study .
```

- VS CodeのDev Containers拡張機能によるビルド
  - `F1`キー押下。
  - `Dev Containers: Rebuild Container`を実行。

## スクリプト

`script/` 配下に、新規ページ/機能/サービス等の雛形生成用スクリプトがあります。

- `npm run new-page`
- `npm run new-feature`
- `npm run new-service`
- `npm run new-ui`
- `npm run new-utility`

## ライセンス

[LICENSE](./LICENSE)
