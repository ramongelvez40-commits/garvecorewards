'use client';

import React, { useState, useCallback } from 'react';
import { X, Play } from 'lucide-react';
import { UNITY_ADS_CONFIG } from '@/lib/unityAds';

interface UnityInterstitialAdProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export default function UnityInterstitialAd({ onClose, onComplete }: UnityInterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [adStarted, setAdStarted] = useState(false);

  const startAd = useCallback(() => {
    setAdStarted(true);
    let count = 5;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setCanClose(true);
      }
    }, 1000);
  }, []);

  const handleClose = () => {
    onClose?.();
    onComplete?.();
  };

  const { gameId, placements } = UNITY_ADS_CONFIG;
  const adSrc = `https://ads.unity3d.com/interstitial?gameId=${gameId}&placementId=${placements.interstitial}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Anuncio · Unity Ads</span>
          </div>
          {canClose ? (
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <X size={12} />
              Cerrar
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
              <span>Cerrar en {countdown}s</span>
            </div>
          )}
        </div>

        {/* Ad Content */}
        <div className="relative bg-black" style={{ minHeight: '250px' }}>
          {!adStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                <Play size={28} className="text-primary ml-1" />
              </div>
              <div className="text-center px-4">
                <p className="text-white font-semibold text-sm">Anuncio de video</p>
                <p className="text-gray-400 text-xs mt-1">Mira el anuncio para continuar</p>
              </div>
              <button
                onClick={startAd}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Ver anuncio
              </button>
            </div>
          ) : (
            <iframe
              src={adSrc}
              width="100%"
              height="250"
              scrolling="no"
              frameBorder="0"
              title="Unity Ads Interstitial"
              className="block w-full"
              allow="autoplay"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-muted/20 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Los anuncios nos ayudan a mantener las recompensas gratuitas
          </p>
        </div>
      </div>
    </div>
  );
}
