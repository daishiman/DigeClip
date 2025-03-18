// import { PrismaClient } from '@prisma/client';
// TODO: Prismaスキーマを生成後に実際のPrismaClientをインポートする

// 一時的なPrismaClientのモック
class PrismaClientMock {
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
