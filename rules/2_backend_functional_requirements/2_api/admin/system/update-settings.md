# アプリケーション設定更新 API

- **HTTPメソッド**: `PUT`
- **エンドポイント**: `/api/admin/system/settings`
- **機能概要**: アプリケーション設定を更新
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminUpdateSettingsRequest`
```ts
export interface IAdminUpdateSettingsRequest {
  settings: Record<string, any>;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "settings": {
    "monitor_interval": 1800,
    "default_summary_length": 600,
    "log_level": "debug"
  }
}
```

## レスポンス

**Response**: `IAdminUpdateSettingsResponse`
```ts
export interface IAdminUpdateSettingsResponse {
  message: string;
  updated_settings: string[];
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Settings updated successfully",
  "updated_settings": [
    "monitor_interval",
    "default_summary_length",
    "log_level"
  ]
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効な設定値)
```jsonc
{
  "error": {
    "code": "E4004",
    "message": "Invalid setting value: monitor_interval must be >= 300"
  }
}
```