# 再利用可能なコンポーネント集

> **前提**
> - このドキュメントは、DigeClipのバックエンド実装における再利用可能なコンポーネントを定義します。
> - 目的は「**何度も同じようなコンポーネントを作成しなくていい**」ようにすることです。
> - 「**どんなエンジニアでも間違うことなく実装できる**」ことを重視しつつ、「**実装が複雑すぎず時間がかからない**」方法を採用します。

---

## 1. ミドルウェア

### 1.1 認証ミドルウェア

```typescript
// /lib/utils/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';

export type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// 認証ミドルウェア
export const withAuth = (handler: NextApiHandler, requiredRole?: 'admin' | 'user'): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // トークン検証
      const user = await verifyToken(req);

      // ロールチェック
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({
          error: {
            code: 'E403',
            message: '権限がありません'
          }
        });
      }

      // リクエストにユーザー情報を追加
      req.user = user;

      // 本来のハンドラを実行
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        error: {
          code: 'E401',
          message: '認証に失敗しました'
        }
      });
    }
  };
};
```

### 1.2 エラーハンドリングミドルウェア

```typescript
// /lib/utils/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from './error';

// エラーハンドリングミドルウェア
export const withErrorHandling = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error(error);

      // AppErrorの場合
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        });
      }

      // ValidationErrorの場合
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: {
            code: 'E400',
            message: 'バリデーションエラー',
            details: error.details || error.errors
          }
        });
      }

      // その他のエラー
      return res.status(500).json({
        error: {
          code: 'E500',
          message: 'サーバーエラーが発生しました'
        }
      });
    }
  };
};
```

### 1.3 複合ミドルウェア

```typescript
// /lib/utils/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';

// 複数ミドルウェアの組み合わせ
export const withApiHandler = (handler: NextApiHandler, options?: { role?: 'admin' | 'user' }): NextApiHandler => {
  return withErrorHandling(
    options?.role ? withAuth(handler, options.role) : handler
  );
};
```

---

## 2. バリデーション

### 2.1 共通バリデーションスキーマ

```typescript
// /lib/utils/validation.ts
import * as z from 'zod';

// 再利用可能なバリデーションスキーマ
export const schemas = {
  // ID検証用スキーマ
  id: z.string().uuid('IDの形式が正しくありません'),

  // ページネーション用スキーマ
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  }),

  // 日付範囲用スキーマ
  dateRange: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式はYYYY-MM-DDで入力してください').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式はYYYY-MM-DDで入力してください').optional()
  }),

  // ソート用スキーマ
  sorting: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }),

  // ソース登録用スキーマ
  sourceCreate: z.object({
    name: z.string().min(1, '名前は必須です').max(100),
    url: z.string().url('有効なURLを入力してください'),
    type: z.enum(['youtube', 'blog', 'paper'], {
      errorMap: () => ({ message: '種別は youtube/blog/paper のいずれかを選択してください' })
    }),
    isActive: z.boolean().default(true)
  }),

  // ソース更新用スキーマ
  sourceUpdate: z.object({
    name: z.string().min(1, '名前は必須です').max(100).optional(),
    url: z.string().url('有効なURLを入力してください').optional(),
    isActive: z.boolean().optional()
  }),

  // コンテンツ検索用スキーマ
  contentSearch: z.object({
    keyword: z.string().optional(),
    sourceId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式はYYYY-MM-DDで入力してください').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式はYYYY-MM-DDで入力してください').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  }),

  // タグ追加用スキーマ
  tagAdd: z.object({
    tagId: z.string().uuid('タグIDの形式が正しくありません')
  }),

  // タグ作成用スキーマ
  tagCreate: z.object({
    name: z.string().min(1, '名前は必須です').max(20),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'カラーコードの形式が正しくありません').optional()
  }),

  // ログイン用スキーマ
  login: z.object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください')
  }),

  // ユーザー登録用スキーマ
  register: z.object({
    name: z.string().min(1, '名前は必須です').max(50),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'パスワードは大文字、小文字、数字を含める必要があります')
  }),

  // AIモデル設定用スキーマ
  aiModelSettings: z.object({
    modelId: z.string().uuid('モデルIDの形式が正しくありません'),
    apiKey: z.string().min(1, 'APIキーは必須です'),
    isDefault: z.boolean().optional()
  }),

  // 通知設定用スキーマ
  notificationSettings: z.object({
    webhookUrl: z.string().url('有効なWebhook URLを入力してください'),
    embedTitle: z.string().max(256, 'タイトルは256文字以内で入力してください'),
    embedDescription: z.string().max(4096, '説明は4096文字以内で入力してください'),
    embedColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'カラーコードの形式が正しくありません').optional(),
    embedThumbnailUrl: z.string().url('有効なサムネイルURLを入力してください').optional(),
    embedFooter: z.string().max(2048, 'フッターは2048文字以内で入力してください').optional()
  })
};
```

### 2.2 バリデーション実行関数

```typescript
// /lib/utils/validation.ts
import * as z from 'zod';

// バリデーション実行関数
export const validate = async <T>(schema: z.ZodSchema<T>, data: any): Promise<T> => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = {};

      for (const issue of error.issues) {
        const path = issue.path.join('.');
        details[path] = issue.message;
      }

      error.details = details;
    }

    error.name = 'ValidationError';
    throw error;
  }
};
```

---

## 3. エラーハンドリング

### 3.1 カスタムエラークラス

```typescript
// /lib/utils/error.ts
export class AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(message: string, code: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
```

### 3.2 共通エラー生成関数

```typescript
// /lib/utils/error.ts
export const errors = {
  notFound: (resource: string) =>
    new AppError(`${resource}が見つかりません`, 'E404', 404),

  unauthorized: () =>
    new AppError('認証に失敗しました', 'E401', 401),

  forbidden: () =>
    new AppError('権限がありません', 'E403', 403),

  validation: (details: any) =>
    new AppError('入力値が不正です', 'E400', 400, details),

  internal: (message?: string) =>
    new AppError(message || 'サーバーエラーが発生しました', 'E500', 500),

  conflict: (message: string) =>
    new AppError(message, 'E409', 409),

  badRequest: (message: string) =>
    new AppError(message, 'E400', 400),

  serviceUnavailable: (message: string) =>
    new AppError(message, 'E503', 503)
};
```

---

## 4. データベース操作

### 4.1 DB接続クライアント

```typescript
// /lib/db/client.ts
import { PrismaClient } from '@prisma/client';

// グローバルスコープでPrismaClientのインスタンスを保持
// 開発環境でのホットリロード時に複数のインスタンスが作成されるのを防ぐ
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### 4.2 リポジトリベースクラス

```typescript
// /lib/db/repositories/baseRepository.ts
import { db } from '../client';

export class BaseRepository<T, CreateInput, UpdateInput> {
  protected model: any;

  constructor(modelName: string) {
    this.model = db[modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id }
    });
  }

  async findAll(options?: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<T[]> {
    return this.model.findMany(options);
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id }
    });
  }

  async findFirst(where: any): Promise<T | null> {
    return this.model.findFirst({ where });
  }
}
```

### 4.3 トランザクション処理

```typescript
// /lib/db/transaction.ts
import { db } from './client';

// トランザクション実行関数
export const withTransaction = async <T>(callback: (tx: any) => Promise<T>): Promise<T> => {
  return db.$transaction(callback);
};
```

---

## 5. 認証関連

### 5.1 トークン検証

```typescript
// /lib/utils/auth.ts
import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { AppError } from './error';

// JWTシークレット
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// トークン検証関数
export const verifyToken = async (req: NextApiRequest): Promise<any> => {
  // Cookieからトークンを取得
  const token = req.cookies['auth-token'];

  // Authorizationヘッダーからトークンを取得（Cookieがない場合）
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  // トークンがない場合はエラー
  if (!token && !bearerToken) {
    throw new AppError('認証トークンがありません', 'E401', 401);
  }

  try {
    // トークンを検証
    const decoded = jwt.verify(token || bearerToken, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AppError('無効な認証トークンです', 'E401', 401);
  }
};
```

### 5.2 トークン生成

```typescript
// /lib/utils/auth.ts
import jwt from 'jsonwebtoken';

// JWTシークレット
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// トークン有効期限（1日）
const TOKEN_EXPIRY = '1d';

// トークン生成関数
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};
```

### 5.3 パスワードハッシュ化

```typescript
// /lib/utils/auth.ts
import bcrypt from 'bcryptjs';

// パスワードハッシュ化関数
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// パスワード検証関数
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

---

## 6. 外部サービス連携

### 6.1 HTTP通信クライアント

```typescript
// /lib/utils/http.ts
import fetch from 'node-fetch';
import { AppError } from './error';

// HTTPリクエスト関数
export const httpRequest = async <T>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
  }
): Promise<T> => {
  const { method = 'GET', headers = {}, body, timeout = 10000 } = options || {};

  try {
    // AbortControllerでタイムアウト設定
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    // タイムアウトをクリア
    clearTimeout(timeoutId);

    // レスポンスのJSONを取得
    const data = await response.json();

    // エラーレスポンスの場合
    if (!response.ok) {
      throw new AppError(
        data.error?.message || `HTTPリクエストエラー: ${response.status}`,
        `E${response.status}`,
        response.status,
        data.error?.details
      );
    }

    return data as T;
  } catch (error) {
    // AbortControllerによるタイムアウトの場合
    if (error.name === 'AbortError') {
      throw new AppError('リクエストがタイムアウトしました', 'E408', 408);
    }

    // AppErrorの場合はそのまま再スロー
    if (error instanceof AppError) {
      throw error;
    }

    // その他のエラー
    throw new AppError(
      `HTTPリクエストエラー: ${error.message}`,
      'E500',
      500
    );
  }
};
```

### 6.2 キャッシュユーティリティ

```typescript
// /lib/utils/cache.ts
import { createClient } from 'redis';
import { AppError } from './error';

// Redisクライアント
let redisClient;

// Redisクライアント初期化
const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await redisClient.connect();
  }

  return redisClient;
};

// キャッシュ取得関数
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = await getRedisClient();
    const data = await client.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// キャッシュ設定関数
export const setCache = async <T>(key: string, data: T, expireSeconds?: number): Promise<void> => {
  try {
    const client = await getRedisClient();

    await client.set(key, JSON.stringify(data));

    if (expireSeconds) {
      await client.expire(key, expireSeconds);
    }
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

// キャッシュ削除関数
export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = await getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

// キャッシュ付きデータ取得関数
export const withCache = async <T>(
  key: string,
  fetchData: () => Promise<T>,
  options?: { expireSeconds?: number; forceRefresh?: boolean }
): Promise<T> => {
  const { expireSeconds = 3600, forceRefresh = false } = options || {};

  // 強制リフレッシュの場合はキャッシュをスキップ
  if (!forceRefresh) {
    // キャッシュからデータを取得
    const cachedData = await getCache<T>(key);

    if (cachedData) {
      return cachedData;
    }
  }

  // データを取得
  const data = await fetchData();

  // キャッシュに保存
  await setCache(key, data, expireSeconds);

  return data;
};
```

---

## 7. ロギング

### 7.1 ロガー

```typescript
// /lib/utils/logger.ts
import { db } from '../db/client';

// ログレベル
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ログ関数
export const log = async (
  level: LogLevel,
  message: string,
  metadata?: any
): Promise<void> => {
  // コンソールにログを出力
  console[level](message, metadata);

  // 重要なログのみDBに保存
  if (level === 'error' || level === 'warn') {
    try {
      await db.log.create({
        data: {
          level,
          message,
          metadata: metadata ? JSON.stringify(metadata) : null,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }
  }
};

// 各ログレベルの関数
export const logger = {
  debug: (message: string, metadata?: any) => log('debug', message, metadata),
  info: (message: string, metadata?: any) => log('info', message, metadata),
  warn: (message: string, metadata?: any) => log('warn', message, metadata),
  error: (message: string, metadata?: any) => log('error', message, metadata)
};
```

---

## 8. ユーティリティ関数

### 8.1 日付操作

```typescript
// /lib/utils/date.ts
import { format, parseISO, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';

// 日付フォーマット関数
export const formatDate = (
  date: Date | string,
  formatStr: string = 'yyyy/MM/dd HH:mm'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(dateObj)) {
      return '無効な日付';
    }

    return format(dateObj, formatStr, { locale: ja });
  } catch (error) {
    console.error('Date format error:', error);
    return '無効な日付';
  }
};

// 日付バリデーション関数
export const isValidDate = (dateStr: string): boolean => {
  try {
    const date = parseISO(dateStr);
    return isValid(date);
  } catch (error) {
    return false;
  }
};
```

### 8.2 文字列操作

```typescript
// /lib/utils/string.ts
// 文字列の切り詰め関数
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength) + '...';
};

// HTMLタグ除去関数
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// スラッグ生成関数
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

---

## 9. まとめ

このドキュメントで紹介した再利用可能なコンポーネントを活用することで、以下のメリットが得られます：

1. **コードの一貫性**: 同じコンポーネントを使用することで、コードの可読性と保守性が向上します。

2. **開発効率の向上**: 既存のコンポーネントを再利用することで、新しい機能を迅速に実装できます。

3. **バグの削減**: テスト済みのコンポーネントを使用することで、バグの発生を減らせます。

4. **学習コスト削減**: 標準化されたコンポーネントがあることで、新しいエンジニアの学習コストが下がります。

これらのコンポーネントは、DigeClipのバックエンド開発において「**機能追加しやすく、何度も同じようなコンポーネントを作成しなくていい**」アーキテクチャを実現するための基盤となります。