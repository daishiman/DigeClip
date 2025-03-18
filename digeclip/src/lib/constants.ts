/**
 * API関連の定数
 */

// APIのベースURL
// 要件に合わせて、本番環境と開発環境のURLを設定
export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || 'https://api.digeclip.com/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// テスト環境かどうかを判定する関数
export const isTestEnvironment = () => {
  return process.env.NODE_ENV === 'test';
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
