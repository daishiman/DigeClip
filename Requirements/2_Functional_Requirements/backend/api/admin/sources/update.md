# ソース更新 API

- **HTTPメソッド**: `PUT`
- **エンドポイント**: `/api/admin/sources/[id]`
- **機能概要**: 既存のソース情報を更新
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminUpdateSourceRequest`
```ts
export interface IAdminUpdateSourceRequest {
  name?: string;
  active?: boolean;

  // YouTube固有情報
  youtube_info?: {
    channel_url?: string;
    feed_url?: string;
    subscriber_count?: number;
    thumbnail_url?: string;
  };

  // RSS固有情報
  rss_info?: {
    site_url?: string;
  feed_url?: string;
    language?: string;
    favicon_url?: string;
  };

  // arXiv固有情報
  arxiv_info?: {
    category?: string;
    query?: string;
  };

  // その他のメタデータ
  metadata?: Record<string, any>;
}
```

**例 (リクエストJSON - YouTube)**
```jsonc
{
  "name": "更新後のチャンネル名",
  "active": false,
  "youtube_info": {
    "subscriber_count": 120000,
    "thumbnail_url": "https://yt3.googleusercontent.com/ytc/updated-thumbnail"
  }
}
```

**例 (リクエストJSON - RSS)**
```jsonc
{
  "name": "更新後のブログ名",
  "rss_info": {
    "feed_url": "https://example.com/updated-blog/feed",
    "language": "en"
  }
}
```

## レスポンス

**Response**: `IAdminUpdateSourceResponse`
```ts
export interface IAdminUpdateSourceResponse {
  id: number;
  name: string;
  type: "youtube" | "rss" | "arxiv" | "other";
  active: boolean;
  last_checked: string | null;
  created_at: string;
  updated_at: string;

  // ソースタイプに応じた情報
  youtube_info?: {
    channel_id: string;
    channel_url: string;
    feed_url: string;
    subscriber_count: number;
    thumbnail_url: string;
  };

  rss_info?: {
    site_url: string;
    feed_url: string;
    language: string;
    favicon_url: string;
  };

  arxiv_info?: {
    category: string;
    query: string;
  };
}
```

**例 (レスポンスJSON - YouTube)**
```jsonc
{
  "id": 1,
  "name": "更新後のチャンネル名",
  "type": "youtube",
  "active": false,
  "last_checked": "2025-03-15T07:30:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-03-16T10:45:00Z",
  "youtube_info": {
    "channel_id": "UC12345",
    "channel_url": "https://www.youtube.com/channel/UC12345",
    "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345",
    "subscriber_count": 120000,
    "thumbnail_url": "https://yt3.googleusercontent.com/ytc/updated-thumbnail"
  }
}
```

## エラー

**Error**: e.g. `404 Not Found` (ソースが見つからない)
```jsonc
{
  "error": {
    "code": "E4044",
    "message": "Source not found"
  }
}
```

**Error**: e.g. `400 Bad Request` (無効なリクエストデータ)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid source data",
    "details": {
      "youtube_info": "YouTube info can only be updated for YouTube sources"
    }
  }
}
```