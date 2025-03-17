# ソース同期 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/sources/[id]/sync`
- **機能概要**: 特定のソースのコンテンツを手動で同期
- **認証要否**: **要**(admin)

## リクエスト

**Request**: パスパラメータとして `id` を含む

**例**
```
POST /api/admin/sources/5/sync
```

## レスポンス

**Response**: `IAdminSyncSourceResponse`
```ts
export interface IAdminSyncSourceResponse {
  message: string;
  source_id: number;
  sync_status: "started" | "completed" | "failed";
  sync_details?: {
    new_content_count: number;
    updated_content_count: number;
    error_count: number;
  };
  job_id?: string;
}
```

**例 (レスポンスJSON - 同期開始)**
```jsonc
{
  "message": "Source sync job started",
  "source_id": 5,
  "sync_status": "started",
  "job_id": "sync-job-12345"
}
```

**例 (レスポンスJSON - 同期完了、即時実行の場合)**
```jsonc
{
  "message": "Source sync completed successfully",
  "source_id": 5,
  "sync_status": "completed",
  "sync_details": {
    "new_content_count": 12,
    "updated_content_count": 3,
    "error_count": 0
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

**Error**: e.g. `409 Conflict` (同期処理が既に実行中)
```jsonc
{
  "error": {
    "code": "E4090",
    "message": "Sync already in progress for this source",
    "details": {
      "job_id": "sync-job-12345",
      "started_at": "2023-06-15T10:30:00Z"
    }
  }
}
```