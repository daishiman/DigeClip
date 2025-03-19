import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - ページが見つかりません</h1>
        <p className="mt-4 text-lg">お探しのページは存在しないか、移動した可能性があります。</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
