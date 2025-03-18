// import { PrismaClient } from '@prisma/client';
// TODO: Prismaスキーマを生成後に実際のPrismaClientをインポートする

// インターフェース型
interface UserRecord {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

// モックリクエスト型
interface MockRequest {
  where?: {
    id?: string;
    email?: string;
    [key: string]: unknown;
  };
  data?: Record<string, unknown>;
  include?: Record<string, unknown>;
}

// 一時的なモデル型
interface MockModel {
  findMany: () => Promise<UserRecord[]>;
  findUnique: (_args: MockRequest) => Promise<UserRecord | null>;
  create: (_args: MockRequest) => Promise<UserRecord>;
  update: (_args: MockRequest) => Promise<UserRecord>;
  delete: (_args: MockRequest) => Promise<void>;
}

// 一時的なPrismaClientのモック
class PrismaClientMock {
  // ユーザーモデル
  user: MockModel = {
    findMany: async () => [],
    findUnique: async _args => {
      if (_args.where?.id === 'mock-id') {
        return {
          id: 'mock-id',
          email: 'user@example.com',
          name: 'テストユーザー',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      if (_args.where?.email === 'user@example.com') {
        return {
          id: 'mock-id',
          email: 'user@example.com',
          name: 'テストユーザー',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return null;
    },
    create: async _args => {
      if (!_args.data)
        return {
          id: 'mock-id',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      return {
        id: 'mock-id',
        email: (_args.data.email as string) || 'user@example.com',
        name: (_args.data.name as string) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(_args.data as Record<string, unknown>),
      };
    },
    update: async _args => {
      if (!_args.where || !_args.data)
        return {
          id: 'unknown-id',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

      return {
        id: (_args.where.id as string) || 'unknown-id',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(_args.data as Record<string, unknown>),
      };
    },
    delete: async () => {},
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: Record<string, unknown>) {
    // モック初期化
  }
}

// PrismaClientをグローバルに定義して、開発環境でのホットリロード時に複数のインスタンスが作成されるのを防ぐ
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientMock | undefined;
}

// プロダクション環境では新しいPrismaClientを作成し、開発環境ではグローバル変数を再利用
const prisma =
  global.prisma ||
  new PrismaClientMock({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 開発環境でならグローバル変数にPrismaClientを格納しない
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
