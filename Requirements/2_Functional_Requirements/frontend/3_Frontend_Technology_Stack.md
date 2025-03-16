# フロントエンド技術スタック

> **注意:** このドキュメントでは、フロントエンドの技術スタックと実装方針を定義します。共通要件（レスポンシブデザイン、エラーハンドリング、アクセシビリティなど）については [0_Common_Requirements.md](./0_Common_Requirements.md) を参照してください。

## 1. 技術選定

### 概要

「お金をかけずに初心者が実装しやすい」方針を優先し、**無料で使えるモダンな技術スタック**を採用します。

---

### フレームワーク

1. **Next.js**
   - React ベースのフルスタックフレームワーク
   - App Router を採用（実装済み: Next.js 15.2.2）
   - Vercel でのホスティングが容易（無料枠あり）
   - TypeScript 完全サポート（実装済み）

2. **Tailwind CSS**
   - ユーティリティファーストの CSS フレームワーク
   - カスタマイズが容易（実装済み: Tailwind CSS 4.x）
   - 学習コストが低い
   - ダークモード対応が簡単（next-themes で実装準備済み）

3. **UI コンポーネント**
   - shadcn/ui（実装済み）
     - コピー＆ペーストで使えるコンポーネント集
     - Tailwind CSS ベース
     - 商用利用無料
     - 導入済みコンポーネント: Button, Card, Dialog, Form, Input, Label, Select, Sonner, Table
   - 補助ライブラリ（実装済み）
     - **UIプリミティブ**
       - @radix-ui/react-*: アクセシビリティ重視の低レベルUIコンポーネント（ダイアログ、セレクト、ラベルなど）
       - @headlessui/react: アクセシビリティに配慮したヘッドレスUIコンポーネント（ドロップダウン、モーダルなど）
     - **アイコン**
       - lucide-react: 美しいオープンソースアイコンライブラリ
       - @heroicons/react: Tailwind Labsが提供する高品質アイコンセット
     - **スタイリングユーティリティ**
       - class-variance-authority: コンポーネントバリエーション管理（条件付きクラス定義）
       - clsx: クラス名結合ユーティリティ（条件付きクラス名の生成）
       - tailwind-merge: Tailwindクラスの競合を解決し最適化
       - tailwindcss-animate: Tailwind CSSでのアニメーション定義

---

### 状態管理

1. **React Context + useReducer**
   - 小〜中規模アプリに最適
   - 追加ライブラリ不要
   - 学習コストが低い
   - 今後実装予定

2. **Zustand**（実装済み）
   - シンプルで軽量な状態管理ライブラリ
   - Redux より学習コストが低い
   - TypeScript との相性が良い
   - イミュータブルな状態更新と型安全性

3. **React Query / SWR**（実装済み: @tanstack/react-query）
   - データフェッチングと状態管理
   - キャッシュ機能
   - 再取得、エラーハンドリングが簡単
   - 今後のデータフェッチングロジックで活用予定

---

### API 通信

1. **fetch API / axios**（実装済み: axios）
   - 標準的な HTTP クライアント
   - 簡単に使える
   - インターセプターでエラーハンドリング
   - リクエスト/レスポンス変換機能

2. **Next.js API Routes**
   - バックエンドとの連携が容易
   - サーバーサイドの処理を同じリポジトリで管理
   - 今後実装予定

---

### フォーム管理

1. **React Hook Form**（実装済み）
   - パフォーマンスが良い
   - バリデーション機能
   - エラーハンドリングが簡単
   - Form コンポーネントと連携済み

2. **Zod**（実装済み）
   - TypeScript ファーストのバリデーションライブラリ
   - React Hook Form と組み合わせて使用（@hookform/resolvers で連携）
   - 型安全なバリデーション

---

### 認証

1. **NextAuth.js**（実装済み: next-auth）
   - 簡単に実装できる認証ライブラリ
   - 複数の認証プロバイダーをサポート
   - JWT / セッションベースの認証
   - 今後の認証機能で活用予定

### 国際化

1. **Next Intl**（実装済み: next-intl）
   - Next.js向け多言語対応ライブラリ
   - メッセージのフォーマット
   - 日付、数値、複数形のローカライズ
   - 今後の多言語対応で活用予定

### テーマ

1. **Next Themes**（実装済み: next-themes）
   - ダークモード/ライトモード切り替え機能
   - システム設定との連携
   - テーマの永続化
   - 今後のテーマ切り替え機能で活用予定

---

## 2. 開発環境

### 概要

開発効率を高めるツールを導入しつつ、初心者でも扱いやすい環境を構築します。

---

### コードエディタ

1. **Visual Studio Code**
   - 無料で高機能
   - 豊富な拡張機能
   - Git 連携が簡単
   - プロジェクト開発で使用中

2. **拡張機能**
   - ESLint: コード品質チェック（設定済み）
   - Prettier: コードフォーマット（設定済み）
   - Tailwind CSS IntelliSense: クラス補完
   - TypeScript 関連: 型チェックと補完

---

### 開発ツール

1. **ESLint**（実装済み: eslint.config.mjs）
   - コード品質の維持
   - エラーの早期発見
   - Next.js推奨設定を採用

2. **Prettier**
   - コードフォーマット
   - チーム内での一貫性確保
   - ESLintと連携

3. **TypeScript**（実装済み: tsconfig.json）
   - 型安全性
   - 自己文書化
   - エディタのサポートが充実
   - パスエイリアス設定済み（@/components など）

4. **Git / GitHub**
   - バージョン管理
   - コラボレーション
   - CI/CD 連携
   - プロジェクトで使用中

5. **Turbopack**（実装済み）
   - 高速な開発サーバー
   - 迅速なHMR（Hot Module Replacement）
   - 開発体験の向上

---

## 3. デプロイ

### 概要

無料または低コストで、デプロイが簡単なサービスを選定します。

---

### ホスティングサービス

1. **Vercel**
   - Next.js との相性が最高
   - GitHub 連携で自動デプロイ
   - 無料枠が十分
   - プレビュー環境の自動生成

2. **Netlify**（代替）
   - 同様に使いやすい
   - フォーム機能などの追加機能

3. **GitHub Pages**（最小構成の場合）
   - 完全無料
   - 静的サイト向け

---

## 4. コーディング規約

### 概要

「お金をかけずに初心者が実装しやすい」方針を優先し、厳密すぎるルールは設定しません。最低限の Lint/Formatter を導入し、**ディレクトリ構造もシンプル**にします。

---

### Lint / Formatter

1. **ESLint**
   - Next.js プロジェクト作成時に自動設定されることが多い
   - "extends: next/core-web-vitals" などを採用
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
  │   ├─ /db                       # データベース関連
  │   │   ├─ client.ts             # Supabase接続
  │   │   └─ /repositories         # リポジトリクラス
  │   │       ├─ sourceRepository.ts
  │   │       ├─ contentRepository.ts
  │   │       └─ ...
  │   ├─ /services                 # ビジネスロジック
  │   │   ├─ /content              # コンテンツ関連サービス
  │   │   ├─ /source               # ソース関連サービス
  │   │   ├─ /ai                   # AI関連サービス
  │   │   └─ /notification         # 通知関連サービス
  │   ├─ /utils                    # 汎用ユーティリティ
  │   └─ /middleware               # ミドルウェア
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
