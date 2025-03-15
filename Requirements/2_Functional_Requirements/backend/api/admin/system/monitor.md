# システムモニター実行 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/system/monitor`
- **機能概要**: システムの健全性チェックを手動で実行
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminRunSystemMonitorRequest`
```ts
export interface IAdminRunSystemMonitorRequest {
  components?: ("database" | "cache" | "queue" | "storage" | "ai_services" | "all")[];
  detailed?: boolean; // 詳細な診断情報を取得するか
  timeout_ms?: number; // 各コンポーネントのチェックタイムアウト（ミリ秒）
}
```

**例 (リクエストJSON)**
```jsonc
{
  "components": ["database", "ai_services"],
  "detailed": true,
  "timeout_ms": 5000
}
```

## レスポンス

**Response**: `IAdminRunSystemMonitorResponse`
```ts
export interface IAdminRunSystemMonitorResponse {
  job_id: string;
  status: "queued" | "running" | "completed";
  started_at: string;
  completed_at?: string;
  results?: {
    overall_status: "healthy" | "degraded" | "unhealthy";
    components: {
      [key: string]: {
        status: "healthy" | "degraded" | "unhealthy";
        message?: string;
        details?: Record<string, any>;
        checks?: {
          name: string;
          status: "passed" | "warning" | "failed";
          message?: string;
          value?: any;
          threshold?: any;
        }[];
        duration_ms: number;
      };
    };
  };
}
```

**例 (レスポンスJSON - 即時完了)**
```jsonc
{
  "job_id": "monitor_20250315_153045",
  "status": "completed",
  "started_at": "2025-03-15T15:30:45Z",
  "completed_at": "2025-03-15T15:30:48Z",
  "results": {
    "overall_status": "healthy",
    "components": {
      "database": {
        "status": "healthy",
        "message": "Database is operating normally",
        "details": {
          "version": "PostgreSQL 15.3",
          "connections": 12,
          "max_connections": 100
        },
        "checks": [
          {
            "name": "connection",
            "status": "passed",
            "message": "Connected successfully"
          },
          {
            "name": "query_latency",
            "status": "passed",
            "message": "Query latency within acceptable range",
            "value": 4.2,
            "threshold": 50
          },
          {
            "name": "connection_pool",
            "status": "passed",
            "message": "Connection pool usage normal",
            "value": 12,
            "threshold": 80
          }
        ],
        "duration_ms": 120
      },
      "ai_services": {
        "status": "healthy",
        "message": "All AI services are responding",
        "details": {
          "active_models": 3,
          "api_keys_configured": 3,
          "recent_errors": 0
        },
        "checks": [
          {
            "name": "openai_api",
            "status": "passed",
            "message": "OpenAI API responding"
          },
          {
            "name": "anthropic_api",
            "status": "passed",
            "message": "Anthropic API responding"
          },
          {
            "name": "google_api",
            "status": "passed",
            "message": "Google AI API responding"
          }
        ],
        "duration_ms": 2100
      }
    }
  }
}
```

**例 (レスポンスJSON - 非同期実行)**
```jsonc
{
  "job_id": "monitor_20250315_153045",
  "status": "queued",
  "started_at": "2025-03-15T15:30:45Z"
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4009",
    "message": "Invalid monitor request",
    "details": {
      "components": "Unknown component specified"
    }
  }
}
```

**Error**: e.g. `500 Internal Server Error`
```jsonc
{
  "error": {
    "code": "E5001",
    "message": "Failed to initiate system monitor"
  }
}
```