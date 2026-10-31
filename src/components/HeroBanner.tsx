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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D1C4FF]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[320px] bg-[#00F0FF]/08 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#D1C4FF]/30 text-[#D1C4FF] text-xs font-mono font-bold tracking-widest uppercase mb-6 backdrop-blur-2xl shadow-[0_0_25px_rgba(209,196,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#D1C4FF] animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-[#D1C4FF]" />
            <span>Colección Urbana 2026 // Stock en Vivo</span>
          </div>

          {/* Main Title with Luxury Shimmer */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.05] mb-6">
            <span className="animate-text-shimmer block">ELEVA TU ESTILO.</span>
            <span className="bg-gradient-to-r from-white via-[#D1C4FF] to-white/70 bg-clip-text text-transparent">
              PAGA A TU RITMO.
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Descubre los calzados más buscados: <strong className="text-white">Nike, Jordan, Adidas, New Balance, McQueen</strong> y más. Llévatelos de contado o <strong className="text-[#D1C4FF] font-bold">adquiérelos en 2 o más cuotas quincenales</strong> acordadas directamente con la tienda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onExploreClick}
              data-interactive="true"
              data-cursor-text="EXPLORAR"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black text-[#06060c] glass-button-glow transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Ver Catálogo Disponible ({totalProducts})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={onCreditInfoClick}
              data-interactive="true"
              data-cursor-text="CRÉDITO"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#D1C4FF]/50 transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
            >
              <CreditCard className="w-4 h-4 text-[#D1C4FF]" />
              <span>¿Cómo funciona el Crédito?</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-left">
            <div className="p-4 rounded-3xl bg-[#0c0d18]/80 border border-white/[0.08] hover:border-[#D1C4FF]/40 backdrop-blur-2xl transition-all group">
              <div className="flex items-center gap-2.5 mb-1.5 text-[#D1C4FF]">
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Calidad Premium</span>
              </div>
              <p className="text-xs text-slate-400">Modelos exclusivos y en tendencia</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#0c0d18]/80 border border-white/[0.08] hover:border-[#D1C4FF]/40 backdrop-blur-2xl transition-all group">
              <div className="flex items-center gap-2.5 mb-1.5 text-[#D1C4FF]">
                <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">2 o Más Cuotas</span>
              </div>
              <p className="text-xs text-slate-400">Pagos quincenales a convenir</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#0c0d18]/80 border border-white/[0.08] hover:border-emerald-400/40 backdrop-blur-2xl transition-all group">
              <div className="flex items-center gap-2.5 mb-1.5 text-emerald-400">
                <Truck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Envíos Directos</span>
              </div>
              <p className="text-xs text-slate-400">Envíos o entregas personales</p>
            </div>

            <div className="p-4 rounded-3xl bg-[#0c0d18]/80 border border-white/[0.08] hover:border-cyan-400/40 backdrop-blur-2xl transition-all group">
              <div className="flex items-center gap-2.5 mb-1.5 text-cyan-400">
                <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Stock en Vivo</span>
              </div>
              <p className="text-xs text-slate-400">Tallas reales sincronizadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
