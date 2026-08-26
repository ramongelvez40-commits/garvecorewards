'use client';

import React, { useState, useCallback } from 'react';
import { X, Gift, Play, CheckCircle, Info } from 'lucide-react';
import { UNITY_ADS_CONFIG } from '@/lib/unityAds';
import { calculateEarnings, ACTION_GROSS_VALUES, type EarningsBreakdown } from '@/lib/earningsCalculator';

interface UnityRewardedAdProps {
  grossCoins?: number;
  onClose?: () => void;
  onRewardEarned?: (coins: number) => void;
}

type AdState = 'prompt' | 'playing' | 'completed' | 'skipped';

export default function UnityRewardedAd({
  grossCoins = ACTION_GROSS_VALUES.rewardedAd,
  onClose,
  onRewardEarned,
}: UnityRewardedAdProps) {
  const [adState, setAdState] = useState<AdState>('prompt');
  const [countdown, setCountdown] = useState(15);

  const breakdown: EarningsBreakdown = calculateEarnings(grossCoins);

  const startAd = useCallback(() => {
    setAdState('playing');
    let count = 15;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setAdState('completed');
        onRewardEarned?.(breakdown.userCoins);
      }
    }, 1000);
  }, [breakdown.userCoins, onRewardEarned]);

  const handleClose = () => {
    if (adState === 'playing') {
      setAdState('skipped');
    } else {
      onClose?.();
    }
  };

  const handleCollect = () => {
    onClose?.();
  };

  const { gameId, placements } = UNITY_ADS_CONFIG;
  const adSrc = `https://ads.unity3d.com/rewarded?gameId=${gameId}&placementId=${placements.rewarded}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Gift size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Anuncio Recompensado</span>
          </div>
          {adState !== 'playing' && (
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Cerrar"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
          {adState === 'playing' && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              <span>{countdown}s</span>
            </div>
          )}
        </div>

        {/* Reward Preview */}
        {adState === 'prompt' && (
          <div className="px-5 py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl gradient-coin flex items-center justify-center mx-auto">
              <span className="text-3xl">🪙</span>
            </div>
            <div>
              <p className="font-bold text-xl text-primary">+{breakdown.userCoins} monedas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Mira un anuncio corto y gana monedas gratis
              </p>
            </div>

            {/* Transparent breakdown */}
            <div className="rounded-xl bg-muted/40 border border-border p-3 text-left space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Info size={12} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">Desglose transparente</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Este anuncio genera</span>
                <span className="font-semibold text-foreground">{breakdown.grossCoins} 🪙</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-success font-medium">Tú recibes ({breakdown.userPercent}%)</span>
                <span className="font-bold text-success">+{breakdown.userCoins} 🪙</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Plataforma ({breakdown.platformPercent}%)</span>
                <span className="text-muted-foreground">{breakdown.platformCoins} 🪙</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${breakdown.userPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ≈ ${breakdown.usdValue} USD para ti
              </p>
            </div>

            <button
              onClick={startAd}
              className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Ver anuncio y ganar
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              No gracias
            </button>
          </div>
        )}

        {/* Playing State */}
        {adState === 'playing' && (
          <div className="relative bg-black" style={{ minHeight: '250px' }}>
            <iframe
              src={adSrc}
              width="100%"
              height="250"
              scrolling="no"
              frameBorder="0"
              title="Unity Ads Rewarded"
              className="block w-full"
              allow="autoplay"
            />
            <div className="absolute bottom-2 right-2 bg-black/60 rounded-lg px-2 py-1">
              <p className="text-white text-xs font-medium">{countdown}s restantes</p>
            </div>
          </div>
        )}

        {/* Completed State */}
        {adState === 'completed' && (
          <div className="px-5 py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-success" />
            </div>
            <div>
              <p className="font-bold text-xl text-success">¡Recompensa ganada!</p>
              <p className="text-2xl font-bold text-primary mt-1">+{breakdown.userCoins} 🪙</p>
              <p className="text-sm text-muted-foreground mt-1">
                Las monedas han sido añadidas a tu saldo
              </p>
            </div>
            {/* Post-completion breakdown */}
            <div className="rounded-xl bg-success/5 border border-success/20 p-3 text-left space-y-1.5">
              <p className="text-xs font-semibold text-success mb-1">Resumen de ganancias</p>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Generado por el anuncio</span>
                <span className="font-medium text-foreground">{breakdown.grossCoins} 🪙</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-success">Tu parte (70%)</span>
                <span className="font-bold text-success">+{breakdown.userCoins} 🪙</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Plataforma (30%)</span>
                <span className="text-muted-foreground">{breakdown.platformCoins} 🪙</span>
              </div>
            </div>
            <button
              onClick={handleCollect}
              className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Gift size={16} />
              Cobrar recompensa
            </button>
          </div>
        )}

        {/* Skipped State */}
        {adState === 'skipped' && (
          <div className="px-5 py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <X size={22} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Anuncio omitido</p>
              <p className="text-sm text-muted-foreground mt-1">
                Debes ver el anuncio completo para ganar la recompensa
              </p>
            </div>
            <button
              onClick={startAd}
              className="w-full btn-primary py-2.5 text-sm font-semibold"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Footer */}
        {adState !== 'prompt' && adState !== 'skipped' && adState !== 'completed' && (
          <div className="px-4 py-2.5 bg-muted/20 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Unity Ads · Game ID {UNITY_ADS_CONFIG.gameId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
