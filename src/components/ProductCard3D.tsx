'use client';

import React, { useState, useRef } from 'react';
import { Product } from '@/types';
import { ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, preselectedSize?: number) => void;
  onQuickAdd: (product: Product, size: number) => void;
}

export default function ProductCard3D({
  product,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHover: boolean }>({
    x: 0,
    y: 0,
    isHover: false,
  });
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [justAdded, setJustAdded] = useState(false);

  // High-Energy Brand Color Accents
  const brandAccents: Record<
    string,
    { glow: string; text: string; badge: string; borderHover: string; shadow: string }
  > = {
    Nike: {
      glow: 'rgba(244, 63, 94, 0.4)',
      text: 'text-rose-400',
      badge: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      borderHover: 'hover:border-rose-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(244,63,94,0.35)]',
    },
    Jordan: {
      glow: 'rgba(239, 68, 68, 0.4)',
      text: 'text-red-400',
      badge: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]',
      borderHover: 'hover:border-red-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(239,68,68,0.35)]',
    },
    Adidas: {
      glow: 'rgba(59, 130, 246, 0.4)',
      text: 'text-blue-400',
      badge: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]',
      borderHover: 'hover:border-blue-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(59,130,246,0.35)]',
    },
    'New Balance': {
      glow: 'rgba(16, 185, 129, 0.4)',
      text: 'text-emerald-400',
      badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      borderHover: 'hover:border-emerald-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(16,185,129,0.35)]',
    },
    'Alexander McQueen': {
      glow: 'rgba(245, 158, 11, 0.4)',
      text: 'text-amber-400',
      badge: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      borderHover: 'hover:border-amber-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(245,158,11,0.35)]',
    },
    Salomon: {
      glow: 'rgba(249, 115, 22, 0.4)',
      text: 'text-orange-400',
      badge: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]',
      borderHover: 'hover:border-orange-500/70',
      shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(249,115,22,0.35)]',
    },
  };

  const accent = brandAccents[product.brand] || {
    glow: 'rgba(244, 63, 94, 0.35)',
    text: 'text-rose-400',
    badge: 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    borderHover: 'hover:border-rose-500/70',
    shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(244,63,94,0.3)]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHover: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, isHover: false }));
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) {
      onSelectProduct(product);
      return;
    }
    onQuickAdd(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-interactive="true"
      className={`product-card-interactive group relative rounded-2xl sm:rounded-3xl p-[1px] overflow-hidden transition-all duration-300 ${accent.borderHover} ${accent.shadow}`}
    >
      {/* Dynamic Cursor Spotlight Border with Multi-Color Neon */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.isHover ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 63, 94, 0.7) 0%, rgba(245, 158, 11, 0.35) 40%, transparent 75%)`,
        }}
      />

      {/* Static Luxury Border */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/[0.08] pointer-events-none z-10" />

      {/* Main Card Surface */}
      <div className="relative rounded-[15px] sm:rounded-[23px] bg-[#0c0d18]/92 backdrop-blur-2xl overflow-hidden h-full flex flex-col justify-between z-20 transition-all duration-300 group-hover:bg-[#0e0f1e]">
        {/* Sneaker Image Box */}
        <div
          onClick={() => onSelectProduct(product, selectedSize || undefined)}
          className="relative aspect-square w-full bg-[#080812] overflow-hidden cursor-pointer flex items-center justify-center"
        >
          {/* Vibrant Ambient Radial Glow matching the shoe's brand */}
          <div
            className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full blur-2xl sm:blur-3xl opacity-35 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500"
            style={{ backgroundColor: accent.glow }}
          />

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Top Gradient Vignette */}
          <div className="absolute inset-x-0 top-0 h-12 sm:h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

          {/* Luxury Brand Tag */}
          <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10">
            <span
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-mono font-black tracking-wider uppercase border border-white/20 backdrop-blur-xl ${accent.badge}`}
            >
              {product.brand}
            </span>
          </div>

          {/* Stock Tag with Pulsing Neon Dot */}
          <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] font-mono font-bold bg-black/75 text-emerald-300 border border-emerald-500/50 backdrop-blur-xl shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="hidden xs:inline">STOCK EN VIVO</span>
              <span className="xs:hidden">EN VIVO</span>
            </span>
          </div>

          {/* Hover View Button Overlay (Desktop) */}
          <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center pointer-events-none">
            <span className="px-4 py-2 rounded-full bg-black/85 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-2 backdrop-blur-xl border border-white/25 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
              <Eye className="w-3.5 h-3.5 text-rose-400" /> VER DETALLES
            </span>
          </div>
        </div>

        {/* Card Body & Info */}
        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
          <div>
            <h3
              onClick={() => onSelectProduct(product, selectedSize || undefined)}
              className="font-bold text-xs sm:text-[15px] text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer tracking-tight"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Sizes selector chips */}
            <div className="mt-2 sm:mt-3">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-1.5 sm:mb-2 font-mono">
                <span className="text-slate-400 hidden xs:inline">Tallas:</span>
                <span className="text-amber-400 font-bold">{product.sizes.length} tallas</span>
              </div>

              {/* Mobile compact sizes (top 3) */}
              <div className="flex sm:hidden flex-wrap gap-1">
                {product.sizes.slice(0, 3).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white/[0.05] text-slate-200 border border-white/[0.08]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
                {product.sizes.length > 3 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="px-1 py-0.5 rounded text-[9px] font-mono text-slate-400 bg-white/[0.04]"
                  >
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>

              {/* Desktop sizes (top 5) */}
              <div className="hidden sm:flex flex-wrap gap-1.5">
                {product.sizes.slice(0, 5).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105'
                          : 'bg-white/[0.05] text-slate-200 border border-white/[0.1] hover:border-rose-400/60 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
                {product.sizes.length > 5 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-amber-400 transition-all"
                  >
                    +{product.sizes.length - 5} más
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between gap-1.5 sm:gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-xl font-black text-white tracking-tight">
                  ${product.price}
                </span>
                <span className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-400 uppercase">
                  USD
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 flex items-center gap-0.5 sm:gap-1 font-bold">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">Cuotas</span>
              </div>
            </div>

            {/* Add to cart / Action button */}
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`p-2 sm:px-3.5 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 shadow-md cursor-pointer flex-shrink-0 ${
                justAdded
                  ? 'bg-emerald-500 text-black border border-emerald-400'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.45)] hover:shadow-[0_0_25px_rgba(244,63,94,0.7)]'
              }`}
              title="Agregar al Carrito"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  <span className="hidden sm:inline font-mono">Listo</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline font-mono">Pedir</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
