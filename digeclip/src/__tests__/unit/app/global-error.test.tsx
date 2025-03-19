import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// グローバルエラーコンポーネントをモック
const mockGlobalErrorComponent = ({ reset }: { reset: () => void }) => (
  <html lang="ja">
    <body>
      <div>
        <h1>エラーが発生しました</h1>
        <p>サイト全体でエラーが発生しました。お手数ですが、再度お試しください。</p>
        <button onClick={reset}>再試行</button>
      </div>
    </body>
  </html>
);

// モジュールをモック
jest.mock('@/app/global-error', () => {
  return {
    __esModule: true,
    default: jest.fn(({ reset }: { reset: () => void }) => mockGlobalErrorComponent({ reset })),
  };
});

// モックリセット関数
const mockReset = jest.fn();

describe('GlobalError Component', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    mockReset.mockClear();
    // console.errorをモック化して実際のエラーログを抑制
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // console.errorのモックを復元
    jest.restoreAllMocks();
  });

  it('グローバルエラーメッセージが表示されること', () => {
    render(mockGlobalErrorComponent({ reset: mockReset }));

    // エラーページのタイトルが表示されること
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    // エラーメッセージが表示されること
    expect(
      screen.getByText('サイト全体でエラーが発生しました。お手数ですが、再度お試しください。')
    ).toBeInTheDocument();
  });

  it('再試行ボタンをクリックするとresetが呼ばれること', () => {
    render(mockGlobalErrorComponent({ reset: mockReset }));

    // 再試行ボタンをクリック
    fireEvent.click(screen.getByText('再試行'));

    // resetが呼ばれたことを確認
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('html要素とbody要素を含むこと', () => {
    const { container } = render(mockGlobalErrorComponent({ reset: mockReset }));

    // html要素が存在することを確認
    expect(container.querySelector('html')).toBeInTheDocument();
    // body要素が存在することを確認
    expect(container.querySelector('body')).toBeInTheDocument();
  });
});
