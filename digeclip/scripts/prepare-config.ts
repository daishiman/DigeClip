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

    // ファイルを読み込む
    const configContent = fs.readFileSync(tsConfigPath, 'utf8');

    // 正しいJavaScriptに変換
    let jsConfigContent = configContent
      // インポート文を削除
      .replace(/import\s+.*?from\s+['"]next['"];?/g, '')
      // その他のインポート文も削除
      .replace(/import\s+.*?;/g, '')
      // 型定義を削除
      .replace(/:[\s]*NextConfig/g, '')
      // export defaultをmodule.exports =に変換
      .replace(/export\s+default/, 'module.exports =');

    // 不要な空行を削除
    jsConfigContent = jsConfigContent.replace(/^\s*[\r\n]/gm, '');

    // 内容をチェック
    if (!jsConfigContent.includes('module.exports =')) {
      console.error('警告: module.exports が見つかりません。手動で構文を修正します');

      // 強制的に正しい形式に修正
      const configMatch = configContent.match(
        /const\s+nextConfig(?:\s*:\s*NextConfig)?\s*=\s*({[\s\S]*?});/
      );
      if (configMatch && configMatch[1]) {
        jsConfigContent = `/** @type {import('next').NextConfig} */\nmodule.exports = ${configMatch[1]};\n`;
      } else {
        console.error('エラー: 設定オブジェクトを抽出できませんでした');
        process.exit(1);
      }
    }

    // JavaScript設定ファイルに書き出す
    fs.writeFileSync(path.join(rootDir, 'next.config.js'), jsConfigContent);
    console.log('next.config.js が正常に生成されました');
    console.log('内容:');
    console.log(jsConfigContent);
  } catch (error) {
    console.error('設定ファイルの変換中にエラーが発生しました:', error);
    process.exit(1);
  }
}

main();
