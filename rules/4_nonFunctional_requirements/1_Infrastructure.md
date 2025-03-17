```markdown
# インフラ構成 (最新版)

> **目的**:
> - **簡単に始められ**, **無料枠を活用**, かつ **将来拡張が容易**な構成を第一優先とする
> - **経験の浅いエンジニア**でも導入しやすいクラウド/ホスティングを選定
> - 本番環境・ステージング環境を分けやすく、**CI/CDパイプライン**も最小の手間で構築

---

## 1. 選定クラウド / ホスティング

1. **Vercel** (メイン)
   - **Next.js**公式ホスティングサービス
   - 無料プランで**Serverless Functions + Edge Functions + Cron Jobs**が利用可能
   - **GitHub連携**でプルリクごとにプレビュー環境を自動生成
   - アプリのフロントエンド+簡易バックエンド(API Routes)を一体化できる

2. **Supabase** (BaaS, DB)
   - **PostgreSQL (無料枠)** + 認証/ストレージ/リアルタイム
   - シンプルな**マネージドDB**として利用
   - 後々、有料プランにアップグレード可

3. （将来オプション）
   - **Railway**: コンテナデプロイやマネージドPostgreSQL/Redisで無料枠あり
   - **AWS Amplify**: AWSに統合したい場合に検討。無料枠だがやや学習コスト高
   - **Fly.io**: Dockerイメージでデプロイ。低レイテンシ要件が必要になった場合に選択可

**方針**: MVP段階では **Vercel + Supabase** だけで十分運用可能。必要に応じて他サービスを組み込む。

---

## 2. ネットワーク構成

> 低コスト＆構成簡単化を最優先し、大規模なVPC/サブネット設計は現時点で行わない。

1. **VPC**
   - VercelのServerless環境＋SupabaseのデフォルトVPCを使用（隠蔽された形でマネージド）
   - 特別なVPNやDirect Connectは当面不要

2. **インターネット通信**
   - すべてHTTPS通信（Vercelが自動的にSSL対応）
   - SupabaseへのDB接続も**TLS/SSL**で暗号化

3. **プライベートネットワーク**
   - Supabaseは基本的にパブリックエンドポイント。IP制限やリファラ制限を実施できる
   - アプリ（Vercel）→DB（Supabase）間を**サービスキー**＋**暗号化**で保護

**メリット**:
- 複雑なネットワーク設定不要 → **経験の浅いエンジニアでも扱いやすい**
- 料金発生しがちなAWS VPC等を回避し、**完全無料からスタート**可能

---

## 3. サーバ構成

1. **Webサーバ / アプリサーバ**
   - Vercel Serverless Functions
   - **Next.js** の API Routes で最小限のビジネスロジックを実装
   - Edge Functions（Vercel Edge Runtime）も必要に応じて利用

2. **DBサーバ**
   - **Supabase**(PostgreSQL)
   - 初期無料枠：500MBストレージ、最大50行リクエスト/秒程度

3. **ロードバランサ**
   - Vercelが内蔵のサーバレス基盤でスケール
   - 手動でLBを構築する必要はない

4. **その他**
   - **Cron処理**: Vercel Cron Jobs (毎時でYouTube/RSS監視)
   - **AIモデル**: OpenAI/Anthropic/Google APIに直接リクエスト → レート制限のみ考慮

**想定規模**:
- 月間数千〜数万リクエスト程度ならこの構成で余裕
- 必要ならSupabaseを有料プランにアップグレード、または外部RDSを検討

---

## 4. 開発・ステージング・本番環境

1. **環境数**
   - **開発**: ローカルPCで `npm run dev`
   - **ステージング**: Vercel上でブランチデプロイ (例: `staging`ブランチ)
   - **本番**: `main`ブランチ → Vercel自動デプロイ

2. **ドメイン**
   - ステージング: `staging-yourapp.vercel.app` (自動割り当てドメイン)
   - 本番: `yourapp.com` or `www.yourapp.com`(独自ドメイン、Vercel管理)

3. **SSL証明書**
   - Vercelが**Let's Encrypt**で自動発行
   - 追加費用不要

4. **切り替え方法**
   - GitHubプルリク → ステージング環境で確認 → `main`マージ → 本番自動リリース
   - DBマイグレーションは**Supabase CLI**または**DBダッシュボード**で実施

**将来拡張例**:
- 必要なら**CI/CD**(GitHub Actions)でテスト→ Vercel deploy
- **Blue-Green Deployment**や**Canary Release**は、VercelのPro/Enterpriseプランで詳細設定可能

---

## まとめ

- **Vercel (Serverless) + Supabase (DB)**でシンプルなインフラ → **ほぼ無料**スタート
- **ネットワーク設定を意識せず**、HTTPSのみで外部アクセス
- **Serverless**によりオートスケール、LB不要
- **ステージング/本番**のブランチデプロイでスムーズにテスト→本番リリース
- 当面はこれで十分運用可能＆**経験の浅いエンジニア**でも管理しやすい
- 必要に応じて**Railway, Fly.io, AWS**などに移行できる拡張性は確保

この構成により、初期費用や管理コストを最小化しつつ、将来的に**大規模アクセス**や**高度なネットワーク構成**が必要になった際にも比較的スムーズに移行可能である。
```