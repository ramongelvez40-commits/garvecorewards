'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Loader2, X, Clock } from 'lucide-react';
import { getPlatforms } from '@/lib/platformStore';
import type { Platform } from '@/lib/platformStore';

interface OfferWallsSectionProps {
  userId?: string;
  onCoinsEarned?: (coins: number, description: string) => void;
}

// ─── Official brand logos ────────────────────────────────────────────────────

function TheoremReachLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#1a1a2e] border border-[#6c63ff]/40 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#6c63ff" opacity="0.15"/>
        <path d="M11 20 L20 11 L29 20 L20 29 Z" fill="#6c63ff" opacity="0.85"/>
        <circle cx="20" cy="20" r="5" fill="#6c63ff"/>
        <path d="M15 15 L25 25 M25 15 L15 25" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function CPXResearchLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0d1b2a] border border-[#00b4d8]/40 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="7" fill="#00b4d8" opacity="0.15"/>
        <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00b4d8" fontFamily="Arial, sans-serif">CPX</text>
        <rect x="8" y="29" width="24" height="2.5" rx="1.25" fill="#00b4d8" opacity="0.5"/>
      </svg>
    </div>
  );
}

function OfferToroLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0f1f0f] border border-[#4caf50]/40 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="7" fill="#4caf50" opacity="0.15"/>
        <path d="M20 10 C14.477 10 10 14.477 10 20 C10 25.523 14.477 30 20 30 C25.523 30 30 25.523 30 20 C30 14.477 25.523 10 20 10Z" fill="none" stroke="#4caf50" strokeWidth="2"/>
        <path d="M15 20 L18.5 23.5 L25 16.5" stroke="#4caf50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="20" cy="20" r="3" fill="#4caf50" opacity="0.3"/>
      </svg>
    </div>
  );
}

function AdscendMediaLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#1a0f2e] border border-[#9c27b0]/40 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="7" fill="#9c27b0" opacity="0.15"/>
        <path d="M12 28 L20 12 L28 28" stroke="#9c27b0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 23 L25 23" stroke="#9c27b0" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="12" r="2.5" fill="#9c27b0" opacity="0.7"/>
      </svg>
    </div>
  );
}

function AdGemLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0a1628] border border-[#f97316]/40 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="7" fill="#f97316" opacity="0.15"/>
        <path d="M20 10 L28 28 H12 Z" fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M15.5 23 H24.5" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="20" cy="10" r="2.5" fill="#f97316" opacity="0.8"/>
        <text x="20" y="35" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#f97316" fontFamily="Arial, sans-serif" opacity="0.7">AG</text>
      </svg>
    </div>
  );
}

function UnityAdsLogo() {
  return (
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#1a1a1a] border border-[#ffffff]/25 shadow-lg">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="5" fill="#222222"/>
        <path d="M20 8 L32 15 L32 25 L20 32 L8 25 L8 15 Z" fill="none" stroke="white" strokeWidth="1.8"/>
        <path d="M20 8 L20 32" stroke="white" strokeWidth="1" opacity="0.35"/>
        <path d="M8 15 L32 15" stroke="white" strokeWidth="1" opacity="0.35"/>
        <path d="M8 25 L32 25" stroke="white" strokeWidth="1" opacity="0.35"/>
        <circle cx="20" cy="20" r="4" fill="white"/>
      </svg>
    </div>
  );
}

// ─── Platform config ─────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<string, {
  logo: React.ReactNode;
  color: string;
  tagline: string;
  categories?: string[];
  getUrl: (platform: Platform, userId: string) => string;
}> = {
  offertoro: {
    logo: <OfferToroLogo />,
    color: '#4caf50',
    tagline: 'Juegos · Tareas · Ofertas',
    categories: ['🎮 Juegos', '✅ Tareas'],
    getUrl: (p, userId) => {
      const pubId = p.platformId && !p.platformId.startsWith('OFT-') ? p.platformId : '';
      if (pubId) {
        return `https://www.offertoro.com/ifr/show/${pubId}/${encodeURIComponent(userId || 'guest')}/0`;
      }
      return `https://www.offertoro.com/ifr/show/your_pub_id/${encodeURIComponent(userId || 'guest')}/0`;
    },
  },
  adscendmedia: {
    logo: <AdscendMediaLogo />,
    color: '#9c27b0',
    tagline: 'Ofertas · Apps · Encuestas',
    categories: ['📲 Apps', '💰 Ofertas'],
    getUrl: (p, userId) => {
      const pubId = p.platformId && !p.platformId.startsWith('ADM-') ? p.platformId : '';
      if (pubId) {
        return `https://wall.adscendmedia.com/?pub=${pubId}&uid=${encodeURIComponent(userId || 'guest')}`;
      }
      return `https://wall.adscendmedia.com/?pub=your_pub_id&uid=${encodeURIComponent(userId || 'guest')}`;
    },
  },
  theoremreach: {
    logo: <TheoremReachLogo />,
    color: '#6c63ff',
    tagline: 'Encuestas y Ofertas',
    getUrl: (p, userId) => {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://garvecorew5280.builtwithrocket.new';
      const postbackUrl = encodeURIComponent(
        `${siteUrl}/api/theoremreach-webhook?user_id=${userId}&reward=[REWARD]&transaction_id=[TRANSACTION_ID]&hash=[HASH]`
      );
      const apiKey = p.apiKey || 'a549c851cf1607dd1085011fa629';
      return `https://theoremreach.com/respondent_entry/direct?api_key=${apiKey}&user_id=${userId}&postback_url=${postbackUrl}`;
    },
  },
  cpxresearch: {
    logo: <CPXResearchLogo />,
    color: '#00b4d8',
    tagline: 'Encuestas · Juegos · Apps',
    categories: ['🎮 Juegos', '📲 Apps'],
    getUrl: (_p, userId) => {
      // App ID 35635 hardcoded directly — no variable dependency
      // subid_1=games_apps activates games and app download offer categories
      return `https://offers.cpx-research.com/index.php?app_id=35635&ext_user_id=${encodeURIComponent(userId || 'usuario_prueba')}&subid_1=games_apps`;
    },
  },
  unity: {
    logo: <UnityAdsLogo />,
    color: '#e0e0e0',
    tagline: 'Anuncios Recompensados',
    getUrl: (p) => {
      const gameId = p.gameId || p.platformId || '';
      if (!gameId) return 'https://unity.com/solutions/unity-ads';
      return `https://ads.unity3d.com/rewarded?gameId=${gameId}`;
    },
  },
  adgem: {
    logo: <AdGemLogo />,
    color: '#f97316',
    tagline: 'Juegos · Ofertas · Recompensas',
    categories: ['🎮 Juegos', '🏆 Recompensas'],
    getUrl: (p, _userId) => {
      const appId = p.platformId && /^\d+$/.test(p.platformId.trim()) ? p.platformId.trim() : '33358';
      return `https://adunits.adgem.com/wall?appid=${appId}`;
    },
  },
};

// ─── Permanent core platforms (always shown, never hidden) ───────────────────

const CORE_PLATFORMS: Platform[] = [
  {
    id: 'p3', name: 'TheoremReach', type: 'offerwall', provider: 'theoremreach',
    platformId: '25307', apiKey: 'a549c851cf1607dd1085011fa629', status: 'active',
  },
  {
    id: 'p6', name: 'CPX Research', type: 'offerwall', provider: 'cpxresearch',
    platformId: '35635', apiKey: '', status: 'active',
  },
  {
    id: 'p7', name: 'Offertoro', type: 'offerwall', provider: 'offertoro',
    platformId: 'OFT-XXXXXXXX', apiKey: '', status: 'active',
  },
  {
    id: 'p8', name: 'Adscend Media', type: 'offerwall', provider: 'adscendmedia',
    platformId: 'ADM-XXXXXXXX', apiKey: '', status: 'active',
  },
  {
    id: 'p9', name: 'AdGem', type: 'offerwall', provider: 'adgem',
    platformId: '33358', apiKey: '', status: 'active',
  },
  {
    id: 'p2', name: 'Unity Ads', type: 'ad_network', provider: 'unity',
    platformId: '', apiKey: '', status: 'active',
    gameId: '',
  },
];

function getPlatformConfigKey(p: Platform): string | null {
  if (p.provider === 'theoremreach' || p.name.toLowerCase().includes('theoremreach')) return 'theoremreach';
  if (p.provider === 'cpxresearch' || p.name.toLowerCase().includes('cpx')) return 'cpxresearch';
  if (p.provider === 'offertoro' || p.name.toLowerCase().includes('offertoro')) return 'offertoro';
  if (p.provider === 'adscendmedia' || p.name.toLowerCase().includes('adscend')) return 'adscendmedia';
  if (p.provider === 'adgem' || p.name.toLowerCase().includes('adgem')) return 'adgem';
  if (p.provider === 'unity' || p.name.toLowerCase().includes('unity')) return 'unity';
  return null;
}

interface OfferCard {
  platform: Platform;
  configKey: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function OfferWallsSection({ userId = '', onCoinsEarned }: OfferWallsSectionProps) {
  const [cards, setCards] = useState<OfferCard[]>([]);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // Load stored platforms and merge with core platforms
    const stored = getPlatforms();

    // Build a map of configKey → best platform record
    const cardMap = new Map<string, OfferCard>();

    // First pass: stored platforms (may have admin-configured IDs/keys)
    stored.forEach(p => {
      const key = getPlatformConfigKey(p);
      if (!key) return;
      if (!cardMap.has(key)) {
        // For CPX Research: always enforce correct App ID
        let platform = p;
        if (key === 'cpxresearch' && (!p.platformId || !/^\d+$/.test(p.platformId.trim()))) {
          platform = { ...p, platformId: '35635', status: 'active' };
        }
        cardMap.set(key, { platform, configKey: key });
      }
    });

    // Second pass: ensure all 3 core platforms are always present
    CORE_PLATFORMS.forEach(cp => {
      const key = getPlatformConfigKey(cp);
      if (!key) return;
      if (!cardMap.has(key)) {
        cardMap.set(key, { platform: cp, configKey: key });
      }
    });

    // Enforce display order: TheoremReach → CPX Research → OfferToro → Adscend Media → AdGem → Unity Ads
    const ordered: OfferCard[] = ['theoremreach', 'cpxresearch', 'offertoro', 'adscendmedia', 'adgem', 'unity']
      .map(k => cardMap.get(k))
      .filter((c): c is OfferCard => !!c);

    setCards(ordered);
  }, []);

  const handleOpen = (card: OfferCard) => {
    const cfg = PLATFORM_CONFIG[card.configKey];
    if (!cfg) return;

    // Unity Ads is not yet available — show coming soon modal
    if (card.configKey === 'unity') {
      setShowComingSoon(true);
      return;
    }

    // AdGem is handled via native <a href> below — skip here
    if (card.configKey === 'adgem') return;

    // For CPX Research (and all offer walls), a real user ID is required
    // If the session hasn't loaded yet, fall back to a safe placeholder
    const resolvedUserId = userId || 'guest';

    setOpeningId(card.platform.id);
    const url = cfg.getUrl(card.platform, resolvedUserId);

    // Open as a plain external browser tab — no popup restrictions
    window.open(url, '_blank');

    setTimeout(() => setOpeningId(null), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <X size={16} className="text-muted-foreground" />
            </button>

            {/* Top gradient accent */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #1a1a1a 0%, #555 50%, #1a1a1a 100%)' }} />

            {/* Content */}
            <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
              {/* Unity logo */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#1a1a1a] border border-white/20 shadow-lg">
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="32" height="32" rx="5" fill="#222222"/>
                  <path d="M20 8 L32 15 L32 25 L20 32 L8 25 L8 15 Z" fill="none" stroke="white" strokeWidth="1.8"/>
                  <circle cx="20" cy="20" r="4" fill="white"/>
                  <line x1="20" y1="8" x2="20" y2="14" stroke="white" strokeWidth="1.5"/>
                  <line x1="32" y1="15" x2="26.5" y2="18" stroke="white" strokeWidth="1.5"/>
                  <line x1="32" y1="25" x2="26.5" y2="22" stroke="white" strokeWidth="1.5"/>
                  <line x1="20" y1="32" x2="20" y2="26" stroke="white" strokeWidth="1.5"/>
                  <line x1="8" y1="25" x2="13.5" y2="22" stroke="white" strokeWidth="1.5"/>
                  <line x1="8" y1="15" x2="13.5" y2="18" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>

              {/* Clock icon badge */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Clock size={13} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-400 tracking-wide uppercase">Próximamente</span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Unity Ads</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La sección de anuncios recompensados de <span className="text-foreground font-medium">Unity Ads</span> estará disponible muy pronto.
                </p>
              </div>

              {/* Info box */}
              <div className="w-full bg-muted/40 rounded-2xl px-5 py-4 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  🚀 Estamos trabajando para activar esta función. Una vez disponible, podrás ver anuncios recompensados y ganar monedas directamente desde aquí.
                </p>
              </div>

              {/* CTA button */}
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #333 0%, #555 100%)' }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center shrink-0">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h2 className="font-semibold text-base text-foreground">Muros de Ofertas y Anuncios</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Completa encuestas y ve anuncios para ganar monedas</p>
          </div>
        </div>
      </div>

      {/* Cards — vertical format, 3 columns */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {cards.map(card => {
            const cfg = PLATFORM_CONFIG[card.configKey];
            if (!cfg) return null;
            const isOpening = openingId === card.platform.id;

            // AdGem: render as a native anchor so the browser always opens it externally
            if (card.configKey === 'adgem') {
              const adgemUrl = cfg.getUrl(card.platform, userId || 'guest');
              return (
                <a
                  key={card.configKey}
                  href={adgemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background/50 hover:bg-muted/40 hover:border-border/80 active:scale-95 transition-all duration-150 group"
                  style={{ borderColor: 'rgba(249,115,22,0.35)', background: 'rgba(249,115,22,0.04)' }}
                >
                  {/* Logo */}
                  <div className="relative">
                    {cfg.logo}
                  </div>

                  {/* Name + tagline */}
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground leading-tight">{card.platform.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{cfg.tagline}</p>
                  </div>

                  {/* Category badges */}
                  {cfg.categories && (
                    <div className="flex flex-wrap justify-center gap-1">
                      {cfg.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${cfg.color}22`, color: cfg.color }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA badge */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
                    style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                  >
                    <ExternalLink size={9} />
                    <span>Entrar</span>
                  </div>
                </a>
              );
            }

            return (
              <button
                key={card.configKey}
                onClick={() => handleOpen(card)}
                disabled={isOpening}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background/50 hover:bg-muted/40 hover:border-border/80 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed group"
                style={
                  card.configKey === 'cpxresearch'
                    ? { borderColor: 'rgba(0,180,216,0.35)', background: 'rgba(0,180,216,0.04)' }
                    : card.configKey === 'offertoro'
                    ? { borderColor: 'rgba(76,175,80,0.35)', background: 'rgba(76,175,80,0.04)' }
                    : card.configKey === 'adscendmedia'
                    ? { borderColor: 'rgba(156,39,176,0.35)', background: 'rgba(156,39,176,0.04)' }
                    : card.configKey === 'adgem'
                    ? { borderColor: 'rgba(249,115,22,0.35)', background: 'rgba(249,115,22,0.04)' }
                    : undefined
                }
              >
                {/* Logo */}
                <div className="relative">
                  {cfg.logo}
                  {isOpening && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                      <Loader2 size={18} className="animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Name + tagline */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground leading-tight">{card.platform.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{cfg.tagline}</p>
                </div>

                {/* Category badges for platforms that have them */}
                {cfg.categories && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {cfg.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${cfg.color}22`, color: cfg.color }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA badge */}
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                >
                  <ExternalLink size={9} />
                  <span>{isOpening ? 'Abriendo…' : 'Entrar'}</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4">
          El 70% de cada acción completada se acredita automáticamente a tu saldo
        </p>
      </div>
    </div>
  );
}
