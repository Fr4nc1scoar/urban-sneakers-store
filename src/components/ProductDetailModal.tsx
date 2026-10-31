'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Truck, CreditCard, Check, Sparkles } from 'lucide-react';

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

  const installmentAmount = Math.round(product.price / 2);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#11131d] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/20 max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Big Product Image */}
        <div className="md:w-1/2 relative bg-slate-950/60 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-600/90 text-white shadow-md">
                {product.brand}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                {product.category || 'Sneakers'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En Stock
              </span>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 mb-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">${product.price}</span>
                  <span className="text-xs text-slate-400 font-semibold ml-1">USD (De Contado)</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" /> A Crédito
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Facilidad de pago:</span>
                <strong className="text-amber-400">Cuotas quincenales a acordar con el vendedor</strong>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Selecciona tu talla (EU):
                </label>
                {selectedSize && (
                  <span className="text-xs font-semibold text-rose-400">
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
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400'
                          : 'bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Cantidad de pares:
              </span>
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/70 rounded-xl px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> ¡Añadido al Carrito!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Añadir al Carrito
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Comprar / Solicitar Crédito Ahora</span>
            </button>
          </div>

          {/* Reassurance pills */}
          <div className="mt-4 pt-3 flex items-center justify-around text-[10px] text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> 100% Garantizados
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" /> Envíos Nacionales
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
