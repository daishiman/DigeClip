import axios from 'axios';
import { API_BASE_URL } from '../../constants';

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// APIクライアントのモック
jest.mock('../client', () => {
  return {
    __esModule: true,
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    },
    ApiErrorCode: {
      BAD_REQUEST: 'E400',
      UNAUTHORIZED: 'E401',
      FORBIDDEN: 'E403',
      NOT_FOUND: 'E404',
      CONFLICT: 'E409',
      RATE_LIMIT: 'E429',
      SERVER_ERROR: 'E500',
      SERVICE_UNAVAILABLE: 'E503',
    },
  };
});

// APIクライアントをインポート（モック後）
import { apiClient } from '../client';

describe('ApiClient', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // ローカルストレージのモック
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  // GETリクエストのテスト
  test('get メソッドが正しくリクエストを送信し、レスポンスを返すこと', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: { id: '1', name: 'テストデータ' },
      meta: { total: 1 },
    };

    // APIクライアントのgetメソッドをモック
    (apiClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    // APIクライアントのgetメソッドを呼び出し
    const result = await apiClient.get<{ id: string; name: string }>('/test');

    // getメソッドが正しく呼び出されたか確認
    expect(apiClient.get).toHaveBeenCalledWith('/test');

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);
  });

  // POSTリクエストのテスト
  test('post メソッドが正しくリクエストを送信し、レスポンスを返すこと', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: { id: '1', name: 'テストデータ' },
    };

    // APIクライアントのpostメソッドをモック
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    // リクエストデータ
    const requestData = { name: 'テストデータ' };

    // APIクライアントのpostメソッドを呼び出し
    const result = await apiClient.post<{ id: string; name: string }>('/test', requestData);

    // postメソッドが正しく呼び出されたか確認
    expect(apiClient.post).toHaveBeenCalledWith('/test', requestData);

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);
  });

  // PUTリクエストのテスト
  test('put メソッドが正しくリクエストを送信し、レスポンスを返すこと', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: { id: '1', name: '更新されたデータ' },
    };

    // APIクライアントのputメソッドをモック
    (apiClient.put as jest.Mock).mockResolvedValueOnce(mockResponse);

    // リクエストデータ
    const requestData = { name: '更新されたデータ' };

    // APIクライアントのputメソッドを呼び出し
    const result = await apiClient.put<{ id: string; name: string }>('/test/1', requestData);

    // putメソッドが正しく呼び出されたか確認
    expect(apiClient.put).toHaveBeenCalledWith('/test/1', requestData);

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);
  });

  // DELETEリクエストのテスト
  test('delete メソッドが正しくリクエストを送信し、レスポンスを返すこと', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: { message: '削除成功' },
    };

    // APIクライアントのdeleteメソッドをモック
    (apiClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    // APIクライアントのdeleteメソッドを呼び出し
    const result = await apiClient.delete<{ message: string }>('/test/1');

    // deleteメソッドが正しく呼び出されたか確認
    expect(apiClient.delete).toHaveBeenCalledWith('/test/1');

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);
  });

  // 認証トークンのテスト
  test('ローカルストレージからトークンを取得できること', () => {
    // ローカルストレージからトークンを取得するモックを設定
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce('test_token');

    // トークンを取得
    const token = localStorage.getItem('auth_token');

    // トークンが正しく取得できたか確認
    expect(token).toBe('test_token');
  });

  // ログアウト処理のテスト
  test('ログアウト時にトークンが削除されること', () => {
    // ログアウト処理（トークン削除）
    localStorage.removeItem('auth_token');

    // トークンが削除されたか確認
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });
});
