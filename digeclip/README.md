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

- **Next.js**: Reactベースのフルスタックフレームワーク
- **TypeScript**: 型安全なJavaScript
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
- **Supabase**: PostgreSQLデータベース（無料枠）、認証（メール・Googleアカウント）
- **Cloudflare Pages**: ホスティングとEdge Functions
- **ngrok**: ローカル開発環境の外部公開

## 始め方

### 必要条件

- Node.js 18.18.0以上
- npm 8.19.3以上
- ngrok（認証コールバックテスト用）

### インストール

```bash
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

## 開発ガイド

### ディレクトリ構造

```
/digeclip
  ├─ /public              # 静的ファイル
  │   ├─ /images          # 画像ファイル
  │   ├─ /fonts           # フォントファイル
  │   └─ /locales         # 多言語化ファイル
  │
  ├─ /src                # ソースコード
  │   ├─ /app              # Appルーター
  │   │   ├─ /api          # APIルート
  │   │   ├─ /(routes)     # ページルート
  │   │   └─ layout.tsx    # ルートレイアウト
  │   │
  │   ├─ /components       # コンポーネント
  │   │   ├─ /ui           # UIコンポーネント
  │   │   ├─ /layout       # レイアウトコンポーネント
  │   │   └─ /features     # 機能コンポーネント
  │   │
  │   ├─ /hooks            # カスタムフック
  │   │   ├─ useAuth.ts
  │   │   └─ ...
  │   │
  │   ├─ /lib              # ユーティリティ
  │   │   ├─ /services     # サービス
  │   │   ├─ /utils        # ユーティリティ関数
  │   │   └─ /config       # 設定ファイル
  │   │
  │   ├─ /contexts         # Reactコンテキスト
  │   │   ├─ AuthContext.tsx
  │   │   └─ ...
  │   │
  │   ├─ /types            # 型定義
  │   │   ├─ auth.ts
  │   │   └─ ...
  │   │
  │   ├─ /styles           # スタイル
  │   │   ├─ globals.css
  │   │   └─ ...
  │   │
  │   └─ /__tests__        # テスト
  │       ├─ /unit         # 単体テスト
  │       ├─ /integration  # 統合テスト
  │       └─ /e2e          # E2Eテスト
  │
  ├─ .env.local           # 環境変数
  ├─ .eslintrc.js         # ESLint設定
  ├─ next.config.js       # Next.js設定
  ├─ package.json         # パッケージ設定
  ├─ tsconfig.json        # TypeScript設定
  └─ README.md            # README
```

### コーディング規約

- **ファイル名**: パスカルケース（例: `MyComponent.tsx`）
- **変数/関数**: キャメルケース（例: `fetchData`）
- **定数**: 大文字スネークケース（例: `API_BASE_URL`）
- **コンポーネント**: 関数コンポーネントとTypeScriptの型定義を使用

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

- **pre-commit**: コミット前にlint-stagedを実行して、変更されたファイルのみをチェックします
- **pre-push**: プッシュ前にすべてのテスト、リント、型チェックを実行します

Gitフックはhuskyを使用して設定されており、自動的に利用できます。

## ブランチ戦略とデプロイフロー

プロジェクトでは以下のブランチ戦略を採用しています：

- **development**: 開発環境用のデフォルトブランチ
- **production**: 本番環境用のブランチ
- **feature/\***、**fix/\***: 各機能開発、バグ修正用のブランチ

### デプロイプロセス

1. **開発サイクル**:

   - `feature/*` や `fix/*` ブランチで機能開発
   - `development` ブランチにPRを作成
   - コードレビュー後、`development` にマージ
   - 自動的に開発環境にデプロイ

2. **リリースプロセス**:

   - `development` から `production` へのPR作成（毎週月曜日に自動作成、または手動で作成可）
   - QAと最終チェック
   - `production` へマージで本番環境に自動デプロイ

3. **ホットフィックス**:
   - 緊急修正が必要な場合は `hotfix/*` ブランチを使用
   - 修正後、`development` と `production` 両方にマージ

### ローカル開発とngrok

認証機能やWebhookのテストなど、ローカル環境を外部から接続する必要がある場合：

```bash
# 開発サーバーを起動
npm run dev

# 別のターミナルでngrokを実行
../scripts/start-ngrok.sh
```

表示されるngrokのURLを使用して外部サービス（Supabase、OAuth、Webhook）などのコールバックURLに設定できます。

## CI/CD (GitHub Actions)

GitHub Actionsにより、以下のワークフローが自動化されています：

- **PR検証**: PR作成時にLint、型チェック、テストを実行
- **プレビューデプロイ**: PR作成時にプレビュー環境にデプロイ（URLがPRにコメントされます）
- **開発環境デプロイ**: `development` へのマージで開発環境に自動デプロイ
- **本番環境デプロイ**: `production` へのマージで本番環境に自動デプロイ
- **リリースPR作成**: 毎週月曜日に開発→本番へのリリースPRを自動作成

詳細なワークフロー設定は、リポジトリのルートディレクトリにある `.github/workflows` フォルダをご確認ください。

## デプロイ環境

- **開発環境**: `dev-digeclip.pages.dev`（`development` ブランチ）
- **本番環境**: `digeclip.com`（`production` ブランチ）
- **プレビュー環境**: PR毎に自動生成（PR内にURLが表示されます）

## 学習リソース

Next.jsについて詳しく学ぶには、以下のリソースを参照してください：

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能とAPI
- [Next.js チュートリアル](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs) - Tailwind CSSの使い方
- [Shadcn UI ドキュメント](https://ui.shadcn.com) - Shadcn UIコンポーネントの使い方
- [React Hook Form ドキュメント](https://react-hook-form.com) - フォーム管理の方法
- [Zustand ドキュメント](https://github.com/pmndrs/zustand) - 状態管理の方法
- [React Query ドキュメント](https://tanstack.com/query/latest) - データフェッチングの方法
- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/) - Cloudflare Pagesの使い方
- [Supabase ドキュメント](https://supabase.com/docs) - Supabaseの使い方

## テスト

DigeClipでは、Jest と React Testing Library を使用してテストを実装しています。

### テストの実行

テストを実行するには、以下のコマンドを使用します：

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- path/to/test/file.test.ts

# ウォッチモードでテストを実行（ファイル変更時に自動的に再実行）
npm test -- --watch

# カバレッジレポートを生成
npm test -- --coverage
```

### テスト設定

テストの設定は以下のファイルで管理されています：

- `jest.config.js`: Jestの基本設定
- `jest.setup.js`: テスト実行前の共通セットアップ
- `.babelrc`: Babel設定（JSX変換など）

### テストファイルの構造

テストファイルは、テスト対象のファイルと同じディレクトリ内の `__tests__` フォルダに配置されています。

```
digeclip/src/
  lib/
    api/
      __tests__/
        client.test.ts
        auth.test.ts
        hooks.test.tsx
      client.ts
      auth.ts
      hooks.ts
```

### テストカバレッジ

テストカバレッジレポートは `npm test -- --coverage` コマンドで生成できます。レポートは `coverage/` ディレクトリに保存され、ブラウザで `coverage/lcov-report/index.html` を開くことで確認できます。

カバレッジ目標：

- APIクライアント: 90%以上
- サービスレイヤー: 80%以上
- React Queryフック: 80%以上
- UIコンポーネント: 70%以上
