'use client';

import React, { useState } from 'react';
import { Order, Installment, StoreSettings } from '@/types';
import { X, Calendar, DollarSign, MessageCircle, Save, Plus, Trash2, Zap, RefreshCw } from 'lucide-react';

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
    notes: 'Plan acordado en cuotas quincenales',
  };

  const [installments, setInstallments] = useState<Installment[]>(currentPlan.installments);
  const [customCountInput, setCustomCountInput] = useState<number>(currentPlan.totalInstallments || 2);
  const [notes, setNotes] = useState(currentPlan.notes || '');
  const [saving, setSaving] = useState(false);

  // Recalculate installments equally based on any count
  const handleSetEqualSplits = (count: number) => {
    const validCount = Math.max(1, Math.min(count, 12));
    setCustomCountInput(validCount);
    const amountPer = Math.floor(order.totalAmount / validCount);
    const remainder = order.totalAmount - amountPer * validCount;

    const newInst: Installment[] = [];
    const baseTime = new Date(order.createdAt).getTime();

    for (let i = 1; i <= validCount; i++) {
      const dueDate = new Date(baseTime + i * 15 * 86400000).toISOString().split('T')[0];
      newInst.push({
        id: `inst_${i}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        number: i,
        totalInstallments: validCount,
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

  const handleAddManualCuota = () => {
    const nextNumber = installments.length + 1;
    const lastDate = installments.length > 0
      ? new Date(installments[installments.length - 1].dueDate).getTime()
      : Date.now();
    const newDueDate = new Date(lastDate + 15 * 86400000).toISOString().split('T')[0];

    const newInst: Installment = {
      id: `inst_manual_${Date.now()}`,
      number: nextNumber,
      totalInstallments: nextNumber,
      amount: 0,
      dueDate: newDueDate,
      status: 'pending',
    };

    const updated = [...installments, newInst].map((item, idx, arr) => ({
      ...item,
      number: idx + 1,
      totalInstallments: arr.length,
    }));

    setInstallments(updated);
    setCustomCountInput(updated.length);
  };

  const handleRemoveCuota = (index: number) => {
    if (installments.length <= 1) return;
    const filtered = installments.filter((_, idx) => idx !== index);
    const updated = filtered.map((item, idx, arr) => ({
      ...item,
      number: idx + 1,
      totalInstallments: arr.length,
    }));
    setInstallments(updated);
    setCustomCountInput(updated.length);
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
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Monto Total del Pedido:</span>
            <span className="text-2xl font-black text-white">${order.totalAmount} USD</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Dividir en:</span>
            <button
              type="button"
              onClick={() => handleSetEqualSplits(2)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                installments.length === 2
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2 Cuotas
            </button>
            <button
              type="button"
              onClick={() => handleSetEqualSplits(3)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                installments.length === 3
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3 Cuotas
            </button>
            <button
              type="button"
              onClick={() => handleSetEqualSplits(4)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                installments.length === 4
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              4 Cuotas
            </button>

            {/* Custom installments number input */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1">
              <input
                type="number"
                min="1"
                max="12"
                value={customCountInput}
                onChange={(e) => setCustomCountInput(Number(e.target.value))}
                className="w-10 bg-transparent text-xs font-black text-white text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSetEqualSplits(customCountInput)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[10px] transition-colors"
                title="Generar división equitativa"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {/* Installment Cards */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Detalle de Cuotas Quincenales ({installments.length})
            </label>
            <button
              type="button"
              onClick={handleAddManualCuota}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Cuota
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
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
                        <option value="pending" className="bg-slate-900 text-amber-300">Pendiente</option>
                        <option value="paid" className="bg-slate-900 text-emerald-300">Cobrada / Pagada</option>
                        <option value="overdue" className="bg-slate-900 text-rose-300">Vencida / Atrasada</option>
                      </select>

                      {/* Button to send WhatsApp payment collection reminder (NO EMOJIS TO PREVENT  BUG) */}
                      <a
                        href={(inst as any).reminderWhatsAppUrl || `https://api.whatsapp.com/send?phone=${order.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hola ${order.customer.name}! Te escribo para recordarte tu cuota #${inst.number} por $${inst.amount} USD.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                        title="Enviar mensaje personalizado de cobro al WhatsApp del cliente"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Cobrar por WhatsApp</span>
                      </a>

                      {installments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCuota(idx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Eliminar esta cuota"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
                      <label className="text-slate-400 block mb-1">Fecha Límite (Manual):</label>
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
                      <label className="text-slate-400 block mb-1">Comprobante / Detalle:</label>
                      <input
                        type="text"
                        placeholder="Ej. Pago Móvil / Divisas"
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
            placeholder="Ej. Cliente acordó pagar inicial en efectivo y saldo en cuotas quincenales."
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
