# 管理者ロール API ( `/api/admin/...` )

管理者が利用する機能のエンドポイントを提供します。ソース管理、コンテンツ管理、AIモデル管理、通知履歴管理、タグ管理、システム設定管理などの機能を含みます。

## API一覧

### ソース管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/sources](./sources/list.md) | GET | ソース一覧取得 | 要(admin) |
| [/api/admin/sources](./sources/create.md) | POST | ソース追加 | 要(admin) |
| [/api/admin/sources/[id]](./sources/detail.md) | GET | ソース詳細取得 | 要(admin) |
| [/api/admin/sources/[id]](./sources/update.md) | PUT | ソース更新 | 要(admin) |
| [/api/admin/sources/[id]](./sources/delete.md) | DELETE | ソース削除 | 要(admin) |

### コンテンツ管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/contents](./contents/list.md) | GET | コンテンツ一覧取得 | 要(admin) |
| [/api/admin/contents/[id]](./contents/detail.md) | GET | コンテンツ詳細取得 | 要(admin) |
| [/api/admin/contents/[id]](./contents/delete.md) | DELETE | コンテンツ削除 | 要(admin) |
| [/api/admin/contents/[id]/reprocess](./contents/reprocess.md) | POST | コンテンツ再処理 | 要(admin) |

### AIモデル管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/ai-models](./ai-models/list.md) | GET | AIモデル一覧取得 | 要(admin) |
| [/api/admin/ai-models](./ai-models/create.md) | POST | AIモデル追加 | 要(admin) |
| [/api/admin/ai-models/[id]](./ai-models/detail.md) | GET | AIモデル詳細取得 | 要(admin) |
| [/api/admin/ai-models/[id]](./ai-models/update.md) | PUT | AIモデル更新 | 要(admin) |
| [/api/admin/ai-models/[id]](./ai-models/delete.md) | DELETE | AIモデル削除 | 要(admin) |

### 通知履歴管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/notifications](./notifications/list.md) | GET | 通知履歴一覧取得 | 要(admin) |
| [/api/admin/notifications/test](./notifications/test.md) | POST | 通知テスト送信 | 要(admin) |

### タグ管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/tags](./tags/list.md) | GET | タグ一覧取得 | 要(admin) |
| [/api/admin/tags](./tags/create.md) | POST | タグ作成 | 要(admin) |
| [/api/admin/tags/[id]](./tags/update.md) | PUT | タグ更新 | 要(admin) |
| [/api/admin/tags/[id]](./tags/delete.md) | DELETE | タグ削除 | 要(admin) |

### システム設定管理

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/admin/system/status](./system/status.md) | GET | システム状態取得 | 要(admin) |
| [/api/admin/system/run-monitor](./system/run-monitor.md) | POST | 監視処理手動実行 | 要(admin) |
| [/api/admin/system/settings](./system/get-settings.md) | GET | アプリケーション設定取得 | 要(admin) |
| [/api/admin/system/settings](./system/update-settings.md) | PUT | アプリケーション設定更新 | 要(admin) |