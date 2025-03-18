// import { PrismaClient } from '@prisma/client';
// TODO: Prismaスキーマを生成後に実際のPrismaClientをインポートする

// インターフェース型
interface UserRecord {
  id: string;
  [key: string]: unknown;
}

// モックリクエスト型
interface MockRequest {
  where?: { id: string };
  data?: Record<string, unknown>;
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
    findUnique: async () => null,
    create: async _args => {
      if (!_args.data) return { id: 'mock-id' };
      return { id: 'mock-id', ...(_args.data as Record<string, unknown>) };
    },
    update: async _args => {
      if (!_args.where || !_args.data) return { id: 'unknown-id' };
      return { id: _args.where.id, ...(_args.data as Record<string, unknown>) };
    },
    delete: async () => {},
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
