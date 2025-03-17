# APIクライアント

このディレクトリには、バックエンドAPIとの通信を行うためのクライアントライブラリが含まれています。

## 構成

- `client.ts` - Axiosを使用したAPIクライアントの基本実装
- `auth.ts` - 認証関連のAPI（ログイン、ログアウトなど）
- `user.ts` - ユーザーロール関連のAPI（コンテンツ一覧、詳細など）
- `admin.ts` - 管理者ロール関連のAPI（ソース管理など）
- `hooks.ts` - React Queryを使用したAPIフック
- `index.ts` - 各APIサービスをまとめてエクスポート
- `__tests__/` - テストコード

## 使用例

### 認証

```tsx
import { api } from '@/lib/api';

// ログイン
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await api.auth.login({ email, password });
    console.log('ログイン成功:', response.data);
    // ログイン後の処理
  } catch (error) {
    console.error('ログインエラー:', error);
  }
};

// ログアウト
const handleLogout = async () => {
  try {
    await api.auth.logout();
    console.log('ログアウト成功');
    // ログアウト後の処理
  } catch (error) {
    console.error('ログアウトエラー:', error);
  }
};

// ログイン状態の確認
const isLoggedIn = api.auth.isLoggedIn();
```

### React Queryを使用した認証

```tsx
import { useAuth } from '@/lib/api';

const LoginForm = () => {
  const { login } = useAuth();

  const handleSubmit = async (data: { email: string; password: string }) => {
    login.mutate(data, {
      onSuccess: response => {
        console.log('ログイン成功:', response.data);
        // ログイン後の処理
      },
      onError: error => {
        console.error('ログインエラー:', error);
      },
    });
  };

  return (
    <form onSubmit={/* フォーム送信処理 */}>
      {/* フォームの内容 */}
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
};
```

### ユーザーAPI

```tsx
import { api } from '@/lib/api';

// コンテンツ一覧の取得
const fetchContents = async () => {
  try {
    const response = await api.user.getContents({
      page: 1,
      limit: 10,
      sort: 'published_at:desc',
    });
    console.log('コンテンツ一覧:', response.data);
    console.log('メタ情報:', response.meta);
  } catch (error) {
    console.error('コンテンツ取得エラー:', error);
  }
};

// コンテンツ詳細の取得
const fetchContentDetail = async (contentId: string) => {
  try {
    const response = await api.user.getContentDetail(contentId);
    console.log('コンテンツ詳細:', response.data);
  } catch (error) {
    console.error('コンテンツ詳細取得エラー:', error);
  }
};
```

### React Queryを使用したユーザーAPI

```tsx
import { useContents, useContentDetail } from '@/lib/api';

// コンテンツ一覧を表示するコンポーネント
const ContentsList = () => {
  const { data, isLoading, error } = useContents({
    page: 1,
    limit: 10,
    sort: 'published_at:desc',
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div>
      <h1>コンテンツ一覧</h1>
      <ul>{data?.data.map(content => <li key={content.id}>{content.title}</li>)}</ul>
      <div>
        全{data?.meta?.total}件中 {data?.meta?.page}/{data?.meta?.pages}ページ
      </div>
    </div>
  );
};

// コンテンツ詳細を表示するコンポーネント
const ContentDetail = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useContentDetail(id);

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  const content = data?.data;

  return (
    <div>
      <h1>{content?.title}</h1>
      <p>公開日: {new Date(content?.published_at || '').toLocaleDateString()}</p>
      <div>{content?.content_text}</div>

      <h2>要約</h2>
      {content?.summaries.map(summary => (
        <div key={summary.id}>
          <h3>{summary.type}要約</h3>
          <p>{summary.text}</p>
        </div>
      ))}
    </div>
  );
};
```

### 管理者API

```tsx
import { api } from '@/lib/api';

// ソース一覧の取得
const fetchSources = async () => {
  try {
    const response = await api.admin.getSources({
      is_active: true,
      sort: 'name:asc',
    });
    console.log('ソース一覧:', response.data);
  } catch (error) {
    console.error('ソース取得エラー:', error);
  }
};

// ソースの作成
const createSource = async () => {
  try {
    const response = await api.admin.createSource({
      name: '新しいソース',
      url: 'https://example.com/feed',
      type: 'RSS',
      icon_url: 'https://example.com/icon.png',
      description: 'ソースの説明',
      is_active: true,
    });
    console.log('ソース作成成功:', response.data);
  } catch (error) {
    console.error('ソース作成エラー:', error);
  }
};

// ソースの更新
const updateSource = async (sourceId: string) => {
  try {
    const response = await api.admin.updateSource(sourceId, {
      name: '更新されたソース',
      url: 'https://example.com/feed',
      type: 'RSS',
      icon_url: 'https://example.com/icon.png',
      description: '更新された説明',
      is_active: true,
    });
    console.log('ソース更新成功:', response.data);
  } catch (error) {
    console.error('ソース更新エラー:', error);
  }
};

// ソースの削除
const deleteSource = async (sourceId: string) => {
  try {
    await api.admin.deleteSource(sourceId);
    console.log('ソース削除成功');
  } catch (error) {
    console.error('ソース削除エラー:', error);
  }
};
```

### React Queryを使用した管理者API

```tsx
import { useSources, useCreateSource, useUpdateSource, useDeleteSource } from '@/lib/api';

// ソース管理コンポーネント
const SourcesManager = () => {
  const { data, isLoading } = useSources({ is_active: true });
  const createSource = useCreateSource();
  const updateSource = useUpdateSource('source_id');
  const deleteSource = useDeleteSource();

  const handleCreate = () => {
    createSource.mutate({
      name: '新しいソース',
      url: 'https://example.com/feed',
      type: 'RSS',
      icon_url: 'https://example.com/icon.png',
      description: 'ソースの説明',
      is_active: true,
    });
  };

  const handleUpdate = (id: string) => {
    updateSource.mutate({
      name: '更新されたソース',
      url: 'https://example.com/feed',
      type: 'RSS',
      icon_url: 'https://example.com/icon.png',
      description: '更新された説明',
      is_active: true,
    });
  };

  const handleDelete = (id: string) => {
    deleteSource.mutate(id);
  };

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>ソース管理</h1>
      <button onClick={handleCreate} disabled={createSource.isPending}>
        新規ソース追加
      </button>

      <ul>
        {data?.data.map(source => (
          <li key={source.id}>
            {source.name}
            <button onClick={() => handleUpdate(source.id)}>編集</button>
            <button onClick={() => handleDelete(source.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## エラーハンドリング

APIクライアントは、エラーハンドリングのためのインターセプターを実装しています。認証エラー（401）が発生した場合、自動的にログアウト処理が行われます。

```tsx
import { api, ApiError, ApiErrorCode } from '@/lib/api';
import axios from 'axios';

const handleApiCall = async () => {
  try {
    const response = await api.user.getContents();
    // 成功時の処理
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;

      // エラーコードに基づいた処理
      if (apiError.error.code === ApiErrorCode.BAD_REQUEST) {
        console.error('入力データが不正です:', apiError.error.message);
      } else if (apiError.error.code === ApiErrorCode.UNAUTHORIZED) {
        console.error('認証が必要です');
      } else if (apiError.error.code === ApiErrorCode.FORBIDDEN) {
        console.error('権限がありません');
      } else {
        console.error('APIエラー:', apiError.error.message);
      }

      // フィールド固有のエラーメッセージがある場合
      if (apiError.error.details) {
        console.error('詳細エラー:', apiError.error.details);
      }
    } else {
      console.error('予期しないエラー:', error);
    }
  }
};
```

## テスト

APIクライアントとReact Queryフックのテストは、Jest と React Testing Library を使用して実装されています。

### テストの実行方法

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- client.test.ts

# 監視モードでテストを実行
npm test -- --watch
```

### テストの構成

- `__tests__/client.test.ts` - APIクライアントのテスト
- `__tests__/auth.test.ts` - 認証サービスのテスト
- `__tests__/hooks.test.tsx` - React Queryフックのテスト

### テストの例

```tsx
// APIクライアントのテスト例
test('get メソッドが正しくリクエストを送信し、レスポンスを返すこと', async () => {
  // モックレスポンスの設定
  const mockResponse = {
    data: {
      data: { id: '1', name: 'テストデータ' },
      meta: { total: 1 },
    },
  };

  mockedAxios.get.mockResolvedValueOnce(mockResponse);

  // APIクライアントのgetメソッドを呼び出し
  const result = await apiClient.get<{ id: string; name: string }>('/test');

  // axiosのgetメソッドが正しく呼び出されたか確認
  expect(mockedAxios.get).toHaveBeenCalledWith('/test', undefined);

  // 結果が期待通りか確認
  expect(result).toEqual(mockResponse.data);
});

// React Queryフックのテスト例
test('useContents フックが正しくコンテンツ一覧を取得すること', async () => {
  // モックレスポンスの設定
  const mockResponse = {
    data: [
      { id: '1', title: 'コンテンツ1' },
      { id: '2', title: 'コンテンツ2' },
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      pages: 1,
    },
  };

  (api.user.getContents as jest.Mock).mockResolvedValueOnce(mockResponse);

  // フックをレンダリング
  const { result } = renderHook(() => useContents({ page: 1, limit: 10 }), {
    wrapper: createWrapper(),
  });

  // データが取得されるまで待機
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // 結果が期待通りか確認
  expect(result.current.data).toEqual(mockResponse);
});
```
