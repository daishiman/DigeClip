# 通知テスト送信 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/notifications/test`
- **機能概要**: テスト通知を送信して通知設定をテスト
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminTestNotificationRequest`
```ts
export interface IAdminTestNotificationRequest {
  channel: "email" | "slack" | "discord";
  recipient: string; // メールアドレス、Slackチャンネル名、Discordチャンネル名など
  title?: string; // 通知タイトル（省略時はデフォルトのテストタイトルが使用される）
  message?: string; // 通知メッセージ（省略時はデフォルトのテストメッセージが使用される）
  include_content_sample?: boolean; // コンテンツサンプルを含めるか
  content_id?: number; // 特定のコンテンツを使用する場合
}
```

**例 (リクエストJSON - メール通知)**
```jsonc
{
  "channel": "email",
  "recipient": "admin@example.com",
  "title": "DigeClip テスト通知",
  "message": "これはテスト通知です。通知設定が正しく機能していることを確認してください。"
}
```

**例 (リクエストJSON - Slack通知)**
```jsonc
{
  "channel": "slack",
  "recipient": "general",
  "include_content_sample": true
}
```

## レスポンス

**Response**: `IAdminTestNotificationResponse`
```ts
export interface IAdminTestNotificationResponse {
  success: boolean;
  message: string;
  notification_id?: number;
  details?: {
    channel: string;
    recipient: string;
    sent_at: string;
    delivery_status?: string;
    response_time_ms?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**例 (レスポンスJSON - 成功)**
```jsonc
{
  "success": true,
  "message": "テスト通知が正常に送信されました",
  "notification_id": 124,
  "details": {
    "channel": "email",
    "recipient": "admin@example.com",
    "sent_at": "2025-03-15T17:30:15Z",
    "delivery_status": "delivered",
    "response_time_ms": 450
  }
}
```

**例 (レスポンスJSON - 失敗)**
```jsonc
{
  "success": false,
  "message": "テスト通知の送信に失敗しました",
  "error": {
    "code": "E5004",
    "message": "SMTP connection failed",
    "details": {
      "smtp_error": "Connection timed out"
    }
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4013",
    "message": "Invalid notification request",
    "details": {
      "recipient": "Valid email address is required for email channel"
    }
  }
}
```

**Error**: e.g. `500 Internal Server Error`
```jsonc
{
  "error": {
    "code": "E5005",
    "message": "Notification service unavailable",
    "details": {
      "service": "slack",
      "error": "API token not configured"
    }
  }
}
```