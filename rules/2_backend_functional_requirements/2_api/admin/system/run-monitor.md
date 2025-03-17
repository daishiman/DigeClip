# 監視処理手動実行 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/system/run-monitor`
- **機能概要**: 監視処理を手動で実行
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminRunMonitorRequest`
```ts
export interface IAdminRunMonitorRequest {
  sourceId?: number; // 特定のソースのみ実行する場合
  steps?: ("detection" | "text_extraction" | "summarization" | "notification")[];
}
```

**例 (リクエストJSON)**
```jsonc
{
  "sourceId": 1,
  "steps": ["detection", "text_extraction", "summarization"]
}
```

## レスポンス

**Response**: `IAdminRunMonitorResponse`
```ts
export interface IAdminRunMonitorResponse {
  message: string;
  job_id: string;
  started_at: string;
  estimated_completion?: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Monitor job started",
  "job_id": "monitor_20250315_123456",
  "started_at": "2025-03-15T11:30:00Z",
  "estimated_completion": "2025-03-15T11:35:00Z"
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