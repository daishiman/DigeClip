# コンテンツ一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/user/contents`
- **機能概要**: ユーザー向けにコンテンツの一覧を取得（フィルタリング可能）
- **認証要否**: **要**(user/admin)

## リクエスト

**Request Query**:
```ts
export interface IUserGetContentsQuery {
  page?: number;
  pageSize?: number;
  tag?: string;        // タグ絞り込み
  source?: string;     // "youtube" / "rss" / "arxiv"
}
```

**例**
```
GET /api/user/contents?page=2&pageSize=10&tag=AI
```

## レスポンス

**Response**:
```ts
export interface IContentItem {
  id: number;
  title: string;
  url: string;
  published_at?: string;
  metadata?: {
    thumbnail?: string;
    [key: string]: any;
  };
  tags: string[];
  status: string; // "summarized" / "pending" / "error"
}

export interface IUserGetContentsResponse {
  data: IContentItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "data": [
    {
      "id": 42,
      "title": "AIの最新動向 2025年版",
      "url": "https://www.youtube.com/watch?v=abc123",
      "published_at": "2025-03-10T14:30:00Z",
      "metadata": {
        "thumbnail": "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
        "duration": 1234
      },
      "tags": ["AI", "テクノロジー"],
      "status": "summarized"
    },
    {
      "id": 43,
      "title": "新しいプログラミング言語の解説",
      "url": "https://www.youtube.com/watch?v=def456",
      "published_at": "2025-03-09T10:15:00Z",
      "metadata": {
        "thumbnail": "https://i.ytimg.com/vi/def456/maxresdefault.jpg",
        "duration": 987
      },
      "tags": ["プログラミング"],
      "status": "summarized"
    }
  ],
  "pagination": {
    "page": 2,
    "pageSize": 10,
    "total": 42
  }
}
```

## エラー

**Error**: e.g. `401 Unauthorized` (認証エラー)
```jsonc
{
  "error": {
    "code": "E4010",
    "message": "Authentication required"
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - リクエスト処理前に必ず認証トークンを検証してください。
   - 無効なトークンや期限切れのトークンの場合は、`401 Unauthorized` エラーを返してください。
   - ユーザーが自分のコンテンツのみにアクセスできるように、認証されたユーザーIDに基づいてデータをフィルタリングしてください。

2. **クエリパラメータの検証**:
   - `page` と `pageSize` は正の整数であることを確認してください。
   - `page` のデフォルト値は 1 とし、`pageSize` のデフォルト値は適切な値（例：20）に設定してください。
   - `pageSize` には最大値（例：100）を設定し、大量のデータ取得によるパフォーマンス問題を防止してください。
   - `tag` と `source` が指定された場合、有効な値であることを確認してください。
   - 無効なパラメータが指定された場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **データベースアクセス**:
   - コンテンツデータは `contents` テーブルから取得し、ユーザーIDでフィルタリングしてください。
   - タグによるフィルタリングは、`content_tags` テーブルと `tags` テーブルを結合して行ってください。
   - ソースによるフィルタリングは、`contents` テーブルの `type` 列を使用してください（スキーマ設計では `source_type` ではなく `type` が定義されています）。
   - パフォーマンスを考慮し、必要に応じてインデックスを作成してください（特に `user_id`, `type`, `status` 列）。

4. **ページネーション実装**:
   - オフセットベースのページネーションを実装してください（例：`OFFSET (page - 1) * pageSize LIMIT pageSize`）。
   - 大量のデータがある場合は、カーソルベースのページネーションを検討してください。
   - 総件数（`total`）の取得は別クエリで行い、パフォーマンスに注意してください。

5. **タグ情報の取得**:
   - 各コンテンツのタグ情報は、`content_tags` テーブルと `tags` テーブルを結合して取得してください。
   - N+1クエリ問題を避けるため、一度のクエリで複数のコンテンツのタグを取得することを検討してください。

6. **メタデータの処理**:
   - メタデータは `metadata` カラムにJSONBとして保存されています。データベースから取得後、適切にパースしてください。
   - メタデータのスキーマはソースタイプによって異なる可能性があるため、柔軟な処理を実装してください。
   - クライアントに返すメタデータは、必要最小限の情報に制限することを検討してください（特に大きなメタデータの場合）。

7. **日付フォーマット**:
   - すべての日時フィールド（published_at）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

8. **ステータスフィルタリング**:
   - デフォルトでは、ステータスが "summarized" のコンテンツのみを返すことを検討してください。
   - 必要に応じて、ステータスによるフィルタリングをクエリパラメータとして追加することも検討してください。

9. **パフォーマンス最適化**:
   - 大量のコンテンツがある場合、クエリのパフォーマンスに注意してください。
   - 必要に応じて、以下の最適化を検討してください:
     - 必要なカラムのみを選択する（SELECT *の使用を避ける）
     - 適切なインデックスを使用する
     - 結果をキャッシュする（短時間のTTLで）

10. **エラーハンドリング**:
    - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
    - エラーメッセージにはセキュリティ上の機密情報を含めないよう注意してください。

11. **セキュリティ考慮事項**:
    - SQLインジェクションを防ぐため、パラメータ化クエリを使用してください。
    - クロスサイトスクリプティング（XSS）攻撃を防ぐため、レスポンスデータを適切にエスケープしてください。

12. **レスポンスサイズの制限**:
    - レスポンスサイズが大きくなりすぎないよう、`pageSize` の最大値を適切に設定してください。
    - 必要に応じて、レスポンスの圧縮を検討してください。

13. **ユーザーとコンテンツの関連付け**:
    - スキーマ設計では `contents` テーブルに `user_id` カラムが明示的に定義されていないため、コンテンツとユーザーの関連付けを適切に管理するための追加テーブルまたはカラムを検討してください。
    - 例えば、`user_contents` という中間テーブルを作成するか、`contents` テーブルに `user_id` カラムを追加することを検討してください。