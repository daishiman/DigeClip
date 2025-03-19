'use client'; // このコンポーネントはクライアントサイドでレンダリングされます

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 明示的にサーバーサイドでのレンダリングを防止
// 静的生成時のエラーを回避
// 注: 変数名を変えてTypeScriptエラーを回避
export const dynamicRendering = 'force-dynamic';

// 基本的なローディング表示コンポーネント
const LoadingComponent = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </div>
  </div>
);

// クライアントサイドでのみロードされるコンポーネント
// fallbackコンポーネントを明示的に定義して再利用
const NotFoundContent = dynamic(() => import('../components/error/NotFoundContent'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function NotFound() {
  // クライアントサイドでのレンダリングを保証するためのステート
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // クライアントサイドレンダリングが完了するまでローディング表示
  if (!mounted) {
    return <LoadingComponent />;
  }

  return <NotFoundContent />;
}
