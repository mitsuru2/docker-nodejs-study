import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 出力フォルダのパス作成
// EXPORT_OUTPUT_DIR 環境変数で上書き可能。未設定時は ../public/data をデフォルトとする。
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = process.env['EXPORT_OUTPUT_DIR'] ?? path.join(__dirname, '../public/data');

// Git 情報の取得
function getGitSha() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return process.env['GITHUB_SHA'] ?? 'unknown';
  }
}

function getGitTag() {
  // GITHUB_REF が refs/tags/... の場合はタグ名を返す
  const ref = process.env['GITHUB_REF'] ?? '';
  if (ref.startsWith('refs/tags/')) {
    return ref.replace('refs/tags/', '');
  }
  try {
    const tag = execSync('git describe --tags --exact-match HEAD 2>/dev/null', {
      encoding: 'utf8',
    }).trim();
    return tag || null;
  } catch {
    return null;
  }
}

// ビルドメタデータ生成
const metadata = {
  gitSha: getGitSha(),
  gitTag: getGitTag(),
  exportedAt: new Date().toISOString(),
};

// 出力ディレクトリ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// アトミック書き込み
const outputPath = path.join(outputDir, '_build.json');
const tmpPath = `${outputPath}.tmp`;
fs.writeFileSync(tmpPath, JSON.stringify(metadata, null, 2));
fs.renameSync(tmpPath, outputPath);

console.log(`Build metadata saved to ${outputPath}`);
console.log(JSON.stringify(metadata, null, 2));
