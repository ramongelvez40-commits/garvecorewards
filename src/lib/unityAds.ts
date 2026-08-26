'use client';

// Unity Ads Configuration
export const UNITY_ADS_CONFIG = {
  gameId: '800109760',
  placements: {
    banner: 'Banner_Android',
    interstitial: 'Interstitial_Android',
    rewarded: 'Rewarded_Android',
  },
  testMode: false,
};

declare global {
  interface Window {
    unityads?: {
      initialize: (gameId: string, options: { testMode: boolean }) => void;
      load: (placementId: string, callbacks: { onComplete: (placementId: string) => void; onFailed: (placementId: string, error: string, message: string) => void }) => void;
      show: (placementId: string, callbacks: { onStart: (placementId: string) => void; onSkipped: (placementId: string) => void; onComplete: (placementId: string) => void; onFailed: (placementId: string, error: string, message: string) => void }) => void;
      isReady: (placementId: string) => boolean;
    };
    UnityAds?: unknown;
  }
}

let sdkLoaded = false;
let sdkLoading = false;
const readyCallbacks: Array<() => void> = [];

export function loadUnityAdsSdk(): Promise<void> {
  return new Promise((resolve) => {
    if (sdkLoaded) { resolve(); return; }
    if (sdkLoading) { readyCallbacks.push(resolve); return; }

    sdkLoading = true;
    readyCallbacks.push(resolve);

    const script = document.createElement('script');
    script.src = 'https://game-cdn.poki.com/scripts/unity-ads.js';
    script.async = true;

    // Unity Ads web SDK alternative — use their iframe/postMessage approach
    // Since Unity Ads doesn't have a public web JS SDK, we simulate ad display
    // via their web monetization approach using iframes
    script.onload = () => {
      sdkLoaded = true;
      sdkLoading = false;
      readyCallbacks.forEach(cb => cb());
      readyCallbacks.length = 0;
    };
    script.onerror = () => {
      // SDK failed to load — mark as loaded anyway so UI still renders
      sdkLoaded = true;
      sdkLoading = false;
      readyCallbacks.forEach(cb => cb());
      readyCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}

export function getUnityAdsBannerUrl(): string {
  const { gameId, placements } = UNITY_ADS_CONFIG;
  return `https://ads.unity3d.com/banner?gameId=${gameId}&placementId=${placements.banner}`;
}

export function getUnityAdsInterstitialUrl(): string {
  const { gameId, placements } = UNITY_ADS_CONFIG;
  return `https://ads.unity3d.com/interstitial?gameId=${gameId}&placementId=${placements.interstitial}`;
}

export function getUnityAdsRewardedUrl(): string {
  const { gameId, placements } = UNITY_ADS_CONFIG;
  return `https://ads.unity3d.com/rewarded?gameId=${gameId}&placementId=${placements.rewarded}`;
}
