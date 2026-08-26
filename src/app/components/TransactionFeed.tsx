import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Users, Star } from 'lucide-react';
import { calculateEarnings } from '@/lib/earningsCalculator';
import Icon from '@/components/ui/AppIcon';


interface Transaction {
  id: string;
  type: 'earn' | 'payout' | 'bonus' | 'referral';
  description: string;
  grossCoins: number;
  date: string;
  time: string;
}

interface TransactionFeedProps {
  transactions?: Transaction[];
}

const typeConfig = {
  earn: { icon: ArrowDownLeft, color: 'text-success', bg: 'bg-success/10', prefix: '+' },
  payout: { icon: ArrowUpRight, color: 'text-danger', bg: 'bg-danger/10', prefix: '' },
  bonus: { icon: Star, color: 'text-primary', bg: 'bg-primary/10', prefix: '+' },
  referral: { icon: Users, color: 'text-accent', bg: 'bg-accent/10', prefix: '+' },
};

export default function TransactionFeed({ transactions = [] }: TransactionFeedProps) {
  const weeklyUserCoins = transactions
    .filter(tx => tx.type !== 'payout' && tx.grossCoins > 0)
    .reduce((sum, tx) => sum + calculateEarnings(tx.grossCoins).userCoins, 0);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-full">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base text-foreground">Actividad reciente</h2>
          <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">
            Ver todo
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Tú recibes el 70% de cada acción</p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
          <span className="text-4xl mb-3">📋</span>
          <p className="text-sm font-medium text-foreground mb-1">Sin actividad aún</p>
          <p className="text-xs text-muted-foreground">
            Completa anuncios, encuestas u ofertas para ver tus ganancias aquí
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {transactions.map(tx => {
            const cfg = typeConfig[tx.type];
            const Icon = cfg.icon;
            const isNegative = tx.grossCoins < 0;
            const bd = isNegative ? null : calculateEarnings(tx.grossCoins);

            return (
              <div key={tx.id} className="px-5 py-3.5 flex items-center gap-3 task-row-hover">
                <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-snug">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.date} · {tx.time}
                    {bd && (
                      <span className="ml-1 text-muted-foreground/70">· generó {bd.grossCoins} 🪙</span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {isNegative ? (
                    <p className="text-sm font-bold tabular-nums text-danger" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {tx.grossCoins.toLocaleString()} 🪙
                    </p>
                  ) : bd ? (
                    <>
                      <p className={`text-sm font-bold tabular-nums ${cfg.color}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {cfg.prefix}{bd.userCoins} 🪙
                      </p>
                      <p className="text-[10px] text-muted-foreground">70% tuyo</p>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tu ganancia esta semana (70%)</span>
          <span className="font-bold text-success tabular-nums">+{weeklyUserCoins} 🪙</span>
        </div>
      </div>
    </div>
  );
}