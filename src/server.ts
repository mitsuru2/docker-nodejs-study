import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { CosmosClient, Database } from '@azure/cosmos';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Azure Cosmos DB
// 環境変数はサーバーで設定。ローカルではdocker-compose.ymlで指定。
// ビルド実行時にインスタンス化することでビルド時の環境変数設定を不要とする。
let _db: Database | null = null;
const allowedContainerNames = ['articles'];
function getDatabase(): Database {
  if (_db) return _db;

  const endpoint = process.env['COSMOS_ENDPOINT'];
  const key = process.env['COSMOS_KEY'];
  const dbName = process.env['COSMOS_DB'];
  if (!endpoint || !key || !dbName) {
    throw new Error(
      'Environment variables for Cosmos DB is not found. Please check server configuration or docker-compose.yml.',
    );
  }

  _db = new CosmosClient({ endpoint, key }).database(dbName);
  return _db;
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Azure App Serviceのリバースプロキシへの対応
 */
app.set('trust proxy', 1);

/**
 * CosmosDBからのデータ取得
 * https://learn.microsoft.com/ja-jp/azure/developer/javascript/what-is-azure-for-javascript-development?view=azure-node-latest
 * https://learn.microsoft.com/ja-jp/cosmos-db/query/overview
 */
app.get('/db/:container/:pk', async (req, res) => {
  try {
    const { container, pk } = req.params;

    // コンテナ名チェック
    if (!allowedContainerNames.includes(container)) {
      res.status(400).json({ error: 'Invalid container name' });
      return;
    }

    // コンテナ取得
    const db = getDatabase();
    const containerEntity = db.container(container);

    // クエリ実行
    // カテゴリ一致かつisPublishedがtrueのものを取得。
    const { resources } = await containerEntity.items
      .query({
        query: 'SELECT * FROM c WHERE c.pk = @pk AND c.isPublished = true',
        parameters: [{ name: '@pk', value: pk }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Cosmos DB Error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error', message: 'Unknown error.' });
    }
  }
});

/**
 * 追加エンドポイント: ChromeのDevTools起因で発生するエラーを抑制するため。
 */
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req, {
      // Azure App Serviceからのプロキシヘッダーを信頼する
      trustProxyHeaders: true,
    })
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
