'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Wallet, CalendarClock, CheckCircle } from 'lucide-react';

const PayoutRadialChart = dynamic(() => import('./PayoutRadialChart'), { ssr: false });

interface PayoutProgressCardProps {
  coinBalance?: number;
  payoutHistory?: Array<{ id: string; amount: string; date: string; status: string }>;
}

export default function PayoutProgressCard({ coinBalance = 0, payoutHistory = [] }: PayoutProgressCardProps) {
  // Bar shows how much has been accumulated this cycle (no minimum required)
  // We use a soft visual cap of 1000 coins for the radial display only
  const DISPLAY_CAP = 1000;
  const percent = coinBalance === 0 ? 0 : Math.min(Math.round((coinBalance / DISPLAY_CAP) * 100), 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 h-full shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-violet flex items-center justify-center">
            <Wallet size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Retiros</span>
        </div>
        <span className="badge-success px-2 py-0.5 rounded-full text-xs font-medium">
          PayPal activo
        </span>
      </div>

      {/* Radial Chart */}
      <div className="flex justify-center mb-4">
        <div className="relative w-40 h-40">
          <PayoutRadialChart percent={percent} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums text-primary">{coinBalance}</span>
            <span className="text-xs text-muted-foreground">🪙 acumuladas</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Próximo retiro</p>
          <p className="font-bold text-foreground tabular-nums">Día 7</p>
          <p className="text-xs text-muted-foreground">cada mes</p>
        </div>
        <div className="bg-muted rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total ganado</p>
          <p className="font-bold text-success tabular-nums">
            ${(coinBalance * 0.01).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">acumulado</p>
        </div>
      </div>

      {/* Auto-withdrawal notice */}
      <div className="flex items-start gap-2 rounded-xl bg-success/10 border border-success/20 px-3 py-2.5 mb-4">
        <CalendarClock size={15} className="text-success shrink-0 mt-0.5" />
        <p className="text-xs text-success leading-relaxed">
          <span className="font-semibold">Retiro automático el día 7.</span> Todo tu saldo acumulado se transfiere automáticamente a tu PayPal cada mes. Sin mínimos obligatorios.
        </p>
      </div>

      {/* Payout History */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Historial reciente</p>
        {payoutHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <span className="text-2xl mb-1">📭</span>
            <p className="text-xs text-muted-foreground">Sin retiros aún</p>
            <p className="text-xs text-muted-foreground opacity-70">Completa tareas para acumular monedas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payoutHistory.map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.amount}</p>
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                </div>
                <span className="badge-success px-2 py-0.5 rounded-full text-xs">Pagado</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}