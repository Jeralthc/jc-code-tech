<script setup>
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const openIndex = ref(0);

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? -1 : index;
};

const faqs = [
  {
    q: '¿El diagnóstico inicial tiene algún costo o compromiso?',
    a: 'No, es 100% gratuito y sin ningún compromiso. Evaluamos el estado de tus puntos de venta (POS), tus cables de red o los requerimientos de software en Laravel / Vue que necesitas, y te entregamos un diagnóstico claro con una propuesta técnica y económica transparente.'
  },
  {
    q: '¿Prestan servicio presencial en Mérida y soporte remoto a otras ciudades?',
    a: 'Sí. Atendemos presencialmente en Mérida para instalación de cables de red punto a punto, mantenimiento de computadoras comerciales y puntos de venta. Para desarrollo de software web con Laravel y Vue, bases de datos y consultoría, brindamos soporte remoto a nivel nacional e internacional.'
  },
  {
    q: '¿Ofrecen planes de mantenimiento preventivo y soporte mensual?',
    a: 'Sí. Diseñamos planes mensuales a la medida de tu comercio para realizar mantenimiento preventivo periódico, verificación de copias de seguridad automáticas y atención técnica prioritaria cuando ocurra una eventualidad.'
  },
  {
    q: '¿Pueden digitalizar mi inventario si actualmente lo llevo en Excel?',
    a: 'Por supuesto. Extraemos y limpiamos la información de tus productos, la estructuramos en una base de datos relacional segura (MySQL o PostgreSQL) y te desarrollamos un panel web moderno con Laravel y Vue.js para que el stock se actualice en tiempo real.'
  }
];
</script>

<template>
  <section id="faq" class="py-24 bg-slate-950 relative border-t border-slate-800/80">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2 font-mono">
          Preguntas Frecuentes
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Resolviendo tus Dudas
        </h2>
        <p class="mt-4 text-base text-slate-400">
          Respuestas directas a las inquietudes más habituales antes de comenzar.
        </p>
      </div>

      <!-- FAQ Accordions -->
      <div class="space-y-4">
        <div 
          v-for="(faq, idx) in faqs" 
          :key="idx"
          class="service-card rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300"
        >
          <button 
            @click="toggleFaq(idx)"
            class="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
          >
            <span class="font-bold text-base sm:text-lg text-white">
              {{ faq.q }}
            </span>
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300',
                openIndex === idx ? 'bg-cyan-500 text-slate-950 rotate-180' : 'bg-slate-800 text-slate-400'
              ]"
            >
              <ChevronDownIcon class="w-4 h-4" />
            </div>
          </button>

          <div 
            v-show="openIndex === idx"
            class="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/60 font-sans"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
