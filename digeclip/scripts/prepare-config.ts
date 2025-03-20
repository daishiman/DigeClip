import * as fs from 'fs';
import * as path from 'path';

// next.config.tsからnext.config.jsを生成する
async function main() {
  // プロジェクトのルートディレクトリ
  const rootDir = path.resolve(__dirname, '..');

  try {
    // TypeScript設定ファイルを読み込む
    const tsConfigPath = path.join(rootDir, 'next.config.ts');
    if (!fs.existsSync(tsConfigPath)) {
      console.error('Error: next.config.ts が見つかりません');
      process.exit(1);
    }

    // ファイルを一旦JSとして読み込む（Next.jsはこれを理解できる）
    const configContent = fs.readFileSync(tsConfigPath, 'utf8');

    // モジュールシステムをCommonJSに変換してJSファイルに書き出す
    const jsConfigContent = configContent
      .replace("import type { NextConfig } from 'next';", '')
      .replace('export default', 'module.exports =');

    // JavaScript設定ファイルに書き出す
    fs.writeFileSync(path.join(rootDir, 'next.config.js'), jsConfigContent);
    console.log('next.config.js が正常に生成されました');
  } catch (error) {
    console.error('設定ファイルの変換中にエラーが発生しました:', error);
    process.exit(1);
  }
}

main();
