import { NextPage } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          {statusCode ? `${statusCode} - エラーが発生しました` : 'エラーが発生しました'}
        </h1>
        <p className="mt-4 text-lg">
          予期せぬエラーが発生しました。お手数ですが、再度お試しください。
        </p>
        <button
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
