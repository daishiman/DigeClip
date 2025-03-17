# バックエンド技術スタック

> **注意:** このドキュメントでは、バックエンド固有の技術スタックと実装方針を定義します。共通技術スタックについては [../../0_common/1_Common_Technology_Stack.md](../../0_common/1_Common_Technology_Stack.md) を参照してください。共通要件（エラーハンドリング、セキュリティ、パフォーマンスなど）については [../../0_common/2_Common_Requirements.md](../../0_common/2_Common_Requirements.md) を参照してください。バックエンド固有の共通要件については [1_Common_Requirements.md](1_Common_Requirements.md) を参照してください。ディレクトリ構造については [../../0_common/3_Directory_Structure.md](../../0_common/3_Directory_Structure.md) を参照してください。コーディング規約については [../../0_common/4_Coding_Conventions.md](../../0_common/4_Coding_Conventions.md) を参照してください。

## 1. バックエンド固有の技術選定

### サーバーフレームワーク

1. **Next.js API Routes / App Router API**
   - フロントエンドと同じリポジトリで管理可能
   - TypeScriptとの相性が良い
   - Vercelでのデプロイが容易
   - サーバーレス関数として実行

2. **Express.js**（必要に応じて）
   - 軽量で柔軟なNode.jsフレームワーク
   - 豊富なミドルウェア
   - ルーティング機能
   - エラーハンドリング

---

### データベース

1. **Supabase**
   - PostgreSQLベースのBaaS（Backend as a Service）
   - 認証機能内蔵
   - リアルタイム機能
   - RESTおよびGraphQL API
   - 無料枠あり

2. **Prisma ORM**
   - TypeScriptファーストのORM
   - 型安全なデータベースアクセス
   - マイグレーション管理
   - データモデリングが簡単

---

### 認証

1. **NextAuth.js / Auth.js**
   - 複数の認証プロバイダーをサポート
   - セッション管理
   - JWTサポート
   - Next.jsとの統合が容易

2. **Supabase Auth**
   - メール/パスワード認証
   - ソーシャルログイン
   - MFA（多要素認証）
   - RLS（Row Level Security）

---

### API開発

1. **tRPC**（オプション）
   - エンドツーエンドの型安全なAPI
   - クライアント-サーバー間の型共有
   - 自動補完サポート
   - Next.jsとの統合が容易

2. **OpenAPI / Swagger**
   - API仕様の標準化
   - ドキュメント自動生成
   - クライアントコード生成
   - API検証

---

### ファイルストレージ

1. **Supabase Storage**
   - オブジェクトストレージ
   - アクセス制御
   - 画像変換
   - CDN配信

2. **Vercel Blob**
   - 簡単な統合
   - CDN配信
   - 無料枠あり

---

### バックエンドテスト

1. **Jest**
   - ユニットテスト
   - モック機能
   - カバレッジレポート
   - スナップショットテスト

2. **Supertest**
   - APIエンドポイントテスト
   - HTTPリクエスト/レスポンステスト
   - 統合テスト