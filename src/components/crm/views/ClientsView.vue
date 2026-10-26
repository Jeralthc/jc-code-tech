<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, UserGroupIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline';
import ClientAvatar from '../ui/ClientAvatar.vue';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { STAGES, SOURCES, stageOf } from '../../../crm/constants';
import { matches, relativeDay, daysFromToday, formatMoney, whatsappUrl, toCSV, downloadFile, todayISO } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;

const search = ref('');
const stage = ref('all');
const source = ref('all');
const sort = ref('recent');

const money = (v) => formatMoney(v, s.settings.currency, 0);

const rows = computed(() => {
  const list = s.clients
    .filter(c => stage.value === 'all' || c.stage === stage.value)
    .filter(c => source.value === 'all' || c.source === source.value)
    .filter(c => matches(search.value, c.company, c.name, c.phone, c.email, c.city, (c.tags || []).join(' ')))
    .map(c => ({ ...c, paid: crm.clientPaid(c.id), balance: crm.clientBalance(c.id) }));
  const sorters = {
    recent: (a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''),
    name: (a, b) => a.company.localeCompare(b.company),
    value: (a, b) => b.value - a.value,
    paid: (a, b) => b.paid - a.paid,
    followup: (a, b) => (a.nextFollowUp || '9999').localeCompare(b.nextFollowUp || '9999')
  };
  return list.sort(sorters[sort.value]);
});

const counts = computed(() => Object.fromEntries(STAGES.map(st => [st.key, s.clients.filter(c => c.stage === st.key).length])));

const exportCSV = () => {
  const data = [['ID', 'Negocio', 'Contacto', 'Teléfono', 'Correo', 'Ciudad', 'Rubro', 'Origen', 'Etapa', 'Valor estimado', 'Cobrado', 'Saldo', 'Próximo seguimiento', 'Etiquetas', 'Notas']];
  rows.value.forEach(c => data.push([c.id, c.company, c.name, c.phone, c.email, c.city, c.industry, c.source, stageOf(c.stage).label, c.value, c.paid, c.balance, c.nextFollowUp || '', (c.tags || []).join('; '), c.notes]));
  downloadFile(`clientes-${todayISO()}.csv`, '﻿' + toCSV(data), 'text/csv;charset=utf-8');
  ui.toast('Archivo CSV descargado (se abre en Excel)');
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Clientes</h1>
        <p class="text-sm text-slate-400 mt-1">{{ s.clients.length }} contactos en tu cartera</p>
      </div>
      <div class="flex gap-2">
        <button class="crm-btn-secondary" :disabled="!rows.length" @click="exportCSV"><ArrowDownTrayIcon class="w-4 h-4" /><span class="hidden sm:inline">Exportar</span></button>
        <button class="crm-btn-primary" @click="ui.editClient()"><PlusIcon class="w-4 h-4" />Nuevo cliente</button>
      </div>
    </div>

    <div class="crm-card p-3 sm:p-4 space-y-3">
      <div class="flex flex-col md:flex-row gap-3">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="search" class="crm-input pl-10" placeholder="Buscar por negocio, contacto, teléfono, ciudad o etiqueta…" />
        </div>
        <select v-model="source" class="crm-input md:w-44">
          <option value="all">Todos los orígenes</option>
          <option v-for="o in SOURCES" :key="o" :value="o">{{ o }}</option>
        </select>
        <select v-model="sort" class="crm-input md:w-48">
          <option value="recent">Más recientes</option>
          <option value="name">Nombre (A-Z)</option>
          <option value="value">Mayor valor estimado</option>
          <option value="paid">Más facturado</option>
          <option value="followup">Próximo seguimiento</option>
        </select>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button :class="['crm-chip', stage === 'all' && 'crm-chip-active']" @click="stage = 'all'">Todos · {{ s.clients.length }}</button>
        <button v-for="st in STAGES" :key="st.key" :class="['crm-chip', stage === st.key && 'crm-chip-active']" @click="stage = st.key">{{ st.label }} · {{ counts[st.key] }}</button>
      </div>
    </div>

    <div class="crm-card overflow-hidden">
      <EmptyState v-if="!s.clients.length" :icon="UserGroupIcon" title="Aún no tienes clientes" text="Registra a tus clientes y prospectos para darles seguimiento, cotizarles y cobrarles desde un solo lugar.">
        <button class="crm-btn-primary" @click="ui.editClient()"><PlusIcon class="w-4 h-4" />Registrar el primero</button>
      </EmptyState>
      <EmptyState v-else-if="!rows.length" :icon="MagnifyingGlassIcon" title="Sin resultados" text="Prueba con otra búsqueda o quita los filtros." />

      <template v-else>
        <!-- Tabla (escritorio) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th class="crm-th">Cliente</th>
                <th class="crm-th">Etapa</th>
                <th class="crm-th text-right">Valor est.</th>
                <th class="crm-th text-right">Cobrado</th>
                <th class="crm-th text-right">Saldo</th>
                <th class="crm-th">Seguimiento</th>
                <th class="crm-th"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-800/30 cursor-pointer transition-colors" @click="ui.openClient(c.id)">
                <td class="crm-td">
                  <div class="flex items-center gap-3">
                    <ClientAvatar :name="c.company" size="sm" />
                    <div class="min-w-0">
                      <p class="font-semibold text-white truncate max-w-64">{{ c.company }}</p>
                      <p class="text-xs text-slate-400 truncate max-w-64">{{ c.name }}<span v-if="c.city"> · {{ c.city }}</span></p>
                    </div>
                  </div>
                </td>
                <td class="crm-td"><StatusBadge :label="stageOf(c.stage).label" :tone="stageOf(c.stage).tone" /></td>
                <td class="crm-td text-right font-mono text-slate-300">{{ money(c.value) }}</td>
                <td class="crm-td text-right font-mono text-emerald-300">{{ c.paid ? money(c.paid) : '—' }}</td>
                <td class="crm-td text-right font-mono" :class="c.balance ? 'text-amber-300' : 'text-slate-600'">{{ c.balance ? money(c.balance) : '—' }}</td>
                <td class="crm-td">
                  <span v-if="c.nextFollowUp" :class="['text-xs', daysFromToday(c.nextFollowUp) < 0 ? 'text-rose-300' : daysFromToday(c.nextFollowUp) === 0 ? 'text-amber-300' : 'text-slate-400']">{{ relativeDay(c.nextFollowUp) }}</span>
                  <span v-else class="text-xs text-slate-600">—</span>
                </td>
                <td class="crm-td text-right" @click.stop>
                  <a v-if="c.phone" :href="whatsappUrl(c.phone)" target="_blank" rel="noopener" class="crm-icon-btn hover:text-emerald-400" title="Abrir WhatsApp">
                    <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tarjetas (móvil) -->
        <ul class="md:hidden divide-y divide-slate-800/60">
          <li v-for="c in rows" :key="c.id" class="p-4 flex items-center gap-3 active:bg-slate-800/40" @click="ui.openClient(c.id)">
            <ClientAvatar :name="c.company" />
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-white truncate">{{ c.company }}</p>
              <p class="text-xs text-slate-400 truncate">{{ c.name }}</p>
              <div class="mt-1.5"><StatusBadge :label="stageOf(c.stage).label" :tone="stageOf(c.stage).tone" /></div>
            </div>
            <div class="text-right">
              <p class="text-sm font-mono text-slate-200">{{ money(c.value) }}</p>
              <p v-if="c.balance" class="text-xs font-mono text-amber-300">Debe {{ money(c.balance) }}</p>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>
