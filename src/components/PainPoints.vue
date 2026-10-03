<script setup>
import { 
  BoltIcon, 
  CircleStackIcon, 
  WifiIcon 
} from '@heroicons/vue/24/outline';

const pains = [
  {
    icon: BoltIcon,
    title: 'Cajas trabadas en horas pico',
    desc: 'Equipos lentos, cuelgues en Stellar POS o impresoras que no responden cuando hay fila de clientes.',
    solution: 'Mantenimiento preventivo y soporte rápido',
    color: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/10'
  },
  {
    icon: CircleStackIcon,
    title: 'Caos con inventarios en Excel',
    desc: 'Hojas de cálculo desactualizadas, descuadres de stock y riesgo de perder toda la información.',
    solution: 'Bases de datos relacionales y software web',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10'
  },
  {
    icon: WifiIcon,
    title: 'Cables dañados o WiFi inestable',
    desc: 'Balanzas, terminales de cobro y puntos de venta que se desconectan por cables defectuosos.',
    solution: 'Puntos de red directos y garantizados',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10'
  }
];
</script>

<template>
  <section class="py-14 bg-slate-950 relative border-t border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header: Super Compact -->
      <div class="text-center max-w-xl mx-auto mb-8">
        <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          ¿Te ha pasado esto en tu negocio?
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          Pequeñas fallas técnicas que te hacen perder ventas y tiempo valioso.
        </p>
      </div>

      <!-- 3 Lean Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="(item, idx) in pains" 
          :key="idx"
          class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
        >
          <div>
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center mb-3 border', item.bg, item.border, item.color]">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-sm sm:text-base font-bold text-white mb-1.5">
              {{ item.title }}
            </h3>
            <p class="text-xs text-slate-300 leading-relaxed font-sans mb-3">
              {{ item.desc }}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-800/60 text-2xs font-semibold text-cyan-400">
            ✓ {{ item.solution }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
