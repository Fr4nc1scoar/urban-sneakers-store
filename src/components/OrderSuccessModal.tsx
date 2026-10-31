'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { CheckCircle2, MessageCircle, Copy, Check, ShoppingBag, Calendar, ShieldCheck } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  whatsAppUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({
  order,
  whatsAppUrl,
  isOpen,
  onClose,
}: OrderSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopy = () => {
    const text =
      `📦 Pedido: ${order.orderNumber}\n` +
      `Cliente: ${order.customer.name}\n` +
      `Total: $${order.totalAmount} USD\n` +
      `Modalidad: ${order.isCredit ? 'A Crédito (2 Cuotas)' : 'De Contado'}\n` +
      `Items: ${order.items.map(i => `${i.name} (Talla ${i.size})`).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-md bg-[#11131e] border border-slate-700/80 rounded-3xl p-6 md:p-8 text-center text-white shadow-2xl shadow-rose-950/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1">
          ¡Pedido Registrado con Éxito!
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Tu solicitud fue guardada en el sistema de la tienda.
        </p>

        {/* Order Badge */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Número de Pedido:</span>
            <span className="font-mono font-black text-rose-400 text-sm">{order.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total a Pagar:</span>
            <span className="font-black text-white text-base">${order.totalAmount} USD</span>
          </div>
          {order.isCredit && (
            <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Modalidad Crédito: Cuotas quincenales a acordar con el vendedor</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white whatsapp-glow flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Abrir Chat con el Vendedor (+58 424-8057420)</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-center gap-2 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> ¡Detalles Copiados!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" /> Copiar Resumen del Pedido
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Volver a la tienda
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
          <span>Atención personalizada por el dueño directo</span>
        </div>
      </div>
    </div>
  );
}
