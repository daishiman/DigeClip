import { createClient } from '@supabase/supabase-js';
import { isTestEnvironment } from './constants';
import { APP_ENV, IS_DEV, IS_PROD, SUPABASE_URL, SUPABASE_ANON_KEY, safeGetEnv } from './env';

// 環境変数の取得とデフォルト値の設定
const getSupabaseUrl = () => {
  // env.tsから取得した値を使用
  if (SUPABASE_URL) {
    return SUPABASE_URL;
  }

  // 環境によってデフォルト値を変える
  if (IS_PROD) {
    return 'https://xuelsazvjarxkdtwqxzj.supabase.co'; // 本番環境のプレースホルダー
  }
  return 'https://xqhoatxccoijvualjzyj.supabase.co'; // 開発環境のプレースホルダー
};

const getSupabaseAnonKey = () => {
  // env.tsから取得した値を使用
  if (SUPABASE_ANON_KEY) {
    return SUPABASE_ANON_KEY;
  }
  return 'placeholder-key';
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// 環境情報をコンソールに出力（デバッグ用）
if (IS_DEV) {
  console.warn(`Supabase URL: ${supabaseUrl.split('.')[0]}... (${APP_ENV}環境)`);
}

// 初期化関数を作成 - 環境に応じて適切なクライアントを返す
const initializeSupabase = () => {
  // テスト環境ではモッククライアントを返す
  if (isTestEnvironment()) {
    console.warn('テスト環境用Supabaseクライアントを初期化しています');
    return createClient('https://dummy-supabase-url.co', 'dummy-key-for-tests');
  }

  // 環境に応じたSupabaseクライアントを初期化
  try {
    console.warn(`${APP_ENV}環境用Supabaseクライアントを初期化しています`);
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Supabaseクライアントの初期化に失敗しました:', error);
    // ビルド時にエラーを発生させないためのダミークライアント
    return createClient('https://placeholder-url.supabase.co', 'placeholder-key');
  }
};

// クライアントを初期化
const supabase = initializeSupabase();

// 管理者向け操作用のクライアント（バックエンドのみで使用）
export const createAdminClient = () => {
  try {
    // サーバーサイドかビルド時のみ実行される環境変数のチェック
    if (typeof window === 'undefined') {
      const serviceRoleKey = safeGetEnv('SUPABASE_SERVICE_ROLE_KEY');
      if (serviceRoleKey) {
        return createClient(supabaseUrl, serviceRoleKey);
      }

      console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined, using anonymous key instead');
      return createClient(supabaseUrl, supabaseAnonKey);
    } else {
      // クライアントサイドの場合は通常のキーを使用
      console.warn(
        'createAdminClient was called in browser environment, using anonymous key instead'
      );
      return createClient(supabaseUrl, supabaseAnonKey);
    }
  } catch (error) {
    console.error('Admin Supabaseクライアントの初期化に失敗しました:', error);
    return createClient('https://placeholder-url.supabase.co', 'placeholder-key');
  }
};

// 環境情報取得関数
export const getSupabaseEnvironmentInfo = () => {
  if (isTestEnvironment()) {
    return 'test';
  }
  return APP_ENV;
};

// クライアントをエクスポート
export { supabase };

// データベース操作のためのヘルパー関数
export async function fetchData(table: string, query: Record<string, unknown> = {}) {
  try {
    const { data, error } = await supabase.from(table).select().match(query);

    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    return [];
  }
}

export async function insertData(table: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase.from(table).insert(data).select();

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return result;
}

export async function updateData(table: string, id: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select();

  if (error) {
    console.error('Error updating data:', error);
    throw error;
  }

  return result;
}

export async function deleteData(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    console.error('Error deleting data:', error);
    throw error;
  }

  return true;
}
