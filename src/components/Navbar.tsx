'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, MessageCircle, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  ownerPhone?: string;
  storeName?: string;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  ownerPhone = '584248057420',
  storeName = 'Urban Sneakers',
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#06060c]/90 border-b border-white/[0.08]">
      {/* Top Colorful Announcement Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>
          ¡Calzados exclusivos en stock! Llévatelos de contado o <strong className="underline decoration-amber-300 decoration-2">a crédito en 2 o más cuotas quincenales</strong>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with Electric Gradient */}
        <Link href="/" data-interactive="true" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-fuchsia-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_25px_rgba(244,63,94,0.6)] group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(244,63,94,0.8)] transition-all">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-xl uppercase text-white">
              URBAN <span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">SNEAKERS</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              Calzado Exclusivo & Crédito
            </span>
          </div>
        </Link>

        {/* Search Bar with Neon Focus */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar Nike, Jordan, Adidas, McQueen, talla..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/[0.1] rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Direct WhatsApp Contact Link */}
          <a
            href={`https://api.whatsapp.com/send?phone=${ownerPhone}&text=${encodeURIComponent('Hola, vengo de la tienda web y quisiera consultar sobre los zapatos y opciones de credito.')}`}
            target="_blank"
            rel="noopener noreferrer"
            data-interactive="true"
            data-cursor-text="WHATSAPP"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all"
            title="Escribir al WhatsApp del vendedor"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">+58 424-8057420</span>
            <span className="lg:hidden">WhatsApp</span>
          </a>

          {/* Cart Button with Glow */}
          <button
            onClick={onOpenCart}
            data-interactive="true"
            data-cursor-text="CARRITO"
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-rose-500/70 text-slate-200 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all group"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-rose-600/70 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
