# Cloudflare Pages 設定ガイド

このドキュメントでは、DigeClipプロジェクトをCloudflare Pagesにデプロイするための設定手順を説明します。

## Cloudflare Pagesのダッシュボード設定

### 基本設定

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)にログイン
2. 「Pages」セクションに移動
3. 「Create a project」または対象のプロジェクトを選択
4. 「Settings」→「Build & deployments」に移動
5. 以下の設定を行う:

### ビルド設定

| 設定項目               | 値                           |
| ---------------------- | ---------------------------- |
| Framework preset       | Next.js (Static HTML Export) |
| Build command          | npm run build:cf             |
| Build output directory | out                          |
| Root directory         | /                            |
| Node.js version        | 20                           |

### 環境変数

以下の環境変数を設定します。本番環境とプレビュー環境で別々に設定できます。

#### 本番環境用変数 (Production)

```
NEXT_PUBLIC_SUPABASE_URL=<本番URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<本番キー>
SUPABASE_SERVICE_ROLE_KEY=<本番サービスキー>
NEXT_PUBLIC_API_URL=<本番API URL>
OPENAI_API_KEY=<本番OpenAIキー>
NODE_ENV=production
NEXT_PUBLIC_IS_CLOUDFLARE_PAGES=true
```

#### プレビュー環境用変数 (Preview)

```
NEXT_PUBLIC_SUPABASE_URL=<開発URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<開発キー>
SUPABASE_SERVICE_ROLE_KEY=<開発サービスキー>
NEXT_PUBLIC_API_URL=<開発API URL>
OPENAI_API_KEY=<開発OpenAIキー>
NODE_ENV=development
NEXT_PUBLIC_IS_CLOUDFLARE_PAGES=true
```

## GitHub Actionsとの統合

このプロジェクトでは、GitHub Actionsを使用してビルドを行い、その結果をCloudflare Pagesにデプロイする設定を行っています。これにより、ビルドプロセスの安定性と一貫性を確保しています。

### 主な設定ファイル

1. **wrangler.toml**: Cloudflare Pagesの詳細設定
2. **package.json**: `build:cf`スクリプトの定義
3. **.github/workflows/preview-deploy.yml**: ビルドとデプロイのワークフロー
4. **public/\_redirects**: SPAルーティング用の設定

## トラブルシューティング

### ビルドエラーが発生する場合

1. 環境変数が正しく設定されているか確認
2. `next.config.js`の`env`セクションのデフォルト値を確認
3. 静的生成時に問題があるページが適切に除外されているか確認

### デプロイはできるがビルドに失敗する場合

Cloudflare Pagesでは、特定のページのビルドに失敗してもデプロイ自体は成功することがあります。この場合、以下の対処法を試してください：

1. `wrangler.toml`の設定を見直す
2. `next.config.js`の静的生成の設定を見直す
3. `npm run build:cf`コマンドが正しく実行されているか確認

## 補足情報

詳細なCloudflare Pagesの設定やトラブルシューティングについては、以下の公式ドキュメントを参照してください：

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
