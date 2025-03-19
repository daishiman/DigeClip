/**
 * API関連の定数
 */

// デフォルトのAPI URL
const DEFAULT_PROD_API_URL = 'https://api.digeclip.com/api';
const DEFAULT_DEV_API_URL = 'http://localhost:3000/api';

// 安全にNODE_ENVにアクセス
const getNodeEnv = () => {
  try {
    // サーバーサイドかチェック
    if (typeof window === 'undefined') {
      return process.env.NODE_ENV || 'development';
    }
    // クライアントサイドの場合はNext.jsの公開環境変数を使用（または開発環境と仮定）
    return process.env.NEXT_PUBLIC_NODE_ENV || 'development';
  } catch {
    return 'development';
  }
};

// 安全にAPI URLを取得
const getApiUrl = () => {
  try {
    // Next.jsの公開環境変数は常に安全
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    const env = getNodeEnv();
    if (env === 'production') {
      return DEFAULT_PROD_API_URL;
    }
    return DEFAULT_DEV_API_URL;
  } catch {
    // フォールバック: デフォルト開発環境URLを返す
    return DEFAULT_DEV_API_URL;
  }
};

// APIのベースURL
export const API_BASE_URL = getApiUrl();

// テスト環境かどうかを判定する関数
export const isTestEnvironment = () => {
  try {
    return getNodeEnv() === 'test';
  } catch {
    return false;
  }
};

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
