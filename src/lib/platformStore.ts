// Shared platform store using localStorage for persistence between admin and user views

export interface Platform {
  id: string;
  name: string;
  type: 'ad_network' | 'offerwall' | 'monetization';
  platformId: string; // App ID / Zone ID / Publisher ID
  apiKey: string;     // Secret Key / API Key
  status: 'active' | 'inactive';
  // Network provider tag — used to route to the correct SDK/integration
  provider?: 'unity' | 'theoremreach' | 'propellerads' | 'monetag' | 'cpxresearch' | 'offertoro' | 'adscendmedia' | 'adgem' | 'other';
  // Unity Ads / Ad Network specific fields
  gameId?: string;
  bannerPlacementId?: string;
  interstitialPlacementId?: string;
  rewardedPlacementId?: string;
  // PropellerAds / Monetag specific fields
  zoneId?: string;
  postbackUrl?: string;
  // Earnings tracking
  totalEarnings?: number;   // gross coins generated
  userEarnings?: number;    // 70% user share
  adminEarnings?: number;   // 30% admin share
  completedActions?: number; // number of completed tasks/offers
}

const STORAGE_KEY = 'garveco_platforms';

const defaultPlatforms: Platform[] = [
  {
    id: 'p1', name: 'Google AdSense', type: 'ad_network', provider: 'other',
    platformId: 'ca-pub-XXXXXXXXXXXXXXXX', apiKey: '', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p2', name: 'Unity Ads', type: 'ad_network', provider: 'unity',
    platformId: '', apiKey: '', status: 'active',
    gameId: '', bannerPlacementId: '', interstitialPlacementId: '', rewardedPlacementId: '',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p3', name: 'TheoremReach', type: 'offerwall', provider: 'theoremreach',
    platformId: '25307', apiKey: 'a549c851cf1607dd1085011fa629', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p4', name: 'PropellerAds', type: 'ad_network', provider: 'propellerads',
    platformId: '', apiKey: '', status: 'inactive',
    zoneId: '', postbackUrl: '',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p5', name: 'Monetag', type: 'ad_network', provider: 'monetag',
    platformId: '', apiKey: '', status: 'inactive',
    zoneId: '', postbackUrl: '',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p6', name: 'CPX Research', type: 'offerwall', provider: 'cpxresearch',
    platformId: '35635', apiKey: '', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p7', name: 'Offertoro', type: 'offerwall', provider: 'offertoro',
    platformId: 'OFT-XXXXXXXX', apiKey: '', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p8', name: 'Adscend Media', type: 'offerwall', provider: 'adscendmedia',
    platformId: 'ADM-XXXXXXXX', apiKey: '', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
  {
    id: 'p9', name: 'AdGem', type: 'offerwall', provider: 'adgem',
    platformId: '33358', apiKey: '', status: 'active',
    totalEarnings: 0, userEarnings: 0, adminEarnings: 0, completedActions: 0,
  },
];

export function getPlatforms(): Platform[] {
  if (typeof window === 'undefined') return defaultPlatforms;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Platform[];
      // Ensure all fields exist on older stored records (migration)
      const migrated = parsed.map(p => ({
        totalEarnings: 0,
        userEarnings: 0,
        adminEarnings: 0,
        completedActions: 0,
        gameId: '',
        bannerPlacementId: '',
        interstitialPlacementId: '',
        rewardedPlacementId: '',
        zoneId: '',
        postbackUrl: '',
        provider: 'other' as Platform['provider'],
        ...p,
      }));

      // Migration: fix CPX Research placeholder ID → 35635
      const fixed = migrated.map(p => {
        if (
          (p.provider === 'cpxresearch' || p.name.toLowerCase().includes('cpx')) &&
          (!p.platformId || p.platformId === 'CPX-APP-XXXXX' || p.platformId.startsWith('CPX-'))
        ) {
          return { ...p, platformId: '35635', status: 'active' as Platform['status'] };
        }
        // Migration: activate Offertoro and Adscend Media, fix their provider tags
        if (p.id === 'p7' || p.name.toLowerCase().includes('offertoro')) {
          return { ...p, provider: 'offertoro' as Platform['provider'], status: 'active' as Platform['status'], type: 'offerwall' as Platform['type'] };
        }
        if (p.id === 'p8' || p.name.toLowerCase().includes('adscend')) {
          return { ...p, provider: 'adscendmedia' as Platform['provider'], status: 'active' as Platform['status'], type: 'offerwall' as Platform['type'] };
        }
        // Migration: activate AdGem with correct App ID 33358
        if (p.id === 'p9' || p.name.toLowerCase().includes('adgem') || p.provider === 'adgem') {
          return {
            ...p,
            provider: 'adgem' as Platform['provider'],
            status: 'active' as Platform['status'],
            type: 'offerwall' as Platform['type'],
            platformId: p.platformId && /^\d+$/.test(p.platformId.trim()) ? p.platformId : '33358',
          };
        }
        return p;
      });

      // Ensure core offer-wall platforms are always present and active
      const coreIds = ['p2', 'p3', 'p6', 'p7', 'p8', 'p9'];
      const missingCores = defaultPlatforms.filter(
        dp => coreIds.includes(dp.id) && !fixed.find(fp => fp.id === dp.id)
      );
      const result = [...fixed, ...missingCores];
      savePlatforms(result);
      return result;
    }
  } catch {
    // ignore parse errors
  }
  // First visit: seed localStorage with defaults so they persist
  savePlatforms(defaultPlatforms);
  return defaultPlatforms;
}

export function savePlatforms(platforms: Platform[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
  } catch {
    // ignore storage errors
  }
}

export function recordPlatformEarnings(platformId: string, grossCoins: number): void {
  const platforms = getPlatforms();
  const updated = platforms.map(p => {
    if (p.id === platformId || p.platformId === platformId) {
      return {
        ...p,
        totalEarnings: (p.totalEarnings || 0) + grossCoins,
        userEarnings: (p.userEarnings || 0) + Math.round(grossCoins * 0.7),
        adminEarnings: (p.adminEarnings || 0) + Math.round(grossCoins * 0.3),
        completedActions: (p.completedActions || 0) + 1,
      };
    }
    return p;
  });
  savePlatforms(updated);
}

export function getTheoremReachConfig(): { appId: string; apiKey: string } | null {
  const platforms = getPlatforms();
  const tr = platforms.find(
    p => p.status === 'active' && (p.provider === 'theoremreach' || p.name.toLowerCase().includes('theoremreach'))
  );
  if (!tr || !tr.platformId) return null;
  return { appId: tr.platformId, apiKey: tr.apiKey };
}

export function getPropellerAdsConfig(): { zoneId: string; postbackUrl: string } | null {
  const platforms = getPlatforms();
  const pa = platforms.find(p => p.status === 'active' && p.provider === 'propellerads');
  if (!pa || !pa.zoneId) return null;
  return { zoneId: pa.zoneId || '', postbackUrl: pa.postbackUrl || '' };
}

export function getMonetagConfig(): { zoneId: string; postbackUrl: string } | null {
  const platforms = getPlatforms();
  const mt = platforms.find(p => p.status === 'active' && p.provider === 'monetag');
  if (!mt || !mt.zoneId) return null;
  return { zoneId: mt.zoneId || '', postbackUrl: mt.postbackUrl || '' };
}
