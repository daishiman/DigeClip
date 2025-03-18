# GitHub Actionsセットアップガイド

このプロジェクトでは、Cloudflare PagesとSupabaseを使用して、開発環境と本番環境を分離した自動デプロイフローを実装しています。

## 前提条件

- GitHub リポジトリがセットアップ済み
- Cloudflare Pagesプロジェクトが作成済み
- Supabaseプロジェクトが作成済み

## 必要なSecrets

以下のシークレットをGitHubリポジトリに設定してください：

1. `CLOUDFLARE_API_TOKEN` - Cloudflare APIトークン
2. `CLOUDFLARE_ACCOUNT_ID` - Cloudflareアカウント ID
3. `SUPABASE_URL` - SupabaseプロジェクトURL
4. `SUPABASE_ANON_KEY` - Supabase匿名キー
5. `SUPABASE_SERVICE_ROLE_KEY` - Supabaseサービスロールキー

### シークレットの設定方法

1. GitHubリポジトリのSettingsタブを開きます
2. 左側のメニューから「Secrets and variables」→「Actions」を選択
3. 「New repository secret」ボタンをクリックして上記のシークレットを追加

## ブランチ構成

このプロジェクトでは以下のブランチ構造を使用します：

- `development` - 開発環境用（デフォルトブランチ）
- `production` - 本番環境用
- 機能開発用ブランチ - 各機能開発用（`feature/xx`など）

### ブランチ設定方法

1. デフォルトブランチを`development`に設定
   - GitHubリポジトリのSettingsタブ → Branches → Default branch

2. ブランチ保護ルールの設定
   - GitHubリポジトリのSettingsタブ → Branches → Branch protection rules
   - `production`ブランチにはレビュー必須などの制限を設定

## 自動化ワークフロー

以下のワークフローが自動的に実行されます：

1. **PR作成時** - プレビュー環境にデプロイ
2. **developmentブランチへのマージ** - 開発環境にデプロイ
3. **productionブランチへのマージ** - 本番環境にデプロイ
4. **定期的（毎週月曜日）** - 開発環境から本番環境へのリリースPR作成

## 初期セットアップ手順

1. ローカルで`development`ブランチを作成
   ```bash
   git checkout -b development
   git push -u origin development
   ```

2. 同様に`production`ブランチを作成
   ```bash
   git checkout -b production
   git push -u origin production
   ```

3. GitHubのデフォルトブランチを`development`に変更

4. Cloudflare Pagesの設定
   - プロジェクト作成時、GitHubリポジトリと連携
   - ビルド設定: フレームワークプリセットに「Next.js」を選択
   - 環境変数: 開発環境と本番環境それぞれに必要な変数を設定

## ローカル開発とngrokの利用

外部APIや認証コールバックのテストには、ngrokを使用してください：

1. ngrokをインストール: https://ngrok.com/download

2. ローカルサーバー起動
   ```bash
   npm run dev
   ```

3. 別のターミナルでngrok起動
   ```bash
   # スクリプトを実行可能にする
   chmod +x scripts/start-ngrok.sh

   # ngrok起動（デフォルトは3000ポート）
   ./scripts/start-ngrok.sh
   ```

4. 表示されるngrokのURLを使用して外部からアクセス可能

## 手動リリース方法

開発環境から本番環境への手動リリースは以下の手順で行えます：

1. GitHubリポジトリのActionsタブを開く
2. 左側のワークフローリストから「リリースPR作成」を選択
3. 「Run workflow」ボタンをクリック
4. リリースタイトルを入力して実行
5. 作成されたPRをレビューしてマージ