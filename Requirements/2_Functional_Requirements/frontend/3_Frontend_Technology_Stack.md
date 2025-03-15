# フロントエンド技術スタック

## 1. フレームワーク選定

### 概要

フロントエンド開発で使用する主要フレームワークを決定します。**お金をかけずに、経験の浅いエンジニアでも短期間で構築**できるよう、学習コストが低くコミュニティが大きい技術を優先します。

---

### 採用フレームワーク

- **Next.js (React)**
  - React をベースとしつつ、**SSR (サーバーサイドレンダリング)** や **静的サイト生成**に対応
  - Vercel との相性が良く、無料枠で簡単にデプロイ可能
  - 大きなコミュニティがあり、情報も豊富

*（Vue や Angular の採用も検討可能ですが、Vercel や Supabase との一体的な運用を考慮すると Next.js が最適と判断）*

---

### 採用理由

1. **学習コスト**: React ベースのため、初心者にも比較的導入しやすい
2. **Vercel との統合**: デプロイがワンクリックで可能。無料枠で小規模運用に適する
3. **SSR と静的生成**: SEO 的にもある程度恩恵を受けつつ、スピードも確保
4. **コミュニティの充実度**: エラーや不明点の解決情報が豊富

---

## 2. ライブラリ / ツール

### 概要

Next.js 以外に、UI/状態管理/テスト/HTTPクライアントなどのライブラリを選定します。**無料プランやローカル構成**で運用でき、初心者が使いやすいものを基本とします。

---

### 主なライブラリ

1. **Tailwind CSS**
   - シンプルなユーティリティクラスベースの CSS フレームワーク
   - デザインの自由度と実装速度が高く、学習コストも低い

2. **状態管理**:
   - **React Hooks (useState/useReducer)** や **Context API** をまず使用
   - 大規模になれば Redux や Recoil 等を検討 (将来拡張)

3. **HTTPクライアント**:
   - **fetch** (ブラウザ標準) か **Axios**
   - ライブラリを使うなら Axios が人気だが、**初心者には fetch でも十分**

4. **テスト**:
   - 最小限で済ませるなら **Jest + React Testing Library**
   - E2E テストは**Cypress** を検討 (将来拡張)

---

### その他ツール

- **ESLint / Prettier**
  - コード整形・文法チェック
  - 学習コストが低く、無料

- **GitHub Actions** (オプション)
  - CI/CD を簡単に構築
  - 無料枠があるためコストなし

---

## 3. ビルド / デプロイ方法

### 概要

**Next.js** は標準でビルドツール（Webpack or Turbopack）を内包し、**Vercel** との連携を前提にします。**環境別設定**(.env)を用い、無料枠で動かすシンプルな構成を想定。

---

### ビルドツール

1. **Next.js 内蔵の Webpack / Turbopack**
   - 特別なカスタムが不要なら標準設定でOK
   - カスタムが必要な場合は next.config.js で拡張

2. **将来拡張**
   - Babel での高度なトランスパイル設定やカスタム webpack 設定
   - サイズ最適化などは必要に応じて後から追加

---

### デプロイ先

- **Vercel**
  - GitHubと連携しプッシュ → 自動デプロイ
  - 無料プランあり、SSL やドメイン設定も手軽
  - “Environment Variables” 機能で.env を管理

*（S3 + CloudFront を使った静的サイト運用も可能だが、Next.js の SSR 機能を活用するなら Vercel が最適）*

---

### 環境別設定 (.envファイルなど)

- **.env.local**: ローカル開発用
- **.env.production**: 本番用
- Vercel の “Environment Variables” 画面に登録し、ビルド時に注入する
- **APIキーやWebhook URL** は必ずここで管理し、Git レポジトリに含めない

---

## 4. コーディング規約

### 概要

「お金をかけずに初心者が実装しやすい」方針を優先し、厳密すぎるルールは設定しません。最低限の Lint/Formatter を導入し、**ディレクトリ構造もシンプル**にします。

---

### Lint / Formatter

1. **ESLint**
   - Next.js プロジェクト作成時に自動設定されることが多い
   - “extends: next/core-web-vitals” などを採用
2. **Prettier**
   - コードフォーマット統一
   - コミット時に自動整形 (husky + lint-staged など追加可)

---

### ディレクトリ構造

```
/src
  ├─ /app                          # Next.jsのApp Routerディレクトリ
  │   ├─ /page.tsx                 # ダッシュボード画面
  │   ├─ /sources/page.tsx         # ソース一覧
  │   ├─ /contents/page.tsx        # コンテンツ一覧
  │   ├─ /contents/[id]/page.tsx   # コンテンツ詳細
  │   ├─ /settings/
  │   │   ├─ /ai-models/page.tsx   # AIモデル設定
  │   │   ├─ /notifications/page.tsx # 通知設定
  │   │   └─ /...
  │   └─ /api                      # APIルートディレクトリ
  │       ├─ /auth/                # 認証関連API
  │       │   ├─ /login/route.ts
  │       │   ├─ /register/route.ts
  │       │   └─ /...
  │       ├─ /admin/               # 管理者用API
  │       │   ├─ /sources/route.ts
  │       │   ├─ /contents/route.ts
  │       │   └─ /...
  │       └─ /user/                # 一般ユーザー用API
  │           ├─ /contents/route.ts
  │           └─ /...
  │
  ├─ /components                   # 再利用可能なコンポーネント
  │   ├─ /ui                       # 基本UIコンポーネント
  │   │   ├─ /Button               # ボタンコンポーネント
  │   │   │   ├─ Button.tsx        # 基本ボタン
  │   │   │   ├─ IconButton.tsx    # アイコン付きボタン
  │   │   │   ├─ ButtonGroup.tsx   # ボタングループ
  │   │   │   └─ index.ts          # エクスポート
  │   │   ├─ /Card                 # カードコンポーネント
  │   │   │   ├─ Card.tsx          # 基本カード
  │   │   │   ├─ CardHeader.tsx    # カードヘッダー
  │   │   │   ├─ CardContent.tsx   # カードコンテンツ
  │   │   │   ├─ CardFooter.tsx    # カードフッター
  │   │   │   └─ index.ts          # エクスポート
  │   │   └─ /...
  │   │
  │   ├─ /layout                   # レイアウト関連コンポーネント
  │   │   ├─ /Header               # ヘッダーコンポーネント
  │   │   │   ├─ Header.tsx        # 基本ヘッダー
  │   │   │   ├─ HeaderNav.tsx     # ヘッダーナビゲーション
  │   │   │   └─ index.ts          # エクスポート
  │   │   └─ /...
  │   │
  │   ├─ /features                 # 機能別コンポーネント
  │   │   ├─ /sources              # ソース関連コンポーネント
  │   │   │   ├─ SourceList.tsx    # ソース一覧
  │   │   │   ├─ SourceCard.tsx    # ソースカード
  │   │   │   ├─ SourceForm.tsx    # ソース追加/編集フォーム
  │   │   │   └─ index.ts          # エクスポート
  │   │   └─ /...
  │   │
  │   └─ /patterns                 # 再利用可能なパターン
  │       ├─ /DataTable            # データテーブルパターン
  │       │   ├─ DataTable.tsx     # 基本テーブル
  │       │   ├─ TableHeader.tsx   # テーブルヘッダー
  │       │   └─ index.ts          # エクスポート
  │       └─ /...
  │
  ├─ /hooks                        # カスタムフック
  │   ├─ /api                      # API関連フック
  │   │   ├─ /admin                # 管理者API用フック
  │   │   │   ├─ useSources.ts     # ソース管理フック
  │   │   │   ├─ useContents.ts    # コンテンツ管理フック
  │   │   │   └─ ...
  │   │   ├─ /user                 # ユーザーAPI用フック
  │   │   │   ├─ useContents.ts    # コンテンツ取得フック
  │   │   │   └─ ...
  │   │   └─ /auth                 # 認証API用フック
  │   │       ├─ useAuth.ts        # 認証フック
  │   │       └─ ...
  │   └─ /ui                       # UI関連フック
  │       ├─ useModal.ts           # モーダル制御フック
  │       └─ ...
  │
  ├─ /lib                          # ユーティリティと共通関数
  │   ├─ /api                      # API関連ユーティリティ
  │   │   ├─ client.ts             # APIクライアント
  │   │   ├─ endpoints.ts          # APIエンドポイント定義
  │   │   └─ /handlers             # API処理ハンドラー
  │   │       ├─ /admin            # 管理者API処理
  │   │       │   ├─ sources.ts    # ソース関連処理
  │   │       │   └─ ...
  │   │       ├─ /user             # ユーザーAPI処理
  │   │       │   ├─ contents.ts   # コンテンツ関連処理
  │   │       │   └─ ...
  │   │       └─ /auth             # 認証API処理
  │   │           ├─ auth.ts       # 認証処理
  │   │           └─ ...
  │   ├─ /db.ts                    # Supabase接続
  │   └─ /utils                    # 汎用ユーティリティ
  │       ├─ date.ts               # 日付操作関数
  │       └─ ...
  │
  ├─ /types                        # 型定義
  │   ├─ /api                      # API関連の型
  │   │   ├─ /admin                # 管理者API型
  │   │   │   ├─ sources.ts        # ソース関連型
  │   │   │   ├─ contents.ts       # コンテンツ関連型
  │   │   │   └─ ...
  │   │   ├─ /user                 # ユーザーAPI型
  │   │   │   ├─ contents.ts       # コンテンツ関連型
  │   │   │   └─ ...
  │   │   └─ /auth                 # 認証API型
  │   │       ├─ auth.ts           # 認証関連型
  │   │       └─ ...
  │   └─ /models                   # モデル関連の型
  │       ├─ source.ts             # ソースモデル
  │       ├─ content.ts            # コンテンツモデル
  │       └─ ...
  │
  ├─ /services                     # ビジネスロジック
  │   ├─ /summarize                # 要約関連ロジック
  │   │   ├─ index.ts              # エクスポート
  │   │   ├─ processor.ts          # 要約処理
  │   │   └─ ...
  │   └─ /notification             # 通知関連ロジック
  │       ├─ index.ts              # エクスポート
  │       ├─ discord.ts            # Discord通知
  │       └─ ...
  │
  ├─ /context                      # Reactコンテキスト
  │   ├─ AuthContext.tsx           # 認証コンテキスト
  │   └─ ...
  │
  └─ /config                       # 設定ファイル
      ├─ constants.ts              # 定数定義
      ├─ routes.ts                 # ルート定義
      └─ ...
```
(*Next.js の最新推奨構成に従いつつ、初心者でも迷いにくいフォルダ数に留める*)

---

### 命名規則

- **ファイル名**: キャメルケース or パスカルケース (例: `MyComponent.jsx`)
- **変数/関数**: lowerCamelCase で統一 (例: `fetchData`)
- **定数**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
- **CSSクラス名**: Tailwind ユーティリティを使うため、命名は最小限

---

### まとめ

以上のフロントエンド技術スタック設計により、**Next.js + Tailwind** を中心に、**無料かつ初心者に優しい**構成で短期間開発が可能になります。
**Vercel** でデプロイすれば、**GitHub 連携→プッシュ→自動ビルド** という手軽なワークフローを実現でき、追加コストや手間を最小限に抑えられます。

