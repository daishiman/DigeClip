# アプリケーション設定取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/system/settings`
- **機能概要**: システム全体の設定情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Query Parameters**:
- `category`: 取得する設定カテゴリ (`general`, `notifications`, `ai`, `sources`, `security`, `all`) (デフォルト: `all`)

## レスポンス

**Response**: `IAdminGetSystemSettingsResponse`
```ts
export interface IAdminGetSystemSettingsResponse {
  settings: {
    general?: {
      site_name: string;
      site_description?: string;
      default_language: string;
      timezone: string;
      date_format: string;
      enable_public_access: boolean;
    };
    notifications?: {
      enable_email: boolean;
      enable_slack: boolean;
      enable_discord: boolean;
      default_notification_channel: string;
      notification_frequency: "immediate" | "hourly" | "daily" | "weekly";
      digest_time?: string; // HH:MM形式
      digest_day?: number; // 週次ダイジェストの曜日 (0-6, 0=日曜)
    };
    ai?: {
      default_summarization_model_id: number;
      default_tagging_model_id: number;
      default_extraction_model_id: number;
      enable_auto_tagging: boolean;
      enable_auto_summarization: boolean;
      max_tokens_per_request: number;
      content_safety_filter: "none" | "low" | "medium" | "high";
    };
    sources?: {
      default_check_interval: number; // 分単位
      max_content_age: number; // 日単位
      auto_deactivate_failing_sources: boolean;
      max_failures_before_deactivation: number;
      content_fetch_timeout: number; // 秒単位
    };
    security?: {
      session_timeout: number; // 分単位
      max_login_attempts: number;
      require_2fa_for_admins: boolean;
      password_policy: {
        min_length: number;
        require_uppercase: boolean;
        require_lowercase: boolean;
        require_numbers: boolean;
        require_special_chars: boolean;
      };
      api_rate_limits: {
        enabled: boolean;
        requests_per_minute: number;
        requests_per_hour: number;
      };
    };
  };
  last_updated: string;
  updated_by?: string;
}
```

**例 (レスポンスJSON - 全カテゴリ)**
```jsonc
{
  "settings": {
    "general": {
      "site_name": "DigeClip",
      "site_description": "AIを活用したコンテンツ収集・要約システム",
      "default_language": "ja",
      "timezone": "Asia/Tokyo",
      "date_format": "YYYY-MM-DD",
      "enable_public_access": false
    },
    "notifications": {
      "enable_email": true,
      "enable_slack": true,
      "enable_discord": false,
      "default_notification_channel": "email",
      "notification_frequency": "daily",
      "digest_time": "09:00"
    },
    "ai": {
      "default_summarization_model_id": 2,
      "default_tagging_model_id": 2,
      "default_extraction_model_id": 1,
      "enable_auto_tagging": true,
      "enable_auto_summarization": true,
      "max_tokens_per_request": 4000,
      "content_safety_filter": "medium"
    },
    "sources": {
      "default_check_interval": 60,
      "max_content_age": 30,
      "auto_deactivate_failing_sources": true,
      "max_failures_before_deactivation": 5,
      "content_fetch_timeout": 30
    },
    "security": {
      "session_timeout": 120,
      "max_login_attempts": 5,
      "require_2fa_for_admins": true,
      "password_policy": {
        "min_length": 10,
        "require_uppercase": true,
        "require_lowercase": true,
        "require_numbers": true,
        "require_special_chars": true
      },
      "api_rate_limits": {
        "enabled": true,
        "requests_per_minute": 60,
        "requests_per_hour": 1000
      }
    }
  },
  "last_updated": "2025-03-10T08:45:30Z",
  "updated_by": "admin@example.com"
}
```

**例 (レスポンスJSON - 特定カテゴリのみ)**
```jsonc
{
  "settings": {
    "ai": {
      "default_summarization_model_id": 2,
      "default_tagging_model_id": 2,
      "default_extraction_model_id": 1,
      "enable_auto_tagging": true,
      "enable_auto_summarization": true,
      "max_tokens_per_request": 4000,
      "content_safety_filter": "medium"
    }
  },
  "last_updated": "2025-03-10T08:45:30Z",
  "updated_by": "admin@example.com"
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4010",
    "message": "Invalid settings category"
  }
}
```