<script setup>
import { ref } from 'vue';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const openIndex = ref(0);

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? -1 : index;
};

const faqs = [
  {
    q: '¿Cómo funciona la inspección y diagnóstico inicial gratuito?',
    a: 'Realizamos una sesión de evaluación (in-situ en tu local o remota) donde testeamos la estabilidad de tus puntos de cobro (POS), el cableado de red y los requerimientos de software que necesitas. Te entregamos un diagnóstico claro y un presupuesto transparente sin costo.'
  },
  {
    q: '¿Qué incluye la atención de soporte técnico L1, L2 y L3?',
    a: 'Cubre desde la resolución inmediata de problemas de usuario e impresoras (L1), configuración de sistemas operativos, redes y bases de datos (L2), hasta diagnóstico profundo de hardware, fallas eléctricas y sustitución de componentes (L3).'
  },
  {
    q: '¿Pueden digitalizar mi inventario si actualmente está en hojas de cálculo desordenadas?',
    a: 'Sí. Diseñamos la base de datos relacional (MySQL o PostgreSQL), limpiamos y normalizamos los datos de tus productos y te entregamos un sistema web moderno en Vue.js para que las entradas y salidas se actualicen en tiempo real sin descuadres.'
  },
  {
    q: '¿Cómo garantizan la continuidad y seguridad de mis cobros?',
    a: 'Implementamos redes LAN segmentadas, configuraciones de respaldo automático para tu facturación y mantenimiento preventivo periódico de tus equipos para prevenir fallas antes de que ocurran.'
  }
];
</script>

<template>
  <section id="faq" class="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
          <QuestionMarkCircleIcon class="w-4 h-4" />
          <span>// 06. BASE DE CONOCIMIENTOS</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Preguntas Frecuentes &amp; SLA
        </h2>
        <p class="mt-4 text-base text-slate-400">
          Respuestas técnicas directas sobre cómo trabajamos y qué garantías ofrecemos.
        </p>
      </div>

      <!-- Compact FAQ Accordion -->
      <div class="space-y-4 font-mono text-xs">
        <div 
          v-for="(faq, idx) in faqs" 
          :key="idx"
          class="bento-card rounded-2xl overflow-hidden border border-slate-800/80 transition-all duration-300"
        >
          <button 
            @click="toggleFaq(idx)"
            class="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
          >
            <div class="flex items-center gap-3">
              <span class="text-cyan-400 font-bold">0{{ idx + 1 }}.</span>
              <span class="text-white font-sans text-sm sm:text-base font-bold">{{ faq.q }}</span>
            </div>
            <div 
              :class="[
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300',
                openIndex === idx ? 'bg-cyan-500 text-slate-950 rotate-180 font-bold' : 'bg-slate-900 text-slate-400'
              ]"
            >
              <ChevronDownIcon class="w-4 h-4" />
            </div>
          </button>

          <div 
            v-show="openIndex === idx"
            class="px-5 pb-5 pt-1 text-sm text-slate-300 font-sans leading-relaxed border-t border-slate-800/60"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
