import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AI Learning Hub',
  description: 'AI 학습 자료 아카이브 웹앱',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="bg-bg-main text-text-main font-sans antialiased min-h-screen">
        <ErrorBoundary>
          <FirebaseProvider>
            <div className="flex">
              <Navbar />
              <div className="flex-1 ml-[260px] min-h-screen">
                {children}
              </div>
            </div>
          </FirebaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
