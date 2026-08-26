'use client';

import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Bell, ChevronDown, LogOut, Settings, User, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface TopbarProps {
  coinBalance: number;
}

export default function Topbar({ coinBalance }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = 'GARV-XXXXXX';

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
            Garveco<span className="text-primary">Rewards</span>
          </span>
        </Link>

        {/* Center — Coin Balance Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border shine-animation">
          <span className="text-lg coin-bounce" role="img" aria-label="coin">🪙</span>
          <span className="font-bold text-primary tabular-nums text-sm sm:text-base">{coinBalance.toLocaleString()}</span>
          <span className="text-muted-foreground text-xs hidden sm:block">coins</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Panel Button */}
          <Link
            href="/admin"
            className="relative p-2 rounded-lg btn-secondary"
            aria-label="Admin Panel"
            title="Admin Panel"
          >
            <Settings size={18} className="text-primary/70" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
              className="relative p-2 rounded-lg btn-secondary"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-muted-foreground" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-xl shadow-card-hover z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-semibold text-sm">Notificaciones</span>
                </div>
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell size={28} className="text-muted-foreground mb-2 opacity-40" />
                  <p className="text-sm text-muted-foreground">Sin notificaciones aún</p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-70">
                    Aquí aparecerán tus ganancias y alertas
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg btn-secondary"
            >
              <div className="w-7 h-7 rounded-full gradient-coin flex items-center justify-center shrink-0">
                <User size={14} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Mi cuenta</span>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl shadow-card-hover z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-sm">Mi cuenta</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Usuario registrado</p>
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-muted/50 mb-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Código de referido</p>
                      <p className="text-xs font-mono font-bold text-primary">{referralCode}</p>
                    </div>
                    <button onClick={handleCopyReferral} className="p-1.5 rounded-md hover:bg-border transition-colors">
                      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-muted-foreground" />}
                    </button>
                  </div>
                  <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors">
                    <User size={15} className="text-muted-foreground" />
                    Mi perfil
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors">
                    <Settings size={15} className="text-muted-foreground" />
                    Configuración
                  </button>
                </div>
                <div className="px-3 pb-2 border-t border-border pt-2">
                  <Link
                    href="/sign-up-login-screen"
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Cerrar sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(dropdownOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setDropdownOpen(false); setNotifOpen(false); }}
        />
      )}
    </header>
  );
}