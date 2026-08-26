import React from 'react';
import Topbar from './Topbar';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: React.ReactNode;
  coinBalance?: number;
}

export default function AppLayout({ children, coinBalance = 0 }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar coinBalance={coinBalance} />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-6">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </div>
  );
}