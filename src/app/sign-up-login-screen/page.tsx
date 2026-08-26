import React from 'react';
import AuthScreen from './components/AuthScreen';
import { Toaster } from 'sonner';

export default function SignUpLoginPage() {
  return (
    <>
      <AuthScreen />
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
    </>
  );
}