# タグ作成 API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/tags`
- **機能概要**: 新しいタグを作成
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `IAdminCreateTagRequest`
```ts
export interface IAdminCreateTagRequest {
  name: string;
  description?: string;
  color?: string;
  auto_tag?: boolean;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "name": "ブロックチェーン",
  "description": "ブロックチェーン技術に関する記事",
  "color": "#3366FF",
  "auto_tag": true
}
```

## レスポンス

**Response**: `IAdminCreateTagResponse`
```ts
export interface IAdminCreateTagResponse {
  id: number;
  name: string;
  description?: string;
  color?: string;
  auto_tag: boolean;
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 5,
  "name": "ブロックチェーン",
  "description": "ブロックチェーン技術に関する記事",
  "color": "#3366FF",
  "auto_tag": true,
  "created_at": "2025-03-15T10:30:00Z",
  "updated_at": "2025-03-15T10:30:00Z"
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid tag data",
    "details": {
      "name": "Tag name is required"
    }
  }
}
```

**Error**: e.g. `409 Conflict`
```jsonc
{
  "error": {
    "code": "E4091",
    "message": "Tag with this name already exists"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **入力検証**:
   - `name` フィールドは必須であり、空でないことを確認してください。
   - `name` の長さに制限を設けることを検討してください（例：最大50文字）。
   - `color` が指定された場合、有効なカラーコード形式（例：`#RRGGBB`）であることを確認してください。
   - `description` が指定された場合、長さに制限を設けることを検討してください（例：最大200文字）。
   - 入力が無効な場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **重複チェック**:
   - 同じ `name` を持つタグが既に存在しないか確認してください。
   - 大文字・小文字を区別しない比較を行うことを推奨します（例：`LOWER(name) = LOWER(?)`）。
   - 重複がある場合は `409 Conflict` エラーを返してください。

4. **データベース操作**:
   - タグ情報は `tags` テーブルに挿入します。
   - `created_at` と `updated_at` フィールドには現在のUTC時刻を設定してください。
   - `auto_tag` が指定されていない場合は、デフォルト値（例：`false`）を設定してください。

5. **トランザクション処理**:
   - データベースへの挿入操作はトランザクション内で実行し、エラー時にはロールバックしてください。
   - 特に将来的に関連テーブルへの挿入が必要になる場合は、トランザクションが重要です。

6. **日付フォーマット**:
   - すべての日時フィールド（created_at, updated_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

7. **エラーハンドリング**:
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
   - エラーメッセージにはセキュリティ上の機密情報（DB接続文字列など）を含めないよう注意してください。

8. **監査ログ**:
   - 誰がいつどのタグを作成したかを記録する監査ログを実装してください。
   - ログには少なくとも、操作者ID、操作日時、作成されたタグIDを含めてください。

9. **キャッシュ管理**:
   - タグリストのキャッシュがある場合、新しいタグ作成後にキャッシュを無効化または更新してください。

10. **セキュリティ考慮事項**:
    - `name` や `description` フィールドにユーザー入力が含まれるため、XSS攻撃を防ぐために適切にエスケープ処理を行ってください。
    - 特に、これらのフィールドがUIに表示される場合は注意が必要です。

11. **自動タグ付け機能**:
    - `auto_tag` が `true` に設定された場合、将来的に自動タグ付けルールの設定が必要になる可能性があります。
    - 現時点では基本的なフラグとして実装し、拡張性を考慮した設計にしてください。