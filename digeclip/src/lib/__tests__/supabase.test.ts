import { supabase, fetchData, insertData, updateData, deleteData } from '../../lib/supabase';

// Supabaseクライアントのモック
jest.mock('@supabase/supabase-js', () => {
  const mockSelect = jest.fn().mockReturnThis();
  const mockMatch = jest.fn().mockReturnThis();
  const mockInsert = jest.fn().mockReturnThis();
  const mockUpdate = jest.fn().mockReturnThis();
  const mockDelete = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();

  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: mockSelect,
        match: mockMatch,
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
        eq: mockEq,
      })),
    })),
  };
});

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchData should return data on success', async () => {
    // モックの戻り値を設定
    const mockData = [{ id: '1', name: 'Test' }];
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          select: jest.fn().mockReturnThis(),
          match: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        }) as any
    );

    const result = await fetchData('test_table', { id: '1' });
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
  });

  test('fetchData should throw error on failure', async () => {
    // エラーケースのモック
    const mockError = new Error('Database error');
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          select: jest.fn().mockReturnThis(),
          match: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }) as any
    );

    await expect(fetchData('test_table', { id: '1' })).rejects.toThrow('Database error');
  });

  test('insertData should return inserted data on success', async () => {
    const mockData = { id: '1', name: 'Test' };
    const mockResult = [mockData];
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: mockResult, error: null }),
        }) as any
    );

    const result = await insertData('test_table', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
  });

  test('updateData should return updated data on success', async () => {
    const mockData = { name: 'Updated Test' };
    const mockResult = [{ id: '1', name: 'Updated Test' }];
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue({ data: mockResult, error: null }),
        }) as any
    );

    const result = await updateData('test_table', '1', mockData);
    expect(result).toEqual(mockResult);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
  });

  test('deleteData should return true on success', async () => {
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        }) as any
    );

    const result = await deleteData('test_table', '1');
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('test_table');
  });

  test('deleteData should throw error on failure', async () => {
    const mockError = new Error('Delete error');
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: mockError }),
        }) as any
    );

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
  });
});
