# DigeClip 環境設定ガイド

DigeClipは開発環境と本番環境を明確に分離しています。このドキュメントでは、環境設定の方法と各環境の違いについて説明します。

## 環境の概要

DigeClipには以下の2つの環境があります：

1. **開発環境** (`development`)

   - 用途: 開発、テスト、機能検証
   - Supabaseプロジェクト: `digeclip-dev`
   - デプロイURL: https://digeclip-dev.pages.dev/

2. **本番環境** (`production`)
   - 用途: 実際のユーザー向けサービス提供
   - Supabaseプロジェクト: `digeclip-prod`
   - デプロイURL: https://digeclip.pages.dev/

## 初期設定手順

### 1. Supabaseプロジェクトの設定

各環境用に別々のSupabaseプロジェクトを作成します：

- **開発環境用**: `digeclip-dev`
- **本番環境用**: `digeclip-prod`

各プロジェクトから以下の情報を取得してください：

- プロジェクトURL (`https://[project-id].supabase.co`)
- APIキー (anon keyとservice_role key)
- データベース接続文字列

### 2. 環境ファイルの設定

以下の2つの環境ファイルを作成します：

#### `.env.development` (開発環境用)

```
# 開発環境設定
NEXT_PUBLIC_SUPABASE_URL=https://[開発環境のプロジェクトID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[開発環境のAnonymous Key]
SUPABASE_SERVICE_ROLE_KEY=[開発環境のService Role Key]
DATABASE_URL=[開発環境のデータベース接続文字列]
NODE_ENV=development
```

#### `.env.production` (本番環境用)

```
# 本番環境設定
NEXT_PUBLIC_SUPABASE_URL=https://[本番環境のプロジェクトID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[本番環境のAnonymous Key]
SUPABASE_SERVICE_ROLE_KEY=[本番環境のService Role Key]
DATABASE_URL=[本番環境のデータベース接続文字列]
NODE_ENV=production
```

### 3. 環境の切り替え

環境を切り替えるには以下のコマンドを使用します：

```bash
# 開発環境に切り替え
npm run use:dev

# 本番環境に切り替え
npm run use:prod
```

これらのコマンドは、適切な環境ファイルの内容を `.env` ファイルにコピーします。

## データベース操作

### スキーマの同期

```bash
# .envファイルに設定した環境のデータベースにスキーマを反映
npm run db:push
```

### シードデータの適用

環境に応じたシードデータを適用できます：

```bash
# 開発環境用シードデータの適用
npm run seed:dev

# 本番環境用シードデータの適用
npm run seed:prod
```

## 注意事項

1. **環境ファイルの取り扱い**

   - `.env*` ファイルはGitに含めないでください。
   - 機密情報を含むため、安全に管理してください。

2. **本番環境の操作**

   - 本番環境への変更は慎重に行ってください。
   - 可能な限り、開発環境でテストしてから本番環境に適用してください。

3. **データのバックアップ**
   - 定期的にデータのバックアップを行うことをお勧めします。
   - Supabaseのバックアップ機能を活用してください。

## トラブルシューティング

### 環境変数が反映されない

- アプリケーションを再起動して、環境変数の変更を反映させてください。
- `.env` ファイルが正しく作成されているか確認してください。

### Supabaseへの接続エラー

- APIキーとプロジェクトURLが正しいか確認してください。
- ネットワーク接続を確認してください。
- Supabaseプロジェクトのステータスを確認してください。

### マイグレーションエラー

- マイグレーションの順番が正しいか確認してください。
- 開発環境と本番環境のスキーマの差異を確認してください。
