5. **ngrok**
   - ローカル開発環境を外部公開
   - 外部サービスからのコールバックテストに有効
   - 認証フローのテストに便利

## 5. データベース環境の切り替え

DigeClipでは開発環境と本番環境で異なるSupabaseプロジェクト（データベース）を使用しており、環境ごとに独立したデータ管理を行っています。

### 環境分離の設定

1. **環境変数ファイル**：
   - `.env.development`: 開発環境の設定
   - `.env.production`: 本番環境の設定

2. **環境の切り替え**：
   次のコマンドを使って開発環境と本番環境を切り替えることができます。

```bash
# 開発環境の設定を有効にする
npm run use:dev

# 本番環境の設定を有効にする
npm run use:prod
```

3. **データベース操作**：
```bash
# 環境に応じたデータベースにシードデータを適用する
npm run seed:dev    # 開発環境用
npm run seed:prod   # 本番環境用

# Prisma Studioでデータベースを確認する
npm run studio:dev  # 開発環境用
npm run studio:prod # 本番環境用
```

### 実装の詳細

環境分離は `constants.ts` の環境検出関数と `supabase.ts` の初期化ロジックによって実現されています：

- `isDevEnvironment()`: 開発環境かどうかを判定
- `isProdEnvironment()`: 本番環境かどうかを判定
- `getSupabaseEnvironmentInfo()`: 現在の環境名を返却

Supabaseクライアントは環境に応じて適切な接続先を選択します。

### CI/CDとの連携

GitHub Actionsワークフローでは、環境に応じた秘密情報をリポジトリシークレットとして管理：

- 開発環境: `DEV_SUPABASE_URL`, `DEV_SUPABASE_ANON_KEY`
- 本番環境: `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY`

デプロイ時に適切な環境変数が自動的に設定されます。

## 6. デプロイ