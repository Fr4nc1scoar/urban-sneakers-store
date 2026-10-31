'use client';

import React, { useState } from 'react';
import { Order, Installment, StoreSettings } from '@/types';
import { X, Calendar, DollarSign, MessageCircle, CheckCircle2, Clock, AlertTriangle, Save, Sparkles } from 'lucide-react';

interface AdminInstallmentModalProps {
  order: Order | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (orderId: string, updatedPlan: Order['creditPlan']) => Promise<void>;
  onUpdateInstallmentStatus: (
    orderId: string,
    installmentId: string,
    status: Installment['status'],
    paymentMethod?: string,
    notes?: string
  ) => Promise<void>;
}

export default function AdminInstallmentModal({
  order,
  settings,
  isOpen,
  onClose,
  onSavePlan,
  onUpdateInstallmentStatus,
}: AdminInstallmentModalProps) {
  if (!isOpen || !order) return null;

  const currentPlan = order.creditPlan || {
    frequency: 'quincenal' as const,
    totalInstallments: 2,
    installments: [
      {
        id: `inst_1_${Date.now()}`,
        number: 1,
        totalInstallments: 2,
        amount: Math.round(order.totalAmount / 2),
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        status: 'pending' as const,
      },
      {
        id: `inst_2_${Date.now()}`,
        number: 2,
        totalInstallments: 2,
        amount: order.totalAmount - Math.round(order.totalAmount / 2),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'pending' as const,
      },
    ],
    notes: 'Plan acordado a 2 cuotas quincenales',
  };

  const [installments, setInstallments] = useState<Installment[]>(currentPlan.installments);
  const [numInstallments, setNumInstallments] = useState(currentPlan.totalInstallments || 2);
  const [notes, setNotes] = useState(currentPlan.notes || '');
  const [saving, setSaving] = useState(false);

  // Recalculate installments equally
  const handleSetEqualSplits = (count: number) => {
    setNumInstallments(count);
    const amountPer = Math.floor(order.totalAmount / count);
    const remainder = order.totalAmount - amountPer * count;

    const newInst: Installment[] = [];
    const baseTime = new Date(order.createdAt).getTime();

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(baseTime + i * 15 * 86400000).toISOString().split('T')[0];
      newInst.push({
        id: `inst_${i}_${Date.now()}`,
        number: i,
        totalInstallments: count,
        amount: i === 1 ? amountPer + remainder : amountPer,
        dueDate,
        status: 'pending',
      });
    }
    setInstallments(newInst);
  };

  const handleUpdateSingleInstallment = (index: number, field: keyof Installment, value: any) => {
    const updated = [...installments];
    updated[index] = { ...updated[index], [field]: value };
    setInstallments(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await onSavePlan(order.id, {
        frequency: 'quincenal',
        totalInstallments: installments.length,
        installments,
        notes,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const totalCalculated = installments.reduce((sum, i) => sum + Number(i.amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#11131f] border border-slate-700/80 rounded-3xl p-6 md:p-8 my-8 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                Gestión de Cuotas y Crédito ({order.orderNumber})
              </h2>
              <p className="text-xs text-slate-400">
                Cliente: <strong className="text-white">{order.customer.name}</strong> • Telf: {order.customer.phone}
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

        {/* Quick config bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Monto Total del Pedido:</span>
            <span className="text-2xl font-black text-white">${order.totalAmount} USD</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Dividir en:</span>
            <button
              type="button"
              onClick={() => handleSetEqualSplits(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                installments.length === 2
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2 Cuotas (50% y 50%)
            </button>
            <button
              type="button"
              onClick={() => handleSetEqualSplits(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                installments.length === 3
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3 Cuotas
            </button>
          </div>
        </div>

        {/* Installment Cards */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Detalle de Cuotas Quincenales
          </label>

          {installments.map((inst, idx) => {
            const isPaid = inst.status === 'paid';
            const isOverdue = inst.status === 'overdue' || (!isPaid && new Date(inst.dueDate) < new Date());

            return (
              <div
                key={inst.id || idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isPaid
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isOverdue
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-amber-400">
                      #{inst.number}
                    </span>
                    <span className="font-bold text-sm text-white">
                      Cuota {inst.number} de {installments.length}
                    </span>
                  </div>

                  {/* Status badge and quick toggles */}
                  <div className="flex items-center gap-2">
                    <select
                      value={inst.status}
                      onChange={(e) =>
                        handleUpdateSingleInstallment(
                          idx,
                          'status',
                          e.target.value as Installment['status']
                        )
                      }
                      className={`text-xs font-bold py-1 px-2.5 rounded-xl border focus:outline-none ${
                        isPaid
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                          : isOverdue
                          ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                          : 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                      }`}
                    >
                      <option value="pending" className="bg-slate-900 text-amber-300">⏳ Pendiente</option>
                      <option value="paid" className="bg-slate-900 text-emerald-300">✅ Cobrada / Pagada</option>
                      <option value="overdue" className="bg-slate-900 text-rose-300">⚠️ Vencida / Atrasada</option>
                    </select>

                    {/* Button to send WhatsApp payment collection reminder */}
                    <a
                      href={(inst as any).reminderWhatsAppUrl || `https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customer.name}! Te escribo de Alberto Shoes para recordarte tu cuota #${inst.number} por $${inst.amount} USD.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                      title="Enviar mensaje personalizado de cobro al WhatsApp del cliente"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Cobrar por WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Editable Inputs for this installment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Monto ($ USD):</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={inst.amount}
                        onChange={(e) =>
                          handleUpdateSingleInstallment(idx, 'amount', Number(e.target.value))
                        }
                        className="w-full pl-7 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Fecha Límite de Cobro:</label>
                    <input
                      type="date"
                      value={inst.dueDate}
                      onChange={(e) =>
                        handleUpdateSingleInstallment(idx, 'dueDate', e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Método de Pago Recibido:</label>
                    <input
                      type="text"
                      placeholder="Ej. Pago Móvil / Efectivo"
                      value={inst.paymentMethod || ''}
                      onChange={(e) =>
                        handleUpdateSingleInstallment(idx, 'paymentMethod', e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sum Check */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-between text-xs">
          <span>Suma total de cuotas:</span>
          <span className={`font-black text-sm ${totalCalculated === order.totalAmount ? 'text-emerald-400' : 'text-amber-400'}`}>
            ${totalCalculated} / ${order.totalAmount} USD
            {totalCalculated !== order.totalAmount && ' (Difiere del total del pedido)'}
          </span>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-400 block mb-1">
            Notas u Observaciones del Crédito:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Cliente pagó $10 de inicial y el resto en 2 cuotas quincenales."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white glass-button-glow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando Plan...' : 'Guardar y Aplicar Plan de Cuotas'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
