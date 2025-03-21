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
# リポジトリをクローン
git clone https://github.com/yourusername/digeclip.git
cd digeclip

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## ローカル開発環境の公開

外部からローカル開発環境にアクセスするには、ngrokを使用します。

### ngrokのインストールと設定

1. ngrokをインストール:
   ```bash
   npm install -g ngrok
   ```

2. ngrokアカウントを作成し、認証トークンを取得:
   - [ngrokダッシュボード](https://dashboard.ngrok.com/signup)にサインアップ
   - 「Your Authtoken」ページで認証トークンを確認
   - トークンを設定:
   ```bash
   ngrok config add-authtoken your_auth_token_here
   ```

### ローカル環境の公開手順

1. ローカル開発サーバーを起動:
   ```bash
   npm run dev
   ```

2. 別のターミナルでngrokを起動:
   ```bash
   npm run ngrok
   ```

3. 表示されたURLを使って外部からアクセス可能
   例: `https://1a2b3c4d.ngrok.io`

4. Supabaseの認証リダイレクトURLに、表示されたngrok URLを一時的に追加：
   `https://1a2b3c4d.ngrok.io/api/auth/callback`

5. `.env.development.local`ファイルを更新:
   ```
   NEXT_PUBLIC_URL=https://1a2b3c4d.ngrok.io
   ```

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

## 開発ワークフロー

### ローカルCI実行

PRを作成する前に、ローカルでGitHubのCIと同じチェックを実行することができます。これにより、PRを作成する前に問題を修正することができます。

```bash
# すべてのチェック（lint、型チェック、テスト、フォーマット）を実行
npm run verify

# または、スクリプトを直接実行
./scripts/local-ci.sh
```

### Git Hooks

以下のGit Hooksが設定されています：

- **pre-add**: addする前に変更されたファイルに関連するテストを実行します
- **pre-commit**: コミット前に変更されたファイルのみをチェックします（digeclipディレクトリ内）
- **pre-push**: プッシュ前にすべてのテスト、リント、型チェックを実行します

この段階的な検証アプローチにより、以下のメリットがあります：
- **迅速なフィードバック**: 変更を加えるたびに即座に関連テストだけを実行
- **効率的な開発**: 全テスト実行の前に問題を早期発見
- **品質の確保**: コミット前の基本チェックとプッシュ前の完全検証

## ブランチ戦略とデプロイフロー

プロジェクトでは以下のブランチ戦略を採用しています：

- **dev**: 開発環境用のデフォルトブランチ（旧developmentブランチから移行）
- **main**: 本番環境用のブランチ（旧productionブランチから移行）
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

## CI/CD (GitHub Actions)

GitHub Actionsにより、以下のワークフローが自動化されています：

- **PR検証**: PR作成時にLint、型チェック、テストを実行
- **PR自動レビュー**: アクセシビリティチェックとビルドサイズチェックを実行し、結果をPRにコメント
- **開発環境デプロイ**: `dev` へのマージで開発環境（dev-digeclip.pages.dev）に自動デプロイ
- **本番環境デプロイ**: `main` へのマージで本番環境（digeclip.com）に自動デプロイ
- **リリースPR作成**: 毎週月曜日に開発→本番へのリリースPRを自動作成

最適化されたワークフロー設定:
- Node.js 20とnpm ciによる高速なビルド
- 依存関係のキャッシュによる実行時間短縮
- 明示的なディレクトリ構造認識
- ブランチ名に基づく自動環境設定

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

### Git Hooks

以下のGit Hooksが設定されています：

- **pre-add**: addする前に変更されたファイルに関連するテストを実行します
- **pre-commit**: コミット前に変更されたファイルのみをチェックします（digeclipディレクトリ内）
- **pre-push**: プッシュ前にすべてのテスト、リント、型チェックを実行します

この段階的な検証アプローチにより、以下のメリットがあります：
- **迅速なフィードバック**: 変更を加えるたびに即座に関連テストだけを実行
- **効率的な開発**: 全テスト実行の前に問題を早期発見
- **品質の確保**: コミット前の基本チェックとプッシュ前の完全検証

Gitフックはhuskyを使用して設定されており、自動的に利用できます。
