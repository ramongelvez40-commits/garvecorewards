'use client';

import React, { useEffect, useState } from 'react';
import { Gift, Loader2, ExternalLink, Info } from 'lucide-react';
import { getTheoremReachConfig } from '@/lib/platformStore';
import { calculateEarnings } from '@/lib/earningsCalculator';

interface TheoremReachOfferwallProps {
  userId?: string;
  onCoinsEarned?: (coins: number) => void;
}

// Example gross values for survey types shown in the info grid
const SURVEY_EXAMPLES = [
  { label: 'Encuesta corta', grossCoins: 71 },
  { label: 'Encuesta media', grossCoins: 171 },
  { label: 'Encuesta larga', grossCoins: 357 },
];

export default function TheoremReachOfferwall({ userId = 'user_001', onCoinsEarned }: TheoremReachOfferwallProps) {
  const [config, setConfig] = useState<{ appId: string; apiKey: string } | null>(null);
  const [offerwallOpen, setOfferwallOpen] = useState(false);

  useEffect(() => {
    // 1. Try localStorage (admin panel config)
    let cfg = getTheoremReachConfig();

    // 2. Fallback to env vars
    if (!cfg) {
      const envAppId = process.env.NEXT_PUBLIC_THEOREMREACH_APP_ID;
      if (envAppId) {
        cfg = { appId: envAppId, apiKey: process.env.NEXT_PUBLIC_THEOREMREACH_API_KEY || '' };
      }
    }

    // 3. Hardcoded fallback — user confirmed App ID 25307 is active in admin panel
    if (!cfg) {
      cfg = { appId: '25307', apiKey: 'a549c851cf1607dd1085011fa629' };
    }

    setConfig(cfg);
  }, []);

  const openOfferwall = () => {
    if (!config) return;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://garvecorew5280.builtwithrocket.new';
    const postbackUrl = encodeURIComponent(
      `${siteUrl}/api/theoremreach-webhook?user_id=${userId}&reward=[REWARD]&transaction_id=[TRANSACTION_ID]&hash=[HASH]`
    );

    const offerwallUrl = `https://theoremreach.com/respondent_entry/direct?api_key=${config.apiKey}&user_id=${userId}&postback_url=${postbackUrl}`;

    const popup = window.open(
      offerwallUrl,
      'TheoremReach',
      'width=480,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );

    setOfferwallOpen(true);

    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setOfferwallOpen(false);
        if (onCoinsEarned) {
          onCoinsEarned(0);
        }
      }
    }, 500);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center shrink-0">
              <Gift size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-foreground">Encuestas y Ofertas</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Completa encuestas y gana monedas al instante</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">Activo</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        {/* Transparent earnings examples */}
        <div className="rounded-xl bg-muted/30 border border-border p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={12} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Ganancias proporcionales — 70% para ti</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SURVEY_EXAMPLES.map(({ label, grossCoins }) => {
              const bd = calculateEarnings(grossCoins);
              return (
                <div key={label} className="rounded-lg bg-background/70 border border-border p-2 text-center">
                  <p className="text-xs font-bold text-success">+{bd.userCoins} 🪙</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                  <p className="text-[10px] text-muted-foreground">de {bd.grossCoins} total</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-success" style={{ width: '70%' }} />
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">70% tú · 30% plataforma</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Accede al muro de encuestas y ofertas de TheoremReach. Cada encuesta completada suma el <strong className="text-foreground">70% del valor generado</strong> directamente a tu saldo.
        </p>

        {/* CTA Button */}
        <button
          onClick={openOfferwall}
          disabled={offerwallOpen}
          className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {offerwallOpen ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Offerwall abierto…
            </>
          ) : (
            <>
              <ExternalLink size={16} />
              Abrir Encuestas y Ofertas
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          El 70% de cada oferta se acredita automáticamente a tu saldo
        </p>
      </div>
    </div>
  );
}
