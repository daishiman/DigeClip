import { Prisma } from '@prisma/client';

// 複雑なPrisma型定義のエクスポート
export type {
  Prisma,
  PrismaPromise,
  User,
  Bookmark,
  Tag,
  Collection,
  BookmarkTag,
  BookmarkCollection,
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
