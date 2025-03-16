# アーキテクチャ概要

## 前提条件

本システムでは、**お金をかけずに、容易に経験の浅いエンジニアが短期間で実装**できることを第一優先とし、将来的な拡張にも対応しやすい設計を目指します。以下のガイドラインは、現在の要件と運用規模を前提としたアーキテクチャ方針です。

## 1. モノリシック or マイクロサービス

### 選定方針と理由

- **現状はモノリシック構成**:
  - Next.js（フロント＆バックエンド） + Supabase（DB）を1つのリポジトリ/プロジェクトで管理し、**Vercel** 上で動作させます。
  - サーバレス環境では「小規模モノリシック」でも十分運用可能、設定が簡単。

- **将来的な拡張**:
  - コンテンツが大量＆要約処理が大規模になる場合、**Microservices** (AI処理専用サービス等) や別コンテナ分割を検討。
  - 需要が増えた際には**AI要約処理**を Queue + Worker に切り出す形も想定可。

### メリット/デメリット
- **メリット**:
  - コードベースが1つで済み、**初心者でも構成を理解しやすい**。
  - **Vercel 無料枠**内で管理しやすい。
- **デメリット**:
  - 大規模化時、モノリシックがボトルネックになる可能性。
  - CI/CD や更新が大きくなるとビルド時間が延びる。

## 2. サーバレスアーキテクチャ

### 対象範囲

- **Next.js** を Vercel 上で Serverless Functions (API Routes) として動かす。
- Cron Jobs (Vercel) を利用して定期実行。
- **Supabase** はマネージド PostgreSQL でサーバレスに近い形。

### 導入メリット

- **コストがほぼゼロ** (無料枠内)
- 運用負荷が少なく、**エンジニアがインフラ構築不要**
- デプロイとスケールが自動化され、**初心者でも扱いやすい**

### デメリット / 将来検討

- Vercel の無料枠・API 実行回数に制限がある。
- ステートレスな処理に特化、動画変換などヘビー処理は**有料プラン or Worker化**を検討。
- AI要約の大規模化時に**外部ジョブキューサービス**との連携が必要になるかも。

## 3. レイヤードアーキテクチャ

本システムは小規模モノリシックかつサーバレス環境で動かすため、**シンプルなレイヤー構成**を想定します。

1. **プレゼンテーション層 (UI)**
   - Next.js のページコンポーネント + Tailwind CSS
   - フロント側で認証・画面表示・ユーザー操作を受け付け

2. **APIレイヤー** (`/app/api/*`)
   - Next.js の API Routes (Serverless Functions) で REST API 的に実装
   - HTTPリクエストの受付
   - 認証・認可の確認
   - リクエストのバリデーション
   - 適切なサービスの呼び出し
   - レスポンスの整形

3. **サービスレイヤー** (`/lib/services/*`)
   - ビジネスロジックの実装
   - トランザクション管理
   - 複数リポジトリの連携
   - 外部APIとの連携

4. **リポジトリレイヤー** (`/lib/db/repositories/*`)
   - データアクセスロジックの抽象化
   - クエリの実行
   - データの変換（DB形式 ⇔ アプリケーション形式）

5. **ユーティリティレイヤー** (`/lib/utils/*`)
   - 共通機能の提供
   - ヘルパー関数
   - バリデーション
   - エラーハンドリング

## 4. ディレクトリ構造

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

## 5. 例外処理・エラーハンドリング

### 5.1 例外対応の層

- **API Route** (Next.js):
  - try-catch で外部APIやDB操作失敗時にログを出力
  - ユーザーには HTTP ステータスコード + JSON メッセージを返す
- **UI層**:
  - エラー時にわかりやすいメッセージ or トースト通知を表示
  - 重要なエラーの場合は管理画面にログ

### 5.2 ログ出力

- **Supabase** に簡易的なログテーブルを作成 or `notifications.metadata` にエラー情報を保存
- メジャーなエラーは**Sentry**などのエラー監視 SaaS (将来導入検討)

### 5.3 ユーザー向けエラー返却

- **API**: JSON 形式 `{"error": "...", "detail": "..."}`
- **UI**:
  - Minimal error message("要約取得に失敗しました。再度お試しください"など)
  - For dev/ops: Show extended logs if role=admin

## 6. 将来的な拡張

1. **複雑なバックエンド**: もし要件が増えた場合は、**NestJS** を別リポジトリで導入し、REST/GraphQL API でフロントと連携
2. **大規模データ/負荷**: Supabase の有料プラン移行 + Redis マネージドサービス (Upstash) + Edge Functions でスケール
3. **追加AIモデル**: `ai_models` テーブルにモデルを追加し、複数ステップ要約を実行 (overview→heading→detail)
4. **ログ・監査**: Cloud Logging や Datadog などを導入し、詳細モニタリングを実施