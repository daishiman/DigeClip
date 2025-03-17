#!/bin/bash

# 現在のNode.jsバージョンを確認
echo "現在のNode.jsバージョン: $(node -v)"

# nvmがインストールされているか確認
if ! command -v nvm &> /dev/null; then
  echo "nvmがインストールされていません。インストールしてください。"
  echo "インストール方法: https://github.com/nvm-sh/nvm#installing-and-updating"
  exit 1
fi

# Node.js 20の最新バージョンをインストールして使用
echo "Node.js 20の最新バージョンをインストールしています..."
nvm install 20
nvm use 20

echo "Node.jsのバージョンを更新しました: $(node -v)"
echo "このプロジェクトでNode.js 20を使用するには、以下のコマンドを実行してください："
echo "cd $(pwd) && nvm use 20"

# .nvmrcファイルを作成
echo "20" > .nvmrc
echo ".nvmrcファイルを作成しました。nvmを使用している場合、このディレクトリに移動すると自動的にNode.js 20が使用されます。"