<script setup>
import { ref, computed, onMounted } from 'vue';
import { CheckIcon, EyeSlashIcon, TrashIcon, ArrowPathIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import StatusBadge from '../ui/StatusBadge.vue';
import EmptyState from '../ui/EmptyState.vue';
import { useUi } from '../../../crm/ui';
import { supabase } from '../../../crm/supabase';

// Moderación de las opiniones que los visitantes dejan en la web pública.
const ui = useUi();
const items = ref([]);
const loading = ref(true);
const filter = ref('pending');

const load = async () => {
  loading.value = true;
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) ui.toast('No se pudieron cargar las opiniones', 'error');
  items.value = data || [];
  loading.value = false;
};
onMounted(load);

const rows = computed(() => items.value.filter(r => filter.value === 'all' || (filter.value === 'pending' ? !r.approved : r.approved)));
const pendingCount = computed(() => items.value.filter(r => !r.approved).length);

const setApproved = async (r, approved) => {
  const { error } = await supabase.from('testimonials').update({ approved }).eq('id', r.id);
  if (error) { ui.toast('No se pudo actualizar', 'error'); return; }
  r.approved = approved;
  ui.toast(approved ? 'Opinión publicada en tu web' : 'Opinión ocultada');
};
const remove = async (r) => {
  if (!(await ui.confirm({ title: '¿Eliminar esta opinión?', message: `De ${r.name}. No se puede deshacer.`, confirmLabel: 'Eliminar', danger: true }))) return;
  const { error } = await supabase.from('testimonials').delete().eq('id', r.id);
  if (error) { ui.toast('No se pudo eliminar', 'error'); return; }
  items.value = items.value.filter(x => x.id !== r.id);
  ui.toast('Opinión eliminada');
};
const date = (iso) => new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<template>
  <div class="space-y-5 max-w-4xl">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">Opiniones de la web</h1>
        <p class="text-sm text-slate-400 mt-1">Aprueba los comentarios que quieres mostrar en tu página</p>
      </div>
      <button class="crm-btn-secondary" @click="load"><ArrowPathIcon class="w-4 h-4" />Actualizar</button>
    </div>

    <div class="flex gap-2">
      <button :class="['crm-chip', filter === 'pending' && 'crm-chip-active']" @click="filter = 'pending'">Pendientes · {{ pendingCount }}</button>
      <button :class="['crm-chip', filter === 'approved' && 'crm-chip-active']" @click="filter = 'approved'">Publicadas · {{ items.length - pendingCount }}</button>
      <button :class="['crm-chip', filter === 'all' && 'crm-chip-active']" @click="filter = 'all'">Todas</button>
    </div>

    <div v-if="loading" class="crm-card p-10 text-center text-slate-400"><ArrowPathIcon class="w-6 h-6 animate-spin mx-auto" /></div>
    <div v-else-if="!rows.length" class="crm-card">
      <EmptyState :icon="ChatBubbleLeftRightIcon" :title="filter === 'pending' ? 'No hay opiniones por revisar' : 'Sin opiniones'" text="Cuando un cliente deje su comentario en tu web, aparecerá aquí para que lo apruebes." />
    </div>
    <ul v-else class="space-y-3">
      <li v-for="r in rows" :key="r.id" class="crm-card p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-white">{{ r.name }} <span class="text-slate-400 font-normal">· {{ r.business || 'Sin negocio' }}</span></p>
            <p class="text-xs text-slate-500 mt-0.5">{{ r.service }} · {{ date(r.created_at) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex text-amber-400"><StarIcon v-for="s in r.rating" :key="s" class="w-4 h-4" /></div>
            <StatusBadge :label="r.approved ? 'Publicada' : 'Pendiente'" :tone="r.approved ? 'emerald' : 'amber'" />
          </div>
        </div>
        <p class="text-sm text-slate-300 mt-3 leading-relaxed whitespace-pre-line">“{{ r.comment }}”</p>
        <div class="flex flex-wrap gap-2 mt-4">
          <button v-if="!r.approved" class="crm-btn-primary !py-2 text-xs" @click="setApproved(r, true)"><CheckIcon class="w-4 h-4" />Aprobar y publicar</button>
          <button v-else class="crm-btn-secondary !py-2 text-xs" @click="setApproved(r, false)"><EyeSlashIcon class="w-4 h-4" />Ocultar de la web</button>
          <button class="crm-btn-ghost !py-2 text-xs hover:!text-rose-300" @click="remove(r)"><TrashIcon class="w-4 h-4" />Eliminar</button>
        </div>
      </li>
    </ul>
  </div>
</template>
