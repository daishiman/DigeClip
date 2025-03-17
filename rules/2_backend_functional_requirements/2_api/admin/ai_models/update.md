# AIモデル更新 API

- **HTTPメソッド**: `PUT`
- **エンドポイント**: `/api/admin/ai_models/[id]`
- **機能概要**: 既存のAIモデルの設定を更新
- **認証要否**: **要**(admin)

## リクエスト

**Path Parameter**:
- `id`: 更新するAIモデルのID (必須)

**Request**: `IAdminUpdateAIModelRequest`
```ts
export interface IAdminUpdateAIModelRequest {
  name?: string;
  provider?: string;
  model_id?: string;
  capabilities?: string[];
  default_for?: string[];
  active?: boolean;
  config?: {
    api_key_variable?: string;
    endpoint?: string;
    max_tokens?: number;
    temperature?: number;
    additional_params?: Record<string, any>;
  };
}
```

**例 (リクエストJSON)**
```jsonc
{
  "name": "Claude 3 Opus (Updated)",
  "active": true,
  "config": {
    "temperature": 0.5,
    "max_tokens": 5000,
    "additional_params": {
      "top_p": 0.95
    }
  },
  "default_for": ["summarization", "tagging"]
}
```

## レスポンス

**Response**: `IAdminUpdateAIModelResponse`
```ts
export interface IAdminUpdateAIModelResponse {
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
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 2,
  "name": "Claude 3 Opus (Updated)",
  "provider": "Anthropic",
  "model_id": "claude-3-opus-20240229",
  "capabilities": ["summarization", "tagging", "content_extraction"],
  "default_for": ["summarization", "tagging"],
  "active": true,
  "config": {
    "api_key_variable": "ANTHROPIC_API_KEY",
    "endpoint": "https://api.anthropic.com/v1/messages",
    "max_tokens": 5000,
    "temperature": 0.5,
    "additional_params": {
      "top_p": 0.95,
      "top_k": 50
    }
  },
  "created_at": "2025-03-01T09:15:30Z",
  "updated_at": "2025-03-15T11:42:18Z"
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

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4002",
    "message": "Invalid model configuration",
    "details": {
      "temperature": "Must be between 0 and 1"
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

4. **部分更新の処理**:
   - このAPIは部分更新（PATCH的な動作）を行います。リクエストに含まれるフィールドのみを更新してください。
   - リクエストに含まれていないフィールドは現在の値を維持してください。
   - `config` オブジェクトも部分更新として扱い、指定されたプロパティのみを更新してください。
   - `additional_params` は完全に置き換えるか、マージするかの方針を決定し、一貫して実装してください。

5. **入力検証**:
   - 提供されたフィールドの型と形式を検証してください:
     - `name`: 空でない文字列
     - `provider`: 空でない文字列
     - `model_id`: 空でない文字列
     - `capabilities`: 少なくとも1つの有効な値を含む配列
     - `default_for`: capabilities に含まれる値のみを含む配列
     - `active`: ブール値
   - `temperature` は 0.0〜1.0 の範囲内であることを確認してください。
   - `max_tokens` は正の整数であることを確認してください。

6. **重複チェック**:
   - `name`, `provider`, または `model_id` を変更する場合、新しい値が他のモデルと重複しないことを確認してください。
   - 重複がある場合は `409 Conflict` エラーを返してください。

7. **デフォルトモデル設定**:
   - `default_for` を更新する場合、既存のデフォルトモデル設定との整合性を確保してください。
   - 他のモデルがデフォルトとして設定されている機能を新たにデフォルトとして設定する場合の処理方針を決定してください:
     - 既存のデフォルト設定を上書きする
     - エラーを返す
     - 両方のモデルをデフォルトとして設定する
   - 選択した方針をドキュメントに明記し、一貫して実装してください。

8. **環境変数の検証**:
   - `api_key_variable` を更新する場合、指定された環境変数が実際に設定されているか確認することを推奨します。
   - 設定されていない場合は警告をログに記録するか、`active` を `false` に設定することを検討してください。

9. **トランザクション処理**:
   - データベース更新操作はトランザクション内で実行し、エラー時にはロールバックしてください。
   - 特に `default_for` の設定変更が他のモデルに影響する場合は、整合性を保つためにトランザクションが重要です。

10. **楽観的ロック**:
    - 同時更新の競合を防ぐため、楽観的ロック（バージョン番号や更新タイムスタンプによる）の実装を検討してください。
    - 競合が検出された場合は `409 Conflict` エラーを返してください。

11. **日付フィールド**:
    - `updated_at` フィールドには現在のUTC時刻を設定してください。
    - 日時は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で保存・返却してください。

12. **監査ログ**:
    - 誰がいつどのAIモデルをどのように更新したかを記録する監査ログを実装してください。
    - ログには少なくとも、操作者ID、操作日時、対象モデルID、変更されたフィールドを含めてください。

13. **キャッシュ管理**:
    - モデル情報のキャッシュがある場合、更新後にキャッシュを無効化または更新してください。

14. **アクティブ状態の変更処理**:
    - `active` を `false` に変更する場合、そのモデルが現在使用中でないことを確認することを検討してください。
    - 特に `default_for` に設定されている場合は、代替のデフォルトモデルを設定するか、警告を表示してください。