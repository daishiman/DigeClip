import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0D7DFC" />
      </Head>
      <body className="min-h-screen bg-slate-50 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
