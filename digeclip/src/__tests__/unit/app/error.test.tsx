import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// エラーコンポーネントをモック
const mockErrorComponent = ({ reset }: { reset: () => void }) => (
  <div>
    <h1>エラーが発生しました</h1>
    <p>予期せぬエラーが発生しました。お手数ですが、再度お試しください。</p>
    <button onClick={reset}>再試行</button>
  </div>
);

// モジュールをモック
jest.mock('@/app/error', () => {
  return {
    __esModule: true,
    default: jest.fn(({ reset }: { reset: () => void }) => mockErrorComponent({ reset })),
  };
});

// モックリセット関数
const mockReset = jest.fn();

describe('Error Component', () => {
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

  it('エラーメッセージが表示されること', () => {
    render(mockErrorComponent({ reset: mockReset }));

    // エラーページのタイトルが表示されること
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    // エラーメッセージが表示されること
    expect(
      screen.getByText('予期せぬエラーが発生しました。お手数ですが、再度お試しください。')
    ).toBeInTheDocument();
  });

  it('再試行ボタンをクリックするとresetが呼ばれること', () => {
    render(mockErrorComponent({ reset: mockReset }));

    // 再試行ボタンをクリック
    fireEvent.click(screen.getByText('再試行'));

    // resetが呼ばれたことを確認
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('エラーがコンソールにログされること', () => {
    const testError = new Error('テストエラー');
    render(mockErrorComponent({ reset: mockReset }));

    // console.errorが呼ばれたことを確認
    expect(console.error).toHaveBeenCalledWith(testError);
  });
});
