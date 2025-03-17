# Cypress と Playwright

E2Eテストには、CypressとPlaywrightを使用します。どちらも強力なE2Eテストツールですが、用途に応じて使い分けます。

## Cypress

Cypressは、モダンなWebアプリケーションのE2Eテストに特化したツールです。

### 設定

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'src/__tests__/e2e/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'src/__tests__/e2e/support/e2e.ts',
    setupNodeEvents(on, config) {
      // イベントリスナーの設定
    },
  },
  env: {
    // 環境変数
    apiUrl: 'http://localhost:3000/api',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
```

### ディレクトリ構造

```
/src
  └─ /__tests__
      └─ /e2e
          ├─ /flows           # ユーザーフロー別のテスト
          │   ├─ login.spec.ts
          │   └─ content.spec.ts
          ├─ /fixtures        # テストデータ
          │   └─ users.json
          ├─ /support         # ヘルパー関数
          │   ├─ commands.ts
          │   └─ e2e.ts
          └─ /utils           # ユーティリティ
              └─ selectors.ts
```

### テスト例

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
});
```

### カスタムコマンド

```typescript
// src/__tests__/e2e/support/commands.ts
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// 使用例
it('ログイン後にコンテンツを作成できること', () => {
  cy.login('test@example.com', 'password123');
  // 以降のテストコード
});
```

### テスト実行

```bash
# Cypressを開く
npx cypress open

# ヘッドレスモードでテストを実行
npx cypress run

# 特定のテストファイルを実行
npx cypress run --spec "src/__tests__/e2e/flows/login.spec.ts"
```

## Playwright

Playwrightは、複数のブラウザをサポートするE2Eテストツールです。

### 設定

```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/__tests__/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'Safari',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
```

### ディレクトリ構造

```
/src
  └─ /__tests__
      └─ /e2e
          ├─ /flows           # ユーザーフロー別のテスト
          │   ├─ login.spec.ts
          │   └─ content.spec.ts
          ├─ /fixtures        # テストデータ
          │   └─ users.json
          ├─ /utils           # ユーティリティ
          │   └─ selectors.ts
          └─ /pages           # ページオブジェクト
              ├─ login.page.ts
              └─ dashboard.page.ts
```

### テスト例

```typescript
// src/__tests__/e2e/flows/content.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('コンテンツ作成フロー', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // ログイン
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('新しいコンテンツを作成できること', async ({ page }) => {
    // 新規作成ページに移動
    await dashboardPage.clickNewContent();
    await expect(page).toHaveURL(/.*create/);

    // フォームに入力
    await page.fill('input[name="title"]', 'テスト用コンテンツ');
    await page.fill('textarea[name="body"]', 'これはテスト用のコンテンツです。');

    // 保存ボタンをクリック
    await page.click('button:has-text("保存")');

    // 保存成功メッセージが表示されることを確認
    await expect(page.locator('text=コンテンツが保存されました')).toBeVisible();
  });
});
```

### ページオブジェクトパターン

```typescript
// src/__tests__/e2e/pages/login.page.ts
import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

### テスト実行

```bash
# すべてのテストを実行
npx playwright test

# 特定のテストファイルを実行
npx playwright test src/__tests__/e2e/flows/login.spec.ts

# UIモードでテストを実行
npx playwright test --ui

# 特定のブラウザでテストを実行
npx playwright test --project=Chrome
```

## Cypress と Playwright の使い分け

### Cypressの利点

- 直感的なUIとデバッグ機能
- 自動リトライ機能
- 豊富なプラグインエコシステム
- 優れたドキュメント

### Playwrightの利点

- 複数のブラウザをサポート（Chrome, Firefox, Safari）
- モバイルエミュレーション
- 高速な実行
- 並列実行のサポート

### 使い分けの指針

- **Cypress**: 単一ブラウザでのテストや、チーム内にCypressの経験者がいる場合
- **Playwright**: 複数ブラウザでのテストや、パフォーマンスが重要な場合

## 共通のベストプラクティス

1. **ページオブジェクトパターンを使用する**
   - テストコードとページの詳細を分離する
   - 再利用性と保守性を向上させる

2. **データ駆動テストを活用する**
   - 同じテストを異なるデータセットで実行する
   - テストケースの網羅性を向上させる

3. **安定したセレクタを使用する**
   - データ属性（`data-testid`など）を使用する
   - CSSクラスやIDに依存しない

4. **テスト環境を適切に設定する**
   - テスト用データベースを使用する
   - テスト前後にデータをクリーンアップする