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
  url: string;
  feed_url: string;
  metadata?: Record<string, any>;
  active: boolean;
  last_checked?: string;
  created_at: string;
  updated_at: string;
  stats?: {
    total_contents: number;
    new_contents_last_7days: number;
    failed_checks?: number;
  };
}
```

**例 (レスポンスJSON)**
```jsonc
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
  "updated_at": "2025-03-15T07:30:00Z",
  "stats": {
    "total_contents": 156,
    "new_contents_last_7days": 4,
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