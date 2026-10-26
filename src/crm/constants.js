// Catálogos y etiquetas compartidas por todo el CRM.

export const STAGES = [
  { key: 'lead', label: 'Prospecto', prob: 10, tone: 'slate' },
  { key: 'contacted', label: 'Contactado', prob: 25, tone: 'blue' },
  { key: 'proposal', label: 'Propuesta enviada', prob: 50, tone: 'violet' },
  { key: 'negotiation', label: 'Negociación', prob: 75, tone: 'amber' },
  { key: 'won', label: 'Cliente ganado', prob: 100, tone: 'emerald' },
  { key: 'lost', label: 'Perdido', prob: 0, tone: 'rose' }
];
export const OPEN_STAGES = ['lead', 'contacted', 'proposal', 'negotiation'];

export const QUOTE_STATUS = {
  draft: { label: 'Borrador', tone: 'slate' },
  sent: { label: 'Enviada', tone: 'blue' },
  approved: { label: 'Aprobada', tone: 'emerald' },
  rejected: { label: 'Rechazada', tone: 'rose' },
  expired: { label: 'Vencida', tone: 'amber' }
};

export const PROJECT_STATUS = {
  planning: { label: 'Planificación', tone: 'blue' },
  in_progress: { label: 'En desarrollo', tone: 'cyan' },
  review: { label: 'En revisión', tone: 'violet' },
  paused: { label: 'En pausa', tone: 'amber' },
  completed: { label: 'Completado', tone: 'emerald' }
};

export const ACTIVITY_TYPES = {
  note: { label: 'Nota', icon: '📝' },
  call: { label: 'Llamada', icon: '📞' },
  whatsapp: { label: 'WhatsApp', icon: '💬' },
  meeting: { label: 'Reunión', icon: '🤝' },
  email: { label: 'Correo', icon: '✉️' },
  system: { label: 'Sistema', icon: '⚙️' }
};

export const TASK_PRIORITY = {
  high: { label: 'Alta', tone: 'rose' },
  normal: { label: 'Normal', tone: 'blue' },
  low: { label: 'Baja', tone: 'slate' }
};

export const SOURCES = ['Referido', 'WhatsApp', 'Instagram', 'Sitio web', 'Google', 'Visita directa', 'Otro'];

export const INDUSTRIES = [
  'Comercio & Retail',
  'Gastronomía',
  'Logística & Distribución',
  'Salud',
  'Educación',
  'Servicios profesionales',
  'Manufactura',
  'Otro'
];

export const SERVICE_TYPES = [
  'Desarrollo Web a Medida',
  'Puntos de Venta (POS) & Redes',
  'Software de Costos & Finanzas',
  'Base de Datos & Optimización',
  'Soporte Mensual',
  'Otro'
];

export const PAYMENT_METHODS = ['Zelle', 'Pago Móvil', 'Transferencia', 'Efectivo USD', 'Binance / USDT', 'PayPal'];

// Clases para badges según el tono (deben aparecer completas para que Tailwind las detecte).
export const TONES = {
  slate: 'bg-slate-500/10 text-slate-300 ring-slate-500/30',
  blue: 'bg-blue-500/10 text-blue-300 ring-blue-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/30',
  violet: 'bg-violet-500/10 text-violet-300 ring-violet-500/30',
  amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
  rose: 'bg-rose-500/10 text-rose-300 ring-rose-500/30'
};

export const TONE_DOT = {
  slate: 'bg-slate-400',
  blue: 'bg-blue-400',
  cyan: 'bg-cyan-400',
  violet: 'bg-violet-400',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-400',
  rose: 'bg-rose-400'
};

export const stageOf = (key) => STAGES.find(s => s.key === key) || STAGES[0];

export const OWNER_WHATSAPP = '584247130583';
