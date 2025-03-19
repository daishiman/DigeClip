'use client'; // このコンポーネントはクライアントサイドでレンダリングされます

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 静的エクスポートには動的ディレクティブを使用しない
// export const dynamicRendering = 'force-dynamic';

// クライアントサイドでのみロードされるコンポーネント
const NotFoundContent = dynamic(() => import('../components/error/NotFoundContent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    </div>
  ),
});

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return <NotFoundContent />;
}
