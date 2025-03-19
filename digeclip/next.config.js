/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static exportは無効化
  // output: 'export',
  // distDir: 'out',
  // images: {
  //   unoptimized: true,
  // },
  reactStrictMode: true,

  // App RouterとPages Routerのハイブリッドモードでの競合を回避
  experimental: {
    // エラーページはPages Routerで処理する
    disableOptimizedLoading: true,
  },

  // ESLintの設定
  eslint: {
    // ビルド時に警告を表示するが、エラーでビルドを失敗させない
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
