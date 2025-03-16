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
/src
  ├─ /app                          # Next.jsのApp Routerディレクトリ
  │   ├─ /page.tsx                 # ダッシュボード画面
  │   ├─ /sources/                 # ソース一覧
  │   ├─ /contents/                # コンテンツ一覧・詳細
  │   ├─ /settings/                # 各種設定画面
  │   └─ /api                      # APIルートディレクトリ
  │       ├─ /auth/                # 認証関連API
  │       ├─ /admin/               # 管理者用API
  │       └─ /user/                # 一般ユーザー用API
  │
  ├─ /components                   # 再利用可能なコンポーネント
  │   ├─ /ui                       # 基本UIコンポーネント
  │   ├─ /layout                   # レイアウト関連コンポーネント
  │   ├─ /features                 # 機能別コンポーネント
  │   └─ /patterns                 # 再利用可能なパターン
  │
  ├─ /hooks                        # カスタムフック
  │   ├─ /api                      # API関連フック
  │   └─ /ui                       # UI関連フック
  │
  ├─ /lib                          # ユーティリティと共通関数
  │   ├─ /api                      # API関連ユーティリティ
  │   ├─ /db                       # データベース関連
  │   ├─ /services                 # ビジネスロジック
  │   └─ /utils                    # 汎用ユーティリティ
  │
  ├─ /types                        # 型定義
  │   ├─ /api                      # API関連の型
  │   └─ /models                   # モデル関連の型
  │
  ├─ /context                      # Reactコンテキスト
  └─ /config                       # 設定ファイル
```

### コーディング規約

- **ファイル名**: パスカルケース（例: `MyComponent.tsx`）
- **変数/関数**: キャメルケース（例: `fetchData`）
- **定数**: 大文字スネークケース（例: `API_BASE_URL`）
- **コンポーネント**: 関数コンポーネントとTypeScriptの型定義を使用

## デプロイ

Vercelを使用して簡単にデプロイできます：

```bash
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
