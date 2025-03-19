import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DigeClip',
  description: 'Content Digestion Platform',
};

// 静的エクスポートには動的ディレクティブを使用しない
// export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-container">
      <div className="antialiased">{children}</div>
    </div>
  );
}
