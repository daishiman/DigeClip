#!/bin/bash

# DigeClipローカルCI実行スクリプト
# GitHub Actionsで実行される内容と同じチェックをローカルで実行します

# 色付きの出力用の変数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}DigeClip ローカルCI実行スクリプト${NC}"
echo -e "${BLUE}=============================${NC}"

# 現在のディレクトリを記録
CURRENT_DIR=$(pwd)

# digeclipディレクトリに移動
if [ -d "digeclip" ]; then
  cd digeclip
else
  echo -e "${RED}digeclipディレクトリが見つかりません。スクリプトはプロジェクトのルートディレクトリから実行してください。${NC}"
  exit 1
fi

# 実行時間の計測開始
START_TIME=$(date +%s)

# ステータス変数の初期化
LINT_STATUS=0
TYPE_CHECK_STATUS=0
TEST_STATUS=0
FORMAT_STATUS=0

# リントの実行
echo -e "\n${YELLOW}ESLintを実行中...${NC}"
npm run lint
LINT_STATUS=$?

if [ $LINT_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ ESLintは成功しました${NC}"
else
  echo -e "${RED}✗ ESLintに失敗しました${NC}"
fi

# 型チェックの実行
echo -e "\n${YELLOW}TypeScriptの型チェックを実行中...${NC}"
npm run type-check
TYPE_CHECK_STATUS=$?

if [ $TYPE_CHECK_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ 型チェックは成功しました${NC}"
else
  echo -e "${RED}✗ 型チェックに失敗しました${NC}"
fi

# テストの実行
echo -e "\n${YELLOW}Jestテストを実行中...${NC}"
npm test
TEST_STATUS=$?

if [ $TEST_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ テストは成功しました${NC}"
else
  echo -e "${RED}✗ テストに失敗しました${NC}"
fi

# Prettierの実行
echo -e "\n${YELLOW}Prettierフォーマットチェックを実行中...${NC}"
npm run format -- --check
FORMAT_STATUS=$?

if [ $FORMAT_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ フォーマットチェックは成功しました${NC}"
else
  echo -e "${RED}✗ フォーマットチェックに失敗しました${NC}"
fi

# 元のディレクトリに戻る
cd "$CURRENT_DIR"

# 実行時間の計測終了
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "\n${BLUE}=============================${NC}"
echo -e "${BLUE}実行結果${NC}"

# 全てのステータスをまとめて結果を表示
if [ $LINT_STATUS -eq 0 ] && [ $TYPE_CHECK_STATUS -eq 0 ] && [ $TEST_STATUS -eq 0 ] && [ $FORMAT_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ すべてのチェックが成功しました！${NC}"
  echo -e "${BLUE}合計実行時間: ${DURATION}秒${NC}"
  exit 0
else
  echo -e "${RED}✗ 以下のチェックが失敗しました:${NC}"
  [ $LINT_STATUS -ne 0 ] && echo -e "${RED}  - ESLint${NC}"
  [ $TYPE_CHECK_STATUS -ne 0 ] && echo -e "${RED}  - 型チェック${NC}"
  [ $TEST_STATUS -ne 0 ] && echo -e "${RED}  - テスト${NC}"
  [ $FORMAT_STATUS -ne 0 ] && echo -e "${RED}  - フォーマットチェック${NC}"
  echo -e "${BLUE}合計実行時間: ${DURATION}秒${NC}"
  exit 1
fi