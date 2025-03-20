/**
 * 環境変数ユーティリティ
 *
 * 静的エクスポート時に問題が発生しないように環境変数へのアクセスを安全に行うためのユーティリティ
 */

// 現在の環境（development/production）
export const APP_ENV =
  typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_APP_ENV
    ? process.env.NEXT_PUBLIC_APP_ENV
    : 'development';

// 環境フラグ
export const IS_DEV = APP_ENV === 'development';
export const IS_PROD = APP_ENV === 'production';
export const IS_CLOUDFLARE_PAGES =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NEXT_PUBLIC_IS_CLOUDFLARE_PAGES === 'true';

// Supabase関連
export const SUPABASE_URL =
  typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : '';

export const SUPABASE_ANON_KEY =
  typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : '';

/**
 * 安全に環境変数を取得する関数
 * 静的エクスポート時にエラーが発生しないように
 */
export function safeGetEnv(key: string, defaultValue: string = ''): string {
  if (typeof process === 'undefined' || !process.env) {
    return defaultValue;
  }

  try {
    return process.env[key] || defaultValue;
  } catch (error) {
    console.warn(`環境変数 ${key} の取得に失敗しました`, error);
    return defaultValue;
  }
}

/**
 * 現在の環境情報を取得
 */
export function getEnvironmentInfo() {
  return {
    environment: APP_ENV,
    isProduction: IS_PROD,
    isDevelopment: IS_DEV,
    isCloudflarePages: IS_CLOUDFLARE_PAGES,
    supabaseProject: IS_PROD ? 'DigeClip' : 'DigeClip-dev',
  };
}
