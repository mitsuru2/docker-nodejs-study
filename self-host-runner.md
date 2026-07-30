# セルフホストランナー設計 (Azure Container Instances)

このリポジトリの一部の GitHub Actions ワークフローは、GitHub-hosted runner ではなく
Azure Container Instances (ACI) 上で使い捨て起動される self-hosted runner で実行される。
webhook 駆動でオンデマンドに起動し、1ジョブ実行後に自動で消える ephemeral runner 基盤。

## なぜ self-hosted runner なのか

- Bosch Development Cloud の GitHub サービスでは GitHub-hosted runner は使用できないため。
- ただし ACI はネストされたコンテナ (privileged / Docker-in-Docker) をサポートしないため、
  `docker build` 相当の処理は runner 内では行わず `az acr build` (ACR Tasks によるリモートビルド)
  に置き換えている。
- runner イメージ自体に Node.js 24 と Angular CLI 一式を焼き込むことで、
  lint/test ジョブは `npm ci && npm run lint|test` をそのまま実行できる
  (`actions/setup-node` 相当のセットアップが不要)。

## 全体構成

```
GitHub (workflow_job: queued)
      │ webhook (HMAC署名付き)
      ▼
Receiver Function (HTTPトリガー)
      │ 署名検証 / ラベル・リポジトリ・フォークPRチェック
      ▼
Storage Queue (aci-runner-jobs)
      │
      ▼
Controller Function (Queueトリガー)
      │ GitHub App installation token → runner登録トークン取得
      │ ACI コンテナグループ起動 (ephemeral runner)
      ▼
ACI コンテナグループ (gha-runner イメージ)
      │ 1ジョブ実行 → run.sh 終了 → Terminated
      ▼
Cleanup Function (Timerトリガー、5分毎)
      │ Terminated / ハング / 期限超過を検出して削除
      ▼
RunnerInstances テーブル (台帳) から追跡レコード削除
```

制御プレーン (Function App / Storage / Key Vault 等) は本リポジトリではなく、
別リポジトリ **`bicep-study/tech-portfolio-runner`** で Bicep + Azure Functions として実装・管理している。
このリポジトリ (`docker-nodejs-study`) 側が持つのは以下の2点のみ:

1. runner が実行するワークフロー定義 (`.github/workflows/*.yml`)
2. runner コンテナイメージの Dockerfile (`docker/runner/`)

## このリポジトリ側の実装

### runner イメージ (`docker/runner/`)

- `Dockerfile`: `node:24-trixie` ベース。GitHub Actions runner バイナリ (`actions-runner`)、
  Azure CLI、git/curl/jq/build-essential 等を焼き込む。
  - Azure CLI を入れているのは、ワークフロー内で `az acr build` 等を呼ぶ手順があるため。
  - `node` ユーザーに NOPASSWD sudo を許可 (一部ステップが `sudo apt-get install` 等を行う想定)。
  - `REPO_URL` / `RUNNER_TOKEN` / `RUNNER_NAME` / `RUNNER_LABELS` は Controller Function が
    ACI コンテナグループの環境変数として注入する (イメージ自体には焼き込まない)。
- `entrypoint.sh`: `--ephemeral --unattended --replace` で1回だけジョブを受け付ける runner として登録し、
  `run.sh` 実行後はプロセスが自然終了する (runner 自身が unregister する)。
  `SIGTERM`/`SIGINT` を受けた場合も `config.sh remove` を試みてから終了する
  (Cleanup Function がハング時に強制削除した際の保険)。

このイメージは **GitHub-hosted runner 上でのみビルドする**
(self-hosted runner 自身がこのイメージを使うため、鶏卵問題を避ける設計)。

### ワークフロー (`.github/workflows/`)

| ファイル                    | 役割                                                                                           |
| --------------------------- | -----------------------------------------------------------------------------------------------|
| `lint-self-hosted.yml`      | ACI runner 上で ESLint を実行し、結果を Job Summary に整形出力                                 |
| `smoke-test-aci-runner.yml` | ACI runner 基盤 (起動→登録→実行→終了→Cleanup削除) の疎通確認用。検証専用で、確認後は削除予定   |

補足:

- `lint-self-hosted.yml` / `smoke-test-aci-runner.yml` は `runs-on: [self-hosted, aci-runner]` で
  Controller Function が起動する runner のラベル (`RUNNER_LABEL=aci-runner`) を指定している。
- **運用上の注意**: self-hosted runner を使うワークフローに `pull_request` トリガーを追加しないこと。
  フォーク PR 由来のジョブは Receiver Function 側でも拒否する多層防御を実装しているが、
  第一の防御線はワークフロー側のトリガー設計 (push / workflow_dispatch のみに限定) である。

## 制御プレーン (`bicep-study/tech-portfolio-runner`)

別リポジトリで管理。リソースグループは `rg-tech-portfolio-runner`
(アプリ本体のインフラである `tech-portfolio` / `rg-tech-portfolio` とは分離)。

### Azure リソース (`bicep/main.bicep`)

- **Log Analytics Workspace + Application Insights**: ACI はコンテナグループ削除後にログが失われるため、
  診断ログの外部集約先として使用。Function App の実行ログもここに集約。
- **Storage Account**: Function App のバッキングストレージを兼ねる。
  - Queue `aci-runner-jobs`: Receiver → Controller のジョブメタデータ受け渡し。
  - Table `RunnerInstances`: 起動した ACI コンテナグループの追跡台帳。
  - `AzureWebJobsStorage` はアカウントキーを使わずマネージドID接続。
- **Key Vault**: GitHub App 秘密鍵・webhook secret・Log Analytics 共有キーを格納
  (`enableRbacAuthorization: true`, ソフトデリート/パージ保護あり)。
  オーナー(人間)には Key Vault Secrets Officer ロールを付与しシークレット管理を可能にする。
- **ユーザー割り当てマネージドID (`aciPullIdentity`)**: ACI コンテナグループに紐付け、
  ACR (`tech-portfolio` 側、別リソースグループ) からのイメージ pull に使用。
  `AcrPull` ロール割り当てはリソースグループを跨ぐため `deploy.sh` から CLI で別途付与。
- **Function App** (Linux, Node 22, 消費プラン `Y1`, システム割り当てマネージドID):
  Receiver / Controller / Cleanup の3関数をホスト。

### IAM ロール割り当て (Function App のシステム割り当てID向け)

| ロール                         | スコープ             | 用途                                                                    |
| ------------------------------ | -------------------- | ----------------------------------------------------------------------- |
| Key Vault Secrets User         | Key Vault            | シークレット読み取り                                                    |
| Storage Blob Data Owner        | Storage Account      | `AzureWebJobsStorage` のマネージドID接続に必要                          |
| Storage Queue Data Contributor | Storage Account      | Receiver の enqueue / Controller の dequeue                             |
| Storage Table Data Contributor | Storage Account      | Controller/Cleanup の `RunnerInstances` 読み書き                        |
| Container Instance Contributor | リソースグループ全体 | Controller の ACI 作成 / Cleanup の削除                                 |
| Managed Identity Operator      | `aciPullIdentity`    | ACI コンテナグループに `aciPullIdentity` を紐付ける (assign) ために必要 |

### Azure Functions (`functions/src/functions/`, Node.js v4 programming model)

#### `receiver.js` — HTTP トリガー (`POST /api/webhook`, `authLevel: anonymous`)

GitHub App からの webhook を受信する唯一の入口。以下を順にチェックし、
1つでも該当しなければ処理を打ち切る (多層防御):

1. `x-hub-signature-256` を Key Vault の `github-app-webhook-secret` で HMAC-SHA256 検証
   (`crypto.timingSafeEqual` でタイミング攻撃対策)。
2. イベント種別が `workflow_job` であること。
3. `action` が `queued` であること。
4. ジョブのラベルに `RUNNER_LABEL` (既定 `aci-runner`) が含まれること。
5. リポジトリが `GITHUB_REPO_FULL_NAME` と一致すること (不一致は 403)。
6. `workflow_job.pull_requests[].head.repo.id` が本体リポジトリと異なる
   (= フォーク PR 由来) ジョブは 403 で拒否。

通過したジョブは `{ jobId, runId, repoFullName, workflowName, labels }` を
Storage Queue `aci-runner-jobs` へ enqueue する (202 応答)。

#### `controller.js` — Queue トリガー (`aci-runner-jobs`)

1. GitHub App の installation token を取得し (`githubApp.js`)、
   リポジトリの runner 登録トークンを発行させる (個人 PAT は使わない)。
2. `aciRunner.js` の `createRunnerContainerGroup()` で ACI コンテナグループを作成:
   - コンテナ名: `ghr-<jobId>-<4文字ランダム>`
   - イメージ: `<ACR_LOGIN_SERVER>/<RUNNER_IMAGE_REPOSITORY>:<RUNNER_IMAGE_TAG>`
     (`docker/runner/build.sh` でのビルドのたびに `RUNNER_IMAGE_TAG` app setting を
     最新タグへ更新する運用を想定。既定は `latest`)
   - リソースプロファイル: ワークフロー名が
     `Manual Release Build` / `Publish Docker Image (develop)` の場合のみ 2vCPU/4GiB (heavy)、
     それ以外は既定 1vCPU/2GiB
   - `identity`: `aciPullIdentity` (UserAssigned) を紐付け、`imageRegistryCredentials` も
     同IDでACRへ認証 (ACRの管理者パスワード等は使わない)
   - 環境変数として `REPO_URL` / `RUNNER_TOKEN` (secureValue) / `RUNNER_NAME` /
     `RUNNER_LABELS` / `RUNNER_WORKDIR` を注入
   - `diagnostics.logAnalytics` で Log Analytics へ診断ログ送信
   - `tags`: `managed-by=gha-runner-controller` など (Cleanup / 追跡用の識別に使用)
   - `restartPolicy: Never` (ephemeral runner なので再起動不要)
3. `RunnerInstances` テーブルに `state: 'Creating'` で追跡レコードを作成。

#### `cleanup.js` — Timer トリガー (5分毎、`0 */5 * * * *`)

`managed-by=gha-runner-controller` タグを持つ ACI コンテナグループを列挙し、以下の条件で削除:

- 状態が `Terminated` または `Failed` → 通常削除
- 作成から **3時間** (`ABSOLUTE_TIMEOUT_MS`) 経過 → 状態を問わず強制削除 (安全弁)
- 状態が `Running` のまま **45分** (`HANG_TIMEOUT_MS`) 経過 → ハングとみなし強制削除

削除のたびに `RunnerInstances` テーブルの対応レコードも削除する。
削除せず残っているコンテナグループが 5件を超えたら警告ログを出す
(`CONCURRENT_WARNING_THRESHOLD`、異常な同時実行数の検知)。

### GitHub App

- 名前: `docker-nodejs-study-aci-runner` (App ID: `4374525`, Installation ID: `148492753`)
- 権限: Administration (Read and write) / Actions (Read-only) / Metadata (Read-only)
- 購読イベント: `workflow_job` のみ
- Webhook URL: `https://<function-app-name>.azurewebsites.net/api/webhook`
- 秘密鍵・webhook secret は Key Vault にのみ保管 (`github-app-private-key`,
  `github-app-webhook-secret`)。手動でのデプロイ後設定が必要 (`az keyvault secret set`)。

## ライフサイクル (E2E)

1. `push` イベント等で `runs-on: [self-hosted, aci-runner]` のジョブが `queued` になる。
2. GitHub App が webhook (`workflow_job`, `action: queued`) を Receiver へ送信。
3. Receiver が署名検証・フィルタリング後、Queue へメッセージを積む。
4. Controller がメッセージを取り出し、runner 登録トークンを取得して ACI コンテナグループを起動。
5. コンテナ内の `entrypoint.sh` が ephemeral runner として GitHub に登録し、ジョブを1件実行。
6. ジョブ完了後 `run.sh` が自然終了 → runner が自己 unregister → コンテナグループが `Terminated` に遷移。
7. Cleanup (Timer, 5分毎) が `Terminated` を検出し、コンテナグループと台帳レコードを削除。
8. 正常終了しなかった場合も、45分ハング検知 / 3時間絶対上限のいずれかで最終的に削除される。

## 補足: リポジトリ設定 (Settings > Actions > Runners) に runner が見当たらない理由

このリポジトリの Settings > Actions > Runners を見ても、常設の self-hosted runner は登録されていない。
これは設定漏れではなく、**runner を事前登録せず、ジョブが `queued` になるたびに動的に登録・実行・自己削除する**
設計だからである。

- `runs-on: [self-hosted, aci-runner]` は「`self-hosted` かつ `aci-runner` ラベルを持つ、
  現在オンラインな runner を待つ」という指定であり、事前に runner が存在している必要はない。
  ジョブは queued になった時点から runner が登録されるまでの数秒〜数十秒、
  「Waiting for a runner」として待機する。
- 登録は `controller.js` が GitHub App の installation token を使って
  `POST /repos/{owner}/{repo}/actions/runners/registration-token` を都度発行し、
  そのトークンを ACI コンテナグループの環境変数 `RUNNER_TOKEN` として渡すことで行われる
  (個人 PAT や恒常的な runner 登録は使わない)。
- コンテナ内では `entrypoint.sh` が `config.sh --ephemeral --unattended` で
  その場だけ runner として自己登録し (`entrypoint.sh:23-31`)、1ジョブ実行後に `run.sh` が終了すると
  runner 自身が unregister する。
- そのため Runners 一覧に runner が現れるのは、ジョブ実行中のごく短い間だけであり、
  平常時は「登録された runner なし」に見えるのが正常な状態である。

## 関連ファイル

- 本リポジトリ:
  - `.github/workflows/lint-self-hosted.yml`
  - `.github/workflows/smoke-test-aci-runner.yml`
  - `docker/runner/Dockerfile`
  - `docker/runner/entrypoint.sh`
  - `docker/runner/build.sh`
- 制御プレーン (別リポジトリ `bicep-study/tech-portfolio-runner`):
  - `bicep/main.bicep`
  - `functions/src/functions/receiver.js` / `controller.js` / `cleanup.js`
  - `functions/src/lib/aciRunner.js` / `githubApp.js` / `runnerTable.js` / `keyVaultSecrets.js`
  - `README.md` (デプロイ手順・運用上の注意)
