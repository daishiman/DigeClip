# API 共通仕様

## 1. ディレクトリ構成 (Next.js 例)

```
/api
  ├─ /auth
  │    ├─ google-callback.ts
  │    ├─ login.ts
  │    ├─ logout.ts
  │    ├─ register.ts
  │    ├─ reset-password.ts
  │    └─ change-password.ts
  ├─ /user
  │    ├─ contents
  │    ├─ tags
  │    ├─ system
  │    └─ ...
  └─ /admin
       ├─ sources
       ├─ contents
       ├─ ai-models
       ├─ notifications
       ├─ tags
       ├─ system
       └─ ...
```

1. **`/api/auth`** : 認証関連 (JWT/Google OAuth 用のエンドポイント)
2. **`/api/user`** : 一般ユーザーが利用する機能
3. **`/api/admin`** : 管理者のみが操作する機能

## 2. 認証・認可 概要

- **JWT** : メール & パスワードで登録/login するユーザー向け
  - ログイン成功時に JWT を発行し、Cookie もしくは `Authorization: Bearer <token>` で利用
  - ログインフロー:
    1. **Googleログイン** or **email+pwログイン**
    2. APIが認証成功 → JWT発行 → Cookie/LocalStorage 保存
    3. 以後 `/api/user/...` など呼び出し時、JWTを付与 → ミドルウェア検証 → `role=user` ならOK
    4. `/api/admin/...` は `role=admin` のみ可
- **Googleアカウント OAuth** : ボタン押下 → `/api/auth/google-callback` にコールバック → 成功時にログインセッション確立
  - 同様に JWT を発行し、内部的に userId & googleId を紐づける
- **未ログイン(guest)** : コンテンツの一部閲覧のみ可能(必要なら)

**ログインフロー**:
1. **Googleログイン** or **email+pwログイン**
2. APIが認証成功 → JWT発行 → Cookie/LocalStorage 保存
3. 以後 `/api/user/...` など呼び出し時、JWTを付与 → ミドルウェア検証 → `role=user` ならOK
4. `/api/admin/...` は `role=admin` のみ可

**ログアウト**:
- Cookie削除 or JWT 無効化(サーバ側でブラックリスト管理 or 短い有効期限+リフレッシュトークン管理)

## 3. Request/Response 共通仕様

### 3.1 認証(HTTP Header)

- **Authorization** : `Bearer <JWT>`
  - 例: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3.2 エラーレスポンス

- フォーマット
```jsonc
{
  "error": {
    "code": "E400x",          // 一意のエラーコード
    "message": "Description", // ユーザーに伝えるエラーメッセージ
    "details": { }            // 任意の追加情報
  }
}
```
- HTTPステータス: 4xx / 5xx を適切に返す。

### 3.3 ロール判定

- JWTペイロードに `role: "admin"|"user"` を含める
- **Next.js ミドルウェア**で `/api/admin/` にアクセス時は `role==="admin"` か検証