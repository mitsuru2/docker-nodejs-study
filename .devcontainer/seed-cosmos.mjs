import { CosmosClient } from '@azure/cosmos';
import { randomUUID } from 'crypto';

// 証明書エラーを無視する設定（開発時のみ）
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// DBアクセスクライアント作成。環境変数はdocker-component.ymlで設定。
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

// 対象DBおよびコンテナ
const databaseId = process.env.COSMOS_DB;
const containerId = 'articles';

async function runSeeder() {
  console.log('Starting Cosmos DB seeding...');

  // エミュレータの準備ができるまでリトライ（最大10回）
  let retryCount = 0;
  while (retryCount < 10) {
    try {
      const { database } = await client.databases.createIfNotExists({ id: databaseId });
      const { container } = await database.containers.createIfNotExists({
        id: containerId,
        partitionKey: '/category',
      });

      const items = [
        {
          id: randomUUID(),
          category: 'front-end',
          title: {
            ja: 'Angularを軸とした、高度なUI/UXとモダンな開発の実現',
            en: 'Delivering advanced UI/UX and modern development by Angular.',
          },
          contents: [
            {
              ja: 'Angularリードエンジニアとして3年以上の実務経験。画面作成だけでなく、フロントエンド全体の設計から環境構築までお任せいただけます。',
              en: 'Over 3 years of experience as an Angular Lead Engineer. Beyond UI development, you can entrust me with everything from frontend architecture design to environment setup.',
            },
            {
              ja: 'アプリのユースケースや特性に応じてSSR/SSG対応やTauriによるデスクトップアプリケーション化も対応可能です。',
              en: 'Capable of implementing SSR/SSG or desktop apps using Tauri, depending on the use cases and characteristics of the application.',
            },
          ],
        },
        {
          id: randomUUID(),
          category: 'front-end',
          subTitle: { ja: 'PrimeNGのデザイントークンを用いた一貫性のあるUI開発' },
          contents: [
            {
              ja: 'PrimeNGのアーキテクチャに基づき、デザイントークンを活用した柔軟で保守性の高いスタイリングを実装。CSS変数の制御により、テーマのカスタマイズや共通のカラーパレット・タイポグラフィの効率的な一元管理が可能です。',
            },
            {
              ja: 'GUIライブラリによる開発スピードの最大化を図りつつ、独自のデザインシステムやブランドアイデンティティとの完璧な両立を実現します。',
            },
          ],
        },
        {
          id: randomUUID(),
          category: 'front-end',
          subTitle: { ja: 'UXを向上させるリッチなカスタムUIの実装' },
          contents: [
            {
              ja: '標準ライブラリでは補えない細かな意匠やインタラクションを、CSSアニメーションを用いて実現します。グラデーション等の視覚効果を効果的に取り入れ、ユーザーの目を引くモダンで洗練されたフロントエンド開発を得意としています。',
            },
          ],
        },
        {
          id: randomUUID(),
          category: 'front-end',
          subTitle: { ja: 'プログラミング言語/フレームワーク' },
          contents: [
            {
              ja: 'Angular, PrimeNG, HTML, CSS/SCSS, TypeScript, JavaScript, ApexCharts, Tuari, Azure, Node.js',
            },
          ],
        },
      ];

      for (const item of items) {
        await container.items.upsert(item);
        console.log(`✅ Upserted item: ${item.id}`);
      }

      console.log('✨ Seeding completed successfully!');
      return;
    } catch (error) {
      retryCount++;
      console.log(`⚠️ Waiting for Emulator... (Attempt ${retryCount}/10)`);
      // 5秒待機
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.error('❌ Failed to connect to Cosmos DB Emulator.');
  process.exit(1);
}

runSeeder();
