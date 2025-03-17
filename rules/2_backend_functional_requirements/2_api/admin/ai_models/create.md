# AIモデル作成 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/ai_models`
- **機能概要**: 新しいAIモデルをシステムに追加
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminCreateAIModelRequest`
```ts
export interface IAdminCreateAIModelRequest {
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
}
```

**例 (リクエストJSON)**
```jsonc
{
  "name": "Gemini Pro",
  "provider": "Google",
  "model_id": "gemini-pro",
  "capabilities": ["summarization", "tagging"],
  "default_for": [],
  "active": true,
  "config": {
    "api_key_variable": "GOOGLE_API_KEY",
    "endpoint": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
    "max_tokens": 2048,
    "temperature": 0.4,
    "additional_params": {
      "top_k": 40
    }
  }
}
```

## レスポンス

**Response**: `IAdminCreateAIModelResponse`
```ts
export interface IAdminCreateAIModelResponse {
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
  "id": 3,
  "name": "Gemini Pro",
  "provider": "Google",
  "model_id": "gemini-pro",
  "capabilities": ["summarization", "tagging"],
  "default_for": [],
  "active": true,
  "config": {
    "api_key_variable": "GOOGLE_API_KEY",
    "endpoint": "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
    "max_tokens": 2048,
    "temperature": 0.4,
    "additional_params": {
      "top_k": 40
    }
  },
  "created_at": "2025-03-15T10:30:00Z",
  "updated_at": "2025-03-15T10:30:00Z"
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4002",
    "message": "Invalid model configuration",
    "details": {
      "capabilities": "Must include at least one valid capability"
    }
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **入力検証**:
   - すべての必須フィールド（name, provider, model_id, capabilities, active, config）が存在することを確認してください。
   - 各フィールドの型と形式を検証してください:
     - `name`: 空でない文字列
     - `provider`: 空でない文字列
     - `model_id`: 空でない文字列
     - `capabilities`: 少なくとも1つの有効な値を含む配列（"summarization", "tagging", "content_extraction"など）
     - `default_for`: capabilities に含まれる値のみを含む配列
     - `active`: ブール値
     - `config`: 必要なフィールドを含むオブジェクト
   - `temperature` は 0.0〜1.0 の範囲内であることを確認してください。
   - `max_tokens` は正の整数であることを確認してください。

3. **重複チェック**:
   - 同じ `name` または同じ `provider` + `model_id` の組み合わせを持つモデルが既に存在しないか確認してください。
   - 重複がある場合は `409 Conflict` エラーを返してください。

4. **デフォルトモデル設定**:
   - `default_for` に指定された機能について、既存のデフォルトモデルがある場合の処理方針を決定してください:
     - 既存のデフォルト設定を上書きする
     - エラーを返す
     - 両方のモデルをデフォルトとして設定する
   - 選択した方針をドキュメントに明記し、一貫して実装してください。

5. **環境変数の検証**:
   - `api_key_variable` に指定された環境変数が実際に設定されているか確認することを推奨します。
   - 設定されていない場合は警告をログに記録するか、`active` を `false` に設定することを検討してください。

6. **トランザクション処理**:
   - データベースへの挿入操作はトランザクション内で実行し、エラー時にはロールバックしてください。
   - 特に `default_for` の設定変更が他のモデルに影響する場合は、整合性を保つためにトランザクションが重要です。

7. **日付フィールド**:
   - `created_at` と `updated_at` フィールドには現在のUTC時刻を設定してください。
   - 日時は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で保存・返却してください。

8. **配列とJSONの処理**:
   - `capabilities`, `default_for`, `additional_params` などの配列やオブジェクトフィールドは、データベースの型に応じて適切にシリアライズしてください。
   - PostgreSQLを使用する場合は、JSONB型の使用を検討してください。

9. **監査ログ**:
   - 誰がいつどのAIモデルを作成したかを記録する監査ログを実装してください。
   - ログには少なくとも、操作者ID、操作日時、作成されたモデルIDを含めてください。

10. **APIキーのセキュリティ**:
    - 実際のAPIキー値はリクエストやレスポンスに含めないでください。
    - 環境変数名やシークレット参照のみを保存・返却してください。

11. **モデル接続テスト**:
    - 可能であれば、新しいモデルを作成する際に簡単な接続テストを実行し、設定が有効であることを確認することを検討してください。
    - テスト結果を応答に含めるか、別のエンドポイント（`/api/admin/ai_models/[id]/test`）でテストを実行できるようにしてください。