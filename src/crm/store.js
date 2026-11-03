// Estado del CRM por espacio de trabajo: 'demo' se guarda en el navegador del visitante,
// 'private' se sincroniza con Supabase (ver remote.js).
import { reactive, watch } from 'vue';
import { fetchWorkspace, attachRemoteSync, nextServerNumber } from './remote';
import { buildDemoData, emptyData, defaultSettings, LEGACY_SEED_IDS } from './seed';
import { todayISO, clone, daysFromToday, addDays, formatMoney, uid, computeQuoteTotals, monthKeyOf } from './utils';
import { stageOf, OPEN_STAGES } from './constants';

const storageKey = (ws) => `jc_crm_v5_${ws}`;

const readJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const LISTS = ['clients', 'activities', 'quotes', 'projects', 'payments', 'tasks', 'tickets', 'subscriptions', 'expenses'];

// Completa campos faltantes para que datos viejos o importados no rompan la interfaz.
const hydrate = (data) => {
  const base = emptyData();
  const out = { ...base, ...data };
  out.settings = { ...defaultSettings(), ...(data.settings || {}) };
  out.seq = { ...base.seq, ...(data.seq || {}) };
  for (const key of LISTS) {
    out[key] = Array.isArray(data[key]) ? data[key] : [];
  }
  out.clients.forEach(c => { c.tags ||= []; c.stage ||= 'lead'; });
  out.projects.forEach(p => { p.milestones ||= p.tasks || []; delete p.tasks; });
  out.payments.forEach(p => { p.currency ||= 'USD'; p.amountVes ??= 0; p.rate ??= 0; p.subscriptionId ??= null; p.period ??= ''; });
  return out;
};

// Importa registros reales creados con la versión anterior del CRM (claves jc_crm_*), sin la demo vieja.
const migrateLegacy = () => {
  const oldClients = (readJSON('jc_crm_clients') || []).filter(c => !LEGACY_SEED_IDS.has(c.id));
  const oldQuotes = (readJSON('jc_crm_quotes') || []).filter(q => !LEGACY_SEED_IDS.has(q.id));
  const oldProjects = (readJSON('jc_crm_projects') || []).filter(p => !LEGACY_SEED_IDS.has(p.id));
  if (!oldClients.length && !oldQuotes.length && !oldProjects.length) return null;

  const data = emptyData();
  const stageMap = { lead: 'lead', quoting: 'proposal', in_progress: 'won', active: 'won', closed: 'lost' };
  const quoteMap = { draft: 'draft', sent: 'sent', approved: 'approved', in_progress: 'approved', paid: 'approved', cancelled: 'rejected' };
  data.clients = oldClients.map(c => ({
    id: c.id, company: c.company, name: c.name, phone: c.phone || '', email: c.email || '', city: c.city || '',
    industry: 'Otro', source: 'Otro', stage: stageMap[c.status] || 'lead', value: 0, tags: [],
    notes: c.notes || '', nextFollowUp: null, createdAt: c.createdAt || todayISO()
  }));
  data.quotes = oldQuotes.map(q => ({
    id: q.id, clientId: q.clientId || '', date: q.date, validityDays: q.validityDays || 15, serviceType: q.serviceType || 'Otro',
    status: quoteMap[q.status] || 'draft', deliveryTime: q.deliveryTime || '', paymentTerms: q.paymentTerms || '', notes: q.notes || '',
    discountPercent: q.discountPercent || 0, applyTax: !!q.applyTax, taxRate: 16, projectId: null,
    items: (q.items || []).map(i => ({ id: i.id, description: i.description, quantity: i.quantity, unitPrice: i.unitPrice }))
  }));
  data.projects = oldProjects.map(p => ({
    id: p.id, title: p.title, clientId: p.clientId || '', quoteId: null, category: p.category || 'Otro',
    status: p.status === 'review' ? 'review' : p.status, budget: p.budget || 0, startDate: p.startDate, dueDate: p.dueDate,
    description: '', milestones: p.tasks || []
  }));
  data.seq.client = data.clients.length;
  data.seq.quote = data.quotes.length;
  data.seq.project = data.projects.length;
  return data;
};

const loadDemo = () => {
  try { localStorage.removeItem('jc_crm_v4_demo'); } catch { /* sin almacenamiento */ }
  const saved = readJSON(storageKey('demo'));
  return saved ? hydrate(saved) : buildDemoData();
};

// options.userId es obligatorio para el espacio privado (Supabase).
export function createCrmStore(ws, options = {}) {
  const isDemo = ws === 'demo';
  const state = reactive(isDemo ? loadDemo() : emptyData());
  const status = reactive({ ready: isDemo, loading: !isDemo, saving: false, dirty: false, error: '', lastSync: null, migrated: false, live: false });
  let saveTimer = null;
  let remote = null;

  const persist = () => {
    try {
      localStorage.setItem(storageKey('demo'), JSON.stringify(state));
    } catch (e) {
      console.error('No se pudo guardar la demo:', e);
    }
  };

  // Carga inicial desde Supabase. La primera vez crea el espacio y trae los datos
  // creados con la versión anterior del CRM en este navegador (si los hay).
  const load = async () => {
    status.loading = true;
    status.error = '';
    try {
      remote?.stop();
      const data = await fetchWorkspace();
      status.ready = false;
      let fresh = false;
      if (data) {
        replaceAll(data);
      } else {
        const legacy = migrateLegacy();
        replaceAll(legacy || emptyData());
        status.migrated = !!legacy;
        fresh = true;
      }
      remote = attachRemoteSync(state, status, options.userId);
      if (fresh) await remote.push(); else remote.snapshot();
      status.ready = true;
    } catch (e) {
      status.error = e.message || 'No se pudo conectar con la base de datos.';
    } finally {
      status.loading = false;
    }
  };

  if (isDemo) {
    watch(state, () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(persist, 200);
    }, { deep: true });
    persist();
  }

  // ---------------------------------------------------------------- helpers
  // IDs aleatorios: dos dispositivos nunca generan el mismo. Solo las cotizaciones llevan un
  // correlativo (COT-001) y en el espacio privado lo asigna el servidor (crm_next_number).
  const PREFIX = { client: 'CLI', project: 'PRY', payment: 'PAG', task: 'TAR', activity: 'ACT', ticket: 'TCK', subscription: 'PLN', expense: 'GTO' };
  const LIST = { client: 'clients', project: 'projects', payment: 'payments', task: 'tasks', activity: 'activities', ticket: 'tickets', subscription: 'subscriptions', expense: 'expenses' };
  const nextId = (kind) => {
    let id;
    do { id = uid(PREFIX[kind], kind === 'activity' ? 8 : 6); } while (state[LIST[kind]].some(x => x.id === id));
    return id;
  };
  const quoteNumber = (id) => Number(String(id).match(/(\d+)$/)?.[1]) || 0;
  const allocQuoteId = async () => {
    const prefix = state.settings.quotePrefix || 'COT';
    const localMax = Math.max(state.seq.quote || 0, ...state.quotes.map(q => quoteNumber(q.id)));
    let n = localMax;
    let id;
    do {
      n = isDemo ? n + 1 : await nextServerNumber('quote', n + 1);
      id = `${prefix}-${String(n).padStart(3, '0')}`;
    } while (state.quotes.some(q => q.id === id));
    state.seq.quote = Math.max(state.seq.quote || 0, n);
    return id;
  };
  const replaceById = (list, item) => {
    const i = list.findIndex(x => x.id === item.id);
    if (i >= 0) list[i] = item; else list.unshift(item);
  };

  const client = (id) => state.clients.find(c => c.id === id) || null;
  const project = (id) => state.projects.find(p => p.id === id) || null;
  const quote = (id) => state.quotes.find(q => q.id === id) || null;
  const money = (v) => formatMoney(v, state.settings.currency);

  // ---------------------------------------------------------------- cálculos
  const quoteTotals = (q) => computeQuoteTotals(q, state.settings.taxRate);
  const quoteStatus = (q) => {
    if (q.status === 'sent' && daysFromToday(addDays(q.date, q.validityDays || 15)) < 0) return 'expired';
    return q.status;
  };
  const projectProgress = (p) => {
    const list = p.milestones || [];
    return list.length ? Math.round(list.filter(m => m.done).length / list.length * 100) : 0;
  };
  const projectPaid = (p) => state.payments.filter(x => x.projectId === p.id).reduce((a, x) => a + Number(x.amount || 0), 0);
  const projectBalance = (p) => Math.max(0, Number(p.budget || 0) - projectPaid(p));
  const clientPaid = (id) => state.payments.filter(x => x.clientId === id).reduce((a, x) => a + Number(x.amount || 0), 0);
  const clientBalance = (id) => state.projects.filter(p => p.clientId === id).reduce((a, p) => a + projectBalance(p), 0);
  const projectExpenses = (p) => state.expenses.filter(x => x.projectId === p.id).reduce((a, x) => a + Number(x.amount || 0), 0);
  // Ganancia real del proyecto: lo cobrado menos los gastos asociados.
  const projectProfit = (p) => projectPaid(p) - projectExpenses(p);

  // Planes mensuales: estado del cobro de un período (YYYY-MM).
  const planPayment = (plan, period) => state.payments.find(x => x.subscriptionId === plan.id && x.period === period) || null;
  // 'none' = el período es anterior al inicio del plan; 'paused' = plan inactivo sin pago ese mes.
  const planStatus = (plan, period = monthKeyOf(todayISO())) => {
    if (planPayment(plan, period)) return 'paid';
    if (plan.startDate && period < monthKeyOf(plan.startDate)) return 'none';
    if (!plan.active) return 'paused';
    const due = `${period}-${String(plan.billingDay || 1).padStart(2, '0')}`;
    const diff = daysFromToday(due);
    return diff < 0 ? 'overdue' : diff <= 3 ? 'due' : 'upcoming';
  };
  const monthlyRecurring = () => state.subscriptions.filter(x => x.active).reduce((a, x) => a + Number(x.amount || 0), 0);

  // Tickets: horas abiertos y si superaron el tiempo de respuesta comprometido.
  const ticketHours = (t) => ((t.resolvedAt ? new Date(t.resolvedAt) : new Date()) - new Date(t.openedAt)) / 3600000;
  const ticketOverdue = (t, slaHours) => t.status !== 'resolved' && ticketHours(t) > slaHours;

  // ---------------------------------------------------------------- actividad
  const logActivity = (clientId, type, text, date = todayISO()) => {
    if (!clientId) return;
    state.activities.unshift({ id: nextId('activity'), clientId, type, text, date });
  };
  const deleteActivity = (id) => {
    state.activities = state.activities.filter(a => a.id !== id);
  };

  // ---------------------------------------------------------------- clientes
  const saveClient = (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) {
      item.id = nextId('client');
      item.createdAt = todayISO();
    }
    item.value = Number(item.value) || 0;
    item.tags = (item.tags || []).filter(Boolean);
    replaceById(state.clients, item);
    if (isNew) logActivity(item.id, 'system', 'Cliente registrado en el CRM.');
    return item;
  };
  const setClientStage = (id, stage) => {
    const c = client(id);
    if (!c || c.stage === stage) return;
    logActivity(id, 'system', `Etapa: ${stageOf(c.stage).label} → ${stageOf(stage).label}.`);
    c.stage = stage;
  };
  const clientLinks = (id) => ({
    quotes: state.quotes.filter(q => q.clientId === id).length,
    projects: state.projects.filter(p => p.clientId === id).length,
    payments: state.payments.filter(p => p.clientId === id).length
  });
  const deleteClient = (id) => {
    const projectIds = new Set(state.projects.filter(p => p.clientId === id).map(p => p.id));
    state.clients = state.clients.filter(c => c.id !== id);
    state.quotes = state.quotes.filter(q => q.clientId !== id);
    state.projects = state.projects.filter(p => p.clientId !== id);
    state.payments = state.payments.filter(p => p.clientId !== id && !projectIds.has(p.projectId));
    state.tasks = state.tasks.filter(t => t.clientId !== id);
    state.activities = state.activities.filter(a => a.clientId !== id);
    state.tickets = state.tickets.filter(t => t.clientId !== id);
    state.subscriptions = state.subscriptions.filter(x => x.clientId !== id);
    state.expenses = state.expenses.filter(x => x.clientId !== id);
  };
  const ensurePortalToken = (id) => {
    const c = client(id);
    if (c && !c.portalToken) c.portalToken = crypto.randomUUID();
    return c?.portalToken;
  };
  // Invalida el enlace anterior del portal y genera uno nuevo.
  const resetPortalToken = (id) => {
    const c = client(id);
    if (!c) return null;
    c.portalToken = crypto.randomUUID();
    logActivity(id, 'system', 'Se generó un nuevo enlace del portal del cliente.');
    return c.portalToken;
  };
  // Lo que el cliente ve en su portal, con la misma forma que fetchPortal (vista previa y demo).
  const portalSnapshot = (id) => {
    const c = client(id);
    if (!c) return null;
    const own = (list) => list.filter(x => x.clientId === id);
    const { catalog, monthlyGoal, ...settings } = state.settings;
    return clone({
      client: { id: c.id, company: c.company, name: c.name },
      settings,
      quotes: own(state.quotes).filter(q => q.status !== 'draft').sort((a, b) => b.date.localeCompare(a.date)),
      projects: own(state.projects),
      payments: own(state.payments).sort((a, b) => b.date.localeCompare(a.date)),
      tickets: own(state.tickets).sort((a, b) => b.openedAt.localeCompare(a.openedAt))
        .map(({ id: tid, title, device, status, priority, openedAt, resolvedAt, solution }) => ({ id: tid, title, device, status, priority, openedAt, resolvedAt, solution }))
    });
  };

  // ---------------------------------------------------------------- cotizaciones
  const newQuoteDraft = (clientId = '') => ({
    id: '',
    clientId,
    date: todayISO(),
    validityDays: state.settings.defaultValidity,
    serviceType: 'Desarrollo Web a Medida',
    status: 'draft',
    deliveryTime: state.settings.defaultDelivery,
    paymentTerms: state.settings.defaultPaymentTerms,
    notes: state.settings.defaultNotes,
    discountPercent: 0,
    applyTax: false,
    taxRate: state.settings.taxRate,
    projectId: null,
    approvedAt: null,
    approvedBy: '',
    items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }]
  });
  // Asíncrona: el número de una cotización nueva lo asigna el servidor.
  const saveQuote = async (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) item.id = await allocQuoteId();
    item.items = item.items.map(i => ({ ...i, quantity: Number(i.quantity) || 0, unitPrice: Number(i.unitPrice) || 0 }));
    replaceById(state.quotes, item);
    const c = client(item.clientId);
    if (isNew && c) {
      logActivity(c.id, 'system', `Cotización ${item.id} creada por ${money(quoteTotals(item).total)}.`);
      if (['lead', 'contacted'].includes(c.stage)) setClientStage(c.id, 'proposal');
    }
    return item;
  };
  const setQuoteStatus = (id, status, approvedBy = '') => {
    const q = quote(id);
    if (!q || q.status === status) return;
    q.status = status;
    q.approvedAt = status === 'approved' ? new Date().toISOString() : null;
    q.approvedBy = status === 'approved' ? approvedBy : '';
    const label = { draft: 'pasó a borrador', sent: 'enviada', approved: 'aprobada', rejected: 'rechazada' }[status];
    logActivity(q.clientId, 'system', `Cotización ${q.id} ${label}.`);
    const c = client(q.clientId);
    if (c && status === 'approved' && OPEN_STAGES.includes(c.stage)) setClientStage(c.id, 'won');
    if (c && status === 'sent' && ['lead', 'contacted'].includes(c.stage)) setClientStage(c.id, 'proposal');
  };
  const duplicateQuote = (id) => {
    const q = quote(id);
    if (!q) return null;
    return saveQuote({ ...clone(q), id: '', date: todayISO(), status: 'draft', projectId: null, approvedAt: null, approvedBy: '' });
  };
  const deleteQuote = (id) => {
    state.quotes = state.quotes.filter(q => q.id !== id);
    state.projects.forEach(p => { if (p.quoteId === id) p.quoteId = null; });
  };
  const convertQuoteToProject = (id) => {
    const q = quote(id);
    if (!q) return null;
    if (q.projectId && project(q.projectId)) return project(q.projectId);
    const p = saveProject({
      title: q.items[0]?.description?.slice(0, 70) || q.serviceType,
      clientId: q.clientId,
      quoteId: q.id,
      category: q.serviceType,
      status: 'planning',
      budget: Math.round(quoteTotals(q).total * 100) / 100,
      startDate: todayISO(),
      dueDate: addDays(todayISO(), 15),
      description: q.notes || '',
      milestones: q.items.map((i, idx) => ({ id: idx + 1, text: i.description, done: false }))
    });
    q.projectId = p.id;
    if (q.status !== 'approved') setQuoteStatus(q.id, 'approved');
    return p;
  };

  // ---------------------------------------------------------------- proyectos
  const saveProject = (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) item.id = nextId('project');
    item.budget = Number(item.budget) || 0;
    item.milestones ||= [];
    replaceById(state.projects, item);
    if (isNew) logActivity(item.clientId, 'system', `Proyecto ${item.id} creado: ${item.title}.`);
    return item;
  };
  const toggleMilestone = (p, m) => {
    m.done = !m.done;
    const progress = projectProgress(p);
    if (progress === 100 && p.status !== 'completed') {
      p.status = 'completed';
      logActivity(p.clientId, 'system', `Proyecto ${p.id} completado.`);
    } else if (progress < 100 && p.status === 'completed') {
      p.status = 'in_progress';
    } else if (progress > 0 && p.status === 'planning') {
      p.status = 'in_progress';
    }
  };
  const addMilestone = (p, text) => {
    const nextNum = p.milestones.length ? Math.max(...p.milestones.map(m => m.id)) + 1 : 1;
    p.milestones.push({ id: nextNum, text, done: false });
    if (p.status === 'completed') p.status = 'in_progress';
  };
  const removeMilestone = (p, id) => {
    p.milestones = p.milestones.filter(m => m.id !== id);
  };
  const deleteProject = (id) => {
    state.projects = state.projects.filter(p => p.id !== id);
    state.payments.forEach(x => { if (x.projectId === id) x.projectId = null; });
    state.expenses.forEach(x => { if (x.projectId === id) x.projectId = null; });
    state.quotes.forEach(q => { if (q.projectId === id) q.projectId = null; });
  };

  // ---------------------------------------------------------------- cobros
  const savePayment = (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) item.id = nextId('payment');
    item.amount = Math.round((Number(item.amount) || 0) * 100) / 100;
    item.currency ||= 'USD';
    item.amountVes = Number(item.amountVes) || 0;
    item.rate = Number(item.rate) || 0;
    item.subscriptionId ||= null;
    item.period ||= '';
    if (item.projectId && !item.clientId) item.clientId = project(item.projectId)?.clientId || '';
    replaceById(state.payments, item);
    if (isNew) logActivity(item.clientId, 'system', `Cobro registrado: ${money(item.amount)} (${item.method}).`, item.date);
    return item;
  };
  const deletePayment = (id) => {
    state.payments = state.payments.filter(p => p.id !== id);
  };

  // ---------------------------------------------------------------- soporte técnico
  const saveTicket = (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) {
      item.id = nextId('ticket');
      item.openedAt ||= new Date().toISOString();
    }
    item.charge = Number(item.charge) || 0;
    if (item.status === 'resolved' && !item.resolvedAt) item.resolvedAt = new Date().toISOString();
    if (item.status !== 'resolved') item.resolvedAt = null;
    replaceById(state.tickets, item);
    if (isNew) logActivity(item.clientId, 'system', `Ticket ${item.id} abierto: ${item.title}.`);
    return item;
  };
  const setTicketStatus = (id, status) => {
    const t = state.tickets.find(x => x.id === id);
    if (!t || t.status === status) return;
    t.status = status;
    t.resolvedAt = status === 'resolved' ? new Date().toISOString() : null;
    if (status === 'resolved') logActivity(t.clientId, 'system', `Ticket ${t.id} resuelto: ${t.title}.`);
  };
  const deleteTicket = (id) => {
    state.tickets = state.tickets.filter(t => t.id !== id);
  };

  // ---------------------------------------------------------------- planes mensuales
  const saveSubscription = (data) => {
    const item = clone(data);
    const isNew = !item.id;
    if (isNew) item.id = nextId('subscription');
    item.amount = Number(item.amount) || 0;
    item.billingDay = Math.min(28, Math.max(1, Number(item.billingDay) || 1));
    replaceById(state.subscriptions, item);
    if (isNew) logActivity(item.clientId, 'system', `Plan mensual creado: ${item.title} (${money(item.amount)}/mes).`);
    return item;
  };
  const deleteSubscription = (id) => {
    state.subscriptions = state.subscriptions.filter(x => x.id !== id);
    state.payments.forEach(x => { if (x.subscriptionId === id) x.subscriptionId = null; });
  };

  // ---------------------------------------------------------------- gastos
  const saveExpense = (data) => {
    const item = clone(data);
    if (!item.id) item.id = nextId('expense');
    item.amount = Math.round((Number(item.amount) || 0) * 100) / 100;
    item.amountVes = Number(item.amountVes) || 0;
    item.rate = Number(item.rate) || 0;
    item.currency ||= 'USD';
    if (item.projectId && !item.clientId) item.clientId = project(item.projectId)?.clientId || '';
    replaceById(state.expenses, item);
    return item;
  };
  const deleteExpense = (id) => {
    state.expenses = state.expenses.filter(x => x.id !== id);
  };

  // ---------------------------------------------------------------- deshacer
  // Ejecuta un borrado y devuelve una función que lo revierte: reinserta lo eliminado y
  // restaura los registros que el borrado modificó (p. ej. referencias puestas en null).
  const withUndo = (fn) => {
    const before = Object.fromEntries(LISTS.map(k => [k, clone(state[k])]));
    fn();
    return () => {
      for (const k of LISTS) {
        const current = new Map(state[k].map(x => [x.id, x]));
        before[k].forEach((item, idx) => {
          const now = current.get(item.id);
          if (!now) state[k].splice(Math.min(idx, state[k].length), 0, item);
          else if (JSON.stringify(now) !== JSON.stringify(item)) Object.assign(now, item);
        });
      }
    };
  };

  // ---------------------------------------------------------------- tareas
  const saveTask = (data) => {
    const item = clone(data);
    if (!item.id) item.id = nextId('task');
    replaceById(state.tasks, item);
    return item;
  };
  const toggleTask = (id) => {
    const t = state.tasks.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    if (t.done) logActivity(t.clientId, 'system', `Tarea completada: ${t.title}.`);
  };
  const deleteTask = (id) => {
    state.tasks = state.tasks.filter(t => t.id !== id);
  };

  // ---------------------------------------------------------------- datos
  const exportData = () => JSON.stringify({ app: 'jc-crm', exportedAt: new Date().toISOString(), ...clone(state) }, null, 2);
  const replaceAll = (data) => {
    const next = hydrate(data);
    Object.keys(next).forEach(k => { state[k] = next[k]; });
  };
  const importData = (json) => {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    if (!data || !Array.isArray(data.clients)) throw new Error('El archivo no es un respaldo válido del CRM.');
    delete data.app;
    delete data.exportedAt;
    replaceAll(data);
  };
  const resetDemo = () => replaceAll(buildDemoData());
  const wipe = () => {
    const settings = clone(state.settings);
    replaceAll({ ...emptyData(), settings });
  };
  const hasPending = () => !!remote?.hasPending();
  const syncNow = () => remote?.flushNow();
  const dispose = () => remote?.stop();

  return {
    ws, isDemo, state, status, load, hasPending, syncNow, dispose, client, project, quote, money,
    quoteTotals, quoteStatus, projectProgress, projectPaid, projectBalance, clientPaid, clientBalance,
    logActivity, deleteActivity,
    saveClient, setClientStage, clientLinks, deleteClient,
    newQuoteDraft, saveQuote, setQuoteStatus, duplicateQuote, deleteQuote, convertQuoteToProject,
    saveProject, toggleMilestone, addMilestone, removeMilestone, deleteProject,
    savePayment, deletePayment,
    saveTask, toggleTask, deleteTask,
    saveTicket, setTicketStatus, deleteTicket, ticketHours, ticketOverdue,
    saveSubscription, deleteSubscription, planPayment, planStatus, monthlyRecurring,
    saveExpense, deleteExpense, projectExpenses, projectProfit,
    ensurePortalToken, resetPortalToken, portalSnapshot, withUndo,
    exportData, importData, resetDemo, wipe
  };
}
