# AIモデルテスト API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/ai_models/[id]/test`
- **機能概要**: 特定のAIモデルの動作をテスト
- **認証要否**: **要**(admin)

## リクエスト

**Path Parameter**:
- `id`: テストするAIモデルのID (必須)

**Request**: `IAdminTestAIModelRequest`
```ts
export interface IAdminTestAIModelRequest {
  capability: string;
  test_input: string;
  parameters?: Record<string, any>;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "capability": "summarization",
  "test_input": "これはテスト用のテキストです。AIモデルの要約機能をテストします。",
  "parameters": {
    "temperature": 0.3,
    "max_tokens": 100
  }
}
```

## レスポンス

**Response**: `IAdminTestAIModelResponse`
```ts
export interface IAdminTestAIModelResponse {
  success: boolean;
  model_id: number;
  model_name: string;
  capability: string;
  output: string;
  metrics: {
    tokens_used: number;
    processing_time: number;
    cost_estimate?: number;
  };
  error?: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "success": true,
  "model_id": 2,
  "model_name": "Claude 3 Opus",
  "capability": "summarization",
  "output": "テスト用テキストのAIモデル要約機能テスト",
  "metrics": {
    "tokens_used": 42,
    "processing_time": 1.2,
    "cost_estimate": 0.0008
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4004",
    "message": "Model does not support the requested capability",
    "details": {
      "capability": "summarization",
      "supported_capabilities": ["tagging", "content_extraction"]
    }
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

3. **モデル存在確認**:
   - 指定された `id` のAIモデルが存在するか確認してください。
   - 存在しない場合は `404 Not Found` エラーを返してください。

4. **機能サポート確認**:
   - リクエストの `capability` が指定されたモデルの `capabilities` 配列に含まれているか確認してください。
   - サポートされていない機能の場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

5. **入力検証**:
   - `test_input` が空でないことを確認してください。
   - `parameters` が指定された場合、モデルがサポートするパラメータであることを確認してください。
   - 特に `temperature` や `max_tokens` などの値が適切な範囲内であることを検証してください。

6. **AIモデル接続**:
   - モデルの設定情報（`api_key_variable`, `endpoint` など）を使用して、実際のAIサービスに接続してください。
   - 環境変数から適切なAPIキーを取得し、セキュアに扱ってください。
   - リクエストタイムアウトを設定し、長時間応答がない場合は適切にエラーハンドリングしてください。

7. **メトリクス計測**:
   - 処理時間を正確に計測するために、リクエスト開始時と完了時にタイムスタンプを記録してください。
   - トークン使用量はAIサービスのレスポンスから取得するか、入出力テキストから推定してください。
   - コスト見積もりは、トークン使用量とモデルの料金設定に基づいて計算してください。

8. **エラーハンドリング**:
   - AIサービスへの接続エラーや応答エラーを適切に処理してください。
   - エラーの詳細情報をログに記録し、ユーザーには理解しやすいメッセージを返してください。
   - 特に認証エラー（APIキー無効など）と使用量制限エラー（レートリミットなど）を区別して処理してください。

9. **レスポンスフォーマット**:
   - AIモデルからの生の応答を適切に処理し、一貫したフォーマットで返してください。
   - 特に異なるAIサービス（OpenAI, Anthropic, Google など）間での応答形式の違いを吸収してください。

10. **テスト結果の記録**:
    - テスト結果を一時的にデータベースに記録し、後で参照できるようにすることを検討してください。
    - これにより、モデルのパフォーマンス比較や問題診断が容易になります。

11. **リソース管理**:
    - 大量のテストリクエストによるコスト増加を防ぐため、レート制限の実装を検討してください。
    - 特に、短時間に同じモデルに対する複数のテストリクエストを制限することが重要です。

12. **セキュリティ考慮事項**:
    - `test_input` に機密情報や有害なコンテンツが含まれないよう、基本的な検証を実装してください。
    - AIモデルの応答にも同様の検証を適用し、安全でない内容が返されないようにしてください。