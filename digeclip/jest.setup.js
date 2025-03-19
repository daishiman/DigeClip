// テスト環境のセットアップ

// 環境変数の設定
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';

// 環境変数のモック設定
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.OPENAI_API_KEY = 'mock-openai-key';
process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/postgres';

// グローバルなモックの設定
global.fetch = jest.fn();

// コンソールのモック（テスト中のエラーログを抑制）
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  // log: jest.fn(), // 必要に応じてコメントアウト解除
};

// OpenAIモジュールのモック
jest.mock('openai', () => {
  // モックの実装
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: 'Mocked response',
        },
      },
    ],
  });

  // OpenAIクラスのモック
  function MockOpenAI() {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  }

  return MockOpenAI;
});

// axiosモジュールのモック
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ status: 204 }),
  get: jest.fn().mockResolvedValue({ status: 200, data: {} }),
}));

// Supabaseモジュールのモック
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        match: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  };
});

// import '@testing-library/jest-dom';

// Prismaのモック設定
jest.mock('./src/lib/db/db.ts', () => {
  // requreの代わりにモックオブジェクトを直接定義
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    bookmark: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tag: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    collection: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    bookmarkTag: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    bookmarkCollection: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  return {
    prisma: prismaMock,
  };
});
