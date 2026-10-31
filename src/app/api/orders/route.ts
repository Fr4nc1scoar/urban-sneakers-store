import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder, getSettings } from '@/lib/storage';
import { Order, Installment } from '@/types';
import { getOrderWhatsAppUrl } from '@/lib/whatsapp';

function generateOrderNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ALB-${random}`;
}

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await getSettings();

    const { customer, items, paymentPreference } = body;

    if (!customer || !customer.name || !customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Nombre y teléfono del cliente son requeridos' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El carrito no contiene productos' },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const isCredit = paymentPreference === 'credit';
    const orderNumber = generateOrderNumber();
    const id = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    // Default installments if credit
    let creditPlan = undefined;
    if (isCredit) {
      const numInstallments = settings.creditRules.defaultInstallments || 2;
      const intervalDays = settings.creditRules.defaultIntervalDays || 15;
      const installmentAmount = Math.round((totalAmount / numInstallments) * 100) / 100;

      const installments: Installment[] = [];
      for (let i = 1; i <= numInstallments; i++) {
        const dueDate = new Date(now.getTime() + i * intervalDays * 24 * 60 * 60 * 1000);
        installments.push({
          id: `inst_${i}_${Date.now()}`,
          number: i,
          totalInstallments: numInstallments,
          amount: i === numInstallments ? totalAmount - installmentAmount * (numInstallments - 1) : installmentAmount,
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'pending',
        });
      }

      creditPlan = {
        frequency: 'quincenal' as const,
        totalInstallments: numInstallments,
        installments,
        notes: 'Crédito quincenal acordado vía web',
      };
    }

    const newOrder: Order = {
      id,
      orderNumber,
      createdAt: now.toISOString(),
      customer,
      items,
      totalAmount,
      paymentPreference,
      status: 'pending_confirmation',
      isCredit,
      creditPlan,
    };

    const saved = await saveOrder(newOrder);
    const whatsAppUrl = getOrderWhatsAppUrl(saved, settings);

    return NextResponse.json({
      success: true,
      order: saved,
      whatsAppUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
