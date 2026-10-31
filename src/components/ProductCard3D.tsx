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

  // Brand-specific accent glows inspired by luxury showroom displays
  const brandAccents: Record<string, { glow: string; text: string; bg: string; border: string }> = {
    Nike: {
      glow: 'rgba(209, 196, 255, 0.25)',
      text: '#D1C4FF',
      bg: 'bg-[#D1C4FF]/10',
      border: 'border-[#D1C4FF]/30',
    },
    Jordan: {
      glow: 'rgba(244, 63, 94, 0.25)',
      text: '#fb7185',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
    },
    Adidas: {
      glow: 'rgba(56, 189, 248, 0.25)',
      text: '#38bdf8',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
    },
    'New Balance': {
      glow: 'rgba(52, 211, 153, 0.25)',
      text: '#34d399',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    'Alexander McQueen': {
      glow: 'rgba(251, 191, 36, 0.25)',
      text: '#fbbf24',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    Salomon: {
      glow: 'rgba(251, 146, 60, 0.25)',
      text: '#fb923c',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
  };

  const accent = brandAccents[product.brand] || {
    glow: 'rgba(209, 196, 255, 0.25)',
    text: '#D1C4FF',
    bg: 'bg-[#D1C4FF]/10',
    border: 'border-[#D1C4FF]/30',
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
      data-cursor-text="ZAPATO"
      className="product-card-interactive group relative rounded-3xl p-[1px] overflow-hidden transition-all duration-300"
    >
      {/* Dynamic Cursor Spotlight Border (Unique Capital / Bento style) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
        style={{
          opacity: mousePos.isHover ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(209, 196, 255, 0.6) 0%, rgba(209, 196, 255, 0.15) 35%, transparent 70%)`,
        }}
      />

      {/* Static Luxury Border */}
      <div className="absolute inset-0 rounded-3xl border border-white/[0.08] pointer-events-none z-10" />

      {/* Main Card Surface */}
      <div className="relative rounded-[23px] bg-[#0c0d18]/90 backdrop-blur-2xl overflow-hidden h-full flex flex-col justify-between z-20 transition-all duration-300 group-hover:bg-[#0e0f1d]">
        {/* Subtle Specular Surface Light */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: mousePos.isHover ? 0.08 : 0,
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, #D1C4FF 0%, transparent 80%)`,
          }}
        />

        {/* Sneaker Image Box */}
        <div
          onClick={() => onSelectProduct(product, selectedSize || undefined)}
          className="relative aspect-square w-full bg-[#080811] overflow-hidden cursor-pointer flex items-center justify-center"
        >
          {/* Subtle Ambient Radial Glow behind the shoe */}
          <div
            className="absolute w-44 h-44 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
            style={{ backgroundColor: accent.glow }}
          />

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Luxury Brand Tag */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border backdrop-blur-xl shadow-lg ${accent.bg} ${accent.border}`}
              style={{ color: accent.text }}
            >
              {product.brand}
            </span>
          </div>

          {/* Stock Tag with Pulsing Neon Dot */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-emerald-400 border border-emerald-500/30 backdrop-blur-xl shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              STOCK EN VIVO
            </span>
          </div>

          {/* Hover View Button Overlay */}
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="px-4 py-2 rounded-full bg-black/80 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-2 backdrop-blur-xl border border-white/20 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
              <Eye className="w-3.5 h-3.5 text-[#D1C4FF]" /> VER DETALLES
            </span>
          </div>
        </div>

        {/* Card Body & Info */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3
              onClick={() => onSelectProduct(product, selectedSize || undefined)}
              className="font-bold text-[15px] text-white group-hover:text-[#D1C4FF] transition-colors line-clamp-1 cursor-pointer tracking-tight"
              title={product.name}
            >
              {product.name}
            </h3>

            {/* Sizes selector chips */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="text-slate-400">Tallas disponibles:</span>
                <span className="text-[#D1C4FF] font-semibold">{product.sizes.length} tallas</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
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
                          ? 'bg-[#D1C4FF] text-[#06060c] border border-[#D1C4FF] shadow-[0_0_12px_rgba(209,196,255,0.4)] scale-105'
                          : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-white/20 hover:text-white'
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
                    className="px-2 py-1 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all"
                  >
                    +{product.sizes.length - 5} más
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white tracking-tight">
                  ${product.price}
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase">
                  USD
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#D1C4FF] flex items-center gap-1 font-medium">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Cuotas quincenales</span>
              </div>
            </div>

            {/* Add to cart / Action button */}
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 shadow-md ${
                justAdded
                  ? 'bg-emerald-500 text-black border border-emerald-400'
                  : 'bg-white/[0.08] hover:bg-[#D1C4FF] text-white hover:text-[#06060c] border border-white/10 hover:border-[#D1C4FF] hover:shadow-[0_0_20px_rgba(209,196,255,0.4)]'
              }`}
              title="Agregar al Carrito"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span className="hidden sm:inline font-mono">Listo</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
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
