/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static exportを有効化 (Cloudflare Pages用)
  output: 'export',
  // Cloudflare Pages用の適切な出力先設定
  // outDir: 'out', // Next.jsのデフォルトのため不要
  images: {
    unoptimized: true, // Cloudflare Pages用に必須
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
    // Cloudflare Pages環境でのビルドに必要なデフォルト値
    NEXT_PUBLIC_SUPABASE_URL:
      (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
      'https://xqhoatxccoijvualjzyj.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
      'dummy-key',
    SUPABASE_SERVICE_ROLE_KEY:
      (typeof process !== 'undefined' && process.env && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
      'dummy-service-key',
    NEXT_PUBLIC_API_URL:
      (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) ||
      'https://api.example.com',
    OPENAI_API_KEY:
      (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) ||
      'dummy-openai-key',
  },
};

module.exports = nextConfig;
