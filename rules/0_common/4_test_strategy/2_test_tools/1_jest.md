# Jest

Jestは、JavaScriptのテストフレームワークで、単体テストと統合テストに使用します。

## 設定

プロジェクトでは、以下の設定でJestを使用します：

```javascript
// jest.config.js
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
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(test).ts?(x)'],
};
```

## セットアップファイル

```javascript
// jest.setup.js
// テスト実行前の環境設定
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.OPENAI_API_KEY = 'test-api-key';
```

```javascript
// jest.setup.afterEnv.js
// テスト実行後の環境設定
import '@testing-library/jest-dom';

// グローバルなモックのセットアップ
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}));
```

## テスト実行

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- path/to/test.test.ts

# 単体テストのみ実行
npm run test:unit

# 統合テストのみ実行
npm run test:integration

# E2Eテストのみ実行
npm run test:e2e

# テストカバレッジを計測
npm run test:coverage
```

## マッチャー

Jestでは、以下のマッチャーを使用してアサーションを行います：

```typescript
// 値の検証
expect(value).toBe(expected);        // 厳密等価性（===）
expect(value).toEqual(expected);     // 深い等価性
expect(value).toBeDefined();         // undefined でないこと
expect(value).toBeNull();            // null であること
expect(value).toBeTruthy();          // truthy であること
expect(value).toBeFalsy();           // falsy であること

// 数値の検証
expect(value).toBeGreaterThan(expected);
expect(value).toBeLessThan(expected);
expect(value).toBeCloseTo(expected, numDigits);

// 文字列の検証
expect(string).toMatch(/pattern/);
expect(string).toContain(substring);

// 配列の検証
expect(array).toContain(item);
expect(array).toHaveLength(length);

// オブジェクトの検証
expect(object).toHaveProperty(keyPath, value);

// 例外の検証
expect(() => { throw new Error() }).toThrow();
expect(() => { throw new Error('message') }).toThrow('message');

// 非同期コードの検証
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## モック

Jestでは、以下の方法でモックを作成します：

```typescript
// 関数のモック
const mockFn = jest.fn();
mockFn.mockReturnValue(value);
mockFn.mockResolvedValue(value);
mockFn.mockRejectedValue(error);

// モジュールのモック
jest.mock('./path/to/module', () => ({
  functionName: jest.fn(),
}));

// スパイ
const spy = jest.spyOn(object, 'method');
```

## テストの構造

```typescript
// グループ化
describe('グループ名', () => {
  // 前処理
  beforeAll(() => {
    // テスト前の準備（1回のみ）
  });

  beforeEach(() => {
    // 各テスト前の準備
  });

  // テストケース
  it('テスト名', () => {
    // テストコード
  });

  test('テスト名', () => {
    // テストコード
  });

  // 後処理
  afterEach(() => {
    // 各テスト後のクリーンアップ
  });

  afterAll(() => {
    // テスト後のクリーンアップ（1回のみ）
  });
});
```

## React Testing Library

Reactコンポーネントのテストには、React Testing Libraryを使用します：

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('ボタンがレンダリングされること', () => {
    render(<Button>テスト</Button>);

    // テキストでの要素取得
    const button = screen.getByText('テスト');
    expect(button).toBeInTheDocument();

    // ロールでの要素取得
    const buttonByRole = screen.getByRole('button', { name: 'テスト' });
    expect(buttonByRole).toBeInTheDocument();
  });

  it('クリックイベントが発火すること', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>テスト</Button>);

    // fireEventを使用したイベント発火
    const button = screen.getByText('テスト');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // userEventを使用したイベント発火（より実際のユーザー操作に近い）
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('非同期処理の結果が表示されること', async () => {
    render(<AsyncComponent />);

    // ボタンをクリック
    userEvent.click(screen.getByText('データを取得'));

    // 非同期処理の完了を待機
    await waitFor(() => {
      expect(screen.getByText('データ取得完了')).toBeInTheDocument();
    });
  });
});
```