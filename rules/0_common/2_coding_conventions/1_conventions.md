# コーディング規約

このドキュメントでは、プロジェクト全体で適用されるコーディング規約を定義します。これらの規約に従うことで、コードの一貫性と可読性を確保し、チーム開発をスムーズに進めることができます。

## 基本方針

「お金をかけずに初心者が実装しやすい」方針を優先し、厳密すぎるルールは設定しません。最低限の Lint/Formatter を導入し、シンプルな規約を設けます。

## 命名規則

- **ファイル名**:
  - コンポーネント: パスカルケース (例: `Button.tsx`, `UserProfile.jsx`)
  - ユーティリティ/サービス: キャメルケース (例: `apiClient.ts`, `userService.js`)
  - 定数/設定ファイル: キャメルケース (例: `config.ts`, `constants.js`)

- **変数/関数**:
  - キャメルケースで統一 (例: `getUserData`, `fetchItems`)
  - プライベート変数/関数の先頭にはアンダースコアを付ける (例: `_privateMethod`)

- **クラス/インターフェース/型**:
  - パスカルケースで統一 (例: `UserService`, `ApiResponse`)

- **定数**:
  - 大文字のスネークケースで統一 (例: `MAX_RETRY_COUNT`, `API_BASE_URL`)

- **コンポーネントprops**:
  - キャメルケースで統一 (例: `onClick`, `userData`)

- **CSSクラス名**:
  - Tailwind ユーティリティを使用するため、命名は最小限
  - カスタムクラスが必要な場合は、ケバブケースを使用 (例: `user-card`, `nav-item`)

## コメント

- 複雑なロジックには必ずコメントを付ける
- JSDoc形式でAPI関数にはドキュメントコメントを記述
- コメントは「何をしているか」ではなく「なぜそうしているか」を説明する

```typescript
// 良い例
// ユーザーが非アクティブの場合はキャッシュから除外する
if (user.isActive) {
  cache.set(user.id, user);
}

// 悪い例
// ユーザーをキャッシュに設定
if (user.isActive) {
  cache.set(user.id, user);
}
```

## コード構造

- 関数は単一責任の原則に従い、一つのことだけを行うようにする
- 関数の長さは画面の高さ（約30行）を超えないようにする
- ネストは3レベル以上深くならないようにする
- 早期リターンを活用して、ネストを減らす

```typescript
// 良い例
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return { error: 'User is not active' };

  // メイン処理
  return transformUser(user);
}

// 悪い例
function processUser(user) {
  if (user) {
    if (user.isActive) {
      // メイン処理
      return transformUser(user);
    } else {
      return { error: 'User is not active' };
    }
  } else {
    return null;
  }
}
```

## エラーハンドリング

- try/catchブロックを適切に使用する
- エラーメッセージは具体的かつユーザーフレンドリーにする
- エラーはログに記録し、必要に応じてモニタリングシステムに通知する

## インポート順序

1. 外部ライブラリ
2. 内部モジュール（相対パスではないもの）
3. 相対パスでのインポート

```typescript
// 外部ライブラリ
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 内部モジュール
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

// 相対パスでのインポート
import { UserCard } from '../UserCard';
import styles from './styles.module.css';
```

## Lint / Formatter

1. **ESLint**
   - Next.js プロジェクト作成時に自動設定されることが多い
   - "extends: next/core-web-vitals" などを採用

2. **Prettier**
   - コードフォーマット統一
   - コミット時に自動整形 (husky + lint-staged など追加可)

## 型定義（TypeScript）

- `any`型の使用は最小限に抑える
- 共通の型は`/types`ディレクトリに定義
- 関数の引数と戻り値には必ず型を指定する
- ジェネリック型を適切に活用する

```typescript
// 良い例
function getUser<T extends User>(id: string): Promise<T | null> {
  // ...
}

// 悪い例
function getUser(id) {
  // ...
}
```

## テストコードのディレクトリ構造

テストコードは以下のディレクトリ構造に従って配置します：

```
/src
  ├─ /lib                          # ユーティリティと共通関数
  │   ├─ /openai.ts                # OpenAI関連機能
  │   ├─ /discord.ts               # Discord関連機能
  │   ├─ /supabase.ts              # Supabase関連機能
  │   └─ /__tests__                # libディレクトリのテスト
  │       ├─ /openai.test.ts       # OpenAIのテスト
  │       ├─ /discord.test.ts      # Discordのテスト
  │       └─ /supabase.test.ts     # Supabaseのテスト
  │
  ├─ /components                   # コンポーネント
  │   ├─ /ui                       # UIコンポーネント
  │   └─ /__tests__                # コンポーネントのテスト
  │       └─ /ui                   # UIコンポーネントのテスト
  │
  ├─ /app                          # Next.jsのApp Router
  │   └─ /__tests__                # アプリケーションのテスト
  │
  └─ /__tests__                    # 全体的なテスト
      ├─ /utils                    # テスト用ユーティリティ
      ├─ /e2e                      # E2Eテスト
      └─ /integration              # 統合テスト
```

### テストファイルの命名規則

- 単体テスト: `*.test.ts` または `*.test.tsx`
- 統合テスト: `*.test.ts` または `*.integration.test.ts`
- E2Eテスト: `*.spec.ts` または `*.e2e.spec.ts`

### テストコードの構造

テストコードは以下の構造に従って記述します：

```typescript
// 1. インポート
import { functionToTest } from '../path/to/function';
import { mockData } from '../../__tests__/utils/test-utils';

// 2. モックの設定（必要な場合）
jest.mock('../path/to/dependency', () => ({
  dependencyFunction: jest.fn(),
}));

// 3. テストスイート
describe('functionToTest', () => {
  // 4. 前処理
  beforeEach(() => {
    // テスト前の準備
  });

  // 5. 後処理
  afterEach(() => {
    // テスト後のクリーンアップ
    jest.clearAllMocks();
  });

  // 6. テストケース
  it('正常系: 期待通りの結果を返すこと', () => {
    // テストコード
    const result = functionToTest(mockData);
    expect(result).toEqual(expectedResult);
  });

  it('異常系: エラーがスローされること', () => {
    // テストコード
    expect(() => functionToTest(invalidData)).toThrow();
  });
});
```

## まとめ

これらの規約は、コードの品質を維持しながらも、初心者が参加しやすい環境を作るために設計されています。プロジェクトの進行に合わせて、必要に応じて規約を更新していきます。