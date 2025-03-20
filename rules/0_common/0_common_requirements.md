# 共通要件

## 0_common/0_common_tech_stack.md

5. **ngrok**
   - ローカル開発環境を外部公開
   - 外部サービスからのコールバックテストに有効
   - 認証フローのテストに便利

## 5. データベース環境の切り替え

DigeClipでは開発環境と本番環境で異なるデータベースを使用しています。環境を切り替えるには以下のコマンドを使用します。

### 環境の構成

- **開発環境**: `digeclip-dev` Supabaseプロジェクト
  - 開発・テスト用のデータベース
  - テストデータを含む
  - `.env.development`ファイルで設定

- **本番環境**: `digeclip-prod` Supabaseプロジェクト
  - 本番用のデータベース
  - 実際のユーザーデータのみ
  - `.env.production`ファイルで設定

### 環境の切り替えコマンド

```bash
# 開発環境の設定を有効にする
npm run use:dev

# 開発環境のデータベースにシードデータを適用する
npm run seed:dev

# 開発環境のデータベースをPrisma Studioで確認する
npm run studio:dev
```

### 本番環境

```bash
# 本番環境の設定を有効にする
npm run use:prod

# 本番環境のデータベースにシードデータを適用する
npm run seed:prod

# 本番環境のデータベースをPrisma Studioで確認する
npm run studio:prod
```

各環境の設定は`.env.development`と`.env.production`ファイルで管理されています。

## 6. デプロイ