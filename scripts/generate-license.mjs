import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '../src');

// PRIMENG_LICENSE_KEY は .devcontainer/secrets.env 経由で環境変数として供給される。
const licenseKey = process.env['PRIMENG_LICENSE_KEY'] ?? '';
if (!licenseKey) {
  console.warn(
    '[generate-license] PRIMENG_LICENSE_KEY が未設定です。.devcontainer/secrets.env を確認してください。',
  );
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// アトミック書き込み
const outputPath = path.join(outputDir, '_license.ts');
const tmpPath = `${outputPath}.tmp`;
const fileContent = `export const primeNgLicense = ${JSON.stringify(licenseKey)};\n`;
fs.writeFileSync(tmpPath, fileContent);
fs.renameSync(tmpPath, outputPath);

console.log(`PrimeNG license saved to ${outputPath}`);
