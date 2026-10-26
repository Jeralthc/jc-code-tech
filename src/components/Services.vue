<script setup>
import {
  CodeBracketSquareIcon,
  CalendarDaysIcon,
  ComputerDesktopIcon,
  ServerIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
import { WHATSAPP_NUMBER } from '../siteConfig';

// Cada servicio parte del problema real que el cliente reconoce.
const services = [
  {
    id: 'software',
    title: 'Sistemas web a medida',
    problem: '¿Todo en Excel, descuadres y datos que se pierden?',
    desc: 'Costos, inventario, cotizaciones y reportes en un sistema propio, desde el celular o la PC.',
    icon: CodeBracketSquareIcon,
    color: 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/30'
  },
  {
    id: 'citas',
    title: 'Citas, turnos y reservas',
    problem: '¿Pasas el día respondiendo WhatsApp para agendar?',
    desc: 'Tus clientes reservan solos según tus horarios. Menos mensajes repetitivos y cero cruces.',
    icon: CalendarDaysIcon,
    color: 'text-amber-400 bg-amber-500/10 ring-amber-500/30'
  },
  {
    id: 'pos',
    title: 'Soporte a cajas (Stellar POS)',
    problem: '¿Cajas trabadas o impresoras que fallan con fila de clientes?',
    desc: 'Atención preventiva y de emergencia en tu local en Mérida: software, impresoras, lectores y balanzas.',
    icon: ComputerDesktopIcon,
    color: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30'
  },
  {
    id: 'redes',
    title: 'Redes y cableado',
    problem: '¿Equipos que pierden conexión o WiFi inestable?',
    desc: 'Cableado directo y estable para cajas, balanzas, impresoras y computadoras.',
    icon: ServerIcon,
    color: 'text-blue-400 bg-blue-500/10 ring-blue-500/30'
  }
];

const steps = [
  { title: 'Diagnóstico gratis', desc: 'Reviso tu caso sin costo ni compromiso.' },
  { title: 'Presupuesto cerrado', desc: 'Precio y plazo claros antes de empezar.' },
  { title: 'Entrega y soporte', desc: 'Garantía y canal directo para emergencias.' }
];

const ask = (s) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola Jeralth! 👋 Me interesa el servicio de ${s.title.toLowerCase()} para mi negocio.`)}`;
</script>

<template>
  <section id="servicios" class="py-14 sm:py-20 border-t border-slate-800/80">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-xs font-semibold uppercase tracking-widest text-cyan-400">Servicios</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">¿En qué te puedo ayudar?</h2>
      </div>

      <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <article v-for="s in services" :key="s.id" class="service-card rounded-2xl p-4 sm:p-5 flex flex-col">
          <div class="flex items-center gap-3 lg:flex-col lg:items-start">
            <div :class="['w-10 h-10 shrink-0 rounded-xl ring-1 flex items-center justify-center', s.color]">
              <component :is="s.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-white leading-tight">{{ s.title }}</h3>
          </div>
          <p class="mt-2 lg:mt-1 text-sm font-medium text-amber-200/90">{{ s.problem }}</p>
          <p class="mt-2 text-sm text-slate-400 leading-relaxed flex-1">{{ s.desc }}</p>
          <a :href="ask(s)" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            Consultar <ArrowRightIcon class="w-4 h-4" />
          </a>
        </article>
      </div>

      <!-- Cómo trabajo -->
      <ol class="mt-8 grid sm:grid-cols-3 gap-3">
        <li v-for="(st, i) in steps" :key="st.title" class="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
          <span class="w-8 h-8 shrink-0 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30 text-cyan-300 font-bold text-sm flex items-center justify-center">{{ i + 1 }}</span>
          <div>
            <p class="text-sm font-semibold text-white">{{ st.title }}</p>
            <p class="text-xs text-slate-400">{{ st.desc }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
