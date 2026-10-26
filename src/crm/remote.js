// Sincronización del estado del CRM con Supabase: carga inicial completa y, en cada cambio,
// envía solo las filas nuevas/modificadas y borra las eliminadas.
import { watch } from 'vue';
import { supabase } from './supabase';

// Columnas permitidas por tabla (en camelCase, igual que el estado local).
const COLUMNS = {
  clients: ['id', 'company', 'name', 'phone', 'email', 'city', 'industry', 'source', 'stage', 'value', 'tags', 'notes', 'nextFollowUp', 'createdAt'],
  activities: ['id', 'clientId', 'type', 'text', 'date'],
  quotes: ['id', 'clientId', 'date', 'validityDays', 'serviceType', 'status', 'deliveryTime', 'paymentTerms', 'notes', 'discountPercent', 'applyTax', 'taxRate', 'projectId', 'items'],
  projects: ['id', 'title', 'clientId', 'quoteId', 'category', 'status', 'budget', 'startDate', 'dueDate', 'description', 'milestones'],
  payments: ['id', 'clientId', 'projectId', 'amount', 'date', 'method', 'reference', 'note'],
  tasks: ['id', 'title', 'clientId', 'dueDate', 'priority', 'done']
};
// Los clientes van primero: el resto de tablas los referencia.
const TABLES = Object.keys(COLUMNS);
const NULLABLE = new Set(['nextFollowUp', 'startDate', 'dueDate', 'projectId', 'quoteId', 'clientId']);
const NUMERIC = new Set(['value', 'amount', 'budget', 'discountPercent', 'taxRate', 'validityDays']);

const snake = (k) => k.replace(/[A-Z]/g, m => '_' + m.toLowerCase());

const toRow = (table, item, userId) => {
  const row = { user_id: userId };
  for (const key of COLUMNS[table]) {
    let v = item[key];
    if (v === '' && NULLABLE.has(key)) v = null;
    if (v === undefined) v = NULLABLE.has(key) ? null : undefined;
    if (NUMERIC.has(key)) v = Number(v) || 0;
    if (v !== undefined) row[snake(key)] = v;
  }
  if (table === 'tasks' && !row.client_id) row.client_id = null;
  return row;
};

const fromRow = (table, row) => {
  const item = {};
  for (const key of COLUMNS[table]) {
    const v = row[snake(key)];
    item[key] = NUMERIC.has(key) ? Number(v) || 0 : v ?? (NULLABLE.has(key) ? null : '');
  }
  if (table === 'tasks' && !item.clientId) item.clientId = '';
  return item;
};

const fail = (error) => { if (error) throw new Error(error.message); };

export async function fetchWorkspace() {
  const [settingsRes, ...lists] = await Promise.all([
    supabase.from('crm_settings').select('data, seq').maybeSingle(),
    ...TABLES.map(t => supabase.from(t).select('*'))
  ]);
  fail(settingsRes.error);
  lists.forEach(r => fail(r.error));
  if (!settingsRes.data) return null; // usuario nuevo: aún no hay datos
  const data = { settings: settingsRes.data.data, seq: settingsRes.data.seq };
  TABLES.forEach((t, i) => {
    data[t] = lists[i].data.map(r => fromRow(t, r));
  });
  // Orden de lectura: lo más reciente primero, como en la versión local.
  data.activities.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
  ['clients', 'quotes', 'projects', 'payments', 'tasks'].forEach(t => data[t].sort((a, b) => b.id.localeCompare(a.id)));
  return data;
}

export function attachRemoteSync(state, status, userId) {
  // Huella de lo que ya está guardado en el servidor, por tabla e id.
  let synced = Object.fromEntries(TABLES.map(t => [t, new Map()]));
  let syncedSettings = '';
  let running = false;
  let pending = false;
  let timer = null;

  const snapshot = () => {
    synced = {};
    for (const t of TABLES) synced[t] = new Map(state[t].map(x => [x.id, JSON.stringify(toRow(t, x, userId))]));
    syncedSettings = JSON.stringify({ s: state.settings, q: state.seq });
  };

  const push = async () => {
    if (running) { pending = true; return; }
    running = true;
    status.saving = true;
    try {
      const settingsJson = JSON.stringify({ s: state.settings, q: state.seq });
      if (settingsJson !== syncedSettings) {
        const { error } = await supabase.from('crm_settings').upsert({ user_id: userId, data: state.settings, seq: state.seq });
        fail(error);
        syncedSettings = settingsJson;
      }
      // Altas y cambios (clientes primero por las referencias).
      for (const t of TABLES) {
        const rows = [];
        const jsons = [];
        for (const item of state[t]) {
          const row = toRow(t, item, userId);
          const json = JSON.stringify(row);
          if (synced[t].get(item.id) !== json) { rows.push(row); jsons.push([item.id, json]); }
        }
        if (rows.length) {
          const { error } = await supabase.from(t).upsert(rows, { onConflict: 'user_id,id' });
          fail(error);
          jsons.forEach(([id, json]) => synced[t].set(id, json));
        }
      }
      // Bajas (de hijos a padres; borrar un cliente elimina en cascada lo demás).
      for (const t of [...TABLES].reverse()) {
        const alive = new Set(state[t].map(x => x.id));
        const gone = [...synced[t].keys()].filter(id => !alive.has(id));
        if (gone.length) {
          const { error } = await supabase.from(t).delete().eq('user_id', userId).in('id', gone);
          fail(error);
          gone.forEach(id => synced[t].delete(id));
        }
      }
      status.error = '';
      status.lastSync = new Date();
    } catch (e) {
      status.error = e.message || 'Error de conexión';
      console.error('Sincronización CRM:', e);
    } finally {
      running = false;
      status.saving = false;
      status.dirty = pending;
      if (pending) { pending = false; push(); }
    }
  };

  const schedule = () => {
    status.dirty = true;
    clearTimeout(timer);
    timer = setTimeout(push, 600);
  };

  const stop = watch(state, () => { if (status.ready) schedule(); }, { deep: true });

  return {
    snapshot,
    push,
    stop,
    hasPending: () => status.dirty || running,
    flushNow: () => { clearTimeout(timer); return push(); }
  };
}
