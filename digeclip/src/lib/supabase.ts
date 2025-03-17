import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseの設定を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
