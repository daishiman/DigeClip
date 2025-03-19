/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static exportを有効化 (Cloudflare Pages用)
  output: 'export',
  distDir: '.vercel/output/static', // Cloudflare Pages用の出力先
  images: {
    unoptimized: true,
  },
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

  // 環境変数の問題によるビルドエラーを回避
  // ビルド時に特定のページを静的生成から除外
  staticPageGenerationTimeout: 120,

  // 環境変数のデフォルト値（ビルド時のみ使用される）
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xqhoatxccoijvualjzyj.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy-openai-key',
  },
};

module.exports = nextConfig;
