# タグ一括操作 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/tags/batch`
- **機能概要**: 複数のタグに対して一括操作を実行
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminBatchTagsRequest`
```ts
export interface IAdminBatchTagsRequest {
  operation: "create" | "update" | "delete";
  tags: {
    id?: number; // 更新・削除時は必須
    name?: string; // 作成時は必須、更新時はオプション
    description?: string;
    color?: string;
    auto_tag?: boolean;
  }[];
}
```

**例 (リクエストJSON - 作成)**
```jsonc
{
  "operation": "create",
  "tags": [
    {
      "name": "クラウド",
      "description": "クラウドコンピューティングに関する記事",
      "color": "#3366CC",
      "auto_tag": true
    },
    {
      "name": "セキュリティ",
      "description": "情報セキュリティに関する記事",
      "color": "#CC3366",
      "auto_tag": false
    }
  ]
}
```

**例 (リクエストJSON - 更新)**
```jsonc
{
  "operation": "update",
  "tags": [
    {
      "id": 3,
      "color": "#33CC66"
    },
    {
      "id": 4,
      "description": "更新された説明文",
      "auto_tag": false
    }
  ]
}
```

**例 (リクエストJSON - 削除)**
```jsonc
{
  "operation": "delete",
  "tags": [
    {
      "id": 5
    },
    {
      "id": 6
    }
  ]
}
```

## レスポンス

**Response**: `IAdminBatchTagsResponse`
```ts
export interface IAdminBatchTagsResponse {
  success: boolean;
  operation: string;
  results: {
    id?: number;
    name?: string;
    status: "success" | "error";
    message?: string;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}
```

**例 (レスポンスJSON - 作成成功)**
```jsonc
{
  "success": true,
  "operation": "create",
  "results": [
    {
      "id": 7,
      "name": "クラウド",
      "status": "success"
    },
    {
      "id": 8,
      "name": "セキュリティ",
      "status": "success"
    }
  ],
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

**例 (レスポンスJSON - 部分的成功)**
```jsonc
{
  "success": true,
  "operation": "update",
  "results": [
    {
      "id": 3,
      "status": "success"
    },
    {
      "id": 4,
      "status": "error",
      "message": "Tag not found"
    }
  ],
  "summary": {
    "total": 2,
    "successful": 1,
    "failed": 1
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid batch operation",
    "details": {
      "operation": "Unsupported operation type"
    }
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **入力検証**:
   - `operation` フィールドが有効な値（"create", "update", "delete"）であることを確認してください。
   - `tags` 配列が空でないことを確認してください。
   - 各操作タイプに応じた必須フィールドの存在を確認してください:
     - "create": `name` が必須
     - "update", "delete": `id` が必須
   - 入力が無効な場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **バッチサイズ制限**:
   - 一度に処理するタグの数に上限を設けることを検討してください（例：最大100件）。
   - 大量のタグを処理する場合は、パフォーマンスとタイムアウトに注意してください。

4. **トランザクション処理**:
   - バッチ操作全体を単一のトランザクションで処理するか、個別のトランザクションで処理するかを決定してください。
   - 単一トランザクションの場合、一部のエラーで全体が失敗します（一貫性は高い）。
   - 個別トランザクションの場合、一部成功・一部失敗の状態が発生します（部分的な成功を許容）。
   - 推奨: 個別トランザクションで処理し、結果を詳細に報告する方式。

5. **重複チェック**:
   - "create" 操作では、同じ名前のタグが既に存在しないか確認してください。
   - バッチ内での重複（同じ名前のタグを複数作成しようとする）も検出してください。

6. **使用中チェック**:
   - "delete" 操作では、削除対象のタグがコンテンツに関連付けられているかどうかを確認することを検討してください。
   - 使用中のタグを削除する場合の方針を決定してください（エラーを返す、関連付けも削除する、など）。

7. **エラーハンドリング**:
   - 各タグの処理結果を個別に記録し、部分的な失敗を許容する実装を検討してください。
   - 全体の成功/失敗の判断基準を明確にしてください（例：1つでも失敗したら `success: false` とするか、部分的成功も `success: true` とするか）。
   - データベース接続エラーなどの致命的なエラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。

8. **パフォーマンス最適化**:
   - 大量のタグを処理する場合は、バルクインサート/アップデート/デリートを使用してパフォーマンスを向上させることを検討してください。
   - ただし、バルク操作では個別のエラーハンドリングが難しくなる点に注意してください。

9. **監査ログ**:
   - 誰がいつどのタグに対してどのような一括操作を行ったかを記録する監査ログを実装してください。
   - ログには少なくとも、操作者ID、操作日時、操作タイプ、対象タグID/名前、結果を含めてください。

10. **キャッシュ管理**:
    - タグ情報のキャッシュがある場合、バッチ操作後にキャッシュを無効化または更新してください。

11. **非同期処理の検討**:
    - 大量のタグを処理する場合は、バックグラウンドジョブとして非同期処理することを検討してください。
    - その場合、ジョブIDを返し、別のエンドポイントで処理状況を確認できるようにすることが望ましいです。

12. **冪等性の確保**:
    - 同じリクエストが複数回送信された場合でも安全に処理できるよう、冪等性を確保してください。
    - 特に "create" 操作では、一意の制約を活用して重複作成を防止してください。

13. **日付フォーマット**:
    - 作成・更新時の日時フィールド（created_at, updated_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で設定してください。
    - タイムゾーンは UTC を使用してください。