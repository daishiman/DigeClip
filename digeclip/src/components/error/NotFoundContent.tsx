'use client';

import Link from 'next/link';

export default function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">ページが見つかりません</h2>
        <p className="text-gray-600 mb-6">
          アクセスしようとしたページは存在しないか、移動または削除された可能性があります。
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
