<script setup>
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const openIndex = ref(-1);

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? -1 : index;
};

const faqs = [
  {
    q: '¿Cuánto tiempo toma la entrega de un proyecto o servicio?',
    a: 'Somos 100% transparentes con los tiempos: una revisión de equipos o diagnóstico de cajas y red se realiza en 24 a 48 horas. Una instalación de puntos de red suele tomar de 1 a 3 días según la cantidad de terminales. Un sistema web a medida (como calculadora de costos o control de inventarios) toma entre 2 y 4 semanas, con entregas progresivas por etapas para que pruebes avances funcionales desde la primera semana. Siempre acordamos un cronograma formal y realista antes de empezar.'
  },
  {
    q: '¿Brindan soporte presencial a comercios con Stellar POS y cajas en Mérida?',
    a: 'Sí. Atendemos presencialmente en locales comerciales de Mérida para resolver bloqueos de caja en horas pico, fallas en el software Stellar POS, configuración de lectoras láser de códigos, impresoras térmicas de tickets y balanzas.'
  },
  {
    q: '¿El diagnóstico inicial tiene algún costo o compromiso?',
    a: 'No, es 100% gratuito. Evaluamos el estado de tus puntos de venta, tus cables de red o lo que deseas construir para tu negocio, y te entregamos una propuesta clara con tiempos reales y presupuesto cerrado, sin costos ocultos.'
  },
  {
    q: '¿Pueden digitalizar mi negocio si actualmente llevo todo en hojas de Excel?',
    a: 'Totalmente. Extraemos y ordenamos tus productos, proveedores y precios, y te construimos un sistema web privado y fácil de usar desde cualquier computadora o celular, con copias de seguridad automáticas para que nunca pierdas datos por un archivo dañado.'
  },
  {
    q: '¿Ofrecen planes de mantenimiento preventivo y soporte mensual?',
    a: 'Sí. Para negocios que necesitan continuidad absoluta y no pueden detener sus cajas de venta, contamos con planes mensuales de póliza técnica: mantenimiento preventivo programado, verificación de respaldos y canal prioritario para emergencias.'
  }
];
</script>

<template>
  <section id="faq" class="py-14 sm:py-20 bg-slate-950 relative border-t border-slate-800/80">
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
