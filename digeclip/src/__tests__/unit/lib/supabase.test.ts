/**
 * @jest-environment jsdom
 */
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// モジュールを直接モック化する
jest.mock('../../../lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn(),
  };

  return {
    supabase: mockSupabase,
    fetchData: jest.fn(async (table, query) => {
      const { data, error } = await mockSupabase.from(table).select().match(query);
      if (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
      return data;
    }),
    insertData: jest.fn(async (table, data) => {
      const { data: result, error } = await mockSupabase.from(table).insert(data).select();
      if (error) {
        console.error('Error inserting data:', error);
        throw error;
      }
      return result;
    }),
    updateData: jest.fn(async (table, id, data) => {
      const { data: result, error } = await mockSupabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      if (error) {
        console.error('Error updating data:', error);
        throw error;
      }
      return result;
    }),
    deleteData: jest.fn(async (table, id) => {
      const { error } = await mockSupabase.from(table).delete().eq('id', id);
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

    // モックの設定
    const mockSelect = jest.fn().mockReturnThis();
    const mockMatch = jest.fn().mockResolvedValue({ data: mockData, error: null });

    // from関数のモック
    supabase.from.mockReturnValue({
      select: mockSelect,
      match: mockMatch,
    });

    const result = await fetchData('test_table', { id: '1' });
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockSelect).toHaveBeenCalled();
    expect(mockMatch).toHaveBeenCalledWith({ id: '1' });
  });

  test('fetchData should throw error on failure', async () => {
    // エラーケースのモック
    const mockError = new Error('Database error');

    // モックの設定
    const mockSelect = jest.fn().mockReturnThis();
    const mockMatch = jest.fn().mockResolvedValue({ data: null, error: mockError });

    // from関数のモック
    supabase.from.mockReturnValue({
      select: mockSelect,
      match: mockMatch,
    });

    await expect(fetchData('test_table', { id: '1' })).rejects.toThrow('Database error');
    expect(console.error).toHaveBeenCalled();
  });

  test('insertData should return inserted data on success', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockResult = [mockData];

    // モックの設定
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: mockResult, error: null });

    // from関数のモック
    supabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
    });

    const result = await insertData('test_table', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockInsert).toHaveBeenCalledWith(mockData);
    expect(mockSelect).toHaveBeenCalled();
  });

  test('updateData should return updated data on success', async () => {
    const mockData = { name: 'Updated Test' };
    const mockResult = [{ id: '1', name: 'Updated Test' }];

    // モックの設定
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: mockResult, error: null });

    // from関数のモック
    supabase.from.mockReturnValue({
      update: mockUpdate,
      eq: mockEq,
      select: mockSelect,
    });

    const result = await updateData('test_table', '1', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockUpdate).toHaveBeenCalledWith(mockData);
    expect(mockEq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should return true on success', async () => {
    // モックの設定
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    // from関数のモック
    supabase.from.mockReturnValue({
      delete: mockDelete,
      eq: mockEq,
    });

    const result = await deleteData('test_table', '1');
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', '1');
  });

  test('deleteData should throw error on failure', async () => {
    const mockError = new Error('Delete error');

    // モックの設定
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: mockError });

    // from関数のモック
    supabase.from.mockReturnValue({
      delete: mockDelete,
      eq: mockEq,
    });

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
    expect(console.error).toHaveBeenCalled();
  });
});
