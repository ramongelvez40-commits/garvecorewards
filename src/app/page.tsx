// Backend integration point: fetch user data, coin balance, tasks, and transactions from API
'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import HeroBalanceCard from './components/HeroBalanceCard';
import PayoutProgressCard from './components/PayoutProgressCard';
import TransactionFeed from './components/TransactionFeed';
import PayPalSettingsPanel from './components/PayPalSettingsPanel';
import SocialFollowSection from './components/SocialFollowSection';
import ShareSection from './components/ShareSection';
import OfferWallsSection from './components/OfferWallsSection';
import SheinCatalogSection from './components/SheinCatalogSection';
import { getUserSession } from '@/lib/userStore';


interface Transaction {
  id: string;
  type: 'earn' | 'payout' | 'bonus' | 'referral';
  description: string;
  grossCoins: number;
  date: string;
  time: string;
}

export default function RewardsDashboardPage() {
  return <RewardsDashboardContent />;
}

function RewardsDashboardContent() {
  // Real user state — starts at 0 for every new user
  const [coinBalance, setCoinBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Resolved user ID from session — used for offer wall ext_user_id
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const session = getUserSession();
    if (session?.userId) {
      setCurrentUserId(session.userId);
    }
  }, []);

  /**
   * Central earnings handler — called by any real action.
   * For social/share actions, coins are fixed (not 70/30 split).
   */
  const handleEarningsReceived = (coins: number, description: string, type: Transaction['type'] = 'earn') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    setCoinBalance(prev => prev + coins);
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type,
        description,
        grossCoins: coins,
        date: 'Hoy',
        time: timeStr,
      },
      ...prev,
    ]);
  };

  return (
    <AppLayout coinBalance={coinBalance}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mi Panel de Recompensas</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Bienvenido 👋</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success pulse-ring" />
            <span className="text-success text-xs font-medium">En vivo</span>
          </div>
        </div>

        {/* Hero + Progress Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 xl:gap-6">
          <div className="lg:col-span-3">
            <HeroBalanceCard coinBalance={coinBalance} />
          </div>
          <div className="lg:col-span-2">
            <PayoutProgressCard coinBalance={coinBalance} payoutHistory={[]} />
          </div>
        </div>

        {/* Redes Sociales — Seguir y Ganar */}
        <SocialFollowSection
          onCoinsEarned={(coins, desc) => handleEarningsReceived(coins, desc, 'bonus')}
        />

        {/* Compartir y Ganar */}
        <ShareSection
          onCoinsEarned={(coins, desc) => handleEarningsReceived(coins, desc, 'referral')}
        />

        {/* Muros de Ofertas y Anuncios */}
        <OfferWallsSection
          userId={currentUserId || undefined}
          onCoinsEarned={(coins, desc) => handleEarningsReceived(coins, desc, 'earn')}
        />

        {/* Catálogo Shein — Recompensas por Compras */}
        <SheinCatalogSection />

        {/* Activity Feed + PayPal Settings */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
          <div className="xl:col-span-2">
            <TransactionFeed transactions={transactions} />
          </div>
          <div className="xl:col-span-1">
            <PayPalSettingsPanel />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}