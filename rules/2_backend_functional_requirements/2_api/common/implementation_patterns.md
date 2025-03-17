# API実装パターン集

> **前提**
> - このドキュメントは、DigeClipのバックエンドAPI実装における共通パターンを定義します。
> - 目的は「**同じようなコードを何度も書かなくて済む**」ようにすることです。
> - 「**どんなエンジニアでも間違うことなく実装できる**」ことを重視しつつ、「**実装が複雑すぎず時間がかからない**」方法を採用します。

---

## 1. 基本的なAPIエンドポイント実装パターン

### 1.1 一覧取得 (GET /api/[role]/[resource])

```typescript
// /api/user/contents/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { validate, schemas } from '../../../lib/utils/validation';
import { contentService } from '../../../lib/services/content/contentService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // クエリパラメータのバリデーション
  const query = await validate(schemas.contentSearch, req.query);

  // サービス呼び出し
  const { items, total } = await contentService.searchContents(query);

  // レスポンス
  return res.status(200).json({
    data: items,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit)
    }
  });
};

// ミドルウェア適用（認証＋エラーハンドリング）
export default withApiHandler(handler, { role: 'user' });
```

### 1.2 詳細取得 (GET /api/[role]/[resource]/[id])

```typescript
// /api/user/contents/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { contentService } from '../../../lib/services/content/contentService';
import { errors } from '../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // サービス呼び出し
  const content = await contentService.getContentById(id);

  // 存在チェック
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // レスポンス
  return res.status(200).json({ data: content });
};

export default withApiHandler(handler, { role: 'user' });
```

### 1.3 新規作成 (POST /api/[role]/[resource])

```typescript
// /api/admin/sources/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { validate, schemas } from '../../../lib/utils/validation';
import { sourceService } from '../../../lib/services/source/sourceService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const data = await validate(schemas.sourceCreate, req.body);

  // サービス呼び出し
  const source = await sourceService.createSource(data);

  // レスポンス
  return res.status(201).json({ data: source });
};

export default withApiHandler(handler, { role: 'admin' });
```

### 1.4 更新 (PUT /api/[role]/[resource]/[id])

```typescript
// /api/admin/sources/[id].ts (PUT部分)
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { validate, schemas } from '../../../lib/utils/validation';
import { sourceService } from '../../../lib/services/source/sourceService';
import { errors } from '../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const data = await validate(schemas.sourceUpdate, req.body);

  // 存在チェック
  const existingSource = await sourceService.getSourceById(id);
  if (!existingSource) {
    throw errors.notFound('ソース');
  }

  // サービス呼び出し
  const updatedSource = await sourceService.updateSource(id, data);

  // レスポンス
  return res.status(200).json({ data: updatedSource });
};

export default withApiHandler(handler, { role: 'admin' });
```

### 1.5 削除 (DELETE /api/[role]/[resource]/[id])

```typescript
// /api/admin/sources/[id].ts (DELETE部分)
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { sourceService } from '../../../lib/services/source/sourceService';
import { errors } from '../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // 存在チェック
  const existingSource = await sourceService.getSourceById(id);
  if (!existingSource) {
    throw errors.notFound('ソース');
  }

  // サービス呼び出し
  await sourceService.deleteSource(id);

  // レスポンス (204 No Content)
  return res.status(204).end();
};

export default withApiHandler(handler, { role: 'admin' });
```

---

## 2. 複合リソース操作パターン

### 2.1 リレーション取得 (GET /api/[role]/[resource]/[id]/[relation])

```typescript
// /api/user/contents/[id]/summaries.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../../lib/utils/middleware';
import { validate, schemas } from '../../../../lib/utils/validation';
import { contentService } from '../../../../lib/services/content/contentService';
import { errors } from '../../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // クエリパラメータのバリデーション
  const query = await validate(schemas.summarySearch, req.query);

  // サービス呼び出し
  const summaries = await contentService.getContentSummaries(id, query);

  // レスポンス
  return res.status(200).json({ data: summaries });
};

export default withApiHandler(handler, { role: 'user' });
```

### 2.2 リレーション追加 (POST /api/[role]/[resource]/[id]/[relation])

```typescript
// /api/user/contents/[id]/tags.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../../lib/utils/middleware';
import { validate, schemas } from '../../../../lib/utils/validation';
import { contentService } from '../../../../lib/services/content/contentService';
import { errors } from '../../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // リクエストボディのバリデーション
  const data = await validate(schemas.tagAdd, req.body);

  // サービス呼び出し
  const updatedContent = await contentService.addTagToContent(id, data.tagId);

  // レスポンス
  return res.status(200).json({ data: updatedContent });
};

export default withApiHandler(handler, { role: 'user' });
```

### 2.3 リレーション削除 (DELETE /api/[role]/[resource]/[id]/[relation]/[relationId])

```typescript
// /api/user/contents/[id]/tags/[tagId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../../../lib/utils/middleware';
import { contentService } from '../../../../../lib/services/content/contentService';
import { errors } from '../../../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, tagId } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string' || !tagId || typeof tagId !== 'string') {
    throw errors.validation({
      id: !id || typeof id !== 'string' ? 'コンテンツIDが不正です' : undefined,
      tagId: !tagId || typeof tagId !== 'string' ? 'タグIDが不正です' : undefined
    });
  }

  // メソッドチェック
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // サービス呼び出し
  await contentService.removeTagFromContent(id, tagId);

  // レスポンス
  return res.status(204).end();
};

export default withApiHandler(handler, { role: 'user' });
```

---

## 3. 特殊操作パターン

### 3.1 一括操作 (POST /api/[role]/[resource]/batch)

```typescript
// /api/admin/contents/batch.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { validate, schemas } from '../../../lib/utils/validation';
import { contentService } from '../../../lib/services/content/contentService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const data = await validate(schemas.contentBatchOperation, req.body);

  // 操作タイプに応じた処理
  let result;

  switch (data.operation) {
    case 'delete':
      result = await contentService.batchDelete(data.ids);
      break;
    case 'tag':
      result = await contentService.batchAddTag(data.ids, data.tagId);
      break;
    case 'untag':
      result = await contentService.batchRemoveTag(data.ids, data.tagId);
      break;
    default:
      throw errors.validation({ operation: '不明な操作タイプです' });
  }

  // レスポンス
  return res.status(200).json({ data: result });
};

export default withApiHandler(handler, { role: 'admin' });
```

### 3.2 アクション実行 (POST /api/[role]/[resource]/[id]/[action])

```typescript
// /api/admin/contents/[id]/summarize.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../../lib/utils/middleware';
import { validate, schemas } from '../../../../lib/utils/validation';
import { contentService } from '../../../../lib/services/content/contentService';
import { aiService } from '../../../../lib/services/ai/aiService';
import { errors } from '../../../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // IDのバリデーション
  if (!id || typeof id !== 'string') {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // リクエストボディのバリデーション
  const data = await validate(schemas.summarizeOptions, req.body);

  // サービス呼び出し
  const summary = await aiService.summarizeContent(id, data.modelId, data.type);

  // レスポンス
  return res.status(200).json({ data: summary });
};

export default withApiHandler(handler, { role: 'admin' });
```

### 3.3 検索 (POST /api/[role]/[resource]/search)

```typescript
// /api/user/contents/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../../lib/utils/middleware';
import { validate, schemas } from '../../../lib/utils/validation';
import { contentService } from '../../../lib/services/content/contentService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const searchParams = await validate(schemas.contentAdvancedSearch, req.body);

  // サービス呼び出し
  const { items, total } = await contentService.advancedSearch(searchParams);

  // レスポンス
  return res.status(200).json({
    data: items,
    meta: {
      total,
      page: searchParams.page,
      limit: searchParams.limit,
      pages: Math.ceil(total / searchParams.limit)
    }
  });
};

export default withApiHandler(handler, { role: 'user' });
```

---

## 4. 認証関連パターン

### 4.1 ログイン (POST /api/auth/login)

```typescript
// /api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandling } from '../../lib/utils/middleware';
import { validate, schemas } from '../../lib/utils/validation';
import { authService } from '../../lib/services/auth/authService';
import { errors } from '../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const credentials = await validate(schemas.login, req.body);

  // 認証
  try {
    const { user, token } = await authService.login(credentials.email, credentials.password);

    // JWTをCookieにセット
    res.setHeader('Set-Cookie', `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''} Max-Age=86400`);

    // レスポンス
    return res.status(200).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    // 認証エラー
    return res.status(401).json({
      error: {
        code: 'E401',
        message: 'メールアドレスまたはパスワードが正しくありません'
      }
    });
  }
};

export default withErrorHandling(handler);
```

### 4.2 ログアウト (POST /api/auth/logout)

```typescript
// /api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../lib/utils/middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // Cookieを削除
  res.setHeader('Set-Cookie', 'auth-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');

  // レスポンス
  return res.status(200).json({ data: { message: 'ログアウトしました' } });
};

export default withApiHandler(handler);
```

### 4.3 ユーザー登録 (POST /api/auth/register)

```typescript
// /api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withErrorHandling } from '../../lib/utils/middleware';
import { validate, schemas } from '../../lib/utils/validation';
import { authService } from '../../lib/services/auth/authService';
import { errors } from '../../lib/utils/error';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // メソッドチェック
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'E405', message: 'Method Not Allowed' } });
  }

  // リクエストボディのバリデーション
  const userData = await validate(schemas.register, req.body);

  // メールアドレスの重複チェック
  const existingUser = await authService.getUserByEmail(userData.email);
  if (existingUser) {
    return res.status(400).json({
      error: {
        code: 'E400',
        message: 'このメールアドレスは既に登録されています'
      }
    });
  }

  // ユーザー登録
  const user = await authService.register(userData);

  // レスポンス
  return res.status(201).json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
};

export default withErrorHandling(handler);
```

---

## 5. 定期実行ジョブパターン

### 5.1 コンテンツ取得ジョブ (GET /api/cron/fetch-contents)

```typescript
// /api/cron/fetch-contents.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../lib/utils/middleware';
import { sourceService } from '../../lib/services/source/sourceService';
import { contentService } from '../../lib/services/content/contentService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Vercel Cronからの呼び出しのみ許可
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: { code: 'E401', message: '不正なアクセスです' } });
  }

  // アクティブなソース一覧を取得
  const sources = await sourceService.getActiveSources();

  // 各ソースから新しいコンテンツを取得
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      try {
        const newContents = await sourceService.fetchNewContents(source.id);

        // 新しいコンテンツごとに処理
        for (const content of newContents) {
          // コンテンツを保存
          await contentService.createContent({
            title: content.title,
            sourceId: source.id,
            originalUrl: content.url,
            publishedAt: content.publishedAt,
            // その他の必要なデータ
          });
        }

        return { sourceId: source.id, count: newContents.length };
      } catch (error) {
        console.error(`Error fetching contents from source ${source.id}:`, error);
        return { sourceId: source.id, error: error.message };
      }
    })
  );

  return res.status(200).json({
    message: 'コンテンツ取得ジョブが完了しました',
    results
  });
};

// 認証不要（Cronからの呼び出し）
export default withApiHandler(handler);
```

### 5.2 要約ジョブ (GET /api/cron/summarize)

```typescript
// /api/cron/summarize.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiHandler } from '../../lib/utils/middleware';
import { contentService } from '../../lib/services/content/contentService';
import { aiService } from '../../lib/services/ai/aiService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Vercel Cronからの呼び出しのみ許可
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: { code: 'E401', message: '不正なアクセスです' } });
  }

  // 要約が必要なコンテンツを取得
  const contents = await contentService.getContentsNeedingSummary();

  // 各コンテンツを要約
  const results = await Promise.allSettled(
    contents.map(async (content) => {
      try {
        // デフォルトAIモデルを取得
        const defaultModel = await aiService.getDefaultModel();

        // 要約を実行
        const summary = await aiService.summarizeContent(content.id, defaultModel.id);

        return { contentId: content.id, success: true };
      } catch (error) {
        console.error(`Error summarizing content ${content.id}:`, error);
        return { contentId: content.id, error: error.message };
      }
    })
  );

  return res.status(200).json({
    message: '要約ジョブが完了しました',
    results
  });
};

// 認証不要（Cronからの呼び出し）
export default withApiHandler(handler);
```

---

## 6. まとめ

このドキュメントで紹介した実装パターンを活用することで、以下のメリットが得られます：

1. **コードの一貫性**: 同じパターンで実装することで、コードの可読性と保守性が向上します。

2. **開発効率の向上**: 既存のパターンを再利用することで、新しいAPIエンドポイントを迅速に実装できます。

3. **エラー削減**: 共通のバリデーションやエラーハンドリングを使用することで、バグの発生を減らせます。

4. **学習コスト削減**: 明確なパターンがあることで、新しいエンジニアの学習コストが下がります。

これらのパターンは、DigeClipのバックエンド開発において「**機能追加しやすく、何度も同じようなコードを書かなくていい**」アーキテクチャを実現するための基盤となります。