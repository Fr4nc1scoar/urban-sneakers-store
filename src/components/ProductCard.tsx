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
  const brandColors: Record<string, string> = {
    Nike: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    Jordan: 'bg-red-600/15 text-red-400 border-red-500/30',
    Adidas: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'New Balance': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Alexander McQueen': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Salomon: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    Asics: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  const badgeColor = brandColors[product.brand] || 'bg-slate-700/30 text-slate-300 border-slate-600/30';
  const installmentAmount = Math.round(product.price / 2);

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-900/90 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Brand Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${badgeColor}`}>
            {product.brand}
          </span>
          {product.category && product.category !== 'Zapatos' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-slate-300 backdrop-blur-sm self-start">
              {product.category}
            </span>
          )}
        </div>

        {/* In-Stock Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Disponible
          </span>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Eye className="w-3.5 h-3.5 text-rose-400" /> Ver Detalles y Tallas
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Sizes available preview */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>Tallas disponibles:</span>
              <span className="font-semibold text-slate-300">{product.sizes.length} tallas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 6).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(product, size);
                  }}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {size}
                </button>
              ))}
              {product.sizes.length > 6 && (
                <span
                  onClick={() => onSelectProduct(product)}
                  className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 hover:text-white bg-slate-800/40 cursor-pointer"
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
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">${product.price}</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">USD</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>O 2 cuotas de <strong>${installmentAmount}</strong></span>
            </div>
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 transition-all flex items-center gap-1.5"
            title="Seleccionar talla y pedir"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Pedir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
