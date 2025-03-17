# Cypress/Playwright

## 概要

Cypress と Playwright は、ブラウザ上でのインタラクションをシミュレートしてWebアプリケーションをテストするためのE2E（エンドツーエンド）テストツールです。ユーザーの操作を自動化し、実際のブラウザ環境での動作を検証します。

## Playwright

PlaywrightはMicrosoftが開発したモダンなE2Eテストツールで、複数のブラウザエンジン（Chromium、Firefox、WebKit）をサポートしています。

### インストール

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 設定（playwright.config.ts）

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './digeclip/src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Playwrightを使用したテスト例

```typescript
// login.test.ts
import { test, expect } from '@playwright/test';

test.describe('ログイン機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にホームページにアクセス
    await page.goto('/');
  });

  test('有効な認証情報でログインできること', async ({ page }) => {
    // ログインページに移動
    await page.click('[data-testid="login-button"]');

    // 認証情報を入力
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');

    // ログインボタンをクリック
    await page.click('[data-testid="submit-button"]');

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL(/.*dashboard/);

    // ユーザー名が表示されることを確認
    await expect(page.locator('[data-testid="user-greeting"]')).toContainText('テストユーザー');
  });

  test('無効な認証情報でログインするとエラーが表示されること', async ({ page }) => {
    // ログインページに移動
    await page.click('[data-testid="login-button"]');

    // 無効な認証情報を入力
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');

    // ログインボタンをクリック
    await page.click('[data-testid="submit-button"]');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('メールアドレスまたはパスワードが正しくありません');

    // URLがログインページのままであることを確認
    await expect(page).toHaveURL(/.*login/);
  });
});
```

## Cypress

Cypressは、モダンなWebアプリケーションのためのE2Eテストツールで、開発者向けの優れたデバッグ体験を提供します。

### インストール

```bash
npm install --save-dev cypress
```

### 設定（cypress.config.ts）

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'digeclip/src/__tests__/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'digeclip/src/__tests__/e2e/support/e2e.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

### Cypressを使用したテスト例

```typescript
// login.cy.ts
describe('ログイン機能', () => {
  beforeEach(() => {
    // 各テスト前にホームページにアクセス
    cy.visit('/');
  });

  it('有効な認証情報でログインできること', () => {
    // ログインページに移動
    cy.get('[data-testid="login-button"]').click();

    // 認証情報を入力
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');

    // ログインボタンをクリック
    cy.get('[data-testid="submit-button"]').click();

    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');

    // ユーザー名が表示されることを確認
    cy.get('[data-testid="user-greeting"]').should('contain', 'テストユーザー');
  });

  it('無効な認証情報でログインするとエラーが表示されること', () => {
    // ログインページに移動
    cy.get('[data-testid="login-button"]').click();

    // 無効な認証情報を入力
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');

    // ログインボタンをクリック
    cy.get('[data-testid="submit-button"]').click();

    // エラーメッセージが表示されることを確認
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'メールアドレスまたはパスワードが正しくありません');

    // URLがログインページのままであることを確認
    cy.url().should('include', '/login');
  });
});
```

## ベストプラクティス

1. **データ属性の使用**
   - テスト用のデータ属性（例：`data-testid="login-button"`）を使用して要素を選択
   - CSSやクラス名の変更に影響されないロバストなテストを作成

2. **テストの独立性確保**
   - 各テストは完全に独立して実行できるようにする
   - テスト間で状態が共有されないようにする

3. **テスト環境の分離**
   - テスト用のデータベースやAPIモックを使用
   - テスト用の環境変数を設定

4. **テストの安定性向上**
   - 非同期処理の待機を適切に行う
   - 再試行メカニズムを活用（特にCI環境で）

5. **視覚的リグレッションテスト**
   - スクリーンショットを使った視覚的な変更検出
   - コンポーネントのレイアウト崩れなどを検出

## 注意点

- E2Eテストは単体テストや統合テストよりも実行時間が長い
- すべての機能をE2Eテストでカバーするのではなく、重要なユーザーフローに焦点を当てる
- CIパイプラインに組み込む場合は、実行時間とリソース消費を考慮
- ヘッドレスモードでの実行をサポートして、CI環境での実行を効率化