# ソース統計情報取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/sources/stats`
- **機能概要**: ソースの統計情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request**: クエリパラメータ
- `period`: 期間（例: `day`, `week`, `month`, `year`）
- `type`: ソースタイプでフィルター（例: `rss`, `youtube`, `arxiv`）

## レスポンス

**Response**: `IAdminSourceStatsResponse`
```ts
export interface IAdminSourceStatsResponse {
  total_sources: number;
  active_sources: number;
  sources_by_type: {
    type: string;
    count: number;
  }[];
  content_stats: {
    total_content: number;
    content_last_24h: number;
    content_last_week: number;
    content_last_month: number;
  };
  source_activity: {
    date: string;
    content_count: number;
  }[];
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "total_sources": 25,
  "active_sources": 20,
  "sources_by_type": [
    {
      "type": "rss",
      "count": 12
    },
    {
      "type": "youtube",
      "count": 8
    },
    {
      "type": "arxiv",
      "count": 5
    }
  ],
  "content_stats": {
    "total_content": 5280,
    "content_last_24h": 42,
    "content_last_week": 315,
    "content_last_month": 1250
  },
  "source_activity": [
    {
      "date": "2023-06-15",
      "content_count": 42
    },
    {
      "date": "2023-06-14",
      "content_count": 38
    },
    {
      "date": "2023-06-13",
      "content_count": 45
    },
    {
      "date": "2023-06-12",
      "content_count": 40
    },
    {
      "date": "2023-06-11",
      "content_count": 35
    },
    {
      "date": "2023-06-10",
      "content_count": 50
    },
    {
      "date": "2023-06-09",
      "content_count": 65
    }
  ]
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効なクエリパラメータ)
```jsonc
{
  "error": {
    "code": "E4003",
    "message": "Invalid period parameter. Must be one of: day, week, month, year"
  }
}
```