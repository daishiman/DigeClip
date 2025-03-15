# 認証系 API ( `/api/auth/...` )

認証関連のエンドポイントを提供します。ユーザー登録、ログイン、ログアウト、パスワード管理などの機能を含みます。

## API一覧

| エンドポイント | メソッド | 説明 | 認証要否 |
|--------------|---------|------|---------|
| [/api/auth/register](./register.md) | POST | ユーザー登録 | 不要(guest) |
| [/api/auth/login](./login.md) | POST | メール&パスワードログイン | 不要(guest) |
| [/api/auth/google-callback](./google-callback.md) | GET | Google OAuth ログイン | 不要(guest) |
| [/api/auth/logout](./logout.md) | POST | ログアウト | 要(user/admin) |
| [/api/auth/reset-password](./reset-password.md) | POST | パスワードリセットリクエスト | 不要(guest) |
| [/api/auth/change-password](./change-password.md) | POST | パスワード変更 | 要(user/admin) |