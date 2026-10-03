<script setup>
import { 
  MagnifyingGlassIcon, 
  WrenchScrewdriverIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline';

const steps = [
  {
    num: '01',
    icon: MagnifyingGlassIcon,
    title: 'Diagnóstico Gratuito',
    desc: 'Evaluamos tus equipos, cables o requerimientos de software sin ningún costo ni compromiso.'
  },
  {
    num: '02',
    icon: WrenchScrewdriverIcon,
    title: 'Solución a Medida',
    desc: 'Reparamos, instalamos o programamos de forma limpia, sin frenar la atención de tus clientes.'
  },
  {
    num: '03',
    icon: ShieldCheckIcon,
    title: 'Soporte Continuo',
    desc: 'Garantía sobre el trabajo realizado, copias de seguridad y canal directo para emergencias.'
  }
];
</script>

<template>
  <section id="metodologia" class="py-14 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-xl mx-auto mb-10">
        <span class="text-2xs font-semibold text-cyan-400 uppercase tracking-widest block mb-1 font-mono">
          Proceso Simple
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cómo Trabajamos
        </h2>
      </div>

      <!-- 3 Steps Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          v-for="(step, idx) in steps" 
          :key="idx"
          class="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-4"
        >
          <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-mono font-bold text-sm">
            {{ step.num }}
          </div>
          <div>
            <h3 class="text-base font-bold text-white mb-1">{{ step.title }}</h3>
            <p class="text-xs text-slate-300 leading-relaxed font-sans">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
