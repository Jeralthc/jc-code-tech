<script setup>
import { ref, computed } from 'vue';

// Columnas agrupadas de dos series (cobrado vs. gastado) con la utilidad en el tooltip.
const props = defineProps({
  data: { type: Array, required: true }, // [{ label, income, expense, highlight? }]
  format: { type: Function, default: (v) => v },
  height: { type: Number, default: 180 }
});

const hover = ref(null);
const max = computed(() => Math.max(...props.data.flatMap(d => [d.income, d.expense]), 1) * 1.1);
const ticks = computed(() => [0, 0.5, 1].map(f => max.value / 1.1 * f));
const pct = (v) => `${(v / max.value) * 100}%`;
</script>

<template>
  <div class="relative select-none">
    <div class="relative flex" :style="{ height: height + 'px' }">
      <div class="absolute inset-0 pointer-events-none">
        <div v-for="t in ticks" :key="t" class="absolute left-0 right-0 border-t border-slate-800/70" :style="{ bottom: pct(t) }">
          <span class="absolute -top-2.5 left-0 text-2xs text-slate-500 bg-slate-900/80 pr-1 font-mono">{{ format(t) }}</span>
        </div>
      </div>
      <div class="relative flex-1 flex items-end gap-2 sm:gap-4 pl-12">
        <div
          v-for="(d, i) in data" :key="d.label"
          class="relative flex-1 h-full flex items-end justify-center gap-1 cursor-default"
          @mouseenter="hover = i" @mouseleave="hover = null"
        >
          <div :class="['w-full max-w-5 rounded-t-[4px] transition-all duration-300', d.highlight || hover === i ? 'bg-emerald-400' : 'bg-emerald-500/50']" :style="{ height: d.income ? pct(d.income) : '2px' }"></div>
          <div :class="['w-full max-w-5 rounded-t-[4px] transition-all duration-300', d.highlight || hover === i ? 'bg-rose-400' : 'bg-rose-500/45']" :style="{ height: d.expense ? pct(d.expense) : '2px' }"></div>
          <div
            v-if="hover === i"
            class="absolute z-10 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs whitespace-nowrap shadow-xl space-y-0.5"
            :style="{ bottom: `calc(${pct(Math.max(d.income, d.expense))} + 8px)` }"
          >
            <div class="text-slate-400 capitalize">{{ d.label }}</div>
            <div class="flex justify-between gap-4"><span class="text-emerald-300">Cobrado</span><span class="font-mono text-white">{{ format(d.income) }}</span></div>
            <div class="flex justify-between gap-4"><span class="text-rose-300">Gastos</span><span class="font-mono text-white">{{ format(d.expense) }}</span></div>
            <div class="flex justify-between gap-4 pt-0.5 border-t border-slate-700"><span class="text-slate-300">Utilidad</span><span :class="['font-mono font-semibold', d.income - d.expense >= 0 ? 'text-cyan-300' : 'text-rose-300']">{{ format(d.income - d.expense) }}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 sm:gap-4 pl-12 mt-2">
      <div v-for="d in data" :key="d.label" :class="['flex-1 text-center text-xs capitalize', d.highlight ? 'text-white font-semibold' : 'text-slate-500']">{{ d.label }}</div>
    </div>
  </div>
</template>
