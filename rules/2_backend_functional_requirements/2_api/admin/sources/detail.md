# ソース詳細取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/sources/[id]`
- **機能概要**: 特定のソースの詳細情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request**: パスパラメータとして `id` を含む

## レスポンス

**Response**: `IAdminGetSourceDetailResponse`
```ts
export interface IAdminGetSourceDetailResponse {
  id: number;
  name: string;
  type: "youtube" | "rss" | "arxiv" | "other";
  active: boolean;
  last_checked?: string;
  created_at: string;
  updated_at: string;

  // YouTube固有情報
  youtube_info?: {
    channel_id: string;
    channel_url: string;
    feed_url: string;
    subscriber_count: number;
    thumbnail_url: string;
    metadata?: Record<string, any>;
  };

  // RSS固有情報
  rss_info?: {
    site_url: string;
    feed_url: string;
    language: string;
    favicon_url: string;
    metadata?: Record<string, any>;
  };

  // arXiv固有情報
  arxiv_info?: {
    category: string;
    query: string;
    metadata?: Record<string, any>;
  };

  stats?: {
    total_contents: number;
    new_contents_last_7days: number;
    failed_checks?: number;
  };
}
```

**例 (レスポンスJSON - YouTube)**
```jsonc
{
  "id": 1,
  "name": "テックチャンネル",
  "type": "youtube",
  "active": true,
  "last_checked": "2025-03-15T07:30:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-03-15T07:30:00Z",
  "youtube_info": {
    "channel_id": "UC12345",
    "channel_url": "https://www.youtube.com/channel/UC12345",
    "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345",
    "subscriber_count": 100000,
    "thumbnail_url": "https://yt3.googleusercontent.com/ytc/123456789"
  },
  "stats": {
    "total_contents": 156,
    "new_contents_last_7days": 4,
    "failed_checks": 0
  }
}
```

**例 (レスポンスJSON - RSS)**
```jsonc
{
  "id": 2,
  "name": "テックブログ",
  "type": "rss",
  "active": true,
  "last_checked": "2025-03-15T07:30:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-03-15T07:30:00Z",
  "rss_info": {
    "site_url": "https://example.com/tech-blog",
    "feed_url": "https://example.com/tech-blog/feed",
    "language": "ja",
    "favicon_url": "https://example.com/favicon.ico"
  },
  "stats": {
    "total_contents": 78,
    "new_contents_last_7days": 3,
    "failed_checks": 0
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