#!/bin/bash

# ngrokを使用してローカル開発環境を外部公開するスクリプト
# 使用方法: ./scripts/start-ngrok.sh [ポート番号]

# デフォルトのポート番号
DEFAULT_PORT=3000
PORT=${1:-$DEFAULT_PORT}

# 前提条件の確認
if ! command -v ngrok &> /dev/null; then
    echo "ngrokがインストールされていません。インストールしてください。"
    echo "インストール方法: https://ngrok.com/download"
    exit 1
fi

# アプリが実行中かチェック
if ! curl -s http://localhost:$PORT > /dev/null; then
    echo "警告: localhost:$PORT にアプリケーションが見つかりません。"
    echo "別のターミナルで 'npm run dev' を実行してから、このスクリプトを再実行してください。"
    exit 1
fi

echo "🚀 ローカル開発環境(localhost:$PORT)をngrokで外部公開します..."
echo "📋 外部URLはngrok起動後に表示されます"
echo "⚠️ 認証コールバックURLやOAuth設定で外部URLが必要な場合は、表示されるURLを使用してください"
echo "🛑 終了するには Ctrl+C を押してください"

# ngrokを実行
ngrok http $PORT