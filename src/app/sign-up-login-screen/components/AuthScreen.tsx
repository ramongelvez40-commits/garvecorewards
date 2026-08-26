'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

const STATS = [
  { id: 'stat-members', value: '12,400+', label: 'miembros activos' },
  { id: 'stat-paid', value: '$48,200', label: 'pagados a miembros' },
  { id: 'stat-tasks', value: '230K+', label: 'tareas completadas' },
];

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Brand Panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] gradient-hero border-r border-border flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-primary/3 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <AppLogo size={40} />
          <span className="font-bold text-xl tracking-tight text-foreground">
            Garveco<span className="text-primary">Rewards</span>
          </span>
        </div>

        {/* Main Copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-primary text-xs font-semibold">🪙 Gana dinero real hoy</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-4">
            Completa tareas,<br />
            <span className="text-primary">cobra en PayPal</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
            Gana monedas completando videos, encuestas y tareas simples. Retira tus ganancias directamente a tu cuenta de PayPal cuando alcances 500 monedas.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {STATS?.map(s => (
              <div key={s?.id} className="bg-card/50 border border-border rounded-xl p-4">
                <p className="text-2xl font-bold text-primary tabular-nums">{s?.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s?.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-4 bg-card/40 border border-border rounded-xl">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              "Llevo 3 meses usando GarvecoRewards y ya he retirado $35 a mi PayPal. Es legítimo y los pagos siempre llegan a tiempo."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full gradient-coin flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">LM</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Laura Martínez</p>
                <p className="text-xs text-muted-foreground">Miembro desde enero 2026</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5]?.map(i => (
                  <span key={`star-${i}`} className="text-primary text-xs">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            © 2026 GarvecoRewards · Todos los derechos reservados
          </p>
        </div>
      </div>
      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 xl:p-14">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-foreground">
            Garveco<span className="text-primary">Rewards</span>
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Mode Toggle */}
          <div className="flex bg-muted/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'login' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'signup' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <LoginForm onSwitchToSignUp={() => setMode('signup')} />
          ) : (
            <SignUpForm onSwitchToLogin={() => setMode('login')} />
          )}

          {/* Back to dashboard (demo) */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Volver al panel de demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}