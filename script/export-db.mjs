import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Azure Cosmos DB
// 環境変数はサーバーで設定。ローカルではdocker-compose.ymlで指定。
const endpoint = process.env['COSMOS_ENDPOINT'];
const dbName = process.env['COSMOS_DB'];
const key = process.env['COSMOS_KEY']; // ローカルエミュレータ使用時専用。

// 環境変数チェック
if (!endpoint || !dbName) {
  throw new Error('Required environment variables "COSMOS_ENDPOINT" or "COSMOS_DB" are missing.');
}

// DBクライアントインスタンス作成
// COSMOS_KEYが設定されていればそれを使用。デフォルト(設定なし)はOIDCのログイン情報を使用。
let client;
if (key) {
  client = new CosmosClient({ endpoint, key });
} else {
  client = new CosmosClient({ endpoint, credential: new DefaultAzureCredential() });
}
const db = client.database(dbName);
const targetItems = [
  { container: 'articles', pk: 'career' },
  { container: 'articles', pk: 'ci' },
  { container: 'articles', pk: 'diag' },
  { container: 'articles', pk: 'front-end' },
  { container: 'articles', pk: 'system-design' },
  { container: 'articles', pk: 'user-req' },
];

// 出力フォルダのパス作成
// EXPORT_OUTPUT_DIR 環境変数で上書き可能。未設定時は ../public/data をデフォルトとする。
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = process.env['EXPORT_OUTPUT_DIR'] ?? path.join(__dirname, '../public/data');

// フェッチ処理
async function getData(containerName, partitionKey) {
  // コンテナ取得
  const container = db.container(containerName);

  // データ取得。コンテナ内の全公開データを取得。
  // 実データ (resources) のみ抜き出し。
  try {
    const { resources } = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.pk = @pk AND c.isPublished = true',
        parameters: [{ name: '@pk', value: partitionKey }],
      })
      .fetchAll();

    return resources;
  } catch (error) {
    console.error('Cosmos DB Error:', error);
    return null;
  }
}

// ファイル保存処理（アトミック書き込み: 一時ファイルに書いてからリネーム）
function saveJson(outputPath, data) {
  // 保存先のディレクトリ作成
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 一時ファイルに書き込んでからリネームすることで、
  // 書き込み途中の不完全なファイルが残らないようにする。
  const tmpPath = `${outputPath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, outputPath);
  console.log(`JSON saved to ${outputPath}`);
}

// メイン処理
let hasError = false;
for (const item of targetItems) {
  const { container, pk } = item;
  const data = await getData(container, pk);

  if (data) {
    const filePath = path.join(outputDir, `${container}-${pk}.json`);
    saveJson(filePath, data);
  } else {
    console.warn(`Data fetch failed for container: ${container}, pk: ${pk}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}
