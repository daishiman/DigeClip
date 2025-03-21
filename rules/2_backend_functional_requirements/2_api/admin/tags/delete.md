# タグ削除 API

- **HTTPメソッド**: `DELETE`
- **エンドポイント**: `/api/admin/tags/[id]`
- **機能概要**: 特定のタグを削除
- **認証要否**: **要**(admin)

## リクエスト

**Path Parameter**:
- `id`: 削除するタグのID (必須)

## レスポンス

**Response**: `IAdminDeleteTagResponse`
```ts
export interface IAdminDeleteTagResponse {
  message: string;
  id: number;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Tag deleted successfully",
  "id": 5
}
```

## エラー

**Error**: e.g. `404 Not Found`
```jsonc
{
  "error": {
    "code": "E4042",
    "message": "Tag not found"
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

3. **タグ存在確認**:
   - 指定された `id` のタグが存在するか確認してください。
   - 存在しない場合は `404 Not Found` エラーを返してください。

4. **使用中チェック**:
   - 削除対象のタグがコンテンツに関連付けられているかどうかを確認することを検討してください。
   - 使用中のタグを削除する場合の方針を決定してください:
     - 関連付けも一緒に削除する（カスケード削除）
     - 使用中の場合はエラーを返す
     - 使用中でも削除を許可するが、クエリパラメータで明示的な確認を求める（例：`?force=true`）

5. **トランザクション処理**:
   - 削除操作はトランザクション内で実行し、エラー時にはロールバックしてください。
   - 特に関連テーブル（例：`content_tags`）からの削除も必要な場合は、トランザクションが重要です。

6. **関連データの処理**:
   - タグに関連するデータ（例：`content_tags` テーブルのエントリ）も適切に処理してください。
   - 外部キー制約がある場合は、それに従って関連データを処理してください。

7. **ソフトデリート検討**:
   - 完全に削除するのではなく、`deleted_at` フラグを設定するソフトデリートの実装を検討してください。
   - これにより、誤削除からの復旧や履歴の保持が容易になります。

8. **監査ログ**:
   - 誰がいつどのタグを削除したかを記録する監査ログを実装してください。
   - ログには少なくとも、操作者ID、操作日時、削除されたタグID、タグ名を含めてください。

9. **キャッシュ管理**:
   - タグ情報のキャッシュがある場合、削除後にキャッシュを無効化してください。
   - 特にタグリストや関連コンテンツのキャッシュが影響を受ける可能性があります。

10. **エラーハンドリング**:
    - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
    - エラーメッセージにはセキュリティ上の機密情報（DB接続文字列など）を含めないよう注意してください。

11. **自動タグ付け機能への影響**:
    - 削除するタグが自動タグ付け機能で使用されている場合、その影響を考慮してください。
    - 必要に応じて、自動タグ付けルールの更新や関連設定の調整を行ってください。