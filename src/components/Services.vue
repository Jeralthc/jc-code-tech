<script setup>
import { 
  CalendarDaysIcon, 
  ComputerDesktopIcon, 
  ServerIcon, 
  CircleStackIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';

const solutions = [
  {
    id: 'software',
    title: 'Sistemas Web: Citas & Mesa de Ayuda',
    subtitle: 'Automatización a Medida',
    desc: 'Plataformas reactivas para agendar citas 24/7 y mesas de ayuda internas (Helpdesk) para registrar incidencias de tu equipo sin perder tiempo en chats.',
    target: 'Clínicas, consultorios, talleres y pymes',
    stack: ['Laravel 11', 'Vue.js 3', 'MySQL / PostgreSQL'],
    icon: CalendarDaysIcon,
    accent: 'cyan',
    badgeClass: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30'
  },
  {
    id: 'pos',
    title: 'Soporte Stellar POS & Cajas',
    subtitle: 'Continuidad de Cobro',
    desc: 'Atención técnica preventiva y correctiva para negocios que usan Stellar POS. Solución rápida a bloqueos de caja, fallas de impresión y base de datos local.',
    target: 'Bodegones, supermercados y farmacias',
    stack: ['Stellar POS', 'Impresoras Térmicas', 'Hardware POS'],
    icon: ComputerDesktopIcon,
    accent: 'amber',
    badgeClass: 'text-amber-400 bg-amber-950/80 border-amber-500/30'
  },
  {
    id: 'redes',
    title: 'Puntos de Red & Cableado Comercial',
    subtitle: 'Conectividad sin Caídas',
    desc: 'Instalación y sustitución de cables de red punto a punto. Conexión directa y estable desde switch/router hasta tus balanzas, cajas y computadoras.',
    target: 'Comercios con fallas o caídas de WiFi',
    stack: ['Cableado Estructurado', 'Punto a Punto', 'RJ45'],
    icon: ServerIcon,
    accent: 'blue',
    badgeClass: 'text-blue-400 bg-blue-950/80 border-blue-500/30'
  },
  {
    id: 'datos',
    title: 'Inventarios & Bases de Datos Seguras',
    subtitle: 'Adiós al Caos de Excel',
    desc: 'Digitalizamos y organizamos tu stock en bases de datos relacionales robustas, con control estricto de usuarios y copias de seguridad automáticas.',
    target: 'Comercios que superaron las hojas de cálculo',
    stack: ['PostgreSQL', 'MySQL', 'Copias Automáticas'],
    icon: CircleStackIcon,
    accent: 'emerald',
    badgeClass: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30'
  }
];
</script>

<template>
  <section id="servicios" class="py-20 bg-slate-900/40 relative border-t border-slate-800/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header: Direct & Concise -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          <SparklesIcon class="w-3.5 h-3.5" />
          <span>Soluciones &amp; Proyectos</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lo que Hacemos por tu Negocio
        </h2>
        <p class="mt-3 text-sm sm:text-base text-slate-400">
          Sin tecnicismos innecesarios: resolvemos fallas en tu punto de venta y creamos el software que tu operación necesita.
        </p>
      </div>

      <!-- Solutions Grid (4 Compact Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div 
          v-for="item in solutions" 
          :key="item.id"
          class="service-card rounded-2xl p-6 sm:p-7 border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
        >
          <div>
            <!-- Top Row: Icon + Badge -->
            <div class="flex items-center justify-between mb-4">
              <div class="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <span :class="['text-2xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border', item.badgeClass]">
                {{ item.subtitle }}
              </span>
            </div>

            <!-- Title & Pitch -->
            <h3 class="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-normal">
              {{ item.desc }}
            </p>

            <!-- Target Audience Line -->
            <div class="text-2xs text-slate-400 mb-4 flex items-center gap-1.5">
              <span class="text-cyan-400 font-semibold">Ideal para:</span>
              <span>{{ item.target }}</span>
            </div>
          </div>

          <!-- Bottom: Tech Pills & Quick CTA -->
          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tech in item.stack" 
                :key="tech"
                class="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-3xs font-mono text-slate-400"
              >
                {{ tech }}
              </span>
            </div>

            <a 
              href="#contacto"
              class="shrink-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Consultar</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Compact Trust Banner -->
      <div class="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
        <div>
          <h4 class="text-base sm:text-lg font-bold text-white">
            ¿Tienes una urgencia en caja o una idea de software?
          </h4>
          <p class="text-xs sm:text-sm text-slate-400">
            Realizamos una evaluación técnica inicial sin costo ni compromiso.
          </p>
        </div>
        <a 
          href="#contacto"
          class="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
        >
          Solicitar Evaluación
        </a>
      </div>

    </div>
  </section>
</template>
