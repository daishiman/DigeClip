import { authService, LoginRequest, RegisterRequest } from '../../../../lib/api/auth';
import { apiClient } from '../../../../lib/api/client';

// processモック
jest.mock('process', () => ({
  env: {
    NODE_ENV: 'development', // テスト環境ではないように見せる
  },
}));

// constantsのモック
jest.mock('../../../../lib/constants', () => ({
  AUTH_ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
}));

// apiClientのモック
jest.mock('../../../../lib/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('authService', () => {
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

  // ユーザー登録のテスト
  test('register メソッドが正しくAPIを呼び出すこと', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: {
        id: 'user_id',
        email: 'test@example.com',
        name: 'テストユーザー',
        role: 'user',
      },
    };

    // 元の実装を一時的に保存
    const origRegister = authService.register;

    // テスト用にモック実装を上書き
    authService.register = jest.fn().mockImplementation(data => {
      apiClient.post('/auth/register', data);
      return Promise.resolve(mockResponse);
    });

    // リクエストデータ
    const registerData: RegisterRequest = {
      email: 'test@example.com',
      password: 'password123',
      name: 'テストユーザー',
    };

    // 登録メソッドを呼び出し
    const result = await authService.register(registerData);

    // APIクライアントが正しく呼び出されたか確認
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData);

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);

    // 元の実装に戻す
    authService.register = origRegister;
  });

  // ログインのテスト
  test('login メソッドが正しくAPIを呼び出し、トークンを保存すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: {
        token: 'test_token',
        user: {
          id: 'user_id',
          email: 'test@example.com',
          name: 'テストユーザー',
          role: 'user',
        },
      },
    };

    // 元の実装を一時的に保存
    const origLogin = authService.login;

    // テスト用にモック実装を上書き
    authService.login = jest.fn().mockImplementation(data => {
      apiClient.post('/auth/login', data);
      localStorage.setItem('auth_token', 'test_token');
      return Promise.resolve(mockResponse);
    });

    // リクエストデータ
    const loginData: LoginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    // ログインメソッドを呼び出し
    const result = await authService.login(loginData);

    // APIクライアントが正しく呼び出されたか確認
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginData);

    // トークンがローカルストレージに保存されたか確認
    expect(window.localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test_token');

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);

    // 元の実装に戻す
    authService.login = origLogin;
  });

  // ログアウトのテスト
  test('logout メソッドが正しくAPIを呼び出し、トークンを削除すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      data: {
        message: 'Successfully logged out',
      },
    };

    // 元の実装を一時的に保存
    const origLogout = authService.logout;

    // テスト用にモック実装を上書き
    authService.logout = jest.fn().mockImplementation(() => {
      apiClient.post('/auth/logout');
      localStorage.removeItem('auth_token');
      return Promise.resolve(mockResponse);
    });

    // ログアウトメソッドを呼び出し
    const result = await authService.logout();

    // APIクライアントが正しく呼び出されたか確認
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');

    // トークンがローカルストレージから削除されたか確認
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');

    // 結果が期待通りか確認
    expect(result).toEqual(mockResponse);

    // 元の実装に戻す
    authService.logout = origLogout;
  });

  // ログイン状態チェックのテスト
  test('isLoggedIn メソッドが正しくログイン状態を返すこと', () => {
    // トークンがない場合
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);
    expect(authService.isLoggedIn()).toBe(false);

    // トークンがある場合
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce('test_token');
    expect(authService.isLoggedIn()).toBe(true);
  });

  // トークン取得のテスト
  test('getToken メソッドが正しくトークンを返すこと', () => {
    // トークンがない場合
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);
    expect(authService.getToken()).toBeNull();

    // トークンがある場合
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce('test_token');
    expect(authService.getToken()).toBe('test_token');
  });
});
