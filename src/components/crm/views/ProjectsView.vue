<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, MagnifyingGlassIcon, FolderIcon, PencilSquareIcon, TrashIcon, BanknotesIcon, CalendarIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { PROJECT_STATUS } from '../../../crm/constants';
import { matches, formatShortDate, relativeDay, daysFromToday } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const status = ref('active');
const newMilestone = ref({});

const filters = computed(() => [
  { key: 'active', label: 'Activos', count: s.projects.filter(p => p.status !== 'completed').length },
  { key: 'all', label: 'Todos', count: s.projects.length },
  ...Object.entries(PROJECT_STATUS).map(([key, v]) => ({ key, label: v.label, count: s.projects.filter(p => p.status === key).length }))
]);

const rows = computed(() => s.projects
  .filter(p => status.value === 'all' || (status.value === 'active' ? p.status !== 'completed' : p.status === status.value))
  .filter(p => matches(search.value, p.id, p.title, crm.client(p.clientId)?.company, p.category))
  .sort((a, b) => (a.status === 'completed') - (b.status === 'completed') || (a.dueDate || '9999').localeCompare(b.dueDate || '9999')));

const addMilestone = (p) => {
  const text = (newMilestone.value[p.id] || '').trim();
  if (!text) return;
  crm.addMilestone(p, text);
  newMilestone.value[p.id] = '';
};
const toggle = (p, m) => {
  const wasDone = p.status === 'completed';
  crm.toggleMilestone(p, m);
  if (!wasDone && p.status === 'completed') ui.toast(`🎉 Proyecto "${p.title}" completado`);
};
const remove = async (p) => {
  if (await ui.confirm({ title: `¿Eliminar el proyecto ${p.id}?`, message: 'Los cobros asociados se conservarán sin proyecto.', confirmLabel: 'Eliminar', danger: true })) {
    crm.deleteProject(p.id);
    ui.toast('Proyecto eliminado');
  }
};
const dueClass = (p) => {
  if (p.status === 'completed' || !p.dueDate) return 'text-slate-500';
  const d = daysFromToday(p.dueDate);
  return d < 0 ? 'text-rose-300' : d <= 3 ? 'text-amber-300' : 'text-slate-400';
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Proyectos</h1>
        <p class="text-sm text-slate-400 mt-1">Avance, entregas y cobros de cada trabajo</p>
      </div>
      <button class="crm-btn-primary" @click="ui.editProject()"><PlusIcon class="w-4 h-4" />Nuevo proyecto</button>
    </div>

    <div class="crm-card p-3 sm:p-4 space-y-3">
      <div class="relative">
        <MagnifyingGlassIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input v-model="search" class="crm-input pl-10" placeholder="Buscar proyecto o cliente…" />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button v-for="f in filters" :key="f.key" :class="['crm-chip', status === f.key && 'crm-chip-active']" @click="status = f.key">{{ f.label }} · {{ f.count }}</button>
      </div>
    </div>

    <div v-if="!s.projects.length" class="crm-card">
      <EmptyState :icon="FolderIcon" title="Sin proyectos todavía" text="Crea un proyecto o conviértelo directamente desde una cotización aprobada.">
        <button class="crm-btn-primary" @click="ui.editProject()"><PlusIcon class="w-4 h-4" />Crear proyecto</button>
      </EmptyState>
    </div>
    <div v-else-if="!rows.length" class="crm-card"><EmptyState :icon="MagnifyingGlassIcon" title="Sin resultados" /></div>

    <div v-else class="grid lg:grid-cols-2 gap-4">
      <article v-for="p in rows" :key="p.id" class="crm-card p-5 flex flex-col">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-mono text-cyan-300">{{ p.id }}<span v-if="p.quoteId" class="text-slate-500"> · {{ p.quoteId }}</span></p>
            <h3 class="font-bold text-white mt-0.5 leading-snug">{{ p.title }}</h3>
            <button class="text-sm text-slate-400 hover:text-cyan-300" @click="ui.openClient(p.clientId)">{{ crm.client(p.clientId)?.company || '—' }}</button>
          </div>
          <select :value="p.status" class="crm-input-sm !w-36 shrink-0" @change="p.status = $event.target.value">
            <option v-for="(st, key) in PROJECT_STATUS" :key="key" :value="key">{{ st.label }}</option>
          </select>
        </div>

        <!-- Avance -->
        <div class="mt-4">
          <div class="flex justify-between text-xs mb-1.5"><span class="text-slate-400">Avance</span><span class="font-mono text-white">{{ crm.projectProgress(p) }}%</span></div>
          <div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all" :style="{ width: crm.projectProgress(p) + '%' }"></div></div>
        </div>

        <!-- Cobros -->
        <div class="mt-3">
          <div class="flex justify-between text-xs mb-1.5">
            <span class="text-slate-400">Cobrado {{ crm.money(crm.projectPaid(p)) }} de {{ crm.money(p.budget) }}</span>
            <span v-if="crm.projectBalance(p)" class="text-amber-300">Pendiente {{ crm.money(crm.projectBalance(p)) }}</span>
            <span v-else-if="p.budget" class="text-emerald-300">Pagado ✓</span>
          </div>
          <div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-emerald-500/80 rounded-full transition-all" :style="{ width: (p.budget ? Math.min(100, crm.projectPaid(p) / p.budget * 100) : 0) + '%' }"></div></div>
        </div>

        <!-- Hitos -->
        <div class="mt-4 space-y-1.5 flex-1">
          <div v-for="m in p.milestones" :key="m.id" class="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <input type="checkbox" :checked="m.done" class="accent-cyan-500 w-4 h-4 cursor-pointer" @change="toggle(p, m)" />
            <span :class="['text-sm flex-1', m.done ? 'line-through text-slate-500' : 'text-slate-200']">{{ m.text }}</span>
            <button class="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400" title="Quitar hito" @click="crm.removeMilestone(p, m.id)"><XMarkIcon class="w-4 h-4" /></button>
          </div>
          <form class="flex gap-2 pt-1" @submit.prevent="addMilestone(p)">
            <input v-model="newMilestone[p.id]" class="crm-input-sm" placeholder="Agregar hito…" />
            <button class="crm-btn-secondary !px-3 !py-1.5 text-xs" type="submit">Agregar</button>
          </form>
        </div>

        <div class="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800">
          <span :class="['flex items-center gap-1.5 text-xs', dueClass(p)]">
            <CalendarIcon class="w-4 h-4" />
            <template v-if="p.dueDate">Entrega {{ formatShortDate(p.dueDate) }}<span v-if="p.status !== 'completed'"> · {{ relativeDay(p.dueDate) }}</span></template>
            <template v-else>Sin fecha</template>
          </span>
          <div class="flex items-center">
            <button v-if="crm.projectBalance(p)" class="crm-btn-ghost !px-2.5 !py-1.5 text-xs text-emerald-300" @click="ui.addPayment({ projectId: p.id })"><BanknotesIcon class="w-4 h-4" />Cobro</button>
            <button class="crm-icon-btn" title="Editar" @click="ui.editProject(p)"><PencilSquareIcon class="w-4 h-4" /></button>
            <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(p)"><TrashIcon class="w-4 h-4" /></button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
