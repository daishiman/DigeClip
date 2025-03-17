# ソースインポート API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/admin/sources/import`
- **機能概要**: CSVまたはJSONファイルからソースを一括インポート
- **認証要否**: **要**(admin)

## リクエスト

**Request**: `multipart/form-data`
- `file`: CSVまたはJSONファイル
- `options`: インポートオプション（JSON文字列）

**インポートオプション**
```ts
export interface IAdminSourceImportOptions {
  skip_validation?: boolean;
  update_existing?: boolean;
  default_active_state?: boolean;
}
```

**CSVファイル形式例**
```
name,type,url,feed_url,active
テックニュースブログ,rss,https://example.com/tech-blog,https://example.com/tech-blog/feed,true
AIリサーチチャンネル,youtube,https://youtube.com/channel/ai-research,,true
```

**JSONファイル形式例**
```jsonc
[
  {
    "name": "テックニュースブログ",
    "type": "rss",
    "url": "https://example.com/tech-blog",
    "feed_url": "https://example.com/tech-blog/feed",
    "active": true
  },
  {
    "name": "AIリサーチチャンネル",
    "type": "youtube",
    "url": "https://youtube.com/channel/ai-research",
    "active": true
  }
]
```

## レスポンス

**Response**: `IAdminSourceImportResponse`
```ts
export interface IAdminSourceImportResponse {
  message: string;
  import_results: {
    total: number;
    imported: number;
    updated: number;
    skipped: number;
    failed: number;
    errors: {
      row: number;
      message: string;
    }[];
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Import completed",
  "import_results": {
    "total": 10,
    "imported": 8,
    "updated": 0,
    "skipped": 0,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "message": "Invalid URL format"
      },
      {
        "row": 7,
        "message": "Missing required field: name"
      }
    ]
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request` (ファイルが提供されていない)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "No file provided"
  }
}
```

**Error**: e.g. `400 Bad Request` (サポートされていないファイル形式)
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Unsupported file format. Only CSV and JSON are supported"
  }
}
```