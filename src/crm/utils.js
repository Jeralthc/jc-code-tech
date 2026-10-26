// Utilidades de fechas, dinero, teléfonos y textos del CRM.

// Fecha local en formato YYYY-MM-DD (toISOString usa UTC y adelanta el día en Venezuela de noche).
export const todayISO = () => toISO(new Date());

export const toISO = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const addDays = (iso, days) => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
};

export const parseISO = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

// Días desde hoy hasta la fecha (negativo = en el pasado).
export const daysFromToday = (iso) => {
  if (!iso) return null;
  return Math.round((parseISO(iso) - parseISO(todayISO())) / 86400000);
};

const dateFmt = new Intl.DateTimeFormat('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('es-VE', { day: 'numeric', month: 'short' });
const monthFmt = new Intl.DateTimeFormat('es-VE', { month: 'short' });

export const formatDate = (iso) => (iso ? dateFmt.format(parseISO(iso)) : '—');
export const formatShortDate = (iso) => (iso ? shortFmt.format(parseISO(iso)) : '—');
export const monthLabel = (date) => monthFmt.format(date).replace('.', '');

export const relativeDay = (iso) => {
  const diff = daysFromToday(iso);
  if (diff === null) return '';
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  if (diff < 0) return `Hace ${-diff} días`;
  if (diff < 7) return `En ${diff} días`;
  return formatShortDate(iso);
};

export const formatMoney = (value, currency = 'USD', decimals = 2) => {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(decimals)}`;
  }
};

export const formatCompact = (value, currency = 'USD') => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 10000) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(n);
  }
  return formatMoney(n, currency, 0);
};

// Normaliza a formato internacional para wa.me (0414... -> 58414...).
export const phoneDigits = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) digits = '58' + digits.slice(1);
  return digits;
};

export const whatsappUrl = (phone, text = '') => {
  const digits = phoneDigits(phone);
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${query}`;
};

export const openWhatsApp = (phone, text) => {
  window.open(whatsappUrl(phone, text), '_blank', 'noopener');
};

export const initials = (text) =>
  String(text || '?')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || '?';

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export const matches = (query, ...fields) => {
  const q = normalize(query).trim();
  if (!q) return true;
  return fields.some(f => normalize(f).includes(q));
};

export const downloadFile = (filename, content, type = 'application/json') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const toCSV = (rows) =>
  rows
    .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
