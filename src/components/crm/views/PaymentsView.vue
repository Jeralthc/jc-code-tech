<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, MagnifyingGlassIcon, BanknotesIcon, PencilSquareIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import EmptyState from '../ui/EmptyState.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { PAYMENT_METHODS } from '../../../crm/constants';
import { matches, formatDate, todayISO, formatCompact, openWhatsApp, toCSV, downloadFile } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const method = ref('all');
const period = ref('all');

const ym = todayISO().slice(0, 7);
const year = todayISO().slice(0, 4);
const compact = (v) => formatCompact(v, s.settings.currency);
const sum = (list) => list.reduce((a, p) => a + Number(p.amount || 0), 0);

const kpis = computed(() => [
  { label: 'Cobrado este mes', value: sum(s.payments.filter(p => p.date?.startsWith(ym))), tone: 'text-cyan-300' },
  { label: `Cobrado en ${year}`, value: sum(s.payments.filter(p => p.date?.startsWith(year))), tone: 'text-emerald-300' },
  { label: 'Por cobrar', value: s.projects.reduce((a, p) => a + crm.projectBalance(p), 0), tone: 'text-amber-300' },
  { label: 'Ticket promedio', value: s.payments.length ? sum(s.payments) / s.payments.length : 0, tone: 'text-violet-300' }
]);

const pending = computed(() => s.projects
  .filter(p => crm.projectBalance(p) > 0)
  .map(p => ({ p, client: crm.client(p.clientId), balance: crm.projectBalance(p), paid: crm.projectPaid(p) }))
  .sort((a, b) => b.balance - a.balance));

const rows = computed(() => s.payments
  .filter(p => method.value === 'all' || p.method === method.value)
  .filter(p => period.value === 'all' || (period.value === 'month' ? p.date?.startsWith(ym) : p.date?.startsWith(year)))
  .filter(p => matches(search.value, crm.client(p.clientId)?.company, p.reference, p.note, p.method))
  .sort((a, b) => b.date.localeCompare(a.date)));

const byMethod = computed(() => {
  const total = sum(s.payments) || 1;
  return PAYMENT_METHODS
    .map(m => ({ m, value: sum(s.payments.filter(p => p.method === m)) }))
    .filter(x => x.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(x => ({ ...x, pct: Math.round(x.value / total * 100) }));
});

const remind = (row) => {
  if (!row.client?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  const name = row.client.name?.split(' ')[0] || '';
  const text = `Hola ${name}, ¿cómo estás? Te escribo por el proyecto "${row.p.title}". Queda un saldo pendiente de ${crm.money(row.balance)}. Cuando puedas me confirmas el pago. ¡Gracias! — ${s.settings.ownerName}`;
  openWhatsApp(row.client.phone, text);
  crm.logActivity(row.client.id, 'whatsapp', `Recordatorio de pago enviado (${crm.money(row.balance)}).`);
};
const remove = async (p) => {
  if (await ui.confirm({ title: '¿Eliminar este cobro?', message: `${crm.money(p.amount)} del ${formatDate(p.date)}.`, confirmLabel: 'Eliminar', danger: true })) {
    crm.deletePayment(p.id);
    ui.toast('Cobro eliminado');
  }
};
const exportCSV = () => {
  const data = [['ID', 'Fecha', 'Cliente', 'Proyecto', 'Monto', 'Método', 'Referencia', 'Concepto']];
  rows.value.forEach(p => data.push([p.id, p.date, crm.client(p.clientId)?.company, crm.project(p.projectId)?.title || '', p.amount, p.method, p.reference, p.note]));
  downloadFile(`cobros-${todayISO()}.csv`, '﻿' + toCSV(data), 'text/csv;charset=utf-8');
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Cobranzas</h1>
        <p class="text-sm text-slate-400 mt-1">Pagos recibidos y saldos pendientes</p>
      </div>
      <div class="flex gap-2">
        <button class="crm-btn-secondary" :disabled="!rows.length" @click="exportCSV"><ArrowDownTrayIcon class="w-4 h-4" /><span class="hidden sm:inline">Exportar</span></button>
        <button class="crm-btn-primary" @click="ui.addPayment()"><PlusIcon class="w-4 h-4" />Registrar cobro</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="k in kpis" :key="k.label" class="crm-card p-4">
        <p class="text-xs text-slate-400">{{ k.label }}</p>
        <p :class="['text-xl sm:text-2xl font-extrabold font-mono mt-1', k.tone]">{{ compact(k.value) }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 items-start">
      <!-- Saldos pendientes -->
      <section class="crm-card p-5 lg:col-span-1 space-y-4">
        <div>
          <h3 class="font-semibold text-white">Saldos pendientes</h3>
          <p class="text-xs text-slate-500">Proyectos con dinero por cobrar</p>
        </div>
        <ul class="space-y-3">
          <li v-for="r in pending" :key="r.p.id" class="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
            <div class="flex justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ r.client?.company }}</p>
                <p class="text-xs text-slate-500 truncate">{{ r.p.title }}</p>
              </div>
              <span class="font-mono text-sm text-amber-300 shrink-0">{{ crm.money(r.balance) }}</span>
            </div>
            <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2"><div class="h-full bg-emerald-500/80" :style="{ width: Math.min(100, r.paid / r.p.budget * 100) + '%' }"></div></div>
            <div class="flex gap-2 mt-3">
              <button class="crm-btn-secondary !px-2.5 !py-1.5 text-xs flex-1" @click="ui.addPayment({ projectId: r.p.id })"><BanknotesIcon class="w-4 h-4" />Registrar</button>
              <button class="crm-btn-ghost !px-2.5 !py-1.5 text-xs text-emerald-300" @click="remind(r)"><ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />Recordar</button>
            </div>
          </li>
          <li v-if="!pending.length" class="text-sm text-slate-500 text-center py-6">Todo cobrado. 👏</li>
        </ul>

        <div v-if="byMethod.length" class="pt-4 border-t border-slate-800">
          <h4 class="text-sm font-semibold text-white mb-3">Por método de pago</h4>
          <div v-for="x in byMethod" :key="x.m" class="mb-2.5">
            <div class="flex justify-between text-xs mb-1"><span class="text-slate-300">{{ x.m }}</span><span class="font-mono text-slate-400">{{ compact(x.value) }} · {{ x.pct }}%</span></div>
            <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-cyan-500/70 rounded-full" :style="{ width: x.pct + '%' }"></div></div>
          </div>
        </div>
      </section>

      <!-- Historial -->
      <section class="crm-card lg:col-span-2">
        <div class="p-4 flex flex-col sm:flex-row gap-3 border-b border-slate-800">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input v-model="search" class="crm-input !py-2 pl-10" placeholder="Buscar cliente, referencia…" />
          </div>
          <select v-model="period" class="crm-input !py-2 sm:w-36">
            <option value="all">Todo</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <select v-model="method" class="crm-input !py-2 sm:w-40">
            <option value="all">Todos los métodos</option>
            <option v-for="m in PAYMENT_METHODS" :key="m">{{ m }}</option>
          </select>
        </div>
        <EmptyState v-if="!s.payments.length" :icon="BanknotesIcon" title="Sin cobros registrados" text="Registra anticipos y pagos para saber siempre cuánto te deben." />
        <EmptyState v-else-if="!rows.length" :icon="MagnifyingGlassIcon" title="Sin resultados" />
        <ul v-else class="divide-y divide-slate-800/60">
          <li v-for="p in rows" :key="p.id" class="group px-4 py-3.5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0"><BanknotesIcon class="w-5 h-5" /></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ crm.client(p.clientId)?.company || '—' }}</p>
              <p class="text-xs text-slate-500 truncate">{{ formatDate(p.date) }} · {{ p.method }}<span v-if="p.note"> · {{ p.note }}</span><span v-if="p.reference"> · Ref. {{ p.reference }}</span></p>
            </div>
            <span class="font-mono font-semibold text-emerald-300">{{ crm.money(p.amount) }}</span>
            <div class="flex sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="crm-icon-btn" title="Editar" @click="ui.addPayment({}, p)"><PencilSquareIcon class="w-4 h-4" /></button>
              <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(p)"><TrashIcon class="w-4 h-4" /></button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
