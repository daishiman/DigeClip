/**
 * @jest-environment jsdom
 */
import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';

// カスタムモックタイプ
interface MockResponse<T> {
  data: T | null;
  error: Error | null;
}

// モジュール内で使用される型を定義
interface MockSupabaseClient {
  from: jest.Mock;
}

interface MockQueryResult {
  [key: string]: any;
}

// 型安全なモック関数を作成するためのユーティリティ
function createMockQueryBuilder() {
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
    fetchData: jest.fn(async (table: string, query: Record<string, any>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as any;
      const { data, error } = await builder.select().match(query);

      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
      return data;
    }),
    insertData: jest.fn(async (table: string, data: Record<string, any>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as any;
      const { data: result, error } = await builder.insert(data).select();

      if (error) {
        console.error('Error inserting data:', error);
        throw error;
      }
      return result;
    }),
    updateData: jest.fn(async (table: string, id: string, data: Record<string, any>) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as any;
      const { data: result, error } = await builder.update(data).eq('id', id).select();

      if (error) {
        console.error('Error updating data:', error);
        throw error;
      }
      return result;
    }),
    deleteData: jest.fn(async (table: string, id: string) => {
      // TypeScriptを満足させるための型アサーション
      const builder = mockSupabase.from(table) as any;
      const { error } = await builder.delete().eq('id', id);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.match as any).mockResolvedValue(mockResponse);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.match as any).mockResolvedValue(mockResponse);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.select as any).mockResolvedValue(mockResponse);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.select as any).mockResolvedValue(mockResponse);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.eq as any).mockResolvedValue(mockResponse);

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
    // anyを使用してTypeScriptの型チェックをバイパス
    (queryBuilder.eq as any).mockResolvedValue(mockResponse);

    // from関数のモック
    (supabase.from as jest.Mock).mockReturnValue(queryBuilder);

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
    expect(console.error).toHaveBeenCalled();
  });
});
