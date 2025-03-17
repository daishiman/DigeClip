# システム状態取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/user/system/status`
- **機能概要**: ユーザー向けシステム状態の簡易情報を取得
- **認証要否**: **要**(user/admin)

## レスポンス

**Response**: `IUserSystemStatusResponse`
```ts
export interface IUserSystemStatusResponse {
  status: "operational" | "degraded" | "maintenance";
  message?: string;
  lastUpdated: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "status": "operational",
  "lastUpdated": "2025-03-15T08:30:00Z"
}
```