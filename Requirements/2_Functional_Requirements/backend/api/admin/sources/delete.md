# ソース削除 API

- **HTTPメソッド**: `DELETE`
- **エンドポイント**: `/api/admin/sources/[id]`
- **機能概要**: 特定のソースを削除
- **認証要否**: **要**(admin)

## リクエスト

**Request**: パスパラメータとして `id` を含む

## レスポンス

**Response**: `IAdminDeleteSourceResponse`
```ts
export interface IAdminDeleteSourceResponse {
  message: string;
  id: number;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Source deleted successfully",
  "id": 1
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