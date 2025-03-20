import { NextPage } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">{statusCode || 'エラー'}</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {statusCode === 404 ? 'ページが見つかりません' : 'エラーが発生しました'}
        </h2>
        <p className="text-gray-600 mb-6">
          {statusCode === 404
            ? 'アクセスしようとしたページは存在しないか、移動または削除された可能性があります。'
            : '問題が解決しない場合は、管理者にお問い合わせください。'}
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
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
