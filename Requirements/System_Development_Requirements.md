次の内容をもとに、
"""
# YouTubeおよび外部コンテンツ情報収集・要約システム 要件定義書

## 1. 目的

このシステムは、YouTube チャンネルや外部コンテンツ（論文、ブログなど）の新着情報を自動的に収集し、複数の AI モデル（OpenAI、Claude、Gemini など）を用いて **要約（＋サムネ＋リンク）付きの通知を Discord** に送ると同時に、**アプリ上でも同じ要約を閲覧**できるようにするものです。
これにより、**大量の情報源**から重要な内容を**短時間で**把握し、情報収集に費やす時間を**50%以上**削減することを目指します。

### 1.1 解決する課題

1. **複数の情報源を手動監視する時間コスト**
   - YouTube チャンネル、論文サイト、ブログなど大量の情報源を巡回する負担を軽減。

2. **長い動画や記事を全部見るのは非効率**
   - 長時間動画や数十ページの論文を最初から最後まで読むのが大変。

3. **AIモデルの性能差＆設定の複雑さ**
   - OpenAI, Claude, Gemini 等の API Key 設定やコスト管理が難しく、導入ハードルが高い。

4. **収集データの管理・分類不足**
   - 取得したコンテンツをまとめて管理・タグ付け、過去の要約検索などができない。

5. **通知がリンクだけでは内容が分からない**
   - Discord 通知を受け取ってもタイトルやサムネがなく、何の情報かイメージしづらい。

## 2. システム概要

- **フロントエンド/バックエンド**: [Next.js (React)](https://nextjs.org/docs)
- **データベース**: [Supabase (PostgreSQL無料枠)](https://supabase.com/)
- **ホスティング**: [Vercel 無料プラン](https://vercel.com/docs)
- **定期実行(Cron)**: [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- **AIモデル**: OpenAI (GPT-3.5/4), Anthropic (Claude), Google (Gemini) 等を選択可能
- **ステップ要約**: 概要(overview)→見出し(heading)→詳細(detail)など **複数段階**の要約にも対応
- **認証**: Googleアカウント認証(OAuth 2.0) + JWT認証(Email+パスワード)

**フロー**:
1. RSS/YouTube チャンネルの新着検知（Vercel Cron 毎時実行）
2. テキスト抽出（字幕や本文）
3. 複数ステップの AI 要約を生成し、DB に保存
4. Discord にサムネ付 Embed 通知 + アプリ画面に表示
5. タグや検索で管理者・ユーザーが要約を効率的に利用

## 3. 機能要件

### 3.1 YouTubeチャンネル監視機能
- **目的**: YouTube の新規動画を定期検知し、字幕/サムネ取得
- **詳細**:
  - RSSフィード取得 → 新着動画ID を判定
  - YouTube字幕API or スクレイピングで字幕取得
  - メタデータ(タイトル, サムネURL) と共に `contents` に保存

### 3.2 外部コンテンツ監視機能
- **目的**: 論文(arXiv)やブログ(RSS) の新着も同様に収集
- **詳細**:
  - RSS取得 → 新着記事(OGP画像, 本文テキスト, 抄録) → DB 保存
  - 管理画面でソース(ブログURL, arXivカテゴリ等)のCRUD

### 3.3 コンテンツ取得・保存機能
- **目的**: 取得した字幕/本文/OGPなどを DB へ格納し、後から要約に利用
- **詳細**:
  - `contents` テーブルに `raw_text`, `metadata` (JSONB) で柔軟に保存
  - 発行日, サムネURL, 外部ID などを記録

### 3.4 マルチAIモデル要約機能
- **目的**: 様々なAIモデルを使って、段階的ステップ要約(概要,見出し,詳細等)を生成
- **詳細**:
  - `ai_models` で API Key / モデルID /トークン設定を管理
  - `summaries` テーブルに (content_id, ai_model_id, stage) 単位で要約結果を保存
  - Discord 通知やアプリ画面で比較表示

### 3.5 Discord 通知機能
- **目的**: サムネ + リンク + 要約を含む Embed メッセージで見やすく通知
- **詳細**:
  - Discord Webhook URL 登録
  - 通知テンプレでタイトル/サムネ/要約/リンクをカスタム可
  - `notifications` テーブルで送信履歴管理

### 3.6 認証・認可機能
- **目的**: 管理画面のセキュリティ確保と一般ユーザーアクセス制御
- **詳細**:
  - **ユーザーロール**: admin（管理者）、user（一般ユーザー）、guest（未ログイン）
  - **認証方法**:
    - Googleアカウント認証（OAuth 2.0）
    - JWT認証（メール＋パスワード）
  - **ログイン関連機能**:
    - ユーザー登録（サインアップ）
    - ログイン（サインイン）
    - ログアウト
    - パスワードリセット
    - パスワード変更
  - **権限制御**:
    - adminはすべての機能にアクセス可能
    - userはコンテンツ閲覧・タグ付けのみ可能
    - guestは限定的な閲覧のみ可能

### 3.7 管理機能
- **目的**: システム設定, 監視ソース, AIモデル, 通知先等を一括管理
- **詳細**:
  - Web管理画面 (認証必須)
  - ソース追加/編集 (YouTubeチャンネル, RSS etc.)
  - AIモデルCRUD (API Key暗号化, デフォルトモデル指定)
  - 通知設定 (Webhook, Embedテンプレ)
  - ログ / 履歴確認

### 3.8 コンテンツ管理機能
- **目的**: アプリ画面で要約+サムネを検索・閲覧
- **詳細**:
  - 一覧表示 (タグ, ソース, 日付, ステータス等でフィルタ)
  - タグ付け (多対多管理)
  - 要約比較 (複数AIモデル, 複数ステップ)
  - 通知履歴参照

## 4. 技術的要件

### 4.1 使用技術

1. **Next.js** + **Tailwind**
   - React ベースでフロント＆バックエンド実装
   - Vercel 無料ホスティング
2. **Supabase (PostgreSQL)**
   - DB として利用, 認証/ストレージ等も将来拡張可
   - 無料枠でコストを抑える
3. **Vercel** 無料プラン
   - Serverless Functions + Cron Jobs
   - GitHub 連携でプッシュ→自動デプロイ
4. **AIモデルAPI**
   - OpenAI GPT-3.5/4, Claude, Gemini など
   - Key は `.env` / Vercel Env で管理, `api_key_encrypted` カラムに暗号化保存
5. **Cronジョブ**
   - 毎時実行で RSS/YouTube新着検出, 要約処理
6. **認証**
   - NextAuth.js または 独自実装のJWT認証
   - Google OAuth 2.0連携

### 4.2 データベース設計

- **sources**: 監視対象
- **contents**: コンテンツ (字幕/本文)
- **ai_models**: AIモデル設定
- **summaries**: 要約結果 (複数モデル, 複数ステップ)
- **notifications**: 通知履歴
- **tags / content_tags**: タグ機能 (多対多)
- **users**: ユーザー情報 (role, email, name, auth情報)
- **app_settings**: システム設定 (cron_interval等)

## 5. API設計

### 5.1 ディレクトリ構成 (Next.js)

```
/api
  ├─ /auth
  │    ├─ google-callback.ts
  │    ├─ login.ts
  │    ├─ logout.ts
  │    ├─ register.ts
  │    ├─ reset-password.ts
  │    └─ change-password.ts
  ├─ /user
  │    ├─ contents
  │    ├─ tags
  │    ├─ system
  │    └─ ...
  └─ /admin
       ├─ sources
       ├─ contents
       ├─ ai-models
       ├─ notifications
       ├─ tags
       ├─ system
       └─ ...
```

### 5.2 認証系 API (`/api/auth/...`)

- **ユーザー登録**: `POST /api/auth/register`
  - 新規ユーザーをメール＋パスワードで登録
  - JWT発行して自動ログイン

- **ログイン**: `POST /api/auth/login`
  - メール＋パスワードでログイン
  - JWT発行してセッション確立

- **Google OAuth コールバック**: `GET /api/auth/google-callback`
  - Googleログインのリダイレクト受け取り
  - 成功時JWT発行、ユーザープロフィールDB格納

- **ログアウト**: `POST /api/auth/logout`
  - JWTの無効化またはCookie削除

- **パスワードリセット**: `POST /api/auth/reset-password`
  - パスワードを忘れた際のリセットリンク送信

- **パスワード変更**: `POST /api/auth/change-password`
  - ログイン中にパスワードを変更

### 5.3 ユーザー系 API (`/api/user/...`)

- **コンテンツ一覧取得**: `GET /api/user/contents`
  - フィルタリング、ページネーション対応

- **コンテンツ詳細取得**: `GET /api/user/contents/[id]`
  - 詳細情報、要約結果、通知履歴など

- **タグ付け**: `POST /api/user/contents/[id]/tags`
  - ユーザーによるタグ追加

- **タグ削除**: `DELETE /api/user/contents/[id]/tags/[tagName]`
  - ユーザーによるタグ削除

### 5.4 管理者系 API (`/api/admin/...`)

- **ソース管理**: `/api/admin/sources`
  - 監視対象の追加、更新、削除、一覧

- **コンテンツ管理**: `/api/admin/contents`
  - 全件取得、ステータス別フィルタリング、削除

- **AIモデル管理**: `/api/admin/ai-models`
  - AIモデル登録、更新、削除、一覧

- **通知履歴**: `/api/admin/notifications`
  - 通知履歴取得、テスト送信

- **タグ管理**: `/api/admin/tags`
  - タグ作成、更新、削除、一覧

- **システム設定**: `/api/admin/system`
  - システムステータス取得、監視処理手動実行

## 6. 画面設計

1. **ダッシュボード**
   - 要約数や通知履歴、システムステータス
2. **ソース管理画面**
   - ソース(YouTube/RSS/arXiv)の CRUD
3. **AIモデル設定画面**
   - 複数モデル登録(API Key暗号化), デフォルトモデル指定
   - 段階的要約をON/OFF設定
4. **コンテンツ一覧画面**
   - タイトル, サムネ, ステータス, タグ
   - フィルタ機能(タグ, ソース, 日付)
   - 詳細画面へ遷移
5. **コンテンツ詳細画面**
   - 本文/字幕, 複数ステップ要約, Discord通知履歴
6. **通知設定画面**
   - Discord Webhook, Embedテンプレ編集, テスト送信
7. **システム設定画面**
   - Cron間隔(毎時), データ保持期間(無期限), ログレベル
8. **ユーザー管理画面**
   - 管理者のみアクセス可能、ユーザー一覧と権限設定
9. **認証画面**
   - ログイン、登録、パスワードリセット画面
   - Googleログインボタン

## 7. 具体的な実装ステップ

### 7.1 フェーズ1: 基盤構築
- Next.jsプロジェクト作成、Tailwind CSS設定
- Supabase DB 設定、テーブルスキーマ定義
- 認証機能実装（JWT + Google OAuth）
- 管理画面の基本レイアウト作成
- Vercel デプロイ設定

### 7.2 フェーズ2: 監視機能実装
- YouTube チャンネル監視機能
- RSS/arXiv 監視機能
- テキスト抽出処理
- Cron Job 設定

### 7.3 フェーズ3: AI要約・通知機能
- AI要約機能（デフォルトでGemini-2.0-flash等）
- Discord通知機能
- コンテンツ一覧・詳細表示

### 7.4 フェーズ4: 拡張機能
- タグ機能
- 複数AIモデル比較
- 段階的要約（概要、見出し、詳細）
- 通知テンプレートカスタマイズ

## 8. 定期実行処理設計

1. **コンテンツ監視ジョブ**
   - Vercel Cron (毎時) → RSS/YouTube → 新着検出 → `contents` へ挿入
2. **テキスト抽出処理**
   - YouTube字幕API or スクレイピング, OGP解析
   - `contents` の `raw_text` / `metadata` を更新
3. **要約処理**
   - 指定AIモデルで複数ステップ(stage="overview" etc.) 要約 → `summaries` 保存
   - Discord通知キューに登録
4. **通知処理**
   - サムネ＋タイトル＋要約Embed → Discord Webhook
   - 送信結果を `notifications` に記録

## 9. 実装における注意点（経験の浅いエンジニア向け）

1. **環境変数管理**
   - `.env.local` + Vercel環境変数
   - APIキー/WebhookURLは絶対にリポジトリに含めない
2. **認証関連**
   - JWT認証実装（有効期限、secret keyの管理）
   - Google OAuth連携設定
   - ロールベースの権限制御
3. **エラーハンドリング**
   - try-catch → ログ出力 / `status` や `metadata` でエラー情報を保存
4. **セキュリティ**
   - 管理画面は必ずログイン (NextAuth.jsなど)
   - AIモデルのAPIキーは暗号化 (または最低限 Base64 + 別キー管理)
   - CSRFトークンの実装
5. **段階的実装**
   - MVPでYouTube監視 + 1つのAIモデル + Discord通知 → 徐々に機能拡張
6. **パフォーマンス**
   - ページネーション必須 (大量データ時)
   - 需要が増えたら Supabase 有料プラン + レプリケーション検討

## 10. 成功基準

1. **新着を自動検出**しテキスト抽出＆AI要約が動作
2. **Discord通知**(Embed形式)で「タイトル+サムネ+要約+リンク」を送信
3. **アプリ画面**でも同様の要約を閲覧・比較可
4. 情報収集時間**50%以上**削減
5. **Vercel＋Supabase** 無料枠で十分運用
6. **1週間以内**に初心者でも導入 (セットアップガイド整備)
7. **拡張性**: 複数AIモデル、翻訳機能、別通知先 等を後から追加しやすい

添付参照

"""

上記の内容を参考に次の内容を具体化してください。
"""
"""

ただし、要件を定義するうえで、変更しても問題ない。むしろ、より良くするために、変更してください。
お金をかけずに、容易に経験の浅いエンジニアが実装できることを第一優先とする。
将来的に機能追加しやすい構成とすること。

https://chatgpt.com/c/67d3c85b-0348-8003-8f9a-5f9296f21cc5