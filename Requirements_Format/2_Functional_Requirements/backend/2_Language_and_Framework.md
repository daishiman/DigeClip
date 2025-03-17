# 使用言語・フレームワーク

## 1. 言語選定
- TypeScript v5.0.0 以上
  - 型安全性と開発効率の向上のため
  - モダンな非同期処理と機能を活用
  - 堅牢なエラーハンドリングの実現

## 2. フレームワーク
- Next.js v14.x (App Router)
  - フルスタックフレームワークとしての機能性
  - サーバーサイドレンダリングとAPI Routes機能
  - Vercelへのデプロイ容易性
  - サーバーアクションによる安全なデータ操作

## 3. 主要ライブラリ / ミドルウェア
- Supabase (PostgreSQL + 認証 + ストレージ)
- @supabase/supabase-js v2.x (データベース連携)
- OpenAI API (AI機能実装)
- Zod v3.x (データバリデーション)
- Discord.js v14.x (通知機能)
- React Hook Form (フォーム管理)
- TailwindCSS (スタイリング)
- Shadcn/ui (UIコンポーネント)

## 4. 開発 / デプロイ手順
- ローカル環境のセットアップ:
  1. Node.js v18.x以上とnpm v9.x以上のインストール
  2. リポジトリのクローンと依存パッケージのインストール (`npm install`)
  3. .env.localファイルでの環境変数設定 (Supabase、OpenAI、Discord関連)
  4. `npm run dev`でローカル開発サーバー起動 (http://localhost:3000)
  5. `npm run lint`でコード品質チェック
- 本番デプロイ方法:
  1. Vercelとの連携によるCI/CDパイプライン
  2. 環境変数の適切な設定 (Vercelダッシュボードから)
  3. プルリクエストごとのプレビューデプロイ
  4. mainブランチへのマージで自動本番デプロイ