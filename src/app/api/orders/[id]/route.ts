import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, saveOrder, getOrders, getSettings } from '@/lib/storage';
import { getInstallmentReminderWhatsAppUrl } from '@/lib/whatsapp';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }
    const settings = await getSettings();

    // Attach whatsapp reminder links for each installment
    const installmentsWithLinks = order.creditPlan?.installments.map(inst => ({
      ...inst,
      reminderWhatsAppUrl: getInstallmentReminderWhatsAppUrl(order, inst, settings),
    }));

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        creditPlan: order.creditPlan
          ? { ...order.creditPlan, installments: installmentsWithLinks }
          : undefined,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const order = await getOrderById(params.id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 });
    }

    // 1. Update basic status if provided
    if (body.status) {
      order.status = body.status;
    }

    // 2. Update credit plan configuration if provided
    if (body.creditPlan) {
      order.isCredit = true;
      order.creditPlan = body.creditPlan;
    }

    // 3. Update single installment status if provided
    if (body.installmentUpdate) {
      const { installmentId, status, paymentMethod, notes, amount, dueDate } = body.installmentUpdate;
      if (order.creditPlan && order.creditPlan.installments) {
        const inst = order.creditPlan.installments.find(i => i.id === installmentId);
        if (inst) {
          if (status) inst.status = status;
          if (status === 'paid') inst.paidAt = new Date().toISOString();
          if (status === 'pending') inst.paidAt = undefined;
          if (paymentMethod !== undefined) inst.paymentMethod = paymentMethod;
          if (notes !== undefined) inst.notes = notes;
          if (amount !== undefined) inst.amount = Number(amount);
          if (dueDate !== undefined) inst.dueDate = dueDate;
        }
      }
    }

    const saved = await saveOrder(order);
    const settings = await getSettings();

    // Reattach URLs
    const installmentsWithLinks = saved.creditPlan?.installments.map(inst => ({
      ...inst,
      reminderWhatsAppUrl: getInstallmentReminderWhatsAppUrl(saved, inst, settings),
    }));

    return NextResponse.json({
      success: true,
      order: {
        ...saved,
        creditPlan: saved.creditPlan
          ? { ...saved.creditPlan, installments: installmentsWithLinks }
          : undefined,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await getOrders();
    const filtered = orders.filter(o => o.id !== params.id && o.orderNumber !== params.id);
    
    const filePath = path.join(process.cwd(), 'data', 'orders.json');
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
