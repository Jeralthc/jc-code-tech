<script setup>
import { computed } from 'vue';
import { initials } from '../../../crm/utils';

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: String, default: 'md' } // sm | md | lg
});

// Color estable por nombre para que cada cliente se reconozca a simple vista.
const palettes = [
  'from-cyan-500/30 to-blue-600/30 text-cyan-200 ring-cyan-500/30',
  'from-violet-500/30 to-fuchsia-600/30 text-violet-200 ring-violet-500/30',
  'from-emerald-500/30 to-teal-600/30 text-emerald-200 ring-emerald-500/30',
  'from-amber-500/30 to-orange-600/30 text-amber-200 ring-amber-500/30',
  'from-rose-500/30 to-pink-600/30 text-rose-200 ring-rose-500/30',
  'from-sky-500/30 to-indigo-600/30 text-sky-200 ring-sky-500/30'
];
const palette = computed(() => {
  const hash = [...props.name].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
});
const sizes = { sm: 'w-8 h-8 text-xs rounded-lg', md: 'w-10 h-10 text-sm rounded-xl', lg: 'w-14 h-14 text-lg rounded-2xl' };
</script>

<template>
  <div :class="['shrink-0 flex items-center justify-center font-bold bg-gradient-to-br ring-1', palette, sizes[size]]">
    {{ initials(name) }}
  </div>
</template>
