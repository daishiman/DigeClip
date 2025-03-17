# Jest

## 概要

Jestは、JavaScriptとTypeScriptのテストフレームワークであり、特にReactアプリケーションのテストに適しています。シンプルな設定と強力な機能を持ち、単体テストと統合テストに使用します。

## 設定

### パッケージのインストール

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 基本設定（jest.config.js）

```javascript
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/digeclip/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'digeclip/src/**/*.{ts,tsx}',
    '!digeclip/src/**/*.d.ts',
    '!digeclip/src/**/*.stories.{ts,tsx}',
    '!digeclip/src/types/**/*',
    '!digeclip/src/__tests__/**/*',
  ],
};

export default config;
```

### セットアップファイル（jest.setup.js）

```javascript
import '@testing-library/jest-dom';
import { server } from './digeclip/src/__tests__/mocks/server';

// MSWサーバーのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 使用例

### コンポーネントのテスト

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct variant class', () => {
    render(<Button variant="primary">Primary Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### ユーティリティ関数のテスト

```typescript
// formatDate.test.ts
import { formatDate } from '@/lib/utils/formatDate';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2023-01-15T12:30:45');
    expect(formatDate(date)).toBe('2023/01/15');
  });

  it('formats dates with custom format', () => {
    const date = new Date('2023-01-15T12:30:45');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-15');
  });

  it('returns empty string for invalid date', () => {
    const date = new Date('invalid date');
    expect(formatDate(date)).toBe('');
  });
});
```

### カスタムフックのテスト

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import useCounter from '@/hooks/useCounter';

describe('useCounter', () => {
  it('should initialize counter with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize counter with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(4);
  });

  it('should reset counter to provided value', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(0);
  });
});
```

## ベストプラクティス

1. **テストファイルの命名規則**
   - テスト対象のファイルと同じ名前に `.test.ts(x)` を付ける
   - 例：`Button.tsx` → `Button.test.tsx`

2. **テスト構造**
   - `describe` ブロックでテストスイートをグループ化
   - `it` または `test` ブロックで個々のテストケースを記述
   - テスト名は「何をテストするか」が明確になるように記述

3. **テストカバレッジ**
   - 重要なロジックやコンポーネントは高いカバレッジを目指す
   - `npm test -- --coverage` でカバレッジレポートを生成

4. **モックの活用**
   - 外部依存（API、データベースなど）はモック化
   - `jest.mock()` や MSW を使用してAPIリクエストをモック

5. **スナップショットテスト**
   - UIコンポーネントの変更を検出するためにスナップショットテストを活用
   - `expect(component).toMatchSnapshot()`

## 注意点

- テストは独立していて、他のテストに依存しないようにする
- グローバルな状態を変更するテストはリセットを忘れずに
- 非同期コードをテストする場合は、適切に待機処理を行う
- テストパフォーマンスを考慮し、必要以上に複雑なテストを避ける
