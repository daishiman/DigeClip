/**
 * API関連の定数
 */

import { safeGetEnv, APP_ENV, IS_DEV, IS_PROD, IS_CLOUDFLARE_PAGES } from './env';

// デフォルトのAPI URL
export const DEFAULT_DEV_API_URL = 'http://localhost:3000/api';
export const DEFAULT_PROD_API_URL = 'https://digeclip.com/api';

// 安全にAPI URLを取得
const getApiUrl = () => {
  try {
    // Next.jsの公開環境変数は常に安全
    const apiUrl = safeGetEnv('NEXT_PUBLIC_API_URL', '');
    if (apiUrl) {
      return apiUrl;
    }

    if (IS_PROD) {
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
  return IS_DEV;
};

export const isProdEnvironment = (): boolean => {
  return IS_PROD;
};

// テスト環境かどうかを判定する関数
export const isTestEnvironment = (): boolean => {
  try {
    // 複数の条件で判定（Jest, Vitest等のテスト環境をカバー）
    if (
      APP_ENV === 'test' ||
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
  return IS_CLOUDFLARE_PAGES;
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
