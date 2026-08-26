'use client';

import React, { useState, useCallback, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart2,
  Globe,
  Wifi,
  Info,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { SOCIAL_LINKS_KEY } from '../components/SocialFollowSection';
import { getPlatforms, savePlatforms } from '@/lib/platformStore';
import type { Platform } from '@/lib/platformStore';
import { getAllCatalogRewards, addCatalogReward } from '@/lib/catalogRewardsStore';
import { getSheinCatalogLink, saveSheinCatalogLink } from '@/lib/sheinLinkStore';

// ─── Types ───────────────────────────────────────────────────────────────────

interface WithdrawalRequest {
  id: string;
  user: string;
  email: string;
  paypalEmail: string;
  amount: number;
  coins: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialWithdrawals: WithdrawalRequest[] = [
  { id: 'w1', user: 'Miguel Rodríguez', email: 'miguel.r@gmail.com', paypalEmail: 'miguel.paypal@gmail.com', amount: 5.00, coins: 5000, requestedAt: '2026-08-24 18:30', status: 'pending' },
  { id: 'w2', user: 'Ana García', email: 'ana.g@gmail.com', paypalEmail: 'ana.garcia@paypal.com', amount: 10.00, coins: 10000, requestedAt: '2026-08-24 15:12', status: 'pending' },
  { id: 'w3', user: 'Carlos López', email: 'carlos.l@gmail.com', paypalEmail: 'carloslopez@paypal.com', amount: 25.00, coins: 25000, requestedAt: '2026-08-23 09:45', status: 'pending' },
  { id: 'w4', user: 'Laura Martínez', email: 'laura.m@gmail.com', paypalEmail: 'laura.m@paypal.com', amount: 7.50, coins: 7500, requestedAt: '2026-08-22 20:00', status: 'approved' },
  { id: 'w5', user: 'Pedro Sánchez', email: 'pedro.s@gmail.com', paypalEmail: 'pedro.s@paypal.com', amount: 3.00, coins: 3000, requestedAt: '2026-08-21 11:30', status: 'rejected' },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const TOTAL_PLATFORM_REVENUE = 1842.50;
const USER_SHARE = TOTAL_PLATFORM_REVENUE * 0.7;
const ADMIN_SHARE = TOTAL_PLATFORM_REVENUE * 0.3;
const TOTAL_USERS = 312;
const TOTAL_WITHDRAWALS_PAID = 487.50;

// ─── Platform Type Labels ─────────────────────────────────────────────────────

const typeLabels: Record<Platform['type'], string> = {
  ad_network: 'Red de Anuncios',
  offerwall: 'Offerwall',
  monetization: 'Monetización',
};

const typeBadgeClass: Record<Platform['type'], string> = {
  ad_network: 'badge-violet',
  offerwall: 'badge-warning',
  monetization: 'badge-success',
};

const providerLabels: Record<string, string> = {
  unity: 'Unity Ads',
  theoremreach: 'TheoremReach',
  propellerads: 'PropellerAds',
  monetag: 'Monetag',
  other: 'Otro',
};

// ─── Password Gate ────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = 'pleve47';

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="flex justify-center mb-8">
          <Shield className="w-10 h-10 text-yellow-500" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Contraseña"
            autoFocus
            className={`w-full bg-gray-900 text-white text-center text-lg rounded-xl px-4 py-3 outline-none border ${error ? 'border-red-500' : 'border-gray-700 focus:border-yellow-500'} transition-colors placeholder-gray-600`}
          />
          {error && (
            <p className="text-red-400 text-sm text-center">Contraseña incorrecta</p>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-semibold rounded-xl py-3 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Section 1: Platform IDs ──────────────────────────────────────────────────

function PlatformSection() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => getPlatforms());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Platform>>({});
  const [newForm, setNewForm] = useState<Partial<Platform>>({ type: 'ad_network', provider: 'other', status: 'active' });

  const updatePlatforms = useCallback((updated: Platform[]) => {
    savePlatforms(updated);
    setPlatforms(updated);
  }, []);

  const startEdit = (p: Platform) => {
    setEditingId(p.id);
    setEditForm({ ...p });
    setShowAddForm(false);
  };

  const saveEdit = () => {
    if (!editForm.name) return;
    const updated = platforms.map(p =>
      p.id === editingId ? { ...p, ...editForm } as Platform : p
    );
    updatePlatforms(updated);
    setEditingId(null);
  };

  const deletePlatform = (id: string) => {
    updatePlatforms(platforms.filter(p => p.id !== id));
  };

  const addPlatform = () => {
    if (!newForm.name) return;
    const newP: Platform = {
      id: `p${Date.now()}`,
      name: newForm.name!,
      type: (newForm.type as Platform['type']) || 'ad_network',
      provider: (newForm.provider as Platform['provider']) || 'other',
      platformId: newForm.platformId || '',
      apiKey: newForm.apiKey || '',
      status: (newForm.status as Platform['status']) || 'active',
      gameId: newForm.gameId || '',
      bannerPlacementId: newForm.bannerPlacementId || '',
      interstitialPlacementId: newForm.interstitialPlacementId || '',
      rewardedPlacementId: newForm.rewardedPlacementId || '',
      zoneId: newForm.zoneId || '',
      postbackUrl: newForm.postbackUrl || '',
      totalEarnings: 0,
      userEarnings: 0,
      adminEarnings: 0,
      completedActions: 0,
    };
    updatePlatforms([...platforms, newP]);
    setNewForm({ type: 'ad_network', provider: 'other', status: 'active' });
    setShowAddForm(false);
  };

  // Render the correct fields based on provider/type
  const renderProviderFields = (
    form: Partial<Platform>,
    setForm: React.Dispatch<React.SetStateAction<Partial<Platform>>>
  ) => {
    const provider = form.provider || 'other';

    if (provider === 'unity') {
      return (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Game ID de la App</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: 800109760"
              value={form.gameId || ''} onChange={e => setForm(f => ({ ...f, gameId: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Banner Placement ID</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: Banner_Android"
              value={form.bannerPlacementId || ''} onChange={e => setForm(f => ({ ...f, bannerPlacementId: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Interstitial Placement ID</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: Interstitial_Android"
              value={form.interstitialPlacementId || ''} onChange={e => setForm(f => ({ ...f, interstitialPlacementId: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Rewarded Placement ID</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: Rewarded_Android"
              value={form.rewardedPlacementId || ''} onChange={e => setForm(f => ({ ...f, rewardedPlacementId: e.target.value }))} />
          </div>
        </>
      );
    }

    if (provider === 'propellerads' || provider === 'monetag') {
      const networkName = provider === 'propellerads' ? 'PropellerAds' : 'Monetag';
      return (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Publisher ID / App ID</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono"
              placeholder={provider === 'propellerads' ? 'Ej: 1234567' : 'Ej: 8901234'}
              value={form.platformId || ''} onChange={e => setForm(f => ({ ...f, platformId: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Zone ID</label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono"
              placeholder="Ej: 9876543"
              value={form.zoneId || ''} onChange={e => setForm(f => ({ ...f, zoneId: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">
              URL de Postback (para registrar ganancias reales)
            </label>
            <input className="input-field w-full px-3 py-2 text-sm font-mono"
              placeholder={`https://garvecorewards.com/api/${provider}-postback?reward={reward}&uid={uid}`}
              value={form.postbackUrl || ''} onChange={e => setForm(f => ({ ...f, postbackUrl: e.target.value }))} />
            <p className="text-xs text-muted-foreground mt-1">
              Configura esta URL en el panel de {networkName} para recibir el valor real de cada conversión.
            </p>
          </div>
        </>
      );
    }

    // Default: App ID + API Key
    return (
      <>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">App ID</label>
          <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: ca-pub-XXXXXXXX"
            value={form.platformId || ''} onChange={e => setForm(f => ({ ...f, platformId: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Clave API / Llave Secreta</label>
          <input className="input-field w-full px-3 py-2 text-sm font-mono" placeholder="Ej: sk-XXXXXXXXXXXXXXXX"
            value={form.apiKey || ''} onChange={e => setForm(f => ({ ...f, apiKey: e.target.value }))} />
        </div>
      </>
    );
  };

  // Render display values for a platform card
  const renderPlatformDisplay = (p: Platform) => {
    if (p.provider === 'unity') {
      return (
        <div className="flex flex-col gap-0.5 mt-0.5">
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Game ID: </span>{p.gameId || '—'}</p>
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Banner: </span>{p.bannerPlacementId || '—'}</p>
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Interstitial: </span>{p.interstitialPlacementId || '—'}</p>
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Rewarded: </span>{p.rewardedPlacementId || '—'}</p>
        </div>
      );
    }
    if (p.provider === 'propellerads' || p.provider === 'monetag') {
      return (
        <div className="flex flex-col gap-0.5 mt-0.5">
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Publisher ID: </span>{p.platformId || '—'}</p>
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Zone ID: </span>{p.zoneId || '—'}</p>
          <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">Postback: </span>{p.postbackUrl ? '✓ Configurado' : '—'}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-0.5 mt-0.5">
        <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">App ID: </span>{p.platformId || '—'}</p>
        <p className="text-xs font-mono text-muted-foreground truncate"><span className="text-muted-foreground/60 not-mono font-sans">API Key: </span>{p.apiKey ? '••••••••' : '—'}</p>
      </div>
    );
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<ExternalLink size={18} className="text-primary-foreground" />}
        title="Plataformas Externas"
        subtitle="Configura redes de anuncios, offerwalls y monetización"
      />

      <div className="space-y-3">
        {platforms.map(p => (
          <div key={p.id} className="rounded-xl border border-border bg-background/50 overflow-hidden">
            {editingId === p.id ? (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                    <input className="input-field w-full px-3 py-2 text-sm"
                      value={editForm.name || ''}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                    <select className="input-field w-full px-3 py-2 text-sm"
                      value={editForm.type || 'ad_network'}
                      onChange={e => setEditForm(f => ({ ...f, type: e.target.value as Platform['type'] }))}>
                      <option value="ad_network">Red de Anuncios</option>
                      <option value="offerwall">Offerwall</option>
                      <option value="monetization">Monetización</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Proveedor</label>
                    <select className="input-field w-full px-3 py-2 text-sm"
                      value={editForm.provider || 'other'}
                      onChange={e => setEditForm(f => ({ ...f, provider: e.target.value as Platform['provider'] }))}>
                      <option value="unity">Unity Ads</option>
                      <option value="theoremreach">TheoremReach</option>
                      <option value="cpxresearch">CPX Research</option>
                      <option value="propellerads">PropellerAds</option>
                      <option value="monetag">Monetag</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Estado</label>
                    <select className="input-field w-full px-3 py-2 text-sm"
                      value={editForm.status || 'active'}
                      onChange={e => setEditForm(f => ({ ...f, status: e.target.value as Platform['status'] }))}>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  {renderProviderFields(editForm, setEditForm)}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1.5">
                    <X size={14} /> Cancelar
                  </button>
                  <button onClick={saveEdit} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5">
                    <Save size={14} /> Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{p.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeClass[p.type]}`}>
                      {typeLabels[p.type]}
                    </span>
                    {p.provider && p.provider !== 'other' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {providerLabels[p.provider]}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'active' ? 'badge-success' : 'badge-muted'}`}>
                      {p.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {renderPlatformDisplay(p)}
                  {/* Earnings tracking row */}
                  {((p.totalEarnings ?? 0) > 0 || (p.completedActions ?? 0) > 0) && (
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BarChart2 size={11} className="text-primary" />
                        <span className="text-foreground font-medium">{p.completedActions ?? 0}</span> acciones
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Generó: <span className="text-foreground font-medium">{p.totalEarnings ?? 0} 🪙</span>
                      </span>
                      <span className="text-xs text-success">
                        Usuarios: <span className="font-medium">{p.userEarnings ?? 0} 🪙</span>
                      </span>
                      <span className="text-xs text-yellow-500">
                        Admin: <span className="font-medium">{p.adminEarnings ?? 0} 🪙</span>
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors" aria-label="Editar">
                    <Pencil size={14} className="text-primary" />
                  </button>
                  <button onClick={() => deletePlatform(p.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors" aria-label="Eliminar">
                    <Trash2 size={14} className="text-danger" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {platforms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay plataformas configuradas. Agrega una nueva.
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-primary">Nueva Plataforma</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
              <input className="input-field w-full px-3 py-2 text-sm" placeholder="Ej: PropellerAds"
                value={newForm.name || ''}
                onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
              <select className="input-field w-full px-3 py-2 text-sm"
                value={newForm.type || 'ad_network'}
                onChange={e => setNewForm(f => ({ ...f, type: e.target.value as Platform['type'] }))}>
                <option value="ad_network">Red de Anuncios</option>
                <option value="offerwall">Offerwall</option>
                <option value="monetization">Monetización</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Proveedor</label>
              <select className="input-field w-full px-3 py-2 text-sm"
                value={newForm.provider || 'other'}
                onChange={e => setNewForm(f => ({ ...f, provider: e.target.value as Platform['provider'] }))}>
                <option value="unity">Unity Ads</option>
                <option value="theoremreach">TheoremReach</option>
                <option value="cpxresearch">CPX Research</option>
                <option value="propellerads">PropellerAds</option>
                <option value="monetag">Monetag</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Estado</label>
              <select className="input-field w-full px-3 py-2 text-sm"
                value={newForm.status || 'active'}
                onChange={e => setNewForm(f => ({ ...f, status: e.target.value as Platform['status'] }))}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            {renderProviderFields(newForm, setNewForm)}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1.5">
              <X size={14} /> Cancelar
            </button>
            <button onClick={addPlatform} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5">
              <Save size={14} /> Agregar
            </button>
          </div>
        </div>
      )}

      {!showAddForm && (
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          <Plus size={16} /> Agregar Plataforma
        </button>
      )}
    </section>
  );
}

// ─── Section: Global Networks Guide ──────────────────────────────────────────

function GlobalNetworksSection() {
  const networks = [
    {
      name: 'PropellerAds',
      tag: 'Global · Venezuela ✓',
      tagColor: 'bg-green-500/10 text-green-400 border-green-500/20',
      icon: '🌐',
      description: 'Red global con excelente inventario en Latinoamérica, incluyendo Venezuela. Soporta banners, intersticiales, push notifications y anuncios nativos.',
      steps: [
        'Regístrate en propellerads.com como Publisher',
        'Crea una zona de anuncios (Banner / Interstitial / Rewarded)',
        'Copia tu Publisher ID y Zone ID',
        'Configura la URL de Postback para recibir el valor real de cada conversión',
        'Activa la plataforma en el panel y pega los IDs',
      ],
      postbackNote: 'El valor real de cada conversión llega vía Postback. Configura: https://garvecorewards.com/api/propellerads-postback?reward={reward}&uid={uid}',
    },
    {
      name: 'Monetag',
      tag: 'Global · Venezuela ✓',
      tagColor: 'bg-green-500/10 text-green-400 border-green-500/20',
      icon: '💰',
      description: 'Alternativa a PropellerAds con fuerte presencia en mercados emergentes. Especializado en pop-unders, push notifications y anuncios de video.',
      steps: [
        'Regístrate en monetag.com como Publisher',
        'Crea una zona de anuncios y obtén tu Zone ID',
        'Copia tu Publisher ID (App ID) y Zone ID',
        'Configura la URL de Postback para registrar ganancias reales',
        'Activa la plataforma en el panel y pega los IDs',
      ],
      postbackNote: 'El valor real de cada conversión llega vía Postback. Configura: https://garvecorewards.com/api/monetag-postback?reward={reward}&uid={uid}',
    },
    {
      name: 'Unity Ads',
      tag: 'Internacional',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: '🎮',
      description: 'Mantener activo para mercados internacionales (EE.UU., Europa, Asia). Excelente eCPM para anuncios de video recompensado en juegos.',
      steps: [
        'Ya configurado — mantener activo para mercados internacionales',
        'Editar la plataforma Unity Ads y actualizar Game ID y Placement IDs',
        'El valor real de cada anuncio recompensado viene del callback onRewardGranted',
      ],
      postbackNote: null,
    },
    {
      name: 'TheoremReach',
      tag: 'Internacional',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: '📋',
      description: 'Mantener activo para encuestas y offerwalls en mercados internacionales. El webhook ya está configurado en /api/theoremreach-webhook.',
      steps: [
        'Ya configurado — mantener activo para encuestas internacionales',
        'El valor real de cada encuesta llega vía webhook con el campo reward',
        'Cada reward se multiplica × 100 para convertir a monedas y se aplica el 70/30',
      ],
      postbackNote: null,
    },
  ];

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<Globe size={18} className="text-primary-foreground" />}
        title="Redes Globales e Internacionales"
        subtitle="Guía de integración para maximizar inventario en todas las regiones, incluyendo Venezuela"
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 mb-5">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300 leading-relaxed">
          <span className="font-semibold text-blue-200">Sistema 70/30 dinámico:</span> Todas las redes deben configurar su URL de Postback o Webhook para enviar el valor real de cada conversión. El sistema calcula automáticamente el 70% para el usuario y el 30% para la administración sobre ese valor real — nunca sobre montos fijos.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {networks.map((net) => (
          <div key={net.name} className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xl">{net.icon}</span>
              <span className="font-semibold text-sm text-foreground">{net.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${net.tagColor}`}>
                {net.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{net.description}</p>
            <div className="space-y-1.5 mb-3">
              {net.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            {net.postbackNote && (
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
                <p className="text-xs text-yellow-300 leading-relaxed">
                  <span className="font-semibold">Postback URL: </span>
                  <span className="font-mono break-all">{net.postbackNote.replace('Configura el Postback. Configura: ', '').replace('El valor real de cada conversión llega vía Postback. Configura: ', '')}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status summary */}
      <div className="mt-5 rounded-xl bg-background/60 border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={15} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Estado de Cobertura por Región</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { region: 'Venezuela 🇻🇪', networks: 'PropellerAds, Monetag', status: 'Activar' },
            { region: 'Latinoamérica 🌎', networks: 'PropellerAds, Monetag, TheoremReach', status: 'Activar' },
            { region: 'EE.UU. / Europa 🌍', networks: 'Unity Ads, TheoremReach', status: 'Activo' },
            { region: 'Asia / Global 🌏', networks: 'PropellerAds, Unity Ads', status: 'Activar' },
          ].map((r) => (
            <div key={r.region} className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-semibold text-foreground mb-1">{r.region}</p>
              <p className="text-xs text-muted-foreground mb-1.5">{r.networks}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: System Stats ──────────────────────────────────────────────────

function StatsSection() {
  const stats = [
    {
      label: 'Ingresos Totales',
      value: `$${TOTAL_PLATFORM_REVENUE.toFixed(2)}`,
      sub: 'Generados por la plataforma',
      icon: <TrendingUp size={18} className="text-primary-foreground" />,
      gradient: 'gradient-coin',
    },
    {
      label: 'Ganancia Usuarios (70%)',
      value: `$${USER_SHARE.toFixed(2)}`,
      sub: 'Distribuido entre usuarios',
      icon: <Users size={18} className="text-primary-foreground" />,
      gradient: 'gradient-violet',
    },
    {
      label: 'Ganancia Admin (30%)',
      value: `$${ADMIN_SHARE.toFixed(2)}`,
      sub: 'Comisión de la plataforma',
      icon: <DollarSign size={18} className="text-primary-foreground" />,
      gradient: 'gradient-coin',
    },
    {
      label: 'Usuarios Registrados',
      value: TOTAL_USERS.toLocaleString(),
      sub: 'Total en la plataforma',
      icon: <Users size={18} className="text-primary-foreground" />,
      gradient: 'gradient-violet',
    },
  ];

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<TrendingUp size={18} className="text-primary-foreground" />}
        title="Estadísticas del Sistema"
        subtitle="Resumen financiero con división 70% usuarios / 30% administrador"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-background/60 border border-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${s.gradient} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-xl font-bold text-foreground tabular-nums">{s.value}</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Split Visual */}
      <div className="rounded-xl bg-background/60 border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">División de Ingresos</span>
          <span className="text-xs text-muted-foreground">${TOTAL_PLATFORM_REVENUE.toFixed(2)} total</span>
        </div>
        <div className="flex rounded-full overflow-hidden h-4 mb-3">
          <div className="gradient-violet flex items-center justify-center text-xs font-bold text-white" style={{ width: '70%' }}>70%</div>
          <div className="gradient-coin flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ width: '30%' }}>30%</div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm gradient-violet inline-block" />
            <span className="text-muted-foreground">Usuarios — <span className="text-foreground font-medium">${USER_SHARE.toFixed(2)}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm gradient-coin inline-block" />
            <span className="text-muted-foreground">Admin — <span className="text-foreground font-medium">${ADMIN_SHARE.toFixed(2)}</span></span>
          </div>
        </div>
      </div>

      {/* Withdrawals paid */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-success/10 border border-success/20">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-success" />
          <span className="text-sm text-foreground font-medium">Total Pagado en Retiros</span>
        </div>
        <span className="text-success font-bold">${TOTAL_WITHDRAWALS_PAID.toFixed(2)}</span>
      </div>
    </section>
  );
}

// ─── Section 3: Withdrawals ───────────────────────────────────────────────────

function WithdrawalsSection() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(initialWithdrawals);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filtered = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);

  const updateStatus = (id: string, status: WithdrawalRequest['status']) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  const statusBadge = (status: WithdrawalRequest['status']) => {
    if (status === 'pending') return <span className="badge-warning text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Clock size={10} />Pendiente</span>;
    if (status === 'approved') return <span className="badge-success text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><CheckCircle size={10} />Aprobado</span>;
    return <span className="badge-danger text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><XCircle size={10} />Rechazado</span>;
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<DollarSign size={18} className="text-primary-foreground" />}
        title="Retiros PayPal Pendientes"
        subtitle="Gestiona y aprueba las solicitudes de retiro de los usuarios"
      />

      <div className="flex gap-2 mb-5 flex-wrap">
        {(['pending', 'all', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f === 'pending' && `Pendientes${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
            {f === 'all' && 'Todos'}
            {f === 'approved' && 'Aprobados'}
            {f === 'rejected' && 'Rechazados'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">No hay solicitudes en esta categoría.</div>
        )}
        {filtered.map(w => (
          <div key={w.id} className="rounded-xl border border-border bg-background/50 p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm text-foreground">{w.user}</span>
                  {statusBadge(w.status)}
                </div>
                <p className="text-xs text-muted-foreground">{w.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">PayPal: <span className="text-foreground font-mono">{w.paypalEmail}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">Solicitado: {w.requestedAt}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-success">${w.amount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{w.coins.toLocaleString()} monedas</p>
              </div>
            </div>
            {w.status === 'pending' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button onClick={() => updateStatus(w.id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-semibold hover:bg-success/20 transition-colors">
                  <CheckCircle size={13} /> Aprobar
                </button>
                <button onClick={() => updateStatus(w.id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/20 transition-colors">
                  <XCircle size={13} /> Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Social Links ────────────────────────────────────────────────────

function SocialLinksSection() {
  const [facebook, setFacebook] = React.useState('');
  const [youtube, setYoutube] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SOCIAL_LINKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFacebook(parsed.facebook || '');
        setYoutube(parsed.youtube || '');
      }
    } catch {}
  }, []);

  const handleSave = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify({ facebook, youtube }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<Share2 size={18} className="text-primary-foreground" />}
        title="Redes Sociales"
        subtitle="Configura los enlaces de Facebook y YouTube para la sección 'Seguir y Ganar'"
      />

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            📘 Enlace de Facebook (página o perfil)
          </label>
          <input
            className="input-field w-full px-3 py-2.5 text-sm"
            placeholder="https://www.facebook.com/tupagina"
            value={facebook}
            onChange={e => setFacebook(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Cuando el usuario haga clic y siga la página, recibirá +15 monedas automáticamente.
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            ▶️ Enlace de YouTube (canal)
          </label>
          <input
            className="input-field w-full px-3 py-2.5 text-sm"
            placeholder="https://www.youtube.com/@tucanal"
            value={youtube}
            onChange={e => setYoutube(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Cuando el usuario haga clic y se suscriba, recibirá +15 monedas automáticamente.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
        >
          {saved ? (
            <>
              <CheckCircle size={15} />
              ¡Guardado!
            </>
          ) : (
            <>
              <Save size={15} />
              Guardar enlaces
            </>
          )}
        </button>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle size={14} className="text-success shrink-0" />
            <span className="text-xs text-success font-medium">
              Los enlaces han sido guardados. Los usuarios ya pueden verlos y ganar monedas.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Shein Catalog Link ─────────────────────────────────────────────

function SheinLinkSection() {
  const [link, setLink] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setLink(getSheinCatalogLink());
  }, []);

  const handleSave = () => {
    saveSheinCatalogLink(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!mounted) return null;

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<ShoppingBag size={18} className="text-primary-foreground" />}
        title="Enlace del Catálogo Shein"
        subtitle="Pega aquí el enlace del catálogo para que los usuarios lo abran directamente"
      />

      <div className="flex items-start gap-3 rounded-xl bg-pink-500/10 border border-pink-500/20 px-4 py-3 mb-5">
        <Info size={16} className="text-pink-400 shrink-0 mt-0.5" />
        <p className="text-xs text-pink-300 leading-relaxed">
          <span className="font-semibold text-pink-200">¿Cómo funciona?</span> Pega el enlace del catálogo de Shein (o cualquier URL de producto). Cuando el usuario toque una tarjeta del catálogo en la pantalla de recompensas, será redirigido directamente a esa página.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
            🛍️ Shein — Enlace del catálogo (ID o URL completa)
          </label>
          <input
            type="url"
            className="input-field w-full px-3 py-2.5 text-sm font-mono"
            placeholder="https://es.shein.com/catalog/... o pega el ID del catálogo"
            value={link}
            onChange={e => { setLink(e.target.value); setSaved(false); }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Ejemplo: <span className="font-mono text-muted-foreground/80">https://es.shein.com/Women-Dresses-sc-00865751.html</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold"
          >
            {saved ? (
              <>
                <CheckCircle size={15} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save size={15} />
                Guardar enlace
              </>
            )}
          </button>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              <ExternalLink size={13} />
              Probar enlace
            </a>
          )}
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle size={14} className="text-success shrink-0" />
            <span className="text-xs text-success font-medium">
              Enlace guardado. Los usuarios serán redirigidos a esta URL al tocar el catálogo.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section: Catalog Rewards Manager ────────────────────────────────────────

function CatalogRewardsSection() {
  const [entries, setEntries] = React.useState<Array<{ email: string; balance: number }>>([]);
  const [inputValues, setInputValues] = React.useState<Record<string, string>>({});
  const [successMap, setSuccessMap] = React.useState<Record<string, boolean>>({});
  const [newEmail, setNewEmail] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  const loadEntries = React.useCallback(() => {
    const all = getAllCatalogRewards();
    setEntries(all.map(e => ({ email: e.email, balance: e.balance })));
  }, []);

  React.useEffect(() => {
    setMounted(true);
    loadEntries();
  }, [loadEntries]);

  const handleAdd = (email: string) => {
    const raw = inputValues[email] || '';
    const amount = parseInt(raw, 10);
    if (!amount || amount <= 0) return;
    addCatalogReward(email, amount);
    setInputValues(prev => ({ ...prev, [email]: '' }));
    setSuccessMap(prev => ({ ...prev, [email]: true }));
    setTimeout(() => setSuccessMap(prev => ({ ...prev, [email]: false })), 2500);
    loadEntries();
  };

  const handleAddNewUser = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    addCatalogReward(email, 0);
    setNewEmail('');
    loadEntries();
  };

  if (!mounted) return null;

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <SectionHeader
        icon={<ShoppingBag size={18} className="text-primary-foreground" />}
        title="Recompensas del Catálogo Shein"
        subtitle="Asigna manualmente el saldo de recompensa a cada usuario que compró"
      />

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-pink-500/10 border border-pink-500/20 px-4 py-3 mb-5">
        <Info size={16} className="text-pink-400 shrink-0 mt-0.5" />
        <div className="text-xs text-pink-300 leading-relaxed">
          <span className="font-semibold text-pink-200">¿Cómo funciona?</span> Cuando un usuario compra un producto del catálogo Shein y te envía la foto por WhatsApp con su correo, escribe el número de recompensa y presiona <strong>Sumar</strong>. El saldo se acreditará únicamente en la cuenta de ese correo. Las recompensas se desbloquean para retiro exactamente 1 mes después de ser asignadas.
        </div>
      </div>

      {/* Add new user */}
      <div className="flex gap-2 mb-5">
        <input
          type="email"
          className="input-field flex-1 px-3 py-2 text-sm"
          placeholder="correo@ejemplo.com — agregar nuevo usuario"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddNewUser()}
        />
        <button
          onClick={handleAddNewUser}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      {/* User list */}
      {entries.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
          <p>Aún no hay usuarios registrados en el catálogo.</p>
          <p className="text-xs mt-1 opacity-70">Agrega el correo de un usuario para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.email} className="rounded-xl border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{entry.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Saldo actual: <span className="text-pink-400 font-bold">{entry.balance} 🪙</span>
                  </p>
                </div>
                {successMap[entry.email] && (
                  <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle size={13} /> ¡Saldo sumado!
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  className="input-field w-28 px-3 py-2 text-sm text-center font-mono"
                  placeholder="Ej: 50"
                  value={inputValues[entry.email] || ''}
                  onChange={e => setInputValues(prev => ({ ...prev, [entry.email]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAdd(entry.email)}
                />
                <button
                  onClick={() => handleAdd(entry.email)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-semibold hover:bg-pink-500/20 transition-colors"
                >
                  <Plus size={14} /> Sumar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Collapsible Wrapper ──────────────────────────────────────────────────────

function CollapsibleSection({
  id, label, expandedId, onToggle, children,
}: {
  id: string; label: string; expandedId: string | null;
  onToggle: (id: string) => void; children: React.ReactNode;
}) {
  const isOpen = expandedId === id;
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-4 bg-card hover:bg-card/80 transition-colors">
        <span className="font-semibold text-foreground">{label}</span>
        {isOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>
      <div className={`border-t border-border transition-all duration-200 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPanelPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('stats');

  const handleToggle = useCallback((id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  }, []);

  if (!authenticated) {
    return <PasswordGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <AppLayout coinBalance={0}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-coin flex items-center justify-center">
              <Shield size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
              <p className="text-muted-foreground text-sm">Garveco Rewards — Control total</p>
            </div>
          </div>
        </div>

        <CollapsibleSection id="stats" label="Estadísticas del Sistema" expandedId={expandedSection} onToggle={handleToggle}>
          <StatsSection />
        </CollapsibleSection>

        <CollapsibleSection id="platforms" label="Plataformas Externas" expandedId={expandedSection} onToggle={handleToggle}>
          <PlatformSection />
        </CollapsibleSection>

        <CollapsibleSection id="social-links" label="📱 Redes Sociales — Seguir y Ganar" expandedId={expandedSection} onToggle={handleToggle}>
          <SocialLinksSection />
        </CollapsibleSection>

        <CollapsibleSection id="global-networks" label="🌐 Redes Globales — Guía de Integración" expandedId={expandedSection} onToggle={handleToggle}>
          <GlobalNetworksSection />
        </CollapsibleSection>

        <CollapsibleSection id="withdrawals" label="Retiros PayPal" expandedId={expandedSection} onToggle={handleToggle}>
          <WithdrawalsSection />
        </CollapsibleSection>

        <CollapsibleSection id="shein-link" label="🛍️ Enlace del Catálogo Shein" expandedId={expandedSection} onToggle={handleToggle}>
          <SheinLinkSection />
        </CollapsibleSection>

        <CollapsibleSection id="catalog-rewards" label="🛍️ Recompensas Catálogo Shein" expandedId={expandedSection} onToggle={handleToggle}>
          <CatalogRewardsSection />
        </CollapsibleSection>
      </div>
    </AppLayout>
  );
}
