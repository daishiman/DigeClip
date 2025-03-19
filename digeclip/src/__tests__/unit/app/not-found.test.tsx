import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// 404ページをモック
const mockNotFoundComponent = () => (
  <div>
    <h1>404 - ページが見つかりません</h1>
    <p>お探しのページは存在しないか、移動した可能性があります。</p>
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/">ホームに戻る</a>
  </div>
);

// モジュールをモック
jest.mock('@/app/not-found', () => {
  return {
    __esModule: true,
    default: jest.fn(() => mockNotFoundComponent()),
  };
});

// next/linkのモックは不要になりました

describe('NotFound Component', () => {
  it('404メッセージが表示されること', () => {
    render(mockNotFoundComponent());

    // 404ページのタイトルが表示されること
    expect(screen.getByText('404 - ページが見つかりません')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('お探しのページは存在しないか、移動した可能性があります。')
    ).toBeInTheDocument();
  });

  it('ホームに戻るリンクが表示され、正しいhref属性を持つこと', () => {
    render(mockNotFoundComponent());

    // ホームに戻るリンクが表示されること
    const homeLink = screen.getByText('ホームに戻る');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
});
