# 単体テスト

単体テストは、個々の関数やコンポーネントが期待通りに動作することを確認するためのテストです。

## 目的

- 個々の関数やコンポーネントが仕様通りに動作することを確認する
- バグの早期発見と修正を容易にする
- リファクタリングの安全性を確保する
- コードの品質を維持する

## テスト対象

- ユーティリティ関数 (`src/lib/`)
- カスタムフック (`src/hooks/`)
- UIコンポーネント (`src/components/`)
- APIルート (`src/app/api/`)

## ディレクトリ構造

単体テストは、テスト対象のファイルと同じディレクトリ階層の `__tests__` ディレクトリに配置します。

```
/src
  ├─ /lib                          # ユーティリティと共通関数
  │   ├─ /openai.ts                # OpenAI関連機能
  │   └─ /__tests__                # libディレクトリのテスト
  │       └─ /openai.test.ts       # OpenAIのテスト
  │
  ├─ /components                   # コンポーネント
  │   ├─ /ui                       # UIコンポーネント
  │   │   └─ /Button.tsx           # ボタンコンポーネント
  │   └─ /__tests__                # コンポーネントのテスト
  │       └─ /ui                   # UIコンポーネントのテスト
  │           └─ /Button.test.tsx  # ボタンコンポーネントのテスト
```

## テスト命名規則

- テストファイル: `[対象ファイル名].test.ts` または `[対象ファイル名].test.tsx`
- テストスイート: `describe('[関数名/コンポーネント名]', () => { ... })`
- テストケース: `it('[期待する動作]', () => { ... })` または `test('[期待する動作]', () => { ... })`

## テスト作成のガイドライン

### 一般的なガイドライン

1. 各テストは独立して実行できるようにする
2. テストは明確で理解しやすいものにする
3. テストケースは具体的な動作を検証する
4. モックは必要最小限にする

### 関数のテスト

```typescript
// src/lib/__tests__/openai.test.ts
import { generateText } from '../openai';
import { mockEnv } from '../../__tests__/utils/test-utils';

// 環境変数のモック
mockEnv({
  OPENAI_API_KEY: 'test-api-key',
});

describe('generateText', () => {
  it('正常系: テキストを生成できること', async () => {
    // テストコード
    const result = await generateText('テストプロンプト');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('異常系: APIキーがない場合はエラーをスローすること', async () => {
    // 環境変数を一時的に上書き
    const originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = '';

    // テストコード
    await expect(generateText('テストプロンプト')).rejects.toThrow();

    // 環境変数を元に戻す
    process.env.OPENAI_API_KEY = originalEnv;
  });
});
```

### コンポーネントのテスト

```typescript
// src/components/__tests__/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../ui/Button';

describe('Button', () => {
  it('ボタンがレンダリングされること', () => {
    render(<Button>テスト</Button>);
    const button = screen.getByText('テスト');
    expect(button).toBeInTheDocument();
  });

  it('クリックイベントが発火すること', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>テスト</Button>);
    const button = screen.getByText('テスト');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled属性が適用されること', () => {
    render(<Button disabled>テスト</Button>);
    const button = screen.getByText('テスト');
    expect(button).toBeDisabled();
  });
});
```

## テストカバレッジ

単体テストは、以下の基準を目標とします：

- 関数/メソッド: 80%以上
- 分岐カバレッジ: 70%以上
- 行カバレッジ: 75%以上

ただし、これらの数値は目安であり、コードの重要度や複雑さに応じて調整します。