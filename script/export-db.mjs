import { CosmosClient } from '@azure/cosmos';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Azure Cosmos DB
// 環境変数はサーバーで設定。ローカルではdocker-compose.ymlで指定。
const endpoint = process.env['COSMOS_ENDPOINT'];
const key = process.env['COSMOS_KEY'];
const dbName = process.env['COSMOS_DB'];
if (!endpoint || !key || !dbName) {
  throw new Error(
    'Environment variables for Cosmos DB is not found. Please check server configuration or docker-compose.yml.',
  );
}
const db = new CosmosClient({ endpoint, key }).database(dbName);
const targetItems = [{ container: 'articles', pk: 'front-end' }];

// 出力フォルダのパス作成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../public/data');

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

// ファイル保存処理
function saveJson(outputPath, data) {
  try {
    // 保存先のディレクトリ作成
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // ファイル保存
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`JSON saved to ${outputPath}`);
  } catch (error) {
    console.error('Error saving JSON:', error);
  }
}

// メイン処理
for (const item of targetItems) {
  const { container, pk } = item;
  const data = await getData(container, pk);

  if (data) {
    const filePath = path.join(outputDir, `${container}-${pk}.json`);
    saveJson(filePath, data);
  } else {
    console.warn(`Data fetch failed for container: ${container}, pk: ${pk}`);
  }
}
