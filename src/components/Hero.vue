<script setup>
import { 
  ArrowDownIcon, 
  MapPinIcon,
  CodeBracketSquareIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  ServerIcon
} from '@heroicons/vue/24/outline';

const pillars = [
  {
    icon: CodeBracketSquareIcon,
    title: 'Desarrollo Web Full-Stack',
    desc: 'Sistemas a medida, calculadoras operativas y portales en la nube.',
    color: 'text-cyan-400'
  },
  {
    icon: ComputerDesktopIcon,
    title: 'Soporte Técnico & POS',
    desc: 'Mantenimiento preventivo, cajas registradoras y Stellar POS.',
    color: 'text-amber-400'
  },
  {
    icon: CircleStackIcon,
    title: 'Bases de Datos Robustas',
    desc: 'Diseño, optimización y respaldos en MySQL y SQL Server.',
    color: 'text-emerald-400'
  },
  {
    icon: ServerIcon,
    title: 'Redes Comerciales',
    desc: 'Cableado físico punto a punto para balanzas, cajas y switches.',
    color: 'text-blue-400'
  }
];
</script>

<template>
  <section class="relative pt-28 pb-14 sm:pt-32 sm:pb-16 overflow-hidden">
    <!-- Ambient Lighting Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-gradient-to-tr from-cyan-600/15 to-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10">
      
      <!-- Location & Identity Pill -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-medium text-slate-300 shadow-sm mb-6">
        <MapPinIcon class="w-3.5 h-3.5 text-cyan-400" />
        <span>Mérida, Venezuela</span>
        <span class="text-slate-600">•</span>
        <span class="text-cyan-300 font-semibold">Consultor TI &amp; Desarrollador Full-Stack</span>
      </div>

      <!-- Main Headline: Understandable for any client -->
      <h1 class="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
        Desarrollo Web Full-Stack <br class="hidden sm:inline" />
        <span class="gradient-text-cyan">&amp; Soporte Técnico TI para tu Negocio</span>
      </h1>

      <!-- Clear Presentation: Who I am, what I solve, zero framework jargon -->
      <p class="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
        Soy <strong class="text-white font-semibold">Jeralth Contreras</strong>. Construyo software web a medida para optimizar las operaciones de tu empresa (sistemas de gestión, calculadoras de costos, portales y reportes), administro bases de datos (<strong class="text-white font-semibold">MySQL &amp; SQL Server</strong>) y brindo soporte técnico integral a puntos de venta (<strong class="text-cyan-300 font-semibold">Stellar POS</strong>) y redes comerciales en Mérida.
      </p>

      <!-- Action Buttons: Explore & Read first (No aggressive sales CTA) -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
        <a 
          href="#proyectos"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
        >
          <span>Ver Proyectos Desarrollados</span>
          <ArrowDownIcon class="w-4 h-4" />
        </a>

        <a 
          href="#servicios" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          Servicios que Ofrezco
        </a>
      </div>

      <!-- 4 Pillars Grid: Direct, visible, professional overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left max-w-4xl mx-auto">
        <div 
          v-for="(pillar, idx) in pillars" 
          :key="idx"
          class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <component :is="pillar.icon" :class="['w-4 h-4 shrink-0', pillar.color]" />
            <h4 class="text-xs sm:text-sm font-bold text-white truncate">
              {{ pillar.title }}
            </h4>
          </div>
          <p class="text-2xs text-slate-400 leading-snug">
            {{ pillar.desc }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
