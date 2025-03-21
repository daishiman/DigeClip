# パスワードリセットリクエスト API

- **HTTPメソッド**: `POST`
- **エンドポイント**: `/api/auth/reset-password`
- **機能概要**: ユーザーが「パスワードを忘れた」際、メールでリセットリンクを送るなど
- **認証要否**: **不要**(guest)

## リクエスト

**Request**: `IAuthResetPasswordRequest`
```ts
export interface IAuthResetPasswordRequest {
  email: string;
}
```

**例 (リクエストJSON)**
```jsonc
{
  "email": "john@example.com"
}
```

## レスポンス

**Response**: `IAuthResetPasswordResponse`
```ts
export interface IAuthResetPasswordResponse {
  message: string;
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "message": "Password reset link sent to john@example.com"
}
```

## エラー

**Error**: e.g. `404 Not Found` (メール未登録)
```jsonc
{
  "error": {
    "code": "E4041",
    "message": "Email not found in system"
  }
}
```

## 実装上の注意事項

1. **入力検証**:
   - `email` フィールドが有効なメールアドレス形式であることを確認してください。
   - 入力が無効な場合は、適切なエラーメッセージと共に `400 Bad Request` を返してください。

2. **ユーザー存在確認**:
   - 指定されたメールアドレスに対応するユーザーが存在するか確認してください。
   - 存在しない場合は `404 Not Found` エラーを返してください。
   - ただし、セキュリティ上の理由から、メールアドレスが存在しない場合でも成功レスポンスを返すことを検討してください（情報漏洩防止のため）。

3. **リセットトークンの生成**:
   - 安全でランダムな一意のリセットトークンを生成してください（例：UUID v4 + ランダム文字列）。
   - トークンの有効期限を設定してください（例：24時間）。
   - トークンとその有効期限をデータベースに保存してください（ユーザーレコードに関連付けて）。
   - 既存のリセットトークンがある場合は、新しいトークンで上書きしてください。

4. **リセットリンクの作成**:
   - リセットトークンを含むパスワードリセットページへのリンクを作成してください。
   - リンク例: `https://example.com/reset-password?token=abc123def456`
   - リンクにはトークンだけでなく、ユーザーIDやメールアドレスのハッシュなど、追加の検証情報を含めることを検討してください。

5. **メール送信**:
   - リセットリンクを含むメールをユーザーに送信してください。
   - メールには以下の情報を含めてください:
     - パスワードリセットリンク
     - リンクの有効期限
     - リセットをリクエストしていない場合の連絡先
   - メール送信エラーを適切に処理し、ログに記録してください。
   - HTMLとプレーンテキストの両方の形式でメールを送信することを検討してください。

6. **レート制限**:
   - 同一メールアドレスまたは同一IPアドレスからの連続リセットリクエストを制限してください。
   - 制限に達した場合は、一時的な待機時間を設けるか、`429 Too Many Requests` エラーを返してください。
   - これにより、パスワードリセット機能を悪用した攻撃（メールボム等）を防止できます。

7. **ログ記録**:
   - パスワードリセットリクエストを記録してください。
   - ログには少なくとも、タイムスタンプ、IPアドレス、リクエストされたメールアドレス（個人情報保護に注意）を含めてください。
   - 成功したメール送信と失敗したメール送信を区別して記録してください。

8. **セキュリティ考慮事項**:
   - リセットトークンは十分な長さと複雑さを持つようにしてください（最低64ビットのエントロピー）。
   - トークンの有効期限は短く設定してください（24時間以内が推奨）。
   - 一度使用されたトークンは即座に無効化してください。
   - 複数回失敗したトークン検証の試行を検出し、必要に応じてトークンを無効化してください。

9. **エラーハンドリング**:
   - メール送信サービスの障害など、内部エラーが発生した場合は `500 Internal Server Error` を返し、詳細なエラーログを記録してください。
   - エラーメッセージにはセキュリティ上の機密情報を含めないよう注意してください。

10. **フロントエンド連携**:
    - フロントエンドアプリケーションと連携して、リセットリンクがクリックされた際の処理を実装してください。
    - リセットリンクは新しいパスワード入力フォームに誘導し、トークンを検証するための別のAPIエンドポイント（例：`/api/auth/verify-reset-token`）を呼び出すようにしてください。

11. **新しいパスワード設定API**:
    - パスワードリセットプロセスを完了するための別のAPIエンドポイント（例：`/api/auth/set-new-password`）を実装してください。
    - このAPIでは、リセットトークンと新しいパスワードを受け取り、検証後にパスワードを更新します。

12. **通知**:
    - パスワードが正常に変更された後、確認メールをユーザーに送信することを検討してください。
    - これにより、ユーザーは不正なパスワード変更に気付くことができます。