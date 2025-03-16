# API実装パターン集

## 概要

このドキュメントでは、DigeClipのバックエンドAPI実装における共通パターンと外部サービス連携方法を定義します。目的は「同じようなコードを何度も書かなくて済む」ようにすることです。「どんなエンジニアでも間違うことなく実装できる」ことを重視しつつ、「実装が複雑すぎず時間がかからない」方法を採用します。

## 1. 基本的なAPIエンドポイント実装パターン

### 1.1 一覧取得 (GET /api/[role]/[resource])

```typescript
// /api/user/contents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';

async function handler(req: NextRequest) {
  // クエリパラメータのバリデーション
  const searchParams = req.nextUrl.searchParams;
  const query = await validate(schemas.contentSearch, Object.fromEntries(searchParams));

  // サービス呼び出し
  const { items, total } = await contentService.searchContents(query);

  // レスポンス
  return NextResponse.json({
    data: items,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit)
    }
  });
}

// ミドルウェア適用（認証＋エラーハンドリング）
export const GET = withApiHandler(handler, { role: 'user' });
```

### 1.2 詳細取得 (GET /api/[role]/[resource]/[id])

```typescript
// /api/user/contents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { contentService } from '@/lib/services/content/contentService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // サービス呼び出し
  const content = await contentService.getContentById(id);

  // 存在チェック
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // レスポンス
  return NextResponse.json({ data: content });
}

export const GET = withApiHandler(handler, { role: 'user' });
```

### 1.3 新規作成 (POST /api/[role]/[resource])

```typescript
// /api/admin/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { sourceService } from '@/lib/services/source/sourceService';

async function handler(req: NextRequest) {
  // リクエストボディのバリデーション
  const body = await req.json();
  const data = await validate(schemas.sourceCreate, body);

  // サービス呼び出し
  const source = await sourceService.createSource(data);

  // レスポンス
  return NextResponse.json({ data: source }, { status: 201 });
}

export const POST = withApiHandler(handler, { role: 'admin' });
```

### 1.4 更新 (PUT /api/[role]/[resource]/[id])

```typescript
// /api/admin/sources/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { sourceService } from '@/lib/services/source/sourceService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // リクエストボディのバリデーション
  const body = await req.json();
  const data = await validate(schemas.sourceUpdate, body);

  // 存在チェック
  const existingSource = await sourceService.getSourceById(id);
  if (!existingSource) {
    throw errors.notFound('ソース');
  }

  // サービス呼び出し
  const updatedSource = await sourceService.updateSource(id, data);

  // レスポンス
  return NextResponse.json({ data: updatedSource });
}

export const PUT = withApiHandler(handler, { role: 'admin' });
```

### 1.5 削除 (DELETE /api/[role]/[resource]/[id])

```typescript
// /api/admin/sources/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { sourceService } from '@/lib/services/source/sourceService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // 存在チェック
  const existingSource = await sourceService.getSourceById(id);
  if (!existingSource) {
    throw errors.notFound('ソース');
  }

  // サービス呼び出し
  await sourceService.deleteSource(id);

  // レスポンス (204 No Content)
  return new NextResponse(null, { status: 204 });
}

export const DELETE = withApiHandler(handler, { role: 'admin' });
```

## 2. 複合リソース操作パターン

### 2.1 リレーション取得 (GET /api/[role]/[resource]/[id]/[relation])

```typescript
// /api/user/contents/[id]/summaries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // クエリパラメータのバリデーション
  const searchParams = req.nextUrl.searchParams;
  const query = await validate(schemas.summarySearch, Object.fromEntries(searchParams));

  // サービス呼び出し
  const summaries = await contentService.getContentSummaries(id, query);

  // レスポンス
  return NextResponse.json({ data: summaries });
}

export const GET = withApiHandler(handler, { role: 'user' });
```

### 2.2 リレーション追加 (POST /api/[role]/[resource]/[id]/[relation])

```typescript
// /api/user/contents/[id]/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // リクエストボディのバリデーション
  const body = await req.json();
  const data = await validate(schemas.tagAdd, body);

  // サービス呼び出し
  const updatedContent = await contentService.addTagToContent(id, data.tagId);

  // レスポンス
  return NextResponse.json({ data: updatedContent });
}

export const POST = withApiHandler(handler, { role: 'user' });
```

### 2.3 リレーション削除 (DELETE /api/[role]/[resource]/[id]/[relation]/[relationId])

```typescript
// /api/user/contents/[id]/tags/[tagId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { contentService } from '@/lib/services/content/contentService';
import { errors } from '@/lib/utils/error';

async function handler(
  req: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) {
  const { id, tagId } = params;

  // IDのバリデーション
  if (!id || !tagId) {
    throw errors.validation({
      id: !id ? 'コンテンツIDが不正です' : undefined,
      tagId: !tagId ? 'タグIDが不正です' : undefined
    });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // サービス呼び出し
  await contentService.removeTagFromContent(id, tagId);

  // レスポンス
  return new NextResponse(null, { status: 204 });
}

export const DELETE = withApiHandler(handler, { role: 'user' });
```

## 3. 特殊操作パターン

### 3.1 一括操作 (POST /api/[role]/[resource]/batch)

```typescript
// /api/admin/contents/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest) {
  // リクエストボディのバリデーション
  const body = await req.json();
  const data = await validate(schemas.contentBatchOperation, body);

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
  return NextResponse.json({ data: result });
}

export const POST = withApiHandler(handler, { role: 'admin' });
```

### 3.2 アクション実行 (POST /api/[role]/[resource]/[id]/[action])

```typescript
// /api/admin/contents/[id]/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';
import { aiService } from '@/lib/services/ai/aiService';
import { errors } from '@/lib/utils/error';

async function handler(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id) {
    throw errors.validation({ id: 'IDが不正です' });
  }

  // 存在チェック
  const content = await contentService.getContentById(id);
  if (!content) {
    throw errors.notFound('コンテンツ');
  }

  // リクエストボディのバリデーション
  const body = await req.json();
  const data = await validate(schemas.summarizeOptions, body);

  // サービス呼び出し
  const summary = await aiService.summarizeContent(id, data.modelId, data.type);

  // レスポンス
  return NextResponse.json({ data: summary });
}

export const POST = withApiHandler(handler, { role: 'admin' });
```

### 3.3 検索 (POST /api/[role]/[resource]/search)

```typescript
// /api/user/contents/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { contentService } from '@/lib/services/content/contentService';

async function handler(req: NextRequest) {
  // リクエストボディのバリデーション
  const body = await req.json();
  const searchParams = await validate(schemas.contentAdvancedSearch, body);

  // サービス呼び出し
  const { items, total } = await contentService.advancedSearch(searchParams);

  // レスポンス
  return NextResponse.json({
    data: items,
    meta: {
      total,
      page: searchParams.page,
      limit: searchParams.limit,
      pages: Math.ceil(total / searchParams.limit)
    }
  });
}

export const POST = withApiHandler(handler, { role: 'user' });
```

## 4. 認証関連パターン

### 4.1 ログイン (POST /api/auth/login)

```typescript
// /api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/middleware/errorHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { authService } from '@/lib/services/auth/authService';

async function handler(req: NextRequest) {
  // リクエストボディのバリデーション
  const body = await req.json();
  const credentials = await validate(schemas.login, body);

  // 認証
  try {
    const { user, token } = await authService.login(credentials.email, credentials.password);

    // JWTをCookieにセット
    const response = NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400 // 24時間
    });

    return response;
  } catch (error) {
    // 認証エラー
    return NextResponse.json(
      {
        error: {
          code: 'E401',
          message: 'メールアドレスまたはパスワードが正しくありません'
        }
      },
      { status: 401 }
    );
  }
}

export const POST = withErrorHandling(handler);
```

### 4.2 ログアウト (POST /api/auth/logout)

```typescript
// /api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';

async function handler(req: NextRequest) {
  // Cookieを削除
  const response = NextResponse.json({
    data: { message: 'ログアウトしました' }
  });

  response.cookies.set({
    name: 'auth-token',
    value: '',
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });

  return response;
}

export const POST = withApiHandler(handler);
```

### 4.3 ユーザー登録 (POST /api/auth/register)

```typescript
// /api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/middleware/errorHandler';
import { validate, schemas } from '@/lib/utils/validation';
import { authService } from '@/lib/services/auth/authService';

async function handler(req: NextRequest) {
  // リクエストボディのバリデーション
  const body = await req.json();
  const userData = await validate(schemas.register, body);

  // メールアドレスの重複チェック
  const existingUser = await authService.getUserByEmail(userData.email);
  if (existingUser) {
    return NextResponse.json(
      {
        error: {
          code: 'E400',
          message: 'このメールアドレスは既に登録されています'
        }
      },
      { status: 400 }
    );
  }

  // ユーザー登録
  const user = await authService.register(userData);

  // レスポンス
  return NextResponse.json(
    {
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    },
    { status: 201 }
  );
}

export const POST = withErrorHandling(handler);
```

## 5. 定期実行ジョブパターン

### 5.1 コンテンツ取得ジョブ (GET /api/cron/fetch-contents)

```typescript
// /api/cron/fetch-contents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { sourceService } from '@/lib/services/source/sourceService';
import { contentService } from '@/lib/services/content/contentService';

async function handler(req: NextRequest) {
  // Vercel Cronからの呼び出しのみ許可
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: { code: 'E401', message: '不正なアクセスです' } },
      { status: 401 }
    );
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

  return NextResponse.json({
    message: 'コンテンツ取得ジョブが完了しました',
    results
  });
}

// 認証不要（Cronからの呼び出し）
export const GET = withApiHandler(handler);
```

### 5.2 要約ジョブ (GET /api/cron/summarize)

```typescript
// /api/cron/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { contentService } from '@/lib/services/content/contentService';
import { aiService } from '@/lib/services/ai/aiService';

async function handler(req: NextRequest) {
  // Vercel Cronからの呼び出しのみ許可
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: { code: 'E401', message: '不正なアクセスです' } },
      { status: 401 }
    );
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

  return NextResponse.json({
    message: '要約ジョブが完了しました',
    results
  });
}

// 認証不要（Cronからの呼び出し）
export const GET = withApiHandler(handler);
```

## 6. ミドルウェア実装

### 6.1 APIハンドラーミドルウェア

```typescript
// /lib/middleware/apiHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from './errorHandler';
import { withAuth } from './auth';

type ApiHandlerOptions = {
  role?: 'admin' | 'user' | null;
};

export function withApiHandler(
  handler: (req: NextRequest, params: any) => Promise<NextResponse>,
  options: ApiHandlerOptions = {}
) {
  // 認証が必要な場合
  if (options.role) {
    return withErrorHandling(withAuth(handler, options.role));
  }

  // 認証不要の場合
  return withErrorHandling(handler);
}
```

### 6.2 認証ミドルウェア

```typescript
// /lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/authService';
import { errors } from '@/lib/utils/error';

export function withAuth(
  handler: (req: NextRequest, params: any) => Promise<NextResponse>,
  requiredRole: 'admin' | 'user'
) {
  return async (req: NextRequest, params: any) => {
    // トークンの取得
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      throw errors.unauthorized('認証が必要です');
    }

    try {
      // トークンの検証
      const user = await authService.verifyToken(token);

      // ロールチェック
      if (requiredRole === 'admin' && user.role !== 'admin') {
        throw errors.forbidden('この操作を行う権限がありません');
      }

      // ユーザー情報をリクエストに追加
      req.user = user;

      // 元のハンドラーを実行
      return handler(req, params);
    } catch (error) {
      throw errors.unauthorized('認証セッションが無効です');
    }
  };
}
```

### 6.3 エラーハンドリングミドルウェア

```typescript
// /lib/middleware/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server';

export function withErrorHandling(
  handler: (req: NextRequest, params: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error) {
      console.error('API Error:', error);

      // カスタムエラーの場合
      if (error.code && error.message) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details
            }
          },
          { status: error.statusCode || 500 }
        );
      }

      // 未処理のエラーの場合
      return NextResponse.json(
        {
          error: {
            code: 'E500',
            message: '内部サーバーエラーが発生しました'
          }
        },
        { status: 500 }
      );
    }
  };
}
```

## 7. 外部サービス連携パターン

### 7.1 SNS認証

#### 7.1.1 Google OAuth 2.0連携フロー

```typescript
// /api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { authService } from '@/lib/services/auth/authService';

async function handler(req: NextRequest) {
  // Google認証URLを生成
  const authUrl = await authService.generateGoogleAuthUrl();

  // リダイレクト
  return NextResponse.redirect(authUrl);
}

export const GET = withApiHandler(handler);
```

```typescript
// /api/auth/google-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { authService } from '@/lib/services/auth/authService';

async function handler(req: NextRequest) {
  // コードとステートを取得
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json(
      { error: { code: 'E400', message: '認証コードがありません' } },
      { status: 400 }
    );
  }

  try {
    // Googleトークンを取得し、ユーザー情報を検証
    const { user, token } = await authService.handleGoogleCallback(code, state);

    // JWTを発行してCookieに設定
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24時間
    });

    return response;
  } catch (error) {
    console.error('Google認証エラー:', error);
    return NextResponse.redirect(new URL('/auth/error?code=google_auth_failed', req.url));
  }
}

export const GET = withApiHandler(handler);
```

#### 7.1.2 アクセストークン管理

```typescript
// /lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from '@/lib/utils/jwt';

export async function authMiddleware(req: NextRequest) {
  // Cookieからトークンを取得
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: { code: 'E401', message: '認証が必要です' } },
      { status: 401 }
    );
  }

  try {
    // トークンを検証
    const payload = await jwtVerify(token);

    // リクエストにユーザー情報を追加
    req.user = payload.user;

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'E401', message: 'トークンが無効です' } },
      { status: 401 }
    );
  }
}
```

### 7.2 決済サービス連携

#### 7.2.1 Stripe決済フロー

```typescript
// /api/payment/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { withAuth } from '@/lib/middleware/auth';
import { paymentService } from '@/lib/services/payment/paymentService';

async function handler(req: NextRequest) {
  const { user } = req;
  const { planId } = await req.json();

  try {
    // Stripeセッションを作成
    const session = await paymentService.createStripeSession({
      userId: user.id,
      planId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`
    });

    return NextResponse.json({ data: { sessionId: session.id, url: session.url } });
  } catch (error) {
    console.error('決済セッション作成エラー:', error);
    return NextResponse.json(
      { error: { code: 'E500', message: '決済セッションの作成に失敗しました' } },
      { status: 500 }
    );
  }
}

export const POST = withApiHandler(withAuth(handler));
```

#### 7.2.2 Webhook処理

```typescript
// /api/payment/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { paymentService } from '@/lib/services/payment/paymentService';

// Webhookはraw bodyが必要なため、bodyParserをオフに
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 });
  }

  // リクエストボディをバッファとして取得
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);

  // Stripe署名を検証
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: { code: 'E400', message: 'Stripe署名がありません' } },
      { status: 400 }
    );
  }

  try {
    // イベントを検証して処理
    const event = await paymentService.verifyStripeWebhook(rawBody, signature);

    // イベントタイプに応じた処理
    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentService.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await paymentService.handlePaymentFailure(event.data.object);
        break;
      // その他のイベント
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    return NextResponse.json(
      { error: { code: 'E400', message: 'Webhook処理に失敗しました' } },
      { status: 400 }
    );
  }
}

export const POST = withApiHandler(handler);
```

### 7.3 メール配信

#### 7.3.1 トランザクションメール送信

```typescript
// /lib/services/notification/emailService.ts
import { createTransport } from 'nodemailer';
import { renderTemplate } from '@/lib/utils/template';

export const emailService = {
  async sendTransactionalEmail({ to, subject, templateName, data }) {
    // メールトランスポートを作成
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // テンプレートをレンダリング
    const html = await renderTemplate(templateName, data);

    // メール送信
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    });
  },

  // パスワードリセットメール
  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    await this.sendTransactionalEmail({
      to: user.email,
      subject: 'パスワードリセット',
      templateName: 'password-reset',
      data: {
        name: user.name,
        resetUrl
      }
    });
  },

  // ウェルカムメール
  async sendWelcome(user) {
    await this.sendTransactionalEmail({
      to: user.email,
      subject: 'DigeClipへようこそ',
      templateName: 'welcome',
      data: {
        name: user.name
      }
    });
  }
};
```

#### 7.3.2 バルクメール送信

```typescript
// /api/cron/send-newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/apiHandler';
import { emailService } from '@/lib/services/notification/emailService';
import { userService } from '@/lib/services/user/userService';
import { contentService } from '@/lib/services/content/contentService';

async function handler(req: NextRequest) {
  // CRON_SECRETによる認証
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: { code: 'E401', message: '認証が必要です' } },
      { status: 401 }
    );
  }

  try {
    // 購読ユーザーを取得
    const subscribers = await userService.getNewsletterSubscribers();

    // 最新コンテンツを取得
    const latestContents = await contentService.getLatestContents(10);

    // バッチ処理でメール送信
    const batchSize = 50; // 一度に送信する最大数

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      // 並列処理でメール送信
      await Promise.all(
        batch.map(user =>
          emailService.sendTransactionalEmail({
            to: user.email,
            subject: '今週のダイジェスト',
            templateName: 'weekly-digest',
            data: {
              name: user.name,
              contents: latestContents
            }
          })
        )
      );

      // レート制限を避けるための遅延
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      data: {
        success: true,
        sent: subscribers.length
      }
    });
  } catch (error) {
    console.error('ニュースレター送信エラー:', error);
    return NextResponse.json(
      { error: { code: 'E500', message: 'ニュースレターの送信に失敗しました' } },
      { status: 500 }
    );
  }
}

export const GET = withApiHandler(handler);
```

### 7.4 AI/LLM連携

#### 7.4.1 OpenAI APIを使用した要約生成

```typescript
// /lib/services/ai/openaiService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openaiService = {
  async generateSummary(content, type = 'short') {
    // 要約タイプに応じたプロンプトを設定
    const promptMap = {
      short: '次の記事を100文字以内で簡潔に要約してください:',
      medium: '次の記事を300文字程度で要約してください:',
      long: '次の記事を500文字程度で詳細に要約してください:'
    };

    const prompt = promptMap[type] || promptMap.short;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'あなたは記事を要約する専門家です。与えられた記事を指定された長さで要約してください。' },
          { role: 'user', content: `${prompt}\n\n${content}` }
        ],
        temperature: 0.3,
        max_tokens: type === 'short' ? 100 : type === 'medium' ? 300 : 500
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API エラー:', error);
      throw new Error('要約の生成に失敗しました');
    }
  }
};
```

#### 7.4.2 Anthropic APIを使用した要約生成

```typescript
// /lib/services/ai/anthropicService.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const anthropicService = {
  async generateSummary(content, type = 'short') {
    // 要約タイプに応じたプロンプトを設定
    const promptMap = {
      short: '次の記事を100文字以内で簡潔に要約してください:',
      medium: '次の記事を300文字程度で要約してください:',
      long: '次の記事を500文字程度で詳細に要約してください:'
    };

    const prompt = promptMap[type] || promptMap.short;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: type === 'short' ? 100 : type === 'medium' ? 300 : 500,
        temperature: 0.3,
        system: 'あなたは記事を要約する専門家です。与えられた記事を指定された長さで要約してください。',
        messages: [
          { role: 'user', content: `${prompt}\n\n${content}` }
        ]
      });

      return response.content[0].text.trim();
    } catch (error) {
      console.error('Anthropic API エラー:', error);
      throw new Error('要約の生成に失敗しました');
    }
  }
};
```

#### 7.4.3 AIモデル選択サービス

```typescript
// /lib/services/ai/aiService.ts
import { openaiService } from './openaiService';
import { anthropicService } from './anthropicService';
import { aiModelRepository } from '@/lib/db/repositories/aiModelRepository';

export const aiService = {
  async generateSummary(content, type = 'short', modelId = null) {
    try {
      // モデルIDが指定されていない場合はデフォルトモデルを使用
      let model;

      if (modelId) {
        model = await aiModelRepository.findById(modelId);
      } else {
        model = await aiModelRepository.findDefault();
      }

      if (!model) {
        throw new Error('AIモデルが見つかりません');
      }

      // プロバイダーに応じたサービスを選択
      switch (model.provider) {
        case 'openai':
          return await openaiService.generateSummary(content, type);
        case 'anthropic':
          return await anthropicService.generateSummary(content, type);
        default:
          throw new Error('サポートされていないAIプロバイダーです');
      }
    } catch (error) {
      console.error('AI要約エラー:', error);
      throw new Error('要約の生成に失敗しました');
    }
  }
};
```

### 7.5 外部サービス連携のエラー処理パターン

```typescript
// /lib/utils/apiError.ts
export class ApiError extends Error {
  constructor(public code, public message, public status = 500, public details = {}) {
    super(message);
    this.name = 'ApiError';
  }
}

// 外部APIエラーをラップする関数
export async function withExternalApiCall<T>(
  apiCall: () => Promise<T>,
  errorMap: Record<string, { code: string; message: string; status: number }> = {}
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('外部API呼び出しエラー:', error);

    // エラーコードに基づいてマッピング
    const errorCode = error.code || 'unknown_error';
    const mappedError = errorMap[errorCode] || {
      code: 'E500',
      message: '外部サービスとの通信中にエラーが発生しました',
      status: 500
    };

    throw new ApiError(
      mappedError.code,
      mappedError.message,
      mappedError.status,
      { originalError: error.message }
    );
  }
}
```

```typescript
// 使用例
import { withExternalApiCall } from '@/lib/utils/apiError';

// OpenAI APIの呼び出し
const summary = await withExternalApiCall(
  () => openaiService.generateSummary(content, type),
  {
    'insufficient_quota': {
      code: 'E503',
      message: 'AIサービスの利用制限に達しました。後でお試しください。',
      status: 503
    },
    'rate_limit_exceeded': {
      code: 'E429',
      message: 'リクエスト数の制限に達しました。しばらく待ってからお試しください。',
      status: 429
    }
  }
);
```

### 7.6 Mastra.aiとの連携

#### 7.6.1 複数段階要約への活用

```typescript
// /lib/services/ai/mastraService.ts
import axios from 'axios';

export const mastraService = {
  async generateMultiStepSummary(content) {
    try {
      // Mastra.ai APIへのリクエスト
      const response = await axios.post(
        `${process.env.MASTRA_API_URL}/workflows/execute`,
        {
          workflowId: process.env.MASTRA_WORKFLOW_ID,
          input: {
            content
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MASTRA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // レスポンスから要約を取得
      const { overview, headings, details } = response.data.result;

      return {
        overview,
        headings,
        details
      };
    } catch (error) {
      console.error('Mastra.ai API エラー:', error);
      throw new Error('複数段階要約の生成に失敗しました');
    }
  },

  async getWorkflowStatus(executionId) {
    try {
      const response = await axios.get(
        `${process.env.MASTRA_API_URL}/workflows/executions/${executionId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.MASTRA_API_KEY}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Mastra.ai ワークフローステータス取得エラー:', error);
      throw new Error('ワークフローステータスの取得に失敗しました');
    }
  }
};
```

#### 7.6.2 エージェント機能の活用

```typescript
// /lib/services/ai/mastraAgentService.ts
import axios from 'axios';

export const mastraAgentService = {
  async executeAgentAction(action, parameters) {
    try {
      // Mastra.ai Agentへのリクエスト
      const response = await axios.post(
        `${process.env.MASTRA_API_URL}/agents/execute`,
        {
          agentId: process.env.MASTRA_AGENT_ID,
          action,
          parameters
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.MASTRA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.result;
    } catch (error) {
      console.error('Mastra.ai Agent エラー:', error);
      throw new Error('エージェントアクションの実行に失敗しました');
    }
  },

  // 決済ステータス照会
  async checkPaymentStatus(paymentId) {
    return this.executeAgentAction('checkPaymentStatus', { paymentId });
  },

  // メール配信統計取得
  async getEmailStats(campaignId) {
    return this.executeAgentAction('getEmailStats', { campaignId });
  },

  // 異常検出
  async detectAnomalies(data) {
    return this.executeAgentAction('detectAnomalies', { data });
  }
};
```

## 8. まとめ

このドキュメントでは、DigeClipバックエンドの実装における共通パターンと外部サービス連携方法を定義しました。これらのパターンを活用することで、一貫性のある実装が可能になり、開発効率と保守性が向上します。

実装時には以下の点に注意してください：

1. **エラーハンドリング**: すべてのAPIエンドポイントで適切なエラーハンドリングを行い、ユーザーフレンドリーなエラーメッセージを返す
2. **バリデーション**: リクエストデータは必ず検証し、不正なデータを早期に検出する
3. **トランザクション**: 複数のデータベース操作を伴う処理ではトランザクションを使用する
4. **セキュリティ**: 認証・認可を適切に実装し、機密情報を保護する
5. **外部サービス連携**: レート制限やエラー処理を考慮し、リトライ戦略を実装する

これらのパターンは、DigeClipの要件に合わせて適宜カスタマイズして使用してください。