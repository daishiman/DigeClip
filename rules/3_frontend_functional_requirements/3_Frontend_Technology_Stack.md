# フロントエンド技術スタック

> **注意:** このドキュメントでは、フロントエンド固有の技術スタックと実装方針を定義します。共通技術スタックについては [../../0_common/1_Common_Technology_Stack.md](../../0_common/1_Common_Technology_Stack.md) を参照してください。共通要件（レスポンシブデザイン、エラーハンドリング、アクセシビリティなど）については [0_Common_Requirements.md](0_Common_Requirements.md) を参照してください。ディレクトリ構造については [../../0_common/3_Directory_Structure.md](../../0_common/3_Directory_Structure.md) を参照してください。コーディング規約については [../../0_common/4_Coding_Conventions.md](../../0_common/4_Coding_Conventions.md) を参照してください。

## 1. フロントエンド固有の技術選定

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

### まとめ

以上のフロントエンド技術スタック設計により、**Next.js + Tailwind** を中心に、**無料かつ初心者に優しい**構成で短期間開発が可能になります。
**Vercel** でデプロイすれば、**GitHub 連携→プッシュ→自動ビルド** という手軽なワークフローを実現でき、追加コストや手間を最小限に抑えられます。
