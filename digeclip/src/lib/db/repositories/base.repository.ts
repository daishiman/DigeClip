import { prisma } from '../db';

/**
 * 基本的なリポジトリインターフェース
 * CRUDオペレーションを定義する
 */
export interface BaseRepository<T, ID> {
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Prismaを使用した基本的なリポジトリの実装
 */
export abstract class PrismaRepository<T, ID> implements BaseRepository<T, ID> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract get model(): any;

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: ID): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: ID, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: ID): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }
}

// すべてのDBトランザクションで利用するプリズマクライアントのエクスポート
export { prisma };
