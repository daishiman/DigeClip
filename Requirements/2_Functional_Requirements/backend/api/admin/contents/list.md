# コンテンツ一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/contents`
- **機能概要**: 全てのコンテンツを取得（ステータスや情報源でフィルタリング可能）
- **認証要否**: **要**(admin)

## リクエスト

**Request Query**:
```ts
export interface IAdminGetContentsQuery {
  status?: "pending" | "summarized" | "error";
  sourceId?: number;
  type?: "video" | "article" | "paper";
  page?: number;
  pageSize?: number;
}
```

**例**
```
GET /api/admin/contents?status=error&page=1&pageSize=10
```

## レスポンス

**Response**: `IAdminGetContentsResponse`
```ts
export interface IAdminContentItem {
  id: number;
  source_id: number;
  title: string;
  url: string;
  type: "video" | "article" | "paper" | "other";
  published_at?: string;
  raw_text?: string; // 管理者は一部を取得可能
  metadata?: Record<string, any>;
  status: "pending" | "summarized" | "error";
  error_message?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  notified_at?: string;
}

export interface IAdminGetContentsResponse {
  data: IAdminContentItem[];
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
      "id": 42,
      "source_id": 1,
      "title": "AIの最新動向 2025年版",
      "url": "https://www.youtube.com/watch?v=abc123",
      "type": "video",
      "published_at": "2025-03-10T14:30:00Z",
      "raw_text": "本日は2025年のAI業界の最新動向について...(省略)...",
      "metadata": {
        "thumbnail": "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
        "duration": 1234,
        "views": 5000
      },
      "status": "error",
      "error_message": "Failed to generate summary: API timeout",
      "tags": ["AI", "テクノロジー"],
      "created_at": "2025-03-10T14:45:00Z",
      "updated_at": "2025-03-10T15:00:00Z"
    },
    {
      "id": 45,
      "source_id": 2,
      "title": "プログラミング言語比較 2025",
      "url": "https://www.youtube.com/watch?v=xyz789",
      "type": "video",
      "published_at": "2025-03-09T10:00:00Z",
      "raw_text": "今回は2025年における主要プログラミング言語の...(省略)...",
      "metadata": {
        "thumbnail": "https://i.ytimg.com/vi/xyz789/maxresdefault.jpg",
        "duration": 2345,
        "views": 3000
      },
      "status": "error",
      "error_message": "Failed to extract text: No captions available",
      "tags": ["プログラミング"],
      "created_at": "2025-03-09T10:15:00Z",
      "updated_at": "2025-03-09T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 15
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