'use client';

import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Zap, Video, FileText, Share2, Star, Lock, Info } from 'lucide-react';
import { toast } from 'sonner';
import { calculateEarnings, ACTION_GROSS_VALUES, type EarningsBreakdown } from '@/lib/earningsCalculator';

interface Task {
  id: string;
  title: string;
  description: string;
  grossCoins: number;       // What the action actually generates
  estimatedTime: string;
  category: 'video' | 'survey' | 'referral' | 'bonus' | 'locked';
  status: 'available' | 'completed' | 'locked';
  difficulty: 'easy' | 'medium' | 'hard';
}

const initialTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Ver video publicitario',
    description: 'Mira el video completo de 30 segundos de nuestro socio',
    grossCoins: ACTION_GROSS_VALUES.shortVideo,
    estimatedTime: '30 seg',
    category: 'video',
    status: 'available',
    difficulty: 'easy',
  },
  {
    id: 'task-002',
    title: 'Completar encuesta breve',
    description: 'Responde 5 preguntas sobre tus hábitos de compra',
    grossCoins: ACTION_GROSS_VALUES.briefSurvey,
    estimatedTime: '3 min',
    category: 'survey',
    status: 'available',
    difficulty: 'medium',
  },
  {
    id: 'task-003',
    title: 'Invitar a un amigo',
    description: 'Comparte tu código de referido y gana cuando se registren',
    grossCoins: ACTION_GROSS_VALUES.referral,
    estimatedTime: '1 min',
    category: 'referral',
    status: 'available',
    difficulty: 'easy',
  },
  {
    id: 'task-004',
    title: 'Bono de inicio de sesión diario',
    description: 'Inicia sesión 7 días seguidos para recibir el bono',
    grossCoins: ACTION_GROSS_VALUES.dailyBonus,
    estimatedTime: 'Diario',
    category: 'bonus',
    status: 'available',
    difficulty: 'easy',
  },
  {
    id: 'task-005',
    title: 'Leer artículo patrocinado',
    description: 'Lee el artículo completo de nuestro socio editorial',
    grossCoins: ACTION_GROSS_VALUES.articleRead,
    estimatedTime: '2 min',
    category: 'video',
    status: 'available',
    difficulty: 'easy',
  },
  {
    id: 'task-006',
    title: 'Encuesta premium de marca',
    description: 'Encuesta detallada de 15 min sobre preferencias de marca',
    grossCoins: ACTION_GROSS_VALUES.premiumSurvey,
    estimatedTime: '15 min',
    category: 'survey',
    status: 'locked',
    difficulty: 'hard',
  },
];

const categoryIcon = {
  video: Video,
  survey: FileText,
  referral: Share2,
  bonus: Star,
  locked: Lock,
};

const difficultyBadge = {
  easy: { label: 'Fácil', class: 'badge-success' },
  medium: { label: 'Medio', class: 'badge-warning' },
  hard: { label: 'Difícil', class: 'badge-violet' },
};

interface TaskListProps {
  onSectionTransition?: () => void;
  onTaskCompleted?: (grossCoins: number, taskName: string) => void;
}

export default function TaskList({ onSectionTransition, onTaskCompleted }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completing, setCompleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    setCompleting(taskId);
    await new Promise(resolve => setTimeout(resolve, 1200));

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      )
    );
    setCompleting(null);

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const bd = calculateEarnings(task.grossCoins);
      toast.success(`+${bd.userCoins} monedas ganadas 🪙`, {
        description: `"${task.title}" — Generó ${bd.grossCoins} 🪙 · Tu 70%: +${bd.userCoins} 🪙`,
      });
      // Notify parent with real gross coins so 70% is calculated centrally
      if (onTaskCompleted) {
        onTaskCompleted(task.grossCoins, task.title);
      }
      if (onSectionTransition) {
        setTimeout(() => onSectionTransition(), 600);
      }
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'available' | 'completed') => {
    if (newFilter !== filter && onSectionTransition) {
      onSectionTransition();
    }
    setFilter(newFilter);
  };

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'available') return t.status === 'available';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const availableCount = tasks.filter(t => t.status === 'available').length;
  const totalUserCoins = tasks
    .filter(t => t.status === 'available')
    .reduce((sum, t) => sum + calculateEarnings(t.grossCoins).userCoins, 0);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-base text-foreground">Tareas disponibles</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {availableCount} tareas · hasta{' '}
              <span className="text-primary font-semibold">{totalUserCoins.toLocaleString()} 🪙</span> para ti (70%)
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Zap size={12} className="text-primary" />
            <span className="text-xs font-medium text-primary">Bono activo ×2</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
          {(['all', 'available', 'completed'] as const).map(f => (
            <button
              key={`filter-${f}`}
              onClick={() => handleFilterChange(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                filter === f
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'available' ? 'Disponibles' : 'Completadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-border">
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={22} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground text-sm">No hay tareas en esta categoría</p>
            <p className="text-muted-foreground text-xs mt-1">Cambia el filtro para ver más tareas</p>
          </div>
        )}

        {filtered.map(task => {
          const IconComp = categoryIcon[task.category];
          const diff = difficultyBadge[task.difficulty];
          const isCompleting = completing === task.id;
          const isCompleted = task.status === 'completed';
          const isLocked = task.status === 'locked';
          const bd: EarningsBreakdown = calculateEarnings(task.grossCoins);
          const isExpanded = expandedTask === task.id;

          return (
            <div key={task.id}>
              <div
                className={`px-5 py-4 task-row-hover flex items-center gap-4 ${isCompleted ? 'opacity-60' : ''} ${isLocked ? 'opacity-50' : ''}`}
              >
                {/* Category Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-success/10'
                      : isLocked
                      ? 'bg-muted' :'gradient-coin'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <IconComp size={18} className={isLocked ? 'text-muted-foreground' : 'text-primary-foreground'} />
                  )}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
                    <span className={`${diff.class} px-1.5 py-0.5 rounded-full text-xs font-medium shrink-0`}>
                      {diff.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {/* User coins (70%) — prominent */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-success">+{bd.userCoins}</span>
                      <span className="text-xs text-muted-foreground">monedas (70%)</span>
                    </div>
                    {/* Gross value — secondary */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">de {bd.grossCoins} generados</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{task.estimatedTime}</span>
                    </div>
                    {/* Info toggle */}
                    {!isCompleted && !isLocked && (
                      <button
                        onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors"
                        aria-label="Ver desglose"
                      >
                        <Info size={10} />
                        <span>Desglose</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="badge-success px-2.5 py-1 rounded-full text-xs font-medium">
                      ✓ Hecha
                    </span>
                  ) : isLocked ? (
                    <span className="badge-muted px-2.5 py-1 rounded-full text-xs font-medium">
                      🔒 Bloqueada
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={isCompleting}
                      className="btn-primary px-3 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed min-w-[80px] justify-center"
                    >
                      {isCompleting ? (
                        <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          <Play size={11} />
                          Iniciar
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded breakdown panel */}
              {isExpanded && !isCompleted && !isLocked && (
                <div className="px-5 pb-4 bg-muted/20 border-t border-border">
                  <div className="rounded-xl bg-background/60 border border-border p-3 mt-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Desglose de ganancias en tiempo real</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Esta tarea genera</span>
                      <span className="font-semibold text-foreground">{bd.grossCoins} 🪙</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-success font-medium">Tu parte (70%)</span>
                      <span className="font-bold text-success">+{bd.userCoins} 🪙 ≈ ${bd.usdValue} USD</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Plataforma (30%)</span>
                      <span className="text-muted-foreground">{bd.platformCoins} 🪙</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-success" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}