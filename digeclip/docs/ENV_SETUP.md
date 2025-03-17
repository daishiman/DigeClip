# 環境変数の設定方法

このプロジェクトでは、以下の環境変数を`.env.local`ファイルに設定する必要があります。

## 必須の環境変数

```
# Supabase設定
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"

# OpenAI API設定
OPENAI_API_KEY="sk-..."

# Discord通知設定
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

## オプションの環境変数

```
# Google Gemini API設定
GEMINI_API_KEY="..."

# Anthropic Claude API設定
CLAUDE_API_KEY="sk-ant-..."
```

## 環境変数の取得方法

### Supabase関連の環境変数

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成またはログインします。
2. 新しいプロジェクトを作成します。
3. プロジェクトが作成されたら、「Project Settings」→「API」に移動します。
4. 以下の情報を取得します：
   - `NEXT_PUBLIC_SUPABASE_URL`: 「Project URL」の値
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 「anon」「public」の下に表示されるAPIキー
   - `DATABASE_URL`: 「Connection string」→「URI」の値

### OpenAI API Key

1. [OpenAI API](https://platform.openai.com/)にアクセスし、アカウントを作成またはログインします。
2. 「API Keys」セクションに移動します。
3. 「Create new secret key」をクリックして新しいAPIキーを生成します。
4. 生成されたキーを`OPENAI_API_KEY`として設定します。

### Discord Webhook URL

1. Discordサーバーの設定にアクセスします。
2. 「インテグレーション」→「ウェブフック」に移動します。
3. 「新しいウェブフック」をクリックして、新しいウェブフックを作成します。
4. ウェブフックの名前と投稿先のチャンネルを設定します。
5. 「ウェブフックURLをコピー」をクリックしてURLをコピーします。
6. コピーしたURLを`DISCORD_WEBHOOK_URL`として設定します。

## 環境変数ファイルの作成

プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、上記の環境変数を設定します。

```bash
touch .env.local
```

エディタで`.env.local`ファイルを開き、必要な環境変数を追加します。

## 注意事項

- `.env.local`ファイルはGitリポジトリにコミットしないでください。このファイルは`.gitignore`に含まれています。
- 本番環境では、ホスティングプラットフォーム（Vercel、Netlifyなど）の環境変数設定機能を使用して環境変数を設定してください。
- APIキーは定期的に更新することをお勧めします。