<script setup>
import { 
  ArrowRightIcon, 
  MapPinIcon
} from '@heroicons/vue/24/outline';
</script>

<template>
  <section class="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
    <!-- Ambient Lighting Glows -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[380px] bg-gradient-to-tr from-cyan-600/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

    <div class="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
      
      <!-- Location & Trust Pill -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-medium text-slate-300 shadow-sm mb-6">
        <MapPinIcon class="w-3.5 h-3.5 text-cyan-400" />
        <span>Mérida, Venezuela</span>
        <span class="text-slate-600">•</span>
        <span class="text-cyan-300 font-semibold">Soporte TI &amp; Software Web</span>
      </div>

      <!-- Main Headline (Tight, balanced, 2 lines max) -->
      <h1 class="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
        Software que hace rentable tu negocio. <br class="hidden sm:inline" />
        <span class="gradient-text-cyan">Soporte que protege tus ventas.</span>
      </h1>

      <!-- Clear, engaging Subtitle (2 clean lines) -->
      <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
        Desarrollo web a medida (costos, citas y reportes en Laravel + Vue) y soporte técnico para puntos de venta (<strong class="text-white font-semibold">Stellar POS</strong>) y redes comerciales en Mérida.
      </p>

      <!-- Clean Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <a 
          href="#contacto"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all"
        >
          <span>Diagnóstico Gratuito</span>
          <ArrowRightIcon class="w-4 h-4" />
        </a>

        <a 
          href="#servicios" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          Ver Soluciones
        </a>
      </div>

      <!-- Minimal Inline Trust Badges (Replaces the 3 bulky cards) -->
      <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-mono">
        <span class="inline-flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Stellar POS &amp; Cajas
        </span>
        <span class="hidden sm:inline text-slate-700">&bull;</span>
        <span class="inline-flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Costos, Citas &amp; Reportes
        </span>
        <span class="hidden sm:inline text-slate-700">&bull;</span>
        <span class="inline-flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          Presencial en Mérida &amp; Remoto
        </span>
      </div>

    </div>
  </section>
</template>
