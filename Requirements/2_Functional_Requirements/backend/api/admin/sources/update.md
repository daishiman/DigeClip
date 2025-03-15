# ソース更新 API

- **HTTPメソッド**: `PUT`
- **エンドポイント**: `/api/admin/sources/[id]`
- **機能概要**: 特定のソースの情報を更新
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminUpdateSourceRequest`
```ts
export interface IAdminUpdateSourceRequest {
  name?: string;
  type?: "youtube" | "rss" | "arxiv" | "other";
  url?: string;
  feed_url?: string;
  metadata?: Record<string, any>;
  active?: boolean;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "name": "更新：テックチャンネル",
  "metadata": {
    "channel_id": "UC12345",
    "subscriber_count": 120000,
    "category": "technology"
  },
  "active": false
}
```

## レスポンス

**Response**: `IAdminUpdateSourceResponse`
```ts
export interface IAdminUpdateSourceResponse {
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
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 1,
  "name": "更新：テックチャンネル",
  "type": "youtube",
  "url": "https://www.youtube.com/channel/UC12345",
  "feed_url": "https://www.youtube.com/feeds/videos.xml?channel_id=UC12345",
  "metadata": {
    "channel_id": "UC12345",
    "subscriber_count": 120000,
    "category": "technology"
  },
  "active": false,
  "last_checked": "2025-03-15T07:30:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-03-15T09:15:00Z"
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