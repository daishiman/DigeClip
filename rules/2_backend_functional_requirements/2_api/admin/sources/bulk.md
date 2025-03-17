# ソース一括操作 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/sources/bulk`
- **機能概要**: 複数のソースに対して一括操作を実行
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminBulkSourceOperationRequest`
```ts
export interface IAdminBulkSourceOperationRequest {
  operation: "activate" | "deactivate" | "delete" | "sync";
  source_ids: number[];
}
```

**例 (リクエストJSON)**
```jsonc
{
  "operation": "activate",
  "source_ids": [1, 2, 3, 4, 5]
}
```

## レスポンス

**Response**: `IAdminBulkSourceOperationResponse`
```ts
export interface IAdminBulkSourceOperationResponse {
  message: string;
  operation: string;
  results: {
    success: number[];
    failed: {
      id: number;
      reason: string;
    }[];
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Bulk operation completed",
  "operation": "activate",
  "results": {
    "success": [1, 2, 4, 5],
    "failed": [
      {
        "id": 3,
        "reason": "Source not found"
      }
    ]
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効な操作)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid operation. Must be one of: activate, deactivate, delete, sync"
  }
}
```

**Error**: e.g. `400 Bad Request` (ソースIDが指定されていない)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "No source IDs provided"
  }
}
```