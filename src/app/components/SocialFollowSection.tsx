'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLink {
  facebook: string;
  youtube: string;
}

const SOCIAL_LINKS_KEY = 'garveco_social_links';
const SOCIAL_FOLLOWED_KEY = 'garveco_social_followed';

function getSocialLinks(): SocialLink {
  if (typeof window === 'undefined') return { facebook: '', youtube: '' };
  try {
    const stored = localStorage.getItem(SOCIAL_LINKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { facebook: '', youtube: '' };
}

function getFollowedState(): { facebook: boolean; youtube: boolean } {
  if (typeof window === 'undefined') return { facebook: false, youtube: false };
  try {
    const stored = localStorage.getItem(SOCIAL_FOLLOWED_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { facebook: false, youtube: false };
}

function saveFollowedState(state: { facebook: boolean; youtube: boolean }) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOCIAL_FOLLOWED_KEY, JSON.stringify(state));
  } catch {}
}

interface SocialFollowSectionProps {
  onCoinsEarned?: (coins: number, description: string) => void;
}

const COINS_PER_FOLLOW = 15;

export default function SocialFollowSection({ onCoinsEarned }: SocialFollowSectionProps) {
  const [links, setLinks] = useState<SocialLink>({ facebook: '', youtube: '' });
  const [followed, setFollowed] = useState({ facebook: false, youtube: false });

  useEffect(() => {
    setLinks(getSocialLinks());
    setFollowed(getFollowedState());
  }, []);

  const handleFollow = (platform: 'facebook' | 'youtube') => {
    const url = links[platform];
    if (!url) return;

    // Open the link
    window.open(url, '_blank', 'noopener,noreferrer');

    // Credit coins after a short delay (simulating the user followed)
    setTimeout(() => {
      if (!followed[platform]) {
        const newFollowed = { ...followed, [platform]: true };
        setFollowed(newFollowed);
        saveFollowedState(newFollowed);

        const platformName = platform === 'facebook' ? 'Facebook' : 'YouTube';
        toast.success(`+${COINS_PER_FOLLOW} monedas ganadas 🪙`, {
          description: `¡Gracias por seguir nuestra página de ${platformName}!`,
        });

        if (onCoinsEarned) {
          onCoinsEarned(COINS_PER_FOLLOW, `Seguir en ${platformName}`);
        }
      }
    }, 3000);
  };

  const networks = [
    {
      key: 'facebook' as const,
      label: 'Facebook',
      emoji: '📘',
      color: 'from-blue-600 to-blue-500',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      action: 'Seguir página',
      description: 'Sigue nuestra página y gana monedas',
    },
    {
      key: 'youtube' as const,
      label: 'YouTube',
      emoji: '▶️',
      color: 'from-red-600 to-red-500',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      action: 'Suscribirse al canal',
      description: 'Suscríbete a nuestro canal y gana monedas',
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center shrink-0">
            <span className="text-xl">📱</span>
          </div>
          <div>
            <h2 className="font-semibold text-base text-foreground">Seguir y Ganar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sigue nuestras redes sociales y gana <span className="text-primary font-semibold">+{COINS_PER_FOLLOW} 🪙</span> por cada una
            </p>
          </div>
        </div>
      </div>

      {/* Social Cards */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {networks.map(net => {
          const hasLink = !!links[net.key];
          const isDone = followed[net.key];

          return (
            <div
              key={net.key}
              className={`rounded-xl border ${net.borderColor} ${net.bgColor} p-4 flex flex-col gap-3`}
            >
              {/* Platform header */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">{net.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">{net.label}</p>
                  <p className="text-xs text-muted-foreground">{net.description}</p>
                </div>
              </div>

              {/* Reward badge */}
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${net.textColor}`}>+{COINS_PER_FOLLOW} monedas</span>
                <span className="text-xs text-muted-foreground">al seguir</span>
              </div>

              {/* Action button */}
              {isDone ? (
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle size={15} className="text-success shrink-0" />
                  <span className="text-xs font-medium text-success">¡Ya seguido! Monedas acreditadas</span>
                </div>
              ) : hasLink ? (
                <button
                  onClick={() => handleFollow(net.key)}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r ${net.color} text-white text-xs font-semibold transition-opacity hover:opacity-90`}
                >
                  <ExternalLink size={13} />
                  {net.action}
                </button>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-muted/50 border border-border text-center">
                  <p className="text-xs text-muted-foreground">Enlace no configurado aún</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export helpers for admin use
export { getSocialLinks, SOCIAL_LINKS_KEY };
