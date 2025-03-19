import { createClient } from '@supabase/supabase-js';
import { isTestEnvironment } from './constants';

// 環境変数の取得とデフォルト値の設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 初期化関数を作成 - 環境に応じて適切なクライアントを返す
const initializeSupabase = () => {
  // テスト環境ではモッククライアントを返す
  if (isTestEnvironment()) {
    return createClient('https://dummy-supabase-url.co', 'dummy-key-for-tests');
  }

  // 本番環境ではSupabaseクライアントを初期化
  try {
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
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceRoleKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined, using anonymous key instead');
        return createClient(supabaseUrl, supabaseAnonKey);
      }
      return createClient(supabaseUrl, serviceRoleKey);
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
