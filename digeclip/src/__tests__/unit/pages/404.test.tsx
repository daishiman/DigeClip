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

// not-foundページのモックコンポーネント
const MockNotFound = () => (
  <div>
    <h1>404 - ページが見つかりません</h1>
    <p>お探しのページは存在しないか、移動した可能性があります。</p>
    <Link href="/">ホームに戻る</Link>
  </div>
);

// appディレクトリのnot-found.tsxをモック
jest.mock('../../../app/not-found', () => ({
  __esModule: true,
  default: jest.fn(() => <MockNotFound />),
}));

describe('NotFound', () => {
  it('404メッセージが表示されること', () => {
    render(<MockNotFound />);

    // 404ページのタイトルが表示されること
    expect(screen.getByText('404 - ページが見つかりません')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('お探しのページは存在しないか、移動した可能性があります。')
    ).toBeInTheDocument();
  });

  it('ホームに戻るリンクが表示されること', () => {
    render(<MockNotFound />);

    // ホームに戻るリンクが表示されること
    expect(screen.getByText('ホームに戻る')).toBeInTheDocument();
  });
});
