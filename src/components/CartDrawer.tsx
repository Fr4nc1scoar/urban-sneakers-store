'use client';

import React from 'react';
import { CartItem } from '@/types';
import { X, Trash2, ShoppingBag, ArrowRight, Zap, Shield } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: number, newQty: number) => void;
  onRemoveItem: (productId: string, size: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const installmentAmount = Math.round(totalAmount / 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f111a] border-l border-slate-800 text-white flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Tu Carrito de Zapatos</h2>
                <p className="text-xs text-slate-400">
                  {items.length === 1 ? '1 modelo seleccionado' : `${items.length} modelos seleccionados`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Explora nuestros más de 290 modelos de sneakers disponibles y añade tus favoritos.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}_${item.selectedSize}`}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex gap-3 items-center group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 w-[72px] h-[72px] object-cover rounded-xl bg-slate-950 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-white truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600/20 text-rose-300 border border-rose-500/30">
                        Talla EU {item.selectedSize}
                      </span>
                      <span className="text-xs text-slate-400">
                        ${item.product.price} c/u
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-2 py-0.5 border border-slate-700/60">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="text-slate-400 hover:text-white font-bold text-sm px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="text-slate-400 hover:text-white font-bold text-sm px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-sm text-white">
                        ${item.product.price * item.quantity} USD
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-[#0c0e15] space-y-4">
              {/* Credit banner in cart */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>¿Prefieres a Crédito?</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">Cuotas quincenales a acordar</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-400 font-medium">Total Pedido:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">${totalAmount}</span>
                  <span className="text-xs text-slate-400 font-semibold ml-1">USD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white glass-button-glow flex items-center justify-center gap-2 group transition-all"
              >
                <span>Continuar y Acordar Pedido</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Pedido respaldado y enviado directo al WhatsApp del vendedor</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
