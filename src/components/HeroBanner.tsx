'use client';

import React from 'react';
import { Flame, CreditCard, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onCreditInfoClick: () => void;
  totalProducts?: number;
}

export default function HeroBanner({
  onExploreClick,
  onCreditInfoClick,
  totalProducts = 290,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-16 bg-gradient-to-b from-[#090a0f] via-[#11131c] to-[#090a0f] border-b border-white/[0.06]">
      {/* Background ambient decorative blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Colección Urbana 2026 // Stock Sincronizado</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[1.1] mb-6">
            ELEVA TU ESTILO.{' '}
            <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              PAGA A TU RITMO.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Descubre los calzados más buscados: <strong className="text-white">Nike, Jordan, Adidas, New Balance, McQueen</strong> y más. Todos a un precio único de <strong className="text-rose-400">$50 USD</strong>. Llévatelos de contado o difiérelo en <strong className="text-white">2 cuotas quincenales</strong> sin trabas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white glass-button-glow transition-all flex items-center justify-center gap-2 group"
            >
              <span>Ver Catálogo Disponible ({totalProducts})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onCreditInfoClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>¿Cómo funciona el Crédito?</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-1 text-rose-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Precio Único</span>
              </div>
              <p className="text-xs text-slate-400">Todos los modelos a solo $50</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-1 text-amber-400">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">2 Cuotas</span>
              </div>
              <p className="text-xs text-slate-400">Pagos quincenales de $25</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-1 text-emerald-400">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Envíos Directos</span>
              </div>
              <p className="text-xs text-slate-400">A toda Venezuela o entregas</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-1 text-blue-400">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Stock en Vivo</span>
              </div>
              <p className="text-xs text-slate-400">Tallas reales sincronizadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
