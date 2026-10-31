'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { X, ShoppingBag, ShieldCheck, Truck, CreditCard, Check, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  initialSize?: number;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: number, quantity: number) => void;
  onDirectBuy: (product: Product, size: number, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  initialSize,
  isOpen,
  onClose,
  onAddToCart,
  onDirectBuy,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      if (initialSize && product.sizes.includes(initialSize)) {
        setSelectedSize(initialSize);
      } else if (product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product, initialSize]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    if (!selectedSize) return;
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    onDirectBuy(product, selectedSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0c0d18] border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(209,196,255,0.2)] max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image */}
        <div className="md:w-1/2 relative bg-[#070810] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/[0.08]">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0a0b14] flex items-center justify-center">
            <div className="absolute w-40 h-40 rounded-full bg-[#D1C4FF]/15 blur-3xl" />
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#D1C4FF]/10 text-[#D1C4FF] border border-[#D1C4FF]/30">
                {product.brand}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En Stock
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">${product.price}</span>
                  <span className="text-xs text-slate-400 font-mono font-semibold ml-1">USD (De Contado)</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#D1C4FF]/15 text-[#D1C4FF] border border-[#D1C4FF]/30">
                    <Sparkles className="w-3.5 h-3.5" /> A Crédito
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/[0.06] text-xs text-slate-300 flex items-center justify-between">
                <span>Facilidad de pago:</span>
                <strong className="text-[#D1C4FF] font-semibold">Cuotas quincenales a acordar con el vendedor</strong>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Selecciona tu talla (EU):
                </label>
                {selectedSize && (
                  <span className="text-xs font-mono font-semibold text-[#D1C4FF]">
                    Talla seleccionada: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-1 text-center rounded-xl font-mono font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#D1C4FF] text-[#06060c] shadow-[0_0_15px_rgba(209,196,255,0.5)] scale-105'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Cantidad de pares:
              </span>
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-mono font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                addedAnimation
                  ? 'bg-emerald-500 text-black'
                  : 'glass-button-glow font-black text-[#06060c]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> ¡Añadido al Carrito!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Añadir al Carrito
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4 text-[#D1C4FF]" />
              <span>Comprar / Solicitar Crédito Ahora</span>
            </button>
          </div>

          {/* Reassurance pills */}
          <div className="mt-4 pt-3 flex items-center justify-around text-[10px] font-mono text-slate-400 border-t border-white/[0.08]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D1C4FF]" /> 100% Garantizados
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" /> Envíos Directos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
