import { Order, Installment, StoreSettings } from '@/types';

// Format phone number to international WhatsApp format (e.g. 0424-8057420 or 584248057420 -> 584248057420)
export function sanitizeWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '58' + cleaned.substring(1);
  } else if (!cleaned.startsWith('58') && cleaned.length === 10) {
    cleaned = '58' + cleaned;
  }
  return cleaned;
}

// Format date safely without locale bugs
function formatDateSafe(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

// Generate the customer checkout WhatsApp order message to the store owner (+58 424-8057420)
// 100% ASCII-clean formatting: NO raw emojis, NO diamonds (◆/◈), NO unicode bullets (•)
// This completely prevents the  (U+FFFD) replacement character bug in WhatsApp Web
export function generateOrderWhatsAppMessage(order: Order, settings: StoreSettings): string {
  const itemsList = order.items
    .map(
      (item, idx) =>
        `*${idx + 1}. ${item.name}*\n` +
        `   - Marca: ${item.brand}\n` +
        `   - Talla: EU ${item.size}\n` +
        `   - Cantidad: ${item.quantity}\n` +
        `   - Precio: $${item.price} c/u\n` +
        `   - Subtotal: $${item.price * item.quantity}`
    )
    .join('\n\n');

  const paymentText =
    order.paymentPreference === 'credit'
      ? '*SOLICITUD DE COMPRA A CREDITO* (Cuotas quincenales a acordar con el vendedor)'
      : order.paymentPreference === 'pago_movil'
      ? 'Pago Movil'
      : order.paymentPreference === 'binance'
      ? 'Binance Pay (USDT)'
      : order.paymentPreference === 'zelle'
      ? 'Zelle'
      : 'Efectivo (Divisas)';

  const dateFormatted = formatDateSafe(order.createdAt);

  const message =
    `*NUEVO PEDIDO DE ZAPATOS - ${settings.storeName.toUpperCase()}*\n` +
    `----------------------------------------\n` +
    `*Pedido #:* ${order.orderNumber}\n` +
    `*Fecha:* ${dateFormatted}\n` +
    `----------------------------------------\n\n` +
    `*DATOS DEL CLIENTE:*\n` +
    `- *Nombre:* ${order.customer.name}\n` +
    `- *Telefono:* ${order.customer.phone}\n` +
    `- *Ciudad:* ${order.customer.city}\n` +
    `- *Direccion de Entrega:* ${order.customer.address}\n` +
    (order.customer.idNumber ? `- *C.I. / Identificacion:* ${order.customer.idNumber}\n` : '') +
    (order.customer.notes ? `- *Observaciones:* ${order.customer.notes}\n` : '') +
    `\n*DETALLE DEL PEDIDO:*\n` +
    `${itemsList}\n\n` +
    `----------------------------------------\n` +
    `*TOTAL A PAGAR:* *$${order.totalAmount} USD*\n` +
    `*Modalidad elegida:* ${paymentText}\n` +
    `----------------------------------------\n\n` +
    `_Hola, quiero concretar mi pedido y acordar la entrega y detalles del pago. Quedo atento a tu respuesta._`;

  return message;
}

// Generate the link for the customer to open WhatsApp with the store owner
export function getOrderWhatsAppUrl(order: Order, settings: StoreSettings): string {
  const phone = sanitizeWhatsAppPhone(settings.ownerWhatsApp);
  const message = generateOrderWhatsAppMessage(order, settings);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

// Generate polite collection reminder for an installment (100% clean formatting without emojis or unicode symbols)
export function generateInstallmentReminderMessage(
  order: Order,
  installment: Installment,
  settings: StoreSettings
): string {
  const isOverdue = installment.status === 'overdue' || new Date(installment.dueDate) < new Date();
  const title = isOverdue
    ? `*RECORDATORIO DE CUOTA PENDIENTE*`
    : `*RECORDATORIO DE PAGO QUINCENAL*`;

  const itemSummary = order.items.map(i => `${i.name} (Talla ${i.size})`).join(', ');

  const paymentMethods =
    `*DATOS PARA EL PAGO:*\n` +
    `- *Pago Movil:* ${settings.paymentDetails.pagoMovil.banco} | C.I: ${settings.paymentDetails.pagoMovil.cedula} | Telf: ${settings.paymentDetails.pagoMovil.telefono} (${settings.paymentDetails.pagoMovil.titular})\n` +
    `- *Binance Pay ID:* ${settings.paymentDetails.binancePay.payId}\n` +
    (settings.paymentDetails.zelle.email ? `- *Zelle:* ${settings.paymentDetails.zelle.email}\n` : '') +
    `- *Efectivo:* Previo acuerdo de entrega`;

  const dueDateFormatted = formatDateSafe(installment.dueDate);

  const message =
    `${title}\n` +
    `----------------------------------------\n` +
    `Hola, estimado/a *${order.customer.name}*\n\n` +
    `Esperamos te encuentres muy bien. Te escribimos de parte de *${settings.storeName}* para recordarte la cuota de tu compra a credito (${itemSummary}):\n\n` +
    `- *Cuota:* #${installment.number} de ${installment.totalInstallments}\n` +
    `- *Monto a pagar:* *$${installment.amount} USD* (o al cambio del dia en Bs.)\n` +
    `- *Fecha limite de pago:* ${dueDateFormatted}\n` +
    `- *Pedido ref:* ${order.orderNumber}\n\n` +
    `----------------------------------------\n` +
    `${paymentMethods}\n` +
    `----------------------------------------\n\n` +
    `_Por favor, una vez realices tu pago, envianos el comprobante por este medio para registrarlo en tu cuenta. Muchas gracias por tu puntualidad y preferencia._`;

  return message;
}

// Generate link for store owner to send reminder to customer
export function getInstallmentReminderWhatsAppUrl(
  order: Order,
  installment: Installment,
  settings: StoreSettings
): string {
  const customerPhone = sanitizeWhatsAppPhone(order.customer.phone);
  const message = generateInstallmentReminderMessage(order, installment, settings);
  return `https://api.whatsapp.com/send?phone=${customerPhone}&text=${encodeURIComponent(message)}`;
}
