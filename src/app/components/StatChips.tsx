import React from 'react';
import { CheckSquare, DollarSign, Clock, Users } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface StatChipsProps {
  tasksCompleted?: number;
  totalEarnedUsd?: number;
  pendingCoins?: number;
  activeReferrals?: number;
}

export default function StatChips({
  tasksCompleted = 0,
  totalEarnedUsd = 0,
  pendingCoins = 0,
  activeReferrals = 0,
}: StatChipsProps) {
  const stats = [
    {
      id: 'stat-tasks',
      label: 'Tareas completadas',
      value: String(tasksCompleted),
      suffix: 'esta semana',
      icon: CheckSquare,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      trend: tasksCompleted > 0 ? `${tasksCompleted} completadas` : 'Sin tareas aún',
      trendPositive: tasksCompleted > 0 ? true : null,
    },
    {
      id: 'stat-earned',
      label: 'Ganado total (vida)',
      value: `$${totalEarnedUsd.toFixed(2)}`,
      suffix: 'USD retirado',
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      trend: totalEarnedUsd > 0 ? 'Retiros exitosos' : 'Sin retiros aún',
      trendPositive: totalEarnedUsd > 0 ? true : null,
    },
    {
      id: 'stat-pending',
      label: 'Retiro pendiente',
      value: String(pendingCoins),
      suffix: 'monedas',
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border',
      trend: pendingCoins > 0 ? 'En proceso' : 'Sin retiros activos',
      trendPositive: null,
    },
    {
      id: 'stat-referrals',
      label: 'Referidos activos',
      value: String(activeReferrals),
      suffix: 'amigos',
      icon: Users,
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
      trend: activeReferrals > 0 ? `${activeReferrals} referidos` : 'Sin referidos aún',
      trendPositive: activeReferrals > 0 ? true : null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4">
      {stats?.map((s, i) => {
        const Icon = s?.icon;
        return (
          <div
            key={s?.id}
            className={`bg-card rounded-2xl border ${s?.border} p-4 card-hover fade-in-up`}
            style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s?.bg} flex items-center justify-center`}>
                <Icon size={18} className={s?.color} />
              </div>
            </div>
            <div>
              <p
                className={`text-2xl font-bold tabular-nums ${s?.color} leading-none mb-1`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {s?.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium">{s?.label}</p>
              <p className="text-xs text-muted-foreground mt-1 opacity-70">{s?.suffix}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <span
                className={`text-xs font-medium ${
                  s?.trendPositive === true
                    ? 'text-success'
                    : s?.trendPositive === false
                    ? 'text-danger' :'text-muted-foreground'
                }`}
              >
                {s?.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}