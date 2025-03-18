# テストディレクトリ構造

このドキュメントでは、テストコードの構造と整理方法について詳細を説明します。

## テストディレクトリの基本構造

```
/digeclip/src
  └─ /__tests__                    # テストコード
      ├─ /unit                     # 単体テスト
      │   ├─ /components           # コンポーネントの単体テスト
      │   │   ├─ /ui               # UIコンポーネント
      │   │   │   ├─ Button.test.tsx
      │   │   │   └─ ...
      │   │   ├─ /layout           # レイアウトコンポーネント
      │   │   └─ /features         # 機能別コンポーネント
      │   ├─ /hooks                # カスタムフックのテスト
      │   │   ├─ useAuth.test.ts
      │   │   └─ ...
      │   ├─ /lib                  # ユーティリティのテスト
      │   │   ├─ /services         # サービスのテスト
      │   │   ├─ /utils            # ユーティリティのテスト
      │   │   └─ ...
      │   └─ /context              # コンテキストのテスト
      │
      ├─ /integration              # 統合テスト
      │   ├─ /api                  # API統合テスト
      │   │   ├─ auth.test.ts
      │   │   └─ ...
      │   ├─ /services             # サービス統合テスト
      │   └─ /features             # 機能結合テスト
      │
      ├─ /e2e                      # E2Eテスト
      │   ├─ /auth                 # 認証関連E2Eテスト
      │   │   ├─ login.test.ts
      │   │   └─ ...
      │   ├─ /contents             # コンテンツ関連E2Eテスト
      │   │   ├─ contentList.test.ts
      │   │   └─ ...
      │   └─ /settings             # 設定関連E2Eテスト
      │
      ├─ /utils                    # テスト用ユーティリティ
      │   ├─ test-utils.ts         # テスト共通ユーティリティ
      │   ├─ renderWithProviders.tsx # プロバイダ付きのレンダリングヘルパー
      │   └─ ...
      │
      └─ /mocks                    # モックデータとハンドラー
          ├─ /data                 # モックデータ
          │   ├─ sources.ts
          │   ├─ contents.ts
          │   └─ ...
          ├─ /handlers             # MSWリクエストハンドラー
          │   ├─ auth.ts
          │   └─ ...
          └─ /server.ts            # MSWサーバー設定
```

ルートディレクトリには以下の設定ファイルも配置します：

```
/
├─ jest.config.js                # Jest設定
├─ jest.setup.js                 # Jestセットアップ
└─ playwright.config.ts          # Playwright設定（E2Eテスト用）
```

## テストの種類別の構造

### 単体テスト（Unit Tests）

単体テストは、個々のコンポーネント、関数、フックなどの小さな単位をテストします。

- **テストツール**: Jest + React Testing Library
- **ディレクトリ**: `/__tests__/unit/`
- **ファイル命名規則**: `*.test.ts` または `*.test.tsx`
- **構造原則**: ソースコードの構造を反映する

### 統合テスト（Integration Tests）

統合テストは、複数のコンポーネントや機能が連携して正しく動作することを確認します。

- **テストツール**: Jest + React Testing Library + MSW
- **ディレクトリ**: `/__tests__/integration/`
- **ファイル命名規則**: `*.test.ts` または `*.test.tsx`
- **構造原則**: 機能ごとにグループ化する

### E2Eテスト（End-to-End Tests）

E2Eテストは、実際のユーザーシナリオに沿ってアプリケーション全体が正しく動作することを確認します。

- **テストツール**: Playwright または Cypress
- **ディレクトリ**: `/__tests__/e2e/`
- **ファイル命名規則**: `*.test.ts`
- **構造原則**: ユーザーフローごとにグループ化する

## サポートディレクトリ

### ユーティリティ（Utils）

テスト間で共有される便利な関数やヘルパーを提供します。

- **ディレクトリ**: `/__tests__/utils/`
- **内容**:
  - `test-utils.ts`: 共通ヘルパー関数
  - `renderWithProviders.tsx`: プロバイダー付きのコンポーネントレンダリング
  - カスタムマッチャーなど

### モック（Mocks）

テストで使用するモックデータとリクエストハンドラーを定義します。

- **ディレクトリ**: `/__tests__/mocks/`
- **内容**:
  - `/data/`: モックデータオブジェクト
  - `/handlers/`: MSWリクエストハンドラー
  - `server.ts`: MSWサーバー設定

## テストファイルの配置原則

1. **単体テスト**:
   - テスト対象のソースコードと同じ構造を反映
   - 例：`/components/ui/Button.tsx` → `/__tests__/unit/components/ui/Button.test.tsx`

2. **統合テスト**:
   - 機能やモジュールの連携に焦点を当てた構造
   - 例：認証フロー全体をテスト → `/__tests__/integration/auth/authFlow.test.tsx`

3. **E2Eテスト**:
   - ユーザーストーリーやユースケースに基づく構造
   - 例：ログインフロー → `/__tests__/e2e/auth/login.test.ts`

## テストディレクトリ構造の利点

1. **明確な分離**: テストの種類ごとに明確に分離することで、テストの目的と範囲が明確になる
2. **容易な実行**: 特定の種類のテストのみを実行することが容易
3. **構造の一貫性**: ソースコードの構造を反映することで、テストファイルの場所が予測しやすくなる
4. **再利用性**: ユーティリティとモックを共有することで、コードの重複を減らす

## テスト関連設定ファイル

### Jest設定（jest.config.js）

```js
// jest.config.js
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // テスト環境のNext.jsアプリのパスを指定
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  // テストマッチングパターン
  testMatch: [
    '<rootDir>/digeclip/src/__tests__/unit/**/*.test.{ts,tsx}',
    '<rootDir>/digeclip/src/__tests__/integration/**/*.test.{ts,tsx}',
  ],

  // モジュール変換の設定
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // テスト環境
  testEnvironment: 'jest-environment-jsdom',

  // パスエイリアス
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/digeclip/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // カバレッジの設定
  collectCoverageFrom: [
    'digeclip/src/**/*.{ts,tsx}',
    '!digeclip/src/**/*.d.ts',
    '!digeclip/src/**/*.stories.{ts,tsx}',
    '!digeclip/src/types/**/*',
    '!digeclip/src/__tests__/**/*',
  ],

  // テスト前後の処理
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default createJestConfig(config);
```

### Jest設定（jest.setup.js）

```js
// jest.setup.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { server } from './digeclip/src/__tests__/mocks/server';

// MSWサーバーのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// グローバルなモックの設定
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
```

### Playwright設定（playwright.config.ts）

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './digeclip/src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## テスト実行コマンド

以下のコマンドをpackage.jsonに追加します：

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=digeclip/src/__tests__/unit",
    "test:integration": "jest --testPathPattern=digeclip/src/__tests__/integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```

## まとめ

この構造に従うことで、テストの管理と実行が容易になり、コードの品質を確保できます。テストディレクトリ構造は、プロジェクトの成長に合わせて柔軟に拡張できます。