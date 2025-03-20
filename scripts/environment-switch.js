/**
 * 環境切り替えスクリプト
 * 使用方法:
 * - 開発環境: node scripts/environment-switch.js dev
 * - 本番環境: node scripts/environment-switch.js prod
 */

const fs = require('fs');
const path = require('path');

// コマンドライン引数から環境を取得
const env = process.argv[2];

// 有効な環境かチェック
if (!['dev', 'prod'].includes(env)) {
  console.error('エラー: 有効な環境を指定してください (dev または prod)');
  process.exit(1);
}

// 環境ファイルのマッピング
const envFileMap = {
  dev: '.env.development',
  prod: '.env.production'
};

// プロジェクトのルートディレクトリパスを取得
const rootDir = path.resolve(__dirname, '..');
const digeclipDir = path.join(rootDir, 'digeclip');

// ソースファイルはdigeclipディレクトリ内のもの
const sourceFile = path.join(digeclipDir, envFileMap[env]);
const targetRootFile = path.join(rootDir, '.env.local');
const targetDigeclipFile = path.join(digeclipDir, '.env.local');

try {
  // 環境ファイルが存在するか確認
  if (!fs.existsSync(sourceFile)) {
    console.error(`エラー: 環境ファイル ${sourceFile} が見つかりません`);
    process.exit(1);
  }

  // ファイルをコピー
  fs.copyFileSync(sourceFile, targetDigeclipFile);
  console.log(`${sourceFile} を ${targetDigeclipFile} にコピーしました`);

  // ルートディレクトリにもコピー
  fs.copyFileSync(sourceFile, targetRootFile);
  console.log(`${sourceFile} を ${targetRootFile} にもコピーしました`);

  // 環境名を表示
  const envName = env === 'dev' ? '開発環境 (DigeClip-dev)' : '本番環境 (DigeClip)';
  console.log(`環境を「${envName}」に切り替えました`);

  // Cloudflare Pagesのプロジェクト名を表示
  console.log('Cloudflare Pagesプロジェクト: digeclip');
  console.log(`環境設定: ${env === 'dev' ? 'development' : 'production'}`);
} catch (error) {
  console.error('エラー:', error.message);
  process.exit(1);
}