# API設計

## 概要

このドキュメントでは、DigeClipのAPIエンドポイント設計と仕様を定義します。APIはRESTful原則に従い、JSON形式でデータをやり取りします。

## API基本設計

### ベースURL

```
https://api.digeclip.com/api
```

開発環境では:

```
http://localhost:3000/api
```

### APIバージョニング

現時点ではバージョニングは行わず、将来的に必要になった場合はURLパスにバージョンを含める形式を採用します:

```
/api/v1/resources
```

### リソース命名規則

- 複数形の名詞を使用 (例: `/sources`, `/contents`)
- 小文字のケバブケース (例: `/ai-models`)
- ネストしたリソースはパスで表現 (例: `/contents/{id}/summaries`)

### HTTPメソッド

| メソッド | 用途 |
|---------|------|
| GET | リソースの取得 |
| POST | リソースの作成 |
| PUT | リソースの更新（全体） |
| PATCH | リソースの部分更新 |
| DELETE | リソースの削除 |

### レスポンス形式

#### 成功時

```json
{
  "data": {
    // リソースデータ
  },
  "meta": {
    // メタデータ（ページネーション情報など）
  }
}
```

#### エラー時

```json
{
  "error": {
    "code": "E400",
    "message": "ユーザーフレンドリーなエラーメッセージ",
    "details": {
      "field1": "フィールド固有のエラーメッセージ",
      "field2": "フィールド固有のエラーメッセージ"
    }
  }
}
```

### ステータスコード

| コード | 意味 |
|--------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 204 | 削除成功 |
| 400 | バリデーションエラー |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソース未発見 |
| 409 | リソース競合 |
| 429 | リクエスト数制限超過 |
| 500 | 内部サーバーエラー |
| 503 | サービス利用不可 |

### クエリパラメータ

#### ページネーション

```
/api/contents?page=1&limit=10
```

#### フィルタリング

```
/api/contents?status=published&source_id=123
```

#### ソート

```
/api/contents?sort=published_at:desc
```

#### 検索

```
/api/contents?search=keyword
```

## API一覧

APIドキュメントは以下のように構造化されています：

1. [共通仕様](./api/common/README.md) - ディレクトリ構成、認証・認可概要、共通仕様
2. [認証系API](./api/auth/README.md) - ユーザー登録、ログイン、ログアウト、パスワード管理
3. [ユーザーロールAPI](./api/user/README.md) - 一般ユーザーが利用する機能
4. [管理者ロールAPI](./api/admin/README.md) - 管理者のみが操作する機能

### 認証系API

#### ユーザー登録

- **エンドポイント**: `POST /api/auth/register`
- **リクエスト**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```
- **レスポンス**:
  ```json
  {
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "created_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### ログイン

- **エンドポイント**: `POST /api/auth/login`
- **リクエスト**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **レスポンス**:
  ```json
  {
    "data": {
      "token": "jwt_token",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name",
        "role": "user"
      }
    }
  }
  ```

#### ログアウト

- **エンドポイント**: `POST /api/auth/logout`
- **認証**: 必要
- **レスポンス**:
  ```json
  {
    "data": {
      "message": "Successfully logged out"
    }
  }
  ```

### ユーザーロールAPI

#### コンテンツ一覧取得

- **エンドポイント**: `GET /api/user/contents`
- **認証**: 必要
- **クエリパラメータ**:
  - `page`: ページ番号（デフォルト: 1）
  - `limit`: 1ページあたりの件数（デフォルト: 10）
  - `status`: ステータスでフィルタリング
  - `source_id`: ソースIDでフィルタリング
  - `sort`: ソート条件（例: `published_at:desc`）
  - `search`: 検索キーワード
- **レスポンス**:
  ```json
  {
    "data": [
      {
        "id": "content_id",
        "title": "Content Title",
        "source": {
          "id": "source_id",
          "name": "Source Name",
          "icon_url": "https://example.com/icon.png"
        },
        "published_at": "2023-01-01T00:00:00Z",
        "status": "summarized",
        "tags": [
          {
            "id": "tag_id",
            "name": "Tag Name",
            "color": "#3B82F6"
          }
        ]
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
  ```

#### コンテンツ詳細取得

- **エンドポイント**: `GET /api/user/contents/{id}`
- **認証**: 必要
- **レスポンス**:
  ```json
  {
    "data": {
      "id": "content_id",
      "title": "Content Title",
      "source": {
        "id": "source_id",
        "name": "Source Name",
        "icon_url": "https://example.com/icon.png"
      },
      "original_url": "https://example.com/article",
      "published_at": "2023-01-01T00:00:00Z",
      "content_text": "Original content text...",
      "status": "summarized",
      "summaries": [
        {
          "id": "summary_id",
          "type": "short",
          "text": "Short summary text...",
          "model": {
            "id": "model_id",
            "name": "GPT-4"
          }
        },
        {
          "id": "summary_id",
          "type": "medium",
          "text": "Medium summary text...",
          "model": {
            "id": "model_id",
            "name": "GPT-4"
          }
        }
      ],
      "tags": [
        {
          "id": "tag_id",
          "name": "Tag Name",
          "color": "#3B82F6"
        }
      ],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

### 管理者ロールAPI

#### ソース一覧取得

- **エンドポイント**: `GET /api/admin/sources`
- **認証**: 必要（管理者ロール）
- **クエリパラメータ**:
  - `page`: ページ番号（デフォルト: 1）
  - `limit`: 1ページあたりの件数（デフォルト: 10）
  - `type`: タイプでフィルタリング
  - `is_active`: アクティブフラグでフィルタリング
  - `sort`: ソート条件（例: `name:asc`）
  - `search`: 検索キーワード
- **レスポンス**:
  ```json
  {
    "data": [
      {
        "id": "source_id",
        "name": "Source Name",
        "url": "https://example.com/feed",
        "type": "RSS",
        "icon_url": "https://example.com/icon.png",
        "description": "Source description",
        "is_active": true,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
  ```

#### ソース作成

- **エンドポイント**: `POST /api/admin/sources`
- **認証**: 必要（管理者ロール）
- **リクエスト**:
  ```json
  {
    "name": "New Source",
    "url": "https://example.com/feed",
    "type": "RSS",
    "icon_url": "https://example.com/icon.png",
    "description": "Source description",
    "is_active": true
  }
  ```
- **レスポンス**:
  ```json
  {
    "data": {
      "id": "source_id",
      "name": "New Source",
      "url": "https://example.com/feed",
      "type": "RSS",
      "icon_url": "https://example.com/icon.png",
      "description": "Source description",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### ソース更新

- **エンドポイント**: `PUT /api/admin/sources/{id}`
- **認証**: 必要（管理者ロール）
- **リクエスト**:
  ```json
  {
    "name": "Updated Source",
    "url": "https://example.com/feed",
    "type": "RSS",
    "icon_url": "https://example.com/icon.png",
    "description": "Updated description",
    "is_active": true
  }
  ```
- **レスポンス**:
  ```json
  {
    "data": {
      "id": "source_id",
      "name": "Updated Source",
      "url": "https://example.com/feed",
      "type": "RSS",
      "icon_url": "https://example.com/icon.png",
      "description": "Updated description",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
  ```

#### ソース削除

- **エンドポイント**: `DELETE /api/admin/sources/{id}`
- **認証**: 必要（管理者ロール）
- **レスポンス**: 204 No Content

## セキュリティ

### 認証

- JWTベースの認証を実装
- トークンは `Authorization` ヘッダーで送信: `Authorization: Bearer {token}`
- トークンの有効期限は24時間

### 認可

- ロールベースのアクセス制御（RBAC）を実装
- ロール: `admin`, `user`
- 各APIエンドポイントに必要なロールを定義

### CORS

- 適切なCORSポリシーを設定
- 本番環境では特定のオリジンのみを許可

### レート制限

- APIリクエスト数を制限
- 認証済みユーザー: 100リクエスト/分
- 未認証ユーザー: 20リクエスト/分

## API実装ガイドライン

1. すべてのAPIエンドポイントは共通のエラーハンドリングミドルウェアを使用
2. リクエストデータは必ずバリデーション
3. 認証が必要なエンドポイントは認証ミドルウェアを使用
4. レスポンスは統一されたフォーマットで返却
5. 適切なHTTPステータスコードを使用
6. 大量のデータを返す場合はページネーションを実装
7. 機密情報はレスポンスから除外

## API実装例

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