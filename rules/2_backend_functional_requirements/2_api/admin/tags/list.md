# タグ一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/tags`
- **機能概要**: システムで利用可能なタグの一覧を取得
- **認証要否**: **要**(admin)

## リクエスト

**Query Parameters**:
- `page`: ページ番号 (デフォルト: 1)
- `per_page`: 1ページあたりの件数 (デフォルト: 20, 最大: 100)
- `sort_by`: ソート項目 (`name`, `created_at`, `usage_count`) (デフォルト: `name`)
- `sort_order`: ソート順 (`asc`, `desc`) (デフォルト: `asc`)
- `search`: 検索キーワード (タグ名で部分一致検索)

## レスポンス

**Response**: `IAdminGetTagsResponse`
```ts
export interface IAdminGetTagsResponse {
  tags: IAdminTag[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface IAdminTag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "tags": [
    {
      "id": 1,
      "name": "AI",
      "description": "人工知能に関する記事",
      "color": "#FF5733",
      "usage_count": 42,
      "created_at": "2025-01-15T12:00:00Z",
      "updated_at": "2025-02-20T15:30:45Z"
    },
    {
      "id": 2,
      "name": "テクノロジー",
      "description": "最新技術動向",
      "color": "#33A1FF",
      "usage_count": 28,
      "created_at": "2025-01-20T09:15:30Z",
      "updated_at": "2025-01-20T09:15:30Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "per_page": 20,
    "total_pages": 1
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid pagination parameters"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **クエリパラメータの検証**:
   - `page` と `per_page` は正の整数であることを確認してください。
   - `per_page` は最大値（100）を超えないようにしてください。
   - `sort_by` は許可された値（`name`, `created_at`, `usage_count`）のいずれかであることを確認してください。
   - `sort_order` は許可された値（`asc`, `desc`）のいずれかであることを確認してください。
   - パラメータが無効な場合は適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **データベースアクセス**:
   - タグ情報はデータベースの `tags` テーブルから取得します。
   - `usage_count` は関連テーブル（例：`content_tags`）からの集計が必要です。
   - パフォーマンスを考慮し、必要に応じてインデックスを作成してください。
   - 特に `name` 列と `created_at` 列にはインデックスを設定することを推奨します。

4. **ページネーション実装**:
   - オフセットベースのページネーションを実装してください（例：`OFFSET (page - 1) * per_page LIMIT per_page`）。
   - 大量のデータがある場合は、カーソルベースのページネーションを検討してください。
   - 総件数（`total`）の取得は別クエリで行い、パフォーマンスに注意してください。

5. **検索機能**:
   - `search` パラメータが指定された場合、タグ名の部分一致検索を実装してください。
   - 大文字・小文字を区別しない検索を実装してください（例：`LOWER(name) LIKE LOWER('%search%')`）。
   - 検索クエリのパフォーマンスに注意し、必要に応じて全文検索インデックスの使用を検討してください。

6. **ソート機能**:
   - `sort_by` と `sort_order` パラメータに基づいて適切なソートを実装してください。
   - SQL インジェクションを防ぐため、ソート項目は許可リストで検証してください。
   - `usage_count` でのソートは集計が必要なため、パフォーマンスに注意してください。

7. **日付フォーマット**:
   - すべての日時フィールド（created_at, updated_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

8. **エラーハンドリング**:
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
   - エラーメッセージにはセキュリティ上の機密情報（DB接続文字列など）を含めないよう注意してください。

9. **キャッシュ戦略**:
   - タグリストは頻繁に変更されない可能性があるため、適切なキャッシュ戦略を実装することでパフォーマンスを向上させることができます。
   - キャッシュの有効期限（TTL）を設定し、タグが更新された際にキャッシュを無効化する仕組みを検討してください。

10. **パフォーマンス考慮事項**:
    - 大量のタグがある場合は、ページネーションの実装が特に重要です。
    - `usage_count` の計算は重い操作になる可能性があるため、定期的に更新される別のカラムに保存することを検討してください。
    - レスポンスサイズが大きくなる場合は、圧縮を検討してください。
