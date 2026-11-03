// Sincronización del estado del CRM con Supabase: carga inicial completa, envío de solo las filas
// nuevas/modificadas/eliminadas y recepción en tiempo real de los cambios hechos en otros dispositivos.
import { watch } from 'vue';
import { supabase } from './supabase';

// Columnas permitidas por tabla (en camelCase, igual que el estado local).
const COLUMNS = {
  clients: ['id', 'company', 'name', 'phone', 'email', 'city', 'industry', 'source', 'stage', 'value', 'tags', 'notes', 'nextFollowUp', 'createdAt', 'portalToken'],
  activities: ['id', 'clientId', 'type', 'text', 'date'],
  quotes: ['id', 'clientId', 'date', 'validityDays', 'serviceType', 'status', 'deliveryTime', 'paymentTerms', 'notes', 'discountPercent', 'applyTax', 'taxRate', 'projectId', 'items', 'approvedAt', 'approvedBy'],
  projects: ['id', 'title', 'clientId', 'quoteId', 'category', 'status', 'budget', 'startDate', 'dueDate', 'description', 'milestones'],
  payments: ['id', 'clientId', 'projectId', 'amount', 'date', 'method', 'reference', 'note', 'currency', 'amountVes', 'rate', 'subscriptionId', 'period'],
  tasks: ['id', 'title', 'clientId', 'dueDate', 'priority', 'done'],
  tickets: ['id', 'clientId', 'title', 'device', 'category', 'priority', 'status', 'openedAt', 'resolvedAt', 'description', 'solution', 'charge'],
  subscriptions: ['id', 'clientId', 'title', 'amount', 'billingDay', 'startDate', 'active', 'notes'],
  expenses: ['id', 'date', 'amount', 'category', 'description', 'projectId', 'clientId', 'method', 'currency', 'amountVes', 'rate']
};
// Los clientes van primero: el resto de tablas los referencia.
export const TABLES = Object.keys(COLUMNS);
const NULLABLE = new Set(['nextFollowUp', 'startDate', 'dueDate', 'projectId', 'quoteId', 'clientId', 'portalToken', 'approvedAt', 'resolvedAt', 'subscriptionId']);
const NUMERIC = new Set(['value', 'amount', 'budget', 'discountPercent', 'taxRate', 'validityDays', 'amountVes', 'rate', 'charge', 'billingDay']);
// Tablas cuyo cliente es opcional (en el estado local se representa con '').
const OPTIONAL_CLIENT = new Set(['tasks', 'expenses']);

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
  return row;
};

export const fromRow = (table, row) => {
  const item = {};
  for (const key of COLUMNS[table]) {
    const v = row[snake(key)];
    item[key] = NUMERIC.has(key) ? Number(v) || 0 : v ?? (NULLABLE.has(key) ? null : '');
  }
  if (OPTIONAL_CLIENT.has(table) && !item.clientId) item.clientId = '';
  return item;
};

const fail = (error) => { if (error) throw new Error(error.message); };

export async function fetchWorkspace() {
  const [settingsRes, ...lists] = await Promise.all([
    supabase.from('crm_settings').select('data, seq').maybeSingle(),
    // Lo más reciente primero, como en la versión local.
    ...TABLES.map(t => supabase.from(t).select('*').order('inserted_at', { ascending: false }))
  ]);
  fail(settingsRes.error);
  lists.forEach(r => fail(r.error));
  if (!settingsRes.data) return null; // usuario nuevo: aún no hay datos
  const data = { settings: settingsRes.data.data, seq: settingsRes.data.seq };
  TABLES.forEach((t, i) => {
    data[t] = lists[i].data.map(r => fromRow(t, r));
  });
  data.activities.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return data;
}

export function attachRemoteSync(state, status, userId) {
  // Huella de lo que ya está guardado en el servidor, por tabla e id.
  let synced = Object.fromEntries(TABLES.map(t => [t, new Map()]));
  let syncedSettings = '';
  let running = false;
  let pending = false;
  let timer = null;

  const settingsJson = () => JSON.stringify({ s: state.settings, q: state.seq });
  const snapshot = () => {
    synced = {};
    for (const t of TABLES) synced[t] = new Map(state[t].map(x => [x.id, JSON.stringify(toRow(t, x, userId))]));
    syncedSettings = settingsJson();
  };

  const push = async () => {
    if (running) { pending = true; return; }
    running = true;
    status.saving = true;
    try {
      const sj = settingsJson();
      if (sj !== syncedSettings) {
        const { error } = await supabase.from('crm_settings').upsert({ user_id: userId, data: state.settings, seq: state.seq });
        fail(error);
        syncedSettings = sj;
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

  const stopWatch = watch(state, () => { if (status.ready) schedule(); }, { deep: true });

  // ---------------- Tiempo real: aplica los cambios que llegan de otros dispositivos.
  const applyUpsert = (t, row) => {
    if (row.user_id !== userId) return;
    const item = fromRow(t, row);
    const json = JSON.stringify(toRow(t, item, userId));
    if (synced[t].get(item.id) === json) return; // eco de un cambio propio
    synced[t].set(item.id, json);
    const list = state[t];
    const i = list.findIndex(x => x.id === item.id);
    if (i >= 0) list[i] = item; else list.unshift(item);
  };
  const applyDelete = (t, old) => {
    if (old.user_id !== userId || !synced[t].has(old.id)) return;
    synced[t].delete(old.id);
    state[t] = state[t].filter(x => x.id !== old.id);
  };
  const applySettings = (row) => {
    if (row.user_id !== userId) return;
    const json = JSON.stringify({ s: row.data, q: row.seq });
    if (json === syncedSettings) return;
    syncedSettings = json;
    state.settings = row.data;
    state.seq = row.seq;
  };

  let channel = supabase.channel(`crm-${userId}`);
  const filter = `user_id=eq.${userId}`;
  for (const t of TABLES) {
    channel = channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: t, filter }, (p) => applyUpsert(t, p.new))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: t, filter }, (p) => applyUpsert(t, p.new))
      // Los borrados no admiten filtro: se verifica el usuario en applyDelete.
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: t }, (p) => applyDelete(t, p.old));
  }
  channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_settings', filter }, (p) => p.new && applySettings(p.new))
    .subscribe((st) => { status.live = st === 'SUBSCRIBED'; });

  return {
    snapshot,
    push,
    stop: () => { stopWatch(); supabase.removeChannel(channel); },
    hasPending: () => status.dirty || running,
    flushNow: () => { clearTimeout(timer); return push(); }
  };
}

// ---------------- Portal del cliente (acceso público por enlace secreto)
export async function fetchPortal(token) {
  const { data, error } = await supabase.rpc('crm_portal', { p_token: token });
  fail(error);
  if (!data) return null;
  return {
    client: data.client,
    settings: data.settings || {},
    quotes: (data.quotes || []).map(r => fromRow('quotes', r)),
    projects: (data.projects || []).map(r => fromRow('projects', r)),
    payments: (data.payments || []).map(r => fromRow('payments', r)),
    tickets: (data.tickets || []).map(r => fromRow('tickets', r))
  };
}

export async function approveFromPortal(token, quoteId, name) {
  const { data, error } = await supabase.rpc('crm_portal_approve', { p_token: token, p_quote_id: quoteId, p_name: name || '' });
  fail(error);
  return !!data;
}

export async function nextServerNumber(kind, min) {
  const { data, error } = await supabase.rpc('crm_next_number', { p_kind: kind, p_min: min });
  fail(error);
  return data;
}
