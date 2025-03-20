import fs from 'fs';
import path from 'path';

/**
 * DigeClip環境切り替えスクリプト
 *
 * 使用方法:
 * - npm run use:dev - 開発環境に切り替え
 * - npm run use:prod - 本番環境に切り替え
 */

// 引数からモード（dev/prod）を取得
const mode = process.argv[2];
if (!mode || (mode !== 'dev' && mode !== 'prod')) {
  console.error('使用法: node environment-switch.js [dev|prod]');
  process.exit(1);
}

// 環境ファイルのパス
const rootDir = path.resolve(__dirname, '..');
const envFile = path.join(rootDir, '.env');
const envDevFile = path.join(rootDir, '.env.development');
const envProdFile = path.join(rootDir, '.env.production');

// 環境に応じたソースファイルを決定
const sourceFile = mode === 'dev' ? envDevFile : envProdFile;

// ソースファイルの存在確認
if (!fs.existsSync(sourceFile)) {
  console.error(`エラー: ファイル ${sourceFile} が見つかりません。`);
  console.warn('環境ファイルを作成してください：');
  console.warn(
    mode === 'dev'
      ? '- .env.development - 開発環境用の設定'
      : '- .env.production - 本番環境用の設定'
  );
  process.exit(1);
}

try {
  // 環境ファイルをコピー
  fs.copyFileSync(sourceFile, envFile);

  // 環境情報を表示
  const envName = mode === 'dev' ? '開発環境 (development)' : '本番環境 (production)';
  console.warn(`✅ 環境を切り替えました: ${envName}`);

  // 接続先情報を表示
  try {
    const envContent = fs.readFileSync(sourceFile, 'utf8');
    const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1];

    if (supabaseUrl) {
      console.warn(`🔌 Supabase接続先: ${supabaseUrl.split('.')[0]}...`);
    }
  } catch {
    // 表示のみなのでエラーは無視
  }

  console.warn('');
  console.warn('📝 使用可能なコマンド:');
  console.warn('- npm run dev     : 開発サーバーを起動');
  console.warn('- npm run db:push : データベースにスキーマを反映');
  console.warn('- npm run db:seed : シード処理を実行');
} catch (err) {
  console.error('環境の切り替え中にエラーが発生しました:', err);
  process.exit(1);
}
