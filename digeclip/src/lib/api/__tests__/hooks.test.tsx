import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContents, useContentDetail, useSources, useAuth, useCreateSource } from '../hooks';
import { api } from '../index';
import { ReactNode } from 'react';

// APIのモック
jest.mock('../index', () => ({
  api: {
    user: {
      getContents: jest.fn(),
      getContentDetail: jest.fn(),
    },
    admin: {
      getSources: jest.fn(),
      createSource: jest.fn(),
    },
    auth: {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      isLoggedIn: jest.fn(),
      getToken: jest.fn(),
    },
  },
}));

// テスト用のラッパーコンポーネント
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // display nameを追加
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('API Hooks', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // useContentsフックのテスト
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

    // 初期状態はローディング中
    expect(result.current.isLoading).toBe(true);

    // データが取得されるまで待機
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // APIが正しく呼び出されたか確認
    expect(api.user.getContents).toHaveBeenCalledWith({ page: 1, limit: 10 });

    // 結果が期待通りか確認
    expect(result.current.data).toEqual(mockResponse);
  });

  // useContentDetailフックのテスト
  test('useContentDetail フックが正しくコンテンツ詳細を取得すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: {
        id: '1',
        title: 'コンテンツ1',
        content_text: 'コンテンツの本文',
        summaries: [
          { id: 's1', type: 'short', text: '短い要約' },
        ],
      },
    };

    (api.user.getContentDetail as jest.Mock).mockResolvedValueOnce(mockResponse);

    // フックをレンダリング
    const { result } = renderHook(() => useContentDetail('1'), {
      wrapper: createWrapper(),
    });

    // 初期状態はローディング中
    expect(result.current.isLoading).toBe(true);

    // データが取得されるまで待機
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // APIが正しく呼び出されたか確認
    expect(api.user.getContentDetail).toHaveBeenCalledWith('1');

    // 結果が期待通りか確認
    expect(result.current.data).toEqual(mockResponse);
  });

  // useSourcesフックのテスト
  test('useSources フックが正しくソース一覧を取得すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: [
        { id: '1', name: 'ソース1' },
        { id: '2', name: 'ソース2' },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
      },
    };

    (api.admin.getSources as jest.Mock).mockResolvedValueOnce(mockResponse);

    // フックをレンダリング
    const { result } = renderHook(() => useSources({ is_active: true }), {
      wrapper: createWrapper(),
    });

    // 初期状態はローディング中
    expect(result.current.isLoading).toBe(true);

    // データが取得されるまで待機
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // APIが正しく呼び出されたか確認
    expect(api.admin.getSources).toHaveBeenCalledWith({ is_active: true });

    // 結果が期待通りか確認
    expect(result.current.data).toEqual(mockResponse);
  });

  // useAuthフックのテスト
  test('useAuth フックが正しく認証機能を提供すること', async () => {
    // isLoggedInのモック
    (api.auth.isLoggedIn as jest.Mock).mockReturnValue(true);

    // フックをレンダリング
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // ログイン状態が正しいか確認
    expect(result.current.isLoggedIn).toBe(true);

    // ログイン機能のテスト
    const loginData = { email: 'test@example.com', password: 'password123' };
    const loginResponse = { data: { token: 'test_token', user: { id: '1' } } };

    (api.auth.login as jest.Mock).mockResolvedValueOnce(loginResponse);

    // ログイン処理を実行
    result.current.login.mutate(loginData);

    // ミューテーションが完了するまで待機
    await waitFor(() => expect(result.current.login.isSuccess).toBe(true));

    // APIが正しく呼び出されたか確認
    expect(api.auth.login).toHaveBeenCalledWith(loginData);
  });

  // useCreateSourceフックのテスト
  test('useCreateSource フックが正しくソースを作成すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: {
        id: '1',
        name: '新しいソース',
        url: 'https://example.com/feed',
      },
    };

    (api.admin.createSource as jest.Mock).mockResolvedValueOnce(mockResponse);

    // フックをレンダリング
    const { result } = renderHook(() => useCreateSource(), {
      wrapper: createWrapper(),
    });

    // ソース作成データ
    const sourceData = {
      name: '新しいソース',
      url: 'https://example.com/feed',
      type: 'RSS' as const,
      icon_url: 'https://example.com/icon.png',
      description: 'ソースの説明',
      is_active: true,
    };

    // ソース作成処理を実行
    result.current.mutate(sourceData);

    // ミューテーションが完了するまで待機
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // APIが正しく呼び出されたか確認
    expect(api.admin.createSource).toHaveBeenCalledWith(sourceData);

    // 結果が期待通りか確認
    expect(result.current.data).toEqual(mockResponse);
  });
});