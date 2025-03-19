'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録する
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">エラーが発生しました</h1>
        <p className="mt-4 text-lg">
          予期せぬエラーが発生しました。お手数ですが、再度お試しください。
        </p>
        <button
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          onClick={() => reset()}
        >
          再試行
        </button>
      </div>
    </div>
  );
}
