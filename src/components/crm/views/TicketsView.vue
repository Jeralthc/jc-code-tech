<script setup>
import { ref, computed } from 'vue';
import {
  PlusIcon, MagnifyingGlassIcon, LifebuoyIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon, ArrowDownTrayIcon, ExclamationTriangleIcon, ClockIcon, WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { TICKET_STATUS, TICKET_PRIORITY } from '../../../crm/constants';
import { matches, timeAgo, formatDateTime, todayISO, openWhatsApp, toCSV, downloadFile } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const status = ref('active');
const priority = ref('all');

const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };
const BAR = { rose: 'bg-rose-500', amber: 'bg-amber-400', blue: 'bg-blue-400', slate: 'bg-slate-500' };
const sla = (t) => TICKET_PRIORITY[t.priority]?.sla || 72;
const overdue = (t) => crm.ticketOverdue(t, sla(t));
const active = computed(() => s.tickets.filter(t => t.status !== 'resolved'));

// Horas legibles: 45 min, 5 h, 3 días.
const hoursLabel = (h) => {
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} días`;
};
const slaInfo = (t) => {
  const used = crm.ticketHours(t);
  const limit = sla(t);
  const pct = Math.min(100, used / limit * 100);
  if (t.status === 'resolved') {
    const ok = used <= limit;
    return { pct: 100, bar: ok ? 'bg-emerald-500/80' : 'bg-rose-500/70', text: `Resuelto en ${hoursLabel(used)}`, sub: ok ? 'Dentro del tiempo' : `Se pasó por ${hoursLabel(used - limit)}`, tone: ok ? 'text-emerald-300' : 'text-rose-300' };
  }
  if (used > limit) return { pct: 100, bar: 'bg-rose-500', text: `Vencido hace ${hoursLabel(used - limit)}`, sub: `Meta: ${hoursLabel(limit)}`, tone: 'text-rose-300' };
  return { pct, bar: pct > 75 ? 'bg-amber-400' : 'bg-cyan-400', text: `Quedan ${hoursLabel(limit - used)}`, sub: `Meta: ${hoursLabel(limit)}`, tone: pct > 75 ? 'text-amber-300' : 'text-slate-300' };
};

const month = todayISO().slice(0, 7);
const resolvedMonth = computed(() => s.tickets.filter(t => t.status === 'resolved' && t.resolvedAt && formatLocalMonth(t.resolvedAt) === month));
function formatLocalMonth(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
const resolvedAll = computed(() => s.tickets.filter(t => t.status === 'resolved' && t.resolvedAt));
const avgHours = computed(() => resolvedAll.value.length ? resolvedAll.value.reduce((a, t) => a + crm.ticketHours(t), 0) / resolvedAll.value.length : 0);
const onTimePct = computed(() => resolvedAll.value.length ? Math.round(resolvedAll.value.filter(t => crm.ticketHours(t) <= sla(t)).length / resolvedAll.value.length * 100) : 0);

const kpis = computed(() => [
  { label: 'Tickets abiertos', value: active.value.length, sub: `${active.value.filter(t => t.priority === 'urgent').length} urgentes`, icon: LifebuoyIcon, tone: 'text-cyan-300' },
  { label: 'Fuera de tiempo', value: active.value.filter(overdue).length, sub: 'Superaron la meta de respuesta', icon: ExclamationTriangleIcon, tone: active.value.some(overdue) ? 'text-rose-300' : 'text-slate-300' },
  { label: 'Resueltos este mes', value: resolvedMonth.value.length, sub: `${crm.money(resolvedMonth.value.reduce((a, t) => a + Number(t.charge || 0), 0))} cobrados por servicio`, icon: CheckCircleIcon, tone: 'text-emerald-300' },
  { label: 'Tiempo promedio', value: resolvedAll.value.length ? hoursLabel(avgHours.value) : '—', sub: resolvedAll.value.length ? `${onTimePct.value}% dentro del tiempo` : 'Sin tickets resueltos', icon: ClockIcon, tone: 'text-violet-300' }
]);

const filters = computed(() => [
  { key: 'active', label: 'Activos', count: active.value.length },
  ...Object.entries(TICKET_STATUS).map(([key, v]) => ({ key, label: v.label, count: s.tickets.filter(t => t.status === key).length })),
  { key: 'all', label: 'Todos', count: s.tickets.length }
]);

const rows = computed(() => s.tickets
  .filter(t => status.value === 'all' || (status.value === 'active' ? t.status !== 'resolved' : t.status === status.value))
  .filter(t => priority.value === 'all' || t.priority === priority.value)
  .filter(t => matches(search.value, t.id, t.title, t.device, t.category, crm.client(t.clientId)?.company))
  .sort((a, b) =>
    (a.status === 'resolved') - (b.status === 'resolved')
    || (a.status === 'resolved' ? (b.resolvedAt || '').localeCompare(a.resolvedAt || '') : 0)
    || overdue(b) - overdue(a)
    || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    || a.openedAt.localeCompare(b.openedAt)));

const openResolve = (t) => ui.editTicket(t, { status: 'resolved' });
const changeStatus = (t, value) => {
  if (value === 'resolved') { openResolve(t); return; }
  crm.setTicketStatus(t.id, value);
  ui.toast(`${t.id}: ${TICKET_STATUS[value].label}`);
};
const notify = (t) => {
  const c = crm.client(t.clientId);
  if (!c?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  const name = c.name?.split(' ')[0] || '';
  const text = t.status === 'resolved'
    ? `Hola ${name}, te confirmo que el caso *${t.id} — ${t.title}* quedó resuelto ✅\n\nSolución: ${t.solution}\n\nCualquier detalle me avisas. — ${s.settings.ownerName}`
    : `Hola ${name}, te escribo por el caso *${t.id} — ${t.title}*. Estado actual: ${TICKET_STATUS[t.status].label}. Te mantengo al tanto. — ${s.settings.ownerName}`;
  openWhatsApp(c.phone, text);
  crm.logActivity(c.id, 'whatsapp', `Actualización del ticket ${t.id} enviada por WhatsApp.`);
};
const remove = (t) => ui.deleted(`Ticket ${t.id} eliminado`, crm.withUndo(() => crm.deleteTicket(t.id)));
const exportCSV = () => {
  const data = [['ID', 'Cliente', 'Problema', 'Equipo', 'Categoría', 'Prioridad', 'Estado', 'Abierto', 'Resuelto', 'Horas', 'Solución', 'Cobro']];
  rows.value.forEach(t => data.push([t.id, crm.client(t.clientId)?.company, t.title, t.device, t.category, TICKET_PRIORITY[t.priority]?.label, TICKET_STATUS[t.status]?.label,
    formatDateTime(t.openedAt), t.resolvedAt ? formatDateTime(t.resolvedAt) : '', crm.ticketHours(t).toFixed(1), t.solution, t.charge]));
  downloadFile(`soporte-${todayISO()}.csv`, '﻿' + toCSV(data), 'text/csv;charset=utf-8');
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Soporte técnico</h1>
        <p class="text-sm text-slate-400 mt-1">Fallas reportadas, tiempos de respuesta y soluciones aplicadas</p>
      </div>
      <div class="flex gap-2">
        <button class="crm-btn-secondary" :disabled="!rows.length" @click="exportCSV"><ArrowDownTrayIcon class="w-4 h-4" /><span class="hidden sm:inline">Exportar</span></button>
        <button class="crm-btn-primary" @click="ui.editTicket()"><PlusIcon class="w-4 h-4" />Nuevo ticket</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="k in kpis" :key="k.label" class="crm-card p-4">
        <div class="flex items-center justify-between text-xs text-slate-400"><span>{{ k.label }}</span><component :is="k.icon" class="w-5 h-5 text-slate-500" /></div>
        <p :class="['text-2xl font-extrabold font-mono mt-1', k.tone]">{{ k.value }}</p>
        <p class="text-2xs text-slate-500 mt-1 truncate">{{ k.sub }}</p>
      </div>
    </div>

    <div class="crm-card p-3 sm:p-4 space-y-3">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="search" class="crm-input !py-2 pl-10" placeholder="Buscar por problema, equipo o cliente…" />
        </div>
        <select v-model="priority" class="crm-input !py-2 sm:w-44">
          <option value="all">Todas las prioridades</option>
          <option v-for="(p, key) in TICKET_PRIORITY" :key="key" :value="key">{{ p.label }}</option>
        </select>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button v-for="f in filters" :key="f.key" :class="['crm-chip', status === f.key && 'crm-chip-active']" @click="status = f.key">{{ f.label }} · {{ f.count }}</button>
      </div>
    </div>

    <div v-if="!s.tickets.length" class="crm-card">
      <EmptyState :icon="LifebuoyIcon" title="Sin tickets de soporte" text="Registra cada falla que te reporten: sabrás cuánto tardas en resolver y tendrás el historial técnico de cada cliente.">
        <button class="crm-btn-primary" @click="ui.editTicket()"><PlusIcon class="w-4 h-4" />Abrir ticket</button>
      </EmptyState>
    </div>
    <div v-else-if="!rows.length" class="crm-card"><EmptyState :icon="MagnifyingGlassIcon" title="Sin resultados" text="No hay tickets con esos filtros." /></div>

    <div v-else class="grid xl:grid-cols-2 gap-3">
      <article v-for="t in rows" :key="t.id" :class="['crm-card relative overflow-hidden p-4 sm:p-5 flex flex-col gap-3', overdue(t) && 'border-rose-500/40']">
        <span :class="['absolute left-0 inset-y-0 w-1', BAR[TICKET_PRIORITY[t.priority]?.tone]]"></span>
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono text-cyan-300">{{ t.id }}</span>
              <StatusBadge :label="TICKET_PRIORITY[t.priority]?.label" :tone="TICKET_PRIORITY[t.priority]?.tone" :dot="false" />
              <span v-if="overdue(t)" class="inline-flex items-center gap-1 text-2xs font-semibold text-rose-300"><ExclamationTriangleIcon class="w-3.5 h-3.5" />Fuera de tiempo</span>
            </div>
            <h3 class="font-semibold text-white mt-1 leading-snug">{{ t.title }}</h3>
            <p class="text-xs text-slate-500 mt-0.5 truncate">
              <button class="text-slate-300 hover:text-cyan-300" @click="ui.openClient(t.clientId)">{{ crm.client(t.clientId)?.company || '—' }}</button>
              <span v-if="t.device"> · {{ t.device }}</span> · {{ t.category }}
            </p>
          </div>
          <select :value="t.status" class="crm-input-sm !w-32 shrink-0" @change="changeStatus(t, $event.target.value); $event.target.value = t.status">
            <option v-for="(st, key) in TICKET_STATUS" :key="key" :value="key">{{ st.label }}</option>
          </select>
        </div>

        <p v-if="t.description && t.status !== 'resolved'" class="text-sm text-slate-400 line-clamp-2">{{ t.description }}</p>
        <div v-if="t.status === 'resolved' && t.solution" class="text-sm text-slate-300 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 flex gap-2">
          <WrenchScrewdriverIcon class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /><span>{{ t.solution }}</span>
        </div>

        <div>
          <div class="flex justify-between text-xs mb-1.5">
            <span :class="slaInfo(t).tone">{{ slaInfo(t).text }}</span>
            <span class="text-slate-500">{{ slaInfo(t).sub }}</span>
          </div>
          <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div :class="['h-full rounded-full transition-all', slaInfo(t).bar]" :style="{ width: slaInfo(t).pct + '%' }"></div></div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-auto">
          <span class="text-2xs text-slate-500" :title="formatDateTime(t.openedAt)">
            Abierto {{ timeAgo(t.openedAt) }}<span v-if="t.charge > 0"> · Cobro {{ crm.money(t.charge) }}</span>
          </span>
          <div class="flex items-center">
            <button v-if="t.status !== 'resolved'" class="crm-btn-ghost !px-2.5 !py-1.5 text-xs text-emerald-300" @click="openResolve(t)"><CheckCircleIcon class="w-4 h-4" />Resolver</button>
            <button class="crm-icon-btn hover:text-emerald-300" title="Avisar al cliente por WhatsApp" @click="notify(t)"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn" title="Editar" @click="ui.editTicket(t)"><PencilSquareIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(t)"><TrashIcon class="w-4 h-4" /></button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
