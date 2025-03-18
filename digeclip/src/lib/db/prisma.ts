// 複雑なPrisma型定義のエクスポート
// TODO: Prismaスキーマを生成後に実際の型をインポートする
export type {
  // PrismaPromise,
  User,
  // Bookmark,
  Tag,
  // Collection,
  // BookmarkTag,
  // BookmarkCollection,
} from '@prisma/client';

// Prismaクエリ用のヘルパー関数
export const include = {
  bookmarkWithRelations: {
    tags: {
      include: {
        tag: true,
      },
    },
    collections: {
      include: {
        collection: true,
      },
    },
  },
} as const;
