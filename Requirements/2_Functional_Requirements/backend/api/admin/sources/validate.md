# ソース検証 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/sources/validate`
- **機能概要**: ソースURLの有効性を検証（ソース作成/更新前の事前チェック）
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminValidateSourceRequest`
```ts
export interface IAdminValidateSourceRequest {
  type: string;
  url: string;
  feed_url?: string;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "type": "rss",
  "url": "https://example.com/tech-blog",
  "feed_url": "https://example.com/tech-blog/feed"
}
```

## レスポンス

**Response**: `IAdminValidateSourceResponse`
```ts
export interface IAdminValidateSourceResponse {
  valid: boolean;
  message: string;
  details?: {
    detected_feed_url?: string;
    content_sample?: {
      title: string;
      published_at: string;
    }[];
    metadata?: Record<string, any>;
  };
  errors?: string[];
}
```

**例 (レスポンスJSON - 有効なソース)**
```jsonc
{
  "valid": true,
  "message": "Source validated successfully",
  "details": {
    "detected_feed_url": "https://example.com/tech-blog/feed",
    "content_sample": [
      {
        "title": "最新のAI技術トレンド",
        "published_at": "2023-06-14T15:30:00Z"
      },
      {
        "title": "プログラミング言語の比較",
        "published_at": "2023-06-12T09:45:00Z"
      }
    ],
    "metadata": {
      "title": "テックニュースブログ",
      "description": "最新の技術トレンドを発信するブログ",
      "language": "ja",
      "update_frequency": "daily"
    }
  }
}
```

**例 (レスポンスJSON - 無効なソース)**
```jsonc
{
  "valid": false,
  "message": "Source validation failed",
  "errors": [
    "Feed URL is not accessible",
    "Could not detect valid RSS or Atom format"
  ]
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効なリクエストデータ)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid request data",
    "details": {
      "type": "Source type is required",
      "url": "URL must be a valid URL"
    }
  }
}
```