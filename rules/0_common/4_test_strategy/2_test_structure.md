# テストディレクトリ構造

このドキュメントでは、プロジェクトのテストに関するディレクトリ構造を定義します。適切なテストディレクトリ構造を持つことで、テストの管理と実行が容易になり、コードの品質を確保できます。

## テストディレクトリの基本構造

テストコードは、以下のディレクトリ構造に従って配置します：

```
/src
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

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
};
```

### Jest設定（jest.setup.js）

```javascript
import '@testing-library/jest-dom';
import { server } from './src/__tests__/mocks/server';

// MSWのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Playwright設定（playwright.config.ts）

```typescript
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
};

export default config;
```

## テスト実行コマンド

以下のコマンドをpackage.jsonに追加します：

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=src/__tests__/unit",
    "test:integration": "jest --testPathPattern=src/__tests__/integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  }
}
```

## まとめ

この構造に従うことで、テストの管理と実行が容易になり、コードの品質を確保できます。テストディレクトリ構造は、プロジェクトの成長に合わせて柔軟に拡張できます。