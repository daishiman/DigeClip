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
  type: "youtube" | "rss" | "arxiv" | "other";
  active?: boolean;

  // YouTube固有情報
  youtube_info?: {
    channel_id: string;
    channel_url: string;
  feed_url?: string;
    subscriber_count?: number;
    thumbnail_url?: string;
  };

  // RSS固有情報
  rss_info?: {
    site_url: string;
    feed_url: string;
    language?: string;
    favicon_url?: string;
  };

  // arXiv固有情報
  arxiv_info?: {
    category: string;
    query: string;
  };

  // その他のメタデータ
  metadata?: Record<string, any>;
}
```

**例 (リクエストJSON - YouTube)**
```jsonc
{
  "name": "テックYouTubeチャンネル",
  "type": "youtube",
  "active": true,
  "youtube_info": {
    "channel_id": "UC12345abcde",
    "channel_url": "https://www.youtube.com/channel/UC12345abcde",
    "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345abcde",
    "subscriber_count": 100000,
    "thumbnail_url": "https://yt3.googleusercontent.com/ytc/123456789"
  }
}
```

**例 (リクエストJSON - RSS)**
```jsonc
{
  "name": "テックニュースブログ",
  "type": "rss",
  "active": true,
  "rss_info": {
    "site_url": "https://example.com/tech-blog",
  "feed_url": "https://example.com/tech-blog/feed",
    "language": "ja",
    "favicon_url": "https://example.com/favicon.ico"
  }
}
```

## レスポンス

**Response**: `IAdminCreateSourceResponse`
```ts
export interface IAdminCreateSourceResponse {
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
  "id": 5,
  "name": "テックYouTubeチャンネル",
  "type": "youtube",
  "active": true,
  "last_checked": null,
  "created_at": "2023-06-15T09:30:00Z",
  "updated_at": "2023-06-15T09:30:00Z",
  "youtube_info": {
    "channel_id": "UC12345abcde",
    "channel_url": "https://www.youtube.com/channel/UC12345abcde",
    "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345abcde",
    "subscriber_count": 100000,
    "thumbnail_url": "https://yt3.googleusercontent.com/ytc/123456789"
  }
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
      "type": "Type must be one of: youtube, rss, arxiv, other",
      "youtube_info": "YouTube info is required when type is youtube"
    }
  }
}
```