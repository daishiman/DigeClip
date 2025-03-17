```markdown
# 自動化 (CI/CD, IaC)

> **前提**
> - お金をかけずに、経験の浅いエンジニアでも構築しやすい仕組みを重視
> - 将来的に機能追加やメンバー増への対応が容易な構成を目指す
> - GitHub リポジトリ + Vercel を中心に**簡易CI/CD**を実装し、さらに必要に応じてテスト/インフラ自動化を拡張

---

## 1. CIパイプライン

1. **使用ツール候補**
   - **GitHub Actions** (無料枠あり)
     - Pull Request 作成時に自動ビルド、Lint/Formatter、単体テストなど実行
     - Next.js + TypeScript 用のテンプレワークフローが多数存在
   - 他選択肢: CircleCI, Jenkins など (無料枠 or Self-hosted で利用)

2. **ビルド/テスト手順 (例)**
   1. **checkout**: リポジトリを取得
   2. **install**: `npm ci` で依存関係インストール
   3. **lint**: `npm run lint` (ESLint + Prettier)
   4. **test**: `npm run test` (Jest / Vitest等 単体テスト)
   5. **build**: `npm run build` (Next.js ビルド確認)
   6. **report**: テスト結果 / カバレッジを GitHub Actions のコンソールや Slack に通知

3. **成果物**
   - 成功: Pull Request に「CI パス」と表示
   - 失敗: エラー詳細を表示 → PR 修正

> **経験の浅いエンジニア** でも、GitHub Actions の [ワークフローファイルサンプル](https://github.com/actions/starter-workflows) を参照すれば導入可能

---

## 2. CDパイプライン

1. **ステージング・本番デプロイ方法**
   - **Vercel** を活用することで、**GitHub リポジトリ**にプッシュするたびに自動ビルド＆デプロイ
   - **Preview Deploy**: PRごとにプレビューURLが発行され、UIの確認が容易
   - **本番デプロイ**: `main` ブランチへのマージをトリガーに自動リリース

2. **承認フロー (簡易)**
   1. Pull Request → CIパス → コードレビュー → マージ
   2. マージ後、自動で Vercel の本番環境にデプロイ
   3. Slack 等へ「デプロイ完了通知」
   - 大規模/厳密な運用が必要な場合は、**手動承認ステップ** など追加可

3. **環境変数管理**
   - **Vercel Dashboard** 上で本番/プレビュー用に環境変数を設定 (.env.* はGit ignore)
   - Supabase 接続URL, JWT_SECRET などはここで安全に管理

---

## 3. インフラのコード化 (IaC)

1. **対象範囲** (将来拡張)
   - Supabase はマネージドで自動管理 → Terraform でDBスキーマ管理までは不要かもしれない
   - Vercel は自動デプロイが主 → Terraform, Pulumi などで管理するメリットは限定的
   - 小規模なら**手動設定**で十分 → 将来的に AWS移行や大規模化を考えるなら IaC検討

2. **ツール例**
   - **Terraform**: 各種クラウドリソースを宣言的にコード管理
   - **Pulumi**: TypeScript など好きな言語でIaC可能
   - 運用コスト(学習+メンテ)があるため、当面は**手動** or **Supabase migration scripts** でも可

3. **推奨方針**
   - MVPフェーズ：Vercel + Supabase の**GUI管理が中心**
   - 将来的に本格インフラ(EC2, RDS, S3 など)を使う場合→Terraform/Pulumi でIaC化

---

## 4. テスト自動化

1. **単体テスト (Unit Test)**
   - **Jest** or **Vitest** など → Reactコンポーネントやロジック層のテスト
   - API Routes は jest + supertest で簡易的なHTTPテスト可能

2. **結合テスト / E2Eテスト**
   - **Cypress** / **Playwright** など
   - フロントエンドから実際の画面操作を自動化
   - ログイン機能や要約機能が一通り動くか検証

3. **段階的導入**
   - まずは**重要ロジック (要約生成, 認証フロー)** を優先 → 単体テスト
   - 時間があれば UI周りのE2Eテストを追加
   - カバレッジ100%は目指さず、**クリティカルな箇所**をカバー

---

## 5. 運用タスクの自動化

1. **定期バッチ**
   - 現状: **Vercel Cron Jobs** を利用してRSS/YouTube監視 → DB保存
   - スクリプトは Next.js API Routes or バックエンドCron専用パスで管理
   - Supabase Functions は要検討(無料枠/制限)

2. **ログ集計・分析**
   - 小規模なら**Supabase** のログ機能 / テーブルで十分
   - 必要なら**Sentry** などのエラーログ連携 → Slack通知

3. **自動レポート (将来)**
   - 毎朝9時に Discord/Webhook で「新着要約数レポート」を送信
   - 期間別リソース使用量など → Supabase + Simple CLI or Webhook

4. **データバックアップ**
   - Supabase には定期バックアップ機能(無料枠でも有)
   - 重要テーブルはCSV出力 or PG_dump でローカル/クラウドへ保存

---

### まとめ

- **CI (GitHub Actions)**: Pull Request 時にビルド+Lint+テスト → 失敗を早期検知
- **CD (Vercel)**: main ブランチマージで本番リリース → Preview URL で安全にレビュー
- **テスト自動化**: まず単体テストを整備 → 余力があれば E2E
- **IaC**: 小規模MVP段階は手動/GUI管理が妥当、拡張時にTerraform等導入検討
- **運用自動化**: Vercel Cron で監視バッチ、Slack通知など最低限を実装 → 大規模化時に細分化

このようにして、**低コスト & シンプル** に **CI/CD + 運用自動化** を導入し、後から段階的に拡張できる体制を整えます。
```