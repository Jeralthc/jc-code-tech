<script setup>
import { ref, computed } from 'vue';
import { PlusIcon, MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon, CalendarIcon } from '@heroicons/vue/24/outline';
import ClientAvatar from '../ui/ClientAvatar.vue';
import { useCrm, useUi } from '../../../crm/ui';
import { STAGES, TONE_DOT } from '../../../crm/constants';
import { matches, daysFromToday, relativeDay, formatCompact, whatsappUrl } from '../../../crm/utils';

const crm = useCrm();
const ui = useUi();
const s = crm.state;
const search = ref('');
const showLost = ref(false);
const dragId = ref(null);
const overStage = ref(null);

const stages = computed(() => STAGES.filter(st => showLost.value || st.key !== 'lost'));
const columns = computed(() => stages.value.map(st => {
  const items = s.clients.filter(c => c.stage === st.key && matches(search.value, c.company, c.name, c.city, (c.tags || []).join(' ')));
  return { ...st, items, total: items.reduce((a, c) => a + Number(c.value || 0), 0) };
}));
const compact = (v) => formatCompact(v, s.settings.currency);

const onDragStart = (e, c) => {
  dragId.value = c.id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', c.id);
};
const onDrop = (stage) => {
  const id = dragId.value;
  overStage.value = null;
  dragId.value = null;
  if (!id) return;
  const c = crm.client(id);
  if (c && c.stage !== stage) {
    crm.setClientStage(id, stage);
    const label = STAGES.find(st => st.key === stage).label;
    ui.toast(stage === 'won' ? `🎉 ${c.company} es ahora cliente ganado` : `${c.company} → ${label}`);
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Pipeline de ventas</h1>
        <p class="text-sm text-slate-400 mt-1">Arrastra cada oportunidad a la etapa en la que está.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <MagnifyingGlassIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input v-model="search" class="crm-input !py-2 pl-9 w-56" placeholder="Filtrar…" />
        </div>
        <button :class="['crm-chip', showLost && 'crm-chip-active']" @click="showLost = !showLost">Mostrar perdidos</button>
        <button class="crm-btn-primary" @click="ui.editClient()"><PlusIcon class="w-4 h-4" />Oportunidad</button>
      </div>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
      <div
        v-for="col in columns" :key="col.key"
        :class="['snap-start shrink-0 w-[280px] xl:flex-1 xl:min-w-[220px] min-h-[60vh] rounded-2xl border p-3 transition-colors flex flex-col',
          overStage === col.key ? 'border-cyan-500/60 bg-cyan-500/5' : 'border-slate-800/80 bg-slate-900/40']"
        @dragover.prevent="overStage = col.key"
        @dragleave="overStage = overStage === col.key ? null : overStage"
        @drop.prevent="onDrop(col.key)"
      >
        <div class="flex items-center justify-between px-1 mb-3">
          <div class="flex items-center gap-2">
            <span :class="['w-2 h-2 rounded-full', TONE_DOT[col.tone]]"></span>
            <span class="text-sm font-semibold text-white">{{ col.label }}</span>
            <span class="text-xs text-slate-500 bg-slate-800 rounded-md px-1.5">{{ col.items.length }}</span>
          </div>
          <span class="text-xs font-mono text-slate-400">{{ compact(col.total) }}</span>
        </div>

        <div class="space-y-2.5 flex-1 min-h-24">
          <div
            v-for="c in col.items" :key="c.id"
            draggable="true"
            :class="['group rounded-xl bg-slate-900 border border-slate-800 p-3.5 cursor-grab active:cursor-grabbing hover:border-slate-600 transition-all', dragId === c.id && 'opacity-40']"
            @dragstart="onDragStart($event, c)"
            @dragend="dragId = null; overStage = null"
            @click="ui.openClient(c.id)"
          >
            <div class="flex items-start gap-2.5">
              <ClientAvatar :name="c.company" size="sm" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-white truncate">{{ c.company }}</p>
                <p class="text-xs text-slate-400 truncate">{{ c.name || '—' }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <span class="text-sm font-mono font-semibold text-slate-100">{{ compact(c.value) }}</span>
              <div class="flex items-center gap-1" @click.stop>
                <a v-if="c.phone" :href="whatsappUrl(c.phone)" target="_blank" rel="noopener" class="crm-icon-btn !p-1.5 hover:text-emerald-400" title="WhatsApp">
                  <ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />
                </a>
                <!-- En móvil no hay arrastrar: se cambia la etapa con este selector -->
                <select
                  :value="c.stage" class="xl:hidden bg-slate-950 border border-slate-800 rounded-md text-2xs text-slate-300 px-1 py-1"
                  @change="crm.setClientStage(c.id, $event.target.value)"
                >
                  <option v-for="st in STAGES" :key="st.key" :value="st.key">{{ st.label }}</option>
                </select>
              </div>
            </div>
            <div v-if="c.nextFollowUp && !['won', 'lost'].includes(c.stage)" :class="['flex items-center gap-1 mt-2 text-xs', daysFromToday(c.nextFollowUp) < 0 ? 'text-rose-300' : daysFromToday(c.nextFollowUp) === 0 ? 'text-amber-300' : 'text-slate-500']">
              <CalendarIcon class="w-3.5 h-3.5" />Seguimiento {{ relativeDay(c.nextFollowUp).toLowerCase() }}
            </div>
            <div v-if="c.tags?.length" class="flex flex-wrap gap-1 mt-2">
              <span v-for="t in c.tags" :key="t" class="text-2xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{{ t }}</span>
            </div>
          </div>
          <p v-if="!col.items.length" class="text-xs text-slate-600 text-center py-6 border border-dashed border-slate-800 rounded-xl">Suelta aquí</p>
        </div>
      </div>
    </div>
  </div>
</template>
