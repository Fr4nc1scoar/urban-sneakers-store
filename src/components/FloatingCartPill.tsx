'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '@/types';

interface FloatingCartPillProps {
  items: CartItem[];
  onOpenCart: () => void;
}

/**
 * Floating Dynamic Island Cart Pill (Fintech & Luxury E-commerce style)
 * Appears dynamically when items are in cart with glowing specular rim,
 * live subtotal counter, and instant 1-click checkout trigger.
 */
export default function FloatingCartPill({ items, onOpenCart }: FloatingCartPillProps) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalQuantity === 0) return null;

  return (
    <aside
      aria-label="Resumen de tu carrito de compras"
      className="fixed bottom-6 left-6 lg:bottom-10 lg:left-10 z-40 max-w-md animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div
        onClick={onOpenCart}
        data-interactive="true"
        data-cursor-text="CARRITO"
        className="group cursor-pointer flex items-center gap-3.5 p-2 pr-4 lg:p-2.5 lg:pr-5 rounded-full bg-[#0d0f1b]/95 border border-[#D1C4FF]/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(209,196,255,0.25)] hover:border-[#D1C4FF] hover:shadow-[0_12px_50px_rgba(209,196,255,0.35)] transition-all duration-300"
      >
        {/* Animated Icon Circle */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#D1C4FF] text-[#06060c] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
          <ShoppingBag className="w-5 h-5 text-black stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-[#0d0f1b] shadow-md animate-bounce">
            {totalQuantity}
          </span>
        </div>

        {/* Amount & Pairs info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-sm lg:text-base tracking-tight">
              ${totalAmount} USD
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D1C4FF]/15 text-[#D1C4FF] border border-[#D1C4FF]/30">
              {totalQuantity} {totalQuantity === 1 ? 'par' : 'pares'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D1C4FF]" />
            Crédito disponible en cuotas
          </span>
        </div>

        {/* Micro-CTA Button */}
        <div className="ml-2 pl-3 border-l border-white/10 flex items-center gap-1 text-xs font-bold text-[#D1C4FF] group-hover:text-white transition-colors">
          <span>Ver Carrito</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </aside>
  );
}
