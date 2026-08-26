'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Gift, Lock, Unlock, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getUserCatalogReward,
  getUnlockedBalance,
  getNextWithdrawalDate,
  registerCatalogUser } from
'@/lib/catalogRewardsStore';
import { getUserSession } from '@/lib/userStore';
import { getSheinCatalogLink } from '@/lib/sheinLinkStore';

// ─── Shein Product Data ───────────────────────────────────────────────────────

const SHEIN_PRODUCTS = [
{
  id: 'sh1',
  name: 'Vestido Floral Verano',
  price: '$12.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aae9d4f4-1772642571596.png",
  alt: 'Vestido floral de verano con estampado de flores coloridas',
  reward: 50,
  category: 'Vestidos'
},
{
  id: 'sh2',
  name: 'Blusa Casual Manga Corta',
  price: '$8.49',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1542763a1-1764637973860.png",
  alt: 'Blusa casual de manga corta en color blanco',
  reward: 30,
  category: 'Blusas'
},
{
  id: 'sh3',
  name: 'Jeans Skinny Azul',
  price: '$19.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_157241d39-1775307895186.png",
  alt: 'Jeans skinny de color azul oscuro para mujer',
  reward: 70,
  category: 'Pantalones'
},
{
  id: 'sh4',
  name: 'Conjunto Deportivo Rosa',
  price: '$24.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f56247fa-1772147018712.png",
  alt: 'Conjunto deportivo de color rosa con top y leggings',
  reward: 90,
  category: 'Deportivo'
},
{
  id: 'sh5',
  name: 'Falda Midi Plisada',
  price: '$14.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3f3a96c-1785201348488.png",
  alt: 'Falda midi plisada de color beige elegante',
  reward: 55,
  category: 'Faldas'
},
{
  id: 'sh6',
  name: 'Chaqueta Denim Clásica',
  price: '$29.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b59b22e2-1772186328451.png",
  alt: 'Chaqueta denim clásica azul con botones dorados',
  reward: 100,
  category: 'Chaquetas'
},
{
  id: 'sh7',
  name: 'Top Crop Estampado',
  price: '$7.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e9a1baa5-1767964419102.png",
  alt: 'Top crop con estampado tropical de colores vivos',
  reward: 25,
  category: 'Tops'
},
{
  id: 'sh8',
  name: 'Vestido Elegante Noche',
  price: '$34.99',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13bbb0dca-1772990711622.png",
  alt: 'Vestido elegante negro para noche con escote en V',
  reward: 120,
  category: 'Vestidos'
}];


const WHATSAPP_NUMBER = '5215512345678'; // Replace with actual WhatsApp number
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola! Acabo de comprar un producto del catálogo Shein. Te envío la foto junto con mi correo para que me otorguen la recompensa. 📸'
);

// ─── Progress Bar Component ───────────────────────────────────────────────────

interface CatalogProgressBarProps {
  email: string;
}

function CatalogProgressBar({ email }: CatalogProgressBarProps) {
  const [balance, setBalance] = useState(0);
  const [unlockedBalance, setUnlockedBalance] = useState(0);
  const [nextDate, setNextDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const entry = getUserCatalogReward(email);
    const unlocked = getUnlockedBalance(email);
    const next = getNextWithdrawalDate(email);
    setBalance(entry?.balance || 0);
    setUnlockedBalance(unlocked);
    setNextDate(next);

    // Register user in catalog system
    registerCatalogUser(email);
  }, [email]);

  if (!mounted) return null;

  const DISPLAY_CAP = 500;
  const percent = balance === 0 ? 0 : Math.min(Math.round(balance / DISPLAY_CAP * 100), 100);
  const lockedBalance = balance - unlockedBalance;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Gift size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">Mis Recompensas del Catálogo</h3>
          <p className="text-xs text-muted-foreground">Progreso de compras Shein</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xl font-bold text-pink-500 tabular-nums">{balance}</p>
          <p className="text-xs text-muted-foreground">🪙 totales</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progreso acumulado</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700"
            style={{ width: `${percent}%` }} />
          
        </div>
      </div>

      {/* Locked / Unlocked */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Unlock size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">Disponible</span>
          </div>
          <p className="text-lg font-bold text-green-400 tabular-nums">{unlockedBalance}</p>
          <p className="text-xs text-muted-foreground">🪙 para retirar</p>
        </div>
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Lock size={12} className="text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">Bloqueado</span>
          </div>
          <p className="text-lg font-bold text-yellow-400 tabular-nums">{lockedBalance}</p>
          <p className="text-xs text-muted-foreground">🪙 en espera</p>
        </div>
      </div>

      {/* Next withdrawal date */}
      {nextDate &&
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 px-3 py-2.5">
          <Lock size={13} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300 leading-relaxed">
            <span className="font-semibold">Próximo desbloqueo:</span> {formatDate(nextDate)}. Las recompensas se liberan exactamente 1 mes después de la compra.
          </p>
        </div>
      }

      {balance === 0 &&
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-pink-500/10 border border-pink-500/20 px-3 py-2.5">
          <Gift size={13} className="text-pink-400 shrink-0 mt-0.5" />
          <p className="text-xs text-pink-300 leading-relaxed">
            Compra productos del catálogo Shein y envía la foto por WhatsApp para acumular recompensas virtuales.
          </p>
        </div>
      }
    </div>);

}

// ─── Main Shein Catalog Section ───────────────────────────────────────────────

export default function SheinCatalogSection() {
  const [userEmail, setUserEmail] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sheinLink, setSheinLink] = useState('');

  useEffect(() => {
    setMounted(true);
    const session = getUserSession();
    if (session?.email) {
      setUserEmail(session.email);
    }
    const savedLink = getSheinCatalogLink();
    setSheinLink(savedLink);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  // Use admin-saved Shein link for product cards; fall back to WhatsApp if not set
  const productHref = sheinLink || whatsappUrl;

  return (
    <section className="rounded-2xl border border-pink-500/30 bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/15 hover:to-rose-500/15 transition-colors">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              Catálogo Shein
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-medium">
                ¡Gana recompensas!
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">Compra y acumula monedas virtuales</p>
          </div>
        </div>
        {expanded ?
        <ChevronUp size={18} className="text-muted-foreground shrink-0" /> :
        <ChevronDown size={18} className="text-muted-foreground shrink-0" />
        }
      </button>

      {expanded &&
      <div className="p-5 border-t border-pink-500/20">
          {/* Progress Bar for logged-in user */}
          {mounted && userEmail &&
        <CatalogProgressBar email={userEmail} />
        }

          {/* WhatsApp CTA Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground mb-1">¿Cómo obtener tu recompensa?</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Al comprar el producto, envía la foto por WhatsApp junto con tu correo para otorgar la recompensa.
                </p>
                <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white text-sm font-semibold transition-colors">
                
                  <MessageCircle size={16} />
                  Enviar foto por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Gift size={12} /> Recompensas virtuales por compra
            </span>
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Lock size={12} /> Retiro disponible 1 mes después
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SHEIN_PRODUCTS.map((product) =>
          <a
            key={product.id}
            href={productHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-border bg-background/60 overflow-hidden hover:border-pink-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer">
            
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy" />
              
                  {/* Reward badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-pink-500 text-white text-xs font-bold shadow-lg">
                    +{product.reward} 🪙
                  </div>
                  {/* Category badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium">
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-pink-500">{product.price}</span>
                    <span className="text-xs text-muted-foreground">+{product.reward}🪙</span>
                  </div>
                  {/* WhatsApp mini button */}
                  <div className="mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle size={11} />
                    Comprar y ganar
                  </div>
                </div>
              </a>
          )}
          </div>

          {/* Bottom WhatsApp reminder */}
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted/50 border border-border px-4 py-3">
            <MessageCircle size={16} className="text-green-400 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Recuerda:</span> Después de comprar cualquier producto, envía la foto del comprobante junto con tu correo electrónico por WhatsApp para que el administrador te acredite tu recompensa.
            </p>
          </div>
        </div>
      }
    </section>);

}