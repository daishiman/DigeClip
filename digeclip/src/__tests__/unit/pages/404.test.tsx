import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Custom404 from '../../../../pages/404';

// mockNextRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    reload: jest.fn(),
  }),
}));

describe('Custom404', () => {
  it('404メッセージが表示されること', () => {
    render(<Custom404 />);

    // 404ページのタイトルが表示されること
    expect(screen.getByText('404 - ページが見つかりません')).toBeInTheDocument();
    // 説明メッセージが表示されること
    expect(
      screen.getByText('お探しのページは存在しないか、移動した可能性があります。')
    ).toBeInTheDocument();
  });

  it('ホームに戻るリンクが表示されること', () => {
    render(<Custom404 />);

    // ホームに戻るリンクが表示されること
    expect(screen.getByText('ホームに戻る')).toBeInTheDocument();
  });
});
