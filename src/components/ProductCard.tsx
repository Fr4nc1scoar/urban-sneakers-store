'use client';

import React from 'react';
import { Product } from '@/types';
import { ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, preselectedSize?: number) => void;
  onQuickAdd: (product: Product, size: number) => void;
}

export default function ProductCard({
  product,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const brandColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    Nike: {
      bg: 'bg-rose-950/80',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
      glow: 'group-hover:border-rose-500/50 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
    },
    Jordan: {
      bg: 'bg-red-950/80',
      text: 'text-red-300',
      border: 'border-red-500/40',
      glow: 'group-hover:border-red-500/50 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]',
    },
    Adidas: {
      bg: 'bg-blue-950/80',
      text: 'text-blue-300',
      border: 'border-blue-500/40',
      glow: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]',
    },
    'New Balance': {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      glow: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    },
    'Alexander McQueen': {
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      glow: 'group-hover:border-amber-500/50 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    },
    Salomon: {
      bg: 'bg-orange-950/80',
      text: 'text-orange-300',
      border: 'border-orange-500/40',
      glow: 'group-hover:border-orange-500/50 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]',
    },
    Asics: {
      bg: 'bg-cyan-950/80',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
      glow: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    },
  };

  const styleConfig = brandColors[product.brand] || {
    bg: 'bg-slate-900/90',
    text: 'text-slate-200',
    border: 'border-slate-700/60',
    glow: 'group-hover:border-rose-500/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  };

  // Safe category filter: strictly never show 20$ or wholesale promo text
  const cleanCategory =
    product.category &&
    !product.category.includes('20') &&
    !product.category.includes('$') &&
    !product.category.toLowerCase().includes('promoc') &&
    product.category !== 'Zapatos' &&
    product.category !== 'Sneakers'
      ? product.category
      : null;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden flex flex-col justify-between bg-[#10121d]/90 border border-white/[0.08] backdrop-blur-md transition-all duration-300 ${styleConfig.glow}`}
    >
      {/* Top Image Container */}
      <div
        className="relative aspect-square w-full bg-[#0a0b12] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Subtle dark gradient overlay at top for high contrast tag readability */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* Brand Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border shadow-md backdrop-blur-md ${styleConfig.bg} ${styleConfig.text} ${styleConfig.border}`}
          >
            {product.brand}
          </span>
          {cleanCategory && (
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/85 text-slate-200 border border-white/10 backdrop-blur-md self-start">
              {cleanCategory}
            </span>
          )}
        </div>

        {/* In-Stock Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-md backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Stock en Vivo
          </span>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-slate-900/95 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xl border border-white/10 scale-95 group-hover:scale-100 transition-transform">
            <Eye className="w-3.5 h-3.5 text-rose-400" /> Ver Tallas Disponibles
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Sizes available preview */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="font-medium">Tallas disponibles:</span>
              <span className="font-bold text-slate-300">{product.sizes.length}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 6).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product, size);
                  }}
                  className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/90 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-800 hover:border-rose-500 transition-colors"
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 6 && (
                <span
                  onClick={() => onSelectProduct(product)}
                  className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 hover:text-white bg-slate-900/60 cursor-pointer"
                >
                  +{product.sizes.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">${product.price}</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">USD</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-0.5">
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span>Cuotas quincenales</span>
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1.5"
            title="Seleccionar talla y pedir"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Elegir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
