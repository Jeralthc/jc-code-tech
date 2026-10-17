<script setup>
import { 
  BoltIcon, 
  CircleStackIcon, 
  WifiIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

const pains = [
  {
    icon: BoltIcon,
    title: 'Cajas trabadas en horas pico',
    desc: 'Terminales lentas, cuelgues en el punto de cobro o impresoras térmicas que no imprimen cuando hay fila de clientes.',
    solution: 'Mantenimiento preventivo y soporte rápido',
    color: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/10'
  },
  {
    icon: CircleStackIcon,
    title: 'Caos con inventarios en Excel',
    desc: 'Hojas de cálculo desactualizadas, descuadres de stock y riesgo de perder información valiosa de ventas.',
    solution: 'Control de inventario digital y seguro',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10'
  },
  {
    icon: WifiIcon,
    title: 'Cables dañados o WiFi inestable',
    desc: 'Balanzas, terminales de cobro y computadoras que pierden conexión por cables viejos o señal débil.',
    solution: 'Cableado directo de alta velocidad',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10'
  },
  {
    icon: ClockIcon,
    title: 'Plazos incumplidos o falta de respuesta',
    desc: 'Proveedores que dan fechas irreales, se demoran semanas en atenderte o desaparecen tras cobrar.',
    solution: 'Tiempos honestos y comunicación directa',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10'
  }
];
</script>

<template>
  <section class="py-16 bg-slate-950 relative border-t border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-xl mx-auto mb-10">
        <span class="text-2xs font-semibold text-rose-400 uppercase tracking-widest block mb-1 font-mono">
          Problemas Reales
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ¿Te ha pasado esto en tu negocio?
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-2">
          Fallas técnicas comunes que te hacen perder clientes, ventas y tranquilidad.
        </p>
      </div>

      <!-- 4 Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="(item, idx) in pains" 
          :key="idx"
          class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group hover:bg-slate-900/90"
        >
          <div>
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center mb-3 border transition-transform group-hover:scale-105', item.bg, item.border, item.color]">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-white mb-1.5 leading-snug">
              {{ item.title }}
            </h3>
            <p class="text-xs text-slate-300 leading-relaxed font-sans mb-3">
              {{ item.desc }}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-800/60 text-2xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>✓</span>
            <span>{{ item.solution }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
