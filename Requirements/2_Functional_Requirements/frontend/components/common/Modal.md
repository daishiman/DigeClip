# モーダルコンポーネント仕様

## 概要
モーダルコンポーネントは、アプリケーション全体で使用される再利用可能なモーダルダイアログを提供します。フォーム、確認ダイアログ、詳細表示など様々な用途に対応し、アクセシビリティに配慮した実装を行います。

## コンポーネント構造
```
Modal
├── Backdrop (背景オーバーレイ)
└── ModalContainer
    ├── ModalHeader
    │   ├── Title
    │   └── CloseButton
    ├── ModalBody (children)
    └── ModalFooter (オプション)
        ├── CancelButton (オプション)
        └── ActionButton (オプション)
```

## プロパティ
```typescript
interface ModalProps {
  // モーダルの表示状態
  isOpen: boolean;

  // モーダルを閉じる関数
  onClose: () => void;

  // モーダルのタイトル
  title: string;

  // モーダルの内容（ReactNode）
  children: React.ReactNode;

  // モーダルのサイズ
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  // フッターの表示有無
  showFooter?: boolean;

  // キャンセルボタンのテキスト（showFooterがtrueの場合のみ有効）
  cancelText?: string;

  // アクションボタンのテキスト（showFooterがtrueの場合のみ有効）
  actionText?: string;

  // アクションボタンクリック時のコールバック（showFooterがtrueの場合のみ有効）
  onAction?: () => void;

  // アクションボタンの無効状態（showFooterがtrueの場合のみ有効）
  isActionDisabled?: boolean;

  // アクションボタンのローディング状態（showFooterがtrueの場合のみ有効）
  isActionLoading?: boolean;

  // Escキーでモーダルを閉じるかどうか
  closeOnEsc?: boolean;

  // 背景クリックでモーダルを閉じるかどうか
  closeOnOverlayClick?: boolean;

  // モーダルの初期フォーカス要素のref
  initialFocusRef?: React.RefObject<HTMLElement>;

  // モーダルを閉じた後にフォーカスを戻す要素のref
  finalFocusRef?: React.RefObject<HTMLElement>;

  // カスタムクラス名
  className?: string;
}
```

## 機能要件

### 1. 表示制御
- `isOpen`プロパティによるモーダルの表示/非表示
- アニメーション付きの開閉トランジション
- 背景のオーバーレイ表示

### 2. ヘッダー
- タイトルの表示
- 閉じるボタン（×）の配置
- カスタムヘッダーのサポート（オプション）

### 3. ボディ
- 任意のコンテンツを表示（children）
- スクロール可能な領域
- パディングの適用

### 4. フッター
- キャンセルボタンとアクションボタンの配置（オプション）
- ボタンのカスタマイズ（テキスト、無効状態、ローディング状態）
- カスタムフッターのサポート（オプション）

### 5. サイズバリエーション
- 複数のサイズオプション（sm, md, lg, xl, full）
- レスポンシブな挙動

### 6. インタラクション
- Escキーでのモーダル閉じる（オプション）
- 背景クリックでのモーダル閉じる（オプション）
- モーダル内でのクリックイベントの伝播停止

## アクセシビリティ要件

### 1. キーボードナビゲーション
- Tabキーでのフォーカス移動
- フォーカストラップ（モーダル内でのフォーカス制限）
- Escキーでの閉じる機能

### 2. スクリーンリーダー対応
- 適切なARIA属性の設定
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby`（タイトルとの関連付け）
  - `aria-describedby`（説明との関連付け、必要に応じて）
- フォーカス管理
  - モーダル開閉時の適切なフォーカス移動
  - 初期フォーカス要素の指定
  - 閉じた後のフォーカス復帰

### 3. その他のアクセシビリティ
- 十分なコントラスト比
- 適切なテキストサイズ
- タッチターゲットのサイズ確保

## UI/UX考慮事項

### 1. デザイン
- 一貫性のあるスタイリング
- 適切な余白とパディング
- 角丸の適用
- シャドウ効果

### 2. アニメーション
- スムーズなフェードイン/アウト
- 適切なタイミングとイージング
- 過度なアニメーションの回避

### 3. レスポンシブ対応
- モバイルでの全画面表示オプション
- 画面サイズに応じたパディングの調整
- タッチ操作の最適化

## 実装上の注意点

### 1. パフォーマンス
- 不要な再レンダリングの防止
- アニメーションのパフォーマンス最適化
- DOM外へのポータル実装（React.createPortal）

### 2. スクロール制御
- モーダル表示中の背景スクロール防止
- モーダル本体のスクロール制御
- iOS Safariでのスクロール問題対応

### 3. フォーカス管理
- 適切なフォーカストラップの実装
- 初期フォーカスと最終フォーカスの管理
- フォーカス可視性の確保

### 4. Z-index管理
- 適切なz-indexの設定
- 他の固定要素との競合回避

## 使用例
```jsx
// 基本的な使用例
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="確認"
>
  <p>この操作を実行してもよろしいですか？</p>
</Modal>

// フッター付きの使用例
<Modal
  isOpen={isFormModalOpen}
  onClose={closeFormModal}
  title="ユーザー追加"
  showFooter={true}
  cancelText="キャンセル"
  actionText="保存"
  onAction={handleSave}
  isActionLoading={isSaving}
  isActionDisabled={!isFormValid}
>
  <UserForm onChange={handleFormChange} />
</Modal>
```

## テスト要件

### 1. ユニットテスト
- 表示/非表示の切り替え
- プロパティの反映
- イベントハンドラーの呼び出し

### 2. アクセシビリティテスト
- キーボードナビゲーション
- スクリーンリーダー対応
- ARIA属性の検証

### 3. インタラクションテスト
- クリックイベント
- キーボードイベント
- フォーカス管理