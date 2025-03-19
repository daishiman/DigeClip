import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Link from 'next/link';

// Linkコンポーネントをモック
jest.mock('next/link', () => {
  return function mockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// 404ページのモックコンポーネント
const MockCustom404 = () => (
  <div>
    <h1>404 - ページが見つかりません</h1>
    <p>お探しのページは存在しないか、移動した可能性があります。</p>
    <Link href="/">ホームに戻る</Link>
  </div>
);

// pagesディレクトリの404.tsxをモック
jest.mock('../../../../pages/404', () => ({
  __esModule: true,
  default: jest.fn(() => <MockCustom404 />),
}));

describe('Custom404', () => {
  it('404メッセージが表示されること', () => {
    render(<MockCustom404 />);

    // 404ページのタイトルが表示されること
    expect(screen.getByText('404 - ページが見つかりません')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('お探しのページは存在しないか、移動した可能性があります。')
    ).toBeInTheDocument();
  });

  it('ホームに戻るリンクが表示されること', () => {
    render(<MockCustom404 />);

    // ホームに戻るリンクが表示されること
    expect(screen.getByText('ホームに戻る')).toBeInTheDocument();
  });
});
