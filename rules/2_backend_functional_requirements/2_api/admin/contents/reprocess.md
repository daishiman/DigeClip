# コンテンツ再処理 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/contents/[id]/reprocess`
- **機能概要**: エラーのあったコンテンツを再処理
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminReprocessContentRequest`
```ts
export interface IAdminReprocessContentRequest {
  steps?: ("text_extraction" | "summarization" | "notification")[];
  ai_model_id?: number; // 特定のAIモデルで再処理する場合
}
```

**例 (リクエストJSON)**
```jsonc
{
  "steps": ["summarization", "notification"],
  "ai_model_id": 2
}
```

## レスポンス

**Response**: `IAdminReprocessContentResponse`
```ts
export interface IAdminReprocessContentResponse {
  message: string;
  id: number;
  job_id?: string;
  steps: string[];
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Content reprocessing job queued",
  "id": 42,
  "job_id": "reprocess_20250315_123456",
  "steps": ["summarization", "notification"]
}
```

## エラー

**Error**: e.g. `400 Bad Request` (無効なステップ)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid processing steps"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **パラメータ検証**:
   - `id` パスパラメータは数値であることを確認してください。
   - `steps` 配列の各要素が有効な値（"text_extraction", "summarization", "notification"）であることを検証してください。
   - `ai_model_id` が指定された場合、存在するモデルIDであることを確認してください。
   - パラメータが無効な場合は適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **非同期処理**:
   - 再処理はバックグラウンドジョブとして実行し、即時レスポンスを返してください。
   - ジョブキュー（例：Bull, Celery, AWS SQS など）を使用して処理を管理してください。
   - 一意の `job_id` を生成し、後でジョブのステータスを追跡できるようにしてください。

4. **ステップの依存関係**:
   - 処理ステップには依存関係があります（例：summarization は text_extraction の後に実行する必要がある）。
   - ステップの順序を強制するか、依存関係を考慮したジョブスケジューリングを実装してください。
   - 例えば、`steps` に "summarization" のみが含まれ、コンテンツの text_extraction が完了していない場合は、自動的に text_extraction も実行するか、エラーを返すかを決定してください。

5. **AIモデル連携**:
   - `ai_model_id` が指定された場合、指定されたモデルが要求された処理ステップ（summarization など）をサポートしているか確認してください。
   - AIモデルへのリクエストにはレート制限やタイムアウトを設定し、適切にエラーハンドリングしてください。
   - AIモデルの使用量やトークン消費を監視・記録してください。

6. **状態管理**:
   - コンテンツの処理状態を適切に更新してください（例：status フィールドを "pending" に設定）。
   - 各ステップの開始時刻と完了時刻を記録し、processing_history を更新してください。

7. **エラーハンドリング**:
   - コンテンツが存在しない場合は `404 Not Found` を返してください。
   - 再処理中のエラーはログに記録し、コンテンツの error_message フィールドを更新してください。
   - ジョブキューの障害に備えて、適切なリトライメカニズムを実装してください。

8. **通知処理**:
   - "notification" ステップが含まれる場合、通知設定（チャンネル、テンプレートなど）を確認してください。
   - 通知の送信状態を notifications テーブルに記録してください。

9. **監査ログ**:
   - 誰がいつどのコンテンツの再処理をリクエストしたかを記録する監査ログを実装してください。
   - 使用されたAIモデルや処理ステップも記録してください。

10. **リソース管理**:
    - 同時に多数の再処理ジョブが実行されないよう、キューの同時実行数を制限することを検討してください。
    - 長時間実行されるジョブのタイムアウト処理を実装してください。