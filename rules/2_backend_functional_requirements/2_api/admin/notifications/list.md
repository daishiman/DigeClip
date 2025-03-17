# 通知履歴一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/notifications`
- **機能概要**: 通知履歴の一覧を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request Query**:
```ts
export interface IAdminGetNotificationsQuery {
  status?: "success" | "failed";
  contentId?: number;
  page?: number;
  pageSize?: number;
}
```

**例**
```
GET /api/admin/notifications?status=failed&page=1&pageSize=10
```

## レスポンス

**Response**: `IAdminGetNotificationsResponse`
```ts
export interface INotificationItem {
  id: number;
  contentId: number;
  summaryId?: number;
  destination: string;
  status: "success" | "failed";
  sentAt: string;
  metadata?: Record<string, any>;
  error_message?: string;
}

export interface IAdminGetNotificationsResponse {
  data: INotificationItem[];
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
      "id": 201,
      "contentId": 42,
      "summaryId": 101,
      "destination": "Discord Webhook #tech-news",
      "status": "success",
      "sentAt": "2025-03-10T15:00:00Z",
      "metadata": {
        "webhook_id": "webhook123",
        "message_id": "msg456"
      }
    },
    {
      "id": 202,
      "contentId": 43,
      "summaryId": 103,
      "destination": "Discord Webhook #programming",
      "status": "failed",
      "sentAt": "2025-03-09T10:35:00Z",
      "error_message": "Discord API rate limit exceeded",
      "metadata": {
        "webhook_id": "webhook456",
        "retry_count": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 2
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