# システムステータス取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/admin/system/status`
- **機能概要**: システムの現在の状態と統計情報を取得
- **認証要否**: **要**(admin)

## リクエスト

**Query Parameters**:
- `include`: 含める情報（カンマ区切りで複数指定可）
  - `all`: すべての情報を含める（デフォルト）
  - `system`: システム基本情報のみ
  - `contents`: コンテンツ統計のみ
  - `sources`: ソース統計のみ
  - `ai`: AI使用統計のみ
  - `users`: ユーザー統計のみ

## レスポンス

**Response**: `IAdminGetSystemStatusResponse`
```ts
export interface IAdminGetSystemStatusResponse {
  system: {
    status: "healthy" | "degraded" | "maintenance";
    version: string;
    uptime: number; // 秒単位
    last_backup: string;
    environment: string;
    current_time: string;
  };
  contents?: {
    total: number;
    by_status: {
      pending: number;
      summarized: number;
      error: number;
    };
    by_type: {
      video: number;
      article: number;
      paper: number;
      other: number;
    };
    recent_activity: {
      last_24h: number;
      last_7d: number;
      last_30d: number;
    };
  };
  sources?: {
    total: number;
    active: number;
    by_type: {
      rss: number;
      youtube: number;
      twitter: number;
      custom: number;
    };
    sync_status: {
      up_to_date: number;
      needs_sync: number;
      error: number;
    };
  };
  ai?: {
    models: {
      id: number;
      name: string;
      requests_count: number;
      tokens_used: number;
      average_response_time: number;
    }[];
    total_tokens: number;
    estimated_cost: number;
  };
  users?: {
    total: number;
    active_last_30d: number;
    by_role: {
      admin: number;
      user: number;
    };
  };
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "system": {
    "status": "healthy",
    "version": "1.2.3",
    "uptime": 1209600,
    "last_backup": "2025-03-14T03:00:00Z",
    "environment": "production",
    "current_time": "2025-03-15T12:30:45Z"
  },
  "contents": {
    "total": 1250,
    "by_status": {
      "pending": 15,
      "summarized": 1200,
      "error": 35
    },
    "by_type": {
      "video": 450,
      "article": 720,
      "paper": 50,
      "other": 30
    },
    "recent_activity": {
      "last_24h": 42,
      "last_7d": 180,
      "last_30d": 520
    }
  },
  "sources": {
    "total": 25,
    "active": 22,
    "by_type": {
      "rss": 15,
      "youtube": 8,
      "twitter": 2,
      "custom": 0
    },
    "sync_status": {
      "up_to_date": 20,
      "needs_sync": 2,
      "error": 3
    }
  },
  "ai": {
    "models": [
      {
        "id": 1,
        "name": "GPT-4",
        "requests_count": 3500,
        "tokens_used": 7500000,
        "average_response_time": 2.8
      },
      {
        "id": 2,
        "name": "Claude 3 Opus",
        "requests_count": 1250,
        "tokens_used": 3750000,
        "average_response_time": 2.3
      }
    ],
    "total_tokens": 11250000,
    "estimated_cost": 225.5
  },
  "users": {
    "total": 150,
    "active_last_30d": 120,
    "by_role": {
      "admin": 5,
      "user": 145
    }
  }
}
```

## エラー

**Error**: e.g. `400 Bad Request`
```jsonc
{
  "error": {
    "code": "E4001",
    "message": "Invalid include parameter",
    "details": {
      "include": "Unknown value: 'invalid_section'"
    }
  }
}
```

## 実装上の注意事項

1. **認証・認可**:
   - 管理者権限を持つユーザーのみアクセス可能なエンドポイントです。
   - リクエスト処理前に必ず認証トークンを検証し、管理者権限を確認してください。

2. **クエリパラメータの検証**:
   - `include` パラメータが指定された場合、有効な値（"all", "system", "contents", "sources", "ai", "users"）であることを確認してください。
   - 無効な値が含まれる場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

3. **パフォーマンス最適化**:
   - このAPIは複数のテーブルから集計データを取得するため、クエリのパフォーマンスに注意してください。
   - 特に大量のデータがある場合、集計クエリが重くなる可能性があります。
   - 必要に応じて、以下の最適化を検討してください:
     - 集計データをキャッシュする
     - 定期的にバックグラウンドジョブで集計を更新する
     - `include` パラメータに基づいて必要な集計のみを実行する
     - 大規模なテーブルに対しては、近似集計を使用する

4. **システム状態の判定**:
   - `system.status` の値（"healthy", "degraded", "maintenance"）は、以下のような基準で判断してください:
     - "healthy": すべてのサービスが正常に動作している
     - "degraded": 一部のサービスに問題があるが、システム全体は動作している
     - "maintenance": 計画的なメンテナンス中
   - 状態判定のロジックを明確に定義し、一貫して実装してください。

5. **バージョン情報**:
   - `system.version` はアプリケーションのバージョンを返します。
   - 環境変数やビルド時に設定された値を使用するか、パッケージ情報から取得してください。

6. **稼働時間の計算**:
   - `system.uptime` はサーバーの稼働時間を秒単位で返します。
   - アプリケーションの起動時刻を記録し、現在時刻との差分を計算してください。
   - サーバーレス環境では、この値が意味を持たない場合があります。その場合は、最後のデプロイからの経過時間などの代替値を検討してください。

7. **日付フォーマット**:
   - すべての日時フィールド（last_backup, current_time）は ISO 8601 形式（YYYY-MM-DDThh:mm:ssZ）で返してください。
   - タイムゾーンは UTC を使用してください。

8. **コンテンツ統計**:
   - `contents` セクションの統計情報は、`contents` テーブルから集計します。
   - 状態別、タイプ別の集計には GROUP BY クエリを使用してください。
   - 最近のアクティビティは、created_at または updated_at フィールドに基づいて計算してください。

9. **ソース統計**:
   - `sources` セクションの統計情報は、`sources` テーブルから集計します。
   - アクティブなソースは、`active` フラグまたは最終同期日時に基づいて判断してください。
   - 同期ステータスは、最終同期日時と同期間隔の設定に基づいて計算してください。

10. **AI使用統計**:
    - `ai` セクションの統計情報は、`ai_models` テーブルと使用ログから集計します。
    - トークン使用量とコスト見積もりは、記録された使用履歴に基づいて計算してください。
    - コスト計算には、各モデルの料金設定を考慮してください。

11. **ユーザー統計**:
    - `users` セクションの統計情報は、`users` テーブルから集計します。
    - アクティブユーザー数は、最終ログイン日時に基づいて計算してください。

12. **エラーハンドリング**:
    - データベース接続エラーなどの内部エラーは `500 Internal Server Error` として処理し、詳細なエラーログを記録してください。
    - 一部の統計情報の取得に失敗した場合でも、可能な限り他の情報は返すようにしてください。

13. **キャッシュ戦略**:
    - このAPIは頻繁に呼び出される可能性があり、計算コストが高いため、適切なキャッシュ戦略を実装することを強く推奨します。
    - キャッシュの有効期限（TTL）を設定し、定期的に更新するようにしてください（例：5分間隔）。
    - 特定のイベント（新しいコンテンツの追加、ソースの更新など）が発生した場合にキャッシュを無効化することも検討してください。

14. **セキュリティ考慮事項**:
    - このAPIは管理者向けの機密情報を含むため、適切な認証と認可を徹底してください。
    - レスポンスには機密情報（APIキー、パスワードなど）を含めないでください。