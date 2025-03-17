# フロントエンドテスト仕様

## 概要

このドキュメントでは、DigeClipプロジェクトのフロントエンド部分に特化したテスト仕様を定義します。共通のテスト戦略については[共通テスト戦略](../../0_common/5_Testing_Strategy.md)を参照してください。

## 1. フロントエンド特有のテスト目標

- ユーザーインターフェースの一貫性と使いやすさの確保
- レスポンシブデザインの検証
- クロスブラウザ互換性の確保
- アクセシビリティ要件の遵守
- パフォーマンス最適化の検証

## 2. コンポーネントテスト

### 2.1 UIコンポーネントテスト

- **対象**: 個別のUIコンポーネント（ボタン、フォーム、カード等）
- **ツール**: React Testing Library
- **検証項目**:
  - レンダリングの正確性
  - プロップスの適切な処理
  - イベントハンドラの動作
  - 状態変化の正確性
  - アクセシビリティ（WAI-ARIA準拠）

### 2.2 テスト例

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 3. ページテスト

### 3.1 ページコンポーネントテスト

- **対象**: 完全なページコンポーネント
- **ツール**: React Testing Library, MSW（APIモック）
- **検証項目**:
  - ページの初期レンダリング
  - データフェッチングと表示
  - ユーザーインタラクション
  - ルーティング
  - エラー状態の処理

### 3.2 テスト例

```tsx
// HomePage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import HomePage from './HomePage';

const server = setupServer(
  rest.get('/api/articles', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: 'Article 1' },
      { id: 2, title: 'Article 2' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders articles from API', async () => {
  render(<HomePage />);

  // ローディング状態の確認
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // データ読み込み後の表示確認
  await waitFor(() => {
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });
});
```

## 4. 状態管理テスト

### 4.1 Recoil/Zustand状態テスト

- **対象**: 状態管理ロジック
- **ツール**: Jest、React Testing Library
- **検証項目**:
  - 状態の初期化
  - 状態の更新
  - セレクタの動作
  - 非同期アクション

### 4.2 テスト例

```tsx
// articleState.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useArticleStore } from './articleStore';

describe('Article Store', () => {
  it('should initialize with empty articles', () => {
    const { result } = renderHook(() => useArticleStore());
    expect(result.current.articles).toEqual([]);
  });

  it('should add articles', () => {
    const { result } = renderHook(() => useArticleStore());

    act(() => {
      result.current.addArticle({ id: 1, title: 'New Article' });
    });

    expect(result.current.articles).toEqual([
      { id: 1, title: 'New Article' }
    ]);
  });
});
```

## 5. カスタムフックテスト

### 5.1 カスタムフックテスト戦略

- **対象**: アプリケーション固有のReactフック
- **ツール**: `@testing-library/react-hooks`
- **検証項目**:
  - フックの戻り値
  - 状態更新
  - 副作用の実行
  - エラー処理

### 5.2 テスト例

```tsx
// useArticle.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useArticle } from './useArticle';

const server = setupServer(
  rest.get('/api/articles/1', (req, res, ctx) => {
    return res(ctx.json({ id: 1, title: 'Article 1' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches and returns article data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useArticle(1));

  expect(result.current.loading).toBe(true);
  expect(result.current.article).toBeNull();

  await waitForNextUpdate();

  expect(result.current.loading).toBe(false);
  expect(result.current.article).toEqual({ id: 1, title: 'Article 1' });
});
```

## 6. E2Eテスト（フロントエンド視点）

### 6.1 E2Eテスト戦略

- **対象**: 重要なユーザーフロー
- **ツール**: Cypress
- **検証項目**:
  - ユーザー登録・ログイン
  - コンテンツ閲覧・操作
  - フォーム送信
  - ナビゲーション
  - エラー処理

### 6.2 テスト例

```js
// cypress/integration/login.spec.js
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // ログイン後のリダイレクト確認
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Dashboard');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
});
```

## 7. ビジュアルリグレッションテスト

### 7.1 ビジュアルテスト戦略

- **対象**: UIコンポーネントとページ
- **ツール**: Storybook + Chromatic または Cypress + Percy
- **検証項目**:
  - コンポーネントの視覚的一貫性
  - レスポンシブデザイン
  - テーマ切り替え
  - アニメーション

### 7.2 実装アプローチ

- Storybookでコンポーネントカタログを作成
- Chromaticでビジュアルテストを自動化
- CIパイプラインに統合

## 8. パフォーマンステスト

### 8.1 パフォーマンス指標

- **First Contentful Paint (FCP)**: 2秒以内
- **Largest Contentful Paint (LCP)**: 2.5秒以内
- **Time to Interactive (TTI)**: 3.5秒以内
- **Total Blocking Time (TBT)**: 300ms以内
- **Cumulative Layout Shift (CLS)**: 0.1以下

### 8.2 テストツール

- Lighthouse CI
- Web Vitals
- Next.js Analytics

### 8.3 実装アプローチ

- CIパイプラインでLighthouseレポート生成
- 本番環境でのWeb Vitalsモニタリング
- パフォーマンスバジェットの設定と監視

## 9. アクセシビリティテスト

### 9.1 アクセシビリティ要件

- WCAG 2.1 AA準拠
- スクリーンリーダー対応
- キーボードナビゲーション
- 色コントラスト

### 9.2 テストツール

- jest-axe
- Cypress-axe
- Lighthouse Accessibility Audit

### 9.3 テスト例

```tsx
// Button.test.tsx (アクセシビリティテスト追加)
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## 10. フロントエンド特有のテスト環境設定

### 10.1 Jest設定

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

### 10.2 Cypress設定

```js
// cypress.json
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "video": false,
  "screenshotOnRunFailure": true,
  "integrationFolder": "cypress/integration",
  "testFiles": "**/*.spec.js",
  "env": {
    "apiUrl": "http://localhost:3000/api"
  }
}
```

## 11. CI/CDパイプラインでのフロントエンドテスト

### 11.1 GitHub Actions設定例

```yaml
# .github/workflows/frontend-tests.yml
name: Frontend Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'components/**'
      - 'pages/**'
      - 'hooks/**'
      - 'styles/**'
      - 'public/**'
      - 'package.json'
      - 'jest.config.js'
      - 'cypress/**'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Cypress run
        uses: cypress-io/github-action@v2
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
```

## 12. フロントエンドテストの優先順位

1. **最優先**: 重要なユーザーフロー（ログイン、記事閲覧、ダイジェスト作成など）
2. **高優先度**: 共有コンポーネント、状態管理ロジック
3. **中優先度**: 個別ページコンポーネント、カスタムフック
4. **低優先度**: 視覚的な細部、エッジケース

## 13. フロントエンド特有のテストデータ

### 13.1 モックデータ

- ユーザープロファイル
- 記事データ
- コメントデータ
- 通知データ

### 13.2 データ管理

- `__mocks__` ディレクトリにモックデータを集約
- ファクトリー関数でテストデータを生成
- MSWでAPIレスポンスをモック

## 14. フロントエンドテストのトラブルシューティング

### 14.1 よくある問題と解決策

- **テストが不安定**: タイミング問題を `waitFor` や `findBy*` クエリで解決
- **スタイル関連のエラー**: CSSモジュールのモック設定を確認
- **非同期テストの失敗**: 適切な待機メカニズムの使用を確認
- **コンポーネントが見つからない**: クエリ選択方法を見直し（テキスト、ロール、テストID）

### 14.2 デバッグ方法

- `screen.debug()` を使用してDOMをコンソールに出力
- Cypressの `cy.pause()` を使用して実行を一時停止
- テスト失敗時のスクリーンショットを確認