# ソース作成 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/sources`
- **機能概要**: 新しいソースを作成
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminCreateSourceRequest`
```ts
export interface IAdminCreateSourceRequest {
  name: string;
  type: string;
  url: string;
  feed_url?: string;
  metadata?: Record<string, any>;
  active?: boolean;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "name": "テックニュースブログ",
  "type": "rss",
  "url": "https://example.com/tech-blog",
  "feed_url": "https://example.com/tech-blog/feed",
  "metadata": {
    "category": "technology",
    "language": "ja"
  },
  "active": true
}
```

## レスポンス

**Response**: `IAdminCreateSourceResponse`
```ts
export interface IAdminCreateSourceResponse {
  id: number;
  name: string;
  type: string;
  url: string;
  feed_url: string | null;
  metadata: Record<string, any> | null;
  active: boolean;
  last_checked: string | null;
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 5,
  "name": "テックニュースブログ",
  "type": "rss",
  "url": "https://example.com/tech-blog",
  "feed_url": "https://example.com/tech-blog/feed",
  "metadata": {
    "category": "technology",
    "language": "ja"
  },
  "active": true,
  "last_checked": null,
  "created_at": "2023-06-15T09:30:00Z",
  "updated_at": "2023-06-15T09:30:00Z"
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効なリクエストデータ)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid source data",
    "details": {
      "name": "Name is required",
      "url": "URL must be a valid URL"
    }
  }
}
```