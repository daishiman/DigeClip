# バックエンドテスト仕様

## 概要

このドキュメントでは、DigeClipプロジェクトのバックエンド部分に特化したテスト仕様を定義します。共通のテスト戦略については[共通テスト戦略](../../0_common/5_Testing_Strategy.md)を参照してください。

## 1. バックエンド特有のテスト目標

- APIエンドポイントの正確性と信頼性の確保
- データベース操作の整合性検証
- 認証・認可メカニズムの安全性確認
- パフォーマンスとスケーラビリティの検証
- エラーハンドリングの適切な実装確認

## 2. APIテスト

### 2.1 エンドポイントテスト

- **対象**: 個別のAPIエンドポイント
- **ツール**: Supertest、Jest
- **検証項目**:
  - ステータスコードの正確性
  - レスポンス形式の一貫性
  - エラーハンドリング
  - 認証・認可の適切な実装

### 2.2 テスト例

```typescript
// articles.test.ts
import request from 'supertest';
import { app } from '../app';
import { createTestToken } from '../utils/test-helpers';

describe('GET /api/articles', () => {
  it('should return 200 and articles list', async () => {
    const response = await request(app)
      .get('/api/articles')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('title');
  });

  it('should return 401 when not authenticated', async () => {
    await request(app)
      .post('/api/articles')
      .send({ title: 'New Article', content: 'Content' })
      .expect(401);
  });

  it('should create article when authenticated', async () => {
    const token = createTestToken({ id: 1, role: 'user' });

    const response = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Article', content: 'Content' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New Article');
  });
});
```

## 3. データベーステスト

### 3.1 リポジトリレイヤーテスト

- **対象**: データベースアクセスロジック
- **ツール**: Jest、テスト用DBクライアント
- **検証項目**:
  - CRUD操作の正確性
  - トランザクション処理
  - エラー処理
  - クエリパフォーマンス

### 3.2 テスト例

```typescript
// articleRepository.test.ts
import { ArticleRepository } from './articleRepository';
import { db } from '../db';

// テスト前にテストデータベースをセットアップ
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

// テスト後にクリーンアップ
afterAll(async () => {
  await db.destroy();
});

describe('ArticleRepository', () => {
  const repo = new ArticleRepository(db);

  it('should find all articles', async () => {
    const articles = await repo.findAll();
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]).toHaveProperty('id');
    expect(articles[0]).toHaveProperty('title');
  });

  it('should create a new article', async () => {
    const newArticle = {
      title: 'Test Article',
      content: 'Test Content',
      userId: 1
    };

    const created = await repo.create(newArticle);
    expect(created).toHaveProperty('id');
    expect(created.title).toBe(newArticle.title);

    // 作成したデータが取得できることを確認
    const found = await repo.findById(created.id);
    expect(found).toMatchObject(newArticle);
  });

  it('should update an article', async () => {
    const article = await repo.findAll().then(articles => articles[0]);
    const updated = await repo.update(article.id, { title: 'Updated Title' });

    expect(updated.title).toBe('Updated Title');
    expect(updated.id).toBe(article.id);
  });

  it('should delete an article', async () => {
    const article = await repo.create({
      title: 'To Be Deleted',
      content: 'Content',
      userId: 1
    });

    await repo.delete(article.id);
    const found = await repo.findById(article.id);
    expect(found).toBeNull();
  });
});
```

## 4. サービスレイヤーテスト

### 4.1 ビジネスロジックテスト

- **対象**: サービスクラス/関数
- **ツール**: Jest
- **検証項目**:
  - ビジネスルールの適用
  - 例外処理
  - 依存サービスとの連携
  - 認可ロジック

### 4.2 テスト例

```typescript
// articleService.test.ts
import { ArticleService } from './articleService';
import { mockArticleRepository } from '../__mocks__/articleRepository';
import { mockUserService } from '../__mocks__/userService';
import { NotFoundError, UnauthorizedError } from '../errors';

describe('ArticleService', () => {
  const articleRepo = mockArticleRepository();
  const userService = mockUserService();
  const service = new ArticleService(articleRepo, userService);

  it('should get articles with author information', async () => {
    const articles = await service.getArticles();

    expect(articles[0]).toHaveProperty('author');
    expect(articles[0].author).toHaveProperty('name');
  });

  it('should throw NotFoundError when article not found', async () => {
    articleRepo.findById.mockResolvedValue(null);

    await expect(service.getArticleById(999)).rejects.toThrow(NotFoundError);
  });

  it('should check permissions before updating article', async () => {
    const article = { id: 1, userId: 2, title: 'Test' };
    articleRepo.findById.mockResolvedValue(article);

    // 別のユーザーIDでアクセス
    await expect(
      service.updateArticle(1, { title: 'Updated' }, { id: 3, role: 'user' })
    ).rejects.toThrow(UnauthorizedError);

    // 管理者は更新可能
    articleRepo.update.mockResolvedValue({ ...article, title: 'Updated' });
    const result = await service.updateArticle(
      1,
      { title: 'Updated' },
      { id: 3, role: 'admin' }
    );

    expect(result.title).toBe('Updated');
  });
});
```

## 5. 認証・認可テスト

### 5.1 認証テスト

- **対象**: 認証ミドルウェア、認証サービス
- **ツール**: Jest、Supertest
- **検証項目**:
  - トークン検証
  - 認証失敗時の適切なエラー
  - セッション管理
  - パスワードハッシュ化

### 5.2 テスト例

```typescript
// auth.test.ts
import request from 'supertest';
import { app } from '../app';
import { createUser, deleteUser } from '../utils/test-helpers';

describe('Authentication', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!'
  };

  beforeAll(async () => {
    await createUser(testUser);
  });

  afterAll(async () => {
    await deleteUser(testUser.email);
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('should reject invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      })
      .expect(401);
  });

  it('should verify token and return user data', async () => {
    // まずログイン
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    const token = loginResponse.body.token;

    // トークンを使用して保護されたエンドポイントにアクセス
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testUser.email);
  });
});
```

## 6. 統合テスト

### 6.1 APIフローテスト

- **対象**: 複数のAPIエンドポイントを組み合わせたフロー
- **ツール**: Supertest、Jest
- **検証項目**:
  - エンドツーエンドのユーザーフロー
  - データの整合性
  - エラー状態からの回復

### 6.2 テスト例

```typescript
// article-workflow.test.ts
import request from 'supertest';
import { app } from '../app';
import { createTestToken, createUser, deleteUser } from '../utils/test-helpers';

describe('Article Workflow', () => {
  let token;
  let userId;
  let articleId;

  beforeAll(async () => {
    // テストユーザー作成
    const user = await createUser({
      email: 'workflow@example.com',
      password: 'Password123!'
    });
    userId = user.id;
    token = createTestToken({ id: userId, role: 'user' });
  });

  afterAll(async () => {
    await deleteUser('workflow@example.com');
  });

  it('should create a new article', async () => {
    const response = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Workflow Test',
        content: 'This is a test article'
      })
      .expect(201);

    articleId = response.body.id;
    expect(response.body.title).toBe('Workflow Test');
  });

  it('should update the article', async () => {
    await request(app)
      .put(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Workflow Test'
      })
      .expect(200);

    // 更新されたことを確認
    const response = await request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200);

    expect(response.body.title).toBe('Updated Workflow Test');
  });

  it('should add a comment to the article', async () => {
    const response = await request(app)
      .post(`/api/articles/${articleId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'This is a test comment'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('This is a test comment');

    // コメントが記事に関連付けられていることを確認
    const articleResponse = await request(app)
      .get(`/api/articles/${articleId}?include=comments`)
      .expect(200);

    expect(articleResponse.body.comments).toBeDefined();
    expect(articleResponse.body.comments.length).toBeGreaterThan(0);
    expect(articleResponse.body.comments[0].content).toBe('This is a test comment');
  });

  it('should delete the article', async () => {
    await request(app)
      .delete(`/api/articles/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // 削除されたことを確認
    await request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404);
  });
});
```

## 7. パフォーマンステスト

### 7.1 負荷テスト

- **対象**: 主要APIエンドポイント
- **ツール**: k6、Artillery
- **検証項目**:
  - レスポンスタイム
  - スループット
  - エラー率
  - リソース使用率

### 7.2 テスト例

```javascript
// k6-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // 20ユーザーまでランプアップ
    { duration: '1m', target: 20 },  // 1分間負荷を維持
    { duration: '30s', target: 0 },  // ランプダウン
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%のリクエストが500ms以内に完了すること
    http_req_failed: ['rate<0.01'],   // エラー率1%未満
  },
};

export default function() {
  const BASE_URL = 'http://localhost:3000/api';

  // 記事一覧の取得
  const articlesResponse = http.get(`${BASE_URL}/articles`);
  check(articlesResponse, {
    'articles status is 200': (r) => r.status === 200,
    'articles response time < 200ms': (r) => r.timings.duration < 200,
  });

  // 個別記事の取得（IDは1〜10からランダム）
  const articleId = Math.floor(Math.random() * 10) + 1;
  const articleResponse = http.get(`${BASE_URL}/articles/${articleId}`);
  check(articleResponse, {
    'article status is 200': (r) => r.status === 200,
    'article response time < 150ms': (r) => r.timings.duration < 150,
  });

  sleep(1);
}
```

## 8. セキュリティテスト

### 8.1 脆弱性テスト

- **対象**: APIエンドポイント、認証システム
- **ツール**: OWASP ZAP、Jest
- **検証項目**:
  - SQLインジェクション対策
  - XSS対策
  - CSRF対策
  - 認証バイパス対策

### 8.2 テスト例

```typescript
// security.test.ts
import request from 'supertest';
import { app } from '../app';

describe('Security Tests', () => {
  it('should prevent SQL injection in query parameters', async () => {
    const maliciousQuery = "1'; DROP TABLE users; --";

    // SQLインジェクションが防止されていれば、エラーは発生するが
    // サーバーはクラッシュせず、適切なエラーレスポンスを返す
    const response = await request(app)
      .get(`/api/articles/${maliciousQuery}`)
      .expect(400); // または404、どちらにせよ500ではない

    expect(response.body).toHaveProperty('error');
  });

  it('should set secure headers', async () => {
    const response = await request(app)
      .get('/api/articles')
      .expect(200);

    // セキュリティヘッダーの確認
    expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
    expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
  });

  it('should require CSRF token for state-changing operations', async () => {
    // ログイン
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    const token = loginResponse.body.token;

    // CSRFトークンなしでPOSTリクエスト
    await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({
        title: 'Test Article',
        content: 'Content'
      })
      .expect(403); // CSRFトークンがないため拒否される
  });
});
```

## 9. バックエンド特有のテスト環境設定

### 9.1 Jest設定

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/migrations/**',
    '!src/seeds/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 9.2 テストデータベース設定

```javascript
// knexfile.js
module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'digeclip_test',
    },
    migrations: {
      directory: './digeclip/src/migrations',
    },
    seeds: {
      directory: './digeclip/src/seeds/test',
    },
  },
};
```

## 10. CI/CDパイプラインでのバックエンドテスト

### 10.1 GitHub Actions設定例

```yaml
# .github/workflows/backend-tests.yml
name: Backend Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'src/**'
      - 'package.json'
      - 'jest.config.js'
      - 'knexfile.js'

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: digeclip_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run migrate:test
        env:
          TEST_DB_HOST: localhost
          TEST_DB_USER: postgres
          TEST_DB_PASSWORD: postgres
          TEST_DB_NAME: digeclip_test

      - name: Run tests
        run: npm test
        env:
          TEST_DB_HOST: localhost
          TEST_DB_USER: postgres
          TEST_DB_PASSWORD: postgres
          TEST_DB_NAME: digeclip_test

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

## 11. バックエンドテストの優先順位

1. **最優先**: 認証・認可システム、データ整合性に関わるAPI
2. **高優先度**: 主要なビジネスロジック、データアクセスレイヤー
3. **中優先度**: 二次的なAPIエンドポイント、ユーティリティ関数
4. **低優先度**: エラーメッセージ、ログ機能

## 12. バックエンド特有のテストデータ

### 12.1 シードデータ

- ユーザーアカウント
- 記事データ
- タグ・カテゴリ
- 設定データ

### 12.2 データ管理

- マイグレーションとシードスクリプトの活用
- テスト用ファクトリー関数
- テスト間のデータ分離

## 13. バックエンドテストのトラブルシューティング

### 13.1 よくある問題と解決策

- **テストデータベース接続エラー**: 環境変数とコネクション設定を確認
- **非同期テストのタイムアウト**: テストタイムアウト設定の調整
- **テスト間の依存関係**: 各テストでデータをクリーンアップ
- **モックの不整合**: モックの戻り値と実際の実装の一致を確認

### 13.2 デバッグ方法

- `console.log` を使用したデバッグ出力
- Jest の `--verbose` フラグでより詳細な出力
- データベースクエリのログ記録
- トランザクションを使用したテストデータの分離