# タグ詳細取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/tags/[id]`
- **機能概要**: 特定のタグの詳細情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Path Parameter**:
- `id`: タグのID (必須)

## レスポンス

**Response**: `IAdminGetTagDetailResponse`
```ts
export interface IAdminGetTagDetailResponse {
  id: number;
  name: string;
  description?: string;
  color?: string;
  usage_count: number;
  auto_tag: boolean;
  created_at: string;
  updated_at: string;
  recent_contents?: {
    id: number;
    title: string;
    created_at: string;
  }[];
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 1,
  "name": "AI",
  "description": "人工知能に関する記事",
  "color": "#FF5733",
  "usage_count": 42,
  "auto_tag": true,
  "created_at": "2025-01-10T08:15:30Z",
  "updated_at": "2025-03-12T14:22:10Z",
  "recent_contents": [
    {
      "id": 123,
      "title": "AIの最新動向 2025年版",
      "created_at": "2025-03-10T14:45:00Z"
    },
    {
      "id": 120,
      "title": "機械学習フレームワークの比較",
      "created_at": "2025-03-08T09:30:15Z"
    }
  ]
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

4. **データベースアクセス**:
   - タグの基本情報は `tags` テーブルから取得します。
   - `usage_count` は関連テーブル（例：`content_tags`）からの集計が必要です。
   - `recent_contents` は `contents` テーブルと `content_tags` テーブルを結合して取得します。
   - 最近のコンテンツは作成日時の降順で取得し、数を制限してください（例：最新5件）。

5. **パフォーマンス最適化**:
   - 複数のテーブル結合が必要になるため、クエリのパフォーマンスに注意してください。
   - 特に `content_tags` テーブルには、`tag_id` と `content_id` の複合インデックスを作成することを推奨します。
   - `recent_contents` の取得は別クエリとして実行し、メインのタグ情報取得と分離することも検討してください。

6. **日付フォーマット**:
   - すべての日時フィールド（created_at, updated_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

7. **エラーハンドリング**:
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
   - エラーメッセージにはセキュリティ上の機密情報（DB接続文字列など）を含めないよう注意してください。

8. **キャッシュ戦略**:
   - タグ詳細情報は頻繁に変更されない可能性があるため、適切なキャッシュ戦略を実装することでパフォーマンスを向上させることができます。
   - キャッシュの有効期限（TTL）を設定し、タグが更新された際にキャッシュを無効化する仕組みを検討してください。
   - ただし、`usage_count` や `recent_contents` は変動する可能性が高いため、キャッシュ戦略を慎重に設計してください。

9. **NULL値の処理**:
   - `description` や `color` などのオプションフィールドが NULL の場合、JSON レスポンスでは `null` として返すか、フィールド自体を省略するかを一貫して実装してください。
   - TypeScript インターフェースでは、これらのフィールドをオプショナル（`?`）として定義しています。

10. **セキュリティ考慮事項**:
    - `description` フィールドにユーザー入力が含まれる場合、XSS攻撃を防ぐために適切にエスケープ処理を行ってください。
    - `color` フィールドが有効なカラーコード形式（例：`#RRGGBB`）であることを確認してください。