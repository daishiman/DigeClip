# シードデータの使用方法

このディレクトリには開発環境で使用するシードデータが含まれています。

## 開発環境用シードデータ（dev_seed.sql）

開発用のテストデータをデータベースに投入するためのSQLスクリプトです。
以下の手順で適用してください：

### Supabaseローカル環境での適用方法

1. Supabaseのダッシュボードにログイン
2. 「SQL Editor」を開く
3. `dev_seed.sql`の内容をコピー＆ペースト
4. 「RUN」ボタンをクリックしてSQL文を実行

### PostgreSQLコマンドラインからの適用方法

```bash
# データベースに直接接続する場合
psql -h localhost -p 5432 -d postgres -U postgres -f ./prisma/seeds/dev_seed.sql

# または.envファイルのDATABASE_URLを使用する場合
cat ./prisma/seeds/dev_seed.sql | DATABASE_URL="your_database_url" npx prisma db execute
```

## シードデータの内容

このシードデータには以下のテストデータが含まれています：

- テストユーザー（1名）
- ソース（YouTube、RSS、arXiv）
- コンテンツ（動画、記事、論文）
- AIモデル（GPT-4、Claude）
- サマリー
- タグとコンテンツタグの関連付け
- アプリ設定
- 通知

## 注意事項

- シードデータはすべて固定のUUIDを使用しているため、同じスクリプトを複数回実行すると一意性制約違反になる可能性があります
- 開発環境専用のデータのため、本番環境では使用しないでください
