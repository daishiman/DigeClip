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
- **Supabase**: PostgreSQLデータベース（無料枠）
- **Vercel**: ホスティングとCronジョブ

## 始め方

### 必要条件
- Node.js 18.18.0以上
- npm 8.19.3以上

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

## デプロイ

Vercelを使用して簡単にデプロイできます：

```bash
# ビルド
npm run build

# Vercelにデプロイ
vercel
```

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

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
