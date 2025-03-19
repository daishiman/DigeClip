import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isTestEnvironment } from './constants';

// 環境変数から接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

let supabase: SupabaseClient;

// テスト環境の場合はテスト用のモッククライアントを使用
if (isTestEnvironment()) {
  // テスト用のダミーURLとキーを使用
  supabase = createClient('https://dummy-supabase-url.co', 'dummy-key-for-tests');
} else {
  // Supabaseクライアントの作成
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// 管理者向け操作用のクライアント（バックエンドのみで使用）
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};

// クライアントをエクスポート
export { supabase };

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
