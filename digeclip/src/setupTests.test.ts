// jestテスト環境のセットアップファイル

// windowオブジェクトのモック設定
// windowオブジェクトが存在する場合のみ設定
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
}

// 環境変数の設定
// process.env.NODE_ENVは読み取り専用プロパティなので、Object.definePropertyを使用して設定
Object.defineProperty(process.env, 'NODE_ENV', { value: 'test' });
process.env.JEST_WORKER_ID = '1';

// コンソール出力の抑制（必要に応じてコメントアウト）
global.console = {
  ...console,
  // テスト実行中に不要なログを抑制
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// テスト環境の正しい動作のためのその他の設定
// fetchがグローバルに存在しない場合、モックを設定
if (typeof fetch === 'undefined') {
  Object.defineProperty(global, 'fetch', {
    value: jest.fn(),
    writable: true,
  });
}

// SWCバイナリ関連のエラーを無視する設定
jest.mock(
  'next/dist/compiled/jest-runtime',
  () => ({
    ...jest.requireActual('next/dist/compiled/jest-runtime'),
  }),
  { virtual: true }
);

// テスト環境の準備完了
// コンソール出力のlintエラーを避けるため、ログ出力は削除
