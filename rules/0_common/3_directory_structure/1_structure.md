# 共通ディレクトリ構造

このドキュメントでは、プロジェクト全体で使用する標準的なディレクトリ構造を定義します。この構造に従うことで、コードの一貫性と可読性を確保し、新しいメンバーがプロジェクトに参加する際の学習コストを低減します。

## ルートディレクトリ構造

```
/
├─ /rules                 # 設計・仕様ドキュメント
│   ├─ /0_common          # 共通仕様
│   │   ├─ /1_common_requirements  # 共通要件
│   │   ├─ /2_coding_conventions   # コーディング規約
│   │   ├─ /3_directory_structure  # ディレクトリ構造
│   │   ├─ /4_test_strategy        # テスト戦略
│   │   └─ /5_development_environment # 開発環境設定
│   │
│   ├─ /1_business_requirements    # ビジネス要件
│   ├─ /2_backend_functional_requirements  # バックエンド仕様
│   ├─ /3_frontend_functional_requirements # フロントエンド仕様
│   ├─ /4_nonFunctional_requirements       # 非機能要件
│   ├─ /5_development_process              # 開発プロセス
│   └─ /6_risk_and_release_plan            # リスクとリリース計画
│
├─ /digeclip              # メインアプリケーション
│   ├─ /public            # 静的ファイル
│   │   ├─ /images        # 画像ファイル
│   │   ├─ /fonts         # フォントファイル
│   │   └─ /locales       # 多言語化ファイル
│   │
│   ├─ /src               # ソースコード
│   │   ├─ /app           # App Routerディレクトリ
│   │   ├─ /components    # コンポーネント
│   │   ├─ /hooks         # カスタムフック
│   │   ├─ /lib           # ユーティリティ
│   │   ├─ /types         # 型定義
│   │   └─ /__tests__     # テストコード
│   │
│   ├─ /seeds             # DBシードデータ
│   │   ├─ dev_schema.sql # 開発環境用スキーマ
│   │   └─ dev_seed.sql   # 開発環境用サンプルデータ
│   │
│   ├─ /docs              # ドキュメント
│   │   └─ ENV_SETUP.md   # 環境設定ガイド
│   │
│   ├─ /.husky            # Git Hooks
│   │   ├─ pre-add        # git add前のテスト実行
│   │   ├─ pre-commit     # コミット前のlint実行
│   │   └─ pre-push       # プッシュ前の完全検証
│   │
│   ├─ package.json       # 依存関係
│   ├─ next.config.js     # Next.js設定
│   ├─ tsconfig.json      # TypeScript設定
│   ├─ .env.development   # 開発環境用環境変数
│   ├─ .env.production    # 本番環境用環境変数
│   └─ README.md          # アプリケーションの説明
│
├─ /.github               # GitHub設定
│   ├─ /workflows         # GitHub Actionsワークフロー
│   │   ├─ ci.yml         # 統合CI
│   │   ├─ tests.yml      # テスト実行
│   │   ├─ lint.yml       # リント実行
│   │   ├─ deploy.yml     # Cloudflareデプロイ
│   │   ├─ preview-deploy.yml # プレビューデプロイ
│   │   ├─ pr-review.yml  # PR自動レビュー
│   │   ├─ supabase-deploy.yml # Supabaseスキーマデプロイ
│   │   └─ create-release-pr.yml # リリースPR作成
│   ├─ SETUP.md           # 環境セットアップガイド
│   ├─ labeler.yml        # 自動ラベル設定
│   └─ settings.yml       # リポジトリ設定
│
├─ /scripts               # ユーティリティスクリプト
│   ├─ start-ngrok.sh     # ngrok起動スクリプト
│   └─ local-ci.sh        # ローカルCI実行スクリプト
│
├─ /.husky                # Git Hooks設定
│   ├─ pre-add            # git add前のテスト実行
│   ├─ pre-commit         # コミット前のlint実行
│   └─ pre-push           # プッシュ前の完全検証
│
├─ /.cursor               # Cursor AI設定
│   └─ /rules             # Cursor AI用ルール
│
├─ package.json           # ルート依存関係
└─ README.md              # このファイル
```

## Next.jsプロジェクトの標準ディレクトリ構造

```
/digeclip/src
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
  ├─ /config                       # 設定ファイル
  │   ├─ constants.ts              # 定数定義
  │   ├─ routes.ts                 # ルート定義
  │   └─ ...
  │
  └─ /__tests__                    # テストコード
      ├─ /unit                     # 単体テスト
      │   ├─ /components           # コンポーネントの単体テスト
      │   │   ├─ /ui               # UIコンポーネント
      │   │   │   ├─ Button.test.tsx
      │   │   │   └─ ...
      │   │   ├─ /layout           # レイアウトコンポーネント
      │   │   └─ /features         # 機能別コンポーネント
      │   ├─ /hooks                # カスタムフックのテスト
      │   │   ├─ useAuth.test.ts
      │   │   └─ ...
      │   ├─ /lib                  # ユーティリティのテスト
      │   │   ├─ /services         # サービスのテスト
      │   │   ├─ /utils            # ユーティリティのテスト
      │   │   └─ ...
      │   └─ /context              # コンテキストのテスト
      │
      ├─ /integration              # 統合テスト
      │   ├─ /api                  # API統合テスト
      │   │   ├─ auth.test.ts
      │   │   └─ ...
      │   ├─ /services             # サービス統合テスト
      │   └─ /features             # 機能結合テスト
      │
      ├─ /e2e                      # E2Eテスト
      │   ├─ /auth                 # 認証関連E2Eテスト
      │   │   ├─ login.test.ts
      │   │   └─ ...
      │   ├─ /contents             # コンテンツ関連E2Eテスト
      │   │   ├─ contentList.test.ts
      │   │   └─ ...
      │   └─ /settings             # 設定関連E2Eテスト
      │
      ├─ /utils                    # テスト用ユーティリティ
      │   ├─ test-utils.ts         # テスト共通ユーティリティ
      │   ├─ renderWithProviders.tsx # プロバイダ付きのレンダリングヘルパー
      │   └─ ...
      │
      └─ /mocks                    # モックデータとハンドラー
          ├─ /data                 # モックデータ
          │   ├─ sources.ts
          │   ├─ contents.ts
          │   └─ ...
          ├─ /handlers             # MSWリクエストハンドラー
          │   ├─ auth.ts
          │   └─ ...
          └─ /server.ts            # MSWサーバー設定
```

## ディレクトリ構造の原則

1. **関心の分離**
   - 機能ごとに明確に分離されたディレクトリ構造
   - コンポーネント、ロジック、データアクセスの分離

2. **階層的な整理**
   - 関連するファイルは同じディレクトリにグループ化
   - 深すぎる階層は避け、必要に応じて平坦化

3. **命名規則**
   - ディレクトリ名は機能や目的を明確に表す
   - コンポーネントファイルはパスカルケース（例：`Button.tsx`）
   - ユーティリティやフックはキャメルケース（例：`useAuth.ts`）
   - テストファイルは対象ファイル名に `.test.ts(x)` を付与（例：`Button.test.tsx`）

4. **モジュール化**
   - 各ディレクトリには `index.ts` ファイルを配置して、外部からのインポートを簡素化
   - 関連するファイルをまとめてエクスポート

## テストディレクトリ構造の原則

1. **ソースコード構造との対応**
   - テストディレクトリ構造はソースコードの構造を反映
   - 各テストファイルは対応するソースファイルと同じ名前パターンを使用

2. **テスト種類による分離**
   - 単体テスト、統合テスト、E2Eテストは明確に分離
   - 各テスト種類に適した構造とツールを使用

3. **共通リソースの共有**
   - テスト用ユーティリティとモックは再利用可能なよう共通ディレクトリに配置
   - テスト間の重複を最小限に抑える

4. **テスト実行の最適化**
   - `npm test`: すべてのテストを実行
   - `npm test:watch`: ウォッチモードでのテスト実行
   - `npm test:coverage`: カバレッジレポート生成
   - `npm test:related`: 変更されたファイルに関連するテストのみを実行

## CI/CDとGitHubワークフロー構造

プロジェクトではGitHub Actionsを使用して継続的インテグレーション/デプロイを実現しています：

```
/.github/workflows/
├─ ci.yml                # 統合CI（テスト、リント、ビルドを実行）
├─ tests.yml             # テスト実行ワークフロー
├─ lint.yml              # リント実行ワークフロー
├─ deploy.yml            # Cloudflare Pagesへのデプロイ
├─ preview-deploy.yml    # PRごとのプレビューデプロイ
├─ pr-review.yml         # PR自動レビュー（アクセシビリティとサイズチェック）
├─ supabase-deploy.yml   # SupabaseスキーマとシードデータのデプロイCron設定
└─ create-release-pr.yml # リリースPR自動作成
```

### ブランチ構造とデプロイフロー

- **dev**: 開発環境用のデフォルトブランチ（開発作業の中心）
- **main**: 本番環境用のブランチ（安定版のみマージ）
- **feature/\***: 機能開発用ブランチ
- **fix/\***: バグ修正用ブランチ
- **hotfix/\***: 緊急修正用ブランチ

デプロイ環境は以下のように対応しています：
- **開発環境**: `dev-digeclip.pages.dev`（`dev` ブランチ）
- **本番環境**: `digeclip.com`（`main` ブランチ）
- **プレビュー環境**: PR作成時に自動生成されるURL

### Git Hooks構造

ローカル開発時の品質確保のために以下のGit Hooksを設定しています：

```
/.husky/
├─ pre-add              # git add時：変更ファイルに関連するテストを実行
├─ pre-commit           # git commit時：lint-stagedで変更ファイルのみチェック
└─ pre-push             # git push時：すべてのテスト・リント・型チェック実行
```

### データベース関連ファイル構造

開発環境と本番環境のSupabaseプロジェクトを分離しており、以下のファイルを使用してスキーマとシードデータを管理しています：

```
/digeclip/seeds/
├─ dev_schema.sql       # 開発環境用データベーススキーマ定義
└─ dev_seed.sql         # 開発環境用初期データ
```

## 特記事項

- この構造は初心者でも理解しやすいように設計されています
- Next.js の最新推奨構成に従いつつ、初心者でも迷いにくいフォルダ数に留めています
- プロジェクトの成長に合わせて、必要に応じて構造を拡張できます
- テストはJest、React Testing Library、MSW、Cypressなどのツールを使用して実装します
- GitHub Actionsでは最新のNode.js 20と依存関係キャッシュを活用して高速なCIを実現しています