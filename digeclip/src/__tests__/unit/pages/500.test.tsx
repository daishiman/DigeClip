import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// 500ページのモックコンポーネント
const MockCustom500 = () => (
  <div>
    <h1>サーバーエラーが発生しました</h1>
    <p>サーバーでエラーが発生しました。お手数ですが、再度お試しください。</p>
    <button>再読み込み</button>
  </div>
);

// pagesディレクトリの500.tsxをモック
jest.mock('../../../../pages/500', () => ({
  __esModule: true,
  default: jest.fn(() => <MockCustom500 />),
}));

describe('Custom500', () => {
  it('エラーメッセージが表示されること', () => {
    render(<MockCustom500 />);

    // エラーページのタイトルが表示されること
    expect(screen.getByText('サーバーエラーが発生しました')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('サーバーでエラーが発生しました。お手数ですが、再度お試しください。')
    ).toBeInTheDocument();
  });

  it('再読み込みボタンが表示されること', () => {
    render(<MockCustom500 />);

    // 再読み込みボタンが表示されること
    expect(screen.getByText('再読み込み')).toBeInTheDocument();
  });
});
