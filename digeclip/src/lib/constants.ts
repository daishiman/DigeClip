/**
 * API関連の定数
 */

// 環境変数の安全な取得
export const safeGetEnv = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || defaultValue;
    }
  } catch (e) {
    console.warn(`環境変数${key}の取得中にエラーが発生しました`, e);
  }
  return defaultValue;
};

// デフォルトのAPI URL
export const DEFAULT_DEV_API_URL = 'http://localhost:3000/api';
export const DEFAULT_PROD_API_URL = 'https://digeclip.com/api';

// Node環境を安全に取得
export const getNodeEnv = (): string => {
  try {
    return safeGetEnv('NODE_ENV', 'development');
  } catch (e) {
    console.warn('NODE_ENVの取得に失敗しました', e);
    return 'development';
  }
};

// 安全にAPI URLを取得
const getApiUrl = () => {
  try {
    // Next.jsの公開環境変数は常に安全
    try {
      if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
      }
    } catch (e) {
      console.warn('NEXT_PUBLIC_API_URLの取得に失敗しました', e);
    }

    const env = getNodeEnv();
    if (env === 'production') {
      return DEFAULT_PROD_API_URL;
    }
    return DEFAULT_DEV_API_URL;
  } catch (e) {
    console.warn('getApiUrl関数でエラーが発生しました', e);
    // フォールバック: デフォルト開発環境URLを返す
    return DEFAULT_DEV_API_URL;
  }
};

// 環境識別関数
export const isDevEnvironment = (): boolean => {
  try {
    const env = getNodeEnv();
    return env === 'development';
  } catch {
    // デフォルトでfalseを返す（本番環境と仮定）
    return false;
  }
};

export const isProdEnvironment = (): boolean => {
  try {
    const env = getNodeEnv();
    return env === 'production';
  } catch {
    // デフォルトでtrueを返す（本番環境と仮定）
    return true;
  }
};

// テスト環境かどうかを判定する関数
export const isTestEnvironment = (): boolean => {
  try {
    // 複数の条件で判定（Jest, Vitest等のテスト環境をカバー）
    if (
      getNodeEnv() === 'test' ||
      (typeof process !== 'undefined' &&
        (process.env.JEST_WORKER_ID !== undefined ||
          process.env.VITEST !== undefined ||
          process.env.NODE_ENV === 'test'))
    ) {
      return true;
    }

    // グローバル変数でJestの存在を確認
    if (typeof global !== 'undefined' && (global as Record<string, unknown>).jest) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

// Cloudflare Pages環境かどうかを判定する関数
export const isCloudflarePages = (): boolean => {
  try {
    return safeGetEnv('NEXT_PUBLIC_IS_CLOUDFLARE_PAGES', 'false') === 'true';
  } catch {
    return false;
  }
};

// API URLをエクスポート
export const API_URL = getApiUrl();

// 認証関連のエンドポイント
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
};

// ユーザーロール関連のエンドポイント
export const USER_ENDPOINTS = {
  CONTENTS: '/user/contents',
  CONTENT_DETAIL: (id: string) => `/user/contents/${id}`,
};

// 管理者ロール関連のエンドポイント
export const ADMIN_ENDPOINTS = {
  SOURCES: '/admin/sources',
  SOURCE_DETAIL: (id: string) => `/admin/sources/${id}`,
};
