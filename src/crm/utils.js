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

// ID único corto (sin choques entre dispositivos): CLI-7F3K2Q.
const ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const uid = (prefix, length = 6) => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return `${prefix}-${Array.from(bytes, b => ID_CHARS[b % ID_CHARS.length]).join('')}`;
};

// Bolívares con separadores venezolanos: Bs. 1.234,56
const vesFmt = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatBs = (value) => `Bs. ${vesFmt.format(Number(value) || 0)}`;
export const formatRate = (value) => vesFmt.format(Number(value) || 0);

// Mes en formato YYYY-MM y su nombre largo ("octubre 2026").
export const monthKeyOf = (iso) => String(iso || '').slice(0, 7);
const longMonthFmt = new Intl.DateTimeFormat('es-VE', { month: 'long', year: 'numeric' });
export const longMonthLabel = (key) => longMonthFmt.format(parseISO(`${key}-01`));

// Tiempo transcurrido legible desde una fecha/hora ISO: "hace 3 h", "hace 2 días".
export const timeAgo = (iso) => {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} día${days === 1 ? '' : 's'}`;
};

const dateTimeFmt = new Intl.DateTimeFormat('es-VE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
export const formatDateTime = (iso) => (iso ? dateTimeFmt.format(new Date(iso)) : '—');

// Totales de una cotización (compartido por el CRM y el portal del cliente).
export const computeQuoteTotals = (q, defaultTaxRate = 16) => {
  const subtotal = (q.items || []).reduce((acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
  const pct = Math.min(100, Math.max(0, Number(q.discountPercent) || 0));
  const discount = subtotal * pct / 100;
  const rate = q.taxRate ?? defaultTaxRate;
  const tax = q.applyTax ? (subtotal - discount) * rate / 100 : 0;
  return { subtotal, discount, tax, taxRate: rate, total: subtotal - discount + tax };
};

// Reduce una imagen a un cuadrado pequeño en data URL (para el logo del negocio).
export const imageToDataUrl = (file, size = 160) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => reject(new Error('El archivo no es una imagen válida.'));
    img.onload = () => {
      const scale = Math.min(size / img.width, size / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
