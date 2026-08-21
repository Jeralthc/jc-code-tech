<script setup>
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  ShieldCheckIcon, 
  WrenchScrewdriverIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';
</script>

<template>
  <section class="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
    <!-- Ambient Lighting Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/20 to-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10">
      
      <!-- Location & Trust Pill -->
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-medium text-slate-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-8">
        <MapPinIcon class="w-4 h-4 text-cyan-400" />
        <span>Mérida, Venezuela</span>
        <span class="text-slate-600">•</span>
        <span class="text-cyan-300 font-semibold">Atención Presencial &amp; Remota</span>
      </div>

      <!-- Main Headline (Optimized for SEO H1 & SEM Conversion) -->
      <h1 class="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.14] mb-6">
        Infraestructura que <span class="gradient-text-cyan">no se cae</span>. <br class="hidden sm:inline" />
        Software a la medida de tu comercio.
      </h1>

      <!-- Clear, engaging Subtitle (Pleasant to read, not heavy) -->
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
        Cuidamos el soporte técnico de tus puntos de venta (POS) y conexiones de red, y desarrollamos aplicaciones web con Laravel y Vue.js para que tu negocio opere seguro y sin pausas.
      </p>

      <!-- Clean Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
        <a 
          href="#contacto"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <span>Solicitar Diagnóstico Gratuito</span>
          <ArrowRightIcon class="w-5 h-5" />
        </a>

        <a 
          href="#servicios" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 px-8 py-4 text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 backdrop-blur-md"
        >
          Conocer Soluciones
        </a>
      </div>

      <!-- Key Trust Pillars Row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <CheckCircleIcon class="w-6 h-6 text-cyan-400 shrink-0" />
          <div class="text-xs">
            <strong class="text-white block font-semibold">Cero Caídas en Cajas</strong>
            <span class="text-slate-400">Puntos de venta siempre listos</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <ShieldCheckIcon class="w-6 h-6 text-emerald-400 shrink-0" />
          <div class="text-xs">
            <strong class="text-white block font-semibold">Ciberseguridad &amp; Backups</strong>
            <span class="text-slate-400">Datos protegidos al 100%</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3">
          <WrenchScrewdriverIcon class="w-6 h-6 text-blue-400 shrink-0" />
          <div class="text-xs">
            <strong class="text-white block font-semibold">Soporte Directo L1-L3</strong>
            <span class="text-slate-400">Atención rápida y confiable</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
