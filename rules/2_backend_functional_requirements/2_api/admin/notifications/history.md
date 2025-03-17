# 通知履歴取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/notifications/history`
- **機能概要**: 送信された通知の履歴を取得
- **認証要否**: **要**(admin)

## リクエスト

**Query Parameters**:
- `page`: ページ番号 (デフォルト: 1)
- `per_page`: 1ページあたりの件数 (デフォルト: 20, 最大: 100)
- `start_date`: 開始日 (YYYY-MM-DD形式) (オプション)
- `end_date`: 終了日 (YYYY-MM-DD形式) (オプション)
- `status`: 通知ステータスでフィルタ (`sent`, `failed`, `pending`, `all`) (デフォルト: `all`)
- `channel`: 通知チャンネルでフィルタ (`email`, `slack`, `discord`, `all`) (デフォルト: `all`)
- `content_id`: 特定のコンテンツに関連する通知のみを取得 (オプション)
- `user_id`: 特定のユーザーに送信された通知のみを取得 (オプション)

## レスポンス

**Response**: `IAdminGetNotificationHistoryResponse`
```ts
export interface IAdminGetNotificationHistoryResponse {
  notifications: IAdminNotification[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  summary?: {
    total_sent: number;
    total_failed: number;
    total_pending: number;
    by_channel: {
      channel: string;
      count: number;
    }[];
  };
}

export interface IAdminNotification {
  id: number;
  type: "content_alert" | "digest" | "system_alert" | "custom";
  title: string;
  content_preview: string;
  channel: string;
  recipient: string;
  status: "sent" | "failed" | "pending";
  error_message?: string;
  content_id?: number;
  user_id?: number;
  created_at: string;
  sent_at?: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "notifications": [
    {
      "id": 123,
      "type": "content_alert",
      "title": "新しい記事: AIの進化と社会への影響",
      "content_preview": "近年のAI技術の急速な進化は社会に大きな影響を与えています...",
      "channel": "email",
      "recipient": "user@example.com",
      "status": "sent",
      "content_id": 456,
      "user_id": 789,
      "created_at": "2025-03-15T10:30:00Z",
      "sent_at": "2025-03-15T10:30:05Z"
    },
    {
      "id": 122,
      "type": "digest",
      "title": "DigeClip Daily Digest (2025-03-14)",
      "content_preview": "昨日の重要なコンテンツをまとめました。5件の新しい記事があります。",
      "channel": "slack",
      "recipient": "general",
      "status": "sent",
      "user_id": 789,
      "created_at": "2025-03-15T09:00:00Z",
      "sent_at": "2025-03-15T09:00:03Z"
    },
    {
      "id": 121,
      "type": "system_alert",
      "title": "システム警告: ディスク使用率が高くなっています",
      "content_preview": "ディスク使用率が85%に達しました。不要なファイルを削除してください。",
      "channel": "email",
      "recipient": "admin@example.com",
      "status": "failed",
      "error_message": "SMTP connection timeout",
      "created_at": "2025-03-14T23:45:10Z"
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "per_page": 20,
    "total_pages": 6
  },
  "summary": {
    "total_sent": 115,
    "total_failed": 3,
    "total_pending": 2,
    "by_channel": [
      {
        "channel": "email",
        "count": 80
      },
      {
        "channel": "slack",
        "count": 35
      },
      {
        "channel": "discord",
        "count": 5
      }
    ]
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4012",
    "message": "Invalid date format",
    "details": {
      "start_date": "Must be in YYYY-MM-DD format"
    }
  }
}
```