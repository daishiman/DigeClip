/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // CloudflareへのデプロイのためBasePath設定は不要
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
