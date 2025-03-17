# ユーザーロール API ( `/api/user/...` )

一般ユーザーが利用する機能のエンドポイントを提供します。コンテンツの閲覧、タグ管理、システム状態確認などの機能を含みます。

## API一覧

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/user/contents](./contents/list.md) | GET | コンテンツ一覧取得 | 要(user/admin) |
| [/api/user/contents/[id]](./contents/detail.md) | GET | コンテンツ詳細取得 | 要(user/admin) |
| [/api/user/contents/[id]/tags](./contents/add-tag.md) | POST | タグ追加 | 要(user/admin) |
| [/api/user/contents/[id]/tags/[tagName]](./contents/delete-tag.md) | DELETE | タグ削除 | 要(user/admin) |
| [/api/user/tags](./tags/list.md) | GET | タグ一覧取得 | 要(user/admin) |
| [/api/user/system/status](./system/status.md) | GET | システム状態取得 | 要(user/admin) |