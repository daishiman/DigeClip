# ソースエクスポート API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/sources/export`
- **機能概要**: ソース情報をCSVまたはJSONファイルとしてエクスポート
- **認証要否**: **要**(admin)

## リクエスト

**Request**: クエリパラメータ
- `format`: エクスポート形式（`csv` または `json`、デフォルト: `json`）
- `filter`: フィルター条件（例: `{"type":"rss","active":true}`）
- `include_stats`: 統計情報を含めるかどうか（`true` または `false`、デフォルト: `false`）

**例**
```
GET /api/admin/sources/export?format=csv&filter={"type":"rss"}&include_stats=true
```

## レスポンス

**Response**: ファイルダウンロード
- Content-Type: `text/csv` または `application/json`
- Content-Disposition: `attachment; filename="sources_export_YYYY-MM-DD.csv"` または `attachment; filename="sources_export_YYYY-MM-DD.json"`

**CSVファイル形式例**
```
id,name,type,url,feed_url,active,created_at,updated_at
1,テックニュースブログ,rss,https://example.com/tech-blog,https://example.com/tech-blog/feed,true,2023-06-15T09:30:00Z,2023-06-15T09:30:00Z
2,AIリサーチチャンネル,youtube,https://youtube.com/channel/ai-research,,true,2023-06-14T14:20:00Z,2023-06-14T14:20:00Z
```

**JSONファイル形式例**
```jsonc
[
  {
    "id": 1,
    "name": "テックニュースブログ",
    "type": "rss",
    "url": "https://example.com/tech-blog",
    "feed_url": "https://example.com/tech-blog/feed",
    "active": true,
    "created_at": "2023-06-15T09:30:00Z",
    "updated_at": "2023-06-15T09:30:00Z",
    "stats": {
      "content_count": 156,
      "last_content_date": "2023-06-15T08:45:00Z"
    }
  },
  {
    "id": 2,
    "name": "AIリサーチチャンネル",
    "type": "youtube",
    "url": "https://youtube.com/channel/ai-research",
    "feed_url": null,
    "active": true,
    "created_at": "2023-06-14T14:20:00Z",
    "updated_at": "2023-06-14T14:20:00Z",
    "stats": {
      "content_count": 42,
      "last_content_date": "2023-06-14T18:30:00Z"
    }
  }
]
```

## エラー

**Error**: e.g. `400 Bad Request` (無効なフォーマット)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid format. Must be one of: csv, json"
  }
}
```

**Error**: e.g. `400 Bad Request` (無効なフィルター)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid filter format. Must be a valid JSON object"
  }
}
```