# ソース一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/sources`
- **機能概要**: 監視対象ソース（YouTube、RSS、arXivなど）の一覧を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request Query**:
```ts
export interface IAdminGetSourcesQuery {
  type?: "youtube" | "rss" | "arxiv" | "other";
  active?: boolean;
  page?: number;
  pageSize?: number;
}
```

**例**
```
GET /api/admin/sources?type=youtube&active=true&page=1&pageSize=10
```

## レスポンス

**Response**:
```ts
export interface ISourceItem {
  id: number;
  name: string;
  type: "youtube" | "rss" | "arxiv" | "other";
  active: boolean;
  last_checked?: string;
  created_at: string;
  updated_at: string;

  // ソースタイプに応じた情報（一覧表示用に簡略化）
  youtube_info?: {
    channel_id: string;
    channel_url: string;
    subscriber_count?: number;
    thumbnail_url?: string;
  };

  rss_info?: {
    site_url: string;
    feed_url: string;
  };

  arxiv_info?: {
    category: string;
  };

  // 統計情報
  content_count?: number;
}

export interface IAdminGetSourcesResponse {
  data: ISourceItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "data": [
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
        "subscriber_count": 100000,
        "thumbnail_url": "https://yt3.googleusercontent.com/ytc/123456789"
      },
      "content_count": 156
    },
    {
      "id": 2,
      "name": "プログラミングブログ",
      "type": "rss",
      "active": true,
      "last_checked": "2025-03-15T07:30:00Z",
      "created_at": "2025-01-02T00:00:00Z",
      "updated_at": "2025-03-15T07:30:00Z",
      "rss_info": {
        "site_url": "https://example.com/programming-blog",
        "feed_url": "https://example.com/programming-blog/feed"
      },
      "content_count": 78
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25
  }
}
```

## エラー

**Error**: e.g. `403 Forbidden` (権限エラー)
```jsonc
{
  "error": {
    "code": "E4030",
    "message": "Admin permission required"
  }
}
```