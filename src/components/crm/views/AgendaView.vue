<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon, CalendarDaysIcon } from '@heroicons/vue/24/outline';
import StatusBadge from '../ui/StatusBadge.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { TASK_PRIORITY, OPEN_STAGES } from '../../../crm/constants';
import { daysFromToday, relativeDay, formatDate, todayISO, addDays } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const quick = ref('');
const showDone = ref(false);

const groups = computed(() => {
  const g = { overdue: [], today: [], week: [], later: [], none: [] };
  s.tasks.filter(t => !t.done).forEach(t => {
    const d = daysFromToday(t.dueDate);
    if (d === null) g.none.push(t);
    else if (d < 0) g.overdue.push(t);
    else if (d === 0) g.today.push(t);
    else if (d <= 7) g.week.push(t);
    else g.later.push(t);
  });
  Object.values(g).forEach(list => list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '') || ({ high: 0, normal: 1, low: 2 }[a.priority] - { high: 0, normal: 1, low: 2 }[b.priority])));
  return [
    { key: 'overdue', label: 'Atrasadas', tone: 'text-rose-300', items: g.overdue },
    { key: 'today', label: 'Hoy', tone: 'text-amber-300', items: g.today },
    { key: 'week', label: 'Próximos 7 días', tone: 'text-cyan-300', items: g.week },
    { key: 'later', label: 'Más adelante', tone: 'text-slate-300', items: g.later },
    { key: 'none', label: 'Sin fecha', tone: 'text-slate-400', items: g.none }
  ].filter(x => x.items.length);
});
const done = computed(() => s.tasks.filter(t => t.done).slice(0, 20));

// Seguimientos agendados en la ficha de cada cliente.
const followUps = computed(() => s.clients
  .filter(c => c.nextFollowUp && OPEN_STAGES.concat('won').includes(c.stage))
  .sort((a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp))
  .slice(0, 12));

const addQuick = () => {
  const title = quick.value.trim();
  if (!title) return;
  crm.saveTask({ title, clientId: '', dueDate: todayISO(), priority: 'normal', done: false });
  quick.value = '';
  ui.toast('Tarea agregada para hoy');
};
const remove = async (t) => {
  if (await ui.confirm({ title: '¿Eliminar esta tarea?', message: t.title, confirmLabel: 'Eliminar', danger: true })) crm.deleteTask(t.id);
};
const postpone = (t, days) => { t.dueDate = addDays(todayISO(), days); };
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Agenda</h1>
        <p class="text-sm text-slate-400 mt-1">Tareas, visitas y seguimientos para no dejar escapar ninguna venta</p>
      </div>
      <button class="crm-btn-primary" @click="ui.editTask()"><PlusIcon class="w-4 h-4" />Nueva tarea</button>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 items-start">
      <div class="lg:col-span-2 space-y-4">
        <form class="crm-card p-3 flex gap-2" @submit.prevent="addQuick">
          <input v-model="quick" class="crm-input" placeholder="Escribe una tarea rápida para hoy y presiona Enter…" />
          <button class="crm-btn-secondary shrink-0" type="submit"><PlusIcon class="w-4 h-4" /></button>
        </form>

        <section v-for="g in groups" :key="g.key" class="crm-card p-4 sm:p-5">
          <h3 :class="['text-sm font-semibold mb-3', g.tone]">{{ g.label }} <span class="text-slate-500 font-normal">· {{ g.items.length }}</span></h3>
          <ul class="space-y-1">
            <li v-for="t in g.items" :key="t.id" class="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-800/40">
              <input type="checkbox" class="accent-cyan-500 w-4 h-4 mt-1 cursor-pointer" :checked="t.done" @change="crm.toggleTask(t.id)" />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-100">{{ t.title }}</p>
                <div class="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span v-if="t.dueDate">{{ relativeDay(t.dueDate) }}</span>
                  <button v-if="t.clientId" class="text-cyan-300/80 hover:underline" @click="ui.openClient(t.clientId)">{{ crm.client(t.clientId)?.company }}</button>
                  <StatusBadge v-if="t.priority !== 'normal'" :label="TASK_PRIORITY[t.priority].label" :tone="TASK_PRIORITY[t.priority].tone" :dot="false" />
                </div>
              </div>
              <div class="flex items-center sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="crm-chip !px-2 !py-1" title="Posponer a mañana" @click="postpone(t, 1)">+1d</button>
                <button class="crm-icon-btn" title="Editar" @click="ui.editTask(t)"><PencilSquareIcon class="w-4 h-4" /></button>
                <button class="crm-icon-btn hover:text-rose-400" title="Eliminar" @click="remove(t)"><TrashIcon class="w-4 h-4" /></button>
              </div>
            </li>
          </ul>
        </section>

        <div v-if="!groups.length" class="crm-card p-10 text-center">
          <p class="text-3xl">🎉</p>
          <p class="text-white font-semibold mt-2">No tienes tareas pendientes</p>
          <p class="text-sm text-slate-400">Agenda tu próxima llamada o visita para mantener el ritmo.</p>
        </div>

        <div v-if="done.length">
          <button class="text-sm text-slate-400 hover:text-white" @click="showDone = !showDone">{{ showDone ? 'Ocultar' : 'Ver' }} completadas ({{ done.length }})</button>
          <ul v-if="showDone" class="crm-card p-4 mt-2 space-y-1.5">
            <li v-for="t in done" :key="t.id" class="flex items-center gap-3 text-sm">
              <input type="checkbox" class="accent-cyan-500" checked @change="crm.toggleTask(t.id)" />
              <span class="line-through text-slate-500 flex-1">{{ t.title }}</span>
              <button class="text-slate-600 hover:text-rose-400" @click="crm.deleteTask(t.id)"><TrashIcon class="w-4 h-4" /></button>
            </li>
          </ul>
        </div>
      </div>

      <aside class="crm-card p-5">
        <h3 class="font-semibold text-white flex items-center gap-2"><ChatBubbleLeftRightIcon class="w-5 h-5 text-violet-400" />Seguimientos de clientes</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">Fechas agendadas en la ficha de cada cliente</p>
        <ul class="space-y-2">
          <li v-for="c in followUps" :key="c.id">
            <button class="w-full text-left p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-600" @click="ui.openClient(c.id)">
              <p class="text-sm font-medium text-white truncate">{{ c.company }}</p>
              <p :class="['text-xs mt-0.5 flex items-center gap-1', daysFromToday(c.nextFollowUp) < 0 ? 'text-rose-300' : daysFromToday(c.nextFollowUp) === 0 ? 'text-amber-300' : 'text-slate-500']">
                <CalendarDaysIcon class="w-3.5 h-3.5" />{{ relativeDay(c.nextFollowUp) }} · {{ formatDate(c.nextFollowUp) }}
              </p>
            </button>
          </li>
          <li v-if="!followUps.length" class="text-sm text-slate-500 text-center py-6">Sin seguimientos agendados.</li>
        </ul>
      </aside>
    </div>
  </div>
</template>
