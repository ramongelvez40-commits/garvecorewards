'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const PAYOUT_THRESHOLD = 500;

interface HeroBalanceCardProps {
  coinBalance?: number;
}

export default function HeroBalanceCard({ coinBalance = 0 }: HeroBalanceCardProps) {
  const [displayCoins, setDisplayCoins] = useState(0);

  // Animate coin count whenever coinBalance changes
  useEffect(() => {
    let start = displayCoins;
    const end = coinBalance;
    if (start === end) return;
    const duration = 800;
    const stepTime = 16;
    const steps = Math.max(1, duration / stepTime);
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayCoins(end);
        clearInterval(timer);
      } else {
        setDisplayCoins(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinBalance]);

  const progressPercent = Math.min((displayCoins / PAYOUT_THRESHOLD) * 100, 100);
  const coinsToNextPayout = Math.max(PAYOUT_THRESHOLD - displayCoins, 0);

  return (
    <div className="gradient-hero rounded-2xl border border-border p-6 h-full shadow-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-accent/5 translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-coin flex items-center justify-center">
              <span role="img" aria-label="coins" className="text-base">🪙</span>
            </div>
            <span className="text-sm font-500 text-muted-foreground tracking-wide uppercase text-xs">Saldo de Monedas</span>
          </div>
          {displayCoins > 0 && (
            <div className="flex items-center gap-1 badge-success px-2 py-1 rounded-full text-xs font-medium">
              <TrendingUp size={11} />
              <span>Activo</span>
            </div>
          )}
        </div>

        {/* Big Number */}
        <div className="flex items-end gap-3 mb-2">
          <span
            className="text-5xl sm:text-6xl font-bold tabular-nums text-primary leading-none"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {displayCoins?.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-lg mb-1 font-medium">monedas</span>
        </div>

        {/* USD Equivalent */}
        <p className="text-muted-foreground text-sm mb-5">
          ≈ <span className="text-foreground font-semibold">${(displayCoins * 0.01)?.toFixed(2)} USD</span> valor actual
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progreso al próximo retiro</span>
            <span className="text-xs font-semibold text-foreground">
              {coinsToNextPayout > 0
                ? `Faltan ${coinsToNextPayout} monedas`
                : '¡Listo para retirar! 🎉'}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-glow progress-fill transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, var(--coin-dark), var(--coin-gold))',
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground">0</span>
            <span className="text-xs text-muted-foreground font-medium">{PAYOUT_THRESHOLD} = $5.00</span>
          </div>
        </div>

        {/* Info message — replaces the simulation button */}
        <div className="w-full py-2.5 px-4 rounded-xl bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            💡 Tu saldo crece automáticamente al completar anuncios, encuestas y ofertas
          </p>
        </div>
      </div>
    </div>
  );
}