<script setup>
import { ref, computed } from 'vue';
import {
  PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, EyeIcon, PencilSquareIcon, DocumentDuplicateIcon,
  TrashIcon, ChatBubbleOvalLeftEllipsisIcon, FolderPlusIcon, EllipsisVerticalIcon
} from '@heroicons/vue/24/outline';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import QuoteBuilder from '../QuoteBuilder.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { QUOTE_STATUS } from '../../../crm/constants';
import { matches, formatDate, formatCompact, openWhatsApp } from '../../../crm/utils';
import { buildQuoteMessage } from '../../../crm/quoteText';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const status = ref('all');
const menu = ref(null);

const rows = computed(() => s.quotes
  .map(q => ({ q, status: crm.quoteStatus(q), total: crm.quoteTotals(q).total, client: crm.client(q.clientId) }))
  .filter(r => status.value === 'all' || r.status === status.value)
  .filter(r => matches(search.value, r.q.id, r.client?.company, r.client?.name, r.q.serviceType))
  .sort((a, b) => b.q.date.localeCompare(a.q.date) || b.q.id.localeCompare(a.q.id)));

const sum = (st) => s.quotes.filter(q => st.includes(crm.quoteStatus(q))).reduce((a, q) => a + crm.quoteTotals(q).total, 0);
const compact = (v) => formatCompact(v, s.settings.currency);
const summary = computed(() => [
  { label: 'En espera de respuesta', value: sum(['sent']), tone: 'text-blue-300' },
  { label: 'Aprobado', value: sum(['approved']), tone: 'text-emerald-300' },
  { label: 'Vencidas sin respuesta', value: sum(['expired']), tone: 'text-amber-300' },
  { label: 'Tasa de aprobación', value: null, pct: (() => {
    const decided = s.quotes.filter(q => ['approved', 'rejected'].includes(q.status)).length;
    return decided ? Math.round(s.quotes.filter(q => q.status === 'approved').length / decided * 100) : 0;
  })(), tone: 'text-violet-300' }
]);
const counts = computed(() => Object.fromEntries(Object.keys(QUOTE_STATUS).map(k => [k, s.quotes.filter(q => crm.quoteStatus(q) === k).length])));

const send = (q) => {
  const c = crm.client(q.clientId);
  if (!c?.phone) { ui.toast('El cliente no tiene teléfono registrado', 'error'); return; }
  openWhatsApp(c.phone, buildQuoteMessage(crm, q));
  if (q.status === 'draft') crm.setQuoteStatus(q.id, 'sent');
};
const duplicate = (q) => {
  const copy = crm.duplicateQuote(q.id);
  ui.toast(`Duplicada como ${copy.id}`);
  ui.editQuote(copy.id);
};
const toProject = (q) => {
  const p = crm.convertQuoteToProject(q.id);
  ui.toast(`Proyecto ${p.id} creado a partir de ${q.id}`);
  ui.go('projects');
};
const remove = async (q) => {
  if (await ui.confirm({ title: `¿Eliminar la cotización ${q.id}?`, message: 'Esta acción no se puede deshacer.', confirmLabel: 'Eliminar', danger: true })) {
    crm.deleteQuote(q.id);
    ui.toast('Cotización eliminada');
  }
};
const changeStatus = (q, value) => {
  crm.setQuoteStatus(q.id, value);
  if (value === 'approved' && !q.projectId) ui.toast('¡Aprobada! Puedes convertirla en proyecto desde el menú ⋮');
};
</script>

<template>
  <QuoteBuilder
    v-if="ui.quoteEditor"
    :key="ui.quoteEditor.key"
    :quote-id="ui.quoteEditor.id"
    :client-id="ui.quoteEditor.clientId"
    @close="ui.quoteEditor = null"
  />

  <div v-else class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Cotizaciones</h1>
        <p class="text-sm text-slate-400 mt-1">Crea, envía por WhatsApp y descarga en PDF</p>
      </div>
      <button class="crm-btn-primary" @click="ui.editQuote()"><PlusIcon class="w-4 h-4" />Nueva cotización</button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="item in summary" :key="item.label" class="crm-card p-4">
        <p class="text-xs text-slate-400">{{ item.label }}</p>
        <p :class="['text-xl font-extrabold font-mono mt-1', item.tone]">{{ item.value === null ? item.pct + '%' : compact(item.value) }}</p>
      </div>
    </div>

    <div class="crm-card p-3 sm:p-4 space-y-3">
      <div class="relative">
        <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input v-model="search" class="crm-input pl-10" placeholder="Buscar por número, cliente o servicio…" />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button :class="['crm-chip', status === 'all' && 'crm-chip-active']" @click="status = 'all'">Todas · {{ s.quotes.length }}</button>
        <button v-for="(st, key) in QUOTE_STATUS" :key="key" :class="['crm-chip', status === key && 'crm-chip-active']" @click="status = key">{{ st.label }} · {{ counts[key] }}</button>
      </div>
    </div>

    <div class="crm-card">
      <EmptyState v-if="!s.quotes.length" :icon="DocumentTextIcon" title="Aún no tienes cotizaciones" text="Arma una cotización profesional en un minuto usando tu catálogo de servicios.">
        <button class="crm-btn-primary" @click="ui.editQuote()"><PlusIcon class="w-4 h-4" />Crear cotización</button>
      </EmptyState>
      <EmptyState v-else-if="!rows.length" :icon="MagnifyingGlassIcon" title="Sin resultados" />

      <ul v-else class="divide-y divide-slate-800/60">
        <li v-for="r in rows" :key="r.q.id" class="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-800/20">
          <button class="flex-1 min-w-0 text-left" @click="ui.editQuote(r.q.id)">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-mono text-sm font-semibold text-cyan-300">{{ r.q.id }}</span>
              <StatusBadge :label="QUOTE_STATUS[r.status].label" :tone="QUOTE_STATUS[r.status].tone" />
              <span v-if="r.q.projectId" class="text-2xs text-slate-500 font-mono">→ {{ r.q.projectId }}</span>
            </div>
            <p class="text-sm font-semibold text-white mt-1 truncate">{{ r.client?.company || 'Cliente eliminado' }}</p>
            <p class="text-xs text-slate-500 truncate">{{ r.q.serviceType }} · {{ r.q.items.length }} concepto(s) · {{ formatDate(r.q.date) }}</p>
          </button>
          <div class="flex items-center justify-between sm:justify-end gap-3">
            <span class="font-mono font-bold text-white text-base sm:w-28 text-right">{{ crm.money(r.total) }}</span>
            <select :value="r.q.status" class="crm-input-sm !w-32" @change="changeStatus(r.q, $event.target.value)">
              <option value="draft">Borrador</option>
              <option value="sent">Enviada</option>
              <option value="approved">Aprobada</option>
              <option value="rejected">Rechazada</option>
            </select>
            <div class="flex items-center">
              <button class="crm-icon-btn" title="Ver PDF" @click="ui.openProforma(r.q.id)"><EyeIcon class="w-5 h-5" /></button>
              <button class="crm-icon-btn hover:text-emerald-400" title="Enviar por WhatsApp" @click="send(r.q)"><ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" /></button>
              <div class="relative">
                <button class="crm-icon-btn" title="Más acciones" @click="menu = menu === r.q.id ? null : r.q.id"><EllipsisVerticalIcon class="w-5 h-5" /></button>
                <div v-if="menu === r.q.id" class="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1 text-sm" @click="menu = null">
                  <button class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-slate-200" @click="ui.editQuote(r.q.id)"><PencilSquareIcon class="w-4 h-4" />Editar</button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-slate-200" @click="duplicate(r.q)"><DocumentDuplicateIcon class="w-4 h-4" />Duplicar</button>
                  <button v-if="!r.q.projectId && r.q.status !== 'rejected'" class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-slate-200" @click="toProject(r.q)"><FolderPlusIcon class="w-4 h-4" />Convertir en proyecto</button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-rose-300" @click="remove(r.q)"><TrashIcon class="w-4 h-4" />Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="menu" class="fixed inset-0 z-10" @click="menu = null"></div>
  </div>
</template>
