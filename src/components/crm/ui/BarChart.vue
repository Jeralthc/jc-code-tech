<script setup>
import { ref, computed } from 'vue';

// Gráfico de columnas de una sola serie con tooltip al pasar el mouse.
const props = defineProps({
  data: { type: Array, required: true }, // [{ label, value, highlight? }]
  format: { type: Function, default: (v) => v },
  height: { type: Number, default: 180 },
  goal: { type: Number, default: 0 }
});

const hover = ref(null);
const max = computed(() => Math.max(props.goal, ...props.data.map(d => d.value), 1) * 1.1);
const ticks = computed(() => [0, 0.5, 1].map(f => max.value / 1.1 * f));
const pct = (v) => `${(v / max.value) * 100}%`;
</script>

<template>
  <div class="relative select-none">
    <div class="relative flex" :style="{ height: height + 'px' }">
      <!-- Grilla recesiva -->
      <div class="absolute inset-0 pointer-events-none">
        <div v-for="t in ticks" :key="t" class="absolute left-0 right-0 border-t border-slate-800/70" :style="{ bottom: pct(t) }">
          <span class="absolute -top-2.5 left-0 text-2xs text-slate-500 bg-slate-900/80 pr-1 font-mono">{{ format(t) }}</span>
        </div>
        <div v-if="goal" class="absolute left-0 right-0 border-t border-dashed border-emerald-500/50" :style="{ bottom: pct(goal) }">
          <span class="absolute -top-2.5 right-0 text-2xs text-emerald-300 bg-slate-900/80 pl-1">Meta {{ format(goal) }}</span>
        </div>
      </div>
      <!-- Columnas -->
      <div class="relative flex-1 flex items-end gap-2 sm:gap-3 pl-12">
        <div
          v-for="(d, i) in data" :key="d.label"
          class="relative flex-1 h-full flex items-end justify-center cursor-default"
          @mouseenter="hover = i" @mouseleave="hover = null"
        >
          <div
            :class="['w-full max-w-12 rounded-t-[4px] transition-all duration-300', d.highlight ? 'bg-cyan-400' : 'bg-cyan-500/45', hover === i && 'bg-cyan-300']"
            :style="{ height: d.value ? pct(d.value) : '2px' }"
          ></div>
          <div
            v-if="hover === i"
            class="absolute z-10 bottom-full mb-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs whitespace-nowrap shadow-xl"
            :style="{ bottom: `calc(${d.value ? pct(d.value) : '0%'} + 8px)` }"
          >
            <div class="text-slate-400">{{ d.label }}</div>
            <div class="font-semibold text-white font-mono">{{ format(d.value) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 sm:gap-3 pl-12 mt-2">
      <div v-for="d in data" :key="d.label" :class="['flex-1 text-center text-xs capitalize', d.highlight ? 'text-white font-semibold' : 'text-slate-500']">{{ d.label }}</div>
    </div>
  </div>
</template>
