# 技術スタック

## 前提条件

お金をかけず、容易に経験の浅いエンジニアが実装できることを第一優先とし、将来的な機能追加・スケーラビリティにも柔軟に対応できる構成を目指します。ここでは、フロントエンド + バックエンドを同一言語(TypeScript)で統一した場合を想定しつつ、最小限の手順でローカル開発を開始し、本番環境にも無料枠でデプロイ可能な技術スタックを提案します。

## 1. 言語選定

- **TypeScript 5.x**
  - **選定理由**:
    1. **静的型付け**によりコンパイル時のエラー検出が可能で、保守性を大きく向上する
    2. **JavaScriptとの高い互換性**があり、Reactなどのフロントエンドライブラリと自然に統合できる
    3. **広範なコミュニティ**と学習資源があり、初心者でも移行・導入がスムーズ
    4. **サーバレス/クラウド環境**（Vercel Functions など）と親和性が高く、Edge Functions の実装事例も充実
  - **バージョン**: TypeScript 5.1 以降
    - 新しいコンパイラ機能とパフォーマンス最適化が充実しており、型推論の質も向上

## 2. フレームワーク

- **フロントエンド**: [Next.js 14 (React)](https://nextjs.org/docs)
  - **採用理由**:
    1. **SSR, SSG, ISR** など柔軟なレンダリング方式を公式サポートし、ベストプラクティスに沿った開発がしやすい
    2. [Vercel](https://vercel.com/) との組み合わせが非常にスムーズで、無料枠でのデプロイおよびプレビュー機能が充実
    3. TypeScript との相性が良く、公式テンプレート (`create-next-app`) で初期セットアップが簡単
    4. 大規模コミュニティがあり、学習リソースやプラグインが豊富

- **バックエンド (簡易API)**: Next.js API Routes
  - **採用理由**:
    1. 小〜中規模のプロジェクトでは、フロントエンドと同一リポジトリ/フレームワークで完結できるため、導入のハードルが低い
    2. Vercel のサーバレスFunctionsとしてそのままデプロイ可能
    3. 単純なCRUD APIであれば十分なパフォーマンスを発揮する

> **将来的に複雑なビジネスロジック**や**高負荷処理**が必要になった場合、NestJS (TypeScript) を導入し、バックエンドを別サーバに切り出す拡張プランを想定。

## 3. コア技術

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 14.x | フロントエンド＆バックエンドフレームワーク |
| TypeScript | 5.x | 型安全な開発言語 |
| Supabase | 最新 | データベース（PostgreSQL）、認証 |
| Vercel | 最新 | ホスティング、サーバレス関数 |

## 4. 主要ライブラリ / ミドルウェア

### 4.1 バックエンドライブラリ

| ライブラリ | 用途 |
|-----------|------|
| zod | スキーマバリデーション |
| @supabase/supabase-js | Supabase クライアント |
| jsonwebtoken | JWT認証 |
| date-fns | 日付操作 |
| axios | HTTP クライアント |
| cheerio | HTMLパース（コンテンツ抽出） |
| rss-parser | RSSフィード解析 |
| node-cron | クーロンジョブ（Vercel Cronと併用） |

### 4.2 ORマッパー

- **Prisma ORM**
  - **選定理由**:
    - Supabase (PostgreSQL) との連携が容易で、[Prisma Accelerate](https://www.prisma.io/blog/prisma-and-serverless-73hbgKnZ6t) によりエッジ環境でのCold Startを大幅に改善
    - スキーマ定義ファイルから**型安全なクエリクライアント**を自動生成し、TypeScriptと非常に相性が良い
    - コミュニティが活発でチュートリアルやサンプルが充実し、初心者でも導入しやすい

### 4.3 キャッシュサーバ

- **Redis (Upstash, Railway, or Render)**
  - **選定理由**:
    - 非常に高速なインメモリキャッシュを提供し、数万〜数十万リクエスト/秒にも耐えられる
    - 多くのクラウドで**無料枠**や**低料金プラン**が存在し、サーバレス運用も可能 (例: Upstash Redis)
    - キャッシュヒット率が高いページや要約結果などの再利用に最適

### 4.4 APIドキュメント生成ツール

- **Swagger / OpenAPI + Postman Collection**
  - **選定理由**:
    - Next.js API Routes の場合、公式の自動ドキュメント生成は存在しないため、**手動で OpenAPI スキーマ**を記述し、Swagger UI などを使うか、Postman Collection でエンドポイントを管理する
    - 将来的に NestJS へ移行した際は、標準の Swagger モジュールで自動ドキュメント生成が可能

### 4.5 AI/ML関連

| ライブラリ | 用途 |
|-----------|------|
| openai | OpenAI API クライアント |
| @anthropic-ai/sdk | Anthropic API クライアント |
| langchain | LLM操作フレームワーク（オプション） |

### 4.6 テスト

| ライブラリ | 用途 |
|-----------|------|
| Jest | ユニットテスト、統合テスト |
| supertest | APIテスト |
| @testing-library/react | Reactコンポーネントテスト |
| MSW (Mock Service Worker) | APIモック |

## 5. 開発 / デプロイ手順

### 5.1 ローカル環境のセットアップ

1. **リポジトリクローン & ディレクトリ移動**
   ```bash
   git clone https://github.com/your-account/your-project.git
   cd your-project
   ```

2. **依存インストール**
   ```bash
   npm install
   # or yarn install
   ```

3. **環境変数設定**
   - ルート直下に `.env.local` を作成し、以下のように記述（例）
     ```
     DATABASE_URL=postgresql://user:password@db.host.com:5432/db_name
     NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     DISCORD_WEBHOOK_URL=your-discord-webhook
     ```
   - `api_key_encrypted` 等の秘匿情報は、暗号化や別の手段（例: Vercel 秘密管理）で管理

4. **DBマイグレーション (Prisma)**
   ```bash
   npx prisma migrate dev --name init
   # DBスキーマを初期化
   ```

5. **アプリ起動 (開発モード)**
   ```bash
   npm run dev
   # localhost:3000 でフロントエンド + API が動作
   ```

6. **ブラウザ確認**
   - http://localhost:3000 でトップページへアクセス
   - http://localhost:3000/api/... でAPIテスト（例: GET /api/contents）

> **Docker環境**が必要な場合は、`docker-compose up -d` で PostgreSQL, Redis などミドルウェアを同時起動できる。VS Code Dev Containers を使えば環境差異を最小化し、誰でも同じ開発環境を再現可能。

### 5.2 本番デプロイ方法

1. **Vercelへの接続**
   - GitHub リポジトリを Vercel ダッシュボードで Import
   - Build Command: `npm run build` / Output Directory: `.next`
   - Environment Variables をダッシュボードに設定（`DATABASE_URL`, `DISCORD_WEBHOOK_URL` など）

2. **Supabase (PostgreSQL) との連携**
   - [Supabase](https://supabase.com/) プロジェクトを作成し、**Project Settings** 内の **Database** タブで接続URL を取得
   - Vercel上で `DATABASE_URL` として設定

3. **DB マイグレーション**
   - デプロイ後、Vercel の Build Logs にて `npx prisma migrate deploy` を実行して、DBスキーマを本番環境に反映
   - 必要に応じて Vercel の Deploy Hook などを用いて自動化

4. **Cron設定 (Vercel Cron Jobs)**
   - Vercel ダッシュボード → プロジェクト → Settings → Cron Jobs で **毎時**など実行間隔を指定
   - Path を `/api/cron/monitor` （例）に設定 → Cron が起動すると指定の API Route が呼ばれる
   - API 内で **YouTube RSS 取得 → 新着DB登録 → AI要約 → Discord通知** を実行

5. **ドメイン設定**
   - 独自ドメインを無料で接続可能 (Hobbyプラン)
   - DNS設定を行い、https でアクセス可能に

> **Railway や Fly.io** を使用する場合、 Dockerfile を用意し `railway up` or `fly deploy` コマンドなどでバックエンドのみをコンテナ化しデプロイできる。**フロントは Vercel、バックエンドは Railway**という構成も容易に実現可能。

## 6. コーディング規約

### 命名規則
- **ファイル名**: キャメルケース (例: `userService.ts`)
- **クラス/インターフェース**: パスカルケース (例: `UserService`)
- **関数/変数**: キャメルケース (例: `getUserById`)
- **定数**: 大文字スネークケース (例: `MAX_RETRY_COUNT`)

### コメント
- 複雑なロジックには必ずコメントを付ける
- JSDoc形式でAPI関数にはドキュメントコメントを記述

### 型定義
- 必ず型定義を行い、`any`型の使用は最小限に抑える
- 共通の型は`/types`ディレクトリに定義

## 7. まとめ

- **言語**: TypeScript (5.x), フロントエンドとバックエンドを統一
- **フレームワーク**: Next.js 14 + API Routes（簡易バックエンド）、将来 NestJS 拡張も可
- **主要ライブラリ**: Prisma（ORM）, Redisキャッシュ（Upstash or Railway）, Swagger/Postman でAPIドキュメント
- **開発手順**: `create-next-app` で雛形 → `.env.local` 設定 → `npx prisma migrate dev` → `npm run dev`
- **デプロイ**: Vercel の無料プランに GitHub 連携してCI/CD、Cron で定期実行ジョブ
- **将来的拡張**: Supabase有料プラン、複数AIモデル切替、複雑なバックエンド(NestJS化)など柔軟に追加可能

この構成なら、初心者エンジニアでも比較的容易に実装開始でき、**お金をかけずに**、**短期間(1週間程度)**で MVP リリースが可能となります。その後のスケール・機能拡張にも耐えやすいため、保守性と拡張性を兼ね備えた技術スタックと言えます。