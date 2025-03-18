#!/bin/bash

# GitHub関連のファイルをコミット
git commit -m "CI/CD: Update workflow files"

# すべての変更をコミット
git add -A
git commit -m "docs,rules,scripts: Update documentation, rules and add scripts"

# プッシュ
git push
