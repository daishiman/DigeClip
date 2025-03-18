import { User } from '@prisma/client';
import { PrismaRepository, prisma } from './base.repository';

/**
 * ユーザーリポジトリのインターフェース
 * 基本的なCRUD操作に加えて、ユーザー固有のメソッドを定義
 */
export interface UserRepository extends PrismaRepository<User, string> {
  findByEmail(email: string): Promise<User | null>;
  findWithSources(id: string): Promise<User | null>;
}

/**
 * ユーザーリポジトリの実装
 */
export class UserRepositoryImpl extends PrismaRepository<User, string> implements UserRepository {
  protected get model() {
    return prisma.user;
  }

  /**
   * メールアドレスでユーザーを検索
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * ユーザーと関連するソース情報を取得
   */
  async findWithSources(id: string): Promise<User | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        sources: true,
      },
    });
  }
}

// リポジトリのシングルトンインスタンス
export const userRepository = new UserRepositoryImpl();
