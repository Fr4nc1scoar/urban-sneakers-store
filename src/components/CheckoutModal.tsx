'use client';

import React, { useState } from 'react';
import { CartItem, Order } from '@/types';
import { X, Send, CreditCard, Sparkles, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order, whatsAppUrl: string) => void;
  ownerWhatsAppDisplay?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  ownerWhatsAppDisplay = '+58 424-8057420',
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<'credit' | 'pago_movil' | 'cash' | 'binance' | 'zelle'>('credit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // Validate Name
    if (!name.trim()) {
      errs.name = 'El nombre y apellido son obligatorios.';
    } else if (name.trim().length < 3) {
      errs.name = 'Por favor ingresa tu nombre completo (mínimo 3 letras).';
    }

    // Validate Phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'El número de WhatsApp es obligatorio.';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Ingresa un número válido con código de área (ej. 04121234567).';
    }

    // Validate Cédula (Mandatory for credit)
    if (paymentPreference === 'credit') {
      const cleanId = idNumber.replace(/\D/g, '');
      if (!idNumber.trim()) {
        errs.idNumber = 'La cédula es requerida para solicitudes a crédito.';
      } else if (cleanId.length < 6) {
        errs.idNumber = 'Número de cédula inválido (mínimo 6 dígitos).';
      }
    }

    // Validate City
    if (!city.trim()) {
      errs.city = 'Indica tu ciudad o estado (ej. Caracas, Valencia, Margarita).';
    } else if (city.trim().length < 3) {
      errs.city = 'Nombre de ciudad muy corto.';
    }

    // Validate Address
    if (!address.trim()) {
      errs.address = 'Indica tu dirección de entrega o punto de encuentro.';
    } else if (address.trim().length < 5) {
      errs.address = 'Por favor sé más específico con la dirección o entrega.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      setGeneralError('Por favor revisa y completa los campos señalados en rojo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          idNumber: idNumber.trim() || undefined,
          city: city.trim(),
          address: address.trim(),
          notes: notes.trim() || undefined,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          brand: i.product.brand,
          image: i.product.image,
          size: i.selectedSize,
          price: i.product.price,
          quantity: i.quantity,
        })),
        paymentPreference,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ocurrió un error al procesar el pedido');
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // purely decorative
      }

      // Open WhatsApp direct API
      if (data.whatsAppUrl) {
        window.open(data.whatsAppUrl, '_blank');
      }

      onOrderSuccess(data.order, data.whatsAppUrl);
    } catch (err: any) {
      setGeneralError(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#10121b] border border-slate-700/80 rounded-3xl p-6 md:p-8 my-8 shadow-2xl shadow-rose-950/20 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-black text-white">Finalizar Pedido</h2>
              <p className="text-xs text-slate-400">
                Se enviará directamente al WhatsApp del vendedor ({ownerWhatsAppDisplay})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {generalError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Items Recap */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-300">
              <span>Zapatos a ordenar ({items.length} modelos):</span>
              <span className="text-white font-black text-sm">${totalAmount} USD</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-slate-400">
              {items.map((it) => (
                <div key={`${it.product.id}_${it.selectedSize}`} className="flex justify-between items-center">
                  <span>• {it.product.name} (Talla {it.selectedSize}) x{it.quantity}</span>
                  <span className="text-slate-300 font-semibold">${it.product.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              ¿Cómo deseas pagar?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentPreference('credit')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentPreference === 'credit'
                    ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> A Crédito (Cuotas)
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Acuerda 2 o más cuotas quincenales directamente con el vendedor.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPreference('pago_movil')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentPreference === 'pago_movil'
                    ? 'bg-rose-500/15 border-rose-500/50 ring-1 ring-rose-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-white block mb-1">
                  Pago Móvil (De Contado)
                </span>
                <p className="text-[11px] text-slate-400">
                  Bolívares a la tasa del día al confirmar pedido.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPreference('cash')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentPreference === 'cash'
                    ? 'bg-rose-500/15 border-rose-500/50 ring-1 ring-rose-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-white block mb-1">
                  Efectivo ($ Divisas)
                </span>
                <p className="text-[11px] text-slate-400">
                  Pago contra entrega personal o en tienda.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentPreference('binance')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentPreference === 'binance'
                    ? 'bg-rose-500/15 border-rose-500/50 ring-1 ring-rose-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-white block mb-1">
                  Binance Pay (USDT)
                </span>
                <p className="text-[11px] text-slate-400">
                  Transferencia directa sin comisiones.
                </p>
              </button>
            </div>
          </div>

          {/* Customer Details Form with Validation Errors */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Ej. Carlos Mendoza"
                className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.name
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                    : 'border-slate-700/80 focus:ring-2 focus:ring-rose-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Número de WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="Ej. 0412-1234567"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.phone
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-700/80 focus:ring-2 focus:ring-rose-500'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cédula de Identidad {paymentPreference === 'credit' ? '*' : '(Opcional)'}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    if (errors.idNumber) setErrors({ ...errors, idNumber: '' });
                  }}
                  placeholder="Ej. V-25.123.456"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.idNumber
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-700/80 focus:ring-2 focus:ring-rose-500'
                  }`}
                />
                {errors.idNumber && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.idNumber}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Ciudad / Estado *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  placeholder="Ej. Caracas / Valencia / Margarita"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.city
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-700/80 focus:ring-2 focus:ring-rose-500'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Dirección o Punto de Entrega *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  placeholder="Ej. Av. Francisco de Miranda o Tienda"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.address
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                      : 'border-slate-700/80 focus:ring-2 focus:ring-rose-500'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.address}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Notas u Observaciones (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Alguna preferencia de color de trenza, horario de entrega o cuotas a proponer"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white whatsapp-glow flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Generando Pedido...'
                  : `Enviar Pedido por WhatsApp ($${totalAmount} USD)`}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Se registrará el pedido y se abrirá WhatsApp con el mensaje estructurado listo para enviar al vendedor.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
