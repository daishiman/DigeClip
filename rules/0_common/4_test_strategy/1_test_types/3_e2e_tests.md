# E2Eテスト

E2Eテスト（エンドツーエンドテスト）は、アプリケーション全体が実際のユーザーシナリオに沿って正しく動作することを確認するためのテストです。

## 目的

- 実際のユーザーの操作シナリオを模倣し、アプリケーション全体が正しく機能することを確認する
- フロントエンドとバックエンドの統合、データベースとの連携など、システム全体の動作を検証する
- 本番環境に近い状態でのテストを行う

## テスト対象

- ユーザーフロー（ログイン、コンテンツ作成、検索など）
- 画面遷移
- データの永続化
- エラーハンドリング

## ディレクトリ構造

E2Eテストは、`src/__tests__/e2e` ディレクトリに配置します。

```
/src
  └─ /__tests__
      └─ /e2e
          ├─ /flows           # ユーザーフロー別のテスト
          │   ├─ login.spec.ts
          │   ├─ content.spec.ts
          │   └─ ...
          ├─ /fixtures        # テストデータ
          ├─ /support         # ヘルパー関数
          └─ /utils           # ユーティリティ
```

## テスト命名規則

- テストファイル: `[対象機能].spec.ts` または `[対象機能].e2e.spec.ts`
- テストスイート: `describe('[機能名]', () => { ... })`
- テストケース: `it('[期待する動作]', () => { ... })` または `test('[期待する動作]', () => { ... })`

## テスト作成のガイドライン

### 一般的なガイドライン

1. 重要なユーザーフローに焦点を当てる
2. テストは独立して実行できるようにする
3. テストデータは自己完結的に用意する
4. テスト環境をテスト前に適切に設定し、テスト後にクリーンアップする

### Cypressを使用したE2Eテスト

```typescript
// src/__tests__/e2e/flows/login.spec.ts
describe('ログインフロー', () => {
  beforeEach(() => {
    // テスト前の準備
    cy.visit('/login');
  });

  it('有効な認証情報でログインできること', () => {
    // ログインフォームに入力
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');

    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();

    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');

    // ログイン成功メッセージが表示されることを確認
    cy.contains('ログインに成功しました').should('be.visible');
  });

  it('無効な認証情報でログインできないこと', () => {
    // ログインフォームに無効な認証情報を入力
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();

    // ログインページに留まることを確認
    cy.url().should('include', '/login');

    // エラーメッセージが表示されることを確認
    cy.contains('メールアドレスまたはパスワードが正しくありません').should('be.visible');
  });
});
```

### Playwrightを使用したE2Eテスト

```typescript
// src/__tests__/e2e/flows/content.spec.ts
import { test, expect } from '@playwright/test';

test.describe('コンテンツ作成フロー', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // ダッシュボードに移動したことを確認
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('新しいコンテンツを作成できること', async ({ page }) => {
    // 新規作成ページに移動
    await page.click('text=新規作成');
    await expect(page).toHaveURL(/.*create/);

    // フォームに入力
    await page.fill('input[name="title"]', 'テスト用コンテンツ');
    await page.fill('textarea[name="body"]', 'これはテスト用のコンテンツです。');

    // 保存ボタンをクリック
    await page.click('button:has-text("保存")');

    // 保存成功メッセージが表示されることを確認
    await expect(page.locator('text=コンテンツが保存されました')).toBeVisible();

    // コンテンツ一覧に作成したコンテンツが表示されることを確認
    await page.goto('/dashboard');
    await expect(page.locator('text=テスト用コンテンツ')).toBeVisible();
  });
});
```

## テスト環境

E2Eテストでは、以下の環境を使用します：

1. **テスト用データベース**
   - 本番環境とは別のテスト用データベースを使用
   - テスト前後にデータをクリーンアップ

2. **テスト用サーバー**
   - ローカル開発サーバーまたはステージング環境を使用

3. **テスト用ブラウザ**
   - 複数のブラウザでテストを実行（Chrome, Firefox, Safari など）
   - モバイルデバイスのエミュレーションも考慮

## テスト実行方法

```bash
# Cypressを使用する場合
npm run test:e2e

# Playwrightを使用する場合
npm run test:e2e:playwright
```