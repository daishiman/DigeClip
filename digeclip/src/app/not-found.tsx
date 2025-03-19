'use client'; // このコンポーネントはクライアントサイドでレンダリングされます

import dynamic from 'next/dynamic';

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
  return <NotFoundContent />;
}
