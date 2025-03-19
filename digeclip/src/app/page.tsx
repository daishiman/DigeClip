'use client';

import { useEffect, useState } from 'react';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // クライアントサイドレンダリングのみで実行されるようにする
    setIsClient(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
      <h1 className="text-6xl font-bold text-center mb-8">Hello World!</h1>
      <p className="text-2xl text-center mb-4">DigeClip - テスト画面</p>
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-lg">これは一時的なテスト用ページです。</p>
        {isClient && (
          <p className="mt-2 text-sm text-gray-600">
            クライアントサイドレンダリングで実行されています。
          </p>
        )}
      </div>
    </div>
  );
}
