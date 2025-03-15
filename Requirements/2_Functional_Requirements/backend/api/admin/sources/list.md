# ソース一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/sources`
- **機能概要**: 監視対象ソース（YouTube、RSS、arXivなど）の一覧を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request Query**:
```ts
export interface IAdminGetSourcesQuery {
  type?: "youtube" | "rss" | "arxiv";
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
  url: string;
  feed_url: string;
  metadata?: Record<string, any>;
  active: boolean;
  last_checked?: string;
  created_at: string;
  updated_at: string;
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
      "url": "https://www.youtube.com/channel/UC12345",
      "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345",
      "metadata": {
        "channel_id": "UC12345",
        "subscriber_count": 100000
      },
      "active": true,
      "last_checked": "2025-03-15T07:30:00Z",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-03-15T07:30:00Z"
    },
    {
      "id": 2,
      "name": "プログラミングチャンネル",
      "type": "youtube",
      "url": "https://www.youtube.com/channel/UC67890",
      "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC67890",
      "metadata": {
        "channel_id": "UC67890",
        "subscriber_count": 50000
      },
      "active": true,
      "last_checked": "2025-03-15T07:30:00Z",
      "created_at": "2025-01-02T00:00:00Z",
      "updated_at": "2025-03-15T07:30:00Z"
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