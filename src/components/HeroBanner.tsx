'use client';

import React from 'react';
import { Flame, CreditCard, Truck, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCreditInfoClick: () => void;
  totalProducts?: number;
}

export default function HeroBanner({
  onExploreClick,
  onCreditInfoClick,
  totalProducts = 291,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/[0.08] z-10">
      {/* Decorative ambient auras */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-rose-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[340px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[420px] h-[340px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Energetic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 via-fuchsia-500/15 to-amber-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold tracking-widest uppercase mb-6 backdrop-blur-2xl shadow-[0_0_25px_rgba(244,63,94,0.3)]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Colección Urbana 2026 // Stock en Vivo</span>
          </div>

          {/* Main Title with Colorful Shimmer & Neon Streetwear Gradients */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.05] mb-6">
            <span className="animate-text-shimmer block drop-shadow-[0_4px_30px_rgba(244,63,94,0.35)]">
              ELEVA TU ESTILO.
            </span>
            <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_4px_35px_rgba(245,158,11,0.35)]">
              PAGA A TU RITMO.
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Descubre los calzados más buscados: <strong className="text-white">Nike, Jordan, Adidas, New Balance, McQueen</strong> y más. Llévatelos de contado o <strong className="text-amber-400 font-bold">adquiérelos en 2 o más cuotas quincenales</strong> acordadas directamente con la tienda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onExploreClick}
              data-interactive="true"
              data-cursor-text="EXPLORAR"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black text-white neon-button-glow transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Ver Catálogo Disponible ({totalProducts})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onCreditInfoClick}
              data-interactive="true"
              data-cursor-text="CRÉDITO"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center justify-center gap-2 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>¿Cómo funciona el Crédito?</span>
            </button>
          </div>

          {/* Feature Highlights Grid - High Voltage Color Identity */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-left">
            {/* Card 1: Calidad Premium (Rose Neon) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/30 to-[#0c0d18]/90 border border-rose-500/40 hover:border-rose-400 backdrop-blur-2xl shadow-[0_0_25px_-5px_rgba(244,63,94,0.2)] hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all group cursor-default">
              <div className="flex items-center gap-2.5 mb-1.5 text-rose-400">
                <Sparkles className="w-4 h-4 group-hover:scale-120 group-hover:rotate-12 transition-transform text-rose-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Calidad Premium</span>
              </div>
              <p className="text-xs text-rose-200/70">Modelos exclusivos y en tendencia</p>
            </div>

            {/* Card 2: 2 o Más Cuotas (Amber Gold Neon) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/30 to-[#0c0d18]/90 border border-amber-500/40 hover:border-amber-400 backdrop-blur-2xl shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all group cursor-default">
              <div className="flex items-center gap-2.5 mb-1.5 text-amber-400">
                <CreditCard className="w-4 h-4 group-hover:scale-120 transition-transform text-amber-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">2 o Más Cuotas</span>
              </div>
              <p className="text-xs text-amber-200/70">Pagos quincenales a convenir</p>
            </div>

            {/* Card 3: Envíos Directos (Emerald Mint Neon) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-[#0c0d18]/90 border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-2xl shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all group cursor-default">
              <div className="flex items-center gap-2.5 mb-1.5 text-emerald-400">
                <Truck className="w-4 h-4 group-hover:scale-120 transition-transform text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Envíos Directos</span>
              </div>
              <p className="text-xs text-emerald-200/70">Envíos o entregas personales</p>
            </div>

            {/* Card 4: Stock en Vivo (Cyber Cyan Neon) */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-950/30 to-[#0c0d18]/90 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-2xl shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all group cursor-default">
              <div className="flex items-center gap-2.5 mb-1.5 text-cyan-400">
                <Flame className="w-4 h-4 group-hover:scale-120 transition-transform text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Stock en Vivo</span>
              </div>
              <p className="text-xs text-cyan-200/70">Tallas reales sincronizadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
