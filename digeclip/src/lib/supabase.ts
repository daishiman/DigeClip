import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isTestEnvironment } from './constants';

let supabase: SupabaseClient;

// テスト環境の場合はテスト用のモッククライアントを使用
if (isTestEnvironment()) {
  // テスト用のダミーURLとキーを使用
  supabase = createClient('https://dummy-supabase-url.co', 'dummy-key-for-tests');
} else {
  // 環境変数からSupabaseの設定を取得
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Supabaseクライアントの作成
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// クライアントをエクスポート
export { supabase };

// 管理者向け操作用のクライアント（バックエンドのみで使用）
export const createAdminClient = () => {
  // テスト環境の場合はテスト用のモッククライアントを返す
  if (isTestEnvironment()) {
    return createClient('https://dummy-supabase-url.co', 'dummy-admin-key-for-tests');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

// データベース操作のためのヘルパー関数
export async function fetchData(table: string, query: Record<string, unknown> = {}) {
  const { data, error } = await supabase.from(table).select().match(query);

  if (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

  return data;
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
