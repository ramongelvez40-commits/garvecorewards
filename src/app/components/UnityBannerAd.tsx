'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UNITY_ADS_CONFIG } from '@/lib/unityAds';

interface UnityBannerAdProps {
  className?: string;
}

export default function UnityBannerAd({ className = '' }: UnityBannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Unity Ads banner via iframe embed
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const { gameId, placements } = UNITY_ADS_CONFIG;
  const bannerSrc = `https://ads.unity3d.com/banner?gameId=${gameId}&placementId=${placements.banner}&w=320&h=50`;

  return (
    <div
      ref={containerRef}
      className={`w-full flex items-center justify-center bg-muted/30 border border-border/50 rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: '60px' }}
    >
      {!adLoaded && !adError && (
        <div className="flex items-center gap-2 py-3">
          <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground">Cargando anuncio…</span>
        </div>
      )}

      {adLoaded && !adError && (
        <div className="w-full relative">
          {/* Unity Ads Banner Label */}
          <div className="absolute top-0 right-0 z-10 px-1.5 py-0.5 bg-black/40 rounded-bl text-white text-[9px] font-medium">
            Publicidad
          </div>
          <iframe
            src={bannerSrc}
            width="320"
            height="50"
            scrolling="no"
            frameBorder="0"
            title="Unity Ads Banner"
            className="mx-auto block"
            onLoad={() => setAdError(false)}
            onError={() => setAdError(true)}
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}

      {adError && (
        <div className="py-3 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Anuncio</span> · Unity Ads
          </p>
        </div>
      )}
    </div>
  );
}
