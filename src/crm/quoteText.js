// Texto de la cotización para WhatsApp. Se arma en texto plano y se codifica completo al
// construir el enlace (whatsappUrl), así los caracteres como & o # no rompen el mensaje.
import { formatDate, addDays, formatMoney } from './utils';

export const buildQuoteMessage = (crm, quote) => {
  const st = crm.state.settings;
  const client = crm.client(quote.clientId);
  const t = crm.quoteTotals(quote);
  const money = (v) => formatMoney(v, st.currency);
  const contact = client?.name?.split(' ')[0];

  const lines = [
    `Hola${contact ? ' ' + contact : ''}, te comparto la cotización solicitada 👇`,
    '',
    `📋 *COTIZACIÓN ${quote.id}*`,
    `🏢 ${st.businessName}${st.tagline ? ' — ' + st.tagline : ''}`,
    `👤 Cliente: ${client?.company || '—'}`,
    `📅 Fecha: ${formatDate(quote.date)} · Válida hasta: ${formatDate(addDays(quote.date, quote.validityDays || 15))}`,
    `🛠️ Servicio: ${quote.serviceType}`,
    '',
    '*Detalle:*',
    ...quote.items.map((i, idx) => `${idx + 1}. ${i.description} — ${i.quantity} x ${money(i.unitPrice)} = *${money(i.quantity * i.unitPrice)}*`),
    '',
    `Subtotal: ${money(t.subtotal)}`
  ];
  if (t.discount > 0) lines.push(`Descuento (${quote.discountPercent}%): -${money(t.discount)}`);
  if (t.tax > 0) lines.push(`IVA (${t.taxRate}%): +${money(t.tax)}`);
  lines.push(`💰 *TOTAL: ${money(t.total)}*`, '');
  if (quote.deliveryTime) lines.push(`⏱️ Plazo de entrega: ${quote.deliveryTime}`);
  if (quote.paymentTerms) lines.push(`💳 Forma de pago: ${quote.paymentTerms}`);
  if (quote.notes) lines.push(`✅ ${quote.notes}`);
  lines.push('', 'Quedo atento a cualquier duda para comenzar. ¡Gracias por la confianza!', `${st.ownerName} · ${st.phone}`);
  return lines.join('\n');
};
