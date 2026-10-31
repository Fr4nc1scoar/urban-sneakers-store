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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090a0f]/90 border-b border-white/[0.08]">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>¡Lanza tu estilo hoy! Calzados exclusivos — Paga de contado o llévatelos <strong>a crédito en cuotas quincenales</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-xl uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              URBAN <span className="text-rose-500">SNEAKERS</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
              Calzado Exclusivo & Crédito
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar Nike, Jordan, Adidas, McQueen, talla..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Direct WhatsApp Contact Button */}
          <a
            href={`https://api.whatsapp.com/send?phone=${ownerPhone}&text=${encodeURIComponent('Hola! Vengo de la tienda en línea y tengo una consulta sobre los zapatos disponibles.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
            title="Escribir al WhatsApp del vendedor"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">+58 424-8057420</span>
            <span className="lg:hidden">WhatsApp</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-700/70 hover:border-rose-500/60 text-slate-200 hover:text-white transition-all group"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-500" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-rose-600/50 animate-bounce-subtle">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar modelo, marca o talla..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </header>
  );
}
