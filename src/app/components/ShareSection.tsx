'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SHARE_COINS = 10;
const SHARE_HISTORY_KEY = 'garveco_share_history';
const APP_URL = 'https://garvecorewards.com';

function getShareCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(SHARE_HISTORY_KEY);
    if (stored) return JSON.parse(stored).count || 0;
  } catch {}
  return 0;
}

function incrementShareCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const count = getShareCount() + 1;
    localStorage.setItem(SHARE_HISTORY_KEY, JSON.stringify({ count }));
    return count;
  } catch {}
  return 0;
}

interface ShareSectionProps {
  onCoinsEarned?: (coins: number, description: string) => void;
}

export default function ShareSection({ onCoinsEarned }: ShareSectionProps) {
  const [shareCount, setShareCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareCount(getShareCount());
  }, []);

  const creditCoins = () => {
    const newCount = incrementShareCount();
    setShareCount(newCount);

    toast.success(`+${SHARE_COINS} monedas ganadas 🪙`, {
      description: '¡Gracias por compartir la aplicación!',
    });

    if (onCoinsEarned) {
      onCoinsEarned(SHARE_COINS, 'Compartir aplicación');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'GarveCore Rewards',
          text: '¡Gana monedas completando tareas y anuncios! Únete a GarveCore Rewards.',
          url: APP_URL,
        });
        creditCoins();
      } catch {
        // User cancelled share — no coins
      }
    } else {
      // Fallback: copy to clipboard
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      creditCoins();
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center shrink-0">
            <Share2 size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-foreground">Compartir y Ganar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gana <span className="text-primary font-semibold">+{SHARE_COINS} 🪙</span> cada vez que compartas la app
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* App link preview */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/50 border border-border">
          <span className="text-lg">🔗</span>
          <span className="text-xs text-muted-foreground flex-1 truncate">{APP_URL}</span>
        </div>

        {/* Share stats */}
        {shareCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle size={14} className="text-success shrink-0" />
            <span className="text-xs text-success font-medium">
              Has compartido {shareCount} {shareCount === 1 ? 'vez' : 'veces'} · +{shareCount * SHARE_COINS} 🪙 ganadas
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNativeShare}
            className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm font-semibold"
          >
            <Share2 size={15} />
            Compartir
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-muted/50 hover:bg-muted text-sm font-semibold text-foreground transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle size={15} className="text-success" />
                <span className="text-success">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                Copiar enlace
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Cada vez que compartas recibirás +{SHARE_COINS} monedas automáticamente
        </p>
      </div>
    </div>
  );
}
