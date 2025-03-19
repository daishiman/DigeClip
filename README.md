# DigeClip

## プロジェクト概要

DigeClipは、YouTubeチャンネルや外部コンテンツ（論文、ブログなど）の新着情報を自動的に収集し、複数のAIモデル（OpenAI、Claude、Geminiなど）を用いて要約を生成し、Discordに通知するとともに、アプリ上でも閲覧できるシステムです。

### 目的

- 複数の情報源から重要な内容を短時間で把握する
- 情報収集に費やす時間を50%以上削減する
- 長い動画や記事を効率的に要約して共有する

## 主な機能

- **YouTubeチャンネル監視**: 新規動画を定期検知し、字幕/サムネを取得
- **外部コンテンツ収集**: ブログや論文などのRSSフィードから新着情報を取得
- **AI要約生成**: 複数のAIモデルを使用して、コンテンツの要約を生成
- **Discord通知**: サムネイル付きの要約をDiscordに自動通知
- **コンテンツ管理**: 収集したコンテンツをタグ付けして管理・検索

## 技術スタック

### フロントエンド
- **Next.js 14**: Reactベースのフルスタックフレームワーク（App Router採用）
- **TypeScript 5.x**: 型安全なJavaScript
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **Shadcn UI**: Tailwind CSSベースのコンポーネントライブラリ
- **React Hook Form**: フォーム管理
- **Zod**: バリデーション
- **Zustand**: 状態管理
- **React Query**: データフェッチング
- **Next Auth**: 認証
- **Next Intl**: 国際化

### バックエンド
- **Next.js API Routes**: サーバーサイド機能
- **Supabase**: PostgreSQLデータベース（無料枠）、認証（メール・Google）
- **Cloudflare Pages**: ホスティングとEdge Functions
- **ngrok**: ローカル開発環境の外部公開

## 始め方

### 必要条件
- Node.js 18.18.0以上
- npm 8.19.3以上
- ngrok（認証コールバックテスト用）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/digeclip.git
cd digeclip

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

### 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
# 認証
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# AI API Keys (必要に応じて)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 開発環境と本番環境のデータベース分離

DigeClipでは、開発環境と本番環境でSupabaseのデータベース（プロジェクト）を完全に分離しています。

#### 環境別Supabaseプロジェクト

- **開発環境**: `digeclip-dev` プロジェクト
  - 開発・テスト用のデータベース
  - `dev`ブランチと連携
  - テストデータを含む

- **本番環境**: `digeclip-prod` プロジェクト
  - 本番用のデータベース
  - `main`ブランチと連携
  - 実際のユーザーデータのみ

#### 環境別設定ファイル

- **開発環境**: `.env.development.local`
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://[dev-project-id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[dev-anon-key]
  SUPABASE_SERVICE_ROLE_KEY=[dev-service-role-key]
  ```

- **本番環境**: `.env.production`
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://[prod-project-id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[prod-anon-key]
  SUPABASE_SERVICE_ROLE_KEY=[prod-service-role-key]
  ```

Cloudflare Pagesでも、開発環境（`dev`ブランチ）と本番環境（`main`ブランチ）それぞれに適切なSupabase接続情報を環境変数として設定しています。

## データベースマイグレーション

DigeClipではPrismaを使用してデータベースマイグレーションを管理しています。

### マイグレーション手順

#### 開発環境のマイグレーション

1. **スキーマの変更**:
   `prisma/schema.prisma` ファイルを編集して必要な変更を加えます。

2. **マイグレーションの作成と適用**:
   ```bash
   # 開発環境の設定を使用
   cp .env.development .env

   # マイグレーションを作成
   npx prisma migrate dev --name <マイグレーション名>
   ```

   このコマンドは以下の処理を実行します:
   - マイグレーションファイルの生成
   - ローカルデータベースへの適用
   - Prisma Clientの更新

3. **開発環境Supabaseへの適用**:
   ```bash
   # 開発環境にマイグレーションを適用
   npx prisma migrate deploy
   ```

#### 本番環境のマイグレーション

1. **本番環境の設定を使用**:
   ```bash
   cp .env.production .env
   ```

2. **本番環境にマイグレーションを適用**:
   ```bash
   # 事前にバックアップを取得することを強く推奨します
   npx prisma migrate deploy
   ```

### 注意事項

- 本番環境へのマイグレーション前に必ずバックアップを取得してください
- 破壊的変更がある場合は、アプリケーションをメンテナンスモードにすることを検討してください
- `prisma db push`コマンドは開発環境での一時的な変更のみに使用し、本番環境では使用しないでください
- マイグレーションは順番に適用する必要があります。開発環境で検証してから本番環境に適用してください

## 開発ガイド

### ディレクトリ構造

```
/
├─ /rules                 # 設計・仕様ドキュメント
│   ├─ /0_common          # 共通仕様
│   ├─ /1_business        # ビジネス要件
│   ├─ /2_backend         # バックエンド仕様
│   └─ /3_frontend        # フロントエンド仕様
│
├─ /digeclip              # メインアプリケーション
│   ├─ /public            # 静的ファイル
│   ├─ /src               # ソースコード
│   ├─ package.json       # 依存関係
│   └─ next.config.js     # Next.js設定
│
├─ /docs                  # 追加ドキュメント
│   ├─ /api               # API仕様書
│   ├─ /architecture      # アーキテクチャ図
│   └─ /guides            # 開発ガイド
│
├─ /.github               # GitHub設定
│   ├─ /workflows         # GitHub Actionsワークフロー
│   └─ SETUP.md           # 環境セットアップガイド
│
├─ /scripts               # ユーティリティスクリプト
│   └─ start-ngrok.sh     # ngrok起動スクリプト
│
├─ docker-compose.yml     # Docker設定
├─ package.json           # ルート依存関係
└─ README.md              # このファイル
```

### コーディング規約

- **ファイル名**: パスカルケース（例: `MyComponent.tsx`）
- **変数/関数**: キャメルケース（例: `fetchData`）
- **定数**: 大文字スネークケース（例: `API_BASE_URL`）
- **コンポーネント**: 関数コンポーネントとTypeScriptの型定義を使用

詳細なコーディング規約は `.cursor/rules/000_common_requirements.mdc` ファイルに定義されています。

## MDCファイルの生成

プロジェクトでは、Cursor AIアシスタントのためのルールファイル（.mdcファイル）を使用しています。これらのファイルは、`rules/` ディレクトリ内のMarkdownファイルから自動生成されます。

### MDCファイルの生成手順

```bash
# MDCファイルを生成
npm run build:mdc
```

このコマンドは以下の処理を行います：
1. `.cursor/rules/` ディレクトリ内の既存のMDCファイルをクリア
2. `rules/` ディレクトリ内のMarkdownファイルを読み込み
3. カテゴリごとにMDCファイルを生成
4. `.cursor/available_instructions.txt` ファイルを生成

生成されるMDCファイル：
- `000_common_requirements.mdc`: 共通要件
- `001_business_requirements.mdc`: ビジネス要件
- `002_backend_requirements.mdc`: バックエンド機能要件
- `003_frontend_requirements.mdc`: フロントエンド機能要件
- `004_nonFunctional_requirements.mdc`: 非機能要件
- `005_development_process.mdc`: 開発プロセス
- `006_risk_and_release_plan.mdc`: リスクとリリース計画

## テスト実行

プロジェクトでは、Jest、React Testing Library、Cypressを使用してテストを実施しています。

### テスト実行手順

```bash
# 単体テストと統合テストを実行
npm run test

# テストをウォッチモードで実行（開発時に便利）
npm run test:watch

# テストカバレッジレポートを生成
npm run test:coverage

# E2Eテストを実行
npm run test:e2e

# すべてのテストを実行
npm run test:all
```

### テスト戦略

プロジェクトでは以下のテストレベルを採用しています：

1. **単体テスト**: 個々の関数、メソッド、コンポーネントをテスト
2. **統合テスト**: 複数のモジュール間の連携をテスト
3. **E2Eテスト**: アプリケーション全体のフローをテスト

詳細なテスト戦略は `.cursor/rules/000_common_requirements.mdc` ファイルに定義されています。

## ブランチ戦略とデプロイフロー

プロジェクトでは以下のブランチ戦略を採用しています：

- **main**: 本番環境用のブランチ
- **dev**: 開発環境用のデフォルトブランチ
- **feature/\***、**fix/\***: 各機能開発、バグ修正用のブランチ

### デプロイプロセス

1. **開発サイクル**:
   - `feature/*` や `fix/*` ブランチで機能開発
   - `dev` ブランチにPRを作成
   - コードレビュー後、`dev` にマージ
   - 自動的に開発環境にデプロイ

2. **リリースプロセス**:
   - `dev` から `main` へのPR作成（毎週月曜日に自動作成、または手動で作成可）
   - QAと最終チェック
   - `main` へマージで本番環境に自動デプロイ

3. **ホットフィックス**:
   - 緊急修正が必要な場合は `hotfix/*` ブランチを使用
   - 修正後、`dev` と `main` 両方にマージ

### デプロイ環境

- **開発環境**: `dev-digeclip.pages.dev`（`dev` ブランチ）
- **本番環境**: `digeclip.com`（`main` ブランチ）
- **プレビュー環境**: PR毎に自動生成（PR内にURLが表示されます）

### CI/CD (GitHub Actions)

GitHub Actionsにより、以下のワークフローが自動化されています：

- **PR検証**: PR作成時にLint、型チェック、テストを実行
- **プレビューデプロイ**: PR作成時にプレビュー環境にデプロイ（URLがPRにコメントされます）
- **開発環境デプロイ**: `dev` へのマージで開発環境に自動デプロイ
- **本番環境デプロイ**: `main` へのマージで本番環境に自動デプロイ
- **リリースPR作成**: 毎週月曜日に開発→本番へのリリースPRを自動作成

詳細なワークフロー設定は、リポジトリのルートディレクトリにある `.github/workflows` フォルダをご確認ください。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. developmentブランチに対するプルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 連絡先

プロジェクト管理者: [your-email@example.com](mailto:your-email@example.com)

## プロジェクト構造

```
/
├─ /rules                 # 設計・仕様ドキュメント
│   ├─ /0_common          # 共通仕様
│   ├─ /1_business        # ビジネス要件
│   ├─ /2_backend         # バックエンド仕様
│   └─ /3_frontend        # フロントエンド仕様
│
├─ /digeclip              # メインアプリケーション
│   ├─ /public            # 静的ファイル
│   ├─ /src               # ソースコード
│   ├─ package.json       # 依存関係
│   └─ next.config.js     # Next.js設定
│
├─ /docs                  # 追加ドキュメント
│   ├─ /api               # API仕様書
│   ├─ /architecture      # アーキテクチャ図
│   └─ /guides            # 開発ガイド
│
├─ docker-compose.yml     # Docker設定
├─ package.json           # ルート依存関係
└─ README.md              # このファイル
```

## 機能別ディレクトリ構造

```
src/
  lib/
    api/
      auth.ts             # 認証API
      sources.ts          # ソースAPI
      contents.ts         # コンテンツAPI
```

## 開発ワークフロー

### ローカルCI実行

PRを作成する前に、ローカルでGitHubのCIと同じチェックを実行することができます。これにより、PRを作成する前に問題を修正することができます。

```bash
# すべてのチェック（lint、型チェック、テスト、フォーマット）を実行
npm run verify

# または、スクリプトを直接実行
./scripts/local-ci.sh
```

### Git フック

以下のGitフックが設定されています：

- **pre-commit**: コミット前に変更されたファイルのみをチェックします（digeclipディレクトリ内）
- **pre-push**: プッシュ前にすべてのテスト、リント、型チェックを実行します

Gitフックはhuskyを使用して設定されており、自動的に利用できます。
