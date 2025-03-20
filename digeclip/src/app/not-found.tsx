'use client'; // このコンポーネントはクライアントサイドでレンダリングされます

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 明示的にサーバーサイドでのレンダリングを防止
// 静的生成時のエラーを回避
// Next.js 13.4以降の静的生成環境では非推奨のため変数名を変更
export const dynamicRendering = 'force-dynamic';
export const runtime = 'edge'; // エッジランタイムを指定して静的生成から除外

// 基本的なローディング表示コンポーネント
const LoadingComponent = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </div>
  </div>
);

// 環境変数アクセスに依存しないように修正
// クライアントサイドでのみロードされるコンポーネントを使用
const NotFoundContent = dynamic(() => import('../components/error/NotFoundContent'), {
  ssr: false, // サーバーサイドレンダリングを無効化
  loading: () => <LoadingComponent />,
});

export default function NotFound() {
  // クライアントサイドでのレンダリングを保証するためのステート
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    setMounted(true);
  }, []);

  // クライアントサイドレンダリングが完了するまでローディング表示
  if (!mounted) {
    return <LoadingComponent />;
  }

  return <NotFoundContent />;
}
