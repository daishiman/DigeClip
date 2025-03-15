# アーキテクチャガイドライン

本システムでは、**お金をかけずに、容易に経験の浅いエンジニアが短期間で実装**できることを第一優先とし、将来的な拡張にも対応しやすい設計を目指します。以下のガイドラインは、現在の要件と運用規模を前提としたアーキテクチャ方針です。

---

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

---

## 2. サーバレスアーキテクチャ検討

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

---

## 3. レイヤードアーキテクチャ

本システムは小規模モノリシックかつサーバレス環境で動かすため、**シンプルなレイヤー構成**を想定します。

1. **プレゼンテーション層 (UI)**
   - Next.js のページコンポーネント + Tailwind CSS
   - フロント側で認証・画面表示・ユーザー操作を受け付け

2. **API/アプリケーション層**
   - Next.js の API Routes (Serverless Functions) で REST API 的に実装
   - 要約処理を呼び出すハンドラ、DB CRUD を行うコントローラ的存在

3. **ドメイン/ビジネスロジック層** (将来的に拡張)
   - 現状はサーバレスAPI内にビジネスロジックを簡易実装
   - 大規模化した場合、要約ロジックや抽出ロジックをサービスクラス/ドメインクラスで分割

4. **インフラ層**
   - Supabase (PostgreSQL), AIモデルとの通信, Discord Webhook など
   - DB接続や外部APIコールはここでまとめるのが望ましい

### パッケージ・モジュール構成（例）
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
(※あくまで一例。小規模なら最初はフラット構成でも可)

---

## 4. 例外処理・エラーハンドリング

### 4.1 例外対応の層

- **API Route** (Next.js):
  - try-catch で外部APIやDB操作失敗時にログを出力
  - ユーザーには HTTP ステータスコード + JSON メッセージを返す
- **UI層**:
  - エラー時にわかりやすいメッセージ or トースト通知を表示
  - 重要なエラーの場合は管理画面にログ

### 4.2 ログ出力

- **Supabase** に簡易的なログテーブルを作成 or `notifications.metadata` にエラー情報を保存
- Net new:  メジャーなエラーは**Sentry**などのエラー監視 SaaS (将来導入検討)

### 4.3 ユーザー向けエラー返却

- **API**: JSON 形式 `{"error": "...", "detail": "..."}`
- **UI**:
  - Minimal error message(“要約取得に失敗しました。再度お試しください”など)
  - For dev/ops: Show extended logs if role=admin

### 4.4 将来拡張

- 大規模・高信頼が要求される場合、**カスタムエラー型** & **集中ハンドリング**を導入
- マイクロサービスを分離する場合、グローバルなエラー処理ライブラリやパターンが推奨されます。

---

**まとめ:**
- **モノリシック + サーバレス**を基本とし、**低コスト**かつ**スピード重視**で開発。
- **複数レイヤー**は最小限でスタートし、**将来的な拡張**（サービス分割やドメイン層の拡充）に備える。
- **例外処理**は Next.js API Route 単位で完結させ、UI にはわかりやすいメッセージを返す。
- これにより、**初心者にも扱いやすい**構造を維持しつつ、**段階的に機能追加**が可能。