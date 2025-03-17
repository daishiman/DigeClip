# AIモデル詳細取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/ai_models/[id]`
- **機能概要**: 特定のAIモデルの詳細情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Path Parameter**:
- `id`: AIモデルのID (必須)

## レスポンス

**Response**: `IAdminGetAIModelDetailResponse`
```ts
export interface IAdminGetAIModelDetailResponse {
  id: number;
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  default_for?: string[];
  active: boolean;
  config: {
    api_key_variable?: string;
    endpoint?: string;
    max_tokens?: number;
    temperature?: number;
    additional_params?: Record<string, any>;
  };
  usage_stats?: {
    total_requests: number;
    total_tokens: number;
    average_response_time: number;
    last_used: string;
  };
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 2,
  "name": "Claude 3 Opus",
  "provider": "Anthropic",
  "model_id": "claude-3-opus-20240229",
  "capabilities": ["summarization", "tagging", "content_extraction"],
  "default_for": ["tagging", "content_extraction"],
  "active": true,
  "config": {
    "api_key_variable": "ANTHROPIC_API_KEY",
    "endpoint": "https://api.anthropic.com/v1/messages",
    "max_tokens": 4000,
    "temperature": 0.7,
    "additional_params": {
      "top_p": 0.9,
      "top_k": 50
    }
  },
  "usage_stats": {
    "total_requests": 1250,
    "total_tokens": 3750000,
    "average_response_time": 2.3,
    "last_used": "2025-03-14T18:22:10Z"
  },
  "created_at": "2025-03-01T09:15:30Z",
  "updated_at": "2025-03-10T14:25:12Z"
}
```

## エラー

**Error**: e.g. `404 Not Found`
```jsonc
{
  "error": {
    "code": "E4041",
    "message": "AI model not found"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **パスパラメータの検証**:
   - `id` パラメータは数値であることを確認してください。
   - 不正な形式の場合は `400 Bad Request` を返してください。

3. **データベースアクセス**:
   - AIモデル情報は `ai_models` テーブルから取得します。
   - 使用統計情報（usage_stats）は別テーブル（例：`ai_model_usage_stats`）から取得する場合があります。
   - 必要に応じてテーブル結合を行い、効率的なクエリを実装してください。

4. **機密情報の取り扱い**:
   - `config` 内の情報、特に `api_key_variable` は機密情報を直接含まないようにしてください。
   - 実際のAPIキー値ではなく、環境変数名やシークレットの参照名のみを返すようにしてください。
   - 必要に応じて、機密情報をマスクまたは省略してください。

5. **エラーハンドリング**:
   - モデルが存在しない場合は `404 Not Found` を返してください。
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。

6. **日付フォーマット**:
   - すべての日時フィールド（created_at, updated_at, last_used）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

7. **使用統計の計算**:
   - `usage_stats` は実際の使用データから動的に計算する必要があります。
   - 大量のログデータがある場合、集計クエリのパフォーマンスに注意してください。
   - 頻繁にアクセスされる場合は、定期的に集計値を更新するバックグラウンドジョブの実装を検討してください。

8. **配列フィールドの処理**:
   - `capabilities` と `default_for` は配列として返す必要があります。
   - データベースの実装によっては、これらのフィールドを文字列からJSONに変換する処理が必要になる場合があります。

9. **additional_params の処理**:
   - `additional_params` は任意の構造を持つオブジェクトとして保存・取得する必要があります。
   - データベースでは JSONB 型などを使用し、適切にシリアライズ/デシリアライズしてください。

10. **キャッシュ戦略**:
    - 詳細情報は頻繁に変更されない可能性があるため、適切なキャッシュ戦略を検討してください。
    - ただし、usage_stats は定期的に更新される可能性があるため、部分的なキャッシュ更新または短いTTLの設定を検討してください。