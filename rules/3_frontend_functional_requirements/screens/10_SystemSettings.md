# システム設定画面仕様書

## 画面概要
システム全体の動作パラメータを設定するための画面です。Cronジョブの実行間隔、データ保持期間、ログレベルなど、システムの挙動に関わる細かい設定を管理します。管理者がシステムの動作を最適化し、リソース使用を調整するための高度な設定インターフェースを提供します。

## 画面レイアウト
```
+----------------------------------------------------------------------+
|  DigeClip > システム設定                                ユーザー名 ▼ |
+----------------------------------------------------------------------+
|                                                                      |
|  +-------------------------------------------------------------------+
|  | 基本設定                                                         |
|  +-------------------------------------------------------------------+
|  | システム名:                                                      |
|  | [DigeClip                                                      ] |
|  |                                                                  |
|  | タイムゾーン:                                                    |
|  | [Asia/Tokyo ▼]                                                   |
|  |                                                                  |
|  | 言語:                                                            |
|  | [日本語 ▼]                                                       |
|  +-------------------------------------------------------------------+
|                                                                      |
|  +-------------------------------------------------------------------+
|  | スケジュール設定                                                 |
|  +-------------------------------------------------------------------+
|  | コンテンツ収集間隔:                                              |
|  | [30 ▼] 分ごと                                                    |
|  |                                                                  |
|  | 要約処理実行間隔:                                                |
|  | [60 ▼] 分ごと                                                    |
|  |                                                                  |
|  | 通知送信間隔:                                                    |
|  | [120 ▼] 分ごと                                                   |
|  |                                                                  |
|  | メンテナンス実行時間:                                            |
|  | [03:00 ▼] (システム負荷の低い時間帯を推奨)                       |
|  +-------------------------------------------------------------------+
|                                                                      |
|  +-------------------------------------------------------------------+
|  | データ管理                                                       |
|  +-------------------------------------------------------------------+
|  | コンテンツ保持期間:                                              |
|  | [90 ▼] 日間                                                      |
|  |                                                                  |
|  | ログ保持期間:                                                    |
|  | [30 ▼] 日間                                                      |
|  |                                                                  |
|  | バックアップ頻度:                                                |
|  | [毎日 ▼]                                                         |
|  |                                                                  |
|  | バックアップ保持数:                                              |
|  | [7 ▼] 世代                                                       |
|  +-------------------------------------------------------------------+
|                                                                      |
|  +-------------------------------------------------------------------+
|  | ログ設定                                                         |
|  +-------------------------------------------------------------------+
|  | ログレベル:                                                      |
|  | [INFO ▼] (ERROR, WARN, INFO, DEBUG, TRACE)                       |
|  |                                                                  |
|  | API呼び出しログ:                                                 |
|  | (⚪) 有効  (⚫) 無効                                              |
|  |                                                                  |
|  | ユーザー操作ログ:                                                |
|  | (⚪) 有効  (⚫) 無効                                              |
|  +-------------------------------------------------------------------+
|                                                                      |
|  [デフォルト設定に戻す]                              [保存]          |
|                                                                      |
+----------------------------------------------------------------------+
```

## 機能要件
1. **基本設定**
   - システム名: システムの表示名
   - タイムゾーン: システム全体のタイムゾーン設定
   - 言語: インターフェース言語（将来の多言語対応用）

2. **スケジュール設定**
   - コンテンツ収集間隔: YouTubeやRSSからのデータ取得頻度
   - 要約処理実行間隔: AI要約処理の実行頻度
   - 通知送信間隔: Discord通知の送信頻度
   - メンテナンス実行時間: 日次メンテナンス処理の時刻

3. **データ管理**
   - コンテンツ保持期間: 古いコンテンツの自動削除期間
   - ログ保持期間: システムログの保持期間
   - バックアップ頻度: 自動バックアップの頻度
   - バックアップ保持数: 保持するバックアップの世代数

4. **ログ設定**
   - ログレベル: システムログの詳細度
   - API呼び出しログ: 外部API呼び出しの記録有無
   - ユーザー操作ログ: ユーザーアクションの記録有無

5. **設定管理**
   - 保存: 変更した設定を保存
   - デフォルト設定に戻す: 工場出荷時の設定に戻す

## バリデーション要件
1. **システム名**
   - 必須入力
   - 最大50文字

2. **タイムゾーン**
   - 必須選択
   - 有効なタイムゾーン値

3. **言語**
   - 必須選択
   - サポートされている言語コード

4. **間隔設定**
   - コンテンツ収集間隔: 5〜1440分（24時間）の整数
   - 要約処理実行間隔: 5〜1440分の整数
   - 通知送信間隔: 5〜1440分の整数
   - メンテナンス実行時間: 有効な時刻形式（HH:MM）

5. **保持期間**
   - コンテンツ保持期間: 1〜365日の整数
   - ログ保持期間: 1〜90日の整数
   - バックアップ保持数: 1〜30の整数

## エラーメッセージ
- 入力検証エラー:
  - 「システム名を入力してください」
  - 「タイムゾーンを選択してください」
  - 「言語を選択してください」
  - 「収集間隔は5〜1440分の範囲で指定してください」
  - 「要約処理間隔は5〜1440分の範囲で指定してください」
  - 「通知送信間隔は5〜1440分の範囲で指定してください」
  - 「有効な時刻形式で入力してください」
  - 「コンテンツ保持期間は1〜365日の範囲で指定してください」
  - 「ログ保持期間は1〜90日の範囲で指定してください」
  - 「バックアップ保持数は1〜30の範囲で指定してください」

- 操作エラー:
  - 「設定の保存に失敗しました」
  - 「デフォルト設定の復元に失敗しました」
  - 「設定の適用中にエラーが発生しました」
  - 「現在の設定値の取得に失敗しました」

## API連携
1. **システム設定取得API**
   - エンドポイント: `/api/system-settings`
   - メソッド: GET
   - レスポンス:
     ```json
     {
       "basic": {
         "systemName": "DigeClip",
         "timezone": "Asia/Tokyo",
         "language": "ja"
       },
       "schedule": {
         "contentCollectionInterval": 30,
         "summaryProcessInterval": 60,
         "notificationInterval": 120,
         "maintenanceTime": "03:00"
       },
       "data": {
         "contentRetentionDays": 90,
         "logRetentionDays": 30,
         "backupFrequency": "daily",
         "backupGenerations": 7
       },
       "logging": {
         "logLevel": "INFO",
         "apiCallLogging": true,
         "userActionLogging": true
       },
       "updatedAt": "2023-03-15T09:45:00Z"
     }
     ```

2. **システム設定更新API**
   - エンドポイント: `/api/system-settings`
   - メソッド: PUT
   - リクエストボディ: 更新する設定オブジェクト
   - レスポンス: 更新された設定オブジェクト

3. **デフォルト設定復元API**
   - エンドポイント: `/api/system-settings/reset`
   - メソッド: POST
   - レスポンス: リセットされた設定オブジェクト

4. **システムステータス取得API**（オプション）
   - エンドポイント: `/api/system-status`
   - メソッド: GET
   - レスポンス:
     ```json
     {
       "status": "healthy",
       "lastCronRun": "2023-03-15T14:30:00Z",
       "diskUsage": {
         "total": 100000000000,
         "used": 25000000000,
         "free": 75000000000
       },
       "databaseSize": 500000000
     }
     ```

## UI/UX考慮事項
1. **セクション分け**
   - 論理的なグループ分けで設定を整理
   - 折りたたみ可能なセクション（オプション）

2. **設定説明**
   - 各設定項目の横に簡潔な説明
   - 詳細な説明はツールチップで表示

3. **入力補助**
   - 数値入力には適切な単位表示
   - スライダーと数値入力の併用（オプション）
   - プリセット値の提供

4. **変更表示**
   - 変更された設定は視覚的に強調
   - 保存前に変更概要を表示（オプション）

5. **アクセシビリティ**
   - キーボード操作のサポート
   - スクリーンリーダー対応
   - 適切なラベルとARIA属性の使用

## 実装上の注意事項
1. **設定の適用**
   - 一部設定は即時適用、一部は再起動後に適用など、適用タイミングを明示
   - 重要な設定変更時は確認ダイアログを表示

2. **パフォーマンス影響**
   - 設定変更がシステムパフォーマンスに与える影響を説明
   - リソース使用量に大きく影響する設定には警告表示

3. **設定の検証**
   - フロントエンドとバックエンドの両方でバリデーション
   - 設定間の依存関係や矛盾のチェック

4. **設定の永続化**
   - 設定はデータベースに保存
   - 設定変更履歴の記録（監査目的）

5. **権限管理**
   - システム設定へのアクセスは管理者ロールのみに制限
   - 特に重要な設定は特権管理者のみ変更可能（オプション）

6. **テスト**
   - 各設定項目の変更テスト
   - 極端な値での動作確認
   - 設定リセット機能のテスト