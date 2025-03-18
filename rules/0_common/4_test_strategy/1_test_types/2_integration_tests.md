# 統合テスト (Integration Tests)

統合テストは、複数のコンポーネントやモジュールが連携して動作することを確認するテストです。単体テストでは検出できない、コンポーネント間の連携の問題を発見することができます。

## 統合テストの目的

- 複数のコンポーネントやモジュールが連携して正しく動作することを確認する
- APIとのデータのやり取りが正しく行われることを確認する
- ユーザーインターフェースとバックエンドロジックの統合を検証する
- 単体テストでは発見できない問題を検出する

## 対象となるコード

以下のようなコードが統合テストの対象となります：

1. **機能別コンポーネント**
   - フォームとバリデーションロジックの統合
   - データ取得コンポーネントとAPIフックの統合
   - 複数のUIコンポーネントの組み合わせ

2. **APIとのデータのやり取り**
   - APIリクエストの送信と応答の処理
   - エラーハンドリング
   - キャッシュの管理

3. **状態管理**
   - Contextの更新と子コンポーネントの再レンダリング
   - 複数のReducerの連携

## ディレクトリ構造

統合テストは、`digeclip/src/__tests__/integration` ディレクトリに配置します。

```
/digeclip/src
  └─ /__tests__                    # テストコード
      └─ /integration              # 統合テスト
          ├─ /api                  # API統合テスト
          │   ├─ auth.test.ts
          │   └─ ...
          ├─ /features             # 機能結合テスト
          │   ├─ SourceForm.test.tsx
          │   └─ ...
          └─ /pages                # ページ統合テスト
              ├─ dashboard.test.tsx
              └─ ...
```

詳細なテストディレクトリ構造については、[テストディレクトリ構造](../2_test_structure.md)を参照してください。

## テスト命名規則

- テストファイル: `[対象機能].test.ts` または `[対象機能].integration.test.ts`
- テストスイート: `describe('[機能名]', () => { ... })`
- テストケース: `it('[期待する動作]', () => { ... })` または `test('[期待する動作]', () => { ... })`

## テスト作成のガイドライン

### 一般的なガイドライン

1. 実際の依存関係を使用する（モックは最小限に）
2. テスト環境を適切に設定する
3. テストデータは自己完結的に用意する
4. テスト後は環境をクリーンアップする

### APIとデータベースの統合テスト

```typescript
// src/__tests__/integration/api/content.test.ts
import { createClient } from '@supabase/supabase-js';
import { createContent, getContent } from '../../../lib/content';
import { mockEnv } from '../../utils/test-utils';

// 環境変数のモック
mockEnv({
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
});

describe('Content API 統合テスト', () => {
  let supabase;
  let testContentId;

  beforeAll(async () => {
    // テスト用のSupabaseクライアントを作成
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // テストデータをクリーンアップ
    await supabase.from('contents').delete().eq('title', 'テスト用コンテンツ');
  });

  afterAll(async () => {
    // テストデータをクリーンアップ
    if (testContentId) {
      await supabase.from('contents').delete().eq('id', testContentId);
    }
  });

  it('コンテンツを作成して取得できること', async () => {
    // コンテンツを作成
    const newContent = {
      title: 'テスト用コンテンツ',
      body: 'これはテスト用のコンテンツです。',
    };

    const { data: createdContent, error: createError } = await createContent(newContent);
    expect(createError).toBeNull();
    expect(createdContent).toBeDefined();
    expect(createdContent.title).toBe(newContent.title);

    testContentId = createdContent.id;

    // 作成したコンテンツを取得
    const { data: retrievedContent, error: getError } = await getContent(testContentId);
    expect(getError).toBeNull();
    expect(retrievedContent).toBeDefined();
    expect(retrievedContent.id).toBe(testContentId);
    expect(retrievedContent.title).toBe(newContent.title);
  });
});
```

### フロントエンドとバックエンドの統合テスト

```typescript
// src/__tests__/integration/services/content.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentForm } from '../../../components/ContentForm';
import { mockEnv } from '../../utils/test-utils';

// 環境変数のモック
mockEnv({
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
});

describe('ContentForm 統合テスト', () => {
  it('フォーム送信時にコンテンツが作成されること', async () => {
    // モックサーバーのセットアップ（MSWなどを使用）
    // ...

    // コンポーネントをレンダリング
    render(<ContentForm />);

    // フォームに入力
    await userEvent.type(screen.getByLabelText('タイトル'), 'テスト用コンテンツ');
    await userEvent.type(screen.getByLabelText('本文'), 'これはテスト用のコンテンツです。');

    // フォームを送信
    await userEvent.click(screen.getByText('保存'));

    // 結果を確認
    await waitFor(() => {
      expect(screen.getByText('コンテンツが保存されました')).toBeInTheDocument();
    });
  });
});
```

## テスト環境

統合テストでは、以下の環境を使用します：

1. **テスト用データベース**
   - 本番環境とは別のテスト用データベースを使用
   - テスト前後にデータをクリーンアップ

2. **モックサーバー**
   - 外部APIとの通信をモック化（必要に応じて）
   - [MSW (Mock Service Worker)](https://mswjs.io/) などのツールを使用

3. **テスト用環境変数**
   - `.env.test` ファイルを用意
   - テスト用の認証情報を設定