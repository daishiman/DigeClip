import {
  supabase,
  fetchData,
  insertData,
  updateData,
  deleteData,
  createAdminClient,
} from '../../../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import * as constants from '../../../lib/constants';

// テスト環境かどうかを判定する関数をモック
jest.mock('../../../lib/constants', () => ({
  isTestEnvironment: jest.fn(),
}));

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

// 環境変数のモック
const originalEnv = process.env;

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 環境変数をリセット
    process.env = { ...originalEnv };
    // デフォルトでテスト環境として扱う
    jest.mocked(constants.isTestEnvironment).mockReturnValue(true);
  });

  afterAll(() => {
    // テスト後に環境変数を元に戻す
    process.env = originalEnv;
  });

  test('fetchData should return data on success', async () => {
    // モックの戻り値を設定
    const mockData = [{ id: '1', name: 'Test' }];
    jest.spyOn(supabase, 'from').mockImplementation(
      () =>
        ({
          select: jest.fn().mockReturnThis(),
          match: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        }) as unknown as ReturnType<SupabaseClient['from']>
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
        }) as unknown as ReturnType<SupabaseClient['from']>
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
        }) as unknown as ReturnType<SupabaseClient['from']>
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
        }) as unknown as ReturnType<SupabaseClient['from']>
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
        }) as unknown as ReturnType<SupabaseClient['from']>
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
        }) as unknown as ReturnType<SupabaseClient['from']>
    );

    await expect(deleteData('test_table', '1')).rejects.toThrow('Delete error');
  });

  describe('createAdminClient', () => {
    test('should return test client in test environment', () => {
      jest.mocked(constants.isTestEnvironment).mockReturnValue(true);
      const client = createAdminClient();
      expect(client).toBeDefined();
      // createClientが正しい引数で呼ばれたことを確認
      expect(require('@supabase/supabase-js').createClient).toHaveBeenCalledWith(
        'https://dummy-supabase-url.co',
        'dummy-admin-key-for-tests'
      );
    });

    test('should create client with service role key in non-test environment', () => {
      // テスト環境ではないと設定
      jest.mocked(constants.isTestEnvironment).mockReturnValue(false);

      // 環境変数を設定
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

      const client = createAdminClient();
      expect(client).toBeDefined();
      // createClientが正しい引数で呼ばれたことを確認
      expect(require('@supabase/supabase-js').createClient).toHaveBeenCalledWith(
        'https://test-project.supabase.co',
        'test-service-role-key'
      );
    });

    test('should throw error if service role key is not defined', () => {
      // テスト環境ではないと設定
      jest.mocked(constants.isTestEnvironment).mockReturnValue(false);

      // URLのみ設定し、キーは設定しない
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = undefined;

      expect(() => createAdminClient()).toThrow('SUPABASE_SERVICE_ROLE_KEY is not defined');
    });
  });
});
