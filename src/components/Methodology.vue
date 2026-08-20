<script setup>
import { 
  MagnifyingGlassIcon, 
  WrenchScrewdriverIcon, 
  LifebuoyIcon 
} from '@heroicons/vue/24/outline';

const steps = [
  {
    num: '01',
    icon: MagnifyingGlassIcon,
    title: 'Diagnóstico Gratuito',
    desc: 'Evaluamos in-situ o remotamente tus puntos de venta, cables de red o necesidades de software sin ningún costo ni compromiso inicial.'
  },
  {
    num: '02',
    icon: WrenchScrewdriverIcon,
    title: 'Implementación Limpia',
    desc: 'Instalamos, reparamos o programamos bajo estándares seguros, garantizando cero interrupciones en el cobro y atención de tus clientes.'
  },
  {
    num: '03',
    icon: LifebuoyIcon,
    title: 'Soporte & Tranquilidad',
    desc: 'Mantenimiento preventivo, supervisión de copias de seguridad automáticas y canal directo para emergencias.'
  }
];
</script>

<template>
  <section id="metodologia" class="py-20 bg-slate-900/50 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2 font-mono">
          Proceso Transparente
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cómo Trabajamos: 3 Pasos Sencillos
        </h2>
        <p class="mt-4 text-base text-slate-400">
          Sin complicaciones, sin letra chica y con comunicación directa de principio a fin.
        </p>
      </div>

      <!-- 3 Step Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div 
          v-for="(step, idx) in steps" 
          :key="idx"
          class="service-card rounded-2xl p-8 border border-slate-800 flex flex-col justify-between group"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                <component :is="step.icon" class="w-6 h-6" />
              </div>
              <span class="text-3xl font-extrabold font-mono text-slate-700 group-hover:text-cyan-500/30 transition-colors">
                {{ step.num }}
              </span>
            </div>

            <h3 class="text-xl font-bold text-white mb-3">{{ step.title }}</h3>
            <p class="text-sm text-slate-300 leading-relaxed font-sans">
              {{ step.desc }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-cyan-400 font-semibold">
            Fase {{ step.num }} • Garantizada
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
