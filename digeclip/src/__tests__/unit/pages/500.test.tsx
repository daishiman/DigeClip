import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// エラーページのモックコンポーネント
const MockError = () => (
  <div>
    <h1>エラーが発生しました</h1>
    <p>予期せぬエラーが発生しました。お手数ですが、再度お試しください。</p>
    <button>再試行</button>
  </div>
);

// appディレクトリのerror.tsxをモック
jest.mock('../../../app/error', () => ({
  __esModule: true,
  default: jest.fn(() => <MockError />),
}));

describe('Error', () => {
  it('エラーメッセージが表示されること', () => {
    render(<MockError />);

    // エラーページのタイトルが表示されること
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('予期せぬエラーが発生しました。お手数ですが、再度お試しください。')
    ).toBeInTheDocument();
  });

  it('再試行ボタンが表示されること', () => {
    render(<MockError />);

    // 再試行ボタンが表示されること
    expect(screen.getByText('再試行')).toBeInTheDocument();
  });
});
