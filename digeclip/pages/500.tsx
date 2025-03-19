import { useRouter } from 'next/router';

export default function Custom500() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">サーバーエラーが発生しました</h1>
        <p className="mt-4 text-lg">
          サーバーでエラーが発生しました。お手数ですが、再度お試しください。
        </p>
        <button
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          onClick={() => router.reload()}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}
