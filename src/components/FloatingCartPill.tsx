'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '@/types';

interface FloatingCartPillProps {
  items: CartItem[];
  onOpenCart: () => void;
}

/**
 * Mobile-Adaptive Floating Dynamic Island Cart Pill
 * Responsive layout:
 * - On Mobile: Ergonomically anchored at bottom-4 left-3 right-20, leaving room for WhatsApp button.
 * - On Desktop: Floats gracefully at bottom-6 left-6 (max-w-md).
 */
export default function FloatingCartPill({ items, onOpenCart }: FloatingCartPillProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (totalQuantity === 0) return null;

  return (
    <aside
      aria-label="Resumen de tu carrito de compras"
      className="fixed bottom-4 left-3 right-20 sm:right-auto sm:left-6 sm:bottom-6 lg:bottom-10 lg:left-10 z-40 sm:max-w-md animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div
        onClick={onOpenCart}
        data-interactive="true"
        className="group cursor-pointer flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 p-2 pr-3 sm:pr-4 lg:p-2.5 lg:pr-5 rounded-full bg-[#0d0f1b]/95 border border-rose-500/60 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(244,63,94,0.35)] hover:border-rose-400 hover:shadow-[0_12px_50px_rgba(244,63,94,0.6)] transition-all duration-300"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Animated Icon Circle */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-black text-[10px] sm:text-[11px] font-black flex items-center justify-center border-2 border-[#0d0f1b] shadow-md animate-bounce">
              {totalQuantity}
            </span>
          </div>

          {/* Amount & Pairs info */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-white font-black text-xs sm:text-base tracking-tight truncate">
                ${totalAmount} USD
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 whitespace-nowrap">
                {totalQuantity} {totalQuantity === 1 ? 'par' : 'pares'}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-300 font-medium hidden xs:flex items-center gap-1 truncate">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
              Crédito disponible
            </span>
          </div>
        </div>

        {/* Micro-CTA Button */}
        <div className="pl-2 sm:pl-3 sm:border-l border-white/10 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-400 group-hover:text-white transition-colors flex-shrink-0">
          <span className="hidden sm:inline">Ver Carrito</span>
          <span className="sm:hidden">Ver</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </aside>
  );
}
