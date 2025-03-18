# テスト戦略

このディレクトリには、プロジェクトのテスト戦略に関するドキュメントが含まれています。

## ドキュメント構造

```
/rules/0_common/4_test_strategy/
├── README.md                     # このファイル
├── 1_strategy.md                 # テスト戦略の概要
├── 1_test_types/                 # テストの種類
│   ├── 1_unit_tests.md           # 単体テスト
│   ├── 2_integration_tests.md    # 統合テスト
│   └── 3_e2e_tests.md            # E2Eテスト
├── 2_test_tools/                 # テストツール
│   ├── 1_jest.md                 # Jest
│   └── 2_cypress_playwright.md   # Cypress/Playwright
└── 2_test_structure.md           # テストディレクトリ構造
```

## テスト戦略の概要

テスト戦略では、以下の要素を定義しています：

1. [テスト戦略の概要](./1_strategy.md) - テスト戦略の全体像
2. テストの種類
   - [単体テスト](./1_test_types/1_unit_tests.md) - 個々のコンポーネントや関数のテスト
   - [統合テスト](./1_test_types/2_integration_tests.md) - 複数のモジュールの連携テスト
   - [E2Eテスト](./1_test_types/3_e2e_tests.md) - アプリケーション全体の動作テスト
3. テストツール
   - [Jest](./2_test_tools/1_jest.md) - 単体・統合テスト用フレームワーク
   - [Cypress/Playwright](./2_test_tools/2_cypress_playwright.md) - E2Eテスト用フレームワーク
4. [テストディレクトリ構造](./2_test_structure.md) - テストコードの配置方法

## テストディレクトリ構造

プロジェクトのテストディレクトリ構造の詳細については、[テストディレクトリ構造](./2_test_structure.md)を参照してください。この文書では、テストコードの配置方法、命名規則、ディレクトリ構成などを定義しています。