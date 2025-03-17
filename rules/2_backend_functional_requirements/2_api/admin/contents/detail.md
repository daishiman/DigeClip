# コンテンツ詳細取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/contents/[id]`
- **機能概要**: 特定のコンテンツの詳細情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Request**: パスパラメータとして `id` を含む

## レスポンス

**Response**: `IAdminGetContentDetailResponse`
```ts
export interface ISummaryDetail {
  id: number;
  ai_model_id: number;
  ai_model_name: string;
  stage: string;
  summary_text: string;
  tokens_used?: number;
  processing_time?: number;
  created_at: string;
}

export interface INotificationDetail {
  id: number;
  destination: string;
  status: "success" | "failed";
  error_message?: string;
  sent_at: string;
}

export interface IAdminGetContentDetailResponse {
  id: number;
  source_id: number;
  source_name: string;
  title: string;
  url: string;
  type: "video" | "article" | "paper" | "other";
  published_at?: string;
  raw_text: string; // 管理者は全文を取得可能
  metadata?: Record<string, any>;
  status: "pending" | "summarized" | "error";
  error_message?: string;
  tags: string[];
  summaries: ISummaryDetail[];
  notifications: INotificationDetail[];
  created_at: string;
  updated_at: string;
  processing_history?: {
    detection_time: string;
    text_extraction_time?: string;
    summarization_time?: string;
    notification_time?: string;
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "id": 42,
  "source_id": 1,
  "source_name": "テックチャンネル",
  "title": "AIの最新動向 2025年版",
  "url": "https://www.youtube.com/watch?v=abc123",
  "type": "video",
  "published_at": "2025-03-10T14:30:00Z",
  "raw_text": "本日は2025年のAI業界の最新動向についてお話しします。まず初めに、生成AIの進化について...(全文)...",
  "metadata": {
    "thumbnail": "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
    "duration": 1234,
    "views": 5000,
    "channel_id": "UC12345"
  },
  "status": "summarized",
  "tags": ["AI", "テクノロジー"],
  "summaries": [
    {
      "id": 101,
      "ai_model_id": 1,
      "ai_model_name": "GPT-4",
      "stage": "overview",
      "summary_text": "この動画は2025年におけるAI業界の主要な発展について解説している。特に生成AIの進化、自律システムの普及、倫理的枠組みの標準化について重点的に触れている。",
      "tokens_used": 120,
      "processing_time": 2.3,
      "created_at": "2025-03-10T14:50:00Z"
    },
    {
      "id": 102,
      "ai_model_id": 1,
      "ai_model_name": "GPT-4",
      "stage": "detail",
      "summary_text": "1. 生成AIの進化: マルチモーダルモデルが標準となり...(省略)...\n2. 自律システムの普及: 家庭用ロボットの普及率が先進国で20%を突破...(省略)...\n3. 倫理的枠組み: ISO/IEC 42001がグローバルスタンダードとして...(省略)...",
      "tokens_used": 450,
      "processing_time": 5.1,
      "created_at": "2025-03-10T14:51:00Z"
    }
  ],
  "notifications": [
    {
      "id": 201,
      "destination": "Discord Webhook #tech-news",
      "status": "success",
      "sent_at": "2025-03-10T15:00:00Z"
    }
  ],
  "created_at": "2025-03-10T14:45:00Z",
  "updated_at": "2025-03-10T15:00:00Z",
  "processing_history": {
    "detection_time": "2025-03-10T14:45:00Z",
    "text_extraction_time": "2025-03-10T14:48:00Z",
    "summarization_time": "2025-03-10T14:51:00Z",
    "notification_time": "2025-03-10T15:00:00Z"
  }
}
```

## エラー

**Error**: e.g. `404 Not Found` (コンテンツが見つからない)
```jsonc
{
  "error": {
    "code": "E4042",
    "message": "Content not found"
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

3. **データベースアクセス**:
   - コンテンツ情報の取得には複数のテーブル結合が必要です（contents, sources, summaries, notifications, tags）。
   - パフォーマンスを考慮し、必要に応じてクエリを最適化してください。
   - 大量のテキストデータ（raw_text）を含むため、レスポンスサイズに注意してください。

4. **エラーハンドリング**:
   - コンテンツが存在しない場合は `404 Not Found` を返してください。
   - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。

5. **日付フォーマット**:
   - すべての日時フィールドは ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

6. **セキュリティ考慮事項**:
   - raw_text フィールドには機密情報が含まれる可能性があるため、適切なアクセス制御を実装してください。
   - レスポンスにXSS攻撃の可能性があるコンテンツが含まれる場合は、適切にエスケープ処理を行ってください。

7. **パフォーマンス**:
   - 大量のデータを返す可能性があるため、必要に応じてレスポンスの圧縮を検討してください。
   - summaries や notifications が多数ある場合は、ページネーションの実装を検討してください。