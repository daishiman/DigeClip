/**
 * @jest-environment jsdom
 */
import { supabase, fetchData, insertData, updateData, deleteData } from '../../../lib/supabase';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// モック用の型定義
type MockResponse<T> = Promise<{ data: T | null; error: Error | null }>;

// Supabaseのメソッド用の型定義
type SupabaseQueryBuilder = {
  select: jest.Mock;
  match: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  eq: jest.Mock;
};

// コンソールメソッドのモック
jest.spyOn(console, 'error').mockImplementation(() => {});

// @supabase/supabase-jsのモック
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({})),
  };
});

// supabase.tsのモック
jest.mock('../../../lib/supabase', () => {
  // 型を明示的に指定してrequireActualを呼び出し
  const originalModule = jest.requireActual<Record<string, unknown>>('../../../lib/supabase');
  return {
    __esModule: true,
    ...originalModule,
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchData should return data on success', async () => {
    // モックの戻り値を設定
    const mockData = [{ id: '1', name: 'Test' }];

    // fromメソッドのモック
    const mockFrom = {
      select: jest.fn().mockReturnThis(),
      match: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: mockData, error: null }) as MockResponse<typeof mockData>;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    const result = await fetchData('test_table', { id: '1' });
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockFrom.select).toHaveBeenCalled();
    expect(mockFrom.match).toHaveBeenCalledWith({ id: '1' });
  });

  test('fetchData should throw error on failure', async () => {
    // エラーケースのモック
    const mockError = new Error('Database error');

    // fromメソッドのモック
    const mockFrom = {
      select: jest.fn().mockReturnThis(),
      match: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: null, error: mockError }) as MockResponse<unknown>;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    await expect(fetchData('test_table', { id: '1' })).rejects.toThrow('Database error');
    expect(console.error).toHaveBeenCalled();
  });

  test('insertData should return inserted data on success', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockResult = [mockData];

    // fromメソッドのモック
    const mockFrom = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: mockResult, error: null }) as MockResponse<
          typeof mockResult
        >;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    const result = await insertData('test_table', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockFrom.insert).toHaveBeenCalledWith(mockData);
    expect(mockFrom.select).toHaveBeenCalled();
  });

  test('updateData should return updated data on success', async () => {
    const mockData = { name: 'Updated Test' };
    const mockResult = [{ id: '1', name: 'Updated Test' }];

    // fromメソッドのモック
    const mockFrom = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockImplementation(() => {
        return Promise.resolve({ data: mockResult, error: null }) as MockResponse<
          typeof mockResult
        >;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    const result = await updateData('test_table', '1', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockFrom.update).toHaveBeenCalledWith(mockData);
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should return true on success', async () => {
    // fromメソッドのモック
    const mockFrom = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation(() => {
        return Promise.resolve({ error: null }) as MockResponse<unknown>;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    const result = await deleteData('test_table', '1');
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockFrom.delete).toHaveBeenCalled();
    expect(mockFrom.eq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should throw error on failure', async () => {
    const mockError = new Error('Delete error');

    // fromメソッドのモック
    const mockFrom = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation(() => {
        return Promise.resolve({ error: mockError }) as MockResponse<unknown>;
      }),
    };

    // supabaseのfromメソッドをモック
    (supabase.from as jest.Mock).mockReturnValue(mockFrom as SupabaseQueryBuilder);

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
    expect(console.error).toHaveBeenCalled();
  });
});
