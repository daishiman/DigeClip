import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバル型拡張
declare global {
  var prisma: PrismaClient | undefined;
}

// 開発環境でホットリロード時に複数のPrismaインスタンスが作成されるのを防ぐ
// グローバルスコープに保存されたクライアントを再利用（開発環境用）
// 本番環境では常に新しいインスタンスを作成
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// 開発環境時のみグローバルに保存
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
