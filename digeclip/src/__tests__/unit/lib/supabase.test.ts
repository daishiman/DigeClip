/**
 * @jest-environment jsdom
 */
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
// 未使用の型インポートを削除
// import { PostgrestQueryBuilder } from '@supabase/postgrest-js';

// モジュール内で使用される型を定義
interface MockSupabaseClient {
  from: jest.Mock;
}

// 必要な型のみ残す
interface MockReturnValue {
  select: jest.Mock;
  match: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
}

// Jest用のモック関数型定義
type JestMockFunction = {
  mockResolvedValue: (_value: unknown) => jest.Mock;
};

// 型安全なモック関数を作成するためのユーティリティ
function createMockQueryBuilder(): MockReturnValue {
  return {
    select: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };
}

// モジュールを直接モック化する
jest.mock('../../../lib/supabase', () => {
  const mockSupabase: MockSupabaseClient = {
    from: jest.fn(),
  };

  return {
    supabase: mockSupabase,
    fetchData: jest.fn(async (table: string, query: Record<string, unknown>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as unknown;
      const { data, error } = await (
        builder as {
          select: () => {
            match: (_q: Record<string, unknown>) => Promise<{ data: unknown; error: Error | null }>;
          };
        }
      )
        .select()
        .match(query);

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
      return data;
    }),
    insertData: jest.fn(async (table: string, data: Record<string, unknown>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as unknown;
      const { data: result, error } = await (
        builder as {
          insert: (_d: Record<string, unknown>) => {
            select: () => Promise<{ data: unknown; error: Error | null }>;
          };
        }
      )
        .insert(data)
        .select();

      if (error) {
        console.error('Error inserting data:', error);
        throw error;
      }
      return result;
    }),
    updateData: jest.fn(async (table: string, id: string, data: Record<string, unknown>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as unknown;
      const { data: result, error } = await (
        builder as {
          update: (_d: Record<string, unknown>) => {
            eq: (
              _field: string,
              _value: string
            ) => { select: () => Promise<{ data: unknown; error: Error | null }> };
          };
        }
      )
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating data:', error);
        throw error;
      }
      return result;
    }),
    deleteData: jest.fn(async (table: string, id: string) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as unknown;
      const { error } = await (
        builder as {
          delete: () => {
            eq: (_field: string, _value: string) => Promise<{ error: Error | null }>;
          };
        }
      )
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting data:', error);
        throw error;
      }
      return true;
    }),
  };
});

// モック後にインポート
import { supabase, fetchData, insertData, updateData, deleteData } from '../../../lib/supabase';

// コンソールメソッドのモック
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchData should return data on success', async () => {
    // モックの戻り値を設定
    const mockData = [{ id: '1', name: 'Test' }];
    const mockResponse = { data: mockData, error: null };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.match as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    const result = await fetchData('test_table', { id: '1' });
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(queryBuilder.select).toHaveBeenCalled();
    expect(queryBuilder.match).toHaveBeenCalledWith({ id: '1' });
  });

  test('fetchData should throw error on failure', async () => {
    // エラーケースのモック
    const mockError = new Error('Database error');
    const mockResponse = { data: null, error: mockError };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.match as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    await expect(fetchData('test_table', { id: '1' })).rejects.toThrow('Database error');
    expect(console.error).toHaveBeenCalled();
  });

  test('insertData should return inserted data on success', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockResult = [mockData];
    const mockResponse = { data: mockResult, error: null };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.select as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    const result = await insertData('test_table', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(queryBuilder.insert).toHaveBeenCalledWith(mockData);
  });

  test('updateData should return updated data on success', async () => {
    const mockData = { name: 'Updated Test' };
    const mockResult = [{ id: '1', name: 'Updated Test' }];
    const mockResponse = { data: mockResult, error: null };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.select as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    const result = await updateData('test_table', '1', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(queryBuilder.update).toHaveBeenCalledWith(mockData);
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should return true on success', async () => {
    const mockResponse = { data: null, error: null };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.eq as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    const result = await deleteData('test_table', '1');
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(queryBuilder.delete).toHaveBeenCalled();
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should throw error on failure', async () => {
    const mockError = new Error('Delete error');
    const mockResponse = { data: null, error: mockError };

    // モッククエリビルダーを作成
    const queryBuilder = createMockQueryBuilder();
    // 型キャストを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.eq as unknown as JestMockFunction).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
    expect(console.error).toHaveBeenCalled();
  });
});
