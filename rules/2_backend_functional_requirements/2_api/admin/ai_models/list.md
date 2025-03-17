# AIモデル一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/ai_models`
- **機能概要**: システムで利用可能なAIモデルの一覧を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request**: なし

## レスポンス

**Response**: `IAdminGetAIModelsResponse`
```ts
export interface IAdminGetAIModelsResponse {
  models: IAdminAIModel[];
}

export interface IAdminAIModel {
  id: number;
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  default_for?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "models": [
    {
      "id": 1,
      "name": "GPT-4",
      "provider": "OpenAI",
      "model_id": "gpt-4",
      "capabilities": ["summarization", "tagging"],
      "default_for": ["summarization"],
      "active": true,
      "created_at": "2025-01-15T12:00:00Z",
      "updated_at": "2025-02-20T15:30:45Z"
    },
    {
      "id": 2,
      "name": "Claude 3 Opus",
      "provider": "Anthropic",
      "model_id": "claude-3-opus-20240229",
      "capabilities": ["summarization", "tagging", "content_extraction"],
      "default_for": ["tagging", "content_extraction"],
      "active": true,
      "created_at": "2025-03-01T09:15:30Z",
      "updated_at": "2025-03-01T09:15:30Z"
    }
  ]
}
```

## エラー

**Error**: e.g. `500 Internal Server Error`
```jsonc
{
  "error": {
    "code": "E5001",
    "message": "Failed to retrieve AI models"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **データベースアクセス**:
   - AIモデル情報はデータベースの `ai_models` テーブルから取得します。
   - パフォーマンスを考慮し、必要に応じてインデックスを作成してください。
   - 特に `capabilities` や `default_for` フィールドが配列型の場合、適切なデータ型（JSONBなど）を使用してください。

3. **フィルタリングとソート**:
   - 将来的な拡張として、クエリパラメータによるフィルタリング（例：`?provider=OpenAI`）やソート（例：`?sort_by=name&sort_order=asc`）の実装を検討してください。
   - これらのパラメータを実装する場合は、適切な入力検証を行ってください。

4. **キャッシュ戦略**:
   - AIモデルリストは頻繁に変更されないため、適切なキャッシュ戦略を実装することでパフォーマンスを向上させることができます。
   - キャッシュの有効期限（TTL）を設定し、モデルが更新された際にキャッシュを無効化する仕組みを検討してください。

5. **エラーハンドリング**:
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
   - エラーメッセージにはセキュリティ上の機密情報（DB接続文字列など）を含めないよう注意してください。

6. **日付フォーマット**:
   - すべての日時フィールド（created_at, updated_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

7. **配列フィールドの処理**:
   - `capabilities` と `default_for` は配列として返す必要があります。
   - データベースの実装によっては、これらのフィールドを文字列からJSONに変換する処理が必要になる場合があります。

8. **パフォーマンス考慮事項**:
   - モデル数が多い場合は、ページネーションの実装を検討してください。
   - レスポンスサイズが大きくなる場合は、圧縮を検討してください。

9. **セキュリティ考慮事項**:
   - レスポンスにはAPIキーや機密設定情報を含めないでください。
   - 詳細な設定情報は個別のエンドポイント（`/api/admin/ai_models/[id]`）で取得するようにしてください。